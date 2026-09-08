# Azizam — Der 90-Tage-Fahrplan

Fortschritt: `python3 playbook.py status --brand azizam` (zählt die Kästchen). Start: ______ · Tag 90: ______

## Woche 1–2 · Markt & Persona
- [ ] Markt nach Prüfliste aus `01-markt.md` bewerten — Google Trends (5 J.) für „arabisches Parfum“, „Nischenduft“, „Safran Parfum“ dokumentieren
- [ ] Meta Ads Library: 20 Wettbewerber, Anzeigenalter und Haupt-Angle in die Tabelle in `01-markt.md`
- [ ] 150–200 Rohzitate sammeln: Parfumo (40) · Reddit (40) · TikTok-Kommentare (40) · Amazon 2–3★ (40) · Trustpilot (20)
- [ ] Swipe-Datei füllen (`playbook.py swipe --brand azizam --source ... "Zitat"`)
- [ ] 10 Menschen aus der Community die drei Fragen stellen (Trigger · Versuche · „wenn es morgen weg wäre“)
- [ ] Prompt 1 laufen lassen, Personas in `02-personas-pains.md` gegen echte Daten korrigieren
- [ ] Pro Persona 2–3 Pain-Karten mit je 3 echten Zitaten (Prompt 2) — `[ZITAT FEHLT]` entfernen
- [ ] Haupt-Persona bestätigen oder wechseln (Score + Category-of-One-Argument)

## Woche 3–4 · Produkt & Marke
- [ ] Produkt gegen die vier Kriterien in `04-produkt-marke.md` prüfen
- [ ] Unique Mechanism belegen: Duftölanteil (%) und Rohstoffherkunft schriftlich vom Lieferanten
- [ ] 3–5 Abfüller/Parfümeure anfragen (DE/FR), Muster für 2–3 Düfte bestellen (Tag/Abend/Nowruz)
- [ ] Unit Economics mit echten Angeboten rechnen — Ziel COGS ≤ 12 €, Marge ≥ 65 %
- [ ] Brand-Steckbrief finalisieren (Farben, Nastaliq-Schriftzug, Gedichtkarte, Flakon)
- [ ] Markenrecherche DPMA/EUIPO „Azizam“ Klasse 3, Domain + Handles sichern, Wortmarke anmelden
- [ ] Rechtliches starten: verantwortliche Person klären, Safety Assessor für CPSR beauftragen, Gefahrgut-Versand (UN 1266 LQ) mit Versanddienstleister klären
- [ ] Prompt 6 (Rezensions-Mining) auf 100 Wettbewerber-Rezensionen — Mechanismus gegen echte Enttäuschungen prüfen

## Woche 5–6 · Aufbau
- [ ] Shopify aufsetzen, mobil-first; 3D-Flakon-Hero aus `frontend/components/` einbinden
- [ ] Produktseite nach Angle → Pain → Mechanismus → Beweis → Offer (LP-Struktur in `03-angles-hooks.md`)
- [ ] Rechtstexte: Impressum, Datenschutz (alle Pixel/Tools), Widerruf, AGB, Cookie-Consent
- [ ] PAngV: Grundpreis €/100 ml auf jeder Produktseite; GPSR-Angaben; INCI + Allergene auf Produktseite
- [ ] LUCID-Registrierung, Zahlungsanbieter (Auszahlungszyklen prüfen), Versand mit Gefahrgut-LQ
- [ ] CPNP-Notifizierung abgeschlossen, PIF liegt vor — **kein Verkauf vorher**
- [ ] Tracking: Meta Pixel + Conversions API, TikTok Pixel + Events API, Server-Side wenn möglich
- [ ] Klaviyo: Welcome, Warenkorbabbruch, Post-Purchase (Inhalte in `07-recht-retention.md`), Double-Opt-In
- [ ] 12–18 Angles final (Prompt 3 mit echten Zitaten), je 5 Hooks (Prompt 4)
- [ ] Discovery-Set (3 × 2 ml) produziert; Gedichtkarte und Probe als Paketbeilage

## Woche 7–8 · Testing
- [ ] 10–15 Creatives produzieren: eigene UGC + Founder-Story + 3–5 Nano-Creator (Barter)
- [ ] Testkampagne breit, Advantage+ Placements; eine Kampagne, viele Creatives; TikTok parallel
- [ ] Budget 3–5 × Ziel-CPA (22 €) = 66–110 € pro Creative, 5–7 Tage laufen lassen
- [ ] Täglich Hook Rate, Hold Rate, CTR, CPA in `../templates/testing-log.csv` — nicht täglich abschalten
- [ ] Nach 7 Tagen: Winner (CPA < 34,60 €) und Verlierer analysieren — „und warum nicht?“
- [ ] Offer-Test: Einmalkauf vs. 2+1 vs. 1 + Reisegröße + Karte, gleiches Budget
- [ ] Entscheidung Haupt-Persona bestätigen (Darius-Angles vs. Leon-Angles nach CPA)

## Woche 9–10 · Creator-Outreach
- [ ] 100+ Creator aus den vier Pools recherchieren → `creator-outreach.csv`
- [ ] Assoziations-Check pro Creator (Feed, Kommentare, Werbedichte), nicht nur Reichweite
- [ ] Anschreiben personalisiert versenden (IG-DM zuerst), Follow-up nach 4–5 Tagen genau einmal
- [ ] Barter-Deals schriftlich: Nutzungsrechte 12 Monate, Spark-Code 30 Tage, Kennzeichnung, Verbotsliste
- [ ] Briefings auf validierten Angles schreiben (Prompt 5), Winner-Skript an 2–3 Creator, 3 Skripte an 1 Creator
- [ ] Flakons versenden (Gefahrgut beachten), Fristen tracken

## Woche 11–12 · Skalierung
- [ ] Creator-Posts live, Spark-/Partnership-Codes einsammeln
- [ ] Spark Ads gegen eigene Creatives vergleichen
- [ ] Creator-vs.-Skript-Matrix auswerten (`06-creator-skalierung.md`)
- [ ] Funnel TOF/MOF/BOF mit korrekten Zielgruppen und Budgetsplit 65/25/10
- [ ] Budget in 20–30-%-Schritten alle 2–3 Tage erhöhen — nur bei CM2 > 0 über 7 Tage
- [ ] Creative-Produktion verstetigen: 10–20 neue pro Monat (Creator-Trichter läuft weiter)
- [ ] Post-Purchase-Upsell (10 ml / zweiter Duft) und Replenishment-Flow (Tag 100–120) aktivieren
- [ ] Ersten Drop planen (Nowruz 20./21.03. oder Yalda 21.12. — je nachdem, was näher liegt): Stückzahl, Vorverkauf für Newsletter

## Ab Tag 90
- [ ] Wöchentlich: MER, CM2, Wiederkaufrate, Creative-Frequenz (Fatigue ab 2,5–3)
- [ ] Monatlich: neue Angles aus Post-Purchase-Umfrage („Was war der Auslöser?“) und Review-Antworten
- [ ] Quartalsweise: Personas gegen echte Kundendaten prüfen; Wardrobe-Abo einführen, sobald zweiter Duft läuft
