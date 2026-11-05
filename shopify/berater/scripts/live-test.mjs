// Live-Test gegen die echte Claude API (kostet Geld, braucht ANTHROPIC_API_KEY).
// Prüft je Kundenprofil: API antwortet, JSON ist gültig, Empfehlungen passen zum Profil (tests/faelle.js),
// und rechnet die Kosten zusammen.  Aufruf:  ANTHROPIC_API_KEY=… npm run test:live  [LIVE_ANZAHL=10]
import Anthropic from '@anthropic-ai/sdk';
import { berate } from '../lib/beratung.js';
import { konfiguration } from '../lib/server.js';
import { speicherImArbeitsspeicher } from '../lib/speicher.js';
import { monatsUebersicht, monatsSchluessel } from '../lib/kosten.js';
import { roh, FAELLE, pruefe } from '../tests/faelle.js';

if (!process.env.ANTHROPIC_API_KEY) {
  console.error('ANTHROPIC_API_KEY fehlt. Kein Live-Test möglich.');
  process.exit(2);
}
const config = { ...konfiguration(), maxKiProTag: 1000 };
const client = new Anthropic({ timeout: config.timeoutMs, maxRetries: config.maxRetries });
const speicher = speicherImArbeitsspeicher();
const anzahl = Number(process.env.LIVE_ANZAHL) || FAELLE.length;
const logs = [];

let ok = 0;
let ki = 0;
let kiErwartet = 0;
for (const [name, eingabe, soll] of FAELLE.slice(0, anzahl)) {
  const r = await berate({ eingabe, produkteRoh: roh, client, config, speicher, log: (o) => logs.push(o) });
  const fehler = r.status === 200 ? pruefe(soll, r.body.empfehlungen, r.body.hinweise) : [`HTTP ${r.status}`];
  if (r.body.quelle === 'claude') ki += 1;
  // KI wird nur bei Freitext gefragt (KI_NUR_MIT_FREITEXT) und nicht bei aussichtslosen Angaben
  if ((eingabe.freitext || !config.kiNurMitFreitext) && !soll.kein_treffer) kiErwartet += 1;
  if (!fehler.length) ok += 1;
  console.log(`${fehler.length ? '✗' : '✓'} ${name} [${r.body.quelle}] → ${(r.body.empfehlungen || []).map((e) => `${e.product_id} ${e.match_score}% (${e.ki_urteil ?? '–'})`).join(', ') || 'kein Treffer'}`);
  for (const f of fehler) console.log(`    ${f}`);
  if (r.body.empfehlungen?.[0]?.recommendation_explanation) console.log(`    „${r.body.empfehlungen[0].recommendation_explanation}“`);
}
const m = await monatsUebersicht(speicher, monatsSchluessel().slice(7));
const fehlerLogs = logs.filter((l) => l.ereignis !== 'claude_aufruf' || !l.ok);
console.log(`\n${ok}/${anzahl} Profile passend · ${ki} mit Claude beantwortet · Modell ${config.model} · effort ${config.effort}`);
console.log(`Tokens: ${JSON.stringify(m.tokens)} · Kosten gesamt ${m.kosten_usd} $ · je Claude-Beratung ${ki ? Math.round((m.kosten_usd / ki) * 10000) / 10000 : 0} $`);
if (fehlerLogs.length) console.log('Auffälligkeiten:', JSON.stringify(fehlerLogs, null, 1));
process.exit(ok === anzahl && ki >= kiErwartet ? 0 : 1);
