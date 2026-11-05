# Duftberater (React-Insel fürs Shopify-Theme)

Vier Fragen als Auswahlkarten (Anlass, Stimmung, Präsenz, Richtung), Jahreszeit automatisch nach Datum
(änderbar). Ergebnis: ein Duft mit Gründen plus zwei Alternativen. Design Schwarz/Champagnergold, Animationen mit Motion.

| Teil | Ort |
|---|---|
| Quelle (Vite, React, Tailwind gekapselt, Motion) | `src/` |
| Bewertungslogik + Tests | `src/logik.js`, `src/logik.test.js` |
| Build-Ergebnis (wird ins Theme hochgeladen) | `../theme/assets/azizam-berater.js`, `.css` |
| Section mit Daten aus den Metafeldern | `../theme/sections/azizam-berater.liquid` |

Daten je Duft: `azizam.*` (familie, noten, charakter, intensitaet, tageszeit) und `azizam_berater.*` (tendenz,
stimmung, saison, anlass, nicht_buero). Düfte ohne `azizam_berater.anlass` und das Probenset werden übersprungen.

Kapselung: Tailwind ohne Preflight, Präfix `tw-`, alle Regeln nur unter `.azb`. Theme-Stile greifen nicht hinein,
der Berater wirkt nicht nach außen.

```bash
cd shopify/berater && npm install && npm test && npm run build
```
