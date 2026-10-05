# Azizam Commercial Data — Datengrundlage für Verkaufsentscheidungen

> Stand 05.10.2026 [Code]. Prüfen und auswerten: `python3 playbook.py daten --brand azizam`.
> Kein eigener Skill: Jedes Objekt gehört einem der fünf Azizam-Skills (`CLAUDE.md`, „Azizam Decision Architecture“).
> Rechendefinitionen stehen nur in `.claude/skills/azizam-unit-economics/SKILL.md` §5, nicht hier.

## Grundregeln

1. **Eine Source of Truth je Feld.** Ein Wert steht genau in einer Datei. Andere Dateien verweisen per ID.
2. **Berechnete Werte werden nicht gespeichert** (COGS, CM1, CM2, Bestand, Kapitalbindung, AOV, Velocity, Kundenwert).
   `playbook.py` rechnet sie aus den Rohdaten.
3. **Jeder Kosten- und Produktwert trägt Status und Quelle**: `CONFIRMED` · `RECORDED` · `ASSUMPTION` · `MISSING` ·
   `UNKNOWN` · `CONFLICT` · `OUTDATED` · `N/A` (Bedeutung: `azizam-product-data` §5). Leere Preise bleiben leer, nie
   mit „typischen“ Werten gefüllt.
4. **Keine personenbezogenen Daten im Repo** (`CLAUDE-MASTER.md` §2 Regel 6). In `transaktionen.csv` und `kunden.csv`
   nur pseudonyme Kürzel (`kunde_ref`, z. B. `K-0001`). Namen, E-Mail, Telefon, Adresse und Gesundheitsangaben bleiben
   außerhalb des Repos (Shopify, Drive); die Zuordnung Kürzel → Person führt Mar dort. `playbook.py daten` meldet
   Einträge, die wie E-Mail-Adressen oder Telefonnummern aussehen, als Fehler.
5. **Preise, Rabatte und Offers legt Mar fest.** Ein Offer wird erst `aktiv`, wenn `freigabe_ref` auf eine bestätigte
   Entscheidung in `entscheidungen.csv` zeigt.
6. **Entscheidungen sind Governance.** `entscheidungen.csv` wird nur nach ausdrücklicher Bestätigung von Mar ergänzt
   (Regel des Orchestrators, Decision Log). Claude trägt nie eine Empfehlung als Entscheidung ein.

## Die Objekte

| Objekt | Datei(en) | Eigentümer | Inhalt |
|---|---|---|---|
| PRODUCT | `produkte.csv`, `komponenten.csv`, `stueckliste.csv` | `azizam-product-data` | Duft, Typ (Quellgebinde / Verkaufsvariante / Probe), Größe, Version, Herkunft aus dem Quellgebinde, Stückliste, Kostenkomponenten mit Status |
| INVENTORY | `bestand.csv` | `azizam-procurement-inventory` | Bestandsbewegungen mit Datum (Zugang, Abfüllung, Verkauf, Probe, Bruch, Korrektur) |
| OFFER | `offers.csv`, `offer_positionen.csv` | Mar entscheidet, `azizam-unit-economics` bewertet | Angebot mit Preis, Rabatt, Versandentgelt, Inhalt (Bundle, Probe, Beigabe), Status, Freigabe |
| TRANSACTION | `transaktionen.csv`, `transaktion_positionen.csv` | Erfassung Mar / Shopify-Export, Auswertung `azizam-unit-economics` | tatsächlicher Verkauf: Kanal, Quelle, Erlös, Rabatt, Versandentgelt, Gebühren, Erstattung |
| CUSTOMER | `kunden.csv` | `azizam-unit-economics` (Auswertung) | pseudonymes Kürzel, Erstkauf, Erstkanal, Segment; Kundenwert wird gerechnet |
| EXPERIMENT | `experimente.csv` | `azizam-ceo-orchestrator` strukturiert, Mar bestätigt | Frage, Hypothese, vorher festgelegtes Erfolgskriterium, Ergebnis, Learning, Verweis auf Entscheidung. Creative-Details bleiben in `templates/testing-log.csv` (Verweis über `creative_id`) |
| DECISION | `entscheidungen.csv` | **Mar** (Vorlage: `azizam-ceo-orchestrator`) | Entscheidung, Annahmen, Evidence Quality, Confidence, erwartetes Ergebnis, Prüfdatum, tatsächliches Ergebnis |

Verhältnis zu bestehenden Dateien:
- `brand.json` bleibt Eingabe für `playbook.py economics` (alte Preise). Kostenkomponenten führt ab jetzt
  `komponenten.csv`; `playbook.py daten` zeigt, ob die COGS in `brand.json` zur Stückliste passen.
- `SYNC.md` „Entscheidungen“ bleibt die kurze Übergabe zwischen Chat und Code. `entscheidungen.csv` ist das
  Protokoll für Entscheidungen mit messbarer Erwartung (Preis, Offer, Bestellung, Experiment).

## Felder und erlaubte Werte

**produkte.csv**
- `typ`: `quellgebinde` (z. B. 500-ml-Flasche Fertigparfum) · `verkaufsvariante` · `probe`
- `quelle_produkt_id`: aus welchem Quellgebinde abgefüllt wird
- `stueckliste_id`: Verweis auf `stueckliste.csv`
- `lebenszyklus`: `idee` · `in_entwicklung` · `in_klaerung` · `bereit_fuer_pruefung` · `aktiv` · `eingestellt`

**komponenten.csv**: `einheit` `ml` oder `stueck`; `preis_eur_je_einheit` leer, wenn unbekannt.

**stueckliste.csv**: Was eine Einheit verbraucht (ml Fertigparfum, Flakon, Verschluss, Etikett …). COGS je Einheit =
Σ Menge × Preis je Einheit. Ist eine Komponente ohne Preis, ist COGS **UNKNOWN**; `playbook.py daten` zeigt dann nur
die bekannte Untergrenze.

**bestand.csv** (jede Zeile ist eine Änderung mit Vorzeichen; Bestand = Summe)
- `artikel_id`: `produkt_id` oder `komponente_id`
- `einheit`: Quellgebinde in `ml`, Verkaufsvarianten, Proben und Stück-Komponenten in `stueck`
- `bewegung`: `eingang` · `abfuellung_entnahme` · `abfuellung_zugang` · `verkauf` · `probe_abgabe` · `creator` ·
  `bruch` · `verlust` · `korrektur` (nach Zählung nur die Differenz buchen)
- Eine Abfüllung: gleiche `abfuellung_ref` für die Entnahme aus dem Gebinde (−ml, −Flakons …) und den Zugang an
  fertigen Einheiten (+Stück). Abfüllverlust = entnommene ml − Zugang × Füllmenge.

**offers.csv**
- `typ`: `einzel` · `bundle` · `probe` · `upsell` · `rabattcode`
- `kanal`: `online` · `privat` · `marktplatz`
- `rabatt_typ`: leer · `prozent` · `betrag`
- `status`: `entwurf` · `freigegeben` · `aktiv` · `beendet`
- **offer_positionen.csv** `rolle`: `verkauf` · `beigabe` · `probe`

**transaktionen.csv**
- `kanal`: `online` · `privat` · `marktplatz`
- `quelle`: `organisch` · `creator` · `ad` · `empfehlung` · `wiederkauf` · `unbekannt`
- `neukunde`: `ja` · `nein` · leer (unbekannt)
- Beträge in Euro, Erstattungen positiv in `erstattung_eur`

**experimente.csv** `status`: `geplant` · `laeuft` · `beendet` · `abgebrochen`; `evidenz`: `P` · `S` · `U`.

**entscheidungen.csv** `evidence_quality` und `confidence`: `HIGH` · `MEDIUM` · `LOW`; `bestaetigt_von`: `Mar`.

## Was `playbook.py daten` macht

- prüft Spalten, erlaubte Werte, Verweise zwischen den Dateien und den Datenschutz
- rechnet COGS je Produkt aus Stückliste und Komponenten, mit dem schlechtesten Status der Eingaben
- vergleicht mit den COGS in `brand.json`
- rechnet Bestand je Artikel und gebundenes Kapital (nur für Artikel mit bekannten Kosten)
- zählt Offers, Transaktionen, Kunden, Experimente, Entscheidungen

## Bekannte Lücken (Stand 05.10.2026)

- Verschluss- und Probenröhrchen-Preise **UNKNOWN** → COGS der Verkaufsvarianten und Proben unvollständig.
- Flakon 3,00 € ist eine **Obergrenze**, Etikett/Box 1,00 € eine **Annahme**.
- Bestand, Chargen und Lieferant (Name) nicht erfasst. Keine Offers, Transaktionen, Kunden oder Experimente.
