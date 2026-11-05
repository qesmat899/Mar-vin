// Gemeinsames für die Server-Endpunkte: Konfiguration aus Umgebungsvariablen, Shopify-Daten, CORS, Rate-Limit.
// Schlüssel stehen nur in Umgebungsvariablen (Vercel → Project → Settings → Environment Variables), nie im Code.

import Anthropic from '@anthropic-ai/sdk';
import { erstelleSpeicher } from './speicher.js';

export function konfiguration(env = process.env) {
  const model = (env.ANTHROPIC_MODEL || 'claude-sonnet-5-5').trim();
  return {
    model,
    effort: ['low', 'medium', 'high'].includes(env.ANTHROPIC_EFFORT) ? env.ANTHROPIC_EFFORT : 'medium',
    // Serverseitiger Ersatz bei einer Ablehnung durch Sicherheitsfilter (nur Claude Sonnet 5.5 über die Claude API).
    fallback: env.ANTHROPIC_FALLBACK !== 'aus' && model === 'claude-sonnet-5-5',
    kiAktiv: Boolean(env.ANTHROPIC_API_KEY),
    timeoutMs: Number(env.ANTHROPIC_TIMEOUT_MS) > 0 ? Number(env.ANTHROPIC_TIMEOUT_MS) : 20000,
    maxRetries: 2,
    maxKiProTag: Number(env.MAX_KI_BERATUNGEN_PRO_TAG) > 0 ? Number(env.MAX_KI_BERATUNGEN_PRO_TAG) : 300,
    maxProIpProStunde: Number(env.MAX_BERATUNGEN_PRO_IP_STUNDE) > 0 ? Number(env.MAX_BERATUNGEN_PRO_IP_STUNDE) : 20,
    erlaubteHerkunft: (env.ERLAUBTE_HERKUNFT || 'https://azizamfragrances.com,https://www.azizamfragrances.com,https://pbznmb-fy.myshopify.com')
      .split(',').map((s) => s.trim()).filter(Boolean),
    shopDatenUrl: env.SHOP_DATEN_URL || 'https://azizamfragrances.com/collections/all?view=berater',
    adminToken: env.ADMIN_TOKEN || '',
  };
}

let client = null;
export function claudeClient(config) {
  if (!config.kiAktiv) return null;
  // Timeout je Versuch; das SDK wiederholt 408/409/429/5xx und Verbindungsfehler mit Backoff (maxRetries).
  if (!client) client = new Anthropic({ timeout: config.timeoutMs, maxRetries: config.maxRetries });
  return client;
}

let speicher = null;
export const speicherInstanz = () => (speicher ??= erstelleSpeicher());

// Shopify-Produktdaten (öffentlicher JSON-Feed aus dem Theme, ohne Zugangsdaten), 10 Minuten zwischengespeichert.
let daten = { zeit: 0, produkte: null };
export async function shopDaten(config, fetchFn = globalThis.fetch) {
  if (daten.produkte && Date.now() - daten.zeit < 10 * 60 * 1000) return daten.produkte;
  const r = await fetchFn(config.shopDatenUrl, { signal: AbortSignal.timeout(6000), headers: { Accept: 'application/json' } });
  if (!r.ok) throw new Error(`Shopdaten ${r.status}`);
  const text = await r.text();
  const json = JSON.parse(text.slice(text.indexOf('{')));
  if (!Array.isArray(json.produkte)) throw new Error('Shopdaten ohne produkte');
  daten = { zeit: Date.now(), produkte: json.produkte };
  return json.produkte;
}

export function cors(req, res, config) {
  const herkunft = req.headers.origin || '';
  const erlaubt = config.erlaubteHerkunft.includes(herkunft);
  if (erlaubt) {
    res.setHeader('Access-Control-Allow-Origin', herkunft);
    res.setHeader('Vary', 'Origin');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    res.setHeader('Access-Control-Max-Age', '86400');
  }
  return erlaubt;
}

export function clientIp(req) {
  const f = String(req.headers['x-forwarded-for'] || '').split(',')[0].trim();
  return f || req.socket?.remoteAddress || 'unbekannt';
}

export const log = (o) => console.log(JSON.stringify({ zeit: new Date().toISOString(), dienst: 'azizam-berater', ...o }));
