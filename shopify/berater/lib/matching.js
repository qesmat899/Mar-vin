// Deterministische Matching-Engine: Kundenprofil → harte Ausschlüsse → gewichtete Bewertung → Rangfolge → Qualitäts-Gate.
// Läuft identisch auf dem Server (vor und nach dem Claude-Aufruf) und im Browser (Beratung, Nachjustieren, Ersatz).
// Die Rangfolge entsteht ausschließlich hier, nie aus der KI.
//
// Bewertung in vier Teilen (Gewichte sind Hypothesen, geprüft über tests/ und scripts/qualitaet.mjs):
//   Duftprofil 50 – 12 Merkmale (süß, frisch, warm …) und Intensität gegen das Zielprofil aus den Antworten.
//                   Jeder Produktwert trägt seinen Status: bestätigt (zählt voll), abgeleitet (aus Hauptnoten, zählt
//                   weniger), unbekannt (zählt gar nicht – nie als „nicht vorhanden“).
//   Vorlieben  25 – ausdrücklich gewünschte Noten (Vanille, Kaffee, Zitrus …).
//   Charakter  15 – Stilrichtung ↔ Duftrichtung, Stimmungs-Etiketten, Richtung (feminin/maskulin).
//   Kontext    10 – Anlass und Jahreszeit.
// Teile ohne Angabe des Kunden fallen aus der Rechnung (kein Bonus, keine Strafe).

import { DIM_LABEL, NOTEN_GRUPPEN, GRUPPEN_IDS, DIMENSIONEN, norm, gruppeVonWort } from './lexikon.js';
import { preisFuerBudget } from './profil.js';

export const JAHRESZEITEN = ['Frühling', 'Sommer', 'Herbst', 'Winter'];
export const ANLASS_IDS = ['Alltag', 'Büro', 'Date', 'Abend', 'Besonderer Anlass', 'Freizeit'];
export const STIMMUNG_IDS = ['frisch', 'verspielt', 'elegant', 'gemütlich', 'sinnlich', 'geheimnisvoll', 'kraftvoll'];
export const PRAESENZ_ZIEL = { leise: 1.5, mittel: 3, laut: 4.5 };
export const PRAESENZ_LABEL = { leise: 'hautnah', mittel: 'spürbar', laut: 'unübersehbar' };
export const RICHTUNG_IDS = ['feminin', 'maskulin', 'egal'];
export const MAX_STIMMUNGEN = 2;
export const MAX_FREITEXT = 400;

// Neue, einfache Antworten (adaptive Beratung)
export const STIL_IDS = ['frisch', 'warm', 'suess', 'holzig', 'dunkel', 'unsicher'];
export const SUESSE_IDS = ['kaum', 'etwas', 'deutlich', 'egal'];
export const STAERKE_ZIEL = { dezent: 1.5, bemerkbar: 2.5, deutlich: 3.5, intensiv: 4.5 };
export const ANLASS_NEU = { alltag: ['Alltag', 'Freizeit'], arbeit: ['Büro'], abend: ['Abend', 'Besonderer Anlass'], date: ['Date'], vielseitig: null };
export const ANPASSUNG_IDS = ['weniger_suess', 'waermer', 'frischer', 'dezenter', 'intensiver'];

export const GEWICHTE = { profil: 50, vorlieben: 25, charakter: 15, kontext: 10 };
export const ABZUG_DEUTLICH = 10;
export const MIN_MATCH_BEI_WIDERSPRUCH = 80;
export const MIN_MATCH = 60; // darunter keine Empfehlung
export const MAX_EMPFEHLUNGEN = 3;
export const MIN_ANNAEHERUNG = 55;
export const MAX_ANNAEHERUNG = 2;
export const STIMMUNG_NEBEN = 0.85;
export const ANLASS_NEBEN = 0.8;
export const SAISON_GANZJAEHRIG = 0.75;

// Vertrauen je Datenstatus eines Produktwerts.
export const VERTRAUEN = { bestaetigt: 1, abgeleitet: 0.7, abgeleitet_null: 0.45 };

// Stimmungen, die eine Duftrichtung nahelegen (alte Frageform ohne Stilfrage).
const STIMMUNG_FAMILIE = { frisch: ['Frisch & klar'], geheimnisvoll: ['Dunkel & edel'], gemütlich: ['Süß & warm'], sinnlich: ['Süß & warm', 'Dunkel & edel'] };
// In der alten Frageform ist die Stimmung die Hauptangabe: ihr Teil zählt dann doppelt.
const CHARAKTER_MIT_STIMMUNG = 30;
// Passung Stilrichtung → Duftrichtung (Metafeld azizam.familie). Nicht genannte Richtungen: 0,25.
const STIL_FAMILIE = {
  frisch: { 'Frisch & klar': 1 }, warm: { 'Süß & warm': 1, 'Dunkel & edel': 0.8 }, suess: { 'Süß & warm': 1 },
  holzig: { 'Dunkel & edel': 1, 'Süß & warm': 0.4 }, dunkel: { 'Dunkel & edel': 1 },
};

// Zielprofil je Antwort: { dim: { ziel | max, w } }. Offene, prüfbare Regel – keine Produktangabe.
// min = „mindestens so viel“ (mehr davon ist kein Nachteil), ziel = „ungefähr so viel“, max = „höchstens so viel“.
// Ein Schlüssel mit „|“ (z. B. „rauchig|ledrig“) ist erfüllt, wenn eines der Merkmale passt.
const STIL_ZIEL = {
  frisch: { frische: { min: 2, w: 1 }, sauber: { min: 1, w: 0.3 }, suesse: { max: 1, w: 0.5 }, waerme: { max: 1, w: 0.5 } },
  warm: { waerme: { min: 2, w: 1 }, frische: { max: 1, w: 0.5 } },
  suess: { suesse: { min: 2, w: 1 }, cremig: { min: 1, w: 0.3 } },
  holzig: { holzig: { min: 2, w: 1 }, suesse: { max: 1.5, w: 0.4 }, frische: { max: 1.5, w: 0.3 } },
  dunkel: { 'rauchig|ledrig': { min: 2, w: 1 }, holzig: { min: 1, w: 0.3 }, frische: { max: 0.5, w: 0.5 } },
};
const STIMMUNG_ZIEL = {
  frisch: { frische: { min: 2, w: 1 } },
  verspielt: { fruchtig: { min: 1.5, w: 0.7 } },
  gemütlich: { waerme: { min: 1, w: 0.6 }, 'cremig|suesse': { min: 1.5, w: 0.5 } },
  sinnlich: { suesse: { min: 1.5, w: 0.6 }, waerme: { min: 1, w: 0.5 } },
  geheimnisvoll: { 'rauchig|ledrig': { min: 2, w: 0.8 } },
};
const SUESSE_ZIEL = { kaum: { max: 0.5, w: 1.5 }, etwas: { ziel: 1.5, w: 1 }, deutlich: { min: 2, w: 1.2 } };
// So viel Profilangabe (Summe der Gewichte × Vertrauen) entspricht dem vollen Gewicht des Profilteils.
const PROFIL_VOLL = 1.4;

const TENDENZ_WERT = {
  feminin: { feminin: 1, 'unisex-feminin': 1, unisex: 0.85, 'unisex-maskulin': 0.2, maskulin: 0 },
  maskulin: { maskulin: 1, 'unisex-maskulin': 1, unisex: 0.85, 'unisex-feminin': 0.2, feminin: 0 },
};
const STIMMUNG_GEGENSATZ = {
  frisch: (d, p) => p.familie === 'Dunkel & edel' || (d.frische === 0 && (d.rauchig >= 2 || d.suesse >= 2)),
  geheimnisvoll: (d, p) => p.familie === 'Frisch & klar' && (d.rauchig ?? 0) === 0,
  kraftvoll: (_d, p) => p.intensitaet !== null && p.intensitaet <= 1,
};
const STIMMUNG_AUS_DIMS = {
  frisch: (d) => d.frische >= 2,
  verspielt: (d) => d.fruchtig >= 2 || (d.suesse >= 1 && d.frische >= 1),
  gemütlich: (d) => d.waerme >= 1 && (d.suesse >= 2 || d.cremig >= 1),
  sinnlich: (d) => d.suesse >= 2 && d.waerme >= 1,
  geheimnisvoll: (d) => d.rauchig >= 2 || d.ledrig >= 2,
  kraftvoll: (_d, p) => (p.intensitaet ?? 0) >= 4,
};

// ---------- Kundenangaben ----------

const nimmAus = (wert, erlaubt, name, fehler) => {
  if (wert === undefined || wert === null || wert === '') return null;
  if (!erlaubt.includes(wert)) { fehler.push(`${name} ungültig`); return null; }
  return wert;
};

// Prüft und normalisiert die Angaben (Server: Eingabevalidierung; Browser: dieselbe Form).
// Versteht die alte Form (anlass, stimmung, praesenz, richtung) und die neue (stil, suesse, staerke, anlass neu).
export function kundenAngaben(roh) {
  const r = roh && typeof roh === 'object' ? roh : {};
  const fehler = [];
  const nimm = (w, e, n) => nimmAus(w, e, n, fehler);

  let anlass = null;
  let anlassNeu = null;
  if (r.anlass !== undefined && r.anlass !== null && r.anlass !== '') {
    if (ANLASS_IDS.includes(r.anlass)) anlass = r.anlass;
    else if (Object.keys(ANLASS_NEU).includes(r.anlass)) anlassNeu = r.anlass;
    else fehler.push('anlass ungültig');
  }
  const praesenz = nimm(r.praesenz, Object.keys(PRAESENZ_ZIEL), 'praesenz');
  const staerke = nimm(r.staerke, Object.keys(STAERKE_ZIEL), 'staerke');
  const richtung = nimm(r.richtung, RICHTUNG_IDS, 'richtung');
  const saison = nimm(r.saison, JAHRESZEITEN, 'saison');
  const stil = nimm(r.stil, STIL_IDS, 'stil');
  const suesse = nimm(r.suesse, SUESSE_IDS, 'suesse');
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
  // weiche Vorgaben (aus Freitext oder Nachjustieren): { dim: { ziel } | { max } }
  const weich = {};
  if (r.weich && typeof r.weich === 'object' && !Array.isArray(r.weich)) {
    for (const [d, v] of Object.entries(r.weich)) {
      if (!DIMENSIONEN.includes(d) || !v || typeof v !== 'object') { fehler.push('weich ungültig'); continue; }
      const zahl = (x) => (Number.isFinite(Number(x)) ? Math.max(0, Math.min(3, Number(x))) : undefined);
      if (v.max !== undefined && zahl(v.max) !== undefined) weich[d] = { max: zahl(v.max) };
      else if (v.min !== undefined && zahl(v.min) !== undefined) weich[d] = { min: zahl(v.min) };
      else if (v.ziel !== undefined && zahl(v.ziel) !== undefined) weich[d] = { ziel: zahl(v.ziel) };
    }
  }
  const ohne = Array.isArray(r.ohne) ? [...new Set(r.ohne.filter((x) => typeof x === 'string' && /^[a-z0-9-]{1,60}$/.test(x)))].slice(0, 19) : [];
  let staerkeVersatz = 0;
  if (r.staerke_versatz !== undefined) {
    const v = Number(r.staerke_versatz);
    if (!Number.isFinite(v) || Math.abs(v) > 3) fehler.push('staerke_versatz ungültig'); else staerkeVersatz = v;
  }

  return {
    angaben: {
      anlass, anlass_neu: anlassNeu, stimmung, praesenz, staerke, staerke_versatz: staerkeVersatz, richtung, saison, stil, suesse, budget,
      mag: mag.filter((g) => !magNicht.includes(g)), mag_nicht: magNicht, weich, ohne, freitext,
    },
    fehler,
  };
}

// Widersprüche in den Wünschen selbst (werden angezeigt, nicht „weggerechnet“).
export function widersprueche(a) {
  const w = [];
  const kraft = a.stimmung.includes('kraftvoll') || a.staerke === 'intensiv';
  if ((a.praesenz === 'leise' || a.staerke === 'dezent') && kraft) w.push('Ganz dezent und sehr kräftig zugleich ist selten – wir gewichten beides.');
  if ((a.anlass === 'Büro' || a.anlass_neu === 'arbeit') && (a.praesenz === 'laut' || a.staerke === 'intensiv')) w.push('Fürs Büro sind sehr kräftige Düfte meist zu viel – zu starke Düfte schließen wir dort aus.');
  if ((a.stimmung.includes('frisch') || a.stil === 'frisch') && (a.stimmung.includes('geheimnisvoll') || a.stil === 'dunkel')) w.push('Frisch und dunkel ziehen in verschiedene Richtungen – nur wenige Düfte verbinden beides.');
  if ((a.stimmung.includes('frisch') || a.stil === 'frisch') && a.mag_nicht.includes('zitrus') && a.mag_nicht.includes('meer')) w.push('Frisch ohne Zitrus und Meeresnoten schränkt die Auswahl stark ein.');
  if ((a.stimmung.includes('gemütlich') || a.stil === 'suess') && a.mag_nicht.includes('vanille')) w.push('Süß ohne Vanille und Süßes schränkt die Auswahl stark ein.');
  if (a.stil === 'suess' && a.suesse === 'kaum') w.push('„Süß“ und „kaum süß“ widersprechen sich – wir halten die Süße gering.');
  return w;
}

// ---------- Zielprofil ----------

function mische(ziel, teil, faktor = 1) {
  for (const [d, v] of Object.entries(teil)) {
    const alt = ziel[d];
    const w = v.w * faktor;
    if (v.max !== undefined) {
      // Begrenzungen gewinnen; bei zwei Begrenzungen die engere
      ziel[d] = { max: Math.min(alt?.max ?? 3, v.max), w: Math.max(alt?.w ?? 0, w) };
    } else if (alt?.max === undefined) {
      if (v.min !== undefined) ziel[d] = { min: Math.max(alt?.min ?? 0, v.min), w: Math.max(alt?.w ?? 0, w) };
      else ziel[d] = { ziel: v.ziel, w: Math.max(alt?.w ?? 0, w) };
    }
  }
}

// Aus den Angaben: Zielwerte je Merkmal und Zielintensität (1–5). Leer, wenn der Kunde nichts dazu gesagt hat.
export function zielprofil(a) {
  const ziel = {};
  if (a.stil && STIL_ZIEL[a.stil]) mische(ziel, STIL_ZIEL[a.stil]);
  for (const st of a.stimmung || []) if (STIMMUNG_ZIEL[st]) mische(ziel, STIMMUNG_ZIEL[st], 0.8);
  if (a.suesse && SUESSE_ZIEL[a.suesse]) {
    const s = SUESSE_ZIEL[a.suesse];
    delete ziel.suesse; // die direkte Antwort zur Süße ersetzt, was die Stilrichtung vermutet
    mische(ziel, { suesse: s });
  }
  // Freitext und Nachjustieren zuletzt: sie sind die genaueste Aussage
  for (const [d, v] of Object.entries(a.weich || {})) {
    for (const k of Object.keys(ziel)) if (k.includes('|') && k.split('|').includes(d) && v.max !== undefined) delete ziel[k];
    if (v.max !== undefined) ziel[d] = { max: Math.min(ziel[d]?.max ?? 3, v.max), w: 1.5 };
    else if (v.min !== undefined) ziel[d] = { min: v.min, w: 1.5 }; // Nachjustieren: „mehr als bisher“
    else if (v.ziel >= 2) ziel[d] = { min: Math.min(v.ziel, 2.5), w: 1.2 }; // „warm“, „süß“: mindestens deutlich
    else ziel[d] = { ziel: v.ziel, w: 1.2 }; // „leicht süß“: ungefähr so viel
  }
  let intensitaet = null;
  if (a.staerke) intensitaet = STAERKE_ZIEL[a.staerke];
  else if (a.praesenz) intensitaet = PRAESENZ_ZIEL[a.praesenz];
  else if (a.stil === 'dunkel') intensitaet = 4;
  if (intensitaet !== null && a.staerke_versatz) intensitaet = Math.max(1, Math.min(5, intensitaet + a.staerke_versatz));
  else if (intensitaet === null && a.staerke_versatz) intensitaet = 3 + a.staerke_versatz;
  return { dims: ziel, intensitaet };
}

function produktWert(p, schluessel) {
  if (schluessel.includes('|')) {
    const werte = schluessel.split('|').map((d) => produktWert(p, d)).filter(Boolean);
    return werte.length ? werte.reduce((a, b) => (b.wert > a.wert ? b : a)) : null;
  }
  const x = p.dims?.[schluessel];
  if (!x || x.wert === null || x.wert === undefined) return null;
  const v = x.quelle === 'bestaetigt' ? VERTRAUEN.bestaetigt : (x.wert > 0 ? VERTRAUEN.abgeleitet : VERTRAUEN.abgeleitet_null);
  return { wert: x.wert, vertrauen: v, quelle: x.quelle };
}

// Profilähnlichkeit 0..1 (oder null, wenn nichts vergleichbar ist), mit erfüllten Wünschen und Abweichungen.
export function profilVergleich(p, ziel) {
  let summe = 0;
  let gewicht = 0;
  const erfuellt = [];
  const abweichung = [];
  for (const [d, z] of Object.entries(ziel.dims)) {
    const pw = produktWert(p, d);
    if (!pw) continue; // unbekannt: zählt nicht
    let s;
    if (z.max !== undefined) s = pw.wert <= z.max ? 1 : Math.max(0, 1 - (pw.wert - z.max) / 1.5);
    else if (z.min !== undefined) s = pw.wert >= z.min ? 1 : Math.max(0, 1 - (z.min - pw.wert) / 2);
    else s = 1 - Math.abs(pw.wert - z.ziel) / 3;
    const soll = z.min ?? z.ziel;
    const g = z.w * pw.vertrauen;
    summe += g * s; gewicht += g;
    if (z.max !== undefined) {
      if (s === 1 && z.w >= 1) erfuellt.push(`grenze:${d}`);
      if (s < 0.5) abweichung.push({ art: 'zu_viel', dim: d, deutlich: pw.vertrauen >= VERTRAUEN.abgeleitet && pw.wert - z.max >= 1.5 });
    } else {
      const name = d.includes('|') ? d.split('|').find((x) => produktWert(p, x)?.wert === pw.wert) : d;
      if (s >= 0.8 && pw.wert >= 1.5) erfuellt.push(`dim:${name}`);
      if (s < 0.5) abweichung.push({ art: pw.wert < soll ? 'zu_wenig' : 'zu_viel', dim: d.split('|')[0], deutlich: false });
    }
  }
  if (ziel.intensitaet !== null && p.intensitaet !== null) {
    const s = Math.max(0, 1 - Math.abs(p.intensitaet - ziel.intensitaet) / 2.5);
    summe += 0.8 * s; gewicht += 0.8;
    if (s >= 0.6) erfuellt.push(`staerke:${p.intensitaet}`);
    else abweichung.push({ art: p.intensitaet > ziel.intensitaet ? 'staerker' : 'leiser', dim: 'intensitaet', deutlich: false });
  }
  return { wert: gewicht > 0 ? summe / gewicht : null, gewicht, anteil: Math.min(1, gewicht / PROFIL_VOLL), erfuellt, abweichung };
}

// ---------- Bewertung ----------

function dimWerte(p) {
  const d = {};
  for (const [k, v] of Object.entries(p.dims)) d[k] = v.wert;
  return d;
}

const anlassTags = (a) => (a.anlass ? [a.anlass] : (a.anlass_neu && ANLASS_NEU[a.anlass_neu]) || []);

// Harte Ausschlüsse. Gibt einen Grund zurück oder null.
export function ausschlussGrund(p, a) {
  if (!p.verfuegbar) return 'nicht verfügbar';
  if (a.ohne?.includes(p.id)) return 'bereits gezeigt';
  const verboten = p.gruppen.filter((g) => a.mag_nicht.includes(g));
  if (verboten.length) return `enthält ${verboten.map((g) => NOTEN_GRUPPEN[g].label).join(', ')}`;
  if ((a.anlass === 'Büro' || a.anlass_neu === 'arbeit') && p.nicht_buero) return 'zu stark fürs Büro';
  if (a.budget !== null) {
    const preis = preisFuerBudget(p);
    if (preis !== null && preis > a.budget) return `über dem Budget (30 ml: ${preis.toFixed(2).replace('.', ',')} €)`;
  }
  const ziel = a.staerke ? STAERKE_ZIEL[a.staerke] : a.praesenz ? PRAESENZ_ZIEL[a.praesenz] : null;
  if (ziel !== null && p.intensitaet !== null && Math.abs(p.intensitaet - ziel) >= 3) {
    return `Intensität ${p.intensitaet}/5 passt nicht zur gewünschten Stärke`;
  }
  return null;
}

export function bewerte(p, a) {
  const d = dimWerte(p);
  const teil = {};
  const gruende = [];
  const attribute = [];
  const konflikte = [];
  const deutlich = [];
  const datenluecken = [];
  const erfuellt = [];
  let summe = 0;
  let max = 0;
  // anteil < 1: der Kunde hat zu diesem Teil nur wenig gesagt – dann zählt er entsprechend weniger
  const gewicht = (name) => (name === 'charakter' && a.stimmung.length ? CHARAKTER_MIT_STIMMUNG : GEWICHTE[name]);
  const teilwert = (name, wert, anteil = 1) => { teil[name] = Math.round(wert * 100) / 100; summe += gewicht(name) * anteil * wert; max += gewicht(name) * anteil; };

  // 1 Duftprofil
  const ziel = zielprofil(a);
  if (Object.keys(ziel.dims).length || ziel.intensitaet !== null) {
    const v = profilVergleich(p, ziel);
    if (v.wert === null) datenluecken.push('profil');
    else {
      teilwert('profil', v.wert, Math.max(0.3, v.anteil));
      erfuellt.push(...v.erfuellt);
      for (const e of v.erfuellt) {
        const [art, dim] = e.split(':');
        if (art === 'dim') { gruende.push(DIM_LABEL[dim]); attribute.push(`profil:${dim}`); }
        if (art === 'grenze') gruende.push(`nicht zu ${DIM_LABEL[dim]}`);
        if (art === 'staerke') { gruende.push(`Intensität ${p.intensitaet}/5`); attribute.push(`intensitaet:${p.intensitaet}`); }
      }
      for (const ab of v.abweichung) {
        const t = ab.dim === 'intensitaet' ? `${ab.art === 'staerker' ? 'kräftiger' : 'dezenter'} als gewünscht`
          : ab.art === 'zu_viel' ? `${KOMPARATIV[ab.dim] || `mehr ${DIM_LABEL[ab.dim]}`} als gewünscht` : `weniger ${DIM_LABEL[ab.dim]} als gewünscht`;
        konflikte.push(t);
        if (ab.deutlich) deutlich.push(t);
      }
    }
  }

  // 2 Vorlieben (ausdrücklich gewünschte Noten)
  if (a.mag.length) {
    // Kern-Note der Gruppe – oder genau die Note, die der Kunde genannt hat („Honig“)
    const genannt = (g) => (a.mag_woerter || []).some((w) => p.hauptnoten.some((n) => { const x = norm(n); return x.startsWith(w) && gruppeVonWort(x) === g; }));
    const drin = a.mag.filter((g) => (p.noten_gruppen || p.gruppen).includes(g) || genannt(g));
    for (const g of drin) { gruende.push(`mit ${NOTEN_GRUPPEN[g].label}`); attribute.push(`noten:${g}`); erfuellt.push(`mag:${g}`); }
    teilwert('vorlieben', drin.length / a.mag.length);
  }

  // 3 Charakter: Stilrichtung, Stimmungs-Etiketten, Richtung
  const charakter = [];
  if (a.stil && STIL_FAMILIE[a.stil]) {
    if (!p.familie) datenluecken.push('familie');
    else {
      const s = STIL_FAMILIE[a.stil][p.familie] ?? 0.25;
      charakter.push(s);
      if (s >= 0.8) { attribute.push(`familie:${p.familie}`); erfuellt.push(`stil:${a.stil}`); }
    }
  }
  if (a.stimmung.length) {
    if (!p.stimmung.length && !p.hauptnoten.length) datenluecken.push('stimmung');
    let s = 0;
    for (const st of a.stimmung) {
      if (p.stimmung.includes(st)) { s += p.stimmung[0] === st ? 1 : STIMMUNG_NEBEN; gruende.push(`Stimmung: ${st}`); attribute.push(`stimmung:${st}`); erfuellt.push(`stimmung:${st}`); }
      else if (STIMMUNG_AUS_DIMS[st]?.(d, p)) { s += 0.5; gruende.push(`${st} (laut Noten)`); attribute.push(`noten:${st}`); }
      else if (STIMMUNG_GEGENSATZ[st]?.(d, p)) { const t = `eher nicht ${st}${p.familie ? ` (${p.familie})` : ''}`; konflikte.push(t); deutlich.push(t); }
    }
    charakter.push(s / a.stimmung.length);
    const familien = [...new Set(a.stimmung.flatMap((st) => STIMMUNG_FAMILIE[st] || []))];
    if (!a.stil && familien.length && p.familie) charakter.push(familien.includes(p.familie) ? 1 : 0.25);
  }
  if (a.richtung && a.richtung !== 'egal') {
    if (!p.tendenz) { datenluecken.push('tendenz'); charakter.push(0.5); }
    else {
      const s = TENDENZ_WERT[a.richtung][p.tendenz] ?? 0.5;
      if (s >= 0.7) attribute.push(`tendenz:${p.tendenz}`);
      if (s <= 0.3) { const t = `eher ${a.richtung === 'feminin' ? 'maskulin' : 'feminin'} ausgerichtet`; konflikte.push(t); deutlich.push(t); }
      charakter.push(s);
    }
  }
  if (charakter.length) teilwert('charakter', charakter.reduce((x, y) => x + y, 0) / charakter.length);

  // 4 Kontext: Anlass und Jahreszeit
  const kontext = [];
  const tags = anlassTags(a);
  if (tags.length) {
    if (!p.anlass.length) datenluecken.push('anlass');
    const treffer = tags.find((t) => p.anlass.includes(t));
    if (treffer) {
      kontext.push(p.anlass[0] === treffer || tags.includes(p.anlass[0]) ? 1 : ANLASS_NEBEN);
      gruende.push(`passt für ${ANLASS_TEXT[treffer]}`); attribute.push(`anlass:${treffer}`); erfuellt.push(`anlass:${treffer}`);
    } else if (tags.includes('Abend') && /Abend/.test(p.tageszeit || '')) { kontext.push(0.5); gruende.push('Abendduft'); attribute.push('tageszeit:Abend'); }
    else { kontext.push(0); if (p.anlass.length) konflikte.push(`eher für ${p.anlass.slice(0, 2).join(' / ')}`); }
    if (tags.includes('Büro') && (p.intensitaet ?? 0) >= 4) konflikte.push('recht kräftig fürs Büro');
  } else if (a.anlass_neu === 'vielseitig') {
    if (!p.anlass.length) datenluecken.push('anlass');
    else { const s = Math.min(1, p.anlass.length / 3); kontext.push(s); if (s >= 1) { gruende.push('für viele Gelegenheiten'); erfuellt.push('anlass:vielseitig'); } }
  }
  if (a.saison) {
    if (!p.saison.length) { datenluecken.push('saison'); kontext.push(0); }
    else if (p.saison.includes(a.saison)) {
      const ganzjaehrig = JAHRESZEITEN.every((j) => p.saison.includes(j));
      gruende.push(ganzjaehrig ? 'ganzjährig tragbar' : `passt zum ${a.saison}`); attribute.push(`saison:${a.saison}`);
      kontext.push(ganzjaehrig ? SAISON_GANZJAEHRIG : 1);
      erfuellt.push(`saison:${a.saison}`);
    } else { konflikte.push(`eher für ${p.saison.join(' / ')}`); kontext.push(0); }
  }
  if (kontext.length) teilwert('kontext', kontext.reduce((x, y) => x + y, 0) / kontext.length);
  // Weder Anlass noch Jahreszeit passen: das ist ein deutlicher Widerspruch, kein Detail.
  if (kontext.length >= 2 && kontext.every((x) => x === 0)) deutlich.push('passt weder zum Anlass noch zur Jahreszeit');

  const match = max ? Math.max(0, Math.round((summe / max) * 100) - deutlich.length * ABZUG_DEUTLICH) : 0;
  // Zuverlässig, wenn Profil oder Charakter belegt sind und nicht mehrere Kernangaben fehlen.
  const kernLuecken = ['profil', 'stimmung', 'anlass', 'saison'].filter((k) => datenluecken.includes(k));
  const hatSubstanz = teil.profil !== undefined || teil.charakter !== undefined || teil.vorlieben !== undefined;
  return {
    id: p.id,
    match,
    teilwerte: teil,
    gruende: [...new Set(gruende)],
    attribute: [...new Set(attribute)],
    erfuellt: [...new Set(erfuellt)],
    konflikte: [...new Set(konflikte)],
    deutliche_konflikte: deutlich.length,
    datenluecken,
    zuverlaessig: hatSubstanz && kernLuecken.length < 2,
  };
}

const KOMPARATIV = { suesse: 'süßer', frische: 'frischer', waerme: 'wärmer', rauchig: 'rauchiger', holzig: 'holziger', wuerzig: 'würziger', blumig: 'blumiger', fruchtig: 'fruchtiger', ledrig: 'ledriger', pudrig: 'pudriger', cremig: 'cremiger', sauber: 'sauberer' };
const ANLASS_TEXT = { Alltag: 'den Alltag', Büro: 'die Arbeit', Date: 'ein Date', Abend: 'den Abend', 'Besonderer Anlass': 'besondere Anlässe', Freizeit: 'die Freizeit' };

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

// Immer etwas zeigen, wenn es geht: erst die Annäherung (ab 55 %), sonst die zwei Düfte, die am nächsten kommen.
// Grenzen: Harte Ausschlüsse (Abneigungen, Budget, Büro) gelten weiter – ein ausgeschlossener Duft wird nie gezeigt.
// Und der Kunde muss etwas zum Duft gesagt haben (Duftart, Profil, Stimmung oder Noten), sonst gibt es nichts zu vergleichen.
export function naechstbeste(kandidaten, { max = MAX_ANNAEHERUNG } = {}) {
  const a = annaeherung(kandidaten, { max });
  if (a.length) return a;
  const mitSubstanz = (k) => k.teilwerte.profil !== undefined || k.teilwerte.charakter !== undefined || k.teilwerte.vorlieben !== undefined;
  return kandidaten.filter(mitSubstanz).slice(0, max);
}

export function empfehlbar(k, min = MIN_MATCH) {
  if (!k.zuverlaessig || k.match < min) return false;
  return !k.deutliche_konflikte || k.match >= MIN_MATCH_BEI_WIDERSPRUCH;
}

// Nachjustieren nach dem Ergebnis: verschiebt das Zielprofil relativ zum gezeigten Duft (bisherige Antworten bleiben).
export function anpassen(angaben, art, bezug) {
  const a = { ...angaben, weich: { ...(angaben.weich || {}) } };
  const wert = (d) => bezug?.dims?.[d]?.wert ?? zielprofil(angaben).dims[d]?.ziel ?? 1.5;
  if (art === 'weniger_suess') { a.weich.suesse = { max: Math.max(0, Math.min(wert('suesse'), 3) - 1) }; if (a.suesse === 'deutlich') a.suesse = 'etwas'; }
  if (art === 'waermer') { a.weich.waerme = { min: Math.min(3, wert('waerme') + 1) }; if (a.weich.frische && !a.weich.frische.max) delete a.weich.frische; }
  if (art === 'frischer') { a.weich.frische = { min: Math.min(3, wert('frische') + 1) }; if (a.weich.waerme && !a.weich.waerme.max) delete a.weich.waerme; }
  if (art === 'dezenter') a.staerke_versatz = (a.staerke_versatz || 0) - 1;
  if (art === 'intensiver') a.staerke_versatz = (a.staerke_versatz || 0) + 1;
  return a;
}

export function dimLabel(d) { return DIM_LABEL[d] || d; }
