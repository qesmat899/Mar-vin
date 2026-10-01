# Offer-Engineering & Unit Economics — echte Zahlen

> Quelle: eigene Angaben (Stand September 2026). Fertiges Parfum 38 € je 500 ml = **0,076 €/ml**, Flakon 1,85 €,
> Etikett/Box angenommen 1,00 €, Versand als Gefahrgut-LQ inkl. Verpackung angenommen 6,50 €. Neu rechnen:
> `python3 playbook.py economics --brand azizam --all` · Szenario: `--variant 100ml --cac 25 --shipping 5.5`

## Alle Größen und Kanäle

| Variante | Kanal | Preis | netto | COGS | CM1 | Marge | Break-even-ROAS | max. CAC | Rolle |
|---|---|---|---|---|---|---|---|---|---|
| 30 ml | online | 29,99 € | 25,20 € | 5,13 € | 13,07 € | 52 % | 1,93 | 12,54 € | Einstieg / Probe — **nicht bewerben** |
| 30 ml | privat | 25,00 € | 21,01 € | 5,13 € | 15,88 € | 76 % | — | — | |
| **50 ml** | **online** | **44,99 €** | 37,81 € | 6,65 € | **23,90 €** | 63 % | **1,58** | **22,94 €** | **Hero — Standard in Ads** |
| 50 ml | privat | 40,00 € | 33,61 € | 6,65 € | 26,96 € | 80 % | — | — | |
| **100 ml** | **online** | **64,99 €** | 54,61 € | 10,45 € | **36,57 €** | 67 % | **1,49** | **35,11 €** | **Anker — Upsell-Ziel** |
| 100 ml | privat | 60,00 € | 50,42 € | 10,45 € | 39,97 € | 79 % | — | — | |

Netto = brutto ÷ 1,19. Wer als Kleinunternehmer (§ 19 UStG) verkauft, hat keine MwSt. abzuführen — dann ist die Marge
höher, aber die Vorsteuer aus Ads geht verloren (Playbook: bei Paid Media meist nachteilig).

## Was die Zahlen sagen

1. **Die Marge ist exzellent, die Ware ist billig.** Faktor 5–6 auf COGS bei jeder Größe. Das ist das Beste an diesem Geschäft — und gleichzeitig der Grund, warum es jeder kopieren kann. Der Schutz kommt nicht aus dem Produkt, sondern aus Teil III (Marke).
2. **30 ml online ist kein Ads-Produkt.** Versand frisst die Hälfte des Deckungsbeitrags; 12,54 € tragbarer CAC reicht bei Parfum nicht. 30 ml bleibt im Shop als Probe/Einstieg und als **Upsell-Baustein** (30 + 50 im Set), wird aber nie beworben.
3. **50 ml ist der Hero.** 22,94 € tragbarer CAC ist für Parfum-Ads realistisch, aber nicht üppig — deshalb muss jede Kampagne den **AOV** heben (siehe Offer unten).
4. **100 ml ist der Anker und der Gewinnbringer.** 36,57 € CM1, 35 € tragbarer CAC. Jeder Kunde, der von 50 auf 100 ml wechselt, bringt 12,67 € mehr Deckungsbeitrag bei null zusätzlichem CAC. Die Produktseite zeigt 100 ml als „beliebteste Wahl / bester Preis pro ml“ (Grundpreis: 64,99 €/100 ml vs. 89,98 €/100 ml bei 50 ml — das darf man zeigen, es ist die PAngV-Pflichtangabe).
5. **Privatverkauf ist die Cash-Maschine für die ersten 90 Tage.** 26,96 € pro 50 ml ohne Versand, ohne Gebühren, ohne CAC — und jeder Käufer ist ein Research-Gespräch (die drei Fragen aus Kapitel 1.4).

## Die drei Offer-Varianten — 50 ml, CAC 15 €

| Offer | Umsatz netto | CM1 | CM2 | nach Retouren | max. CAC |
|---|---|---|---|---|---|
| Einmalkauf 50 ml | 37,81 € | 23,90 € | 8,90 € | 7,94 € | 22,94 € |
| **2+1** (drei × 50 ml, einer gratis) | 75,61 € | 45,70 € | 30,70 € | 28,87 € | **43,87 €** |
| Wardrobe-Abo (4 Quartale, −15 %) | 128,54 € | 73,37 € | 58,37 € | 55,44 € | 70,44 € |
| 1+1 (zweiter 50 ml gratis) | 37,81 € | 12,95 € | −2,05 € | −2,57 € | 12,43 € ❌ |

### Offer-Struktur für den Start

| Offer | Preis | Warum |
|---|---|---|
| **Hero:** 50 ml | 44,99 € | Standard in Ads |
| **Anker:** 100 ml | 64,99 € | „bester Preis pro ml“, hervorgehoben |
| **Duo-Set:** 2 × 50 ml (zwei Düfte) | 79,99 € | Wardrobe-Logik (Tag/Abend), Geschenk; CM1 ≈ 52 € bei einem Versand |
| **Trio 2+1:** 3 × 50 ml | 89,98 € | der stärkste AOV-Hebel; für Nowruz/Yalda/Hochzeiten |
| **Discovery:** 3 × 2 ml | 9,99 €, anrechenbar | Einwand „unbekannte Marke“ — **kein 30 ml als Probe bewerben** |
| **Post-Purchase-Upsell** | 30 ml eines zweiten Dufts für 19,99 € mit einem Klick | AOV ohne CAC; hier hat 30 ml seinen Platz |
| Kostenloser Versand | ab 60 € | zieht von 50 ml zu 100 ml oder Duo |
| Erstbestellrabatt | **keiner** | Preis ist Teil des Signals; Discovery-Set statt Rabatt |

Alle drei Playbook-Varianten (Einmal, 2+1, Duo/Abo) mit gleichem Budget testen — Woche 7–8.

## Liquidität

Bei 0,076 €/ml und 1,85 € Flakon bindet eine Charge von 100 Flakons à 50 ml nur ~665 € Ware — das Risiko liegt nicht
in der Ware, sondern in **Rechtskosten (CPSR pro Duft ~300–800 €)** und im Ads-Budget. Reihenfolge deshalb: erst
Privatverkauf finanziert die Sicherheitsbewertungen, dann Ads.

## Skalierungsregel
Budget +20–30 % alle 2–3 Tage, nur wenn CM2 nach Retouren ≥ 7 Tage positiv — gemessen auf **MER** (Shop-Umsatz ÷ Werbeausgaben), Ziel ≥ 2,5 bei 50/100-ml-Mix.
