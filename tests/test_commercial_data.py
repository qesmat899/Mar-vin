"""Tests für die Commercial-Daten (playbook/azizam/commercial) und `playbook.py daten`.

Ausführen: python3 -m unittest discover -s tests
Die Tabellen in den Tests sind Testdaten, keine Azizam-Bestände oder -Verkäufe.
"""

import sys
import unittest
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))

import playbook  # noqa: E402


def empty_tables():
    return {name: [] for name in playbook.COMMERCIAL_SCHEMA}


def sample_tables():
    t = empty_tables()
    t["komponenten.csv"] = [
        {"komponente_id": "parfum-ml", "preis_eur_je_einheit": "0.1", "status": "RECORDED", "einheit": "ml"},
        {"komponente_id": "flakon", "preis_eur_je_einheit": "2", "status": "ASSUMPTION", "einheit": "stueck"},
        {"komponente_id": "kappe", "preis_eur_je_einheit": "", "status": "UNKNOWN", "einheit": "stueck"},
    ]
    t["stueckliste.csv"] = [
        {"stueckliste_id": "g500", "komponente_id": "parfum-ml", "menge": "500", "einheit": "ml"},
        {"stueckliste_id": "v30", "komponente_id": "parfum-ml", "menge": "30", "einheit": "ml"},
        {"stueckliste_id": "v30", "komponente_id": "flakon", "menge": "1", "einheit": "stueck"},
        {"stueckliste_id": "v30k", "komponente_id": "parfum-ml", "menge": "30", "einheit": "ml"},
        {"stueckliste_id": "v30k", "komponente_id": "kappe", "menge": "1", "einheit": "stueck"},
    ]
    base = {"duft": "Test", "produktversion": "v0", "lieferant_ref": "x", "lebenszyklus": "idee",
            "status": "RECORDED", "quelle": "Test", "stand": "2026-10-05", "notiz": ""}
    t["produkte.csv"] = [
        dict(base, produkt_id="t-500", typ="quellgebinde", groesse_ml="500", quelle_produkt_id="", stueckliste_id="g500"),
        dict(base, produkt_id="t-30", typ="verkaufsvariante", groesse_ml="30", quelle_produkt_id="t-500", stueckliste_id="v30"),
        dict(base, produkt_id="t-30k", typ="verkaufsvariante", groesse_ml="30", quelle_produkt_id="t-500", stueckliste_id="v30k"),
    ]
    return t


class CogsTest(unittest.TestCase):
    def test_complete_bill_of_materials(self):
        c = playbook.derived_cogs(sample_tables())
        self.assertAlmostEqual(c["t-500"]["wert"], 50.0)
        self.assertTrue(c["t-30"]["vollstaendig"])
        self.assertAlmostEqual(c["t-30"]["wert"], 5.0)
        self.assertEqual(c["t-30"]["status"], "ASSUMPTION")   # schlechtester Status der Eingaben

    def test_missing_price_makes_cogs_unknown(self):
        c = playbook.derived_cogs(sample_tables())["t-30k"]
        self.assertFalse(c["vollstaendig"])
        self.assertEqual(c["status"], "UNKNOWN")
        self.assertEqual(c["offen"], ["kappe"])
        self.assertAlmostEqual(c["wert"], 3.0)                 # nur Untergrenze


class StockTest(unittest.TestCase):
    def test_bulk_filling_and_sale(self):
        t = sample_tables()
        t["bestand.csv"] = [
            {"buchung_id": "b1", "artikel_id": "t-500", "bewegung": "eingang", "menge": "500", "einheit": "ml"},
            {"buchung_id": "b2", "artikel_id": "t-500", "bewegung": "abfuellung_entnahme", "menge": "-95", "einheit": "ml", "abfuellung_ref": "a1"},
            {"buchung_id": "b3", "artikel_id": "t-30", "bewegung": "abfuellung_zugang", "menge": "3", "einheit": "stueck", "abfuellung_ref": "a1"},
            {"buchung_id": "b4", "artikel_id": "t-30", "bewegung": "verkauf", "menge": "-1", "einheit": "stueck"},
        ]
        levels = playbook.stock_levels(t)
        self.assertAlmostEqual(levels[("t-500", "ml")], 405.0)
        self.assertAlmostEqual(levels[("t-30", "stueck")], 2.0)


class ValidationTest(unittest.TestCase):
    def test_sample_is_valid(self):
        self.assertEqual(playbook.validate_commercial(sample_tables()), [])

    def test_unknown_reference_is_error(self):
        t = sample_tables()
        t["bestand.csv"] = [{"buchung_id": "b1", "artikel_id": "gibt-es-nicht", "bewegung": "eingang", "menge": "1", "einheit": "stueck"}]
        self.assertTrue(any("gibt-es-nicht" in e for e in playbook.validate_commercial(t)))

    def test_invalid_enum_is_error(self):
        t = sample_tables()
        t["produkte.csv"][0]["typ"] = "flasche"
        self.assertTrue(any("typ='flasche'" in e for e in playbook.validate_commercial(t)))

    def test_active_offer_needs_approval(self):
        t = sample_tables()
        t["offers.csv"] = [{"offer_id": "o1", "typ": "einzel", "kanal": "online", "rabatt_typ": "", "status": "aktiv", "freigabe_ref": ""}]
        self.assertTrue(any("ohne freigabe_ref" in e for e in playbook.validate_commercial(t)))

    def test_personal_data_is_rejected(self):
        t = sample_tables()
        t["kunden.csv"] = [{"kunde_ref": "K-0001", "erstkanal": "privat", "notiz": "max@example.com"}]
        t["transaktionen.csv"] = [{"transaktion_id": "T1", "kanal": "privat", "quelle": "organisch", "neukunde": "",
                                   "kunde_ref": "K-0001", "notiz": "Tel. 0151 2345678"}]
        errors = playbook.validate_commercial(t)
        self.assertTrue(any("kunden.csv" in e and "personenbezogen" in e for e in errors))
        self.assertTrue(any("transaktionen.csv" in e and "personenbezogen" in e for e in errors))

    def test_dates_and_ids_are_not_personal_data(self):
        t = sample_tables()
        t["kunden.csv"] = [{"kunde_ref": "K-0001", "erstkauf_datum": "2026-10-05", "erstkanal": "privat", "notiz": "Kauf 2026-10-05"}]
        self.assertEqual(playbook.validate_commercial(t), [])

    def test_decision_must_be_confirmed_by_mar(self):
        t = sample_tables()
        t["entscheidungen.csv"] = [{"decision_id": "D1", "evidence_quality": "LOW", "confidence": "LOW", "bestaetigt_von": "Claude"}]
        self.assertTrue(any("bestaetigt_von" in e for e in playbook.validate_commercial(t)))


class RepositoryDataTest(unittest.TestCase):
    """Die echten Dateien im Repo sind strukturell gültig."""

    def test_azizam_commercial_files(self):
        brand = playbook.load_brand("azizam")
        tables, errors = playbook.load_commercial(brand)
        self.assertEqual(errors, [])
        self.assertEqual(playbook.validate_commercial(tables), [])

    def test_no_stored_derived_metrics(self):
        cols = set()
        for spalten, _ in playbook.COMMERCIAL_SCHEMA.values():
            cols.update(spalten)
        for derived in ("cogs", "cm1", "cm2", "bestand", "kapital", "ltv", "aov"):
            self.assertNotIn(derived, cols)


if __name__ == "__main__":
    unittest.main()
