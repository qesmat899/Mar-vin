// Modellvergleich mit echter Claude API (kostet Geld): dieselben Beratungen mit mehreren Modellen.
// Misst je Modell: Treffer laut Kundenprofil (tests/faelle.js), Platz-1-Übereinstimmung mit dem ersten Modell,
// KI-Urteile (passt/teilweise/passt_nicht), Validierungsfehler, Fachbegriffe in Erklärungen, Dauer, Token, Kosten.
//   ANTHROPIC_API_KEY=… npm run modellvergleich
//   Optional: MODELLE=claude-sonnet-5-5,claude-haiku-5-5  EFFORT=low  LIVE_ANZAHL=10 (begrenzt Fälle und Kosten)
// Grobe Kosten aller 46 Fälle: Sonnet 5.5 low ca. 2 $, Haiku 5.5 low ca. 0,10 $ (Schätzung).
import Anthropic from '@anthropic-ai/sdk';
import { berate } from '../lib/beratung.js';
import { konfiguration } from '../lib/server.js';
import { speicherImArbeitsspeicher } from '../lib/speicher.js';
import { monatsUebersicht, monatsSchluessel } from '../lib/kosten.js';
import { roh, FAELLE, pruefe } from '../tests/faelle.js';

if (!process.env.ANTHROPIC_API_KEY) { console.error('ANTHROPIC_API_KEY fehlt.'); process.exit(2); }

// Zusätzlich Freitext-Fälle der neuen Beratung (Fachbegriffe und Abneigungen sind hier am heikelsten).
const FREITEXT = [
  ['Freitext: warm, nicht zu süß', { saison: 'Herbst', stil: 'warm', staerke: 'bemerkbar', freitext: 'Ich möchte etwas Warmes, das nicht zu süß ist.' }, { nie: ['marea', 'bergamo', 'borbus'] }],
  ['Freitext: Vanille, kein Oud/Zitrus', { saison: 'Herbst', anlass: 'date', freitext: 'Ich mag Vanille, aber keinen Oud und keine Zitrusnoten.' }, { top: ['velvet-vanilla', 'midnight-cafe', 'velvet-vice'] }],
  ['Freitext: frisch für den Sommer', { saison: 'Sommer', anlass: 'alltag', freitext: 'Ich suche etwas Frisches für den Sommer.' }, { top: ['marea', 'bergamo', 'borbus', 'mare-vita', 'assassin'] }],
  ['Freitext: dunkel und auffällig', { saison: 'Herbst', anlass: 'abend', freitext: 'Ich möchte etwas Dunkles, Warmes und Auffälliges.' }, { top: ['oud-majeste', 'duna', 'royal-cedar', 'ombroso', 'sombre', 'calura', 'velvet-vice'] }],
  ['Freitext: weiß nichts', { saison: 'Herbst', stil: 'unsicher', freitext: 'Ich weiß überhaupt nicht, was mir gefällt. Hilf mir.' }, {}],
];
const FAELLE_ALLE = [...FAELLE, ...FREITEXT].slice(0, Number(process.env.LIVE_ANZAHL) || undefined);
const MODELLE = (process.env.MODELLE || 'claude-sonnet-5-5,claude-haiku-5-5').split(',').map((s) => s.trim());
const effort = process.env.EFFORT || 'low';
const FACHWORT = /olfaktor|komposition|balsam|ambri|gourmand|facette|signatur|sillage|akkord|kopfnote|basisnote|herznote/i;

const ergebnisse = {};
for (const model of MODELLE) {
  const config = { ...konfiguration(), model, effort, fallback: false, maxKiProTag: 10000 };
  const client = new Anthropic({ timeout: 60000, maxRetries: 2 });
  const speicher = speicherImArbeitsspeicher();
  const logs = [];
  const zeilen = [];
  for (const [name, eingabe, soll] of FAELLE_ALLE) {
    const t0 = Date.now();
    const r = await berate({ eingabe, produkteRoh: roh, client, config, speicher, log: (o) => logs.push(o) });
    const ms = Date.now() - t0;
    const e = r.body.empfehlungen || [];
    const fehler = r.status === 200 ? pruefe(soll, e, r.body.hinweise, r.body.annaeherung === true) : [`HTTP ${r.status}`];
    const texte = e.map((x) => x.recommendation_explanation || '').join(' ');
    zeilen.push({ name, ok: !fehler.length, ki: r.body.quelle === 'claude', top: e[0]?.product_id ?? null, urteile: e.map((x) => x.ki_urteil), fachwort: FACHWORT.test(texte), leer: !e.some((x) => x.recommendation_explanation), ms, fehler });
    process.stdout.write(`${model} ${fehler.length ? '✗' : '✓'} ${name} → ${e.map((x) => x.product_id).join(', ') || '–'} (${ms} ms)\n`);
  }
  const m = await monatsUebersicht(speicher, monatsSchluessel().slice(7));
  const validierung = logs.filter((l) => l.ereignis === 'claude_validierung' || (l.ereignis === 'claude_aufruf' && !l.ok)).length;
  ergebnisse[model] = { zeilen, kosten: m.kosten_usd, tokens: m.tokens, validierung };
}

const basis = MODELLE[0];
const tabelle = {};
for (const model of MODELLE) {
  const z = ergebnisse[model].zeilen;
  const ki = z.filter((x) => x.ki).length;
  const gleich = z.filter((x, i) => x.top === ergebnisse[basis].zeilen[i].top).length;
  const dauer = z.map((x) => x.ms).sort((a, b) => a - b);
  tabelle[model] = {
    'Profile erfüllt': `${z.filter((x) => x.ok).length}/${z.length}`,
    'mit KI beantwortet': `${ki}/${z.length}`,
    [`Platz 1 wie ${basis}`]: `${gleich}/${z.length}`,
    'KI-Veto (passt_nicht) entfernt alles': z.filter((x) => x.ki && x.top === null).length,
    'ohne KI-Erklärung': z.filter((x) => x.ki && x.leer).length,
    'Fachbegriffe': z.filter((x) => x.fachwort).length,
    'Validierungs-/Antwortfehler': ergebnisse[model].validierung,
    'Dauer p50 / p95 (s)': `${(dauer[Math.floor(dauer.length / 2)] / 1000).toFixed(1)} / ${(dauer[Math.floor(dauer.length * 0.95)] / 1000).toFixed(1)}`,
    'Kosten gesamt $': ergebnisse[model].kosten,
    'je Beratung $': ki ? Math.round((ergebnisse[model].kosten / ki) * 10000) / 10000 : 0,
  };
}
console.log(`\nEffort ${effort}, ${FAELLE_ALLE.length} Fälle`);
console.table(tabelle);
for (const model of MODELLE.slice(1)) {
  const abw = ergebnisse[model].zeilen.map((x, i) => ({ x, b: ergebnisse[basis].zeilen[i] })).filter(({ x, b }) => x.top !== b.top);
  if (abw.length) console.log(`\nAbweichender Platz 1 (${model} vs ${basis}):\n${abw.map(({ x, b }) => `  ${x.name}: ${x.top} statt ${b.top}`).join('\n')}`);
}
