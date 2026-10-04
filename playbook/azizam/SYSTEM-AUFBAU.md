# Azizam-System – Aufbauplan mit dem Small-Business-Plugin

> Setzt `CLAUDE-MASTER.md` §16 (Ausbau in Stufen) konkret um und ordnet jeder Stufe die passenden Skills des
> Small-Business-Plugins zu. **Vorschlag, die Reihenfolge entscheidet Mar.** Stand: 04.10.2026 [Code].
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
| Wettbewerb und Trends beobachten | Prompt §7 aus `templates/claude-anweisungen.md` als Cloud-Routine; nach Shop-Start `/marketing-monday` | wöchentlich | Routine |
| Kosmetikrecht beobachten | Prompt §11 aus `claude-anweisungen.md` | monatlich | Routine |
| Fabrik-Anfrage CPNP/CPSR/INCI + Duftallergene als **Entwurf** in Gmail | Gmail-Konnektor (nur Entwurf, Mar sendet) | einmalig | Code → Mar |
| Flakon- und Verpackungsangebote vergleichen | Chat (Abwägung), Angebote als Tabelle in Code | laufend | Chat |
| Eigene Skills vorbereiten: Compliance-Auditor, Produktlisting | `build-agent` („make this a thing I can just ask for“) | einmalig | Code |

## Stufe 2 · Flakon steht – Produktdaten

| Aufgabe | Werkzeug | Wer |
|---|---|---|
| Preise für 30/50 ml entscheiden | Chat, dann `brand.json` + `python3 playbook.py economics` | Chat → Code |
| Datensatz je Duft + Master-Index (Master §6) | Code (`playbook/azizam/produkte.csv`) | Code |
| Compliance-Matrix je Duft, Status FEHLT / PRÜFUNG ERFORDERLICH / DOKUMENTARISCH KONSISTENT | eigener Skill Compliance-Auditor | Code |
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
| Nachbestellen: Fertigware aus Shopify, **Flakons, Verschlüsse, Etiketten, Boxen per CSV-Liste** (stehen nicht in Shopify) | `inventory-planner` bzw. `/restock` | Freitag |
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
| „what are people saying about us“ | `review-reputation` |
| „make the content“ / „give me a month of posts“ | `social-content-engine` |
| „SEO audit“ / „fix my product listings“ | `seo-ai-visibility` |
| „update my brand“ | `brand-style` |
| „make this a thing I can just ask for“ | `build-agent` |
| „what can you do“ / „where do I start“ | `smb-router` |
