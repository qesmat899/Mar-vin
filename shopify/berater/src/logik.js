// Duftberater – automatische Jahreszeit und Nachjustier-Optionen für die Oberfläche.
// Fragen, Reihenfolge und Bewertung stecken in ../lib (gemeinsam mit dem Server).
export { JAHRESZEITEN, MAX_FREITEXT } from '../lib/matching.js';
export { FRAGEN } from '../lib/gespraech.js';

// Meteorologische Jahreszeiten (Deutschland): Mär–Mai, Jun–Aug, Sep–Nov, Dez–Feb.
export function jahreszeit(datum = new Date()) {
  const m = datum.getMonth(); // 0 = Januar
  if (m >= 2 && m <= 4) return 'Frühling';
  if (m >= 5 && m <= 7) return 'Sommer';
  if (m >= 8 && m <= 10) return 'Herbst';
  return 'Winter';
}

// Nach dem Ergebnis: Empfehlung verändern, ohne neu anzufangen.
export const NACHJUSTIEREN = [
  { id: 'weniger_suess', label: 'Etwas weniger süß' },
  { id: 'waermer', label: 'Etwas wärmer' },
  { id: 'frischer', label: 'Etwas frischer' },
  { id: 'dezenter', label: 'Etwas dezenter' },
  { id: 'intensiver', label: 'Etwas intensiver' },
  { id: 'andere', label: 'Andere Vorschläge' },
];
