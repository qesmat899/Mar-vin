// Prüft die Empfehlungen inhaltlich: Kundenprofile (tests/faelle.js) gegen die echten Shopify-Daten (Stand 05.11.2026).
// Erwartungen beschreiben, was zum Profil passt (Duftlogik), nicht das, was die Engine zufällig ausgibt.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { berate } from '../lib/beratung.js';
import { produktProfil } from '../lib/profil.js';
import { speicherImArbeitsspeicher } from '../lib/speicher.js';
import { roh, FAELLE, pruefe } from './faelle.js';

const config = { model: 'claude-sonnet-5-5', effort: 'medium', fallback: false, kiAktiv: false, maxKiProTag: 100 };
const empfiehl = (eingabe, produkte = roh) => berate({ eingabe, produkteRoh: produkte, client: null, config, speicher: speicherImArbeitsspeicher() });
const ids = (r) => r.body.empfehlungen.map((e) => e.product_id);

test(`mindestens 30 Kundenprofile (${FAELLE.length})`, () => assert.ok(FAELLE.length >= 30));

for (const [name, eingabe, soll] of FAELLE) {
  test(`Profil: ${name}`, async () => {
    const r = await empfiehl(eingabe);
    assert.equal(r.status, 200, JSON.stringify(r.body));
    const fehler = pruefe(soll, r.body.empfehlungen, r.body.hinweise, r.body.annaeherung === true);
    if (soll.kein_treffer !== undefined) assert.equal(r.body.kein_treffer, soll.kein_treffer);
    assert.deepEqual(fehler, [], `Empfehlungen: ${r.body.empfehlungen.map((x) => `${x.product_id} ${x.match_score}%`).join(', ') || '–'}`);
  });
}

test('Unvollständige Produktdaten: Duft ohne Merkmale wird nie empfohlen', async () => {
  const luecke = { id: 'test-luecke', t: 'Testduft', u: '/products/test-luecke', noten: ['Oud', 'Leder', 'Rose'], charakter: 'Dunkel', preise: { '30 ml': 30 } };
  const r = await empfiehl({ anlass: 'Abend', stimmung: ['geheimnisvoll'], praesenz: 'mittel', saison: 'Herbst' }, [...roh, luecke]);
  assert.ok(!ids(r).includes('test-luecke'));
  const pr = produktProfil(luecke);
  for (const f of ['stimmung', 'anlass', 'saison', 'intensitaet', 'haltbarkeit', 'sillage', 'kopfnote']) assert.ok(pr.unbekannt.includes(f), f);
});

test('Bestätigte Profilwerte ersetzen abgeleitete', () => {
  const vv = roh.find((r) => r.id === 'velvet-vanilla');
  const pr = produktProfil({ ...vv, profil: { suesse: 1, haltbarkeit: 4, kopfnote: ['Vanille'] } });
  assert.deepEqual(pr.dims.suesse, { wert: 1, quelle: 'bestaetigt' });
  assert.equal(pr.haltbarkeit, 4);
  assert.equal(pr.dims.pudrig.quelle, 'abgeleitet');
  assert.ok(!pr.unbekannt.includes('haltbarkeit'));
});

test('Unbekanntes bleibt unbekannt: Haltbarkeit, Sillage, Kopf-/Herz-/Basisnote', () => {
  for (const r of roh) {
    const pr = produktProfil(r);
    for (const f of ['haltbarkeit', 'sillage', 'kopfnote', 'herznote', 'basisnote']) assert.equal(pr[f], null, `${r.id}.${f}`);
  }
});

test('Ungültige Eingaben werden abgewiesen', async () => {
  assert.equal((await empfiehl({ anlass: 'Party' })).status, 400);
  assert.equal((await empfiehl({ stimmung: 'frisch' })).status, 400);
  assert.equal((await empfiehl({ budget: 'viel' })).status, 400);
  assert.equal((await empfiehl({ mag_nicht: ['<script>'] })).status, 400);
});
