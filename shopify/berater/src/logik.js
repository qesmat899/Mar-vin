// Duftberater – reine Logik ohne React (testbar mit `npm test`).
// Daten kommen aus den Produkt-Metafeldern azizam.* und azizam_berater.* (siehe Section azizam-berater.liquid).

export const JAHRESZEITEN = ['Frühling', 'Sommer', 'Herbst', 'Winter'];

// Meteorologische Jahreszeiten (Deutschland): Mär–Mai, Jun–Aug, Sep–Nov, Dez–Feb.
export function jahreszeit(datum = new Date()) {
  const m = datum.getMonth(); // 0 = Januar
  if (m >= 2 && m <= 4) return 'Frühling';
  if (m >= 5 && m <= 7) return 'Sommer';
  if (m >= 8 && m <= 10) return 'Herbst';
  return 'Winter';
}

export const ANLAESSE = [
  { id: 'Alltag', label: 'Alltag', sub: 'Uni · Freunde · unterwegs' },
  { id: 'Büro', label: 'Büro', sub: 'Arbeit · Meetings · nah an anderen' },
  { id: 'Date', label: 'Date', sub: 'Nähe · erster Eindruck' },
  { id: 'Abend', label: 'Abend & Ausgehen', sub: 'Dinner · Bar · Nacht' },
  { id: 'Besonderer Anlass', label: 'Besonderer Anlass', sub: 'Hochzeit · Feier · Abschluss' },
  { id: 'Freizeit', label: 'Freizeit', sub: 'Wochenende · draußen · Sport' },
];

export const STIMMUNGEN = [
  { id: 'frisch', label: 'Frisch', sub: 'klar · hell · sauber' },
  { id: 'verspielt', label: 'Verspielt', sub: 'leicht · fruchtig · gut gelaunt' },
  { id: 'elegant', label: 'Elegant', sub: 'ruhig · gepflegt · stilvoll' },
  { id: 'gemütlich', label: 'Gemütlich', sub: 'warm · weich · nah' },
  { id: 'sinnlich', label: 'Sinnlich', sub: 'tief · süß · auf der Haut' },
  { id: 'geheimnisvoll', label: 'Geheimnisvoll', sub: 'dunkel · rauchig · leise' },
  { id: 'kraftvoll', label: 'Kraftvoll', sub: 'präsent · markant · bleibt' },
];
export const MAX_STIMMUNGEN = 2;

export const PRAESENZ = [
  { id: 'leise', label: 'Hautnah', sub: 'Nur wer nah ist', ziel: 1.5 },
  { id: 'mittel', label: 'Spürbar', sub: 'Man bemerkt dich', ziel: 3 },
  { id: 'laut', label: 'Unübersehbar', sub: 'Man erinnert sich', ziel: 4.5 },
];

export const RICHTUNG = [
  { id: 'feminin', label: 'Eher feminin', sub: 'weicher · blumiger' },
  { id: 'maskulin', label: 'Eher maskulin', sub: 'herber · holziger' },
  { id: 'egal', label: 'Ganz egal', sub: 'Hauptsache, er passt' },
];

const TENDENZ = {
  feminin: { 'unisex-feminin': 2, unisex: 1, 'unisex-maskulin': -0.5, maskulin: -2, feminin: 2.5 },
  maskulin: { 'unisex-maskulin': 2, unisex: 1, 'unisex-feminin': -0.5, feminin: -2, maskulin: 2.5 },
  egal: { unisex: 0.5 },
};

const liste = (v) => (Array.isArray(v) ? v : []);

// Bewertet einen Duft gegen die Antworten. Gibt Punktzahl und Gründe (für die Anzeige) zurück.
export function bewerte(p, a) {
  let s = 0;
  const gruende = [];
  const anl = liste(p.anlass);
  const saison = liste(p.saison);
  const stimmung = liste(p.stimmung);
  const i = Number(p.intensitaet) || 3;

  if (a.anlass) {
    if (anl.includes(a.anlass)) { s += 4; gruende.push(ANLAESSE.find((x) => x.id === a.anlass)?.label || a.anlass); }
    if (a.anlass === 'Abend' && /Abend/.test(p.tageszeit || '')) s += 1;
    if (a.anlass === 'Büro') {
      if (p.nicht_buero) s -= 6;
      else if (i >= 4) s -= 2;
    }
  }

  for (const st of liste(a.stimmung)) {
    if (stimmung.includes(st)) { s += 3; gruende.push(STIMMUNGEN.find((x) => x.id === st)?.label || st); }
  }

  if (a.praesenz) {
    const ziel = PRAESENZ.find((x) => x.id === a.praesenz)?.ziel ?? 3;
    s += 2.5 - Math.abs(i - ziel) * 1.2;
  }

  if (a.saison) {
    if (saison.includes(a.saison)) { s += 2.5; gruende.push(`passt zum ${a.saison}`); }
    else s -= 1.5;
  }

  if (a.richtung) s += TENDENZ[a.richtung]?.[p.tendenz] ?? 0;

  return { punkte: Math.round(s * 100) / 100, gruende };
}

// Sortiert alle Düfte; bei Gleichstand gewinnt die Reihenfolge im Shop (stabil).
export function empfehlung(produkte, antworten, anzahl = 3) {
  return produkte
    .map((p, idx) => ({ p, idx, ...bewerte(p, antworten) }))
    .sort((x, y) => y.punkte - x.punkte || x.idx - y.idx)
    .slice(0, anzahl);
}
