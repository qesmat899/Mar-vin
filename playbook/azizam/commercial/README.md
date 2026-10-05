# Commercial-Daten Azizam

Struktur für echte Produkt-, Bestands-, Angebots-, Verkaufs-, Experiment- und Entscheidungsdaten.
**Stand 05.10.2026: alle Dateien leer (nur Spaltenköpfe).** Befüllt wird erst mit belegten Daten von Mar
(erste Bestandsaufnahme). Prüfen und auswerten: `python3 playbook.py daten --brand azizam`. Code: `commercial.py`.

## Regeln

1. **Nur erfasste Werte speichern, nie abgeleitete.** COGS, Bestand, gebundenes Kapital, Deckungsbeitrag, ROAS
   werden gerechnet, nicht eingetragen. Keine Zusatzspalten (der Test prüft die Spaltenköpfe).
2. **Zahlenfelder:** Zahl (Punkt oder Komma), `UNKNOWN` oder leer (= nicht zutreffend bzw. noch nicht erfasst).
   Alles, was auf `UNKNOWN` beruht, ist selbst `UNKNOWN`. Keine Schätz- oder Untergrenzen.
3. **Datenstatus je Zeile** (`status`): `CONFIRMED` (Beleg: Rechnung, Angebot, Dokument) · `RECORDED` (Angabe von Mar,
   ohne Beleg) · `OBSERVED` (gemessen/gezählt, z. B. Shopify-Export, Zählung) · `ASSUMPTION` (ausdrücklich als Annahme
   von Mar vorgegeben) · `OUTDATED` · `UNKNOWN`. Dazu `quelle` (wer/was/wann). Kosten werden mit dem **tatsächlich
   gezahlten Betrag** (Kleinunternehmer, keine Vorsteuer) eingetragen; `preis_basis` sagt, ob brutto gezahlt oder netto.
4. **Keine personenbezogenen Daten.** Rohdaten (Namen, Adressen, E-Mails, Bestellnummern mit Personenbezug) bleiben in
   Shopify bzw. beim Steuerberater. Hier nur pseudonyme `kunde_ref` (`K-0001` …), Datum, Kanal, Beträge.
   Keine Gesundheitsdaten (Hautreaktionen o. Ä.). `playbook.py daten` meldet E-Mail- und Telefonmuster als Fehler.
5. **Offers sind Hypothesen**, bis Mar sie freigibt. Status `freigegeben` / `aktiv` / `beendet` braucht eine
   `freigabe_ref` auf eine gültige Entscheidung von Mar in `entscheidungen.csv`.
6. **`OBSERVED ≠ ASSUMED ≠ RECOMMENDED`.** Ergebnisse aus Transaktionen sind beobachtet; Empfehlungen stehen in der
   Entscheidungsvorlage des Orchestrators, nie in diesen Dateien.

## Objekte und Dateien

| Objekt | Datei(en) | Inhalt | fachlich zuständig |
|---|---|---|---|
| PRODUCT | `duefte.csv`, `produkte.csv`, `lieferanten.csv` | Duft · Quelle/Lieferant · Quellgebinde (z. B. vorhandene 500-ml-Flasche) · 30-ml-Verkaufsvariante · 2-/5-ml-Probe · Produktversion · Lebenszyklus | `azizam-product-data` |
| Komponenten / Kosten | `komponenten.csv`, `stueckliste.csv` | Parfum (je Duft), Flakon, Verschluss, Zerstäuber, Etikett, Box, Probenbehälter, Versandmaterial; Stückliste je Produkt | Product Data (Daten), `azizam-unit-economics` (COGS) |
| INVENTORY | `bestand_bewegungen.csv` | jede Bestandsänderung als Bewegung | `azizam-procurement-inventory` |
| OFFER | `offers.csv`, `offer_positionen.csv` | Angebot + Bundle-BOM (welche Produkte, Menge, verkauft/gratis/Bonus) | Unit Economics (Rechnung), Mar (Freigabe) |
| TRANSACTION | `transaktionen.csv`, `transaktion_positionen.csv` | echte Verkäufe, pseudonym | Unit Economics |
| CUSTOMER | `kunden.csv` | nur pseudonyme Referenz, Erstkauf, Erstkanal | — |
| EXPERIMENT | `experimente.csv` | Hypothese → Offer → Test → Ergebnis → Learning → Decision → nächster Test | Orchestrator (Auswertung als Vorlage) |
| DECISION | `entscheidungen.csv` | **Decision Ledger** (Governance, kein Verkaufsobjekt) | Mar entscheidet; Claude trägt nur ein |

### PRODUCT
- `produkte.csv` `typ`: `quellgebinde` (Ausgangsware, Bestand in ml) · `verkaufsvariante` (z. B. 30 ml, Bestand in
  Stück) · `probe` (2 ml / 5 ml, Bestand in Stück).
- `quelle_produkt_id`: aus welchem Quellgebinde eine Variante abgefüllt wird. `stueckliste_id`: Komponenten je Stück.
- `produktversion`: ändert sich bei anderer Rezeptur, anderem Flakon, Etikett oder Lieferanten (Product-Data-Skill).

### INVENTORY — Bewegungen
`bewegung` (Menge immer positiv eintragen, Richtung ergibt sich aus der Bewegung; nur `korrektur` trägt ein Vorzeichen):

| Bewegung | Wirkung | Pflicht |
|---|---|---|
| `zugang` | + (Einkauf/Zugang; eine Zeile je 500-ml-Flasche bzw. Lieferung) | `einkaufspreis_gesamt_eur` (Zahl oder `UNKNOWN`) |
| `abfuellung_ab` | − Quellgebinde in ml und verbrauchte Komponenten | `abfuellung_ref` |
| `abfuellung_zu` | + abgefüllte 30-ml-Produkte bzw. Proben | dieselbe `abfuellung_ref` |
| `verkauf` | − verkaufte Produkte | `transaktion_ref` |
| `probe_gratis` | − kostenlose Probe (auch als Zugabe in einem Bundle) | `transaktion_ref` oder `experiment_ref` |
| `creator` | − an Creator/Influencer | `experiment_ref`, wenn Teil eines Tests |
| `bruch`, `verlust` | − Bruch; Verlust/Verdunstung | — |
| `korrektur` | ± Bestandskorrektur nach Zählung | `notiz` mit Grund |

Kette: `500 ml Ausgangsbestand → Abfüllung → 30-ml-Produkte / Proben → Bundles → Verkäufe → Verbrauch → Restbestand →
Kapitalbindung`. Bestand = Summe der Bewegungen. Kapitalbindung = Bestand × belegter Einstandspreis (Quellgebinde:
gewogener Durchschnitt der Zugänge; abgefüllte Produkte: COGS aus Stückliste). Fehlt ein Preis: „ohne belegten
Wert“, nicht geschätzt.

### OFFER
`typ`: `einzel` · `bundle` · `produkt_plus_proben` (z. B. 30 ml + kostenlose Discovery Samples) · `discovery_set` ·
`cross_sell` · `upsell` · `geschenk_bonus` · `aktion` (zeitlich begrenzt, `start`/`ende`) · `wiederkauf`.
Felder: Preis, Rabatt (`rabatt_typ`, `rabatt_wert`), Versandlogik (`versandentgelt_eur`, `gratisversand_ab_eur`), Ziel,
Hypothese, Start, Ende, Status (`idee` → `hypothese` → `zur_freigabe` → `freigegeben` → `aktiv` → `beendet`, oder
`verworfen`), `freigabe_ref`, `experiment_ref`, `ergebnis` (später gemessen). Kostenlose Zugaben stehen in
`offer_positionen.csv` mit `rolle = gratis_zugabe` bzw. `bonus` (Bundle-BOM).

### TRANSACTION
Je Bestellung: Datum, Kanal, Quelle (z. B. „Shopify-Export 2026-11“), Offer, Experiment, pseudonyme Kunden-Referenz,
`erloes_brutto` (gezahlter Warenpreis nach Rabatt), Rabatt, Versandentgelt, tatsächliche Versandkosten,
Zahlungsgebühr, Erstattung, Retourkosten, Status. Positionen mit Menge und `gratis` ja/nein. Bestandsverbrauch steht in
`bestand_bewegungen.csv` mit `transaktion_ref`. Bei Barverkauf ohne Gebühr `0` eintragen, nicht leer lassen.
Ist-CM1 je Transaktion (Skill `azizam-unit-economics` §5, mit echten Erstattungen statt Quote):
`Net Revenue = Erlös − Erstattung` (Kleinunternehmer: netto = brutto) ·
`CM1 = Net Revenue − COGS aller Positionen inkl. Gratis-Zugaben − (Versandkosten − Versandentgelt) − Gebühren − Retourkosten`.
CAC wird nicht je Transaktion verteilt; CM2 erst je Experiment/Zeitraum mit `werbekosten_eur`.

### EXPERIMENT + LEARNING
Kette `HYPOTHESIS → OFFER → TEST → TRANSACTIONS → RESULT → LEARNING → DECISION → NEXT TEST`. Jeder Test: Hypothese,
Ziel, Erfolgsmetrik, Schwelle (vor dem Start festlegen), Zeitraum, Offer, Ergebnis, Learning, `decision_ref`,
`naechster_test`. `evidenz`: `KONTROLLIERT` (mit Vergleichsgruppe) · `KORRELATION` · `ZU_WENIG_DATEN` · `UNKNOWN`.
Ohne Vergleichsgruppe keine Kausalaussage. Creative-Tests im Detail weiter in `../../templates/testing-log.csv`
(Spalten `experiment_id`, `offer_id` verbinden beides).

## Decision Ledger (`entscheidungen.csv`) — die einzige Quelle für kommerzielle Entscheidungen

- Kommerzielle Entscheidungen (Preis, Rabatt, Offer-Freigabe, Bestellung, Sortiment, Experiment-Start/-Stopp, Bestand)
  stehen **nur hier**. `SYNC.md` nennt sie höchstens kurz mit `decision_id` (Übergabe); `KONTEXT-EXPORT.md` ist
  historisch und wird für kommerzielle Entscheidungen nicht weitergeführt.
- **Mar entscheidet.** `entschieden_von` ist immer `Mar`, `quelle` sagt, wo (z. B. „Mar im Chat, 2026-11-02“).
  Claude trägt eine Zeile nur ein, wenn Mar die Entscheidung ausdrücklich getroffen hat.
- Claude darf analysieren, rechnen, Optionen und Hypothesen entwickeln, empfehlen und Tests auswerten — aber keine
  Preise, Rabatte, Bestellungen oder anderen kommerziellen Entscheidungen freigeben oder als entschieden markieren.
  Empfehlungen gehören in die Entscheidungsvorlage (`azizam-ceo-orchestrator`), nicht in den Ledger.
- Geänderte Entscheidung: alte Zeile `status = ersetzt`, `ersetzt_durch` = neue `decision_id`. Nichts löschen.
- Compliance-Gates (`azizam-compliance-auditor`) bleiben davon unberührt; ein Compliance-BLOCK wird nie „wegentschieden“.

## Erste Bestandsaufnahme — benötigte Daten von Mar

Nichts davon ist bekannt; alles ist `UNKNOWN`, bis Mar es liefert. Fehlt eine Angabe, bleibt sie `UNKNOWN` (nicht
schätzen). Eine Zeile je Flasche bzw. Lieferung.

| # | Angabe | landet in |
|---|---|---|
| 1 | Duftname (Azizam-Name) und Bezeichnung der Fabrik für diesen Duft | `duefte.csv` |
| 2 | Anzahl vorhandener 500-ml-Flaschen je Duft | `bestand_bewegungen.csv` (`zugang`, eine Zeile je Flasche) |
| 3 | Füllstand je Flasche: voll oder angebrochen; Restmenge in ml und ob gemessen oder geschätzt | `menge`, `status` (gemessen = OBSERVED, geschätzt = ASSUMPTION) |
| 4 | Lieferant/Quelle (Name der Fabrik) | `lieferanten.csv` |
| 5 | Charge/Lot-Nummer, falls auf Flasche oder Rechnung | `charge` |
| 6 | Tatsächlich gezahlter Einkaufspreis (je Flasche oder Rechnungsbetrag gesamt) | `einkaufspreis_gesamt_eur` |
| 7 | Einkaufsdatum | `datum` |
| 8 | Rechnung/Beleg vorhanden: ja/nein | `status` (Beleg = CONFIRMED, sonst RECORDED) |
| 9 | Weitere bezahlte Kosten dieser Lieferung (Versand zu Mar, Zoll, Sonstiges) | Komponente `sonstiges` bzw. `notiz` |
| 10 | Schon abgefüllt? Je Duft: wie viele Flakons welcher Größe, wann, aus welcher Flasche; davon noch vorhanden, verkauft, verschenkt (Probe/Creator) | `abfuellung_*`, `verkauf`, `probe_gratis`, `creator` |
| 11 | Vorhandene leere Flakons: Größe, Anzahl, gezahlter Preis, Lieferant, Beleg ja/nein | `komponenten.csv` + `zugang` |
| 12 | Verschlüsse/Kappen/Zerstäuber: Art, Anzahl, Preis, Beleg | dto. |
| 13 | Etiketten: vorhanden ja/nein, Anzahl, Preis | dto. |
| 14 | Boxen/Umverpackung: Anzahl, Preis | dto. |
| 15 | Probenbehälter: Größe (2 ml / 5 ml), Anzahl, Preis | dto. |
| 16 | Versandmaterial: Art, Anzahl, Preis | dto. |
| 17 | Sonstige vorhandene Komponenten, die in ein verkaufsfähiges Produkt gehen | dto. |
| 18 | Welche Verkaufsgrößen angelegt werden: 30 ml (laut `SYNC.md` auch 50 ml — gilt das noch?) und Proben 2 ml, 5 ml oder beides | `produkte.csv` |
