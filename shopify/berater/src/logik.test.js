import { test } from 'node:test';
import assert from 'node:assert/strict';
import { jahreszeit, FRAGEN, NACHJUSTIEREN } from './logik.js';
import { STIL_IDS, SUESSE_IDS, STAERKE_ZIEL, ANLASS_NEU, ANPASSUNG_IDS } from '../lib/matching.js';
import { GRUPPEN_IDS } from '../lib/lexikon.js';

test('Jahreszeit nach Monat (meteorologisch)', () => {
  assert.equal(jahreszeit(new Date(2026, 10, 5)), 'Herbst');
  assert.equal(jahreszeit(new Date(2026, 11, 1)), 'Winter');
  assert.equal(jahreszeit(new Date(2027, 1, 28)), 'Winter');
  assert.equal(jahreszeit(new Date(2027, 2, 1)), 'Frühling');
  assert.equal(jahreszeit(new Date(2027, 5, 1)), 'Sommer');
});

test('Antwortmöglichkeiten der Oberfläche passen zur Engine', () => {
  assert.deepEqual(FRAGEN.stil.optionen.map((o) => o.id), STIL_IDS);
  assert.deepEqual(FRAGEN.suesse.optionen.map((o) => o.id), SUESSE_IDS);
  assert.deepEqual(FRAGEN.staerke.optionen.map((o) => o.id), Object.keys(STAERKE_ZIEL));
  assert.deepEqual(FRAGEN.anlass.optionen.map((o) => o.id), Object.keys(ANLASS_NEU));
  for (const o of FRAGEN.abneigung.optionen) assert.ok(GRUPPEN_IDS.includes(o.id), o.id);
  for (const o of NACHJUSTIEREN) assert.ok(o.id === 'andere' || ANPASSUNG_IDS.includes(o.id), o.id);
});

test('Fragen ohne Fachbegriffe', () => {
  const verboten = /olfaktor|komposition|balsam|ambri|gourmand|facette|signatur|sillage|akkord|kopfnote|basisnote/i;
  for (const f of Object.values(FRAGEN)) {
    assert.ok(!verboten.test(f.frage), f.frage);
    for (const o of f.optionen) assert.ok(!verboten.test(`${o.label} ${o.sub || ''}`), o.label);
    assert.ok(f.frage.length <= 60, `Frage zu lang: ${f.frage}`);
  }
});
