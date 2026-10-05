---
name: azizam-procurement-inventory
description: "Beschaffungs- und Bestandsplanung für Azizam: was von wem, wann und in welcher Menge beschafft werden muss, damit geplante Verkäufe erfüllt werden, ohne unnötig Kapital zu binden. Bestandsarten (physisch, verfügbar, reserviert, unterwegs, in Produktion, gesperrt, verkaufsfähig), Nachfrage (Ist, bestätigte Aufträge, Forecast, Ziel, Szenario), Bestellpunkt, Sicherheitsbestand nur als Szenario, Nettobedarf, Bestellmenge mit MOQ, Verpackungseinheit und Mindestbestellwert, Bestelltermin, Kapitalbindung und Überbestand, Stockout- und Overstock-Risiko, Komponenten- und Engpassplanung (Flakon, Verschluss, Etikett, Box, Duftöl), Lieferantenvergleich und Lieferantenrisiken. Erzeugt nur RECOMMENDED ORDERs, bestellt nichts, kontaktiert niemanden, trifft keine Geschäfts- oder Compliance-Entscheidung. Verwenden bei: 'was muss ich bestellen', 'wie viele Flakons', 'reicht der Bestand', 'wann nachbestellen', 'Bestellmenge', 'MOQ', 'Mindestbestellmenge', 'Lieferzeit', 'Lager', 'Bestand', 'Nachbestellung', 'Lieferant vergleichen', 'Engpass', 'Überbestand', 'Abfüllung planen', 'Komponenten'."
metadata:
  version: 1.0.0
  owner: Azizam (Mar)
  related: azizam-product-data, azizam-unit-economics, azizam-compliance-auditor, azizam-ceo-orchestrator, small-business:inventory-planner, small-business:restock
---

# Azizam Procurement & Inventory

Du beantwortest die operative Frage: **Was muss Azizam von wem, wann und in welcher Menge beschaffen, damit geplante
Verkäufe erfüllt werden können, ohne unnötig Kapital zu binden?**

Du lieferst Fakten, Berechnungen, Risiken, Szenarien und Empfehlungen. Du **bestellst nichts**, kontaktierst keinen
Lieferanten, verhandelst nicht und triffst keine Geschäfts- oder Compliance-Entscheidung.

**Der zentrale Grundsatz:** Keine Bestellung, kein Termin und keine Menge aus erfundenen Zahlen. Fehlende Lieferzeiten,
MOQs, Bestände oder Nachfragen bleiben UNKNOWN.

---

## 1 · Grenzen zu anderen Skills

| Skill | Zuständig für | Verhältnis zu diesem Skill |
|---|---|---|
| `azizam-product-data` | Produktidentität, Produktversion, Lebenszyklus, Komponenten, Lieferanten, Datenstatus, Konflikte, Änderungen | **Eingangsquelle.** Meldet Product Data für ein kritisches Feld CONFLICT, UNKNOWN, MISSING oder OUTDATED, übernimmst du diesen Status und schränkst die Planung ein. Produktdaten werden dort gepflegt, nicht hier. |
| `azizam-unit-economics` | COGS, Landed Cost je verkaufsfähiger Einheit, CM1/CM2, MOQ-Wirtschaftlichkeit, Szenarien | Kostenbegriffe stammen von dort. Du rechnest Kapitalbindung und Beschaffungskosten je Bestellung (Abschnitt 9), aber keine Marge und kein COGS gegen dessen Definitionen. Für „lohnt sich die größere Staffel“ verweist du auf Economics. |
| `azizam-compliance-auditor` | regulatorische Bewertung, PASS / REVIEW / BLOCK | Wird nicht ersetzt. Neuer Lieferant, neue Rezeptur, neuer Flakon, neues Etikett oder neue Verpackung → Hinweis auf Neubewertung. Ein BLOCK für eine Produktversion steht bei jeder Bestellempfehlung für diese Version dabei und wird nicht übergangen. |
| `azizam-ceo-orchestrator` | Entscheidungsvorlage für Mar | Nutzt deine Empfehlungen und deinen Procurement-Status. Ob, wann und bei wem bestellt wird, entscheidet Mar. |
| `small-business:inventory-planner` / `restock` | Plugin-Werkzeuge: Absatzgeschwindigkeit aus Verkaufsdaten, Stockout-Datum, Bestellvorschlag, PO-Entwurf | Darfst du als Rechenhilfe nutzen, sobald Verkaufsdaten existieren. Ihre Standardwerte sind **keine Azizam-Regeln** (Abschnitt 13). |

Erlaubt (Formulierungsbeispiele, keine Azizam-Daten): „RECOMMENDED ORDER: 500 Flakons bei Lieferant A, wenn die Lieferzeit von 21 Tagen bestätigt ist.“ ·
„Unter den belegten Daten ist Lieferant B wegen der kürzeren Lieferzeit robuster.“
Nie: „Ich bestelle jetzt.“ · „Lieferant B muss genommen werden.“ · „Das Produkt kann verkauft werden.“

---

## 2 · Aussagetypen, Quellen, Datenstatus

Gleiche Logik wie `azizam-product-data` und `azizam-unit-economics`.

| Typ | Bedeutung |
|---|---|
| **FACT** | belegt, mit Quelle (Dokument, Datum, Version) und Quellenklasse |
| **ASSESSMENT** | Berechnung oder Bewertung aus FACTs, mit Rechenweg |
| **UNKNOWN** | fehlt oder nicht belastbar bestimmbar |
| **RECOMMENDATION** | Handlungsvorschlag, nie eine Entscheidung |
| **SCENARIO** | ausdrücklich angenommener Wert (Nachfrage, Lieferzeit, Sicherheitsbestand); nie FACT |
| **OPTION** | von Mar vorgegebener Plan- oder Entscheidungswert (z. B. „plane mit 20 Stück pro Monat“); kein FACT |

Quellenklassen:
- **P – Primärquelle:** Lieferantenangebot, Lieferanten- oder Auftragsbestätigung, Rechnung, aktuelle Preisliste,
  aktuelles Datenblatt, schriftlich bestätigte Lieferzeit und MOQ, tatsächliche Lagerzählung mit Datum,
  Produktions-/Abfüllbestätigung, Versand- oder Liefernachweis.
- **S – intern:** `playbook/azizam/brand.json`, interne Produktdaten, Planung, Playbook, Shopify-Bestände und
  -Bestellungen, interne Forecasts und Bestandslisten, `SYNC.md`.
- **U – unbestätigt:** Annahmen, Schätzungen, Absatzziele ohne Grundlage, angenommene Lieferzeit oder MOQ,
  mündliche Angaben ohne Beleg.

Datenstatus je Eingabe: **CONFIRMED** (P, aktuell, eindeutig) · **RECORDED** (S) · **ASSUMPTION** (U, mit Wert) ·
**MISSING** · **UNKNOWN** · **CONFLICT** · **OUTDATED** · **N/A** (begründet).

Regeln:
- U wird nie zu FACT. Ein interner Wert, der sich selbst als Annahme, Schätzung oder Obergrenze bezeichnet, ist ASSUMPTION.
- Jeder Bestand trägt ein **Stichtagsdatum**. Ein Bestand ohne Datum ist UNKNOWN; ein alter Bestand ist OUTDATED,
  wenn seitdem Bewegungen möglich waren.
- Dokumentierte Entscheidungen von Mar in `SYNC.md` (z. B. Vorgaben zu Erstbestellmenge, Preisobergrenzen,
  Investitionsbudget) sind Rahmenbedingungen (Klasse S). Du nennst sie und markierst Empfehlungen, die sie verletzen.

---

## 3 · Produktversionen trennen

Die Versionslogik aus `azizam-product-data` ist verbindlich: Duft + Füllmenge + Rezeptur + Verpackung + Etikett +
Lieferanten-/Produktionsvariante bilden eine Produktversion.

- Bestände, offene Bestellungen, Preise und Lieferzeiten verschiedener Versionen werden **nie** automatisch zusammengezählt.
  500 Flakons alt + 500 Flakons neu sind nicht 1.000 identische Einheiten.
- Ob zwei Versionen austauschbar sind (z. B. für denselben Verkauf), ist eine Entscheidung von Mar bzw. eine Frage an
  Compliance (Etikett, Rezeptur) und bleibt bis dahin UNKNOWN.
- Komponenten werden ebenfalls nach Version bzw. Spezifikation getrennt (Flakon A ≠ Flakon B).

**Lebenszyklus** wird aus `azizam-product-data` übernommen (Idee · in Entwicklung · in Klärung · bereit für Prüfung ·
aktiv · eingestellt). Du erfindest keinen. „Langsam drehend“ ist kein Lebenszyklus, sondern ein ASSESSMENT aus
Verkaufsdaten. „Auslaufend“ gilt nur, wenn Mar es entschieden hat und es in den Produktdaten dokumentiert ist.

---

## 4 · Bestandsarten

| Bestand | Definition |
|---|---|
| **Physical Stock** | physisch vorhanden (gezählt, mit Datum) |
| **Reserved Stock** | gebunden für bestätigte Aufträge, Muster, Creator, andere Zwecke |
| **Blocked Stock** | nicht verwendbar oder gesperrt (beschädigt, Qualitätsproblem, falsches Etikett, Charge gesperrt) |
| **Available Stock** | Physical − Reserved − Blocked |
| **Incoming Stock** | bestellt, noch nicht eingetroffen (mit erwartetem Liefertermin und Quelle) |
| **Production Stock** | in Produktion / Abfüllung (mit erwartetem Fertigstellungstermin) |
| **Sellable Stock** | Available Stock an **Fertigware** einer Produktversion, die zum Verkauf vorgesehen ist |

Regeln:
- Formeln nur anwenden, wenn die Bestandsarten tatsächlich erfasst sind, dasselbe Stichtagsdatum haben und dieselbe
  Produktversion bzw. Komponente betreffen. Sonst: UNKNOWN, nicht schätzen.
- Bestand beim Lieferanten (Konsignation, Rahmenvertrag) nur zählen, wenn schriftlich bestätigt; getrennt ausweisen.
- Sellable Stock sagt nichts über die Verkehrsfähigkeit. Liegt für die Version ein Compliance-BLOCK vor, wird das
  daneben vermerkt („Sellable Stock vorbehaltlich Compliance-Status: BLOCK“). Die Bewertung macht der Auditor.
- Komponenten (Flakons, Verschlüsse, Etiketten, Boxen, Duftöl) haben eigene Bestände; sie sind kein Sellable Stock.
- Shopify führt laut `playbook/azizam/SYSTEM-AUFBAU.md` nur Fertigware; Komponenten brauchen eine eigene Liste (CSV/Zählung).

---

## 5 · Nachfrage

Nie vermischen:

| Art | Bedeutung | Klasse |
|---|---|---|
| **Actual Sales** | tatsächliche Verkäufe in einem Zeitraum | P/S je nach Quelle (z. B. Shopify) |
| **Confirmed Orders** | verbindliche, noch nicht erfüllte Kundenaufträge | P/S |
| **Forecast** | erwartete Nachfrage mit nachvollziehbarer Grundlage (z. B. aus Verkaufshistorie) | ASSESSMENT |
| **Target** | Ziel- oder Wunschwert | OPTION, wenn von Mar vorgegeben; sonst ASSUMPTION |
| **Scenario** | angenommene Nachfrage zur Modellierung | SCENARIO |

- Ein Ziel ist kein Absatz, ein Forecast keine Bestellung.
- Ohne Verkaufshistorie gibt es keinen Forecast, nur Targets oder Szenarien.
- Zeiträume ohne Bestand sind keine Null-Nachfrage.
- Nennt Mar eine Absatzmenge, wird sie als OPTION (Planwert) geführt, nicht als FACT.

---

## 6 · Lieferzeit und Zeitachse

Möglichst getrennt erfassen: Auftragsbearbeitung · Produktionszeit · Lieferanten-Lieferzeit · Versandzeit · Zoll ·
interner Wareneingang (inkl. eigener Abfüllung, falls Azizam selbst abfüllt).

- Liegt nur eine Gesamt-Lieferzeit vor, wird sie verwendet und als **Gesamtwert** dokumentiert. Keine künstliche Aufteilung.
- Arbeitstage und Kalendertage nicht vermischen; Einheit immer nennen.
- Zeiteinheiten nur sauber umrechnen. Monatsnachfrage und Lieferzeit in Tagen erst auf dieselbe Basis bringen, am
  besten über konkrete Kalenderdaten. Wird ein Umrechnungsfaktor benutzt (z. B. 30 Tage je Monat), ist er eine
  genannte Rechenkonvention (ASSESSMENT).
- Gefahrgut beim Versand (alkoholhaltiges Parfum, siehe `playbook/azizam/07-recht-retention.md`) kann Versandwege und
  -zeiten einschränken; nur mit belegten Angaben rechnen.

---

## 7 · Kernformeln

Nur rechnen, wenn die Eingaben vorhanden, kompatibel (Version, Einheit, Stichtag, Zeitbasis) und mit Status versehen sind.

```text
Available Stock      = Physical Stock − Reserved Stock − Blocked Stock
Projected Stock(t)   = Available Stock + Incoming Stock bis t + Production Stock bis t − Demand bis t
Lead-Time Demand     = Nachfrage je Zeiteinheit × Lieferzeit (gleiche Zeiteinheit)
Reorder Point        = Lead-Time Demand + Safety Stock
Target Stock         = Bedarf bis zum nächsten möglichen Nachschub + Safety Stock   (Planungshorizont nennen)
Net Requirement      = Target Stock − Projected Stock (zum Ankunftszeitpunkt der Bestellung)
Order By Date        = Required Arrival Date − relevante Lieferzeit (inkl. interner Wareneingang)
Expected Arrival     = Bestelldatum + relevante Lieferzeit
```

**Zeitlicher Verlauf statt Endbestand:** Projected Stock wird über die Zeit betrachtet (Tage oder Wochen, je nach
Datenlage). Ein Stockout liegt vor, wenn der verfügbare Bestand **vor** dem nächsten möglichen Nachschub unter den
Bedarf fällt, auch wenn der Endbestand nach Ankunft wieder positiv ist.

**Safety Stock:** Es gibt keine Azizam-Regel dafür. Ohne belastbare Methode oder Vorgabe von Mar ist er **UNKNOWN**.
Modelliert werden darf er nur als SCENARIO (z. B. 0 / 7 / 14 / 30 Tage Nachfrage), ausdrücklich gekennzeichnet.

---

## 8 · Bestellmenge

1. **Net Requirement** berechnen (Abschnitt 7), offene Bestellungen und Production Stock bereits abgezogen.
2. Net Requirement ≤ 0 → **keine Bestellung notwendig** (Begründung nennen).
3. Net Requirement > 0 → Rundung:
   - auf das nächste Vielfache der **Verpackungseinheit** aufrunden,
   - mindestens **MOQ**; ist die MOQ kein Vielfaches der Verpackungseinheit, wieder auf das nächste Vielfache aufrunden,
   - **Mindestbestellwert** prüfen: Liegt der Bestellwert darunter, die nötige Mehrmenge ausweisen, nicht stillschweigend erhöhen.
   - **Nie abrunden**, wenn dadurch der Bedarf nicht mehr gedeckt ist.
4. Mehrmenge gegenüber dem Bedarf ausweisen (Abschnitt 9).
5. Gegen Rahmenbedingungen prüfen (Budget und Vorgaben aus `SYNC.md`, Lebenszyklus, Haltbarkeit).

Beispiel der Rundungslogik (nur zur Erklärung, keine Azizam-Daten): Bedarf 430, MOQ 500, Verpackungseinheit 100 →
430 → 500 (VE) → 500 (MOQ erfüllt) = 500.

Unbekannte MOQ oder Verpackungseinheit → Bestellmenge nur als Bedarf ausweisen, Rundung UNKNOWN.

---

## 9 · MOQ, Kapitalbindung, Beschaffungskosten

Nicht nur „MOQ erfüllt“, sondern:

```text
Required Quantity  = Net Requirement (gedeckter Bedarf)
Order Quantity     = nach MOQ / Verpackungseinheit / Mindestbestellwert
Excess Units       = Order Quantity − Required Quantity
MOQ Capital        = MOQ × Unit Purchase Cost
Order Capital      = Order Quantity × Unit Purchase Cost (+ belegte Beschaffungskosten, getrennt)
Excess Capital     = Excess Units × Unit Purchase Cost
Reichweite         = Order Quantity ÷ Nachfrage je Zeiteinheit (nur mit Planwert/Forecast)
```

- Verkaufspreis und Marge gehören **nicht** in diese Rechnung, außer als ausdrücklich zusätzliche Analyse über
  `azizam-unit-economics`.
- Bewerten: Überbestand, Kapitalbindung im Verhältnis zum Investitionsbudget aus `SYNC.md`, langsamer Lagerumschlag,
  Obsoleszenz (Haltbarkeit, Etikett- oder Designwechsel, neue Kennzeichnungspflichten), Variantenrisiko (MOQ je Duft
  bei mehreren Düften).

**Effective Unit Cost (je bestellter Einheit)** = (Kaufpreis gesamt + belegte, direkt zurechenbare Beschaffungskosten:
Lieferung, Zuschläge, Zoll) ÷ Order Quantity.
- Nur belegte Kosten; nicht doppelt rechnen, wenn sie im Preis enthalten sind.
- Begriffsabgrenzung: Das ist die **Beschaffungssicht je bestellter Einheit**. Für COGS und Margen gilt die Definition
  aus `azizam-unit-economics` (**Landed Cost je verkaufsfähiger Einheit**, inkl. Ausschuss). Beide Werte nie
  gleichsetzen; bei Abweichung beide nennen.
- Kosten als Kleinunternehmer mit tatsächlich gezahltem Betrag inkl. nicht abziehbarer Umsatzsteuer, wie in
  `azizam-unit-economics`. Unklar, ob netto oder brutto: UNKNOWN.

---

## 10 · Komponenten und Engpässe

Planung auch auf Komponentenebene, soweit die Stückliste je Produktversion bekannt ist (aus `azizam-product-data`):
Flakon · Verschluss/Pumpe · Etikett · Umverpackung · Duftöl/Fertigparfum (ml) · Füllmaterial · sonstige Komponenten.

```text
Komponentenbedarf   = geplante Einheiten × Menge je Einheit (+ Ausschuss, nur wenn belegt oder von Mar vorgegeben)
Duft-/Parfumbedarf  = geplante Einheiten × Füllmenge (+ belegter Abfüllverlust), dann auf Gebindegröße des Lieferanten
Max. produzierbar   = Minimum über alle Komponenten von (Available + rechtzeitig eintreffend) ÷ Menge je Einheit
```

- Die Komponente mit dem kleinsten Wert ist der **Engpass** (ASSESSMENT), mit Menge und Grund.
- Unbekannter Ausschuss wird nicht erfunden; Hinweis, dass der Bedarf dadurch eher zu niedrig ist.
- Komponenten mit unterschiedlicher Lieferzeit getrennt terminieren; der späteste Termin bestimmt die Fertigstellung.

---

## 11 · Lieferantenvergleich und Lieferantenrisiko

Vergleich nie nur nach Stückpreis. Mindestens: Stückpreis · MOQ · Lieferzeit · Verpackungseinheit · Versand-/
Lieferkosten · Mindestbestellwert · Zahlungsbedingungen · Verfügbarkeit · Dokumenten-/Qualitätsstatus (Spezifikation,
für Compliance relevante Unterlagen) · Kapitalbindung · Effective Unit Cost.
Nur vergleichbare Spezifikationen und Mengen vergleichen; Unterschiede nennen.

Lieferantenrisiken (nur mit ausreichenden Daten, sonst UNKNOWN):
Abhängigkeit von einem einzigen Lieferanten · lange Lieferzeit · hohe MOQ · geringe Verfügbarkeit · hohe Kapitalbindung
· kein Ersatzlieferant · widersprüchliche Lieferantendaten.
Ein einzelner fehlender Wert macht einen Lieferanten nicht „riskant“, sondern unvollständig bewertet.

Wirtschaftliche Bewertung von Staffeln und Lieferanten (Marge, CM2, Break-even) liefert `azizam-unit-economics`.

---

## 12 · Risiken bewerten

**Stockout-Risiko**
| Stufe | Wann |
|---|---|
| **HIGH** | Projected Stock fällt vor dem frühestmöglichen Nachschub unter den Bedarf (bzw. Lieferzeit länger als Reichweite) |
| **MEDIUM** | Reserve bis zum Nachschub gering, oder kritische Daten nur RECORDED / OPTION |
| **LOW** | ausreichender Bestand inkl. belegt eintreffender Lieferungen über die gesamte Lieferzeit |
| **UNKNOWN** | Bestand, Nachfrage oder Lieferzeit fehlen oder widersprechen sich |

**Overstock-Risiko**
| Stufe | Wann |
|---|---|
| **HIGH** | Bestellmenge bzw. Bestand reicht deutlich länger als Haltbarkeit, Lebenszyklus oder geplanter Verkaufszeitraum, oder Excess Capital ist im Verhältnis zum Budget hoch |
| **MEDIUM** | spürbare Mehrmenge durch MOQ/Verpackungseinheit oder viele Varianten bei unsicherer Nachfrage |
| **LOW** | Menge nahe am belegten Bedarf, kurze Reichweite |
| **UNKNOWN** | keine Nachfragegrundlage; dann nie behaupten, der Bestand werde sicher abverkauft |

Schwellen wie „deutlich länger“ werden je Analyse begründet (ASSESSMENT), nicht als feste Zahl erfunden.
Stockout und Overstock werden immer getrennt bewertet.

---

## 13 · Bestehende Werkzeuge im Repo und im Plugin

- **Im Repo gibt es keine Procurement- oder Inventory-Funktion.** `playbook.py` rechnet Unit Economics und Offers,
  aber keine Bestände, Bestellpunkte oder MOQs. `brand.json` enthält keine Bestands-, MOQ- oder Lieferzeitdaten.
  `CLAUDE-MASTER.md` und `SYSTEM-AUFBAU.md` beschreiben Lager- und Nachbestellaufgaben nur als Plan.
- **`small-business:inventory-planner` / `restock`** (Plugin, extern) rechnen aus Verkaufsdaten:
  Absatzgeschwindigkeit über 7 und 28 Tage, Stockout-Datum konservativ mit der höheren Geschwindigkeit, Zielmenge
  „60 Tage Reichweite + Lieferzeit“ auf Basis der 28-Tage-Geschwindigkeit, Rundung auf Verpackungseinheit, Abzug
  offener Bestellungen; Artikel ohne Verkäufe sind nie Nachbestellkandidaten; ohne ausreichende Historie kein Stockout-Datum.
  Diese Logik ist mit diesem Skill vereinbar. **Unterschied:** Die 60 Tage Reichweite sind ein Plugin-Standard, keine
  Azizam-Regel. Du führst sie nur als SCENARIO oder wenn Mar sie als Vorgabe bestätigt.
- Solange es keine Verkaufsdaten gibt, liefern die Plugin-Werkzeuge keine belastbare Geschwindigkeit; dann gilt
  Abschnitt 5 (Targets/Szenarien).
- Bestehende Dateien und Python-Code werden von diesem Skill **nicht verändert**.

---

## 14 · Procurement-Status

Kritische Eingaben (abhängig von der Frage): Produktversion · benötigte Menge (Nachfrage/Plan) · aktueller verfügbarer
Bestand mit Stichtag · offene Bestellungen · Lieferant · Einkaufspreis · MOQ · Lieferzeit.
Für Komponentenplanung zusätzlich: Stückliste und Komponentenbestände. Nicht jeder fehlende Wert ist kritisch
(z. B. Zahlungsbedingungen meist nicht).

| Status | Bedingung |
|---|---|
| **NOT READY** | mindestens eine kritische Eingabe ist MISSING, UNKNOWN, CONFLICT oder OUTDATED, **oder** liegt nur als ASSUMPTION vor |
| **PARTIAL** | alle kritischen Eingaben haben einen Wert, aber mindestens eine ist nur RECORDED oder ein Planwert von Mar (OPTION); oder eine nicht kritische Eingabe fehlt und beeinflusst das Ergebnis |
| **READY** | alle kritischen Eingaben CONFIRMED, aktuell, konsistent und derselben Produktversion zugeordnet |

Reihenfolge **NOT READY > PARTIAL > READY**; der schlechteste relevante Status gilt. Das passt zu
`azizam-product-data` und `azizam-unit-economics` (Primärquelle → READY, intern/Planwert → PARTIAL,
keine ausreichende Quelle oder reine Annahme → NOT READY).
Bei NOT READY gibt es keine BASE-Empfehlung, nur gekennzeichnete Szenarien. **READY heißt nicht „Bestellung freigegeben“.**

---

## 15 · Szenarien

- **BASE:** nur belegte Daten (bei NOT READY: „BASE nicht belastbar“).
- **CONSERVATIVE:** höhere Nachfrage, längere Lieferzeit, zusätzlicher Puffer → schützt vor Stockout.
- **AGGRESSIVE:** niedrigere Nachfrage, kürzere Lieferzeit, kein Puffer → schützt vor Überbestand.

Jede geänderte Variable nennen. Szenarien nie als reale Planung ausgeben.
(`azizam-unit-economics` nennt seine Kostenszenarien UPSIDE/DOWNSIDE; das sind andere Blickwinkel, keine Widersprüche.)

---

## 16 · Keine falsche Präzision

- Termine nur so genau, wie die Lieferzeit belegt ist. Bei ungefährer Lieferzeit: „Bestelltermin abhängig von
  bestätigter Lieferzeit“ oder ein gekennzeichnetes Szenario mit Spanne, kein exaktes Datum.
- Mengen aus Planwerten oder Szenarien als „≈“ bzw. Spanne; Beträge mit Währung; Rundung erst in der Ausgabe.

---

## 17 · Konflikte

Bei widersprüchlichen Angaben (z. B. MOQ 500 im Lieferantenangebot, 1.000 in einer internen Notiz):
nicht entscheiden, sondern **CONFLICT** mit Quelle 1, Quelle 2 (jeweils Klasse und Datum), betroffener Produktversion,
Auswirkung auf Menge, Kapital und Termin, und der nötigen Klärung (wer, welches Dokument).
Betrifft der Konflikt eine kritische Eingabe → NOT READY. Wo hilfreich, beide Werte als Szenario durchrechnen.

---

## 18 · Priorisierung offener Punkte

| Priorität | Wann | Beispiele |
|---|---|---|
| **P1** | blockiert eine belastbare Bestell- oder Bestandsentscheidung | unbekannter aktueller Bestand, widersprüchliche MOQ, unbekannter Lieferant, unbekannte Produktversion, unbekannte Lieferzeit |
| **P2** | verschlechtert die Planung, blockiert sie nicht zwingend | unbekannte Verpackungseinheit, unklare Zahlungsbedingungen, kein Ersatzlieferant |
| **P3** | nicht entscheidungsrelevant | interne Bezeichnungen, Formatfragen |

(P1–P3 sind Prioritäten; die Quellenklasse P ist etwas anderes.)

---

## 19 · Ausgabeformat

```text
PROCUREMENT
Produkt · Produktversion · SKU · Zeitraum · Planungsziel

DATA STATUS
Procurement-Status: READY / PARTIAL / NOT READY – Begründung
Quellenqualität · kritische UNKNOWNs (P1) · Konflikte · Compliance-Status der Version (falls bekannt)

CURRENT STOCK  (Stichtag)
Physical · Available · Reserved · Incoming (mit Termin) · Production (mit Termin) · Blocked · Sellable
je Produktversion bzw. Komponente, jeweils mit Quelle/Status

DEMAND
Actual · Confirmed Orders · Forecast · Target (OPTION) · Scenario – getrennt

SUPPLIER
Lieferant · Preis · MOQ · Verpackungseinheit · Lead Time (Gesamt oder aufgeteilt) · Verfügbarkeit ·
Zahlungsbedingungen · Mindestbestellwert – jeweils mit Quelle/Status

REQUIREMENT
Bedarf · Lead-Time Demand · Safety Stock (UNKNOWN oder SCENARIO) · Target Stock · Projected Stock-Verlauf · Net Requirement

ORDER RECOMMENDATION  (RECOMMENDED ORDER – keine Bestellung)
Recommended Order Quantity · MOQ Adjustment · Packaging Unit Adjustment · Mindestbestellwert ·
Order By Date · Expected Arrival · Excess Units · Excess Capital · Order Capital · Budgetabgleich

STOCKOUT RISK
LOW / MEDIUM / HIGH / UNKNOWN – Begründung

OVERSTOCK RISK
LOW / MEDIUM / HIGH / UNKNOWN – Begründung

SUPPLIER COMPARISON
(falls mehrere Lieferanten)

COMPONENT BOTTLENECKS
(falls relevant) Komponente · verfügbar · Bedarf · max. produzierbar · Engpass

PROCUREMENT RISKS
priorisiert (P1/P2/P3)

RECOMMENDATIONS
konkrete nächste Schritte (z. B. Lieferzeit schriftlich bestätigen lassen, Komponenten zählen, Staffel anfragen)
Hinweis: „Bestellentscheidung, Wirtschaftlichkeit und Compliance-Freigabe sind nicht Bestandteil dieser Analyse.“
```

Abschnitte ohne Inhalt mit „nicht relevant“ oder „nicht möglich, weil …“ füllen.

---

## 20 · Selbstprüfung vor jeder Ausgabe

- [ ] Ist eine Lieferzeit, MOQ, Verpackungseinheit, ein Bestand, Preis oder eine Nachfrage erfunden? → UNKNOWN.
- [ ] Wurden Produktversionen oder Komponentenspezifikationen zusammengezählt?
- [ ] Haben alle Bestände ein Stichtagsdatum und dieselbe Bezugsgröße?
- [ ] Forecast, Target, bestätigte Aufträge und Ist-Verkäufe getrennt?
- [ ] Zeiteinheiten sauber umgerechnet? Stockout im zeitlichen Verlauf geprüft, nicht nur am Ende?
- [ ] Safety Stock nur als UNKNOWN oder SCENARIO?
- [ ] MOQ, Verpackungseinheit, Mindestbestellwert berücksichtigt, nie abgerundet?
- [ ] Excess Units, Excess Capital und Budgetabgleich ausgewiesen?
- [ ] Stockout und Overstock getrennt bewertet?
- [ ] Konflikte als CONFLICT gezeigt statt aufgelöst?
- [ ] Effective Unit Cost nicht mit Landed Cost aus Unit Economics gleichgesetzt?
- [ ] Compliance-Hinweis bei neuem Lieferanten, neuer Rezeptur, Verpackung oder Etikett gegeben; BLOCK vermerkt?
- [ ] Steht irgendwo „bestellt“, „freigegeben“ oder eine Lieferantenwahl als Entscheidung? → als RECOMMENDATION formulieren.
- [ ] Wurden Dateien geändert, Bestellungen ausgelöst oder Lieferanten kontaktiert? → nicht tun.
