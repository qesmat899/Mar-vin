// Freitext verstehen, ohne KI (läuft im Browser und auf dem Server).
// Ziel: lieber etwas nicht erkennen als etwas falsch erkennen. Eine echte Abneigung („kein Oud“, „Oud geht gar nicht“)
// wird zum harten Ausschluss; eine Gradangabe („nicht zu süß“, „etwas weniger frisch“) nur zu einer weichen Grenze.
//
// Vorgehen:
// 1. Text in Satzteile teilen (Satzzeichen, „aber“, „jedoch“, „sondern“, „doch“). Eine Verneinung wirkt nur im eigenen Satzteil.
// 2. Im Satzteil: Gradwörter („nicht zu“, „weniger“, „leicht“, „sehr“) vor einem Merkmalswort → weiche Vorgabe.
// 3. Notengruppen (Vanille, Oud, Zitrus …): Verneinung davor („kein“, „ohne“, „weder … noch“) oder danach
//    („geht gar nicht“, „mag ich nicht“) → mag_nicht, sonst → mag.
// 4. Anlass, Jahreszeit, Stärke und Stilrichtung aus einfachen Schlüsselwörtern.

import { NOTEN_GRUPPEN, gruppeVonWort } from './lexikon.js';

const norm = (s) => String(s || '').toLowerCase().normalize('NFC');

// Merkmalswörter → Duftdimension (weiche Vorgaben). Nur Stämme, die eindeutig sind.
const MERKMAL = [
  [/^s(ü|ue)(ß|ss)/, 'suesse'],
  [/^frisch/, 'frische'],
  [/^warm|^wärm/, 'waerme'],
  [/^rauchig/, 'rauchig'],
  [/^holzig/, 'holzig'],
  [/^würzig|^wuerzig/, 'wuerzig'],
  [/^blumig/, 'blumig'],
  [/^fruchtig/, 'fruchtig'],
  [/^pudrig/, 'pudrig'],
  [/^cremig/, 'cremig'],
  [/^sauber/, 'sauber'],
];
const merkmalVon = (w) => (MERKMAL.find(([re]) => re.test(w)) || [])[1] || null;
// Klare Ablehnung eines Merkmals („Blumiges geht gar nicht“, „ich hasse Rauchiges“, „mag keine fruchtigen Düfte“)
// schließt die passende Notengruppe hart aus. Frisch, warm und sauber haben keine Notengruppe: dort bleibt es weich.
const MERKMAL_GRUPPE = { blumig: 'blumig', fruchtig: 'frucht', rauchig: 'oud', holzig: 'holz', wuerzig: 'gewuerz', pudrig: 'pudrig', cremig: 'cremig', suesse: 'vanille' };
const KLARE_ABLEHNUNG = /(hasse|hass|allergisch|eklig|mag (ich )?(gar )?keine?n?|kann (ich )?(gar )?keine?n?)\b/;

// Wörter, die einen Satzteil (Rest danach) verneinen bzw. eine nachgestellte Ablehnung ausdrücken.
const NEG_VOR = ['kein', 'keine', 'keinen', 'keinem', 'keiner', 'keines', 'ohne', 'nicht', 'nichts', 'weder', 'noch', 'nie', 'niemals', 'bloß', 'bloss', 'hasse', 'hass', 'eklig', 'allergisch'];
const NEG_NACH = [
  /geht( [a-zäöüß]+){0,3} nicht/, /mag ich (gar |überhaupt )?nicht/, /mag ich nicht so/, /(ist|sind) (gar |überhaupt )?nicht (so )?(mein|meins|meine|mein ding)/,
  /kann ich nicht (leiden|ab)/, /vertrage ich nicht/, /\bbitte nicht\b(?! zu| so)/, /finde ich (eklig|schlimm|furchtbar|schrecklich)/, /nein danke/, /no go|no-go/,
  /^(nicht|nein)$/,
];
// Gradwörter vor einem Merkmal. „nicht zu süß“ → max 1; „weniger süß“ → max 1; „kaum süß“ → max 0.5;
// „leicht/etwas/ein bisschen süß“ → ziel 1.5; „sehr/richtig/schön süß“ → ziel 3.
const GRAD = [
  [/(nicht|nichts|kein|keine) (zu|so|allzu|übertrieben)$/, { max: 1 }],
  [/(etwas |ein bisschen |ein wenig )?weniger$/, { max: 1 }],
  [/(kaum|wenig)$/, { max: 0.5 }],
  [/(nicht|keine?n?)$/, { max: 0.5 }], // „nicht süß“, „keine süßen Düfte“: deutlich begrenzen, aber kein harter Ausschluss
  [/(leicht|ein bisschen|ein wenig|dezent|angenehm)$/, { ziel: 1.5 }], // „etwas Frisches“ heißt „etwas Frisches“, nicht „leicht frisch“
  [/(sehr|richtig|schön|deutlich|stark|ganz)$/, { ziel: 3 }],
];

const ANLASS_WORT = [
  [/^(abend|abends|nacht|party|feiern|ausgehen|club|bar|dinner|hochzeit|feier|gala|besonder)/, 'abend'],
  [/^(date|dates|verabredung|romantisch|freund(in)?$)/, 'date'],
  [/^(arbeit|büro|buero|job|meeting|uni|schule|praxis)/, 'arbeit'],
  [/^(alltag|alltags|täglich|jeden|tagsüber|freizeit|wochenende)/, 'alltag'],
];
const SAISON_WORT = [[/^sommer/, 'Sommer'], [/^winter/, 'Winter'], [/^herbst/, 'Herbst'], [/^frühling|^fruehling/, 'Frühling']];
// Stärke: positive Wörter; mit Verneinung („nicht aufdringlich“, „keine schweren“) → dezent.
const STAERKE_WORT = [
  [/^(dezent|unaufdringlich|zart|hautnah|unauffällig|sanft)/, 'dezent'],
  [/^(auffällig|auffallend|präsent|kräftig|markant|wahrnehmbar)/, 'deutlich'],
  [/^(intensiv|schwer|stark|laut|aufdringlich)/, 'intensiv'],
];
const STIL_WORT = [
  [/^frisch/, 'frisch'], [/^(warm|wärm)/, 'warm'], [/^(süß|suess|lecker|gourmand)/, 'suess'], [/^holzig/, 'holzig'],
  [/^(dunk|geheimnisvoll|mysteriös|rauchig)/, 'dunkel'],
];
const UNSICHER = /(weiß (ich )?(es )?(noch )?nicht|weiss (ich )?nicht|keine ahnung|hilf mir|bin unsicher|unsicher|egal)/;

function satzteile(text) {
  return norm(text)
    .replace(/[„“"'()]/g, ' ')
    .split(/[.,;:!?\n]+|\s(?:aber|jedoch|sondern|doch|dafür|allerdings)\s/)
    .map((s) => s.replace(/\s+/g, ' ').trim())
    .filter(Boolean);
}
const woerter = (s) => s.replace(/[^a-zäöüß\s-]/g, ' ').split(/\s+/).filter(Boolean);

/**
 * Versteht einen Freitext. Ergebnis (alle Felder optional leer):
 * { mag: [gruppe], mag_nicht: [gruppe], weich: { dim: { max?, ziel? } }, staerke, anlass, saison, stil, unsicher }
 */
export function freitextVerstehen(text) {
  const out = { mag: new Set(), mag_nicht: new Set(), mag_woerter: new Set(), weich: {}, staerke: null, anlass: null, saison: null, stil: null, unsicher: false };
  if (!text || !String(text).trim()) return fertig(out);
  if (UNSICHER.test(norm(text))) out.unsicher = true;

  for (const teil of satzteile(text).slice(0, 30)) {
    const w = woerter(teil).slice(0, 40);
    const nachNegiert = NEG_NACH.some((re) => re.test(teil));
    let negiertAb = -1; // Index, ab dem im Satzteil verneint ist
    w.forEach((wort, i) => {
      if (NEG_VOR.includes(wort) && negiertAb < 0) negiertAb = i;

      // Merkmal mit Gradangabe?
      const dim = merkmalVon(wort);
      if (dim) {
        const davor = w.slice(Math.max(0, i - 3), i).join(' ');
        // Gradangaben („nicht zu“, „nicht so“, „weniger“, „kaum“) sind immer weich – auch nach „bitte“ oder „mag“.
        const istGrad = /(nicht|nichts|kein|keine) (zu|so|allzu|übertrieben)$|weniger$|kaum$|wenig$/.test(davor);
        const klar = !istGrad && ((nachNegiert && !w.slice(i + 1).some((x) => gruppeVonWort(x))) || KLARE_ABLEHNUNG.test(w.slice(0, i).join(' ')));
        if (klar) {
          setzeWeich(out, dim, { max: 0 });
          if (MERKMAL_GRUPPE[dim]) out.mag_nicht.add(MERKMAL_GRUPPE[dim]);
          return;
        }
        const grad = GRAD.find(([re]) => re.test(davor));
        if (grad) {
          setzeWeich(out, dim, grad[1]);
          const stil = (STIL_WORT.find(([re]) => re.test(wort)) || [])[1];
          if (grad[1].ziel && stil && !out.stil) out.stil = stil;
          return;
        }
        if (negiertAb >= 0 && negiertAb < i) { setzeWeich(out, dim, { max: 0.5 }); return; }
        setzeWeich(out, dim, { ziel: 2.5 });
        const stil = (STIL_WORT.find(([re]) => re.test(wort)) || [])[1];
        if (stil && !out.stil) out.stil = stil;
        return;
      }

      // Notengruppe (Vanille, Oud, Zitrus …)
      const g = gruppeVonWort(wort);
      if (g) {
        const vorher = negiertAb >= 0 && negiertAb < i;
        // nachgestellte Ablehnung gilt für die Note(n) davor: „Oud geht gar nicht“, „Rosen mag ich nicht“
        const nachher = nachNegiert && !vorher;
        (vorher || nachher ? out.mag_nicht : out.mag).add(g);
        if (!vorher && !nachher) out.mag_woerter.add(wort.replace(/(en|n|s)$/, ''));
        return;
      }

      // Anlass, Jahreszeit, Stärke, Stil
      for (const [re, a] of ANLASS_WORT) if (re.test(wort) && !out.anlass) out.anlass = a;
      for (const [re, s] of SAISON_WORT) if (re.test(wort) && !out.saison) out.saison = s;
      for (const [re, s] of STAERKE_WORT) {
        if (!re.test(wort)) continue;
        const verneint = (negiertAb >= 0 && negiertAb < i) || nachNegiert;
        out.staerke = verneint ? (s === 'dezent' ? 'deutlich' : 'dezent') : s;
      }
      for (const [re, s] of STIL_WORT) {
        if (!re.test(wort) || (negiertAb >= 0 && negiertAb < i)) continue;
        if (!out.stil || s === 'dunkel') out.stil = s; // „dunkel“ ist die engere Angabe
        if (s === 'dunkel') setzeWeich(out, 'rauchig', { ziel: 2 });
      }
    });
  }
  for (const g of out.mag_nicht) out.mag.delete(g);
  return fertig(out);
}

function setzeWeich(out, dim, v) {
  const alt = out.weich[dim] || {};
  // Begrenzungen gewinnen gegen Wünsche (lieber zu vorsichtig).
  if (v.max !== undefined) out.weich[dim] = { max: Math.min(alt.max ?? 3, v.max) };
  else if (alt.max === undefined) out.weich[dim] = { ziel: v.ziel };
}

function fertig(o) {
  return { ...o, mag: [...o.mag], mag_nicht: [...o.mag_nicht], mag_woerter: [...o.mag_woerter] };
}

export const GRUPPEN_LABEL = Object.fromEntries(Object.entries(NOTEN_GRUPPEN).map(([k, g]) => [k, g.label]));

// Kommt eine Note der Gruppe als Notenwort (nicht nur als Merkmal wie „süß“) im Text vor?
// Damit wird eine von der KI erkannte Abneigung nur übernommen, wenn sie am Text verankert ist.
export function notenwortImText(text, gruppe) {
  return woerter(norm(text)).some((w) => !merkmalVon(w) && gruppeVonWort(w) === gruppe)
    || freitextVerstehen(text).mag_nicht.includes(gruppe);
}
