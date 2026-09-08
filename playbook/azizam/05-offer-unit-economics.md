# Offer-Engineering & Unit Economics

> Alle Zahlen sind **Planwerte** aus `brand.json` — sie werden durch Lieferantenangebote (Woche 3–4) und
> Testdaten (Woche 7–8) ersetzt. Neu rechnen: `python3 playbook.py economics --brand azizam --cogs 12 --cac 25`

## Die vollständige Rechnung (Kap. 4.3) — Einmalkauf 50 ml

```
   Verkaufspreis (netto)                         57,98 €   (69,00 € brutto)
 − COGS (Juice, Flakon, Box, Karte)         −    13,50 €
 − Versand + Fulfillment (Gefahrgut LQ)     −     6,90 €
 − Zahlungsgebühren (2 %)                   −     1,16 €
 ──────────────────────────────────────────────────────────
 = Deckungsbeitrag I (CM1)                        36,42 €   (63 % Marge · Faktor 4,3 auf COGS)
 − CAC (Ziel)                               −    22,00 €
 ──────────────────────────────────────────────────────────
 = Deckungsbeitrag II (CM2)                       14,42 €
 − Retouren/Ausfall (5 % von CM1)           −     1,82 €
 ──────────────────────────────────────────────────────────
 = Beitrag zum Fixkostenblock                     12,60 €   ✅ positiv → skalierbar, sobald stabil über 7 Tage
```

| Kennzahl | Wert | Bedeutung |
|---|---|---|
| **Break-even-ROAS (netto)** | **1,59** | Darunter verlierst Du Geld. Auswendig kennen. |
| Break-even-ROAS (brutto, wie die Plattform rechnet) | 1,89 | Zum Abgleich mit dem Ads Manager |
| Max. tragbarer CAC beim Erstkauf | 34,60 € | Oberhalb kein Winner, egal wie gut der Hook |
| LTV (2,2 Käufe × 57,98 € × 63 %) | 80,13 € | |
| LTV:CAC | 3,6:1 | Ziel ≥ 3:1 ✅ |
| Payback | 0,64 Käufe → beim ersten Kauf | Ziel < 60 Tage ✅ |

**Was die Rechnung sagt:** Marge liegt mit 63 % knapp unter der Playbook-Schwelle (65–70 %). Zwei Hebel:
COGS auf ≤ 12 € verhandeln (Abfüller, Flakon-Menge) **oder** VK auf 74 €. Bei 12 € COGS: CM1 37,92 €, Marge 65 %.

**MER statt ROAS:** Gesteuert wird auf Marketing Efficiency Ratio = Gesamtumsatz Shop ÷ Gesamtwerbeausgaben.
Plattform-ROAS nur als Vergleich zwischen Creatives.

## Die drei Offer-Varianten (Kap. 4.2) — bei identischem CAC von 22 €

| Offer | Umsatz netto | CM1 | CM2 | nach Retouren | max. CAC |
|---|---|---|---|---|---|
| Einmalkauf 50 ml | 57,98 € | 36,42 € | 14,42 € | 12,60 € | 34,60 € |
| **Wardrobe-Abo** (4 Quartale, −15 %) | 197,14 € | 111,60 € | 89,60 € | 84,02 € | **106,02 €** |
| **2+1** (drei Düfte, einer gratis) | 115,97 € | 64,18 € | 42,18 € | 38,97 € | 60,97 € |
| 1+1+Geschenk (zweiter 50 ml gratis) | 57,98 € | 19,04 € | −2,96 € | −3,91 € | 18,09 € |

### Was das für Azizam heißt

1. **1+1 mit vollem zweiten Flakon rechnet sich nicht** (COGS zu hoch relativ zum Preis). Die Azizam-Variante:
   **„1 + Reise-Zerstäuber 10 ml + Gedichtkarte“** — der +1 kostet ~3 €, hat einen belegbaren Wert von 19 €
   (wenn der 10 ml separat für 19 € verkauft wird). Dann bleibt CM2 positiv und der Ankerwert steht: „Du zahlst 69 €, bekommst 88 € Wert.“
2. **2+1 ist der stärkste Erstkauf-Hebel** — passt zur Wardrobe-Logik (drei Düfte: Tag, Abend, Nowruz) und zu
   Geschenkanlässen (Nowruz, Yalda, Hochzeiten — in der Community wird viel verschenkt). AOV verdoppelt sich, CAC bleibt.
3. **Klassisches Abo funktioniert bei Parfum schlecht** (Playbook). Die richtige Form: **Wardrobe-Abo** — ein Duft
   pro Quartal, jederzeit kündbar, Kündigungsbutton. Darf 106 € CAC tragen — das ist der Grund, warum die
   Culture Brand jede Auktion gewinnt.
4. **Discovery-Set (3 × 2 ml, 12 €, anrechenbar)** ist kein Offer im Sinne der drei Varianten, sondern der
   Einwand-Killer („unbekannte Marke“, „was, wenn es nicht passt“). Wird als BOF-Angebot getestet.

**Testrahmen:** Alle drei Varianten bauen, gleiches Budget, gleiche Creatives, 7 Tage. Zahlen entscheiden, nicht Geschmack.

## Weitere Offer-Hebel (Baukasten)

| Hebel | Azizam-Einstellung | Achtung |
|---|---|---|
| Kostenloser Versand ab X | X = AOV × 1,2 → ab 85 € (zieht zum 2er) | |
| Mengenrabatt-Staffel | 1 / 2 / 3 Düfte nebeneinander, mittlere Option hervorgehoben | Decoy |
| Geld-zurück-Garantie | 30 Tage, auch angebrochen (Duft muss man tragen, um ihn zu kennen) | Retourenquote beobachten; Gefahrgut-Rückversand regeln |
| Erstbestellrabatt | **nicht** — gewöhnt an Rabatt, widerspricht „Preis ist Teil des Signals“ | stattdessen Discovery-Set |
| Zeitliche Verknappung | nur bei echten Drops (Nowruz/Yalda) mit echter Stückzahl | UWG |
| Post-Purchase-Upsell | 10 ml Reisegröße oder zweiter Duft −20 %, ein Klick | höchster ROI, 10–25 % Annahme |
| Gratis-Probe im Paket | 1,5 ml des zweiten Dufts | Cross-Sell für den nächsten Kauf |

## Liquidität ≠ Umsatz (Kap. 4.7)

Gebundenes Geld bei Azizam: Erstcharge (Mindestmenge Abfüller, oft 500–1.000 Stück × 13,50 € = 6.750–13.500 €) ·
CPSR/CPNP (~1.000–2.500 €) · Flakon-Werkzeug, falls eigene Form · PayPal-/Klarna-Reserven (Auszahlung 3–14 Tage).
→ Liquiditätsplan über 6 Monate führen, bevor das erste Ads-Budget läuft.

## Skalierungsregel
Budget +20–30 % alle 2–3 Tage, nur wenn CM2 nach Retouren ≥ 7 Tage positiv. Keine Sprünge.
