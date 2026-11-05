// Ablauf einer Beratung (serverseitig):
// 1 Angaben prüfen → 2 Kundenprofil (Karten + Freitext) → 3 Produktprofile aus Shopify → 4 harte Ausschlüsse
// → 5 gewichtete Bewertung → 6 EIN Claude-Aufruf für die besten Kandidaten → 7 Neuberechnung + Widerspruchsprüfung
// → 8 Qualitäts-Gate. Ohne Schlüssel, bei Fehlern oder über dem Tageslimit: dieselbe Logik ohne KI (ehrlich gekennzeichnet).

import { createHash } from 'node:crypto';
import { produktProfil, profilFuerKi } from './profil.js';
import { freitextLesen } from './lexikon.js';
import { kundenAngaben, matche, empfehlbar, MAX_EMPFEHLUNGEN } from './matching.js';
import { frageClaude, validiereAntwort } from './claude.js';
import { kostenUsd, bucheKosten } from './kosten.js';
import { ohneKi, ausgabe } from './ergebnis.js';

export const CACHE_SEKUNDEN = 60 * 60 * 24 * 7;
const MAX_KI_KANDIDATEN = 6;
const MIN_FUER_KI = 45; // darunter kann kein Duft das Qualitäts-Gate erreichen
const MIN_TEILWEISE = 70; // „teilweise passend“ nur bei hoher berechneter Übereinstimmung

const laufend = new Map(); // gleiche Anfrage gleichzeitig → ein Aufruf

export function datenVersion(produkteRoh) {
  return createHash('sha256').update(JSON.stringify(produkteRoh)).digest('hex').slice(0, 16);
}

export async function berate({ eingabe, produkteRoh, client, config, speicher, log = () => {} }) {
  const { angaben, fehler } = kundenAngaben(eingabe);
  if (fehler.length) return { status: 400, body: { fehler } };

  // Freitext ohne KI lesen: Abneigungen gelten immer (Sicherheitsnetz), Vorlieben fließen in die Bewertung.
  if (angaben.freitext) {
    const lokal = freitextLesen(angaben.freitext);
    angaben.mag_nicht = [...new Set([...angaben.mag_nicht, ...lokal.mag_nicht])];
    angaben.mag = [...new Set([...angaben.mag, ...lokal.mag])].filter((g) => !angaben.mag_nicht.includes(g));
  }

  const profile = (Array.isArray(produkteRoh) ? produkteRoh : []).map(produktProfil).filter((p) => p.id && p.name);
  if (!profile.length) return { status: 503, body: { fehler: ['Produktdaten nicht verfügbar'] } };

  const version = datenVersion(produkteRoh);
  const schluessel = `beratung:${createHash('sha256').update(JSON.stringify([angaben, version, config.model])).digest('hex').slice(0, 32)}`;

  const zwischengespeichert = await sicher(() => speicher.get(schluessel));
  if (zwischengespeichert) {
    await sicher(() => bucheKosten(speicher, { model: config.model, tokens: null, usd: 0, art: 'cache' }));
    return { status: 200, body: { ...JSON.parse(zwischengespeichert), quelle: 'cache' } };
  }
  if (laufend.has(schluessel)) return laufend.get(schluessel);

  const arbeit = (async () => {
    const vorab = matche(profile, angaben);
    let ergebnis;
    // Claude nur fragen, wenn überhaupt ein Duft in Reichweite ist (spart Kosten bei aussichtslosen Angaben).
    const kiSinnvoll = !(config.kiNurMitFreitext && !angaben.freitext);
    const kiErlaubt = config.kiAktiv && kiSinnvoll && (vorab.kandidaten[0]?.match ?? 0) >= MIN_FUER_KI && (await unterTageslimit(speicher, config));
    if (kiErlaubt) ergebnis = await mitClaude({ angaben, profile, vorab, client, config, speicher, log });
    if (!ergebnis) ergebnis = ohneKi(angaben, profile, vorab, !config.kiAktiv ? 'ki_aus' : !kiSinnvoll ? 'ohne_freitext' : 'ki_nicht_verfuegbar');

    if (ergebnis.quelle === 'claude') await sicher(() => speicher.set(schluessel, JSON.stringify(ergebnis), CACHE_SEKUNDEN));
    if (ergebnis.quelle === 'ohne_ki') await sicher(() => bucheKosten(speicher, { model: config.model, tokens: null, usd: 0, art: 'ohne_ki' }));
    return { status: 200, body: ergebnis };
  })();
  laufend.set(schluessel, arbeit);
  try { return await arbeit; } finally { laufend.delete(schluessel); }
}

async function unterTageslimit(speicher, config) {
  const n = await sicher(() => speicher.incr(`ki_tag:${new Date().toISOString().slice(0, 10)}`, 60 * 60 * 48));
  return n === null || n <= config.maxKiProTag;
}

async function mitClaude({ angaben, profile, vorab, client, config, speicher, log }) {
  // Kandidaten: die besten der Vorbewertung plus Düfte mit ausdrücklich gewünschten Noten.
  const ids = new Set(vorab.kandidaten.slice(0, 5).map((k) => k.id));
  for (const k of vorab.kandidaten) if (ids.size < MAX_KI_KANDIDATEN && angaben.mag.some((g) => profile.find((p) => p.id === k.id)?.gruppen.includes(g))) ids.add(k.id);
  const kiProfile = profile.filter((p) => ids.has(p.id));

  const start = Date.now();
  let antwort;
  try {
    antwort = await frageClaude(client, config, angaben, kiProfile.map(profilFuerKi));
  } catch (e) {
    log({ ereignis: 'claude_fehler', fehler: e?.constructor?.name || 'Error', status: e?.status ?? null, ms: Date.now() - start });
    return null;
  }
  const modell = antwort.modell || config.model;
  const kosten = kostenUsd(config.model, antwort.usage);
  await sicher(() => bucheKosten(speicher, { model: config.model, tokens: kosten.tokens, usd: kosten.usd ?? 0, art: 'claude' }));
  log({ ereignis: 'claude_aufruf', modell, ok: antwort.ok, grund: antwort.grund ?? null, ms: Date.now() - start, tokens: kosten.tokens, usd: kosten.usd, request_id: antwort.request_id ?? null });
  if (!antwort.ok) return null;

  const gepr = validiereAntwort(antwort.json, kiProfile);
  if (gepr.fehler.length) log({ ereignis: 'claude_validierung', fehler: gepr.fehler });
  if (!gepr.ok || !gepr.bewertungen.length) return null;

  // Erkannte Vorlieben/Abneigungen übernehmen und deterministisch neu rechnen.
  const angaben2 = {
    ...angaben,
    mag_nicht: [...new Set([...angaben.mag_nicht, ...gepr.kundenwunsch.mag_nicht])],
  };
  angaben2.mag = [...new Set([...angaben.mag, ...gepr.kundenwunsch.mag])].filter((g) => !angaben2.mag_nicht.includes(g));
  const neu = matche(profile, angaben2);
  const urteil = new Map(gepr.bewertungen.map((b) => [b.product_id, b]));

  const empfehlungen = [];
  for (const k of neu.kandidaten) {
    const b = urteil.get(k.id);
    if (!b || b.urteil === 'passt_nicht') continue; // nur von der KI geprüfte Düfte; KI-Veto gilt
    if (!empfehlbar(k, b.urteil === 'teilweise' ? MIN_TEILWEISE : undefined)) continue;
    empfehlungen.push(ausgabe(profile.find((p) => p.id === k.id), k, b));
  }
  // Freie Plätze: Düfte außerhalb der geprüften Kandidaten, die die Berechnung (mit den von Claude erkannten
  // Abneigungen) bestehen – z. B. wenn eine neue Abneigung alle Kandidaten ausgeschlossen hat.
  for (const k of neu.kandidaten) {
    if (empfehlungen.length >= MAX_EMPFEHLUNGEN) break;
    if (urteil.has(k.id) || !empfehlbar(k)) continue;
    empfehlungen.push(ausgabe(profile.find((p) => p.id === k.id), k, null));
  }
  empfehlungen.sort((x, y) => y.match_score - x.match_score || (x.ki_urteil === 'passt' ? -1 : 1));

  return {
    quelle: 'claude',
    modell,
    empfehlungen: empfehlungen.slice(0, MAX_EMPFEHLUNGEN),
    kein_treffer: empfehlungen.length === 0,
    kundenwunsch: { zusammenfassung: gepr.kundenwunsch.zusammenfassung },
    hinweise: neu.hinweise,
    ausgeschlossen: neu.ausgeschlossen.length,
  };
}

async function sicher(fn) {
  try { return await fn(); } catch { return null; }
}
