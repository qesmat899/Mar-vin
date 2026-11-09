// Beratung komplett im Browser (ohne Server/KI): dieselbe Engine wie auf dem Server.
// Wird genutzt für Nachjustieren, wenn keine Berater-API eingetragen ist oder der Server nicht antwortet.
import { produktProfil } from './profil.js';
import { kundeAufbauen } from './kunde.js';
import { matche } from './matching.js';
import { ohneKi } from './ergebnis.js';

export function berateLokal(eingabe, produkteRoh, grund = 'lokal') {
  const { angaben } = kundeAufbauen(eingabe);
  const profile = produkteRoh.map(produktProfil).filter((p) => p.id && p.name);
  return ohneKi(angaben, profile, matche(profile, angaben), grund);
}
