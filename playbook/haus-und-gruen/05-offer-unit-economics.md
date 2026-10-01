# Offer-Engineering & Unit Economics

> Planwerte aus `brand.json`; ersetzen durch Lieferantenangebote (Woche 3–4) und Testdaten (Woche 7–8).
> Neu rechnen: `python3 playbook.py economics --brand haus-und-gruen --cogs 8 --cac 18`

## Die vollständige Rechnung (Kap. 4.3) — Einzelbox

```
   Verkaufspreis (netto)                         37,73 €   (44,90 € brutto)
 − COGS (Dünger, Spray, Karten, Karton)     −     7,00 €
 − Versand + Fulfillment (Päckchen)         −     4,50 €
 − Zahlungsgebühren (2 %)                   −     0,75 €
 ──────────────────────────────────────────────────────────
 = Deckungsbeitrag I (CM1)                        25,48 €   (68 % Marge · Faktor 5,4 auf COGS)
 − CAC (Ziel)                               −    14,00 €
 ──────────────────────────────────────────────────────────
 = Deckungsbeitrag II (CM2)                       11,48 €
 − Retouren/Ausfall (3 % von CM1)           −     0,76 €
 ──────────────────────────────────────────────────────────
 = Beitrag zum Fixkostenblock                     10,71 €   ✅
```

| Kennzahl | Wert | Bedeutung |
|---|---|---|
| **Break-even-ROAS (netto)** | **1,48** | Auswendig kennen. |
| Break-even-ROAS (brutto) | 1,76 | Abgleich mit Ads Manager |
| Max. tragbarer CAC beim Erstkauf | 24,71 € | |
| LTV (3 Käufe × 37,73 € × 68 %) | 76,43 € | konservativ — bei Abo deutlich mehr |
| LTV:CAC | 5,5:1 | ✅ |
| Payback | 0,57 Käufe → beim ersten Kauf | ✅ |

Alle Playbook-Filter grün. Das Produkt ist ökonomisch das, was das Playbook ein Verbrauchsprodukt mit natürlichem
Nachkauf-Rhythmus nennt — **der Fall, für den das Abo gebaut ist.**

## Die drei Offer-Varianten (Kap. 4.2) — bei identischem CAC von 14 €

| Offer | Umsatz netto | CM1 | CM2 | nach Retouren | max. CAC |
|---|---|---|---|---|---|
| Einzelbox | 37,73 € | 25,48 € | 11,48 € | 10,71 € | 24,71 € |
| **Abo alle 6 Wochen** (6 Boxen, −15 %) | 192,43 € | 119,58 € | 105,58 € | 101,99 € | **115,99 €** |
| 2+1 (drei Boxen = 18 Wochen Vorrat) | 75,46 € | 47,10 € | 33,10 € | 31,69 € | 45,69 € |
| 1+1+Geschenk (zweite Box gratis + Messbecher-Set 9,90 €) | 37,73 € | 16,08 € | 2,08 € | 1,59 € | 15,59 € |

### Was das für Haus & Grün heißt

1. **Das Abo ist das Kern-Offer** — nicht als Option, sondern als Standard auf der Produktseite
   („○ Einmal 44,90 € · ● Alle 6 Wochen 38,17 €, jederzeit kündbar“). Der Mechanismus *ist* die Nachlieferung:
   Die Box kommt, wenn die alte leer ist — genau das, was Mia nicht selbst schafft. Das Abo darf 116 € CAC tragen.
   Damit gewinnt Haus & Grün jede Auktion gegen Einzeldünger-Anbieter.
   Rechtlich: Kündigungsbutton (§ 312k BGB), Kündigung so einfach wie Abschluss, Erinnerung vor jeder Abbuchung.
2. **2+1 als Vorrats-Offer** für Abo-Skeptiker („ich will mich nicht binden“) — 18 Wochen Rhythmus, gleicher CAC, dreifacher AOV.
3. **1+1+Geschenk ist grenzwertig** (CM2 2 €) — nur als BOF-Test für Warenkorbabbrecher, nicht als Hauptangebot.
4. **Kein Erstbestellrabatt.** Stattdessen: erste Box mit vollständigem Starter-Kit (Messbecher, Blatttuch, alle
   Steckkarten) — gefühlter Wert steigt, Preis bleibt.

**Testrahmen:** Drei Varianten, gleiches Budget, gleiche Creatives, 7 Tage. Zahlen entscheiden.

## Weitere Offer-Hebel

| Hebel | Einstellung | Achtung |
|---|---|---|
| Kostenloser Versand ab X | X = AOV × 1,2 → ab 55 € (zieht zum 2er / Abo) | |
| Mengenstaffel | 1 / 3 / Abo nebeneinander, Abo hervorgehoben | Decoy |
| Geld-zurück-Garantie | 60 Tage: „Wenn nach einer Box nichts besser ist — Geld zurück“ | Retourenquote beobachten; Flüssigkeiten nicht zurücksenden lassen |
| Zeitliche Verknappung | nur Frühjahrs-Drop (Balkon-Kit) mit echter Stückzahl | UWG |
| Post-Purchase-Upsell | Design-Übertopf (Kandidat C) −20 % oder Erinnerungs-WhatsApp gratis | höchster ROI |
| Gratis-Probe im Paket | Probe Blattpflege für Freundin („die mit der toten Monstera“) — Empfehlungs-Mechanik | |

## Liquidität ≠ Umsatz
Gebundenes Geld: Erstcharge Dünger/Spray (Mindestabnahme Lohnabfüller, oft 1.000 Stück × 7 € = 7.000 €) · Kartonage/Karten-Druck ·
DüMV-Konformitätsprüfung · PayPal-/Klarna-Reserven. Abo-Umsatz kommt gestaffelt — Liquiditätsplan über 6 Monate.

## Skalierungsregel
Budget +20–30 % alle 2–3 Tage, nur wenn CM2 nach Retouren ≥ 7 Tage positiv. Abo-Churn monatlich messen: unter 10 %/Monat ist die Spirale intakt.
