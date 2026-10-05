"""
commercial.py — Commercial-Datenarchitektur für Azizam (PRODUCT, INVENTORY, OFFER, TRANSACTION, CUSTOMER,
EXPERIMENT, DECISION). Wird von `python3 playbook.py daten --brand azizam` benutzt.

Grundsätze (Details: playbook/azizam/commercial/README.md):
- Die CSV-Dateien speichern nur erfasste Werte, nie abgeleitete (COGS, Bestand, Deckungsbeitrag werden gerechnet).
- Ein Zahlenfeld enthält eine Zahl, `UNKNOWN` oder bleibt leer (= nicht zutreffend / noch nicht erfasst).
  Was auf einem UNKNOWN beruht, ist selbst UNKNOWN — es wird nie mit einer plausiblen Zahl aufgefüllt.
- Keine personenbezogenen Kundendaten: nur pseudonyme Kunden-Referenzen (K-0001 …).
- Entscheidungen stehen nur in entscheidungen.csv und nur, wenn Mar sie getroffen hat.
"""

from __future__ import annotations

import csv
import pathlib
import re

UNKNOWN = "UNKNOWN"

DATA_STATUS = ("CONFIRMED", "RECORDED", "OBSERVED", "ASSUMPTION", "OUTDATED", "UNKNOWN")

# Datei → (Spalten in fester Reihenfolge, Pflichtspalten, erlaubte Werte je Spalte)
SCHEMA: dict[str, tuple[list[str], set[str], dict[str, tuple[str, ...]]]] = {
    "lieferanten.csv": (
        ["lieferant_ref", "name", "art", "status", "quelle", "notiz"],
        {"lieferant_ref", "status"},
        {"art": ("parfumfabrik", "flakon", "verpackung", "etikett", "versand", "sonstiges"), "status": DATA_STATUS},
    ),
    "duefte.csv": (
        ["duft_id", "name", "lieferant_ref", "lieferanten_bezeichnung", "status", "quelle", "notiz"],
        {"duft_id", "name", "status"},
        {"status": DATA_STATUS},
    ),
    "produkte.csv": (
        ["produkt_id", "typ", "duft_id", "groesse_ml", "produktversion", "quelle_produkt_id", "stueckliste_id",
         "lebenszyklus", "status", "quelle", "stand", "notiz"],
        {"produkt_id", "typ", "status"},
        {"typ": ("quellgebinde", "verkaufsvariante", "probe"),
         "lebenszyklus": ("idee", "in_klaerung", "aktiv", "auslaufend", "eingestellt"), "status": DATA_STATUS},
    ),
    "komponenten.csv": (
        ["komponente_id", "bezeichnung", "art", "duft_id", "einheit", "preis_eur_je_einheit", "preis_basis",
         "lieferant_ref", "status", "quelle", "stand", "notiz"],
        {"komponente_id", "art", "einheit", "status"},
        {"art": ("parfum", "flakon", "verschluss", "zerstaeuber", "etikett", "box", "probenbehaelter",
                 "versandmaterial", "sonstiges"),
         "einheit": ("ml", "stueck"), "preis_basis": ("gezahlt_brutto", "netto", UNKNOWN), "status": DATA_STATUS},
    ),
    "stueckliste.csv": (
        ["stueckliste_id", "komponente_id", "menge", "einheit"],
        {"stueckliste_id", "komponente_id", "menge", "einheit"},
        {"einheit": ("ml", "stueck")},
    ),
    "bestand_bewegungen.csv": (
        ["buchung_id", "datum", "artikel_typ", "artikel_id", "bewegung", "menge", "einheit", "charge",
         "einkaufspreis_gesamt_eur", "abfuellung_ref", "transaktion_ref", "experiment_ref", "status", "quelle",
         "notiz"],
        {"buchung_id", "datum", "artikel_typ", "artikel_id", "bewegung", "menge", "einheit", "status"},
        {"artikel_typ": ("produkt", "komponente"),
         "bewegung": ("zugang", "abfuellung_ab", "abfuellung_zu", "verkauf", "probe_gratis", "creator", "bruch",
                      "verlust", "korrektur"),
         "einheit": ("ml", "stueck"), "status": DATA_STATUS},
    ),
    "offers.csv": (
        ["offer_id", "name", "typ", "kanal", "preis_brutto", "rabatt_typ", "rabatt_wert", "versandentgelt_eur",
         "gratisversand_ab_eur", "ziel", "hypothese", "start", "ende", "status", "freigabe_ref", "experiment_ref",
         "ergebnis", "notiz"],
        {"offer_id", "typ", "status"},
        {"typ": ("einzel", "bundle", "produkt_plus_proben", "discovery_set", "cross_sell", "upsell",
                 "geschenk_bonus", "aktion", "wiederkauf"),
         "kanal": ("online", "privat", "marktplatz", "b2b"),
         "rabatt_typ": ("keiner", "prozent", "betrag"),
         "status": ("idee", "hypothese", "zur_freigabe", "freigegeben", "aktiv", "beendet", "verworfen")},
    ),
    "offer_positionen.csv": (
        ["offer_id", "produkt_id", "menge", "rolle"],
        {"offer_id", "produkt_id", "menge", "rolle"},
        {"rolle": ("verkauf", "gratis_zugabe", "bonus")},
    ),
    "transaktionen.csv": (
        ["transaktion_id", "datum", "kanal", "quelle", "offer_id", "experiment_id", "kunde_ref", "neukunde",
         "erloes_brutto", "rabatt_eur", "versandentgelt_eur", "versandkosten_eur", "zahlungsgebuehr_eur",
         "erstattung_eur", "retourkosten_eur", "status", "notiz"],
        {"transaktion_id", "datum", "kanal", "status"},
        {"kanal": ("online", "privat", "marktplatz", "b2b"), "neukunde": ("ja", "nein", UNKNOWN),
         "status": ("abgeschlossen", "storniert", "erstattet", "teilerstattet")},
    ),
    "transaktion_positionen.csv": (
        ["transaktion_id", "produkt_id", "menge", "gratis"],
        {"transaktion_id", "produkt_id", "menge"},
        {"gratis": ("ja", "nein")},
    ),
    "kunden.csv": (
        ["kunde_ref", "erstkauf_datum", "erstkanal", "notiz"],
        {"kunde_ref"},
        {"erstkanal": ("online", "privat", "marktplatz", "b2b")},
    ),
    "experimente.csv": (
        ["experiment_id", "hypothese", "ziel", "erfolgsmetrik", "schwelle", "start", "ende", "offer_id",
         "werbekosten_eur", "status", "ergebnis", "evidenz", "learning", "decision_ref", "naechster_test"],
        {"experiment_id", "hypothese", "erfolgsmetrik", "schwelle", "status"},
        {"status": ("geplant", "laeuft", "ausgewertet", "abgebrochen"),
         "evidenz": ("KONTROLLIERT", "KORRELATION", "ZU_WENIG_DATEN", UNKNOWN)},
    ),
    "entscheidungen.csv": (
        ["decision_id", "datum", "bereich", "entscheidung", "bezug", "grundlage", "entschieden_von", "quelle",
         "status", "ersetzt_durch", "pruefdatum", "notiz"],
        {"decision_id", "datum", "bereich", "entscheidung", "entschieden_von", "quelle", "status"},
        {"bereich": ("preis", "rabatt", "offer", "bestellung", "sortiment", "experiment", "bestand", "sonstiges"),
         "status": ("gueltig", "ersetzt", "zurueckgenommen")},
    ),
}

ID_COLUMN = {name: cols[0] for name, (cols, _, _) in SCHEMA.items()
             if name not in ("stueckliste.csv", "offer_positionen.csv", "transaktion_positionen.csv")}

NUMERIC = {"groesse_ml", "preis_eur_je_einheit", "menge", "einkaufspreis_gesamt_eur", "preis_brutto", "rabatt_wert",
           "versandentgelt_eur", "gratisversand_ab_eur", "erloes_brutto", "rabatt_eur", "versandkosten_eur",
           "zahlungsgebuehr_eur", "erstattung_eur", "retourkosten_eur", "werbekosten_eur"}

# Vorzeichen je Bewegung (korrektur trägt ihr Vorzeichen selbst)
SIGN = {"zugang": 1, "abfuellung_zu": 1, "abfuellung_ab": -1, "verkauf": -1, "probe_gratis": -1, "creator": -1,
        "bruch": -1, "verlust": -1, "korrektur": 1}

KUNDE_REF_RE = re.compile(r"^K-\d{4,}$")
EMAIL_RE = re.compile(r"[^\s@,;]+@[^\s@,;]+\.[a-z]{2,}", re.I)
PHONE_RE = re.compile(r"(?<![\w-])(?:\+|0)\d[\d /-]{7,}\d")
FREEFORM_PRIVACY_FILES = ("kunden.csv", "transaktionen.csv", "experimente.csv", "entscheidungen.csv")


# ---------------------------------------------------------------- Laden

def data_dir(root: pathlib.Path, brand: str) -> pathlib.Path:
    return root / brand / "commercial"


def load(directory: pathlib.Path) -> dict[str, list[dict]]:
    tables: dict[str, list[dict]] = {}
    for name in SCHEMA:
        path = directory / name
        if not path.exists():
            tables[name] = []
            continue
        with path.open(newline="", encoding="utf-8") as fh:
            tables[name] = [{k: (v or "").strip() for k, v in row.items()} for row in csv.DictReader(fh)]
    return tables


def header_of(directory: pathlib.Path, name: str) -> list[str]:
    with (directory / name).open(newline="", encoding="utf-8") as fh:
        return next(csv.reader(fh), [])


def num(value: str):
    """Zahl, UNKNOWN oder None (leer). Komma als Dezimaltrennzeichen ist erlaubt."""
    if value in ("", None):
        return None
    if value.upper() == UNKNOWN:
        return UNKNOWN
    return float(value.replace(",", "."))


# ---------------------------------------------------------------- Prüfen

def validate(t: dict[str, list[dict]]) -> tuple[list[str], list[str]]:
    """Gibt (Fehler, Hinweise) zurück. Fehler machen die Daten unbrauchbar, Hinweise zeigen Lücken."""
    errors: list[str] = []
    notes: list[str] = []

    for name, (cols, required, enums) in SCHEMA.items():
        seen: set[str] = set()
        id_col = ID_COLUMN.get(name)
        for i, row in enumerate(t.get(name, []), start=2):
            where = f"{name} Zeile {i}"
            for col in required:
                if not row.get(col):
                    errors.append(f"{where}: Pflichtfeld '{col}' leer")
            for col, allowed in enums.items():
                if row.get(col) and row[col] not in allowed:
                    errors.append(f"{where}: '{col}' = '{row[col]}' nicht erlaubt ({', '.join(allowed)})")
            for col in NUMERIC & set(row):
                try:
                    num(row[col])
                except ValueError:
                    errors.append(f"{where}: '{col}' = '{row[col]}' ist weder Zahl noch UNKNOWN")
            if id_col and row.get(id_col):
                if row[id_col] in seen:
                    errors.append(f"{where}: ID '{row[id_col]}' doppelt")
                seen.add(row[id_col])

    ids = {name: {r[col] for r in t.get(name, []) if r.get(col)} for name, col in ID_COLUMN.items()}
    stuecklisten = {r["stueckliste_id"] for r in t.get("stueckliste.csv", [])}

    def ref(name: str, row: dict, col: str, target: str, where: str) -> None:
        if row.get(col) and row[col] not in ids[target]:
            errors.append(f"{where}: '{col}' = '{row[col]}' nicht in {target}")

    for i, r in enumerate(t.get("duefte.csv", []), 2):
        ref("duefte.csv", r, "lieferant_ref", "lieferanten.csv", f"duefte.csv Zeile {i}")
    for i, r in enumerate(t.get("produkte.csv", []), 2):
        w = f"produkte.csv Zeile {i}"
        ref("produkte.csv", r, "duft_id", "duefte.csv", w)
        ref("produkte.csv", r, "quelle_produkt_id", "produkte.csv", w)
        if r.get("stueckliste_id") and r["stueckliste_id"] not in stuecklisten:
            errors.append(f"{w}: Stückliste '{r['stueckliste_id']}' fehlt in stueckliste.csv")
    for i, r in enumerate(t.get("komponenten.csv", []), 2):
        ref("komponenten.csv", r, "duft_id", "duefte.csv", f"komponenten.csv Zeile {i}")
        ref("komponenten.csv", r, "lieferant_ref", "lieferanten.csv", f"komponenten.csv Zeile {i}")
    for i, r in enumerate(t.get("stueckliste.csv", []), 2):
        ref("stueckliste.csv", r, "komponente_id", "komponenten.csv", f"stueckliste.csv Zeile {i}")

    for i, r in enumerate(t.get("bestand_bewegungen.csv", []), 2):
        w = f"bestand_bewegungen.csv Zeile {i}"
        target = "produkte.csv" if r.get("artikel_typ") == "produkt" else "komponenten.csv"
        ref("bestand_bewegungen.csv", r, "artikel_id", target, w)
        ref("bestand_bewegungen.csv", r, "transaktion_ref", "transaktionen.csv", w)
        ref("bestand_bewegungen.csv", r, "experiment_ref", "experimente.csv", w)
        m = num(r.get("menge", ""))
        if isinstance(m, float) and m < 0 and r.get("bewegung") != "korrektur":
            errors.append(f"{w}: Menge positiv erfassen, die Richtung ergibt sich aus der Bewegung")
        if r.get("bewegung") in ("abfuellung_ab", "abfuellung_zu") and not r.get("abfuellung_ref"):
            errors.append(f"{w}: Abfüllung braucht 'abfuellung_ref'")
        if r.get("bewegung") == "verkauf" and not r.get("transaktion_ref"):
            notes.append(f"{w}: Verkauf ohne transaktion_ref")
    abf: dict[str, set[str]] = {}
    for r in t.get("bestand_bewegungen.csv", []):
        if r.get("abfuellung_ref"):
            abf.setdefault(r["abfuellung_ref"], set()).add(r.get("bewegung", ""))
    for key, kinds in abf.items():
        if not {"abfuellung_ab", "abfuellung_zu"} <= kinds:
            errors.append(f"Abfüllung '{key}': braucht Abgang (abfuellung_ab) und Zugang (abfuellung_zu)")

    decisions = {r["decision_id"]: r for r in t.get("entscheidungen.csv", []) if r.get("decision_id")}
    for i, r in enumerate(t.get("entscheidungen.csv", []), 2):
        w = f"entscheidungen.csv Zeile {i}"
        if r.get("entschieden_von") and r["entschieden_von"] != "Mar":
            errors.append(f"{w}: nur Mar entscheidet (entschieden_von = 'Mar')")
        if r.get("status") == "ersetzt" and r.get("ersetzt_durch") not in decisions:
            errors.append(f"{w}: 'ersetzt' braucht ersetzt_durch mit gültiger decision_id")

    def valid_decision(key: str) -> bool:
        d = decisions.get(key)
        return bool(d) and d.get("status") == "gueltig" and d.get("entschieden_von") == "Mar"

    for i, r in enumerate(t.get("offers.csv", []), 2):
        w = f"offers.csv Zeile {i}"
        ref("offers.csv", r, "experiment_ref", "experimente.csv", w)
        if r.get("status") in ("freigegeben", "aktiv", "beendet") and not valid_decision(r.get("freigabe_ref", "")):
            errors.append(f"{w}: Status '{r['status']}' braucht freigabe_ref auf eine gültige Entscheidung von Mar")
        if r.get("rabatt_typ") in ("prozent", "betrag") and not r.get("rabatt_wert"):
            errors.append(f"{w}: Rabatt ohne rabatt_wert (UNKNOWN eintragen, wenn offen)")
    offer_pos = {r["offer_id"] for r in t.get("offer_positionen.csv", [])}
    for i, r in enumerate(t.get("offer_positionen.csv", []), 2):
        ref("offer_positionen.csv", r, "offer_id", "offers.csv", f"offer_positionen.csv Zeile {i}")
        ref("offer_positionen.csv", r, "produkt_id", "produkte.csv", f"offer_positionen.csv Zeile {i}")
    for r in t.get("offers.csv", []):
        if r.get("offer_id") and r["offer_id"] not in offer_pos:
            notes.append(f"Offer '{r['offer_id']}': keine Positionen (Bundle-BOM) in offer_positionen.csv")

    tx_pos = {r["transaktion_id"] for r in t.get("transaktion_positionen.csv", [])}
    for i, r in enumerate(t.get("transaktionen.csv", []), 2):
        w = f"transaktionen.csv Zeile {i}"
        ref("transaktionen.csv", r, "offer_id", "offers.csv", w)
        ref("transaktionen.csv", r, "experiment_id", "experimente.csv", w)
        ref("transaktionen.csv", r, "kunde_ref", "kunden.csv", w)
        if r.get("transaktion_id") and r["transaktion_id"] not in tx_pos:
            errors.append(f"{w}: keine Positionen in transaktion_positionen.csv")
    for i, r in enumerate(t.get("transaktion_positionen.csv", []), 2):
        ref("transaktion_positionen.csv", r, "transaktion_id", "transaktionen.csv", f"transaktion_positionen.csv Zeile {i}")
        ref("transaktion_positionen.csv", r, "produkt_id", "produkte.csv", f"transaktion_positionen.csv Zeile {i}")

    for i, r in enumerate(t.get("experimente.csv", []), 2):
        w = f"experimente.csv Zeile {i}"
        ref("experimente.csv", r, "offer_id", "offers.csv", w)
        ref("experimente.csv", r, "naechster_test", "experimente.csv", w)
        if r.get("decision_ref") and r["decision_ref"] not in decisions:
            errors.append(f"{w}: decision_ref '{r['decision_ref']}' nicht in entscheidungen.csv")
        if r.get("status") == "ausgewertet":
            for col in ("ergebnis", "evidenz", "learning"):
                if not r.get(col):
                    errors.append(f"{w}: ausgewertetes Experiment braucht '{col}'")

    # Datenschutz
    for i, r in enumerate(t.get("kunden.csv", []), 2):
        if r.get("kunde_ref") and not KUNDE_REF_RE.match(r["kunde_ref"]):
            errors.append(f"kunden.csv Zeile {i}: kunde_ref muss pseudonym sein (Format K-0001)")
    for name in FREEFORM_PRIVACY_FILES:
        for i, r in enumerate(t.get(name, []), 2):
            for col, value in r.items():
                if value and (EMAIL_RE.search(value) or PHONE_RE.search(value)):
                    errors.append(f"{name} Zeile {i}: '{col}' sieht nach E-Mail/Telefon aus — keine Personendaten ins Repo")
    return errors, notes


# ---------------------------------------------------------------- Rechnen (nur ableiten, nie speichern)

def cogs_by_product(t: dict[str, list[dict]]) -> dict[str, dict]:
    """COGS je Produkt aus Stückliste × Komponentenpreis. Fehlt ein Preis, ist das Ergebnis UNKNOWN."""
    komp = {r["komponente_id"]: r for r in t.get("komponenten.csv", [])}
    bom: dict[str, list[dict]] = {}
    for r in t.get("stueckliste.csv", []):
        bom.setdefault(r["stueckliste_id"], []).append(r)
    out = {}
    for p in t.get("produkte.csv", []):
        lines = bom.get(p.get("stueckliste_id", ""), [])
        total, missing = 0.0, []
        if not lines:
            missing.append("Stückliste")
        for line in lines:
            k = komp.get(line["komponente_id"], {})
            price, qty = num(k.get("preis_eur_je_einheit", "")), num(line.get("menge", ""))
            if not isinstance(price, float) or not isinstance(qty, float) or k.get("status") == UNKNOWN:
                missing.append(line["komponente_id"])
            else:
                total += price * qty
        out[p["produkt_id"]] = {"wert": None if missing else total, "offen": missing}
    return out


def stock_levels(t: dict[str, list[dict]]) -> dict[tuple[str, str, str], dict]:
    """Bestand je (artikel_typ, artikel_id, einheit) als Summe der Bewegungen. UNKNOWN-Mengen machen ihn UNKNOWN."""
    levels: dict[tuple[str, str, str], dict] = {}
    for r in t.get("bestand_bewegungen.csv", []):
        key = (r["artikel_typ"], r["artikel_id"], r["einheit"])
        entry = levels.setdefault(key, {"menge": 0.0, "unknown": False})
        m = num(r.get("menge", ""))
        if not isinstance(m, float):
            entry["unknown"] = True
            continue
        entry["menge"] += SIGN.get(r["bewegung"], 0) * m
    return levels


def source_cost_per_unit(t: dict[str, list[dict]], artikel_id: str, einheit: str):
    """Einstandspreis je Einheit eines zugegangenen Artikels (gewogener Durchschnitt aller Zugänge)."""
    menge = kosten = 0.0
    for r in t.get("bestand_bewegungen.csv", []):
        if r["artikel_id"] != artikel_id or r["einheit"] != einheit or r["bewegung"] != "zugang":
            continue
        m, k = num(r.get("menge", "")), num(r.get("einkaufspreis_gesamt_eur", ""))
        if not isinstance(m, float) or not isinstance(k, float):
            return None
        menge, kosten = menge + m, kosten + k
    return kosten / menge if menge else None


def capital(t: dict[str, list[dict]]) -> tuple[float, list[str]]:
    """Gebundenes Kapital im Bestand. Artikel ohne belegten Wert werden aufgelistet, nicht geschätzt."""
    cogs = cogs_by_product(t)
    total, unbewertet = 0.0, []
    for (typ, artikel, einheit), entry in stock_levels(t).items():
        if entry["unknown"]:
            unbewertet.append(f"{artikel} (Menge UNKNOWN)")
            continue
        if entry["menge"] == 0:
            continue
        unit = source_cost_per_unit(t, artikel, einheit)
        if unit is None and typ == "produkt" and einheit == "stueck":
            unit = cogs.get(artikel, {}).get("wert")
        if unit is None:
            unbewertet.append(artikel)
        else:
            total += entry["menge"] * unit
    return total, unbewertet


def transaction_contribution(t: dict[str, list[dict]], tx: dict, mwst: float = 0.0) -> dict:
    """Ist-Deckungsbeitrag I einer Transaktion nach Skill §5, mit echten Erstattungen statt Quote.

    Net Revenue = (Erlös brutto − Erstattung) ÷ (1 + USt)   — Erlös brutto = gezahlter Warenpreis nach Rabatt
    CM1 = Net Revenue − COGS (alle Positionen inkl. Gratis-Zugaben) − (Versandkosten − Versandentgelt netto)
          − Zahlungsgebühren − Retourkosten
    CAC wird nicht je Transaktion verteilt; CM2 entsteht erst je Experiment/Zeitraum mit den Werbekosten.
    """
    cogs = cogs_by_product(t)
    missing: list[str] = []

    def val(col: str, default_zero: bool = False):
        v = num(tx.get(col, ""))
        if isinstance(v, float):
            return v
        if v is None and default_zero:
            return 0.0
        missing.append(col)
        return 0.0

    erloes = val("erloes_brutto")
    erstattung = val("erstattung_eur", default_zero=True)
    entgelt = val("versandentgelt_eur", default_zero=True)
    versand = val("versandkosten_eur")
    gebuehr = val("zahlungsgebuehr_eur")
    retour = val("retourkosten_eur", default_zero=True)
    warenkosten = 0.0
    for p in t.get("transaktion_positionen.csv", []):
        if p["transaktion_id"] != tx["transaktion_id"]:
            continue
        c, qty = cogs.get(p["produkt_id"], {}).get("wert"), num(p.get("menge", ""))
        if c is None or not isinstance(qty, float):
            missing.append(f"COGS {p['produkt_id']}")
        else:
            warenkosten += c * qty
    netto = (erloes - erstattung) / (1 + mwst)
    cm1 = netto - warenkosten - (versand - entgelt / (1 + mwst)) - gebuehr - retour
    return {"netto": None if "erloes_brutto" in missing else netto,
            "cm1": None if missing else cm1, "offen": missing}


def experiment_chain(t: dict[str, list[dict]], exp: dict) -> dict:
    """Stand der Kette HYPOTHESE → OFFER → TEST → TRANSAKTIONEN → ERGEBNIS → LEARNING → DECISION → NÄCHSTER TEST."""
    txs = [r for r in t.get("transaktionen.csv", []) if r.get("experiment_id") == exp["experiment_id"]]
    steps = {
        "Hypothese": bool(exp.get("hypothese")),
        "Offer": bool(exp.get("offer_id")),
        "Test": exp.get("status") in ("laeuft", "ausgewertet", "abgebrochen"),
        "Transaktionen": bool(txs),
        "Ergebnis": bool(exp.get("ergebnis")),
        "Learning": bool(exp.get("learning")),
        "Decision": bool(exp.get("decision_ref")),
        "Nächster Test": bool(exp.get("naechster_test")),
    }
    return {"schritte": steps, "transaktionen": len(txs), "evidenz": exp.get("evidenz") or UNKNOWN}


def check_headers(directory: pathlib.Path) -> list[str]:
    """Jede Datei muss existieren und genau die Schema-Spalten haben (keine abgeleiteten Zusatzspalten)."""
    errors = []
    for name, (cols, _, _) in SCHEMA.items():
        path = directory / name
        if not path.exists():
            errors.append(f"{name} fehlt")
        elif header_of(directory, name) != cols:
            errors.append(f"{name}: Spalten weichen vom Schema ab")
    return errors
