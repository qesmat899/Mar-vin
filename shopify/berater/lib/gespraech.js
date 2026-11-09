// Adaptive Beratung: Nach jeder Antwort entscheidet die Engine, welche Frage die Empfehlung am meisten verändern würde –
// oder ob sie schon genug weiß. Keine Frage doppelt, keine Frage, deren Antwort schon feststeht (auch aus dem Freitext).
//
// Ablauf: 1 Duftart (immer zuerst, außer der Freitext sagt es schon) → bei „Weiß ich noch nicht“: frisch oder warm?
// → 0–3 Fragen aus Süße / Stärke / Anlass, je nach Nutzen → „Gibt es etwas, das du gar nicht magst?“
// → nur wenn zwei Düfte fast gleichauf liegen: eine Unterscheidungsfrage (höchstens 6 Fragen insgesamt).
//
// Nutzen einer Frage: Für jede Antwortmöglichkeit wird die Rangfolge neu berechnet. Eine Frage lohnt sich nur, wenn
// verschiedene Antworten zu einem anderen besten Duft (oder einer anderen Top-3) führen würden.

import { produktProfil } from './profil.js';
import { kundeAufbauen } from './kunde.js';
import { matche, waehleAus, annaeherung } from './matching.js';
import { GRUPPEN_IDS, NOTEN_GRUPPEN } from './lexikon.js';
import { freitextVerstehen } from './verstehen.js';

export const MAX_FRAGEN = 5;
export const MAX_FRAGEN_AUSNAHME = 6;
const KNAPP = 3; // Punkte Abstand Platz 1/2, ab dem eine Unterscheidungsfrage erlaubt ist

export const FRAGEN = {
  stil: {
    frage: 'Welche Art von Duft gefällt dir spontan am besten?',
    freitext: true,
    optionen: [
      { id: 'frisch', label: 'Frisch und leicht', sub: 'sauber, frisch und belebend' },
      { id: 'warm', label: 'Warm und gemütlich', sub: 'weich, warm und angenehm' },
      { id: 'suess', label: 'Süß und verführerisch', sub: 'zum Beispiel Vanille oder Kaffee' },
      { id: 'holzig', label: 'Holzig und elegant', sub: 'eher trocken, warm und natürlich' },
      { id: 'dunkel', label: 'Dunkel und intensiv', sub: 'kräftig, geheimnisvoll und auffällig' },
      { id: 'unsicher', label: 'Weiß ich noch nicht', sub: 'hilf mir bei der Auswahl' },
    ],
  },
  temperatur: {
    frage: 'Was riechst du lieber?',
    optionen: [
      { id: 'frisch', label: 'Etwas Frisches', sub: 'wie Zitrone oder frische Wäsche' },
      { id: 'warm', label: 'Etwas Warmes', sub: 'wie Vanille oder Holz' },
      { id: 'egal', label: 'Beides ist okay' },
    ],
  },
  suesse: {
    frage: 'Wie süß darf dein Duft sein?',
    optionen: [
      { id: 'kaum', label: 'Kaum süß' },
      { id: 'etwas', label: 'Ein bisschen süß' },
      { id: 'deutlich', label: 'Deutlich süß' },
      { id: 'egal', label: 'Ist mir egal' },
    ],
  },
  staerke: {
    frage: 'Wie stark soll dein Parfum auffallen?',
    optionen: [
      { id: 'dezent', label: 'Eher dezent', sub: 'nur wer dir nah ist, riecht ihn' },
      { id: 'bemerkbar', label: 'Man soll es bemerken' },
      { id: 'deutlich', label: 'Deutlich wahrnehmbar' },
      { id: 'intensiv', label: 'Sehr intensiv', sub: 'man erinnert sich an dich' },
    ],
  },
  anlass: {
    frage: 'Wann möchtest du den Duft tragen?',
    optionen: [
      { id: 'alltag', label: 'Im Alltag' },
      { id: 'arbeit', label: 'Bei der Arbeit' },
      { id: 'abend', label: 'Abends und bei besonderen Anlässen' },
      { id: 'date', label: 'Bei Dates und besonderen Momenten' },
      { id: 'vielseitig', label: 'Für möglichst viele Gelegenheiten' },
    ],
  },
  abneigung: {
    frage: 'Gibt es etwas, das du gar nicht magst?',
    hinweis: 'Mehrere möglich – oder einfach weiter.',
    mehrfach: true,
    freitext: true,
    optionen: [
      { id: 'vanille', label: 'Vanille und Süßes' },
      { id: 'blumig', label: 'Blumen und Rosen' },
      { id: 'oud', label: 'Rauch und Oud', sub: 'Oud ist ein dunkles, rauchiges Holz' },
      { id: 'leder', label: 'Leder' },
      { id: 'zitrus', label: 'Zitrone und Zitrus' },
      { id: 'meer', label: 'Meer und Salz' },
      { id: 'kaffee', label: 'Kaffee' },
      { id: 'gewuerz', label: 'Gewürze', sub: 'wie Zimt oder Safran' },
      { id: 'frucht', label: 'Früchte' },
      { id: 'moschus', label: 'Moschus', sub: 'riecht nach sauberer Wäsche' },
    ].filter((o) => GRUPPEN_IDS.includes(o.id)),
  },
};

const MEHR = {
  suesse: ['Etwas süßer', 'Weniger süß'], frische: ['Frischer und leichter', 'Weniger frisch'], waerme: ['Wärmer und weicher', 'Kühler und klarer'],
  rauchig: ['Mit etwas Rauch', 'Ohne Rauch'], holzig: ['Holziger', 'Weniger holzig'], wuerzig: ['Würziger', 'Weniger würzig'],
  blumig: ['Mit Blüten', 'Ohne Blüten'], fruchtig: ['Fruchtiger', 'Weniger fruchtig'], ledrig: ['Mit Leder', 'Ohne Leder'],
  pudrig: ['Pudriger und weicher', 'Weniger pudrig'], cremig: ['Cremiger', 'Weniger cremig'], sauber: ['Sauberer, wie frische Wäsche', 'Weniger „sauber“'],
};

// Antwort in die Kundeneingabe übernehmen (einzige Stelle, an der Antworten gespeichert werden).
export function antwortUebernehmen(eingabe, frageId, antwort, extra = {}) {
  const e = { ...eingabe, weich: { ...(eingabe.weich || {}) } };
  if (frageId === 'stil') e.stil = antwort;
  if (frageId === 'temperatur') { if (antwort !== 'egal') e.stil = antwort; else e.temperatur_egal = true; }
  if (frageId === 'suesse') e.suesse = antwort;
  if (frageId === 'staerke') e.staerke = antwort;
  if (frageId === 'anlass') e.anlass = antwort;
  if (frageId === 'abneigung') e.mag_nicht = [...new Set([...(e.mag_nicht || []), ...(antwort || [])])];
  if (frageId === 'unterscheidung' && extra.dim) {
    e.weich[extra.dim] = antwort === 'mehr' ? { ziel: Math.max(1.5, extra.hoch) } : { max: Math.min(3, extra.tief + 0.5) };
  }
  if (extra.freitext !== undefined) e.freitext = [e.freitext, extra.freitext].filter(Boolean).join('. ').slice(0, 400);
  return e;
}

// Was steht schon fest? (aus Antworten oder Freitext)
function bekannt(eingabe) {
  const f = eingabe.freitext ? freitextVerstehen(eingabe.freitext) : null;
  const stil = eingabe.stil || f?.stil || null;
  return {
    stil: stil && stil !== 'unsicher' ? stil : (stil === 'unsicher' || f?.unsicher ? 'unsicher' : null),
    suesse: Boolean(eingabe.suesse || f?.weich?.suesse),
    staerke: Boolean(eingabe.staerke || eingabe.praesenz || f?.staerke),
    anlass: Boolean(eingabe.anlass || f?.anlass),
    abneigung: Boolean((f?.mag_nicht?.length ?? 0) > 0),
    temperatur: Boolean(eingabe.temperatur_egal),
  };
}

function rangfolge(profile, eingabe) {
  const { angaben } = kundeAufbauen(eingabe);
  return matche(profile, angaben).kandidaten;
}

// Wie stark würde die Frage die Empfehlung verändern? (Anzahl verschiedener Platz-1-Düfte, Top-3-Wechsel als Feinwert)
export function nutzen(profile, eingabe, frageId) {
  const opts = FRAGEN[frageId].optionen.filter((o) => o.id !== 'egal');
  const tops = new Set();
  const dreier = new Set();
  for (const o of opts) {
    const r = rangfolge(profile, antwortUebernehmen(eingabe, frageId, o.id));
    if (r[0]) tops.add(r[0].id);
    dreier.add(r.slice(0, 3).map((k) => k.id).sort().join(','));
  }
  return tops.size + (dreier.size - 1) * 0.1;
}

// Unterscheidungsfrage, wenn Platz 1 und 2 fast gleichauf liegen und sich in einem Merkmal klar unterscheiden.
export function unterscheidung(profile, eingabe, knapp = KNAPP) {
  const r = rangfolge(profile, eingabe);
  if (knapp < 0 || r.length < 2 || r[0].match - r[1].match > knapp) return null;
  const a = profile.find((p) => p.id === r[0].id);
  const b = profile.find((p) => p.id === r[1].id);
  let best = null;
  for (const d of Object.keys(MEHR)) {
    const va = a.dims[d]; const vb = b.dims[d];
    if (!va || !vb || va.wert === null || vb.wert === null) continue;
    const diff = Math.abs(va.wert - vb.wert);
    if (diff >= 1 && (!best || diff > best.diff)) best = { dim: d, diff, hoch: Math.max(va.wert, vb.wert), tief: Math.min(va.wert, vb.wert) };
  }
  if (!best) return null;
  return {
    id: 'unterscheidung',
    frage: 'Fast geschafft: Was klingt besser für dich?',
    optionen: [{ id: 'mehr', label: MEHR[best.dim][0] }, { id: 'weniger', label: MEHR[best.dim][1] }],
    extra: { dim: best.dim, hoch: best.hoch, tief: best.tief },
  };
}

/**
 * Nächste Frage oder null (= Ergebnis zeigen).
 * zustand: { eingabe, gefragt: [frageId] }   produkteRoh: Feed-Daten
 */
export function naechsteFrage(produkteRoh, zustand) {
  const profile = Array.isArray(produkteRoh) && produkteRoh[0]?.dims ? produkteRoh : produkteRoh.map(produktProfil);
  const { eingabe, gefragt = [] } = zustand;
  const k = bekannt(eingabe);
  const frage = (id) => ({ id, ...FRAGEN[id] });
  const anzahl = gefragt.length;

  // 1 Duftart – immer zuerst, außer der Freitext hat sie schon geklärt
  if (!k.stil && !gefragt.includes('stil')) return frage('stil');
  // 2 Bei „Weiß ich noch nicht“: frisch oder warm?
  if (k.stil === 'unsicher' && !gefragt.includes('temperatur') && !k.temperatur) return frage('temperatur');

  // 3 Adaptive Fragen: nur, solange sie die Empfehlung verändern; Platz lassen für die Abneigungsfrage
  const reserve = k.abneigung || gefragt.includes('abneigung') ? 0 : 1;
  const offen = ['suesse', 'staerke', 'anlass'].filter((id) => !gefragt.includes(id) && !k[id]);
  if (anzahl + reserve < MAX_FRAGEN && offen.length) {
    const bewertet = offen.map((id) => ({ id, n: nutzen(profile, eingabe, id) })).sort((x, y) => y.n - x.n);
    // Jede weitere Frage muss mehr verändern: die erste schon bei einem anderen besten Duft, die zweite erst bei
    // mindestens zwei anderen, die dritte bei drei. So bleibt es meist bei 3–4 Fragen.
    const adaptiv = gefragt.filter((id) => offen.concat(['suesse', 'staerke', 'anlass']).includes(id)).length;
    const schwelle = [1.1, 2.6, 3.6][adaptiv + (gefragt.includes('temperatur') ? 1 : 0)] ?? Infinity; // nach „frisch oder warm?“ eine Frage weniger
    if (bewertet[0].n >= schwelle) return frage(bewertet[0].id);
  }

  // 4 Abneigungen – einmal, außer der Freitext hat schon welche genannt
  if (!k.abneigung && !gefragt.includes('abneigung')) return frage('abneigung');

  // 5 Unterscheidung – nur als Ausnahme, wenn zwei Düfte fast gleichauf liegen
  if (!gefragt.includes('unterscheidung')) {
    // je mehr schon gefragt wurde, desto knapper müssen die beiden besten Düfte beieinanderliegen
    // (6. Frage nur bei echtem Gleichstand)
    // Eine 6. Frage stellen wir in der Praxis nicht: Ab 5 Fragen zeigen wir lieber beide Düfte nebeneinander.
    const knapp = anzahl <= 3 ? KNAPP : anzahl === 4 ? 1 : -1;
    const u = unterscheidung(profile, eingabe, knapp);
    if (u) return u;
  }
  return null;
}

// Für Tests und Auswertung: komplette Beratung mit einem simulierten Kunden durchspielen.
// antworte(frage) liefert die Antwort-ID (bzw. Liste) oder { antwort, freitext }.
export function spieleDurch(produkteRoh, start, antworte) {
  const profile = produkteRoh.map(produktProfil);
  let zustand = { eingabe: { ...start }, gefragt: [] };
  const protokoll = [];
  for (let i = 0; i < 10; i += 1) {
    const f = naechsteFrage(profile, zustand);
    if (!f) break;
    const roh = antworte(f);
    const { antwort, freitext } = roh && typeof roh === 'object' && !Array.isArray(roh) ? roh : { antwort: roh };
    protokoll.push({ frage: f.id, antwort });
    zustand = { eingabe: antwortUebernehmen(zustand.eingabe, f.id, antwort, { ...(f.extra || {}), ...(freitext ? { freitext } : {}) }), gefragt: [...zustand.gefragt, f.id] };
  }
  const { angaben } = kundeAufbauen(zustand.eingabe);
  const m = matche(profile, angaben);
  const empf = waehleAus(m.kandidaten);
  const ergebnis = empf.length ? empf : annaeherung(m.kandidaten);
  return { protokoll, eingabe: zustand.eingabe, angaben, empfehlungen: ergebnis, annaeherung: !empf.length && ergebnis.length > 0 };
}

export const NOTEN_LABEL = Object.fromEntries(Object.entries(NOTEN_GRUPPEN).map(([k, g]) => [k, g.label]));
