// Noten-Lexikon: übersetzt die Hauptnoten (Metafeld azizam.noten) und Schlüsselwörter aus dem Charakter-Text
// (azizam.charakter) in Duftdimensionen. Das ist eine offene, prüfbare Regel, keine Produktangabe:
// Werte daraus tragen immer die Quelle "abgeleitet" und werden durch bestätigte Werte
// (Metafelder azizam_profil.*) ersetzt, sobald Mar sie einträgt.

export const DIMENSIONEN = [
  'suesse', 'frische', 'waerme', 'rauchig', 'holzig', 'wuerzig', 'blumig', 'fruchtig', 'ledrig', 'pudrig', 'cremig', 'sauber',
];

export const DIM_LABEL = {
  suesse: 'süß', frische: 'frisch', waerme: 'warm', rauchig: 'rauchig', holzig: 'holzig', wuerzig: 'würzig',
  blumig: 'blumig', fruchtig: 'fruchtig', ledrig: 'ledrig', pudrig: 'pudrig', cremig: 'cremig', sauber: 'sauber',
};

// Notengruppen: für „mag ich“ / „mag ich nicht“ (Karten und Freitext). Schlüssel = stabile IDs (auch im JSON-Schema).
export const NOTEN_GRUPPEN = {
  vanille: { label: 'Vanille & Süßes', woerter: ['vanille', 'tonka', 'honig', 'karamell', 'zucker', 'bittermandel', 'süß', 'süße', 'süßes', 'süßer', 'suess', 'gourmand'] },
  oud: { label: 'Oud & Rauch', woerter: ['oud', 'weihrauch', 'rauch', 'rauchig', 'birkenholz'] },
  leder: { label: 'Leder', woerter: ['leder', 'ledrig'] },
  blumig: { label: 'Rose & Blüten', woerter: ['rose', 'rosen', 'jasmin', 'orangenblüte', 'blüte', 'blüten', 'blumig', 'lavendel'] },
  kaffee: { label: 'Kaffee', woerter: ['kaffee', 'espresso', 'coffee'] },
  tabak: { label: 'Tabak', woerter: ['tabak'] },
  zitrus: { label: 'Zitrus', woerter: ['zitrone', 'zitrus', 'zitrusfrüchte', 'bergamotte', 'orange', 'limette', 'grapefruit'] },
  meer: { label: 'Meer & Aquatisch', woerter: ['meer', 'meeres', 'algen', 'salzig', 'aquatisch', 'marin', 'mineralisch'] },
  frucht: { label: 'Früchte', woerter: ['frucht', 'früchte', 'fruchtig', 'ananas', 'birne', 'himbeere', 'maracuja', 'johannisbeere', 'apfel', 'trockenfrüchte', 'mittelmeerfrüchte'] },
  gewuerz: { label: 'Gewürze', woerter: ['zimt', 'kardamom', 'safran', 'pfeffer', 'gewürz', 'würzig'] },
  holz: { label: 'Hölzer', woerter: ['holz', 'hölzer', 'holzig', 'zedernholz', 'zeder', 'sandelholz', 'sandel', 'patschuli'] },
  moschus: { label: 'Moschus & Sauber', woerter: ['moschus', 'sauber', 'wäsche', 'clean'] },
  pudrig: { label: 'Pudrig', woerter: ['pudrig', 'puder'] },
  cremig: { label: 'Cremig', woerter: ['cremig', 'cremige', 'cremiger', 'creme', 'sahnig', 'milchig'] },
};
export const GRUPPEN_IDS = Object.keys(NOTEN_GRUPPEN);

// Beitrag einer Note zu den Dimensionen (0–3 nach Summierung und Kappung).
const NOTE_DIM = {
  vanille: { suesse: 2, waerme: 1, cremig: 1 },
  tonka: { suesse: 2, waerme: 1 },
  honig: { suesse: 2, waerme: 1 },
  bittermandel: { suesse: 1 },
  kaffee: { waerme: 1 },
  rose: { blumig: 2 },
  jasmin: { blumig: 2 },
  orangenblüte: { blumig: 2, frische: 1 },
  lavendel: { blumig: 1, frische: 1 },
  zitrone: { frische: 2 },
  zitrusfrüchte: { frische: 2 },
  minze: { frische: 2 },
  algen: { frische: 2 },
  'schwarzer tee': { frische: 1 },
  zimt: { wuerzig: 2, waerme: 1 },
  kardamom: { wuerzig: 2 },
  safran: { wuerzig: 1, waerme: 1 },
  oud: { holzig: 2, rauchig: 2, waerme: 1 },
  weihrauch: { rauchig: 2 },
  birkenholz: { holzig: 2, rauchig: 1 },
  zedernholz: { holzig: 2 },
  sandelholz: { holzig: 2, cremig: 1 },
  patschuli: { holzig: 1 },
  leder: { ledrig: 2, rauchig: 1 },
  tabak: { waerme: 1, rauchig: 1 },
  rum: { waerme: 1, suesse: 1 },
  amber: { waerme: 2, suesse: 1 },
  trockenfrüchte: { fruchtig: 1, suesse: 1 },
  ananas: { fruchtig: 2 },
  birne: { fruchtig: 2 },
  himbeere: { fruchtig: 2 },
  maracuja: { fruchtig: 2 },
  'schwarze johannisbeere': { fruchtig: 2 },
  mittelmeerfrüchte: { fruchtig: 2 },
  moschus: { sauber: 2 },
  pudrig: { pudrig: 2, sauber: 1 },
  cremig: { cremig: 2 },
};

// Schlüsselwörter im Charakter-Text (von Mar freigegeben). Mit Verneinung davor („wenig rauchig“) zählen sie nicht.
const TEXT_DIM = {
  süß: 'suesse', süße: 'suesse', frisch: 'frische', frischer: 'frische', kühl: 'frische', kühler: 'frische',
  warm: 'waerme', warme: 'waerme', rauchig: 'rauchig', rauchiges: 'rauchig', holz: 'holzig', holzig: 'holzig',
  würzig: 'wuerzig', pudrig: 'pudrig', pudrige: 'pudrig', cremig: 'cremig', sauberem: 'sauber', sauber: 'sauber',
  fruchtig: 'fruchtig', fruchtige: 'fruchtig', früchte: 'fruchtig', leder: 'ledrig', lederduft: 'ledrig',
};
const VERNEINUNG = ['wenig', 'kaum', 'ohne', 'nicht', 'nichts', 'kein', 'keine', 'keinen', 'keinem', 'nie', 'bloß', 'bloss'];

export const norm = (s) => String(s || '').toLowerCase().normalize('NFC').trim();

function woerter(text) {
  return norm(text).replace(/[^a-zäöüß\s-]/g, ' ').split(/\s+/).filter(Boolean);
}

// Dimensionen aus Noten + Charakter. Ergebnis: { dim: 0..3 } nur für erkannte Dimensionen, plus erkannte Noten.
export function dimensionenAusNoten(noten = [], charakter = '') {
  const summe = {};
  const erkannt = [];
  for (const n of noten) {
    const k = norm(n);
    const beitrag = NOTE_DIM[k];
    if (!beitrag) continue;
    erkannt.push(n);
    for (const [d, w] of Object.entries(beitrag)) summe[d] = (summe[d] || 0) + w;
  }
  const w = woerter(charakter);
  w.forEach((wort, i) => {
    const d = TEXT_DIM[wort];
    if (!d) return;
    const davor = w.slice(Math.max(0, i - 2), i);
    if (davor.some((x) => VERNEINUNG.includes(x))) return;
    summe[d] = (summe[d] || 0) + 1;
  });
  const dims = {};
  for (const [d, v] of Object.entries(summe)) dims[d] = Math.min(3, v);
  return { dims, erkannt };
}

// Ordnet ein Wort genau einer Notengruppe zu: exakter Begriff vor Präfix, längster Begriff gewinnt
// („orangenblüte“ ist Blüte, nicht Zitrus; „rauchigem“ → Oud & Rauch).
export function gruppeVonWort(wort) {
  let best = null;
  let bestLen = 0;
  for (const [id, g] of Object.entries(NOTEN_GRUPPEN)) {
    for (const gw of g.woerter) {
      const len = wort === gw ? 1000 + gw.length : (gw.length > 4 && wort.startsWith(gw) ? gw.length : 0);
      if (len > bestLen) { best = id; bestLen = len; }
    }
  }
  return best;
}

// Welche Notengruppen stecken in einem Duft (Noten + Charakter, Verneinungen ausgenommen)?
export function gruppenImDuft(noten = [], charakter = '') {
  const text = woerter([...noten, charakter].join(' '));
  const treffer = new Set();
  text.forEach((wort, i) => {
    const davor = text.slice(Math.max(0, i - 2), i);
    if (davor.some((x) => VERNEINUNG.includes(x))) return;
    const id = gruppeVonWort(wort);
    if (id) treffer.add(id);
  });
  return [...treffer];
}

// Einfacher Freitext-Leser ohne KI (Sicherheitsnetz und Fallback): findet Notengruppen und ob sie verneint sind.
// „kein Oud“, „ohne Vanille“, „Rosen mag ich nicht“, „hasse Leder“ → mag_nicht; sonst mag.
export function freitextLesen(text) {
  const w = woerter(text).slice(0, 120);
  const mag = new Set();
  const magNicht = new Set();
  w.forEach((wort, i) => {
    const id = gruppeVonWort(wort);
    if (id) {
      const davor = w.slice(Math.max(0, i - 3), i);
      const danach = w.slice(i + 1, i + 5);
      const verneint = davor.some((x) => VERNEINUNG.includes(x) || x === 'hasse' || x === 'außer')
        || (danach.includes('nicht') && danach.some((x) => ['mag', 'mögen', 'gern', 'gerne', 'leiden', 'vertrage'].includes(x)))
        || danach.slice(0, 2).some((x) => ['nicht', 'nein', 'nö'].includes(x));
      (verneint ? magNicht : mag).add(id);
    }
  });
  for (const id of magNicht) mag.delete(id);
  return { mag: [...mag], mag_nicht: [...magNicht] };
}
