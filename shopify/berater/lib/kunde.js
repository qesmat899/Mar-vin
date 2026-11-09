// Kundenprofil aus Antworten + Freitext – gemeinsam für Browser (Beratung, Nachjustieren) und Server.
// Freitext ergänzt nur, was der Kunde nicht schon ausdrücklich beantwortet hat (eine Antwort wird nie überschrieben),
// außer bei Abneigungen (kommen hinzu) und der Jahreszeit (ausdrücklich genannt schlägt automatisch).
import { kundenAngaben } from './matching.js';
import { freitextVerstehen } from './verstehen.js';

export function kundeAufbauen(eingabe) {
  const { angaben, fehler } = kundenAngaben(eingabe);
  if (angaben.freitext) ergaenzeAusFreitext(angaben, freitextVerstehen(angaben.freitext));
  return { angaben, fehler };
}

export function ergaenzeAusFreitext(a, f) {
  a.mag_nicht = [...new Set([...a.mag_nicht, ...f.mag_nicht])];
  a.mag = [...new Set([...a.mag, ...f.mag])].filter((g) => !a.mag_nicht.includes(g));
  a.mag_woerter = [...new Set([...(a.mag_woerter || []), ...(f.mag_woerter || [])])];
  for (const [d, v] of Object.entries(f.weich)) if (!a.weich[d]) a.weich[d] = v;
  if (!a.staerke && !a.praesenz && f.staerke) a.staerke = f.staerke;
  if (!a.anlass && !a.anlass_neu && f.anlass) a.anlass_neu = f.anlass;
  if (f.saison) a.saison = f.saison;
  if ((!a.stil || a.stil === 'unsicher') && f.stil) a.stil = f.stil;
  return a;
}
