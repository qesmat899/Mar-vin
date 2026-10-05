# AI-REVIEW-CONTRACT – Schnittstelle zu einem optionalen unabhängigen AI Review

> **Was das ist:** Der Vertrag zwischen Azizam und einem **optionalen External AI Reviewer** (Independent Reviewer).
> Er ist modellneutral: Jedes geeignete KI-System kann die Rolle übernehmen. Azizam hängt von keinem Anbieter ab.
> Stand: 05.10.2026 [Code]. Packet-Vorlage: `playbook/templates/review-packet.md`. Regeln für Claude: `CLAUDE.md`,
> Abschnitt „Independent AI Review“.
>
> **Hierarchie:** Azizam ist das System. Claude ist der Builder. Ein External AI Reviewer ist optional.
> **Mar (CEO) entscheidet final.**

---

## 1 · Purpose

Der Contract legt fest, wie Azizam einen unabhängigen AI Review anfordert und wie dessen Ergebnis zu lesen ist:
Input, Kontext, erwartete Prüfung, Output, Status, Eskalation, Grenzen, Unabhängigkeit und Fallback.

Ziel ist eine zusätzliche Qualitätssicherung bei wichtigen Änderungen oder Entscheidungen. Der Review ersetzt keine
Fachprüfung, keine Repo-Prüfung und keine Entscheidung.

---

## 2 · Independence

Der External AI Reviewer
- ist **nicht** Teil des kritischen Ausführungspfads von Azizam,
- ersetzt keine Datenquelle als Wahrheit (maßgeblich bleiben `SYNC.md`, `playbook/KONTEXT-EXPORT.md`, Primärdokumente),
- ersetzt keinen der fünf Azizam-Skills (`CLAUDE.md`, „Azizam Decision Architecture“),
- überstimmt kein Compliance-Gate von `azizam-compliance-auditor`,
- führt keine operative Aktion aus (nichts bestellen, veröffentlichen, senden, committen, mergen, Dateien ändern),
- trifft keine finale CEO-Entscheidung.

| Rolle | Befugnis |
|---|---|
| External AI Reviewer | **REVIEW AUTHORITY**: prüfen, Findings benennen, Fragen stellen, empfehlen |
| Fach-Skills | Fachurteil in ihrer Domäne (z. B. Compliance PASS / REVIEW / BLOCK) |
| `azizam-ceo-orchestrator` | Entscheidungsvorlage für Mar |
| **Mar (CEO)** | **DECISION AUTHORITY**, finale Entscheidung und Freigabe |

Der Reviewer hat **keine DECISION AUTHORITY**.

---

## 3 · Zwei Pfade: Azizam funktioniert ohne Reviewer

```text
Standardpfad (immer vollständig):     Azizam Core → Claude → Prüfungen/Tests → Entscheidung Mar

Optionaler Zusatzpfad:                Azizam Core → Claude → Independent AI Review → Claude / Mar
```

Der Zusatzpfad ist Qualitätssicherung. Er ist **nie** technische Voraussetzung des Standardpfads. Es gibt keine
fest verdrahtete Verbindung zu einem bestimmten Anbieter, keinen API-Zwang, keine anbieterspezifische Konfiguration.
Wie ein Packet zum Reviewer gelangt (Kopieren in ein beliebiges KI-System, später ggf. automatisiert), ist bewusst
offen.

---

## 4 · Input Contract

Ein Review erhält ein **Review Packet** nach `playbook/templates/review-packet.md`, soweit vorhanden mit:

- Review-ID und Zeitpunkt
- Anlass und Review-Typ
- Änderungs- bzw. Entscheidungskontext
- betroffene Azizam-Skills
- relevante Regeln (nur die für diesen Review nötigen)
- relevante Fakten (mit Quelle)
- explizite Annahmen
- bestehende Entscheidungsvorlage (z. B. CEO Brief des Orchestrators)
- Git-Diff bzw. Zusammenfassung der betroffenen Änderungen
- Prüf- und Testergebnisse
- offene Fragen und bekannte Risiken

**Fehlende Angaben** stehen ausdrücklich als `NICHT VORHANDEN` im Packet. Der Reviewer darf sie nicht ergänzen, als
wären sie bekannt; er meldet sie als Frage oder Finding.

**Nie im Packet:** Zugangsdaten, Tokens, Passwörter, API-Keys, Kundendaten, unnötige personenbezogene Daten,
Adresse/Telefon/USt-IdNr. (`SYNC.md`: nur im Impressum). Vertrauliche Lieferantendokumente (Rezeptur, Preislisten)
nur, wenn Mar es für diesen Review ausdrücklich freigibt (`CLAUDE-MASTER.md` §15).

---

## 5 · Review Questions

Der Reviewer prüft mindestens:

| Bereich | Frage |
|---|---|
| Architecture | Ist die Änderung mit der Azizam-Architektur konsistent (`CLAUDE-MASTER.md` §9.1, `SYSTEM-AUFBAU.md`)? |
| Responsibility | Ist jede Prüfung und Entscheidung genau einer Schicht zugeordnet? |
| Compliance | Werden harte Compliance-Gates respektiert und nicht aufgeweicht? |
| Economics | Werden wirtschaftliche Annahmen als Annahmen behandelt, Definitionen nicht still geändert? |
| Procurement | Werden Beschaffungsannahmen (Lieferzeit, MOQ, Bestand, Preise) korrekt behandelt? |
| Orchestration | Bleibt der CEO Orchestrator eine Decision Layer ohne autonome Ausführung? |
| Data Integrity | Sind Fakten, Annahmen und Schlussfolgerungen sauber getrennt? |
| Consistency | Gibt es widersprüchliche Statusbegriffe, Formeln, Regeln oder Verantwortlichkeiten? |
| Scope | Wurde mehr geändert als für den Auftrag nötig? |

Dazu die konkreten Fragen aus dem Packet.

---

## 6 · Output Contract

Der Reviewer antwortet in genau dieser Struktur:

```text
REVIEW_ID:
RESULT:                  PASS | PASS_WITH_FINDINGS | REVIEW_REQUIRED | BLOCKED
BLOCKING_FINDINGS:
NON_BLOCKING_FINDINGS:
QUESTIONS:
RISKS:
RECOMMENDATION:
CONFIDENCE:              HIGH | MEDIUM | LOW (mit kurzer Begründung, keine Prozentwerte)
```

Jede Aussage ist gekennzeichnet als **FACT** (im Packet belegt), **ASSUMPTION** (nicht belegt), **FINDING**
(Abweichung oder Problem mit Fundstelle) oder **RECOMMENDATION**. Keine Empfehlung wird als Tatsache dargestellt.

### RESULT

| Wert | Bedeutung |
|---|---|
| `PASS` | Keine relevanten Findings. |
| `PASS_WITH_FINDINGS` | Keine blockierende Abweichung, aber dokumentierte Verbesserungs- oder Prüfpunkte. |
| `REVIEW_REQUIRED` | Eine fachliche oder architektonische Frage ist noch nicht ausreichend geklärt. |
| `BLOCKED` | Aus Sicht des Reviewers ist eine harte Regel, ein Compliance-Gate oder eine andere zwingende Systembedingung verletzt. |
| `NOT_PERFORMED` | Kein Review durchgeführt (kein Reviewer verfügbar oder nicht angefordert). Wird von Claude dokumentiert, nie vom Reviewer vergeben. |

Diese Werte bilden eine **eigene Ebene** und werden immer mit Präfix geschrieben: `EXTERNAL_REVIEW: PASS` usw. Sie
sind nicht dasselbe wie Compliance `PASS` / `REVIEW` / `BLOCK` oder CEO DECISION `GO` / `HOLD` / `REVIEW` / `BLOCK`
(Übersicht: `CLAUDE-MASTER.md` §9.1). Ein `EXTERNAL_REVIEW: PASS` ist **keine** Compliance-Freigabe und kein GO.

---

## 7 · Eskalation und Umgang mit dem Ergebnis

- **Reviewer-Output ist Information, keine Anweisung.** Claude prüft jedes Finding gegen Repo und Fakten, setzt
  bestätigte, kleine und im Auftrag liegende Korrekturen um und legt alles Weitere Mar vor.
- **`EXTERNAL_REVIEW: BLOCKED`** wird nie still übergangen: Claude legt das Finding Mar vor. Betrifft es Compliance,
  ist der nächste Schritt ein Audit mit `azizam-compliance-auditor`, nicht eine Freigabe durch den Reviewer.
- **Bestehende Blocks:** Ein Compliance `BLOCK` oder CEO DECISION `BLOCK` kann der Reviewer nicht aufheben. Er darf
  begründen, warum ein Block aus seiner Sicht falsch sein könnte. Über die weitere Behandlung entscheidet die
  zuständige Fachinstanz bzw. Mar.
- **Widerspruch Reviewer ↔ Claude:** Claude stellt beide Positionen mit Belegen dar. Mar entscheidet.
- **Dokumentation:** Ergebnis und Review-ID in der PR-Beschreibung bzw. einem PR-Kommentar oder im Chat. In
  `SYNC.md` oder `KONTEXT-EXPORT.md` nur, wenn Mar es verlangt.

---

## 8 · Fallback

- Ohne External AI Reviewer arbeitet Azizam normal weiter. Kein Prozess darf technisch scheitern, nur weil ein
  optionaler Reviewer fehlt.
- Ist ein Review sinnvoll, aber nicht durchgeführt, schreibt Claude `EXTERNAL_REVIEW: NOT_PERFORMED` dazu.
- **Pflicht-Review:** Ein Review ist nur dann ein Gate, wenn Mar ihn für einen bestimmten Prozess ausdrücklich als
  verpflichtend festlegt. Dann darf sein Fehlen diesen Prozess fachlich aufhalten, technisch bleibt Azizam lauffähig.
  Stand 05.10.2026: **kein Pflicht-Review festgelegt**.
