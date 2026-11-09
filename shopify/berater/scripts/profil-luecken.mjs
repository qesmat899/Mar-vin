// Welche Produktdaten fehlen? Liest den Shop-Feed (SHOP_DATEN_URL) oder die Testdaten und schreibt eine CSV-Vorlage
// auf stdout: je Duft die unbekannten Felder. Mar füllt nur, was belegt ist (z. B. aus Fabrik-Unterlagen);
// Claude Code trägt die Werte danach als Metafelder azizam_profil.* in Shopify ein. Leere Zellen bleiben unbekannt.
//   npm run luecken > luecken.csv            (Testdaten)
//   SHOP_DATEN_URL=https://…?view=berater npm run luecken > luecken.csv
import { readFileSync } from 'node:fs';
import { produktProfil } from '../lib/profil.js';

const FELDER = ['kopfnote', 'herznote', 'basisnote', 'haltbarkeit', 'sillage', 'suesse', 'frische', 'waerme', 'rauchig', 'holzig', 'wuerzig'];
let produkte;
if (process.env.SHOP_DATEN_URL) {
  const t = await (await fetch(process.env.SHOP_DATEN_URL)).text();
  produkte = JSON.parse(t.slice(t.indexOf('{'))).produkte;
} else {
  produkte = JSON.parse(readFileSync(new URL('../tests/fixtures/shop-stand-2026-11-09.json', import.meta.url))).produkte;
}
const q = (s) => `"${String(s ?? '').replace(/"/g, '""')}"`;
console.log(['id', 'name', 'unbekannt', ...FELDER.map((f) => `${f}_bestaetigt`), 'quelle'].map(q).join(','));
for (const r of produkte) {
  const p = produktProfil(r);
  const offen = p.unbekannt.filter((f) => FELDER.includes(f) || ['familie', 'charakter', 'intensitaet', 'tendenz', 'hauptnoten', 'stimmung', 'saison', 'anlass', 'preise'].includes(f));
  const abgeleitet = FELDER.filter((f) => p.dims[f]?.quelle === 'abgeleitet').map((f) => `${f}≈${p.dims[f].wert}`);
  console.log([p.id, p.name, [...offen, ...abgeleitet.map((x) => `abgeleitet:${x}`)].join(' '), ...FELDER.map(() => ''), ''].map(q).join(','));
}
console.error(`Hinweis: Skalen – haltbarkeit/sillage 1–5, Dimensionen 0–3; Noten als Liste mit | getrennt. Nur belegte Werte eintragen.`);
