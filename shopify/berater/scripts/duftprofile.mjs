// Kontrollansicht der Duftprofile: je Duft und Merkmal der Wert mit Status.
//   ✓ bestätigt (Metafeld azizam_profil.* in Shopify)   ~ aus Hauptnoten geschätzt   ? unbekannt
// Quelle: der öffentliche Feed des Shops (Standard) oder eine JSON-Datei:  npm run profile [-- datei.json]
// Bearbeiten: Shopify Admin → Produkt → Metafelder → „Duftprofil: …“ (0–3). Leeres Feld = nicht bestätigt.
import { readFileSync } from 'node:fs';
import { produktProfil } from '../lib/profil.js';
import { DIMENSIONEN, DIM_LABEL } from '../lib/lexikon.js';

const quelle = process.argv[2];
const roh = quelle
  ? JSON.parse(readFileSync(quelle, 'utf8')).produkte
  : await fetch('https://azizamfragrances.com/collections/all?view=berater').then((r) => r.text()).then((t) => JSON.parse(t.slice(t.indexOf('{'))).produkte);

const zeichen = (d) => (d.wert === null ? '  ?' : `${d.wert}${d.quelle === 'bestaetigt' ? '✓' : '~'}`.padStart(3));
const kopf = ['Duft'.padEnd(15), ...DIMENSIONEN.map((d) => DIM_LABEL[d].slice(0, 6).padStart(6)), 'Int.', ' Noten'];
console.log(kopf.join(' '));
let bestaetigt = 0; let geschaetzt = 0; let unbekannt = 0;
for (const p of roh.map(produktProfil)) {
  const zellen = DIMENSIONEN.map((d) => { const x = p.dims[d]; if (x.wert === null) unbekannt += 1; else if (x.quelle === 'bestaetigt') bestaetigt += 1; else geschaetzt += 1; return zeichen(x).padStart(6); });
  console.log([p.name.padEnd(15), ...zellen, String(p.intensitaet ?? '?').padStart(4), ` ${p.hauptnoten.join(', ')}`].join(' '));
}
console.log(`\n✓ bestätigt ${bestaetigt} · ~ geschätzt ${geschaetzt} · ? unbekannt ${unbekannt}  (je Duft ${DIMENSIONEN.length} Merkmale, 0–3)`);
console.log('Bearbeiten: Shopify Admin → Produkt → Metafelder → „Duftprofil: …“. Danach erneut prüfen: npm run profile');
