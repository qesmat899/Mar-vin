# Recht & Retention

## Die echten Firmendaten (von azizamfragrances.com, Stand 09/2026)

| Feld | Wert |
|---|---|
| Inhaber / Rechtsform | Marvin Farienfar, Einzelunternehmer (Handelsname „Azizam“) — kein Registergericht/HR-Nummer im Impressum, also kein e.K./UG/GmbH |
| Adresse | Lilienweg 8, 97084 Würzburg |
| Telefon | +49 155 60980879 |
| E-Mail | azizamfragrances@gmail.com |
| USt-IdNr. | DE459609298 — **keine Kleinunternehmerregelung**, MwSt. wird ausgewiesen |
| Plattform | Shopify (Shopify Payments) + Vercel-Hosting |
| Zahlungsmethoden (live) | Shopify Payments/Kreditkarte, PayPal, Klarna, Apple Pay, Google Pay |
| Versand (live) | Deutschland + **Österreich** (nicht Schweiz — Drittland, Zoll/EUSt), 2–4 Werktage, 4,95 € Standard, kostenlos ab 80 € |
| Widerruf (live) | gesetzlich 14 Tage, entfällt bei geöffnetem Hygienesiegel; freiwillig 30 Tage, wenn Flakon ≥ 80 % gefüllt |

Diese Werte ersetzen die bisherigen Schätzungen (Versand 6,50 €, Gratisversand ab 60 €, CH als Zielmarkt) in
`05-offer-unit-economics.md` und `brand.json` — dort mit den echten 4,95 € nachrechnen, wenn der Versandpreis
final steht.

## Rechtlicher Rahmen — Parfum (Kap. 5.3)

Kein Ersatz für Rechtsberatung. Die Reihenfolge ist pragmatisch: Tag-1-Themen in Stunden erledigt,
produktspezifische Zulassungen **vor dem ersten Verkauf**.

### ⚠️ Zwei Dinge, die live falsch sind — Entfernung beschlossen (09/2026)

Die Seite ist online und behauptet zwei Dinge, die vor dem ersten echten Verkauf verschwinden müssen. Der Inhaber
hat die Entfernung beider Punkte entschieden; die fertigen Ersatztexte stehen in
[`website-korrekturen.md`](website-korrekturen.md).

1. **„Handgefertigt in Deutschland“, „Seltene Zutaten“, „Haute Parfumerie“ und der Komposition-Absatz im
   Geschichte-Abschnitt** widersprechen dem Geschäftsmodell (Fertigparfum aus der Fabrik, umgefüllt) —
   Irreführung über wesentliche Merkmale der Ware, § 5 Abs. 1 Nr. 1 UWG. → ersetzen durch „In Deutschland
   abgefüllt“ und die Kurations-Fassung der Geschichte.
2. **„4.8 von 5“ bei „247 Bewertungen“ plus drei Testimonials** auf einer Seite ohne bisherige Onlineverkäufe.
   Bewertungen müssen echt und nachvollziehbar sein (§ 5 Abs. 1, § 5b Abs. 3 UWG; Nr. 23b Anhang zu § 3 Abs. 3
   UWG). → kompletter Block raus, ersetzt durch Risikoumkehr (30 Tage Rückgabe ab 80 % Füllstand). Echte
   Bewertungen kommen mit Einwilligung zurück, sobald die Privatverkäufe laufen.

### Der wichtigste Satz für dieses Geschäftsmodell

Wer fertiges Parfum kauft und **unter eigenem Namen** in eigene Flakons abfüllt, bringt ein kosmetisches Mittel in
Verkehr und ist damit selbst die **verantwortliche Person** nach Art. 4 Kosmetik-VO — mit allen Pflichten unten. Die
Notifizierung der Fabrik (falls vorhanden) deckt das nicht ab, weil Name, Verpackung und Inverkehrbringer andere sind.
Das ist der eine Punkt, der vor dem ersten Onlineverkauf stehen muss; alles andere wächst mit.

### Produktspezifisch — Kosmetik-VO (EG) 1223/2009

| Pflicht | Was konkret | Status |
|---|---|---|
| Verantwortliche Person in der EU | Wer unter eigenem Namen verkauft, ist es in aller Regel selbst. Keine Formalie: haftet für Sicherheit, Kennzeichnung, PIF. | ☐ |
| Produktinformationsdatei (PIF) | Rezeptur, Rohstoffdaten, Herstellverfahren, Stabilitätsdaten — vom Hersteller/Abfüller liefern lassen | ☐ |
| Sicherheitsbewertung (CPSR) | Durch qualifizierten Safety Assessor, pro Duft | ☐ (Kosten ~300–800 € pro Duft einplanen) |
| CPNP-Notifizierung | Vor Inverkehrbringen im EU-Portal | ☐ |
| Kennzeichnung | INCI-Liste, Chargennummer, Nennfüllmenge (50 ml ℮), Haltbarkeit/PAO, Warnhinweise, verantwortliche Person mit Anschrift | ☐ |
| 26 deklarationspflichtige Duftallergene | Über Schwellenwert in INCI ausweisen (bei Rose/Safran-Kompositionen relevant: Geraniol, Citronellol, Linalool, Eugenol …). **Ab 2026/27 erweiterte Liste (80+ Allergene) — mit dem Hersteller klären.** | ☐ |
| Gefahrgut UN 1266 | Alkoholhaltiges Parfum = Gefahrgut im Versand. Begrenzte Menge (LQ) möglich; **Luftfracht eingeschränkt**, Versanddienstleister und Verpackung entsprechend wählen; kein Standardversand ins Nicht-EU-Ausland ohne Prüfung | ☐ |
| Tierversuchsverbot / Claims | „ohne Tierversuche“ ist in der EU ohnehin Pflicht — als Werbeaussage irreführend (UWG) | ✅ nicht bewerben |

### Shop-Pflichten Tag 1

✅ Impressum (§ 5 DDG) · ⚠️ Datenschutzerklärung nennt bisher Vercel, Shopify, PayPal, Klarna, Apple, Google Ireland — **Meta-/TikTok-Pixel und Klaviyo ergänzen, sobald Tracking eingebaut ist** ·
☐ Cookie-Consent mit echter Ablehnung (TDDDG) · ☐ Widerrufsbelehrung + Musterformular (§ 355 BGB) · ☐ AGB ·
☐ PAngV: Endpreise inkl. MwSt. **und Grundpreis €/100 ml** (50 ml 44,99 € = 89,98 €/100 ml · 30 ml 29,99 € = 99,97 €/100 ml · 100 ml = 64,99 €/100 ml — Pflichtangabe, und zugleich das beste Argument für 100 ml) ·
☐ Streichpreise nur mit niedrigstem Preis der letzten 30 Tage · ☐ LUCID-Registrierung + Systembeteiligung (VerpackG) ·
☐ GPSR: Herstellerangaben, verantwortliche Person, Sicherheitshinweise auf Produktseite · ☐ Kündigungsbutton (§ 312k BGB) sobald Wardrobe-Abo live.

### Werbung & Creator — Azizam-spezifisch

| Thema | Regel | Konkret für Azizam |
|---|---|---|
| Werbekennzeichnung | „Werbung“/„Anzeige“ zu Beginn, auf Deutsch, auch bei Barter | im Briefing + Vereinbarung Pflicht |
| Fremde Marken | keine Designer-Namen als Aufhänger | ✗ „wie Baccarat Rouge“ · ✗ „Dior-Dupe“ · ✗ Vergleichslisten mit Markennamen — auch nicht durch Creator |
| Haltbarkeit | keine garantierten Zeitangaben ohne Beleg | ✗ „hält 12 Stunden“ · ✓ Handgelenk-Demo als sichtbarer Test, individuell |
| Gesundheit | HWG | ✗ „beruhigt“, „gegen Stress“, „hautpflegend“ |
| Herkunft | § 5 UWG Irreführung | ✓ „in Deutschland abgefüllt“ · ✗ „Made in Germany“ (solange Juice importiert) · ✗ „aus Shiraz“, wenn die Rose aus Bulgarien kommt |
| Verknappung | muss echt sein | Nowruz-/Yalda-Drop: Charge wirklich limitieren und Stückzahl nennen |
| Testimonials | echt, typisch | Komplimente-Stories nur von echten Kunden, keine Skript-Zitate als Rezension |
| Bewertungen | Herkunft transparent | keine gekauften, kein Filtern negativer |

### Steuern & Struktur

☐ Kleinunternehmerregelung **nicht** wählen (Paid Media → Vorsteuer) · ☐ USt-IdNr. für Reverse Charge (Meta/TikTok/Google Ireland) ·
☐ OSS ab 10.000 € EU-Versand (AT/CH: CH ist Drittland → Zoll/EUSt, Alkohol!) · ☐ Einfuhr aus Drittland: Zoll + EUSt + Gefahrgut ·
☐ Rechtsform: Einzelunternehmen zum Start, UG/GmbH bei Volumen (Produkthaftung Kosmetik!).

---

## Retention — wo das Geld wirklich liegt (Kap. 5.2)

**Die eine Kennzahl: Wiederkaufrate nach 90 Tagen.** Ziel Azizam: ≥ 40 % (Culture-Brand-Niveau).

### Die Flows, die zuerst stehen müssen

| Flow | Auslöser | Azizam-Inhalt |
|---|---|---|
| Welcome | Newsletter-Anmeldung (Double-Opt-In!) | 3 Mails: das Wort „azizam“ und die Gründergeschichte (A2) · der Mechanismus (25 %) · Discovery-Set-Angebot |
| Warenkorbabbruch | Cart verlassen | 1 h: „Dein Duft wartet“ · 24 h: 3 Kundenzitate · 72 h: Discovery-Set als Einstieg statt Rabatt |
| Post-Purchase | nach Kauf | Anwendung: „zwei Sprüher, nicht sechs“ (senkt Enttäuschung, senkt Retouren) · die Gedichtkarte erklärt · Einladung in die Community |
| Browse Abandonment | Produkt angesehen | Handgelenk-Demo-Video + Rezensionen |
| Replenishment | Tag 100–120 nach Kauf (50 ml) | „Fast leer?“ — Nachkauf mit Vers · Wardrobe: zweiter Duft |
| Review-Request | Lieferung + 14 Tage | „Hat Dich jemand darauf angesprochen?“ — liefert Komplimente-Stories für Ads (mit Einwilligung) |
| Win-Back | 90 Tage inaktiv | nächster Drop als Anlass (Nowruz/Yalda) |

### Retention-Hebel für Parfum

| Hebel | Umsetzung | Priorität |
|---|---|---|
| Discovery-Set → Full Size | 3 × 2 ml für 12 €, Gutschein 12 € auf 50 ml — nimmt Einwand „unbekannte Marke“ und „was, wenn es nicht passt“ | 1 |
| Post-Purchase-Upsell | Nach Kauf 50 ml: zweiter Duft −20 % mit einem Klick; oder Reise-Zerstäuber 10 ml | 1 |
| Wardrobe-Abo | Nicht klassisches Abo (Kap. 4.2: bei Parfum schlecht) — sondern „ein Duft pro Quartal“, jederzeit kündbar | 2 |
| Drops als Ritual | Nowruz, Yalda — Vorverkauf nur für Newsletter/Community | 1 |
| Beilage im Paket | Gedichtkarte + Probe des zweiten Dufts (Cross-Sell fast kostenlos) | 1 |
| Community | WhatsApp-/Instagram-Broadcast „Azizam Joon“: Drops zuerst, Verse, Fragen an den Gründer | 2 |
| Treue | Nach 3 Käufen: der Name in Nastaliq auf dem Flakon graviert | 3 |

E-Mail-Marketing nur mit dokumentiertem Double-Opt-In (§ 7 UWG). SMS/WhatsApp ebenso.
