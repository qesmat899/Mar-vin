# company/ – Arbeitsstand von Azizam

Hier liegen die **Ergebnisse** der laufenden Arbeit, getrennt nach Bereich. Das Denkgerüst (Playbook, Vorlagen, Rechner) bleibt in `playbook/`.

| Ordner | Inhalt | Zuständige Rolle |
|---|---|---|
| `products/` | Produktsteckbriefe, Flakon- und Verpackungsdaten | `inventory` |
| `suppliers/` | Fabrik, Flakon- und Verpackungslieferanten, Angebotsvergleiche | `inventory` |
| `compliance/` | Prüfergebnisse, Fabrik-Bestätigungen (CPNP, Sicherheitsbewertung, INCI) | `research`, Skill `perfume-compliance` |
| `finance/` | Szenario-Rechnungen, Budget, Bestellkosten | `cfo` |
| `marketing/` | Texte, Briefings, Testergebnisse | `marketing` |
| `analytics/` | Auswertungen, Marktbeobachtungen, später Shop-Zahlen | `research`, `cfo` |

## Regeln für alle Ordner
1. Nur Belegtes eintragen, mit Datum und Quelle. Eigene Vorschläge beginnen mit „Vorschlag:“.
2. **Keine** Zugangsdaten, Rechnungen, Kundendaten, Adresse, Telefon oder USt-IdNr. (siehe Regel 6 in `SYNC.md`).
3. Dateinamen mit Datum: `2026-10-04-flakon-vergleich.md`.
4. Wichtige Entscheidungen zusätzlich in `SYNC.md` und `playbook/KONTEXT-EXPORT.md` nachziehen.

## Bewusst nicht verschoben
`playbook/azizam/` bleibt, wo es ist. `playbook.py`, `SYNC.md` und die Hooks greifen auf diese Pfade zu. Haus & Grün Konzept liegt unverändert in `playbook/haus-und-gruen/`.
