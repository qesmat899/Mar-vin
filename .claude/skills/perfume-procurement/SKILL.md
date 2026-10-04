---
name: perfume-procurement
description: Einkauf für Azizam. Nutzen bei Flakon, Verpackung, Etikett, Lieferanten-Angeboten, Fabrik-Rückfragen, Bestellmengen oder Musterbestellungen.
metadata:
  version: 0.1.0
---

# Azizam: Einkauf

## Zuerst lesen
`SYNC.md`, Abschnitt „Entscheidungen“ und „Offene Fragen“ (Flakon, Verpackung, Etikett).

## Anforderungen an den Flakon (entschieden, Chat 10/2026)
- luxuriöser Stil mit Goldakzent, hohe schlanke Form, bestenfalls zylindrisch
- Glas nicht foliert, Magnetkappe gewünscht
- max. ca. 3 € je Flakon, erste Bestellung 100 bis 200 Stück
- Größen 30 ml und 50 ml (100 ml später)
- Nicht mehr vorschlagen: schwarz/kantig, mattschwarz mit Goldkappe, schwer quadratisch mit Box

## Vergleichstabelle für Angebote
Pro Angebot erfassen (nur belegte Werte, mit Quelle und Datum):

| Anbieter | Modell | Größe | Preis/Stück | Mindestmenge | Lieferzeit | Verschluss | Maße | Quelle/Datum |
|---|---|---|---|---|---|---|---|---|

Dazu bewerten: passt zur Anforderungsliste (ja/nein je Punkt), Gesamtkosten für 100 und 200 Stück (über `perfume-finance` rechnen), Risiko (z. B. Kompatibilität von Pumpe/Kappe mit dem Hals).

## Fabrik
Offene Bestätigung (schriftlich): CPNP, Sicherheitsbewertung, INCI für die Azizam-Namen. Ein Entwurf der Rückfrage geht als Text an Mar. Mar sendet selbst.

## Ablage
Angebote, Vergleich und Fabrik-Korrespondenz (ohne Zugangsdaten und Privatdaten Dritter) in `company/suppliers/`, Produktdaten (Maße, Gewichte, Verpackung) in `company/products/`.

## Grenzen
- Nichts bestellen, nichts zusagen, nichts versenden.
- Keine Preise oder Lieferzeiten schätzen oder aus dem Gedächtnis nennen.
- Der Flakon entscheidet über Verpackung, Etikett und Shop-Neustart. Wird eine Wahl getroffen, sofort in `SYNC.md` eintragen.
