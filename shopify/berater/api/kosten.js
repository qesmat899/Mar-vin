// GET /api/kosten?monat=2026-11 – Monatsübersicht der API-Nutzung. Nur mit Authorization: Bearer <ADMIN_TOKEN>.
import { timingSafeEqual } from 'node:crypto';
import { monatsUebersicht } from '../lib/kosten.js';
import { konfiguration, speicherInstanz } from '../lib/server.js';

export default async function handler(req, res) {
  const config = konfiguration();
  res.setHeader('Cache-Control', 'no-store');
  const gesendet = Buffer.from(String(req.headers.authorization || '').replace(/^Bearer\s+/i, ''));
  const soll = Buffer.from(config.adminToken);
  if (!config.adminToken || gesendet.length !== soll.length || !timingSafeEqual(gesendet, soll)) {
    return res.status(401).json({ fehler: ['nicht berechtigt'] });
  }
  const monat = /^\d{4}-\d{2}$/.test(String(req.query?.monat)) ? req.query.monat : new Date().toISOString().slice(0, 7);
  const speicher = speicherInstanz();
  return res.status(200).json({ ...(await monatsUebersicht(speicher, monat)), speicher: speicher.art, modell: config.model });
}
