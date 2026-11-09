// Verständliche Ergebnisse ohne Zahlen: Einstufung, „Warum dieser Duft“, Unterschied der Alternativen, 10-ml-Probe.
// Jede Aussage stützt sich auf eine Kundenangabe, die der Duft laut Engine erfüllt, und auf Produktdaten
// (Hauptnoten, Duftrichtung, Intensität, Beschreibung). Nichts wird hinzugedichtet.

import { NOTE_DIM_TEXT, gruppeVonWort, norm } from './lexikon.js';

export function stufe(match) {
  if (match >= 85) return { id: 'sehr_gut', text: 'Passt sehr gut zu dir' };
  if (match >= 70) return { id: 'gut', text: 'Passt gut zu dir' };
  return { id: 'nah', text: 'Kommt deinem Wunsch nahe' };
}

const STIL_TEXT = { frisch: 'frische, leichte Düfte', warm: 'warme, gemütliche Düfte', suess: 'süße Düfte', holzig: 'holzige, elegante Düfte', dunkel: 'dunkle, intensive Düfte' };
const DIM_ADJ = { suesse: 'süß', frische: 'frisch', waerme: 'warm', rauchig: 'rauchig', holzig: 'holzig', wuerzig: 'würzig', blumig: 'blumig', fruchtig: 'fruchtig', ledrig: 'ledrig', pudrig: 'pudrig', cremig: 'cremig', sauber: 'sauber' };
const ANLASS_SATZ = { Alltag: 'für den Alltag', Freizeit: 'für die Freizeit', Büro: 'für die Arbeit', Date: 'für Dates', Abend: 'für den Abend', 'Besonderer Anlass': 'für besondere Anlässe', vielseitig: 'für viele Gelegenheiten' };
const STAERKE_SATZ = (i) => (i <= 2 ? 'das eher dezent bleibt' : i === 3 ? 'das man bemerkt' : 'das deutlich wahrnehmbar ist');
const GRUPPE_TEXT = { vanille: 'Vanille', kaffee: 'Kaffee', zitrus: 'Zitrus', oud: 'Oud', leder: 'Leder', blumig: 'Blüten', meer: 'Meeresnoten', frucht: 'Früchten', gewuerz: 'Gewürzen', holz: 'Hölzern', moschus: 'Moschus', pudrig: 'pudrigen Noten', cremig: 'cremigen Noten', tabak: 'Tabak' };

function notenDerGruppe(p, g) {
  const n = (p.hauptnoten || []).filter((x) => gruppeVonWort(norm(x)) === g);
  return n.length ? n : null;
}

const liste = (xs) => (xs.length <= 1 ? xs.join('') : `${xs.slice(0, -1).join(', ')} und ${xs[xs.length - 1]}`);

// „Warum wir ihn empfehlen“ – 1 bis 3 kurze Sätze.
export function warum(angaben, p, k) {
  const e = new Set(k.erfuellt || []);
  const saetze = [];
  // 1 Was du magst (nur erfüllte Wünsche)
  const dims = [...e].filter((x) => x.startsWith('dim:')).map((x) => DIM_ADJ[x.slice(4)]).filter(Boolean);
  const stil = angaben.stil && e.has(`stil:${angaben.stil}`) ? STIL_TEXT[angaben.stil] : null;
  // die tatsächliche Hauptnote nennen („mit Honig“), nicht den Gruppennamen
  const mag = [...e].filter((x) => x.startsWith('mag:')).flatMap((x) => notenDerGruppe(p, x.slice(4)) || [GRUPPE_TEXT[x.slice(4)]]).filter(Boolean);
  const grenze = e.has('grenze:suesse') ? 'nicht zu süß' : null;
  let s1 = '';
  if (stil) s1 = `Du magst ${stil}`;
  else if (dims.length) s1 = `Du magst ${liste([...new Set(dims)].slice(0, 2).map((x) => `${x}e`))} Düfte`;
  if (grenze) s1 = s1 ? `${s1} – aber ${grenze}` : `Dein Duft soll ${grenze} sein`;
  if (s1) saetze.push(`${s1}.`);
  // gewünschte Noten als Tatsache über den Duft (die echte Hauptnote, z. B. „Honig“ bei „Vanille & Süßes“)
  if (mag.length) saetze.push(`${p.name} enthält ${liste([...new Set(mag)])}, was du magst.`.replace(', was du magst.', ' – passend zu deinem Wunsch.'));
  // 2 Wofür und wie stark
  const anlass = [...e].find((x) => x.startsWith('anlass:'))?.slice(7);
  const staerke = [...e].find((x) => x.startsWith('staerke:'));
  const teile = [];
  if (anlass && ANLASS_SATZ[anlass]) teile.push(`etwas ${ANLASS_SATZ[anlass]}`);
  if (staerke && p.intensitaet !== null) teile.push(STAERKE_SATZ(p.intensitaet));
  if (teile.length) saetze.push(`Außerdem suchst du ${teile.join(', ')}.`);
  // 3 Der Duft selbst (freigegebene Beschreibung bzw. Hauptnoten)
  if (saetze.length) saetze.push(k.match >= 70 ? `Deshalb passt ${p.name} gut zu deinen Angaben.` : `${p.name} kommt dem am nächsten.`);
  return saetze.join(' ');
}

// Unterschied einer Alternative zum Platz 1 – nur aus bekannten Profilwerten (bestätigt oder aus Hauptnoten abgeleitet).
const MEHR_TEXT = { suesse: 'etwas süßer', frische: 'etwas frischer', waerme: 'etwas wärmer', rauchig: 'etwas rauchiger', holzig: 'etwas holziger und trockener', wuerzig: 'etwas würziger', blumig: 'etwas blumiger', fruchtig: 'etwas fruchtiger', ledrig: 'etwas ledriger', pudrig: 'etwas pudriger und weicher', cremig: 'etwas cremiger', sauber: 'etwas sauberer und klarer' };
const WENIGER_TEXT = { suesse: 'weniger süß', frische: 'weniger frisch', waerme: 'weniger warm', rauchig: 'weniger rauchig', holzig: 'weniger holzig', wuerzig: 'weniger würzig', blumig: 'weniger blumig', fruchtig: 'weniger fruchtig', ledrig: 'ohne viel Leder', pudrig: 'weniger pudrig', cremig: 'weniger cremig', sauber: 'weniger „sauber“' };

export function unterschied(top, alt) {
  const kand = [];
  for (const d of Object.keys(MEHR_TEXT)) {
    const a = alt.dims?.[d]; const t = top.dims?.[d];
    if (!a || !t || a.wert === null || t.wert === null) continue;
    const diff = a.wert - t.wert;
    if (Math.abs(diff) >= 1) kand.push({ d, diff });
  }
  kand.sort((x, y) => Math.abs(y.diff) - Math.abs(x.diff));
  const teile = kand.slice(0, 2).map(({ d, diff }) => (diff > 0 ? MEHR_TEXT[d] : WENIGER_TEXT[d]));
  if (alt.intensitaet !== null && top.intensitaet !== null && Math.abs(alt.intensitaet - top.intensitaet) >= 2) {
    teile.push(alt.intensitaet > top.intensitaet ? 'kräftiger' : 'dezenter');
  }
  if (!teile.length) return alt.familie && alt.familie !== top.familie ? `Eine Alternative aus der Richtung „${alt.familie}“.` : 'Eine ähnliche Alternative.';
  // Beleg aus den Hauptnoten, wenn eine Note das stärkste Merkmal trägt
  // nur echte Noten (Substantive) als Beleg nennen, keine Beschreibungswörter wie „pudrig“
  const beleg = kand[0] && kand[0].diff > 0 ? (alt.hauptnoten || []).find((n) => /^[A-ZÄÖÜ]/.test(n) && NOTE_DIM_TEXT(n)?.includes(kand[0].d)) : null;
  return `Diese Alternative ist ${liste(teile)}${beleg ? ` – mit der Note ${beleg}` : ''}.`;
}

// 10-ml-Reiseflakon als Einstieg, wenn es ihn gibt.
export function probe(p) {
  const preis = p.preise?.['10 ml'];
  if (preis === undefined) return null;
  const v = (p.varianten || []).find((x) => /^10\s?ml$/i.test(x.t) && x.v !== false);
  const url = p.url ? (v?.id ? `${p.url}?variant=${v.id}` : p.url) : null;
  return url ? { preis, url, text: `${String(preis.toFixed(2)).replace('.', ',')} €` } : null;
}
