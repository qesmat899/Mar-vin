# Arbeitsweise – welches Werkzeug wann (Azizam)

> Kurz-Kompass für Mar. Claude Code zeigt ihn bei jedem Sessionstart an und weist darauf hin,
> wenn eine Aufgabe woanders besser aufgehoben ist.

## Die fünf Bausteine

| Baustein | Was es ist | Bei Azizam |
|---|---|---|
| **Kontext** | Was Claude über das Business immer weiß | `SYNC.md`, `CLAUDE.md`, `CLAUDE-MASTER.md` (Wissensbasis), `playbook/`, Projekt-Anweisungen in claude.ai |
| **Skills** | Anleitungen für wiederkehrende Aufgaben | z. B. Produkttext mit Verbotsliste, Wochenreport |
| **Konnektoren** | Zugriff auf Tools | Shopify, Gmail, Kalender, Drive, Canva, GitHub |
| **Automatik** | Läuft ohne Mar | Hooks (Code), geplante Aufgaben (Cowork), Routinen (Cloud) |
| **Agents** | Eigenständige Helfer | erst bei großen, abgrenzbaren Aufgaben |

## Was nutze ich wofür?

| Ich will … | Werkzeug |
|---|---|
| abwägen, entscheiden, recherchieren, Texte entwerfen | **Claude Chat** (im Projekt „Azizam“) |
| Dateien ändern, Website/Shop bauen, rechnen, `SYNC.md` pflegen | **Claude Code** |
| etwas regelmäßig erledigen lassen (Montagsbericht, Postfach) | **Cowork** (Rechner an) oder **Cloud-Routine** (Rechner aus) |
| Shop-Daten sehen oder ändern | **Shopify-Konnektor** – lesen frei, ändern nur mit Freigabe |
| E-Mails, Termine | **Gmail/Kalender-Konnektor** – nie automatisch senden |

Faustregel: **Am Ende soll eine Entscheidung stehen → Chat. Am Ende soll eine Datei stehen → Code.**

## Effizient arbeiten (unter 5 Std./Woche)

1. **Eine Frage pro Session.** Lieber kurz und abgeschlossen als lang und halb fertig.
2. **Erst Chat, dann Code.** Entscheidung treffen, direkt danach in Code umsetzen und `SYNC.md` aktualisieren.
3. **Chat startet mit Kontext.** Im Projekt auf „Sync“ klicken (GitHub) oder `SYNC.md` einfügen.
4. **Chat endet mit Update-Block.** Den Block in der nächsten Code-Session einfügen: „arbeite das in SYNC.md ein“.
5. **Wiederholt sich etwas dreimal → Skill oder Automatik daraus machen.**
6. **Entscheiden tut Mar.** Claude liefert Optionen mit Begründung.

## Gerade dran (Stand 04.10.2026)

- Flakon + Verpackung finden → **Chat**
- `CLAUDE-MASTER.md` ins Projekt „Azizam“ hochladen, globale Anweisung + Memory aus `playbook/templates/claude-anweisungen.md` setzen → **Mar** (claude.ai)
- Azizam-System nach `playbook/azizam/SYSTEM-AUFBAU.md` aufbauen: jetzt Stufe 0–1 (Profil steht, Montag „Monday brief“, Wettbewerbs- und Rechts-Routine) → **Code**/**Cloud-Routine**
- CPNP/Sicherheitsbewertung bei der Fabrik schriftlich bestätigen → **Mar**
- Preise festlegen, sobald Flakonpreis steht → **Chat**, dann **Code** (`brand.json` + Rechner)
- 100 ml erst nach den ersten 30/50-ml-Verkäufen wieder aufgreifen
