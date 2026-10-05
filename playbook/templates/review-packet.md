# Vorlage: Azizam Review Packet

> Für einen optionalen Independent AI Review nach `AI-REVIEW-CONTRACT.md`. Claude füllt die Vorlage aus `git` und dem
> Sitzungskontext, gibt sie als einen Markdown-Block aus und legt sie nur auf Mars Wunsch als Datei ins Repo.
> Modellneutral: Das Packet funktioniert mit jedem geeigneten KI-System.
>
> **Regeln beim Ausfüllen**
> - Kompakt: genug Kontext, dass der Reviewer die Änderung ohne das ganze Repo versteht; keine Repo-Masse.
>   Relevante Regeln und Ausschnitte zitieren, nicht ganze Dateien. Voller Diff nur, wenn er kurz ist.
> - Fehlendes als `NICHT VORHANDEN` eintragen, nichts ergänzen.
> - Fakten mit Quelle; Annahmen ausdrücklich als Annahme.
> - Nie: Zugangsdaten, Tokens, Passwörter, API-Keys, Kundendaten, unnötige personenbezogene Daten. Vertrauliche
>   Lieferantendokumente nur mit Mars Freigabe.
>
> **Woher die Metadaten kommen:** `git rev-parse --abbrev-ref HEAD` (Branch) · `git rev-parse --short HEAD` (Commit) ·
> `git diff --stat <Basis>...HEAD` und `git diff <Basis>...HEAD -- <Datei>` (Diff Summary, Ausschnitte).
> Review-ID: `AZ-REV-<JJJJ-MM-TT>-<kurzer-slug>`.

````markdown
# Azizam Review Packet

## Metadata

Review ID:
Date:
Repository:
Branch:
Commit:
Author:            (z. B. Claude Code im Auftrag von Mar)
Review Type:       Architecture | Compliance Gate | Orchestrator | Formula | Status Definitions | Responsibilities | Decision Logic | Economic Impact | Multi-Skill | Open Conflict

## Objective

Was soll geändert oder entschieden werden?

## Decision Context

Warum ist die Änderung notwendig? Wer hat sie beauftragt?

## Relevant Skills

Nur die betroffenen:
- Product Data (`azizam-product-data`)
- Compliance (`azizam-compliance-auditor`)
- Economics (`azizam-unit-economics`)
- Procurement (`azizam-procurement-inventory`)
- CEO Orchestrator (`azizam-ceo-orchestrator`)

## Relevant Rules

Nur die für diesen Review relevanten Regeln, mit Fundstelle (Datei, Abschnitt).
Immer gültig: Mar entscheidet final · Compliance BLOCK ist nicht überstimmbar · Orchestrator führt nichts aus ·
UNKNOWN wird nie zum Fakt.

## Facts

Nur bekannte Fakten, je mit Quelle.

## Assumptions

Explizite Annahmen. Keine → „keine“.

## Proposed Change / Decision

Was wurde geändert oder soll entschieden werden?

## Diff Summary

Geänderte Dateien (aus `git diff --stat`) und je Datei ein bis zwei Sätze, was sich geändert hat.
Ausdrücklich nennen, was nicht geändert wurde (z. B. `SYNC.md`, Formeln, Werte).

## Test Results

Welche Prüfungen liefen, mit Ergebnis (z. B. `git diff --check`, YAML-Prüfung der Skill-Frontmatter,
`python3 playbook.py economics --brand azizam` bei Formeländerungen, Konsistenzprüfung). Nicht gelaufen → nennen.

## Known Findings

Bereits bekannte Probleme, Konflikte oder Unsicherheiten.

## Questions for Independent Reviewer

1. Konkrete Frage

## Expected Review Output

Antwort bitte im Output Contract aus `AI-REVIEW-CONTRACT.md` §6:

REVIEW_ID:
RESULT:                  PASS | PASS_WITH_FINDINGS | REVIEW_REQUIRED | BLOCKED
BLOCKING_FINDINGS:
NON_BLOCKING_FINDINGS:
QUESTIONS:
RISKS:
RECOMMENDATION:
CONFIDENCE:              HIGH | MEDIUM | LOW

Kennzeichne jede Aussage als FACT, ASSUMPTION, FINDING oder RECOMMENDATION. Ergänze keine fehlenden Fakten.
Du hast Review-Befugnis, keine Entscheidungsbefugnis; die finale Entscheidung trifft Mar.
````
