---
name: perfume-finance
description: Zahlen für Azizam. Nutzen bei Marge, CM1/CM2, Break-even-ROAS, LTV:CAC, Preisszenarien, Bestellkosten, Budget oder wenn `playbook.py economics` ausgeführt werden soll.
metadata:
  version: 0.1.0
---

# Azizam: Finanzen

## Zuerst lesen
`SYNC.md` und `playbook/azizam/brand.json`. Die Datei `playbook/azizam/05-offer-unit-economics.md` ist **veraltet** (Stand 09/2026) und nicht als Quelle zu verwenden.

## Werkzeug
```bash
python3 playbook.py economics --brand azizam          # Standardrechnung
python3 playbook.py economics --brand azizam --all    # alle Größen × Kanäle
python3 playbook.py offers --brand azizam             # Angebotsvarianten
```
Immer rechnen lassen, nie im Kopf überschlagen und als Ergebnis ausgeben.

## Rahmen (aus SYNC.md)
- Kleinunternehmer nach § 19 UStG, keine MwSt. in den Rechnungen
- Investitionsbudget 500 bis 1.500 € in den nächsten 3 Monaten
- Start mit 30 ml und 50 ml, 100 ml später
- Flakon max. ca. 3 €, erste Bestellung 100 bis 200 Stück
- Fabrik-Einkauf laut Playbook: 38 € je 500 ml (Annahme prüfen, wenn neue Angebote vorliegen)

## Vorgehen
1. Szenario klar benennen: Größe, Flakonpreis, Verkaufspreis (als **Szenario**, nicht als Entscheidung), Kanal.
2. Rechnen, Ergebnis als kleine Tabelle ausgeben.
3. Unsichere Eingaben markieren: Etikett/Box 1,00 € und Versand 6,50 € sind Schätzwerte aus `brand.json`.
4. Budgetcheck: Passt die Bestellmenge in 500 bis 1.500 € inklusive Flakon, Verpackung, Etikett, Duftöl/Fabrik?
5. Ergebnis in `company/finance/` ablegen (Datei mit Datum im Namen). Wurde `brand.json` geändert, in `SYNC.md` loggen.

## Grenzen
- **Preise sind offen.** Erst wenn Mar den Preis festlegt, kommt er in `brand.json`.
- Keine Steuerberatung. Bei Umsatzgrenzen des Kleinunternehmers auf Steuerberatung verweisen.
- Keine Rechnungen, Kontostände oder Kundendaten ins Repo.
