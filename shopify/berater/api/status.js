// GET /api/status – Betriebszustand ohne Geheimnisse: ist ein Schlüssel gesetzt, welches Modell, welcher Speicher.
import { konfiguration, speicherInstanz, shopDaten } from '../lib/server.js';

export default async function handler(req, res) {
  const config = konfiguration();
  res.setHeader('Cache-Control', 'no-store');
  let produkte = null;
  try { produkte = (await shopDaten(config)).length; } catch { produkte = null; }
  return res.status(200).json({
    ki_schluessel_gesetzt: config.kiAktiv,
    modell: config.model,
    effort: config.effort,
    speicher: speicherInstanz().art,
    produkte_geladen: produkte,
  });
}
