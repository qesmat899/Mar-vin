// Beratung komplett im Browser (ohne Server/KI): dieselbe Engine wie auf dem Server.
// Wird genutzt, wenn keine Berater-API eingetragen ist oder der Server nicht antwortet.
import { produktProfil } from './profil.js';
import { freitextLesen } from './lexikon.js';
import { kundenAngaben, matche } from './matching.js';
import { ohneKi } from './ergebnis.js';

export function berateLokal(eingabe, produkteRoh, grund = 'lokal') {
  const { angaben } = kundenAngaben(eingabe);
  if (angaben.freitext) {
    const f = freitextLesen(angaben.freitext);
    angaben.mag_nicht = [...new Set([...angaben.mag_nicht, ...f.mag_nicht])];
    angaben.mag = [...new Set([...angaben.mag, ...f.mag])].filter((g) => !angaben.mag_nicht.includes(g));
  }
  const profile = produkteRoh.map(produktProfil).filter((p) => p.id && p.name);
  return ohneKi(angaben, profile, matche(profile, angaben), grund);
}
