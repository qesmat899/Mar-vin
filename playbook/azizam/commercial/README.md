# Commercial-Daten Azizam

Struktur für echte Produkt-, Bestands-, Angebots-, Verkaufs-, Experiment- und Entscheidungsdaten.
**Stand 07.10.2026:** Erste Bestandsaufnahme von Mar eingetragen (18 Gebinde, 16 Düfte, Lieferant; Füllstände per
Augenmaß). Komponenten, Offers, Transaktionen, Kunden, Experimente und Entscheidungen sind noch leer. Prüfen und auswerten: `python3 playbook.py daten --brand azizam`. Code: `commercial.py`.

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
Jede physische Flasche ist ein eigenes **Gebinde** (`gebinde_id`, z. B. `G-01`) mit eigener Charge und eigenem
Einkaufspreis. Zwei Flaschen desselben Dufts werden nie zu einer Durchschnittsflasche zusammengefasst.

`bewegung` (Menge immer positiv eintragen, Richtung ergibt sich aus der Bewegung; nur `korrektur` trägt ein Vorzeichen):

| Bewegung | Wirkung | Pflicht |
|---|---|---|
| `zugang` | + (Einkauf/Zugang; eine Zeile je Flasche bzw. Lieferung, Menge = Nennmenge des Gebindes) | `einkaufspreis_gesamt_eur` (Zahl oder `UNKNOWN`), `preis_qualitaet`; `datum` = Kaufdatum oder `UNKNOWN` |
| `inventur` | setzt den Stand absolut (Bestandsaufnahme); bei Schätzung als Spanne `menge` … `menge_bis` | Datum, `mengen_basis` |
| `abfuellung_ab` | − Quellgebinde in ml und verbrauchte Komponenten | `abfuellung_ref` |
| `abfuellung_zu` | + abgefüllte 30-ml-Produkte bzw. Proben | dieselbe `abfuellung_ref` |
| `verkauf` | − verkaufte Produkte | `transaktion_ref` |
| `probe_gratis` | − kostenlose Probe (auch als Zugabe in einem Bundle) | `transaktion_ref` oder `experiment_ref` |
| `creator` | − an Creator/Influencer | `experiment_ref`, wenn Teil eines Tests |
| `bruch`, `verlust` | − Bruch; Verlust/Verdunstung | — |
| `korrektur` | ± Bestandskorrektur nach Zählung | `notiz` mit Grund |

**Datenqualität je Bewegung:** `mengen_basis` = `nennmenge` · `gemessen` · `geschaetzt` (Augenmaß) · `UNKNOWN`;
`preis_qualitaet` = `BELEG` · `ANGABE` (exakte Angabe von Mar ohne Beleg) · `CA_ANGABE` · `UNKNOWN`; `beleg_ref` =
Verweis auf die zugeordnete Rechnung (leer = noch nicht zugeordnet). Eine Schätzung wird nie nachträglich zum Messwert:
eine Messung ist eine neue `inventur` mit `mengen_basis = gemessen`.

Kette: `500 ml Ausgangsbestand → Abfüllung → 30-ml-Produkte / Proben → Bundles → Verkäufe → Verbrauch → Restbestand →
Kapitalbindung`. Bestand = letzte Inventur + spätere Bewegungen (ohne Inventur: Summe der Bewegungen). Kapitalbindung = Bestand × Einstandspreis (Quellgebinde: Einkaufspreis ÷
Nennmenge der jeweiligen Flasche; abgefüllte Produkte: COGS aus Stückliste). Beruht der Bestand auf einer Schätzung,
ist auch der Wert eine Schätzung und wird so ausgegeben. Fehlt ein Preis: „ohne belegten
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

## Bestandsaufnahme 07.10.2026 (Mar)

Eingetragen: Lieferant Tomorrow Brand UG Parfumfabrik · 16 Düfte (Duftölanteil 30 % laut Mar) · 18 Gebinde
`G-01` … `G-18` (16 × 500 ml, 2 × 1.000 ml Velvet Vanilla) mit Zugang (Nennmenge, Preis, Charge) und Inventur
(Füllstand per Augenmaß, `mengen_basis = geschaetzt`; Roja Aoud als Spanne 300–325 ml). Status je Zeile `RECORDED`
(Angabe von Mar, noch ohne Beleg). Die Düfte (außer Velvet Vanilla) sind mit der von Mar genannten Bezeichnung als
`lieferanten_bezeichnung` angelegt; ob das die Fabrikbezeichnung ist und wie der Azizam-Name lautet, ist offen.
Diese Bezeichnungen enthalten fremde Markennamen und gehören nie in Kundentexte (Verbotsliste `brand-briefing.md`).

**Offene Nachträge** (zeigt `playbook.py daten` laufend an):
1. Kaufdatum je Flasche (alle 18 `UNKNOWN`)
2. Belege heraussuchen und den Flaschen bzw. Sammelbestellungen zuordnen (`beleg_ref`, dann `preis_qualitaet = BELEG`)
3. Charge von Velvet Vanilla `G-17` (ungeöffnet)
4. Einkaufspreise: alle 18 erfasst (Arabians Tonka 31,93 € nachgetragen). Ca.-Werte: Imagination `G-13` (ca. 38 €),
   Velvet Vanilla `G-17`/`G-18`: tatsächlich `G-17` gratis, `G-18` ca. 90 €; für die Stückkosten je 45 € umgelegt
   (Entscheidung `D-001` in `entscheidungen.csv`). Mit Beleg bestätigen.
5. Liefer-/Zollkostenanteil je Sammelbestellung (bisher nicht erfasst)
6. Azizam-Namen bzw. Bestätigung der Fabrikbezeichnungen
7. Optional: Füllstände wiegen oder messen (neue `inventur` mit `mengen_basis = gemessen`; die Schätzung bleibt stehen)

Noch nicht erfasst: bereits abgefüllte Mengen, leere Flakons, Verschlüsse, Etiketten, Boxen, Probenbehälter,
Versandmaterial; Verkaufsgrößen 30 / 50 ml und Probengrößen.
