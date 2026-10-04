---
name: perfume-compliance
description: Rechts-Check für Azizam vor Veröffentlichung oder Verkauf. Nutzen bei "darf ich das so schreiben", Etikett, Produkttext, Werbeaussage, CPNP, Sicherheitsbewertung, INCI, Gefahrgut, Impressum, Markenrecht, oder wenn ein Text online gehen soll.
metadata:
  version: 0.1.0
---

# Azizam: Compliance-Check

Das hier ist ein **Prüfraster, keine Rechtsberatung**. Verbindlich sind die schriftliche Bestätigung der Fabrik und bei Zweifeln fachliche Beratung.

## Zuerst lesen
1. `playbook/azizam/07-recht-retention.md` (Kosmetikverordnung, CPNP, Gefahrgut, Markenrecht)
2. `playbook/azizam/brand-briefing.md`, Abschnitt „Rechtliche Leitplanken für alle Texte“ (Verbotsliste)
3. `SYNC.md` (Stand der Fabrik-Bestätigung)

## Prüfraster für jeden Text
- Enthält er eine Aussage, die in der Verbotsliste steht? („Handgefertigt in Deutschland“, „Seltene Zutaten“, „Haute Parfumerie“ und alles Ähnliche)
- Ist jede Zahl belegt (z. B. 30 % Duftöl)? Nicht belegte Zahlen streichen oder als offen markieren.
- Gibt es erfundene Bewertungen, Zitate oder Verkaufszahlen? Dann raus.
- Werden Namen bekannter Marken oder Düfte als Vergleich genutzt? Markenrecht prüfen (siehe 07-recht-retention.md) und nur mit Mars Freigabe.
- Steht ein Preis im Text, obwohl Preise offen sind?

## Vor dem ersten Onlineverkauf (Stand 10/2026: **offen**)
- [ ] Schriftliche Bestätigung der Fabrik: CPNP-Notifizierung, Sicherheitsbewertung, INCI für die Azizam-Namen
- [ ] Etikett: Pflichtangaben geklärt (zum Etikett ist noch nichts geklärt)
- [ ] Versand: Gefahrgut-Regeln für Parfum (siehe 07-recht-retention.md)
- [ ] Impressum und Kleinunternehmer-Hinweis. Adresse, Telefon, USt-IdNr. stehen nur im Impressum, nicht im Repo.

## Ergebnis ablegen
Prüfergebnisse und Fabrik-Antworten (ohne Zugangsdaten und Personendaten) in `company/compliance/`.

## Grenzen
- Nie „ist rechtlich in Ordnung“ sagen. Sagen: „nach Prüfraster kein Treffer; verbindlich ist die Fabrikbestätigung / Beratung“.
- Nichts aus dem Gedächtnis zitieren, was nicht in `07-recht-retention.md` oder einer genannten Primärquelle steht. Bei neuen Rechtsfragen die Rolle `research` mit Quellenpflicht nutzen.
