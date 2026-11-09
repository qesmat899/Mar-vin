// Deterministische Matching-Engine: Kundenprofil → harte Ausschlüsse → gewichtete Bewertung → Match-% → Qualitäts-Gate.
// Läuft identisch auf dem Server (vor und nach dem Claude-Aufruf) und im Browser (Fallback ohne Server).
// Das Match-% entsteht ausschließlich hier, nie aus der KI.

import { DIM_LABEL, NOTEN_GRUPPEN, GRUPPEN_IDS } from './lexikon.js';
import { preisFuerBudget } from './profil.js';

export const JAHRESZEITEN = ['Frühling', 'Sommer', 'Herbst', 'Winter'];
export const ANLASS_IDS = ['Alltag', 'Büro', 'Date', 'Abend', 'Besonderer Anlass', 'Freizeit'];
export const STIMMUNG_IDS = ['frisch', 'verspielt', 'elegant', 'gemütlich', 'sinnlich', 'geheimnisvoll', 'kraftvoll'];
export const PRAESENZ_ZIEL = { leise: 1.5, mittel: 3, laut: 4.5 };
export const PRAESENZ_LABEL = { leise: 'hautnah', mittel: 'spürbar', laut: 'unübersehbar' };
export const RICHTUNG_IDS = ['feminin', 'maskulin', 'egal'];
export const MAX_STIMMUNGEN = 2;
export const MAX_FREITEXT = 400;

export const GEWICHTE = { stimmung: 35, anlass: 15, praesenz: 15, saison: 15, richtung: 10, mag: 10 };
// Deutliche Widersprüche kosten Punkte; mit deutlichem Widerspruch nur bei sehr hoher Übereinstimmung empfehlen.
export const ABZUG_DEUTLICH = 10;
export const MIN_MATCH_BEI_WIDERSPRUCH = 80;
export const MIN_MATCH = 60; // darunter keine Empfehlung
export const MAX_EMPFEHLUNGEN = 3;
// Kein Duft besteht das Gate: bis zu 2 nächstbeste zeigen (ehrlich als Annäherung gekennzeichnet), wenn sie nah genug sind.
export const MIN_ANNAEHERUNG = 55;
export const MAX_ANNAEHERUNG = 2;
// Spezifität: Ein Merkmal, das als erstes (Haupt-)Merkmal eingetragen ist, zählt voll; weitere Einträge etwas weniger.
// Ganzjährige Düfte passen zu jeder Jahreszeit, sind aber für keine eine besondere Wahl. So gewinnt nicht der Duft
// mit den meisten Einträgen, sondern der, dessen Profil am besten zum Wunsch passt.
export const STIMMUNG_NEBEN = 0.85;
export const ANLASS_NEBEN = 0.8;
export const SAISON_GANZJAEHRIG = 0.75;

const ANLASS_LABEL = { Alltag: 'den Alltag', Büro: 'das Büro', Date: 'ein Date', Abend: 'den Abend', 'Besonderer Anlass': 'besondere Anlässe', Freizeit: 'die Freizeit' };

const TENDENZ_WERT = {
  feminin: { feminin: 1, 'unisex-feminin': 1, unisex: 0.85, 'unisex-maskulin': 0.2, maskulin: 0 },
  maskulin: { maskulin: 1, 'unisex-maskulin': 1, unisex: 0.85, 'unisex-feminin': 0.2, feminin: 0 },
};

// Stimmung, die sich (schwächer) aus den Noten-Dimensionen stützen lässt. Eleganz nur über das Merkmal selbst.
const STIMMUNG_AUS_DIMS = {
  frisch: (d) => d.frische >= 2,
  verspielt: (d) => d.fruchtig >= 2 || (d.suesse >= 1 && d.frische >= 1),
  gemütlich: (d) => d.waerme >= 1 && (d.suesse >= 2 || d.cremig >= 1),
  sinnlich: (d) => d.suesse >= 2 && d.waerme >= 1,
  geheimnisvoll: (d) => d.rauchig >= 2 || d.ledrig >= 2,
  kraftvoll: (_d, p) => (p.intensitaet ?? 0) >= 4,
};
// Deutlicher Gegensatz zur gewünschten Stimmung.
const STIMMUNG_GEGENSATZ = {
  frisch: (d, p) => p.familie === 'Dunkel & edel' || (d.frische === 0 && (d.rauchig >= 2 || d.suesse >= 2)),
  geheimnisvoll: (d, p) => p.familie === 'Frisch & klar' && (d.rauchig ?? 0) === 0,
  kraftvoll: (_d, p) => p.intensitaet !== null && p.intensitaet <= 1,
};

// ---------- Kundenangaben ----------

// Prüft und normalisiert die Angaben (Server: Eingabevalidierung; Browser: dieselbe Form).
export function kundenAngaben(roh) {
  const r = roh && typeof roh === 'object' ? roh : {};
  const fehler = [];
  const nimm = (wert, erlaubt, name) => {
    if (wert === undefined || wert === null || wert === '') return null;
    if (!erlaubt.includes(wert)) { fehler.push(`${name} ungültig`); return null; }
    return wert;
  };
  const anlass = nimm(r.anlass, ANLASS_IDS, 'anlass');
  const praesenz = nimm(r.praesenz, Object.keys(PRAESENZ_ZIEL), 'praesenz');
  const richtung = nimm(r.richtung, RICHTUNG_IDS, 'richtung');
  const saison = nimm(r.saison, JAHRESZEITEN, 'saison');
  const arr = (v, erlaubt, name, max) => {
    if (v === undefined || v === null) return [];
    if (!Array.isArray(v)) { fehler.push(`${name} ungültig`); return []; }
    const ok = [...new Set(v.filter((x) => erlaubt.includes(x)))];
    if (ok.length !== v.length) fehler.push(`${name} enthält ungültige Werte`);
    return ok.slice(0, max);
  };
  const stimmung = arr(r.stimmung, STIMMUNG_IDS, 'stimmung', MAX_STIMMUNGEN);
  const magNicht = arr(r.mag_nicht, GRUPPEN_IDS, 'mag_nicht', GRUPPEN_IDS.length);
  const mag = arr(r.mag, GRUPPEN_IDS, 'mag', GRUPPEN_IDS.length);
  let budget = null;
  if (r.budget !== undefined && r.budget !== null && r.budget !== '') {
    const b = Number(r.budget);
    if (!Number.isFinite(b) || b < 5 || b > 1000) fehler.push('budget ungültig');
    else budget = Math.round(b * 100) / 100;
  }
  let freitext = '';
  if (r.freitext !== undefined && r.freitext !== null) {
    if (typeof r.freitext !== 'string') fehler.push('freitext ungültig');
    else freitext = r.freitext.replace(/[\u0000-\u001f\u007f]/g, ' ').replace(/\s+/g, ' ').trim().slice(0, MAX_FREITEXT);
  }
  return {
    angaben: { anlass, stimmung, praesenz, richtung, saison, budget, mag: mag.filter((g) => !magNicht.includes(g)), mag_nicht: magNicht, freitext },
    fehler,
  };
}

// Widersprüche in den Wünschen selbst (werden angezeigt, nicht „weggerechnet“).
export function widersprueche(a) {
  const w = [];
  if (a.praesenz === 'leise' && a.stimmung.includes('kraftvoll')) w.push('Hautnah und kraftvoll zugleich ist selten – wir gewichten beides, die Intensität entscheidet mit.');
  if (a.anlass === 'Büro' && a.praesenz === 'laut') w.push('Fürs Büro sind sehr präsente Düfte meist zu viel – zu starke Düfte schließen wir dort aus.');
  if (a.stimmung.includes('frisch') && a.stimmung.includes('geheimnisvoll')) w.push('Frisch und geheimnisvoll ziehen in verschiedene Richtungen – es gibt nur wenige Düfte, die beides verbinden.');
  if (a.stimmung.includes('frisch') && a.mag_nicht.includes('zitrus') && a.mag_nicht.includes('meer')) w.push('Frisch ohne Zitrus und Meeresnoten schränkt die Auswahl stark ein.');
  if (a.stimmung.includes('gemütlich') && a.mag_nicht.includes('vanille')) w.push('Gemütlich ohne Vanille & Süßes schränkt die Auswahl stark ein.');
  return w;
}

// ---------- Bewertung ----------

function dimWerte(p) {
  const d = {};
  for (const [k, v] of Object.entries(p.dims)) d[k] = v.wert;
  return d;
}

// Harte Ausschlüsse. Gibt einen Grund zurück oder null.
export function ausschlussGrund(p, a) {
  if (!p.verfuegbar) return 'nicht verfügbar';
  const verboten = p.gruppen.filter((g) => a.mag_nicht.includes(g));
  if (verboten.length) return `enthält ${verboten.map((g) => NOTEN_GRUPPEN[g].label).join(', ')}`;
  if (a.anlass === 'Büro' && p.nicht_buero) return 'zu stark fürs Büro';
  if (a.budget !== null) {
    const preis = preisFuerBudget(p);
    if (preis !== null && preis > a.budget) return `über dem Budget (30 ml: ${preis.toFixed(2).replace('.', ',')} €)`;
  }
  if (a.praesenz && p.intensitaet !== null && Math.abs(p.intensitaet - PRAESENZ_ZIEL[a.praesenz]) >= 3) {
    return `Intensität ${p.intensitaet}/5 passt nicht zu „${PRAESENZ_LABEL[a.praesenz]}“`;
  }
  return null;
}

export function bewerte(p, a) {
  const d = dimWerte(p);
  const teil = {};
  const gruende = [];
  const attribute = [];
  const konflikte = [];
  const deutlich = []; // deutliche Widersprüche (Gegensatz zur Stimmung, entgegengesetzte Richtung)
  const datenluecken = [];
  let summe = 0;
  let max = 0;
  const kriterium = (name, wert) => { teil[name] = Math.round(wert * 100) / 100; summe += GEWICHTE[name] * wert; max += GEWICHTE[name]; };

  if (a.stimmung.length) {
    if (!p.stimmung.length && !p.hauptnoten.length) datenluecken.push('stimmung');
    let s = 0;
    for (const st of a.stimmung) {
      if (p.stimmung.includes(st)) { s += p.stimmung[0] === st ? 1 : STIMMUNG_NEBEN; gruende.push(`Stimmung: ${st}`); attribute.push(`stimmung:${st}`); }
      else if (STIMMUNG_AUS_DIMS[st]?.(d, p)) { s += 0.5; gruende.push(`${st} (laut Noten)`); attribute.push(`noten:${st}`); }
      else if (STIMMUNG_GEGENSATZ[st]?.(d, p)) { const t = `eher nicht ${st}${p.familie ? ` (${p.familie})` : ''}`; konflikte.push(t); deutlich.push(t); }
    }
    kriterium('stimmung', s / a.stimmung.length);
  }

  if (a.anlass) {
    if (!p.anlass.length) datenluecken.push('anlass');
    let s = 0;
    if (p.anlass.includes(a.anlass)) { s = p.anlass[0] === a.anlass ? 1 : ANLASS_NEBEN; gruende.push(`passt für ${ANLASS_LABEL[a.anlass]}`); attribute.push(`anlass:${a.anlass}`); }
    else if (a.anlass === 'Abend' && /Abend/.test(p.tageszeit || '')) { s = 0.5; gruende.push('Abendduft'); attribute.push('tageszeit:Abend'); }
    else if (p.anlass.length) konflikte.push(`eher für ${p.anlass.slice(0, 2).join(' / ')}`);
    if (a.anlass === 'Büro' && (p.intensitaet ?? 0) >= 4) konflikte.push('recht präsent fürs Büro');
    kriterium('anlass', s);
  }

  if (a.praesenz) {
    if (p.intensitaet === null) { datenluecken.push('intensitaet'); kriterium('praesenz', 0); }
    else {
      const abst = Math.abs(p.intensitaet - PRAESENZ_ZIEL[a.praesenz]);
      const s = Math.max(0, 1 - abst / 2.5);
      if (abst <= 1) { gruende.push(`Intensität ${p.intensitaet}/5 – ${PRAESENZ_LABEL[a.praesenz]}`); attribute.push(`intensitaet:${p.intensitaet}`); }
      else konflikte.push(`Intensität ${p.intensitaet}/5 – ${p.intensitaet > PRAESENZ_ZIEL[a.praesenz] ? 'stärker' : 'leiser'} als gewünscht`);
      kriterium('praesenz', s);
    }
  }

  if (a.saison) {
    if (!p.saison.length) { datenluecken.push('saison'); kriterium('saison', 0); }
    else if (p.saison.includes(a.saison)) {
      const ganzjaehrig = JAHRESZEITEN.every((j) => p.saison.includes(j));
      gruende.push(ganzjaehrig ? 'ganzjährig tragbar' : `passt zum ${a.saison}`); attribute.push(`saison:${a.saison}`);
      kriterium('saison', ganzjaehrig ? SAISON_GANZJAEHRIG : 1);
    }
    else { konflikte.push(`eher für ${p.saison.join(' / ')}`); kriterium('saison', 0); }
  }

  if (a.richtung && a.richtung !== 'egal') {
    if (!p.tendenz) { datenluecken.push('tendenz'); kriterium('richtung', 0.5); }
    else {
      const s = TENDENZ_WERT[a.richtung][p.tendenz] ?? 0.5;
      if (s >= 0.7) attribute.push(`tendenz:${p.tendenz}`);
      if (s <= 0.3) { const t = `eher ${a.richtung === 'feminin' ? 'maskulin' : 'feminin'} ausgerichtet`; konflikte.push(t); deutlich.push(t); }
      kriterium('richtung', s);
    }
  }

  if (a.mag.length) {
    const drin = a.mag.filter((g) => p.gruppen.includes(g));
    for (const g of drin) { gruende.push(`mit ${NOTEN_GRUPPEN[g].label}`); attribute.push(`noten:${g}`); }
    kriterium('mag', drin.length / a.mag.length);
  }

  const match = max ? Math.max(0, Math.round((summe / max) * 100) - deutlich.length * ABZUG_DEUTLICH) : 0;
  const kernLuecken = ['stimmung', 'anlass', 'intensitaet', 'saison'].filter((k) => datenluecken.includes(k));
  return {
    id: p.id,
    match,
    teilwerte: teil,
    gruende: [...new Set(gruende)],
    attribute: [...new Set(attribute)],
    konflikte: [...new Set(konflikte)],
    deutliche_konflikte: deutlich.length,
    datenluecken,
    zuverlaessig: kernLuecken.length < 2,
  };
}

// Gesamter deterministischer Durchlauf über alle Produkte.
export function matche(profile, angaben) {
  const ausgeschlossen = [];
  const bewertet = [];
  profile.forEach((p, idx) => {
    const grund = ausschlussGrund(p, angaben);
    if (grund) ausgeschlossen.push({ id: p.id, grund });
    else bewertet.push({ ...bewerte(p, angaben), _idx: idx });
  });
  // Gleichstand: weniger Widersprüche, dann das spezifischere Profil (weniger Einträge) – nicht die Reihenfolge im Shop.
  const breite = (id) => { const p = profile.find((x) => x.id === id); return p.stimmung.length + p.anlass.length + p.saison.length; };
  bewertet.sort((x, y) => y.match - x.match || x.konflikte.length - y.konflikte.length || breite(x.id) - breite(y.id) || x._idx - y._idx);
  return { kandidaten: bewertet.map(({ _idx, ...r }) => r), ausgeschlossen, hinweise: widersprueche(angaben) };
}

// Qualitäts-Gate: nur ausreichend passende, zuverlässig belegte Düfte; lieber weniger als falsche.
export function waehleAus(kandidaten, { min = MIN_MATCH, max = MAX_EMPFEHLUNGEN } = {}) {
  return kandidaten.filter((k) => empfehlbar(k, min)).slice(0, max);
}

// Annäherung, wenn nichts das Gate besteht: die nächstbesten, zuverlässig belegten Düfte ohne harten Ausschluss.
export function annaeherung(kandidaten, { min = MIN_ANNAEHERUNG, max = MAX_ANNAEHERUNG } = {}) {
  return kandidaten.filter((k) => k.zuverlaessig && k.match >= min).slice(0, max);
}

export function empfehlbar(k, min = MIN_MATCH) {
  if (!k.zuverlaessig || k.match < min) return false;
  return !k.deutliche_konflikte || k.match >= MIN_MATCH_BEI_WIDERSPRUCH;
}

export function dimLabel(d) { return DIM_LABEL[d] || d; }
