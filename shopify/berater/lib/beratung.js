// Ablauf einer Beratung (serverseitig):
// 1 Angaben prüfen → 2 Kundenprofil (Karten + Freitext) → 3 Produktprofile aus Shopify → 4 harte Ausschlüsse
// → 5 gewichtete Bewertung → 6 EIN Claude-Aufruf für die besten Kandidaten → 7 Neuberechnung + Widerspruchsprüfung
// → 8 Qualitäts-Gate. Ohne Schlüssel, bei Fehlern oder über dem Tageslimit: dieselbe Logik ohne KI (ehrlich gekennzeichnet).

import { createHash } from 'node:crypto';
import { produktProfil, profilFuerKi } from './profil.js';
import { kundeAufbauen } from './kunde.js';
import { notenwortImText } from './verstehen.js';
import { matche, empfehlbar, annaeherung, MAX_EMPFEHLUNGEN } from './matching.js';
import { frageClaude, validiereAntwort } from './claude.js';
import { kostenUsd, bucheKosten } from './kosten.js';
import { ohneKi, ausgabe, mitUnterschieden } from './ergebnis.js';

export const CACHE_SEKUNDEN = 60 * 60 * 24 * 7;
const MAX_KI_KANDIDATEN = 20;
const MIN_TEILWEISE = 70; // „teilweise passend“ nur bei hoher berechneter Übereinstimmung
const KI_PASST_BONUS = 8; // nur für die Reihenfolge, nicht für das angezeigte Match-%

const laufend = new Map(); // gleiche Anfrage gleichzeitig → ein Aufruf

export function datenVersion(produkteRoh) {
  return createHash('sha256').update(JSON.stringify(produkteRoh)).digest('hex').slice(0, 16);
}

export async function berate({ eingabe, produkteRoh, client, config, speicher, log = () => {} }) {
  // Antworten + Freitext (ohne KI gelesen): eindeutige Abneigungen gelten sofort, Gradangaben nur als weiche Vorgabe.
  const { angaben, fehler } = kundeAufbauen(eingabe);
  if (fehler.length) return { status: 400, body: { fehler } };

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
    const kiErlaubt = config.kiAktiv && vorab.kandidaten.length > 0 && (await unterTageslimit(speicher, config));
    if (kiErlaubt) ergebnis = await mitClaude({ angaben, profile, vorab, client, config, speicher, log });
    if (!ergebnis) ergebnis = ohneKi(angaben, profile, vorab, config.kiAktiv ? 'ki_nicht_verfuegbar' : 'ki_aus');

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
  // Kandidaten: alle nicht ausgeschlossenen Düfte (bei unserem Sortiment wenige), damit die KI nichts übersieht.
  const ids = new Set(vorab.kandidaten.slice(0, MAX_KI_KANDIDATEN).map((k) => k.id));
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
  // Abneigungen der KI nur übernehmen, wenn sie an einem Notenwort im Freitext hängen (nie aus „nicht zu süß“).
  const kiNicht = gepr.kundenwunsch.mag_nicht.filter((g) => angaben.freitext && notenwortImText(angaben.freitext, g));
  const angaben2 = {
    ...angaben,
    mag_nicht: [...new Set([...angaben.mag_nicht, ...kiNicht])],
  };
  angaben2.mag = [...new Set([...angaben.mag, ...gepr.kundenwunsch.mag])].filter((g) => !angaben2.mag_nicht.includes(g));
  const neu = matche(profile, angaben2);
  const urteil = new Map(gepr.bewertungen.map((b) => [b.product_id, b]));

  const empfehlungen = [];
  for (const k of neu.kandidaten) {
    const b = urteil.get(k.id);
    if (!b || b.urteil === 'passt_nicht') continue; // nur von der KI geprüfte Düfte; KI-Veto gilt
    if (!empfehlbar(k, b.urteil === 'teilweise' ? MIN_TEILWEISE : undefined)) continue;
    empfehlungen.push(ausgabe(profile.find((p) => p.id === k.id), k, b, angaben2));
  }
  // Das KI-Urteil zählt mit: „passt“ (stimmiges Gesamtprofil) wird vor „teilweise“ gereiht, wenn die Punkte nah beieinander liegen.
  const rang = (e) => e.match_score + (e.ki_urteil === 'passt' ? KI_PASST_BONUS : 0);
  empfehlungen.sort((x, y) => rang(y) - rang(x) || y.match_score - x.match_score);

  // Nichts besteht: nächstbeste zeigen, aber nie gegen ein KI-Veto.
  let naeherung = false;
  if (!empfehlungen.length) {
    const ohneVeto = neu.kandidaten.filter((k) => urteil.get(k.id)?.urteil !== 'passt_nicht');
    for (const k of annaeherung(ohneVeto)) empfehlungen.push(ausgabe(profile.find((p) => p.id === k.id), k, urteil.get(k.id) ?? null, angaben2));
    naeherung = empfehlungen.length > 0;
  }

  return {
    quelle: 'claude',
    modell,
    empfehlungen: mitUnterschieden(empfehlungen.slice(0, MAX_EMPFEHLUNGEN), profile),
    annaeherung: naeherung,
    kein_treffer: empfehlungen.length === 0,
    kundenwunsch: { zusammenfassung: gepr.kundenwunsch.zusammenfassung },
    hinweise: neu.hinweise,
    ausgeschlossen: neu.ausgeschlossen.length,
  };
}

async function sicher(fn) {
  try { return await fn(); } catch { return null; }
}
