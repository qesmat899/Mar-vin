# Azizam-System – Aufbauplan mit dem Small-Business-Plugin

> Setzt `CLAUDE-MASTER.md` §16 (Ausbau in Stufen) konkret um und ordnet jeder Stufe die passenden Skills des
> Small-Business-Plugins zu. **Vorschlag, die Reihenfolge entscheidet Mar.** Stand: 04.10.2026 [Code], Decision
> Architecture der fünf Azizam-Skills ergänzt am 05.10.2026 [Code].
> Regel für jede Stufe (Master §8): Claude bereitet vor, Mar gibt frei. Kein Skill bestellt, zahlt, veröffentlicht
> oder sendet ohne Freigabe. Das Plugin hat dieselben Sperren eingebaut.

## Ausgangslage (geprüft 04.10.2026)

| Baustein | Stand |
|---|---|
| Kontext | `SYNC.md`, `CLAUDE.md`, `CLAUDE-MASTER.md` stehen. Plugin-Profil in `BUSINESS-CONTEXT.md` (von Mar bestätigt, immer geladen) |
| Shopify | Direkter Konnektor verbunden: Shop „My Store 3“ (pbznmb-fy.myshopify.com), Plan Basic, EUR, Deutschland, laut Mar **der Shop für den Neustart**. 0 Produkte, 0 Bestellungen in den letzten 365 Tagen. Der Shopify-Zugang des Plugins selbst war nicht autorisiert, die Skills nutzen den direkten Konnektor |
| Mail, Kalender, Drive | Konnektoren verfügbar (Gmail, Google Calendar, Google Drive) |
| Buchhaltung | macht der Steuerberater, kein Buchhaltungs-Konnektor. Geschäftsjahr = Kalenderjahr (31.12.) |
| Rhythmus | Wochenüberblick montags („Monday brief“) |
| Canva | nicht verbunden; Content-Skills liefern dann Briefings statt fertiger Grafiken |
| Verkauf | keiner, bis Flakon und Verpackung feststehen |
| Eigene Skills | fünf Azizam-Skills in `.claude/skills/azizam-*` (Stand 05.10.2026), siehe „Decision Architecture“ unten |

**Folge:** Skills, die von Verkaufsdaten leben (`inventory-planner`, `business-pulse`, `cash-flow-snapshot`,
`review-reputation`), bringen vor dem Shop-Start nichts. Leere Daten sind kein Ergebnis.

---

## Stufe 0 · Fundament (jetzt, ca. 1 Std.)

| Schritt | Werkzeug | Wer |
|---|---|---|
| ✅ Plugin-Profil `## Business context` angelegt (04.10.2026) | `smb-onboard` → `BUSINESS-CONTEXT.md` | erledigt |
| Montags „Monday brief“: vor dem Verkauf nur Termine, Postfach und offene Punkte aus `SYNC.md` | `/monday-brief` | Mar sagt es montags; als Routine erst, wenn es sich bewährt |
| Markenlook und Ausgabeformat festhalten (luxuriös, Goldakzent; Farben erst mit Flakon final) | `brand-style` („update my brand“) | Code/Chat |
| `CLAUDE-MASTER.md` ins Projekt „Azizam“ laden, globale Anweisung + Memory setzen | claude.ai | Mar |
| In Cowork: Plugin-Profil aus `BUSINESS-CONTEXT.md` übernehmen, damit es auch dort gilt | Cowork | Mar |

## Stufe 1 · Vor dem Verkaufsstart (jetzt bis Flakon steht) – Autonomie Stufe 0–1

| Aufgabe | Werkzeug | Rhythmus | Wer |
|---|---|---|---|
| Wettbewerb und Trends beobachten | Prompt §7 aus `../templates/claude-anweisungen.md` als Cloud-Routine; nach Shop-Start `/marketing-monday` | wöchentlich | Routine |
| Kosmetikrecht beobachten | Prompt §11 aus `claude-anweisungen.md` | monatlich | Routine |
| Fabrik-Anfrage CPNP/CPSR/INCI + Duftallergene als **Entwurf** in Gmail | Gmail-Konnektor (nur Entwurf, Mar sendet) | einmalig | Code → Mar |
| Flakon- und Verpackungsangebote vergleichen | Chat (Abwägung), Angebote als Tabelle in Code | laufend | Chat |
| ✅ Fünf Azizam-Skills gebaut (05.10.2026), siehe „Decision Architecture“. Offen: Skill Produktlisting | Code; `build-agent` („make this a thing I can just ask for“) möglich | einmalig | Code |

## Stufe 2 · Flakon steht – Produktdaten

| Aufgabe | Werkzeug | Wer |
|---|---|---|
| Preise für 30/50 ml entscheiden | Chat, dann `brand.json` + `python3 playbook.py economics`; Bewertung mit `azizam-unit-economics` | Chat → Code, Mar entscheidet |
| Datensatz je Duft + Master-Index (Master §6) | Code (`playbook/azizam/commercial/`, Struktur angelegt 05.10.2026, noch leer), geprüft mit `azizam-product-data` und `playbook.py daten` | Code |
| Compliance-Matrix je Duft, Status je Dokument FEHLT / PRÜFUNG ERFORDERLICH / DOKUMENTARISCH KONSISTENT, Gate je Produkt PASS / REVIEW / BLOCK | `azizam-compliance-auditor` | Code |
| Farben und Logo final | `brand-style` | Mar |

## Stufe 3 · Shop-Neustart

| Aufgabe | Werkzeug | Wer |
|---|---|---|
| Produkte in Shopify **als Entwurf** anlegen (aus dem Datensatz, mit Verbotsliste) | Shopify-Konnektor + Skill Produktlisting | Code, Mar veröffentlicht |
| SEO und KI-Sichtbarkeit: Titel, Beschreibungen, Alt-Texte, Schema, `llms.txt` | `seo-ai-visibility` | Code |
| Content-Kalender, Captions, Repurposing; Posts nur vorbereitet | `social-content-engine` (+ `canva-creator`, falls Canva verbunden) | Code/Chat |
| Launch-Ablauf (Master §13) | Marketing-Skill `launch` + `playbook/azizam/90-tage-plan.md` | Chat → Code |
| Shop-Pflichten Tag 1 (Impressum, Widerruf, Grundpreis, § 19-Hinweis, GPSR) | Checkliste `07-recht-retention.md` | Mar/Code |
| FAQ-Wissensbasis (Versand, Rückgabe, Anwendung) für den Kundenservice | Code | Code |

## Stufe 4 · Erste Verkäufe – Autonomie Stufe 1–2

| Aufgabe | Werkzeug | Rhythmus |
|---|---|---|
| Wochenbriefing: Verkäufe, Termine, Postfach, das Wichtigste der Woche | `/monday-brief` („Monday brief“) | Montag |
| Wachstumsbriefing: Marketing, Kundenstimmen, Wettbewerb, 3 Maßnahmen | `/marketing-monday` | Montag |
| Bestellungen im Blick, Kundenmails beantworten (Entwurf), Erstattung nur mit Freigabe | `ticket-deflector` („check my orders“) | täglich/bei Bedarf |
| Nachbestellen: Fertigware aus Shopify, **Flakons, Verschlüsse, Etiketten, Boxen per CSV-Liste** (stehen nicht in Shopify) | `azizam-procurement-inventory` (RECOMMENDED ORDER); Rechenhilfe `inventory-planner` bzw. `/restock`; bestellt wird erst nach Mars Freigabe | Freitag |
| Bewertungen sammeln und beantworten (Entwurf); nur echte, mit Einwilligung | `review-reputation` | wöchentlich |
| Werbung auswerten, sobald Anzeigen laufen | `ad-manager`, `growth-pulse` | wöchentlich |

## Stufe 5 · Abläufe stabil – Autonomie Stufe 3

| Aufgabe | Werkzeug |
|---|---|
| Kennzahlen-Paket aus Master §14 (DB je Duft, CAC, ROAS, Wiederkaufrate) | `report-builder`, `/report-pack` |
| Monatsunterlagen für den Steuerberater (Shopify-Export, Belege aus Gmail/Drive sortiert) | `report-builder` bzw. eigener Skill über `build-agent`; `/close-month` erst mit Buchhaltungs-Konnektor |
| Board-Report monatlich (Master §9) | Prompt §10 aus `claude-anweisungen.md` als Routine |
| Agenten mit Freigabegrenzen, die Mar festlegt | `build-agent`, später eigenes Plugin „Azizam OS“ |

---

## Decision Architecture – die fünf Azizam-Skills als System

Die fünf Skills in `.claude/skills/` arbeiten in festen Schichten. Gilt für alle Stufen oben; die Regeln zu Gates und
Status stehen in `CLAUDE-MASTER.md` §9.1, die Fachlogik nur in der jeweiligen `SKILL.md`.

```text
Product Data                        azizam-product-data
        ↓
Compliance / Economics / Procurement
                                    azizam-compliance-auditor · azizam-unit-economics · azizam-procurement-inventory
        ↓
CEO / Decision Orchestrator         azizam-ceo-orchestrator
        ↓
CEO / Mar Decision                  Mar
        ↓
Operational Execution               Shopify, Bestellung, Mail, Veröffentlichung – nur nach Freigabe
```

| Schicht | Rolle | Was sie nicht tut |
|---|---|---|
| **Product Data** | Liefert die Grundlage: welche Produktversion, welche Angaben mit welcher Quelle, was fehlt, widerspricht sich oder ist veraltet. Sagt je Fach-Skill, ob die Daten READY / PARTIAL / NOT READY sind | keine Compliance-Freigabe, keine Wirtschaftlichkeit, keine Bestellentscheidung |
| **Fachbewertung** | Drei Fach-Skills bewerten unabhängig, jeder in seiner Domäne und mit eigener Logik: **Compliance** (harte Gates PASS / REVIEW / BLOCK), **Economics** (Kosten, Margen, CM1/CM2, Break-even), **Procurement** (Lieferanten, MOQ, Preise, Lieferzeit, Bestand, nur RECOMMENDED ORDER) | keine übergreifende Geschäftsentscheidung; kein Fach-Skill überstimmt einen anderen |
| **Decision Layer** | Der Orchestrator führt die Ergebnisse zusammen, zeigt Konflikte, offene Punkte und harte Gates, stellt Optionen dar und empfiehlt GO / HOLD / REVIEW / BLOCK mit dem kleinsten sicheren nächsten Schritt. Fehlende Inputs gehen als Rückfrage an den zuständigen Fach-Skill zurück | keine Fachprüfung, keine erfundenen Daten, kein Überstimmen eines Compliance-BLOCK, keine Entscheidung anstelle von Mar, keine Ausführung |
| **CEO / Mar** | Entscheidet final und gibt frei | – |
| **Operational Execution** | Setzt die Entscheidung um (Produkt in Shopify, Bestellung, Mail, Veröffentlichung), heute durch Mar oder durch Claude als Entwurf mit Freigabe (Autonomiestufe 0–1) | startet nie ohne Entscheidung bzw. Freigabe |

Wichtig: Der Orchestrator sitzt **zwischen Fachbewertung und Mars Entscheidung**, nicht zwischen Entscheidung und
Ausführung. Aus einer Orchestrator-Empfehlung folgt keine Aktion, erst aus Mars Entscheidung.

---

## Was aus dem Plugin für Azizam (vorerst) nicht passt

| Skill | Grund |
|---|---|
| `/tax-prep`, `tax-season-organizer` | rechnen US-Steuer; für Deutschland liefern sie nur das Abschlusspaket für den Steuerberater. Kleinunternehmer § 19 UStG beachten |
| `invoice-chase`, `ap-processor`, `/pay-the-bills` | B2C mit Vorkasse; erst relevant, wenn Lieferantenrechnungen in größerer Zahl kommen |
| `lead-finder`, `lead-triage`, `speed-to-lead`, `crm-autopilot`, `/grow-pipeline`, `/call-list`, `outreach-composer`, `proposal-builder` | B2B-Vertrieb mit CRM, kein Azizam-Modell (Großhandel ist nicht entschieden) |
| `payroll-prep`, `/plan-payroll`, `hiring-screener`, `job-post-builder` | keine Mitarbeiter |
| `grant-rfp-writer` | kein Thema |

## Auslöser auf einen Blick (sobald die Stufe erreicht ist)

| Ich sage … | Es läuft |
|---|---|
| „Monday brief“ / „start my week“ | `/monday-brief` |
| „Marketing Monday“ / „growth check“ | `/marketing-monday` |
| „check my orders“ / „answer this customer“ | `ticket-deflector` |
| „what do I need to reorder“ | `inventory-planner` |
| „was wissen wir über Duft X“ / „Produktdaten prüfen“ | `azizam-product-data` |
| „Compliance prüfen“ / „darf ich launchen“ | `azizam-compliance-auditor` |
| „lohnt sich das“ / „Marge“ / „Break-even“ | `azizam-unit-economics` |
| „was muss ich bestellen“ / „Lieferant vergleichen“ | `azizam-procurement-inventory` |
| „was soll ich als Nächstes tun“ / „CEO-Brief“ | `azizam-ceo-orchestrator` |
| „what are people saying about us“ | `review-reputation` |
| „make the content“ / „give me a month of posts“ | `social-content-engine` |
| „SEO audit“ / „fix my product listings“ | `seo-ai-visibility` |
| „update my brand“ | `brand-style` |
| „make this a thing I can just ask for“ | `build-agent` |
| „what can you do“ / „where do I start“ | `smb-router` |
