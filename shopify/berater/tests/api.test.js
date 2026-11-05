// Endpunkte mit simulierten req/res. Kein API-Schlüssel gesetzt → Beratung läuft ohne KI.
import { test, before } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const feed = readFileSync(new URL('./fixtures/shop-stand-2026-11-05.json', import.meta.url), 'utf8');
let beratung, kosten, status;

before(async () => {
  delete process.env.ANTHROPIC_API_KEY;
  delete process.env.KV_REST_API_URL;
  process.env.SHOP_DATEN_URL = 'https://shop.test/collections/all?view=berater';
  process.env.ADMIN_TOKEN = 'geheim-test-token';
  process.env.MAX_BERATUNGEN_PRO_IP_STUNDE = '3';
  globalThis.fetch = async (url) => {
    assert.equal(String(url), process.env.SHOP_DATEN_URL);
    return { ok: true, status: 200, text: async () => `\n${feed}` };
  };
  ({ default: beratung } = await import('../api/beratung.js'));
  ({ default: kosten } = await import('../api/kosten.js'));
  ({ default: status } = await import('../api/status.js'));
});

function aufruf(handler, { method = 'POST', origin = 'https://azizamfragrances.com', body = {}, ip = '1.2.3.4', headers = {}, query = {} } = {}) {
  const res = { code: 0, headers: {}, body: undefined };
  res.status = (c) => { res.code = c; return res; };
  res.json = (b) => { res.body = b; return res; };
  res.end = () => res;
  res.setHeader = (k, v) => { res.headers[k.toLowerCase()] = v; };
  const req = { method, body, query, headers: { origin, 'x-forwarded-for': ip, ...headers }, socket: {} };
  return Promise.resolve(handler(req, res)).then(() => res);
}

const WUNSCH = { anlass: 'Abend', stimmung: ['geheimnisvoll'], praesenz: 'mittel', saison: 'Herbst' };

test('Beratung vom Shop: 200, validierte Empfehlungen, keine Geheimnisse in der Antwort', async () => {
  const r = await aufruf(beratung, { body: WUNSCH });
  assert.equal(r.code, 200);
  assert.equal(r.headers['access-control-allow-origin'], 'https://azizamfragrances.com');
  assert.equal(r.body.quelle, 'ohne_ki');
  assert.ok(r.body.empfehlungen.length > 0);
  assert.ok(!JSON.stringify(r.body).match(/sk-ant|api[_-]?key|token/i));
});

test('Fremde Herkunft wird abgewiesen (CORS)', async () => {
  const r = await aufruf(beratung, { origin: 'https://boese.example', body: WUNSCH });
  assert.equal(r.code, 403);
  assert.equal(r.headers['access-control-allow-origin'], undefined);
});

test('Nur POST; Preflight erlaubt', async () => {
  assert.equal((await aufruf(beratung, { method: 'GET' })).code, 405);
  assert.equal((await aufruf(beratung, { method: 'OPTIONS' })).code, 204);
});

test('Zu große Anfrage und kaputtes JSON', async () => {
  assert.equal((await aufruf(beratung, { body: { ...WUNSCH, freitext: 'x'.repeat(5000) }, ip: '9.9.9.1' })).code, 413);
  assert.equal((await aufruf(beratung, { body: '{kaputt', ip: '9.9.9.2' })).code, 400);
  assert.equal((await aufruf(beratung, { body: { anlass: 'Party' }, ip: '9.9.9.3' })).code, 400);
});

test('Rate-Limit je IP', async () => {
  const codes = [];
  for (let i = 0; i < 5; i += 1) codes.push((await aufruf(beratung, { body: WUNSCH, ip: '5.5.5.5' })).code);
  assert.deepEqual(codes, [200, 200, 200, 429, 429]);
});

test('Kostenübersicht nur mit Admin-Token', async () => {
  assert.equal((await aufruf(kosten, { method: 'GET', headers: { authorization: 'Bearer falsch' } })).code, 401);
  const r = await aufruf(kosten, { method: 'GET', headers: { authorization: 'Bearer geheim-test-token' }, query: { monat: new Date().toISOString().slice(0, 7) } });
  assert.equal(r.code, 200);
  assert.ok(r.body.beratungen >= 1);
  assert.equal(r.body.speicher, 'arbeitsspeicher');
});

test('Status verrät keine Schlüssel', async () => {
  const r = await aufruf(status, { method: 'GET' });
  assert.equal(r.code, 200);
  assert.equal(r.body.ki_schluessel_gesetzt, false);
  assert.equal(r.body.produkte_geladen, 19);
  assert.equal(r.body.modell, 'claude-haiku-5-5');
});
