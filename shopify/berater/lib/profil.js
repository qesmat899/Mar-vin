// Einheitliches Produktprofil aus den Shopify-Daten (Feed der Section bzw. collection.berater.liquid).
// Grundsatz: nichts erfinden. Jede Angabe hat eine Quelle; was nicht belegt ist, ist null (= unbekannt).
//   "shopify"    – Metafeld azizam.* / azizam_berater.* bzw. Produktdaten (von Mar freigegeben)
//   "bestaetigt" – Metafeld azizam_profil.* (gezielt ergänzt, von Mar bestätigt)
//   "abgeleitet" – Regel aus lexikon.js (Hauptnoten + Charakter-Text), keine Produktangabe

import { DIMENSIONEN, dimensionenAusNoten, gruppenImDuft, vorliebenGruppen } from './lexikon.js';

const liste = (v) => (Array.isArray(v) ? v.filter((x) => typeof x === 'string' && x.trim()) : []);
const zahl = (v) => (v === null || v === undefined || v === '' || Number.isNaN(Number(v)) ? null : Number(v));
const text = (v) => (typeof v === 'string' && v.trim() ? v.trim() : null);

export const PROFIL_FELDER = ['kopfnote', 'herznote', 'basisnote', 'haltbarkeit', 'sillage', ...DIMENSIONEN];

export function produktProfil(roh) {
  const p = roh || {};
  const bestaetigt = p.profil && typeof p.profil === 'object' ? p.profil : {};
  const noten = liste(p.noten);
  const charakter = text(p.charakter);
  const { dims: abgeleitet, erkannt } = dimensionenAusNoten(noten, charakter || '');

  const dims = {};
  for (const d of DIMENSIONEN) {
    const b = zahl(bestaetigt[d]);
    if (b !== null) dims[d] = { wert: Math.max(0, Math.min(3, b)), quelle: 'bestaetigt' };
    else if (abgeleitet[d] !== undefined) dims[d] = { wert: abgeleitet[d], quelle: 'abgeleitet' };
    else if (erkannt.length || charakter) dims[d] = { wert: 0, quelle: 'abgeleitet' }; // Noten bekannt, Dimension nicht vorhanden
    else dims[d] = { wert: null, quelle: null };
  }

  const preise = {};
  if (p.preise && typeof p.preise === 'object') {
    for (const [k, v] of Object.entries(p.preise)) if (zahl(v) !== null) preise[k] = zahl(v);
  }

  const profil = {
    id: text(p.id),
    shopify_id: text(String(p.shopify_id ?? '')) ,
    name: text(p.t),
    marke: 'Azizam',
    url: text(p.u),
    bild: text(p.img),
    bild_klein: text(p.img2),
    preis_ab_text: text(p.p),
    preise, // z. B. { "10 ml": 9.99, "30 ml": 39.99, "50 ml": 49.99 }
    varianten: Array.isArray(p.varianten) ? p.varianten.filter((v) => v && typeof v.t === 'string').map((v) => ({ t: v.t, id: v.id ? String(v.id) : null, v: v.v !== false })) : [],
    verfuegbar: p.verfuegbar !== false,
    familie: text(p.familie),
    hauptnoten: noten,
    kopfnote: liste(bestaetigt.kopfnote).length ? liste(bestaetigt.kopfnote) : null,
    herznote: liste(bestaetigt.herznote).length ? liste(bestaetigt.herznote) : null,
    basisnote: liste(bestaetigt.basisnote).length ? liste(bestaetigt.basisnote) : null,
    charakter,
    stimmung: liste(p.stimmung),
    intensitaet: zahl(p.intensitaet),
    tageszeit: text(p.tageszeit),
    saison: liste(p.saison),
    anlass: liste(p.anlass),
    tendenz: text(p.tendenz),
    nicht_buero: p.nicht_buero === true,
    haltbarkeit: zahl(bestaetigt.haltbarkeit), // 1–5, nur bestätigt
    sillage: zahl(bestaetigt.sillage), // 1–5, nur bestätigt
    dims,
    gruppen: gruppenImDuft(noten, charakter || ''), // für Ausschlüsse: Noten + Beschreibung (lieber vorsichtig)
    noten_gruppen: vorliebenGruppen(noten), // für Vorlieben: nur Kern-Hauptnoten („mag Vanille“ ≠ Honig oder „süß“)
  };
  profil.unbekannt = unbekannteFelder(profil);
  return profil;
}

export function unbekannteFelder(pr) {
  const fehlt = [];
  for (const f of ['familie', 'charakter', 'intensitaet', 'tendenz']) if (pr[f] === null) fehlt.push(f);
  for (const f of ['hauptnoten', 'stimmung', 'saison', 'anlass']) if (!pr[f].length) fehlt.push(f);
  for (const f of ['kopfnote', 'herznote', 'basisnote', 'haltbarkeit', 'sillage']) if (pr[f] === null) fehlt.push(f);
  for (const d of DIMENSIONEN) if (pr.dims[d].wert === null) fehlt.push(d);
  if (!Object.keys(pr.preise).length) fehlt.push('preise');
  return fehlt;
}

// Preis für die Budgetprüfung: 30 ml (Standardgröße), sonst der kleinste bekannte Preis ab 30 ml.
export function preisFuerBudget(pr) {
  if (pr.preise['30 ml'] !== undefined) return pr.preise['30 ml'];
  const gross = Object.entries(pr.preise).filter(([k]) => parseInt(k, 10) >= 30).map(([, v]) => v);
  return gross.length ? Math.min(...gross) : null;
}

// Kompakte Fassung für den Claude-Aufruf: nur belegte Felder, keine Bilder/URLs, Quelle je Dimension.
export function profilFuerKi(pr) {
  const dims = {};
  for (const [d, { wert, quelle }] of Object.entries(pr.dims)) if (wert !== null && wert > 0) dims[d] = `${wert}/3 (${quelle})`;
  const o = {
    product_id: pr.id,
    name: pr.name,
    familie: pr.familie,
    hauptnoten: pr.hauptnoten,
    charakter: pr.charakter,
    stimmung: pr.stimmung,
    intensitaet: pr.intensitaet === null ? 'unbekannt' : `${pr.intensitaet}/5`,
    saison: pr.saison,
    anlass: pr.anlass,
    tendenz: pr.tendenz,
    zu_stark_fuers_buero: pr.nicht_buero,
    dimensionen: dims,
    preis_30ml: preisFuerBudget(pr),
    unbekannt: pr.unbekannt,
  };
  for (const f of ['kopfnote', 'herznote', 'basisnote', 'haltbarkeit', 'sillage']) if (pr[f] !== null) o[f] = pr[f];
  return o;
}
