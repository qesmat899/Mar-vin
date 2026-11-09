// Kundenprofile mit Erwartungen (Duftlogik), gemeinsam genutzt von tests/profile.test.js und scripts/live-test.mjs.
// top: erlaubte Plätze 1 · alle: jede Empfehlung aus dieser Menge · nie: darf nie empfohlen werden
// kein_treffer: ehrlich keine Empfehlung · hinweis: erwarteter Widerspruchshinweis
import { readFileSync } from 'node:fs';
import { produktProfil } from '../lib/profil.js';

export const roh = JSON.parse(readFileSync(new URL('./fixtures/shop-stand-2026-11-09.json', import.meta.url))).produkte;
const profile = Object.fromEntries(roh.map((r) => [r.id, produktProfil(r)]));

export const DUNKEL = ['oud-majeste', 'duna', 'royal-cedar', 'ombroso', 'sombre', 'calura', 'velvet-vice'];
export const FRISCH = ['marea', 'bergamo', 'borbus', 'mare-vita', 'assassin', 'dolce-sole'];
export const SUESS = ['velvet-vanilla', 'midnight-cafe', 'alpha-tonka', 'ambra-dorata', 'orphea', 'velvet-vice', 'sicilia-nobile', 'dolce-sole'];

// name, eingabe, erwartung: top (erlaubte Plätze 1), alle (alle Empfehlungen aus dieser Menge), nie, kein_treffer, hinweis
export const FAELLE = [
  ['Dunkel, geheimnisvoll, elegant', { anlass: 'Abend', stimmung: ['geheimnisvoll', 'elegant'], praesenz: 'mittel', saison: 'Herbst' },
    { top: ['oud-majeste', 'duna', 'royal-cedar', 'sombre'], alle: DUNKEL, nie: ['marea', 'bergamo', 'borbus', 'dolce-sole', 'velvet-vanilla'] }],
  ['Frisch, sauber, sportlich', { anlass: 'Freizeit', stimmung: ['frisch'], praesenz: 'mittel', saison: 'Sommer', freitext: 'sauber und sportlich' },
    { top: FRISCH, alle: FRISCH, nie: DUNKEL }],
  ['Süß, warm, verführerisch', { anlass: 'Date', stimmung: ['sinnlich', 'gemütlich'], praesenz: 'mittel', saison: 'Winter' },
    { top: SUESS, alle: SUESS, nie: ['marea', 'bergamo', 'mare-vita', 'borbus'] }],
  ['Holzig, trocken, maskulin', { anlass: 'Abend', stimmung: ['elegant', 'kraftvoll'], richtung: 'maskulin', saison: 'Herbst', mag: ['holz'], mag_nicht: ['vanille'] },
    { top: ['royal-cedar', 'calura', 'ombroso', 'sombre', 'oud-majeste'], nie: ['velvet-vanilla', 'dolce-sole', 'alpha-tonka', 'midnight-cafe', 'marea', 'duna'] }],
  ['Blumig, leicht, feminin', { anlass: 'Alltag', stimmung: ['verspielt'], praesenz: 'leise', richtung: 'feminin', saison: 'Frühling', mag: ['blumig'] },
    { top: ['borbus'], nie: ['ombroso', 'alpha-tonka', 'calura', 'sombre', 'mare-vita'] }],
  ['Würzig, orientalisch, intensiv', { anlass: 'Abend', stimmung: ['kraftvoll', 'sinnlich'], praesenz: 'laut', saison: 'Winter', mag: ['gewuerz'] },
    { top: ['alpha-tonka', 'duna', 'royal-cedar', 'ombroso', 'calura'], nie: ['marea', 'borbus', 'bergamo', 'velvet-vanilla', 'dolce-sole'] }],
  ['Frisch, zitrisch, sommerlich', { anlass: 'Alltag', stimmung: ['frisch'], praesenz: 'mittel', saison: 'Sommer', freitext: 'Zitrus, sommerlich' },
    { top: ['marea', 'bergamo', 'dolce-sole'], alle: FRISCH, nie: DUNKEL }],
  ['Rauchig, ledrig, extravagant', { anlass: 'Abend', stimmung: ['geheimnisvoll', 'kraftvoll'], praesenz: 'laut', saison: 'Herbst', mag: ['leder', 'oud'] },
    { top: ['calura', 'sombre', 'ombroso', 'velvet-vice'], alle: DUNKEL, nie: ['marea', 'velvet-vanilla', 'dolce-sole'] }],
  ['Cremig, weich, elegant', { anlass: 'Alltag', stimmung: ['gemütlich', 'elegant'], praesenz: 'mittel', saison: 'Herbst' },
    { top: ['velvet-vanilla', 'sicilia-nobile', 'oud-majeste', 'orphea', 'midnight-cafe'], nie: ['mare-vita', 'marea', 'ombroso', 'calura'] }],
  ['Cremig, weich (Freitext)', { anlass: 'Alltag', stimmung: ['gemütlich'], praesenz: 'mittel', saison: 'Herbst', freitext: 'cremig und weich' },
    { top: ['velvet-vanilla'], nie: ['mare-vita', 'marea', 'ombroso', 'calura', 'assassin'] }],
  ['Pudrig, sauber, dezent', { anlass: 'Alltag', stimmung: ['gemütlich'], praesenz: 'leise', saison: 'Herbst', mag: ['pudrig', 'moschus'] },
    { top: ['velvet-vanilla', 'borbus'], nie: ['ombroso', 'calura', 'alpha-tonka', 'royal-cedar'] }],

  // Anlass, Ausschlüsse, Budget
  ['Büro: nie zu starke Düfte', { anlass: 'Büro', stimmung: ['frisch'], praesenz: 'mittel', saison: 'Frühling' },
    { nie: ['mare-vita', 'calura', 'ombroso', 'duna', 'royal-cedar', 'alpha-tonka'], alle: FRISCH }],
  ['Widerspruch: Büro + unübersehbar', { anlass: 'Büro', stimmung: ['kraftvoll'], praesenz: 'laut', saison: 'Herbst' },
    { hinweis: /Büro/, nie: ['mare-vita', 'calura', 'ombroso', 'duna', 'royal-cedar', 'alpha-tonka'] }],
  ['Unerwünscht: kein Süßes', { anlass: 'Date', stimmung: ['gemütlich', 'sinnlich'], praesenz: 'mittel', saison: 'Winter', mag_nicht: ['vanille'] },
    { nie: SUESS.filter((x) => profile[x].gruppen.includes('vanille')) }],
  ['Freitext: keine Rosen, kein Oud', { anlass: 'Abend', stimmung: ['elegant'], praesenz: 'mittel', saison: 'Herbst', freitext: 'Ich mag keine Rosen und bitte kein Oud.' },
    { nie: ['duna', 'oud-majeste', 'royal-cedar', 'midnight-cafe', 'ombroso', 'alpha-tonka', 'calura'] }],
  ['Freitext: liebt Kaffee', { anlass: 'Date', stimmung: ['sinnlich'], praesenz: 'mittel', saison: 'Herbst', freitext: 'Ich liebe Kaffee' },
    { top: ['midnight-cafe'] }],
  ['Budget 35 € + sinnlich am Abend', { anlass: 'Abend', stimmung: ['sinnlich'], praesenz: 'mittel', saison: 'Winter', budget: 35 },
    { alle: ['midnight-cafe', 'alpha-tonka', 'sombre'] }],
  ['Budget 35 € + frisch im Sommer: ehrlich kein Treffer', { anlass: 'Freizeit', stimmung: ['frisch'], praesenz: 'leise', saison: 'Sommer', budget: 35 },
    { kein_treffer: true }],
  ['Budget 45 € (alles erlaubt)', { anlass: 'Abend', stimmung: ['geheimnisvoll'], saison: 'Herbst', budget: 45 },
    { top: DUNKEL }],
  ['Widerspruch: hautnah + kraftvoll', { anlass: 'Alltag', stimmung: ['kraftvoll'], praesenz: 'leise', saison: 'Herbst' },
    { hinweis: /dezent und sehr kräftig/ }],
  ['Widerspruch: frisch + geheimnisvoll', { anlass: 'Abend', stimmung: ['frisch', 'geheimnisvoll'], praesenz: 'mittel', saison: 'Sommer' },
    { hinweis: /Frisch und dunkel/ }],
  ['Alles ausgeschlossen → kein Treffer', { anlass: 'Alltag', stimmung: ['frisch'], saison: 'Sommer', mag_nicht: ['vanille', 'oud', 'leder', 'blumig', 'kaffee', 'tabak', 'zitrus', 'meer', 'frucht', 'gewuerz', 'holz', 'moschus', 'pudrig'] },
    { kein_treffer: true }],
  ['Frisch ohne Zitrus/Meer/Frucht', { anlass: 'Alltag', stimmung: ['frisch'], saison: 'Sommer', mag_nicht: ['zitrus', 'meer', 'frucht'] },
    { hinweis: /Zitrus/, nie: ['marea', 'bergamo', 'mare-vita', 'borbus', 'dolce-sole', 'assassin'] }],
  ['Sommer + geheimnisvoll + ohne Oud/Leder: kein Treffer', { anlass: 'Abend', stimmung: ['geheimnisvoll', 'kraftvoll'], praesenz: 'laut', saison: 'Sommer', mag_nicht: ['oud', 'leder'] },
    { kein_treffer: true }],

  // Sehr spezifische Profile (Freitext)
  ['Spezifisch: Leder mit Kardamom', { stimmung: ['geheimnisvoll'], saison: 'Herbst', freitext: 'Leder mit Kardamom, herb und geradlinig' },
    { top: ['sombre'] }],
  ['Spezifisch: Kaffee und Rose am Abend', { anlass: 'Abend', saison: 'Winter', freitext: 'Kaffee und Rose' },
    { top: ['midnight-cafe'] }],
  ['Spezifisch: Birne, leicht, sauber', { anlass: 'Alltag', praesenz: 'leise', saison: 'Frühling', freitext: 'Birne, leicht und sauber' },
    { top: ['borbus'] }],
  ['Spezifisch: Meer, salzig', { anlass: 'Freizeit', stimmung: ['frisch'], saison: 'Sommer', freitext: 'Meer und salzig' },
    { top: ['mare-vita'] }],
  ['Spezifisch: Honig, Tabak, Lavendel', { anlass: 'Abend', saison: 'Herbst', freitext: 'Honig, Tabak und Lavendel' },
    { top: ['sicilia-nobile'] }],
  ['Spezifisch: Rum und Trockenfrüchte', { anlass: 'Abend', stimmung: ['gemütlich'], saison: 'Winter', freitext: 'Rum, Trockenfrüchte, Tabak' },
    { top: ['ambra-dorata'] }],

  // Richtungen und Jahreszeiten
  ['Feminin, sinnlich, Date', { anlass: 'Date', stimmung: ['sinnlich'], richtung: 'feminin', praesenz: 'mittel', saison: 'Herbst' },
    { top: ['midnight-cafe', 'duna', 'velvet-vanilla', 'orphea', 'velvet-vice'], nie: ['assassin', 'bergamo', 'marea'] }],
  ['Maskulin, frisch, Büro', { anlass: 'Büro', stimmung: ['frisch'], richtung: 'maskulin', praesenz: 'mittel', saison: 'Frühling' },
    { top: ['bergamo', 'assassin', 'marea', 'borbus'], nie: DUNKEL }],
  ['Winter, besonderer Anlass, elegant', { anlass: 'Besonderer Anlass', stimmung: ['elegant'], praesenz: 'mittel', saison: 'Winter' },
    { top: ['royal-cedar', 'oud-majeste', 'sicilia-nobile', 'orphea'], nie: ['marea', 'borbus', 'mare-vita'] }],
  ['Sommer-Date, verspielt', { anlass: 'Date', stimmung: ['verspielt'], praesenz: 'mittel', saison: 'Sommer' },
    { top: ['dolce-sole', 'borbus'], nie: DUNKEL }],
  // Nur die Jahreszeit ist keine Beratung: ohne Angabe zu Duft, Stimmung oder Noten keine Empfehlung (seit 09.11.;
  // in der neuen Beratung kommt das nicht vor, die erste Frage gilt immer der Duftart).
  ['Nur Jahreszeit angegeben', { saison: 'Sommer' }, { kein_treffer: true }],
  ['Keine Angaben → keine Empfehlung', {}, { kein_treffer: true }],

  // Rückmeldung Mar (09.11.): „elegant + maskulin“ darf nicht beim Allrounder landen
  ['Elegant, maskulin, Abend', { anlass: 'Abend', stimmung: ['elegant'], praesenz: 'mittel', richtung: 'maskulin', saison: 'Herbst' },
    { top: ['royal-cedar', 'oud-majeste', 'sicilia-nobile', 'orphea'], nicht_top: ['assassin'] }],
  ['Elegant, maskulin, Alltag', { anlass: 'Alltag', stimmung: ['elegant'], praesenz: 'mittel', richtung: 'maskulin', saison: 'Herbst' },
    { nicht_top: ['assassin'] }],
  ['Elegant + kraftvoll, maskulin, besonderer Anlass', { anlass: 'Besonderer Anlass', stimmung: ['elegant', 'kraftvoll'], praesenz: 'laut', richtung: 'maskulin', saison: 'Winter' },
    { top: ['royal-cedar', 'oud-majeste'], nie: ['assassin', 'marea', 'borbus'] }],
  ['Elegant + sinnlich, maskulin, Date', { anlass: 'Date', stimmung: ['elegant', 'sinnlich'], praesenz: 'mittel', richtung: 'maskulin', saison: 'Herbst' },
    { nicht_top: ['assassin'] }],
  // Nichts besteht das Gate, aber es gibt nahe Düfte: Annäherung statt leerer Seite
  ['Annäherung statt „kein Treffer“', { anlass: 'Abend', stimmung: ['elegant'], praesenz: 'mittel', saison: 'Herbst', freitext: 'Ich mag keine Rosen und bitte kein Oud.' },
    { annaeherung: true, kein_treffer: false, nie: ['duna', 'oud-majeste', 'royal-cedar', 'ombroso'] }],
];


export function pruefe(soll, empfehlungen, hinweise = [], annaeherung = false) {
  const e = empfehlungen.map((x) => x.product_id);
  const fehler = [];
  if (soll.kein_treffer && e.length) fehler.push('erwartet keinen Treffer');
  if (soll.kein_treffer === false && !e.length) fehler.push('erwartet einen Treffer');
  if ((soll.top || soll.alle) && !e.length) fehler.push('erwartet mindestens eine Empfehlung');
  if (soll.top && e.length && !soll.top.includes(e[0])) fehler.push(`Platz 1 „${e[0]}“ nicht in ${soll.top.join('/')}`);
  if (soll.alle) for (const x of e) if (!soll.alle.includes(x)) fehler.push(`„${x}“ passt nicht zum Profil`);
  if (soll.nie) for (const x of soll.nie) if (e.includes(x)) fehler.push(`„${x}“ darf nicht empfohlen werden`);
  if (soll.hinweis && !hinweise.some((h) => soll.hinweis.test(h))) fehler.push('Widerspruchshinweis fehlt');
  if (soll.nicht_top && e.length && soll.nicht_top.includes(e[0])) fehler.push(`Platz 1 „${e[0]}“ unerwünscht`);
  if (soll.annaeherung !== undefined && soll.annaeherung !== annaeherung) fehler.push(`Annäherung erwartet: ${soll.annaeherung}`);
  for (const x of empfehlungen) {
    if (!profile[x.product_id]) fehler.push(`unbekanntes Produkt ${x.product_id}`);
    if (x.match_score < (annaeherung ? 55 : 60)) fehler.push(`Match unter Schwelle: ${x.product_id}`);
  }
  if (e.length > 3) fehler.push('mehr als 3 Empfehlungen');
  return fehler;
}
