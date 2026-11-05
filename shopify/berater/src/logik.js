// Duftberater – Auswahloptionen der Oberfläche und automatische Jahreszeit.
// Die Bewertung selbst steckt in ../lib (gemeinsam mit dem Server).
export { JAHRESZEITEN, MAX_STIMMUNGEN, MAX_FREITEXT } from '../lib/matching.js';
import { NOTEN_GRUPPEN } from '../lib/lexikon.js';

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

export const PRAESENZ = [
  { id: 'leise', label: 'Hautnah', sub: 'Nur wer nah ist' },
  { id: 'mittel', label: 'Spürbar', sub: 'Man bemerkt dich' },
  { id: 'laut', label: 'Unübersehbar', sub: 'Man erinnert sich' },
];

export const RICHTUNG = [
  { id: 'feminin', label: 'Eher feminin', sub: 'weicher · blumiger' },
  { id: 'maskulin', label: 'Eher maskulin', sub: 'herber · holziger' },
  { id: 'egal', label: 'Ganz egal', sub: 'Hauptsache, er passt' },
];

export const ABNEIGUNGEN = Object.entries(NOTEN_GRUPPEN).map(([id, g]) => ({ id, label: g.label }));

export const BUDGETS = [
  { id: 35, label: 'bis 35 €' },
  { id: null, label: 'egal' },
];
