// POST /api/beratung – eine Duftberatung. Nur vom Shop aus (CORS), Eingaben geprüft, Rate-Limit je IP.
import { createHash } from 'node:crypto';
import { berate } from '../lib/beratung.js';
import { konfiguration, claudeClient, speicherInstanz, shopDaten, cors, clientIp, log } from '../lib/server.js';

const MAX_BODY_BYTES = 4000;

export default async function handler(req, res) {
  const config = konfiguration();
  const erlaubt = cors(req, res, config);
  res.setHeader('Cache-Control', 'no-store');
  if (req.method === 'OPTIONS') return res.status(erlaubt ? 204 : 403).end();
  if (req.method !== 'POST') return res.status(405).json({ fehler: ['nur POST'] });
  if (!erlaubt) return res.status(403).json({ fehler: ['Herkunft nicht erlaubt'] });

  const roh = typeof req.body === 'string' ? req.body : JSON.stringify(req.body ?? {});
  if (Buffer.byteLength(roh) > MAX_BODY_BYTES) return res.status(413).json({ fehler: ['Anfrage zu groß'] });
  let eingabe;
  try { eingabe = typeof req.body === 'string' ? JSON.parse(req.body) : req.body; } catch { return res.status(400).json({ fehler: ['kein JSON'] }); }

  const speicher = speicherInstanz();
  const ipHash = createHash('sha256').update(clientIp(req)).digest('hex').slice(0, 16); // keine Klar-IP speichern
  try {
    const n = await speicher.incr(`rate:${ipHash}:${new Date().toISOString().slice(0, 13)}`, 3700);
    if (n > config.maxProIpProStunde) return res.status(429).json({ fehler: ['Zu viele Anfragen. Bitte später erneut versuchen.'] });
  } catch { /* Speicher nicht erreichbar: Anfrage trotzdem bedienen */ }

  let produkte;
  try { produkte = await shopDaten(config); } catch (e) {
    log({ ereignis: 'shopdaten_fehler', fehler: String(e.message || e) });
    return res.status(503).json({ fehler: ['Produktdaten gerade nicht verfügbar'] });
  }

  const { status, body } = await berate({ eingabe, produkteRoh: produkte, client: claudeClient(config), config, speicher, log });
  return res.status(status).json(body);
}
