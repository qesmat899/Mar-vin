# Mar-vin – Projekt-Kontext für Claude

## Worum es geht
Arbeits-Repository für **Azizam Fragrance**, die Parfum-Marke von Mar (Inhaber): persisch inspiriert, „Duft der zweiten Generation“, Shop: azizamfragrances.com

Mars zweites Geschäft (Haus & Grün Konzept, Gebäudereinigung und Gartenpflege in Würzburg) ist nicht Teil dieses Repos. Sein Playbook wurde am 04.10.2026 entfernt, es bleibt in der Git-Historie.

Grundlage für jede Analyse und Strategie ist das **E-Commerce Brand-Playbook** („Vom Markt zur Culture Brand“).

## Wo was liegt
| Ordner / Datei | Inhalt |
|---|---|
| `playbook/KONTEXT-EXPORT.md` | **Zuerst lesen.** Belegte Fakten, Entscheidungen mit Datum, offene Punkte |
| `playbook/SYSTEM.md` | Das Playbook auf einer Seite — fester Denkrahmen für alle Marketing-Aufgaben |
| `playbook/azizam/` | Azizam: Markt, Personas, Angles, Marke, Unit Economics, Creator, Recht, 90-Tage-Plan |
| `playbook/templates/` | Vorlagen (Persona-/Pain-Karte, Creator-Briefing, Verträge, CSVs) |
| `playbook.py` | Werkzeug: Status, Rechner, Prompts (siehe unten) |
| `docs/` | Original-Playbook als Markdown + PDF (64 Seiten) |
| `frontend/` | 3D-Flakon-Komponenten für die Azizam-Website (Next.js) |
| `company/` | Arbeitsergebnisse Azizam: `products/ suppliers/ compliance/ finance/ marketing/ analytics/` (Regeln in `company/README.md`) |
| `automation/` | Beschreibung wiederkehrender Aufgaben: `daily/ weekly/ monthly/` (aktuell keine aktiv) |
| `.claude/agents/` | Rollen: `ceo`, `cfo`, `marketing`, `inventory`, `research` |
| `.claude/skills/perfume-*` | Eigene Azizam-Skills: `ceo`, `compliance`, `finance`, `procurement`, `growth` |
| `.claude/skills/` (übrige) | Marketing-Skills (coreyhaines31/marketingskills) |

## Befehle
```bash
python3 playbook.py status                          # Fortschritt des 90-Tage-Plans
python3 playbook.py economics --brand azizam        # CM1/CM2/Break-even-ROAS/LTV:CAC
python3 playbook.py economics --brand azizam --all  # alle Größen × Kanäle
python3 playbook.py offers --brand azizam           # Angebotsvarianten
python3 playbook.py prompt 1 --brand azizam --data zitate.txt [--run]
python3 playbook.py swipe --brand azizam --source "Quelle" "Zitat"
python3 playbook.py export                          # alles in eine Markdown-Datei bündeln
```

## Feste Arbeitsregeln
1. **Nichts erfinden.** Personas/Pains ohne wörtliches Kundenzitat bleiben Hypothese (`[ZITAT FEHLT]`).
2. **Kein Angle ohne belegbaren Mechanismus.**
3. **Rechtliche Verbotslisten** im jeweiligen `brand-briefing.md` gelten für jeden Text, auch Creator-Skripte.
4. **Marktentscheidungen trifft Mar**, nicht die KI.
5. Neue Erkenntnisse und Entscheidungen in `playbook/KONTEXT-EXPORT.md` nachziehen.

## Git
- Haupt-Branch heißt `Azizam`. Arbeit von Claude läuft auf einem eigenen Branch und kommt per Pull Request zurück.
- Nach dem Mergen den Arbeits-Branch löschen, damit keine alten Branches liegen bleiben.

## Synchronisation
**Zu Beginn jeder Session `SYNC.md` komplett lesen** und am Ende bzw. nach wichtigen Entscheidungen aktualisieren. Sie ist die gemeinsame Übergabe-Datei zwischen Claude Chat und Claude Code (nur Azizam; Regeln stehen in der Datei selbst).

## Werkzeug-Kompass
`ARBEITSWEISE.md` sagt, wofür Chat, Code, Cowork, Konnektoren und Automatik da sind. **Erinnere Mar aktiv daran:** Wenn eine Bitte woanders besser oder günstiger erledigt wäre, sag es in einem Satz, bevor du loslegst, und am Ende einer Session kurz, was als Nächstes wo passiert. Halte den Abschnitt „Gerade dran“ in `ARBEITSWEISE.md` aktuell.
