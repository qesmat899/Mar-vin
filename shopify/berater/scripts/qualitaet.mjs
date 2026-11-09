// Matching-Qualität messen – dieselben Zahlen bei jeder Änderung.
//   node scripts/qualitaet.mjs                  → aktuelle Engine
//   node scripts/qualitaet.mjs <pfad/zu/lib>    → zusätzlich Vergleich mit einer anderen Engine-Version (z. B. git worktree)
// Grundlage: Shop-Daten in tests/fixtures, Kundenprofile in tests/faelle.js, alle Antwortkombinationen der alten Frageform.
import { fileURLToPath, pathToFileURL } from 'node:url';
import path from 'node:path';

const hier = path.dirname(fileURLToPath(import.meta.url));
const { FAELLE, roh, pruefe } = await import(pathToFileURL(path.join(hier, '../tests/faelle.js')));

async function messen(libPfad) {
  const imp = (f) => import(pathToFileURL(path.join(libPfad, f)));
  const { produktProfil } = await imp('profil.js');
  const m = await imp('matching.js');
  const P = roh.map(produktProfil);
  let aufbau;
  try { aufbau = (await imp('kunde.js')).kundeAufbauen; } catch { aufbau = (e) => m.kundenAngaben(e); }
  const empfehlen = (e) => {
    const { angaben } = aufbau(e);
    const r = m.matche(P, angaben);
    const w = m.waehleAus(r.kandidaten);
    return { w, ann: !w.length && m.annaeherung ? m.annaeherung(r.kandidaten) : [] };
  };
  // 1 Kundenprofile mit Soll-Werten
  let ok = 0; let top1 = 0; let top1n = 0; let nie = 0;
  for (const [, e, soll] of FAELLE) {
    const { w, ann } = empfehlen(e);
    const liste = (w.length ? w : ann).map((k) => ({ product_id: k.id, match_score: k.match }));
    const f = pruefe(soll, liste, m.widersprueche({ stimmung: [], mag_nicht: [], ...aufbau(e).angaben }), !w.length && ann.length > 0);
    if (!f.length) ok += 1;
    if (soll.top) { top1n += 1; if (liste[0] && soll.top.includes(liste[0].product_id)) top1 += 1; }
    if (soll.nie) nie += liste.filter((x) => soll.nie.includes(x.product_id)).length;
  }
  // 2 Verteilung über alle Antwortkombinationen (alte Frageform, beide Jahreszeiten)
  const stim = []; m.STIMMUNG_IDS.forEach((a, i) => { stim.push([a]); m.STIMMUNG_IDS.slice(i + 1).forEach((b) => stim.push([a, b])); });
  const vert = {}; let n = 0; let leer = 0; let ann = 0;
  for (const saison of ['Herbst', 'Sommer']) for (const anlass of m.ANLASS_IDS) for (const stimmung of stim) for (const praesenz of ['leise', 'mittel', 'laut']) for (const richtung of ['feminin', 'maskulin', 'egal']) {
    const r = empfehlen({ anlass, stimmung, praesenz, richtung, saison });
    n += 1;
    const liste = r.w.length ? r.w : r.ann;
    if (!liste.length) { leer += 1; continue; }
    if (!r.w.length) ann += 1;
    vert[liste[0].id] = (vert[liste[0].id] || 0) + 1;
  }
  const maxAnteil = Math.max(...Object.values(vert)) / n;
  const maxDuft = Object.entries(vert).sort((a, b) => b[1] - a[1])[0][0];
  return {
    profile_ok: `${ok}/${FAELLE.length}`, top1: `${top1}/${top1n}`, nie_verstoesse: nie,
    leer_pct: +(100 * leer / n).toFixed(1), annaeherung_pct: +(100 * ann / n).toFixed(1),
    platz1_max: `${maxDuft} ${(100 * maxAnteil).toFixed(1)} %`, duefte_mit_platz1: Object.keys(vert).length,
  };
}

const aktuell = await messen(path.join(hier, '../lib'));
const zeilen = { aktuell };
if (process.argv[2]) zeilen.vergleich = await messen(path.resolve(process.argv[2]));
console.table(zeilen);

// 3 Beratungslänge (nur aktuelle Engine, neue Frageform)
const { spieleDurch } = await import(pathToFileURL(path.join(hier, '../lib/gespraech.js')));
const kunde = (a) => (f) => (a[f.id] !== undefined ? a[f.id] : f.mehrfach ? [] : f.optionen[0].id);
const laengen = {}; let summe = 0; let anzahl = 0;
for (const stil of ['frisch', 'warm', 'suess', 'holzig', 'dunkel', 'unsicher']) for (const suesse of ['kaum', 'etwas', 'deutlich', 'egal'])
  for (const staerke of ['dezent', 'bemerkbar', 'deutlich', 'intensiv']) for (const anlass of ['alltag', 'arbeit', 'abend', 'date', 'vielseitig']) {
    const r = spieleDurch(roh, { saison: 'Herbst' }, kunde({ stil, suesse, staerke, anlass, temperatur: 'warm', abneigung: [] }));
    laengen[r.protokoll.length] = (laengen[r.protokoll.length] || 0) + 1; summe += r.protokoll.length; anzahl += 1;
  }
console.log(`Beratungslänge: Mittel ${(summe / anzahl).toFixed(2)} Fragen, Verteilung ${JSON.stringify(laengen)} (${anzahl} Klick-Kombinationen)`);
