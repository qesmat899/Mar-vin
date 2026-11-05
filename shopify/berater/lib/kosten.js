// API-Kosten je Beratung aus den Token-Zahlen der Antwort (usage).
// Preise in US-Dollar je 1 Mio. Token, Anthropic-Listenpreise Stand 2026-10 (vor Nutzung auf claude.com/pricing prüfen).
// Cache-Schreiben kostet das 1,25-fache des Eingabepreises (5-Minuten-Cache), Cache-Lesen den angegebenen Satz.

export const PREISE_USD_PRO_MIO = {
  'claude-sonnet-5-5': { input: 2.0, output: 10.0, cache_read: 0.2 },
  'claude-sonnet-5': { input: 2.0, output: 10.0, cache_read: 0.2 },
  'claude-opus-5-5': { input: 4.0, output: 20.0, cache_read: 0.2 },
  'claude-haiku-5-5': { input: 0.1, output: 0.5, cache_read: 0.01 },
};

export function kostenUsd(model, usage) {
  const preis = PREISE_USD_PRO_MIO[model];
  const u = {
    input: usage?.input_tokens ?? 0,
    output: usage?.output_tokens ?? 0,
    cache_write: usage?.cache_creation_input_tokens ?? 0,
    cache_read: usage?.cache_read_input_tokens ?? 0,
  };
  if (!preis) return { tokens: u, usd: null, hinweis: `kein Preis hinterlegt für ${model}` };
  const usd = (u.input * preis.input + u.output * preis.output + u.cache_write * preis.input * 1.25 + u.cache_read * preis.cache_read) / 1e6;
  return { tokens: u, usd: Math.round(usd * 1e6) / 1e6 };
}

export const monatsSchluessel = (d = new Date()) => `kosten:${d.toISOString().slice(0, 7)}`;

// Bucht eine Beratung in die Monatsübersicht (Speicher: siehe speicher.js).
export async function bucheKosten(speicher, { model, tokens, usd, art }) {
  const k = monatsSchluessel();
  await Promise.all([
    speicher.hincrby(k, 'beratungen', 1),
    speicher.hincrby(k, `art_${art}`, 1),
    speicher.hincrby(k, 'input_tokens', tokens?.input ?? 0),
    speicher.hincrby(k, 'output_tokens', tokens?.output ?? 0),
    speicher.hincrby(k, 'cache_write_tokens', tokens?.cache_write ?? 0),
    speicher.hincrby(k, 'cache_read_tokens', tokens?.cache_read ?? 0),
    speicher.hincrby(k, 'mikro_usd', Math.round((usd ?? 0) * 1e6)),
    speicher.hincrby(k, `modell_${model}`, art === 'claude' ? 1 : 0),
  ]);
  await speicher.expire(k, 60 * 60 * 24 * 400);
}

export async function monatsUebersicht(speicher, monat) {
  const roh = await speicher.hgetall(`kosten:${monat}`);
  const n = (k) => Number(roh?.[k] ?? 0);
  const beratungen = n('beratungen');
  const usd = n('mikro_usd') / 1e6;
  const modelle = Object.fromEntries(Object.entries(roh || {}).filter(([k]) => k.startsWith('modell_')).map(([k, v]) => [k.slice(7), Number(v)]));
  return {
    monat,
    beratungen,
    davon: { claude: n('art_claude'), cache: n('art_cache'), ohne_ki: n('art_ohne_ki') },
    tokens: { input: n('input_tokens'), output: n('output_tokens'), cache_write: n('cache_write_tokens'), cache_read: n('cache_read_tokens') },
    kosten_usd: Math.round(usd * 10000) / 10000,
    kosten_je_beratung_usd: beratungen ? Math.round((usd / beratungen) * 10000) / 10000 : 0,
    modelle,
  };
}
