import { test } from 'node:test';
import assert from 'node:assert/strict';
import { jahreszeit, bewerte, empfehlung } from './logik.js';

test('Jahreszeit nach Monat (meteorologisch)', () => {
  assert.equal(jahreszeit(new Date(2026, 10, 5)), 'Herbst');
  assert.equal(jahreszeit(new Date(2026, 11, 1)), 'Winter');
  assert.equal(jahreszeit(new Date(2027, 1, 28)), 'Winter');
  assert.equal(jahreszeit(new Date(2027, 2, 1)), 'Frühling');
  assert.equal(jahreszeit(new Date(2027, 5, 1)), 'Sommer');
});

const leicht = { t: 'Leicht', anlass: ['Büro', 'Alltag'], stimmung: ['frisch'], saison: ['Frühling', 'Sommer'], intensitaet: 2, tendenz: 'unisex', nicht_buero: false };
const stark = { t: 'Stark', anlass: ['Abend', 'Date'], stimmung: ['kraftvoll', 'sinnlich'], saison: ['Herbst', 'Winter'], intensitaet: 5, tendenz: 'unisex', nicht_buero: true };

test('Büro: zu starker Duft fällt deutlich zurück', () => {
  const a = { anlass: 'Büro', stimmung: ['kraftvoll'], praesenz: 'laut', saison: 'Herbst' };
  assert.ok(bewerte(stark, a).punkte < bewerte(leicht, a).punkte);
});

test('Abend + sinnlich + Herbst bevorzugt den passenden Duft und nennt Gründe', () => {
  const r = empfehlung([leicht, stark], { anlass: 'Abend', stimmung: ['sinnlich'], praesenz: 'laut', saison: 'Herbst', richtung: 'egal' });
  assert.equal(r[0].p.t, 'Stark');
  assert.deepEqual(r[0].gruende, ['Abend & Ausgehen', 'Sinnlich', 'passt zum Herbst']);
});

test('Fehlende Metafelder brechen nichts', () => {
  const r = bewerte({ t: 'Leer' }, { anlass: 'Date', stimmung: ['frisch'], praesenz: 'mittel', saison: 'Winter', richtung: 'feminin' });
  assert.equal(typeof r.punkte, 'number');
});
