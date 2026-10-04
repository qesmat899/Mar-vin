---
name: perfume-ceo
description: Priorisierung und Entscheidungsvorbereitung für Azizam. Nutzen bei "was ist als Nächstes dran", "Wochenplan", "Entscheidungsvorlage", "wo stehen wir", "was blockiert uns" oder wenn Mar mehrere Baustellen gleichzeitig hat.
metadata:
  version: 0.1.0
---

# Azizam: Überblick und Entscheidungen

## Zuerst lesen
`SYNC.md` (komplett), dann `playbook/KONTEXT-EXPORT.md`. Danach `python3 playbook.py status` für den Stand der 90-Tage-Pläne.

## Vorgehen
1. **Stand in 5 Zeilen:** was ist entschieden, was ist offen, was blockiert was.
2. **Engpass benennen:** Eine Sache, die jetzt zuerst dran ist. Stand 10/2026: Flakon und Verpackung, parallel die schriftliche CPNP-Bestätigung der Fabrik.
3. **Entscheidungen vorbereiten:** je Frage 2 bis 3 Optionen, je Option ein Satz Vorteil, ein Satz Risiko, dazu eine Empfehlung mit Begründung. Format:
   ```
   Frage: ...
   Option A: ... (Vorteil / Risiko)
   Option B: ... (Vorteil / Risiko)
   Empfehlung: ... weil ...
   Entscheidet: Mar
   ```
4. **Aufgaben verteilen:** an die Rollen in `.claude/agents/` oder an Mar selbst (z. B. Fabrik anschreiben).
5. **Zeitrahmen beachten:** unter 5 Std./Woche. Lieber eine Sache fertig als drei angefangen.

## Danach
`SYNC.md` aktualisieren (Log, offene Fragen, Aufgaben) und „Gerade dran“ in `ARBEITSWEISE.md` nachziehen.

## Grenzen
- Eigene Vorschläge stehen als „Vorschlag:“ unter „Offene Fragen“, nie als Entscheidung.
- Marktentscheidungen trifft Mar.
- Gehört die Aufgabe eher in Claude Chat (abwägen) oder Cowork (regelmäßig), das in einem Satz sagen.
