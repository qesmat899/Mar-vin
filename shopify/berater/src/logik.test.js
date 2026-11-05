import { test } from 'node:test';
import assert from 'node:assert/strict';
import { jahreszeit, ANLAESSE, STIMMUNGEN, PRAESENZ, RICHTUNG, ABNEIGUNGEN } from './logik.js';
import { ANLASS_IDS, STIMMUNG_IDS, PRAESENZ_ZIEL, RICHTUNG_IDS } from '../lib/matching.js';
import { GRUPPEN_IDS } from '../lib/lexikon.js';

test('Jahreszeit nach Monat (meteorologisch)', () => {
  assert.equal(jahreszeit(new Date(2026, 10, 5)), 'Herbst');
  assert.equal(jahreszeit(new Date(2026, 11, 1)), 'Winter');
  assert.equal(jahreszeit(new Date(2027, 1, 28)), 'Winter');
  assert.equal(jahreszeit(new Date(2027, 2, 1)), 'Frühling');
  assert.equal(jahreszeit(new Date(2027, 5, 1)), 'Sommer');
});

test('Optionen der Oberfläche passen zur Engine', () => {
  assert.deepEqual(ANLAESSE.map((o) => o.id), ANLASS_IDS);
  assert.deepEqual(STIMMUNGEN.map((o) => o.id), STIMMUNG_IDS);
  assert.deepEqual(PRAESENZ.map((o) => o.id), Object.keys(PRAESENZ_ZIEL));
  assert.deepEqual(RICHTUNG.map((o) => o.id), RICHTUNG_IDS);
  assert.deepEqual(ABNEIGUNGEN.map((o) => o.id), GRUPPEN_IDS);
});
