# Azizam — die nächsten Handlungsschritte (Stand: Website fast fertig, Ware da)

Ziel: Umsatz. Reihenfolge nach dem Playbook, angepasst an die Realität: Produkt und Website existieren schon,
also beginnt Research nicht am Schreibtisch, sondern **beim Verkaufen**. Jeder private Verkauf ist ein
Research-Gespräch und finanziert die Rechtskosten für den Onlineshop.

Abhaken hier oder per `python3 playbook.py status --brand azizam` (dieser Plan zählt mit).

## Schritt 0 · Diese Woche: drei Dinge parallel anstoßen

### A · Rechtsfreigabe bei der Fabrik anfordern (blockiert den Onlineshop — nicht den Privatverkauf)
Eine E-Mail an die Fabrik, heute. Ohne diese Unterlagen darf online nicht verkauft werden (Kosmetik-VO; Du bist
als Abfüller unter eigenem Namen die verantwortliche Person, siehe `07-recht-retention.md`).
- [ ] INCI-Liste je Duft (vollständige Inhaltsstoffe in INCI-Nomenklatur)
- [ ] Allergen-Deklaration (welche der deklarationspflichtigen Duftallergene über Schwellenwert)
- [ ] Sicherheitsdatenblatt (SDS) je Duft — nötig auch für den Gefahrgut-Versand
- [ ] Angabe zur Konzentration (EdP / Extrait, % Duftöl) — **erst danach darf eine Zahl in die Werbung**
- [ ] Frage: Sind die Düfte bereits CPNP-notifiziert, unter welchem Namen, gibt es eine Sicherheitsbewertung (CPSR), die ein Safety Assessor für Deine Marke übernehmen kann?
- [ ] Frage: Sind es „inspired by“-Kompositionen? (Dann: Referenzdüfte **nie** nennen — nicht auf der Seite, nicht in DMs, nicht durch Creator)
- [ ] Parallel: Safety Assessor anfragen (Suchbegriff „Sicherheitsbewertung Kosmetik CPSR Parfum“), Preis je Duft einholen — Budget ~300–800 € pro Duft; **mit 2–3 Düften starten, nicht mit zehn**

### B · Erste 50 Flakons privat verkaufen — und dabei zuhören
Das ist der schnellste Umsatz und das einzige Research, das zählt. 50 ml privat = 26,96 € Deckungsbeitrag, kein CAC.
- [ ] Liste: 50 Menschen aus Familie, Community, Freundeskreis, Kollegen — Name, Kanal (WhatsApp/IG), Duft-Tipp
- [ ] Nachricht (kurz, persönlich): „Ich hab meine eigene Duftmarke gestartet — Azizam. Drei Düfte, 50 ml für 40 €. Willst Du riechen?“ Kein Pitch, ein Angebot.
- [ ] Bei **jedem** Verkauf die drei Fragen stellen und wörtlich notieren (`playbook.py swipe --brand azizam --source "Privatverkauf" "…"`):
  1. „Was war der Moment, in dem Du dachtest: ich will einen neuen Duft?“ → Trigger
  2. „Was hast Du vorher getragen, und was hat Dich daran gestört?“ → Differenzierung
  3. „Wenn Dich morgen jemand auf den Duft anspricht — was wäre das für ein Gefühl?“ → Ebene 4
- [ ] Nach 3–5 Tagen nachfragen: „Hat Dich jemand darauf angesprochen?“ → die Antwort ist Dein erstes Testimonial (mit Einwilligung, wörtlich)
- [ ] Jeden Käufer um eine 15-Sekunden-Sprachnachricht oder ein Selfie mit Flakon bitten → Content-Rohstoff
- [ ] Ziel: 50 verkauft = ~1.350 € Deckungsbeitrag → finanziert CPSR für 2–3 Düfte

### C · Website fertigstellen — Flakons tauschen, Pflichtangaben rein
- [ ] **Neue Flakons ins Frontend:** Der 3D-Flakon in `frontend/components/FlaconsScene.tsx` ist eine Drehform (`bodyPoints`, Lathe-Geometrie) — funktioniert nur für runde Flakons. Ich brauche: 2 Fotos (frontal, seitlich, neutraler Hintergrund) + Maße (Höhe, Breite, Tiefe, Kappenhöhe). Rund → ich passe `bodyPoints`, Glas- und Kappenfarbe an. Eckig → Umstieg auf ein GLB-Modell oder Foto-Hero. **Für den Launch reichen gute Produktfotos; 3D ist Kür.**
- [ ] Produktfotos neuer Flakon: 3 × Freisteller (30/50/100 ml), 3 × in der Hand, 3 × Lifestyle (Küche, Fensterbank, Bahnsteig — Bildsprache aus `04-produkt-marke.md`)
- [ ] Produktseite nach `03-angles-hooks.md` (Angle → Pain → Mechanismus → Beweis → Offer); 100 ml als „bester Preis pro ml“ hervorheben
- [ ] Pflichtangaben: Impressum · Datenschutz (Shopify, Pixel, Klaviyo) · Widerruf · AGB · Cookie-Consent · **Grundpreis €/100 ml** an jedem Preis · GPSR-Angaben (verantwortliche Person mit Adresse)
- [ ] Preise im Shop: 30 ml 29,99 € · 50 ml 44,99 € · 100 ml 64,99 € · Duo 2 × 50 ml 79,99 € · Trio 2+1 89,98 € · Discovery 3 × 2 ml 9,99 € (Gutschein 9,99 € auf 50/100 ml) · kostenloser Versand ab 60 €
- [ ] Post-Purchase-Upsell einrichten: 30 ml eines zweiten Dufts für 19,99 € mit einem Klick
- [ ] LUCID-Registrierung (Verpackungsregister) — Pflicht ab dem ersten Paket
- [ ] Versand klären: Parfum ist Gefahrgut UN 1266 → DHL Paket als „Begrenzte Menge (LQ)“ mit LQ-Kennzeichen, kein Päckchen, keine Luftfracht; Verpackung mit Polster; Kosten real messen (Annahme 6,50 €)
- [ ] Zahlungsanbieter: PayPal + Shopify Payments; Auszahlungszyklen prüfen (Cashflow)
- [ ] Klaviyo: Double-Opt-In, Welcome-Flow (3 Mails), Warenkorbabbruch, Post-Purchase („zwei Sprüher, nicht sechs“)
- [ ] Tracking: Meta Pixel + Conversions API, TikTok Pixel — vor der ersten Anzeige

## Schritt 1 · Woche 2–3: Organisch senden, Hooks testen (kostet nichts)
- [ ] Instagram + TikTok: 3 Videos pro Woche mit den Hooks aus `03-angles-hooks.md` — je Video **ein** Angle (A1 Zweite Generation · A2 Küche der Großmutter · B1 Nicht lauter, näher · A5 Kein Kaufhaus dazwischen)
- [ ] Jedes Video: gleiche Struktur — Hook 0–3 s, Problem, Flakon + Mechanismus, „Link in Bio“
- [ ] Messen: welche Hooks halten (3-Sekunden-Rate in den Insights), welche Kommentare kommen → wörtlich in die Swipe-Datei
- [ ] 5 Nano-Creator aus dem eigenen Umfeld (1–10 K Follower, Diaspora-Lifestyle) per Barter: ein 50-ml-Flakon (6,65 € Einsatz), Briefing aus `06-creator-skalierung.md`, schriftlich mit Spark-Code und Werbekennzeichnung
- [ ] Prompt 1 + 2 auf die ersten 50 Zitate laufen lassen, Personas korrigieren (`02-personas-pains.md`)

## Schritt 2 · Woche 4–6: Onlineshop live, erste bezahlte Tests
Voraussetzung: **CPNP-Notifizierung und PIF liegen vor** (Schritt 0A). Vorher keine Anzeige, kein Onlineverkauf.
- [ ] Shop live, Grundpreise sichtbar, Rechtstexte final
- [ ] 8–12 Creatives aus den organischen Winnern + Creator-Videos; Testkampagne breit (Advantage+), TikTok parallel
- [ ] Budget pro Creative 3–5 × Ziel-CPA (15 €) = 45–75 €, 5–7 Tage laufen lassen — nur 50 ml und 100 ml bewerben
- [ ] Erfolgskriterium: CPA unter **22,94 €** (50 ml) bzw. **35,11 €** (100 ml); Break-even-ROAS **1,58** netto / 1,88 brutto
- [ ] Offer-Test: Einmalkauf vs. Duo vs. Trio 2+1, gleiches Budget
- [ ] Testing-Log führen (`../templates/testing-log.csv`); Verlierer analysieren: „und warum nicht?“

## Schritt 3 · Woche 7–12: Skalieren nach Zahlen
- [ ] 100+ Creator anschreiben (Pools in `06-creator-skalierung.md`), Barter, Spark Ads
- [ ] Budget +20–30 % alle 2–3 Tage, nur wenn CM2 nach Retouren 7 Tage positiv; steuern auf MER ≥ 2,5
- [ ] Nowruz-Drop (20./21. März) oder Yalda-Drop (21. Dezember) vorbereiten — limitierte Charge, Vorverkauf für Newsletter
- [ ] Wiederkaufrate nach 90 Tagen messen; Replenishment-Flow Tag 100–120

## Was Du mir als Nächstes geben kannst
1. Fotos + Maße der neuen Flakons → Frontend-Tausch.
2. Die Antwort der Fabrik (INCI, Konzentration, „inspired by“ ja/nein) → Mechanismus und Verbotsliste final.
3. Die ersten 20 Zitate aus Privatverkäufen → Prompt 1 laufen lassen, Personas gegen die Realität stellen.
4. Deine Duftnamen und -profile (die 3–5 Düfte) → Produkttexte, Discovery-Set, Duo/Trio-Kombinationen.

## Die eine Warnung
Das Produkt ist in einer Woche kopierbar — die Marge zieht Nachahmer an. Was nicht kopierbar ist: das Wort
Azizam, die Geschichte der zweiten Generation, die Gedichtkarte, der Nowruz-Drop, die Community. Jeder Euro,
der in Ads geht, sollte deshalb ein Gefühl transportieren, nicht einen Preis. Preis ist der Mechanismus, nicht die Botschaft.
