// Komplette Beratungsgespräche mit unterschiedlichen Kundentypen: Anzahl der Fragen, keine Wiederholungen,
// keine Ausschlussverstöße, sinnvolle Empfehlung, gültige Produktlinks, verständliche Ergebnisse.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { roh } from './faelle.js';
import { spieleDurch, naechsteFrage, MAX_FRAGEN, MAX_FRAGEN_AUSNAHME } from '../lib/gespraech.js';
import { produktProfil } from '../lib/profil.js';
import { berateLokal } from '../lib/lokal.js';
import { anpassen } from '../lib/matching.js';

const P = Object.fromEntries(roh.map((r) => [r.id, produktProfil(r)]));
const DUNKEL = ['oud-majeste', 'duna', 'royal-cedar', 'ombroso', 'sombre', 'calura', 'velvet-vice'];
const FRISCH = ['marea', 'bergamo', 'borbus', 'mare-vita', 'assassin'];

// antwort(frage) → Antwort-ID / Liste / { antwort, freitext }
const kunde = (antworten) => (f) => {
  const a = antworten[f.id];
  if (typeof a === 'function') return a(f);
  if (a !== undefined) return a;
  return f.mehrfach ? [] : f.optionen[0].id;
};

const PERSONAS = [
  ['A Anfänger: „etwas Warmes, nicht zu süß“', { saison: 'Herbst' },
    { stil: { antwort: null, freitext: 'Ich möchte etwas Warmes, das nicht zu süß ist.' }, staerke: 'bemerkbar', anlass: 'alltag' },
    { top: [...DUNKEL, 'sicilia-nobile', 'ambra-dorata', 'orphea'], nie: FRISCH, ueberspringt: ['suesse'] }],
  ['B „etwas Frisches für den Sommer“', { saison: 'Herbst' },
    { stil: { antwort: null, freitext: 'Ich suche etwas Frisches für den Sommer.' }, suesse: 'kaum', staerke: 'bemerkbar', anlass: 'alltag' },
    { top: FRISCH, alle: [...FRISCH, 'dolce-sole'], nie: DUNKEL }],
  ['C „etwas Dunkles, Warmes und Auffälliges“', { saison: 'Herbst' },
    { stil: { antwort: null, freitext: 'Ich möchte etwas Dunkles, Warmes und Auffälliges.' }, anlass: 'abend', suesse: 'egal' },
    { top: DUNKEL, alle: [...DUNKEL, 'alpha-tonka', 'ambra-dorata'], nie: [...FRISCH, 'velvet-vanilla', 'dolce-sole'], ueberspringt: ['staerke'] }],
  ['D „Vanille, aber keinen Oud und keine Zitrusnoten“', { saison: 'Herbst' },
    { stil: { antwort: null, freitext: 'Ich mag Vanille, aber keinen Oud und keine Zitrusnoten.' }, staerke: 'bemerkbar', anlass: 'date', suesse: 'etwas' },
    { top: ['velvet-vanilla', 'midnight-cafe', 'velvet-vice'], nieGruppen: ['oud', 'zitrus'], ueberspringt: ['abneigung'] }],
  ['E „Ich weiß überhaupt nicht, was mir gefällt“', { saison: 'Herbst' },
    { stil: 'unsicher', temperatur: 'warm', suesse: 'egal', staerke: 'bemerkbar', anlass: 'vielseitig' },
    { mindestensEine: true }],
  ['F Klicks: frisch · kaum süß · Arbeit · dezent', { saison: 'Frühling' },
    { stil: 'frisch', suesse: 'kaum', staerke: 'dezent', anlass: 'arbeit' },
    { top: FRISCH, nie: [...DUNKEL, 'alpha-tonka', 'ambra-dorata'] }],
  ['G Klicks: süß · deutlich süß · Date', { saison: 'Winter' },
    { stil: 'suess', suesse: 'deutlich', staerke: 'deutlich', anlass: 'date' },
    { top: ['midnight-cafe', 'velvet-vanilla', 'velvet-vice', 'alpha-tonka', 'ambra-dorata', 'orphea', 'sicilia-nobile'], nie: FRISCH }],
  ['H Klicks: holzig · Abend · keine Blumen', { saison: 'Herbst' },
    { stil: 'holzig', suesse: 'kaum', staerke: 'deutlich', anlass: 'abend', abneigung: ['blumig'] },
    { top: DUNKEL, nieGruppen: ['blumig'] }],
  ['I Klicks: dunkel · ohne Rauch und Oud', { saison: 'Winter' },
    { stil: 'dunkel', staerke: 'intensiv', anlass: 'abend', abneigung: ['oud'] },
    { nieGruppen: ['oud'], mindestensEine: true }],
  ['J Büro, dezent: nie zu starke Düfte', { saison: 'Herbst' },
    { stil: 'warm', staerke: 'dezent', anlass: 'arbeit', suesse: 'etwas' },
    { nie: roh.filter((r) => r.nicht_buero).map((r) => r.id) }],
];

for (const [name, start, antworten, soll] of PERSONAS) {
  test(`Beratung ${name}`, () => {
    const r = spieleDurch(roh, start, kunde(antworten));
    const fragen = r.protokoll.map((x) => x.frage);
    const ids = r.empfehlungen.map((k) => k.id);
    const info = `${fragen.join(' → ')} ⇒ ${ids.join(', ') || '–'}`;
    assert.ok(fragen.length <= MAX_FRAGEN_AUSNAHME, `zu viele Fragen: ${info}`);
    assert.equal(new Set(fragen).size, fragen.length, `doppelte Frage: ${info}`);
    for (const u of soll.ueberspringt || []) assert.ok(!fragen.includes(u), `„${u}“ war schon beantwortet: ${info}`);
    if (soll.top || soll.mindestensEine) assert.ok(ids.length > 0, `keine Empfehlung: ${info}`);
    if (soll.top) assert.ok(soll.top.includes(ids[0]), `Platz 1 ${ids[0]}: ${info}`);
    if (soll.alle) for (const x of ids) assert.ok(soll.alle.includes(x), `${x} passt nicht: ${info}`);
    for (const x of soll.nie || []) assert.ok(!ids.includes(x), `${x} darf nicht: ${info}`);
    for (const g of soll.nieGruppen || []) for (const x of ids) assert.ok(!P[x].gruppen.includes(g), `${x} enthält ${g}: ${info}`);
    assert.ok(ids.length <= 3);
  });
}

test('Fragen sind kurz: im Mittel höchstens 4,5, nie mehr als 6 (über alle Klick-Kombinationen)', () => {
  const stile = ['frisch', 'warm', 'suess', 'holzig', 'dunkel', 'unsicher'];
  const wahl = { suesse: ['kaum', 'etwas', 'deutlich', 'egal'], staerke: ['dezent', 'bemerkbar', 'deutlich', 'intensiv'], anlass: ['alltag', 'arbeit', 'abend', 'date', 'vielseitig'], temperatur: ['frisch', 'warm', 'egal'] };
  let summe = 0; let n = 0; let ueber5 = 0; let max = 0;
  for (const stil of stile) for (const s of wahl.suesse) for (const st of wahl.staerke) for (const an of wahl.anlass) {
    const r = spieleDurch(roh, { saison: 'Herbst' }, kunde({ stil, suesse: s, staerke: st, anlass: an, temperatur: 'warm', abneigung: [] }));
    const k = r.protokoll.length; summe += k; n += 1; max = Math.max(max, k); if (k > MAX_FRAGEN) ueber5 += 1;
  }
  const mittel = summe / n;
  assert.ok(mittel <= 4.5, `Mittel ${mittel.toFixed(2)}`);
  assert.ok(max <= MAX_FRAGEN_AUSNAHME, `max ${max}`);
  assert.ok(ueber5 / n <= 0.1, `6 Fragen in ${(100 * ueber5 / n).toFixed(1)} %`);
});

test('Freitext beantwortet Fragen mit: nichts wird doppelt gefragt', () => {
  const profile = roh.map(produktProfil);
  const f = naechsteFrage(profile, { eingabe: { saison: 'Herbst', freitext: 'Etwas Warmes für den Abend, nicht zu süß, dezent' }, gefragt: ['stil'] });
  assert.ok(!f || !['stil', 'anlass', 'suesse', 'staerke'].includes(f.id), f?.id);
});

test('Ergebnis: verständlich, ohne Zahlen, Alternativen mit Unterschied, Links und 10-ml-Probe stimmen', () => {
  const r = berateLokal({ saison: 'Herbst', stil: 'warm', anlass: 'abend', staerke: 'deutlich' }, roh);
  assert.ok(r.empfehlungen.length >= 2);
  const [top, ...alt] = r.empfehlungen;
  assert.match(top.warum, /^Du /);
  // Grammatik ohne Anlass
  const ohne = berateLokal({ saison: 'Herbst', freitext: 'Ich mag Vanille', staerke: 'bemerkbar' }, roh).empfehlungen[0];
  assert.ok(!/suchst du das/.test(ohne.warum), ohne.warum);
  assert.ok(!/\d+\s?%/.test(top.warum));
  assert.ok(top.stufe?.text);
  for (const a of alt) assert.match(a.unterschied, /Alternative/);
  for (const e of r.empfehlungen) {
    assert.match(e.url, /^\/products\/[a-z0-9-]+$/);
    assert.equal(e.url, `/products/${e.product_id}`);
    if (e.probe) { assert.ok(e.probe.url.startsWith(e.url) && e.probe.preis > 0); assert.match(e.probe.grundpreis, /€\/100 ml$/); }
  }
});

test('Nachjustieren: Antworten bleiben, Empfehlung bewegt sich in die gewünschte Richtung', () => {
  const start = { saison: 'Herbst', stil: 'suess', anlass: 'date', staerke: 'bemerkbar' };
  const vorher = berateLokal(start, roh);
  const top = P[vorher.empfehlungen[0].product_id];
  const weniger = anpassen(start, 'weniger_suess', top);
  assert.equal(weniger.stil, 'suess'); assert.equal(weniger.anlass, 'date'); // nichts verloren
  const nachher = berateLokal(weniger, roh);
  const s = (id) => P[id].dims.suesse.wert;
  assert.ok(s(nachher.empfehlungen[0].product_id) <= s(top.id), `${nachher.empfehlungen[0].product_id} nicht weniger süß als ${top.id}`);
  const frischer = berateLokal(anpassen(start, 'frischer', top), roh);
  assert.ok(P[frischer.empfehlungen[0].product_id].dims.frische.wert >= top.dims.frische.wert);
  const andere = berateLokal({ ...start, ohne: vorher.empfehlungen.map((e) => e.product_id) }, roh);
  for (const e of andere.empfehlungen) assert.ok(!vorher.empfehlungen.some((x) => x.product_id === e.product_id));
});

test('Unbekannte Merkmale zählen nicht als „nicht vorhanden“', () => {
  const ohneNoten = { ...roh.find((r) => r.id === 'velvet-vanilla'), id: 'test-unbekannt', noten: [], charakter: null };
  const pr = produktProfil(ohneNoten);
  assert.equal(pr.dims.suesse.wert, null); // unbekannt, nicht 0
  const r = berateLokal({ saison: 'Herbst', stil: 'frisch', suesse: 'kaum' }, [...roh, ohneNoten]);
  assert.ok(!r.empfehlungen.some((e) => e.product_id === 'test-unbekannt'));
});

test('Passt nichts genau: trotzdem die nächstbesten – aber nie gegen Abneigungen oder Budget', () => {
  const a = berateLokal({ anlass: 'Abend', stimmung: ['geheimnisvoll', 'kraftvoll'], praesenz: 'laut', saison: 'Sommer', mag_nicht: ['oud', 'leder'] }, roh);
  assert.ok(a.empfehlungen.length >= 1 && a.annaeherung === true);
  for (const e of a.empfehlungen) assert.ok(!P[e.product_id].gruppen.some((g) => ['oud', 'leder'].includes(g)), e.product_id);
  const b = berateLokal({ anlass: 'Freizeit', stimmung: ['frisch'], praesenz: 'leise', saison: 'Sommer', budget: 35 }, roh);
  assert.ok(b.empfehlungen.length >= 1);
  for (const e of b.empfehlungen) assert.ok((P[e.product_id].preise['30 ml'] ?? 0) <= 35, e.product_id);
  // Alles ausgeschlossen: dann ehrlich keiner
  const c = berateLokal({ stil: 'frisch', saison: 'Sommer', mag_nicht: ['vanille', 'oud', 'leder', 'blumig', 'kaffee', 'tabak', 'zitrus', 'meer', 'frucht', 'gewuerz', 'holz', 'moschus', 'pudrig', 'cremig'] }, roh);
  assert.equal(c.kein_treffer, true);
});
