// Freitext-Verständnis: Abneigung (harter Ausschluss) vs. Gradangabe (weich) vs. Vorliebe – nie verwechseln.
// Enthält die Fehlerfälle aus dem Audit vom 09.11.2026.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { freitextVerstehen as f } from '../lib/verstehen.js';

// [Satz, erwartet] – erwartet: mag / nicht (harte Ausschlüsse) / weich (dim → max|ziel) / sonst
const SAETZE = [
  ['Ich liebe Kaffee, aber bitte nichts zu Süßes.', { mag: ['kaffee'], nicht: [], weich: { suesse: 'max' } }],
  ['nicht zu süß', { nicht: [], weich: { suesse: 'max' } }],
  ['Ich mag Vanille, aber nicht zu süß.', { mag: ['vanille'], nicht: [], weich: { suesse: 'max' } }],
  ['Oud geht gar nicht', { nicht: ['oud'], mag: [] }],
  ['Oud geht für mich überhaupt nicht', { nicht: ['oud'] }],
  ['Kein Oud', { nicht: ['oud'] }],
  ['etwas Holziges, aber nicht rauchig', { nicht: [], weich: { holzig: 'ziel', rauchig: 'max' } }],
  ['Etwas weniger frisch bitte', { nicht: [], weich: { frische: 'max' } }],
  ['Ich mag keine aquatischen Düfte.', { nicht: ['meer'] }],
  ['Ich mag Vanille, aber keinen Oud und keine Zitrusnoten.', { mag: ['vanille'], nicht: ['oud', 'zitrus'] }],
  ['weder Oud noch Leder', { nicht: ['oud', 'leder'] }],
  ['keine Rosen oder Jasmin', { nicht: ['blumig'] }],
  ['Rosen mag ich nicht so gern', { nicht: ['blumig'] }],
  ['Rosen bitte nicht', { nicht: ['blumig'] }],
  ['bitte nicht zu blumig', { nicht: [], weich: { blumig: 'max' } }],
  ['Blumiges geht für mich gar nicht', { nicht: ['blumig'] }],
  ['Ich hasse Moschus', { nicht: ['moschus'] }],
  ['ich hasse Rauchiges', { nicht: ['oud'] }],
  ['Ich mag keine süßen Düfte', { nicht: ['vanille'] }],
  ['gerne etwas Frisches mit Zitrone, Oud geht gar nicht', { mag: ['zitrus'], nicht: ['oud'], stil: 'frisch' }],
  ['Ich mag Kaffee und Vanille', { mag: ['kaffee', 'vanille'], nicht: [] }],
  ['Leder mit Kardamom, herb und geradlinig', { mag: ['leder', 'gewuerz'], nicht: [] }],
  ['Ich suche einen warmen Duft für den Abend.', { stil: 'warm', anlass: 'abend', nicht: [] }],
  ['Ich möchte etwas Warmes, das nicht zu süß ist.', { stil: 'warm', nicht: [], weich: { suesse: 'max' } }],
  ['Ich suche etwas Frisches für den Sommer.', { stil: 'frisch', saison: 'Sommer', nicht: [] }],
  ['Ich möchte etwas Dunkles, Warmes und Auffälliges.', { stil: 'dunkel', staerke: 'deutlich', nicht: [] }],
  ['Ich weiß überhaupt nicht, was mir gefällt. Hilf mir.', { unsicher: true, nicht: [] }],
  ['Ich mag Vanille, aber keine schweren Düfte', { mag: ['vanille'], staerke: 'dezent', nicht: [] }],
  ['dezent fürs Büro', { staerke: 'dezent', anlass: 'arbeit' }],
  ['leicht süß und dezent', { weich: { suesse: 'ziel' }, staerke: 'dezent', nicht: [] }],
  ['etwas Süßes für Dates', { stil: 'suess', anlass: 'date', nicht: [] }],
  ['Zitrus ist nicht so meins', { nicht: ['zitrus'] }],
];

for (const [satz, soll] of SAETZE) {
  test(`Freitext: ${satz}`, () => {
    const r = f(satz);
    if (soll.mag) for (const g of soll.mag) assert.ok(r.mag.includes(g), `mag ${g} fehlt: ${JSON.stringify(r)}`);
    if (soll.mag && !soll.mag.length) assert.deepEqual(r.mag.filter((g) => (soll.nicht || []).includes(g)), []);
    if (soll.nicht) assert.deepEqual([...r.mag_nicht].sort(), [...soll.nicht].sort(), `Ausschlüsse: ${JSON.stringify(r)}`);
    for (const [d, art] of Object.entries(soll.weich || {})) assert.ok(r.weich[d] && art in r.weich[d], `weich ${d}.${art}: ${JSON.stringify(r.weich)}`);
    for (const k of ['stil', 'anlass', 'saison', 'staerke', 'unsicher']) if (soll[k] !== undefined) assert.equal(r[k], soll[k], `${k}: ${JSON.stringify(r)}`);
    // nie Vorliebe und Abneigung zugleich
    assert.deepEqual(r.mag.filter((g) => r.mag_nicht.includes(g)), []);
  });
}

test(`mindestens 30 Freitext-Sätze (${SAETZE.length})`, () => assert.ok(SAETZE.length >= 30));
