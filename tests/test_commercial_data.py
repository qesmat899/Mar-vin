"""Tests für commercial.py. Alle Werte sind fiktive Testwerte (EXAMPLE) — keine Azizam-Geschäftsdaten."""

import sys
import unittest
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))

import commercial  # noqa: E402

REPO_DATA = Path(__file__).resolve().parents[1] / "playbook" / "azizam" / "commercial"


def fixture() -> dict:
    """Fiktiver Ablauf: 500-ml-Gebinde → Abfüllung → 30 ml + Proben → Bundle-Verkauf → Restbestand."""
    return {
        "lieferanten.csv": [{"lieferant_ref": "L1", "art": "parfumfabrik", "status": "RECORDED"}],
        "duefte.csv": [{"duft_id": "d1", "name": "Testduft", "lieferant_ref": "L1", "status": "RECORDED"}],
        "produkte.csv": [
            {"produkt_id": "d1-500", "typ": "quellgebinde", "duft_id": "d1", "groesse_ml": "500", "status": "RECORDED"},
            {"produkt_id": "d1-30", "typ": "verkaufsvariante", "duft_id": "d1", "groesse_ml": "30",
             "quelle_produkt_id": "d1-500", "stueckliste_id": "sv30", "status": "RECORDED"},
            {"produkt_id": "d1-p2", "typ": "probe", "duft_id": "d1", "groesse_ml": "2",
             "quelle_produkt_id": "d1-500", "stueckliste_id": "p2", "status": "RECORDED"},
        ],
        "komponenten.csv": [
            {"komponente_id": "parfum-d1", "art": "parfum", "duft_id": "d1", "einheit": "ml",
             "preis_eur_je_einheit": "0.1", "status": "RECORDED"},
            {"komponente_id": "flakon30", "art": "flakon", "einheit": "stueck", "preis_eur_je_einheit": "2",
             "status": "RECORDED"},
            {"komponente_id": "roehrchen", "art": "probenbehaelter", "einheit": "stueck",
             "preis_eur_je_einheit": "UNKNOWN", "status": "UNKNOWN"},
        ],
        "stueckliste.csv": [
            {"stueckliste_id": "sv30", "komponente_id": "parfum-d1", "menge": "30", "einheit": "ml"},
            {"stueckliste_id": "sv30", "komponente_id": "flakon30", "menge": "1", "einheit": "stueck"},
            {"stueckliste_id": "p2", "komponente_id": "parfum-d1", "menge": "2", "einheit": "ml"},
            {"stueckliste_id": "p2", "komponente_id": "roehrchen", "menge": "1", "einheit": "stueck"},
        ],
        "bestand_bewegungen.csv": [
            {"buchung_id": "b1", "datum": "2026-01-01", "artikel_typ": "produkt", "artikel_id": "d1-500",
             "bewegung": "zugang", "menge": "500", "einheit": "ml", "einkaufspreis_gesamt_eur": "50", "status": "RECORDED"},
            {"buchung_id": "b2", "datum": "2026-01-02", "artikel_typ": "produkt", "artikel_id": "d1-500",
             "bewegung": "abfuellung_ab", "menge": "64", "einheit": "ml", "abfuellung_ref": "A1", "status": "RECORDED"},
            {"buchung_id": "b3", "datum": "2026-01-02", "artikel_typ": "produkt", "artikel_id": "d1-30",
             "bewegung": "abfuellung_zu", "menge": "2", "einheit": "stueck", "abfuellung_ref": "A1", "status": "RECORDED"},
            {"buchung_id": "b4", "datum": "2026-01-02", "artikel_typ": "produkt", "artikel_id": "d1-p2",
             "bewegung": "abfuellung_zu", "menge": "2", "einheit": "stueck", "abfuellung_ref": "A1", "status": "RECORDED"},
            {"buchung_id": "b5", "datum": "2026-01-03", "artikel_typ": "produkt", "artikel_id": "d1-30",
             "bewegung": "verkauf", "menge": "1", "einheit": "stueck", "transaktion_ref": "T1", "status": "OBSERVED"},
            {"buchung_id": "b6", "datum": "2026-01-03", "artikel_typ": "produkt", "artikel_id": "d1-p2",
             "bewegung": "probe_gratis", "menge": "1", "einheit": "stueck", "transaktion_ref": "T1", "status": "OBSERVED"},
            {"buchung_id": "b7", "datum": "2026-01-04", "artikel_typ": "produkt", "artikel_id": "d1-500",
             "bewegung": "verlust", "menge": "1", "einheit": "ml", "status": "OBSERVED"},
        ],
        "offers.csv": [{"offer_id": "O1", "typ": "produkt_plus_proben", "kanal": "online", "preis_brutto": "UNKNOWN",
                        "rabatt_typ": "keiner", "status": "hypothese", "hypothese": "Proben erhöhen Wiederkauf"}],
        "offer_positionen.csv": [
            {"offer_id": "O1", "produkt_id": "d1-30", "menge": "1", "rolle": "verkauf"},
            {"offer_id": "O1", "produkt_id": "d1-p2", "menge": "1", "rolle": "gratis_zugabe"},
        ],
        "transaktionen.csv": [{"transaktion_id": "T1", "datum": "2026-01-03", "kanal": "online", "offer_id": "O1",
                               "experiment_id": "E1", "kunde_ref": "K-0001", "erloes_brutto": "30",
                               "versandentgelt_eur": "5", "versandkosten_eur": "6", "zahlungsgebuehr_eur": "1",
                               "status": "abgeschlossen"}],
        "transaktion_positionen.csv": [
            {"transaktion_id": "T1", "produkt_id": "d1-30", "menge": "1", "gratis": "nein"},
        ],
        "kunden.csv": [{"kunde_ref": "K-0001", "erstkauf_datum": "2026-01-03", "erstkanal": "online"}],
        "experimente.csv": [{"experiment_id": "E1", "hypothese": "Proben erhöhen Wiederkauf",
                             "erfolgsmetrik": "Wiederkaufrate 90 Tage", "schwelle": "festzulegen von Mar",
                             "offer_id": "O1", "status": "laeuft"}],
        "entscheidungen.csv": [],
    }


class CogsTest(unittest.TestCase):
    def test_cogs_from_bom(self):
        c = commercial.cogs_by_product(fixture())
        self.assertAlmostEqual(c["d1-30"]["wert"], 30 * 0.1 + 2)

    def test_unknown_component_makes_cogs_unknown(self):
        c = commercial.cogs_by_product(fixture())["d1-p2"]
        self.assertIsNone(c["wert"])                 # keine Untergrenze, kein Schätzwert
        self.assertEqual(c["offen"], ["roehrchen"])

    def test_product_without_bom_is_unknown(self):
        self.assertIsNone(commercial.cogs_by_product(fixture())["d1-500"]["wert"])


class InventoryTest(unittest.TestCase):
    def test_flow_from_source_container_to_rest(self):
        lv = commercial.stock_levels(fixture())
        self.assertAlmostEqual(lv[("produkt", "d1-500", "ml", "")]["menge"], 500 - 64 - 1)
        self.assertAlmostEqual(lv[("produkt", "d1-30", "stueck", "")]["menge"], 1)
        self.assertAlmostEqual(lv[("produkt", "d1-p2", "stueck", "")]["menge"], 1)

    def test_unknown_quantity_makes_stock_unknown(self):
        t = fixture()
        t["bestand_bewegungen.csv"][0]["menge"] = "UNKNOWN"
        self.assertTrue(commercial.stock_levels(t)[("produkt", "d1-500", "ml", "")]["unknown"])

    def test_capital_values_only_known_costs(self):
        cap = commercial.capital(fixture())
        self.assertAlmostEqual(cap["min"], 435 * 0.1 + 1 * 5.0)   # Gebinde zum Einstandspreis + 30 ml zu COGS
        self.assertIn("d1-p2", cap["unbewertet"])

    def test_unknown_purchase_price_is_not_estimated(self):
        t = fixture()
        t["bestand_bewegungen.csv"][0]["einkaufspreis_gesamt_eur"] = "UNKNOWN"
        self.assertIn("d1-500", commercial.capital(t)["unbewertet"])


class TransactionTest(unittest.TestCase):
    def test_contribution_with_actual_values(self):
        t = fixture()
        r = commercial.transaction_contribution(t, t["transaktionen.csv"][0])
        self.assertAlmostEqual(r["cm1"], 30 - 5 - (6 - 5) - 1)

    def test_refund_reduces_net_revenue(self):
        t = fixture()
        t["transaktionen.csv"][0].update(erstattung_eur="30", retourkosten_eur="4", status="erstattet")
        r = commercial.transaction_contribution(t, t["transaktionen.csv"][0])
        self.assertAlmostEqual(r["netto"], 0)
        self.assertAlmostEqual(r["cm1"], 0 - 5 - 1 - 1 - 4)

    def test_missing_value_makes_cm1_unknown(self):
        t = fixture()
        t["transaktionen.csv"][0]["versandkosten_eur"] = ""
        r = commercial.transaction_contribution(t, t["transaktionen.csv"][0])
        self.assertIsNone(r["cm1"])
        self.assertIn("versandkosten_eur", r["offen"])

    def test_free_sample_without_cost_makes_cm1_unknown(self):
        t = fixture()
        t["transaktion_positionen.csv"].append({"transaktion_id": "T1", "produkt_id": "d1-p2", "menge": "1",
                                                "gratis": "ja"})
        self.assertIsNone(commercial.transaction_contribution(t, t["transaktionen.csv"][0])["cm1"])


class ValidationTest(unittest.TestCase):
    def errors(self, t):
        return commercial.validate(t)[0]

    def test_fixture_is_valid(self):
        self.assertEqual(self.errors(fixture()), [])

    def test_offer_release_needs_decision_by_mar(self):
        t = fixture()
        t["offers.csv"][0]["status"] = "aktiv"
        self.assertTrue(any("freigabe_ref" in e for e in self.errors(t)))
        t["entscheidungen.csv"] = [{"decision_id": "D1", "datum": "2026-01-01", "bereich": "offer",
                                    "entscheidung": "O1 testen", "entschieden_von": "Claude",
                                    "quelle": "x", "status": "gueltig"}]
        t["offers.csv"][0]["freigabe_ref"] = "D1"
        errs = self.errors(t)
        self.assertTrue(any("nur Mar" in e for e in errs))
        self.assertTrue(any("freigabe_ref" in e for e in errs))
        t["entscheidungen.csv"][0]["entschieden_von"] = "Mar"
        self.assertEqual(self.errors(t), [])

    def test_filling_needs_both_sides(self):
        t = fixture()
        t["bestand_bewegungen.csv"] = [r for r in t["bestand_bewegungen.csv"] if r["bewegung"] != "abfuellung_ab"]
        self.assertTrue(any("Abfüllung 'A1'" in e for e in self.errors(t)))

    def test_negative_quantity_only_for_correction(self):
        t = fixture()
        t["bestand_bewegungen.csv"][4]["menge"] = "-1"
        self.assertTrue(any("Menge positiv" in e for e in self.errors(t)))

    def test_privacy(self):
        t = fixture()
        t["kunden.csv"][0]["kunde_ref"] = "Max Mustermann"
        t["transaktionen.csv"][0]["kunde_ref"] = "Max Mustermann"
        t["transaktionen.csv"][0]["notiz"] = "max@example.com"
        errs = self.errors(t)
        self.assertTrue(any("pseudonym" in e for e in errs))
        self.assertTrue(any("E-Mail" in e for e in errs))

    def test_dates_are_not_phone_numbers(self):
        t = fixture()
        t["transaktionen.csv"][0]["notiz"] = "geliefert 2026-01-03, Bestellung 12345"
        self.assertEqual(self.errors(t), [])

    def test_evaluated_experiment_needs_evidence_and_learning(self):
        t = fixture()
        t["experimente.csv"][0]["status"] = "ausgewertet"
        errs = self.errors(t)
        for col in ("ergebnis", "evidenz", "learning"):
            self.assertTrue(any(f"'{col}'" in e for e in errs))

    def test_invalid_number_is_error(self):
        t = fixture()
        t["komponenten.csv"][0]["preis_eur_je_einheit"] = "ca. 3"
        self.assertTrue(any("weder Zahl noch UNKNOWN" in e for e in self.errors(t)))


class ExperimentChainTest(unittest.TestCase):
    def test_chain_shows_open_steps(self):
        t = fixture()
        c = commercial.experiment_chain(t, t["experimente.csv"][0])
        self.assertEqual(c["transaktionen"], 1)
        self.assertFalse(c["schritte"]["Learning"])
        self.assertEqual(c["evidenz"], "UNKNOWN")


def bottles() -> dict:
    """Zwei fiktive Flaschen desselben Dufts mit unterschiedlichen Preisen, geschätzte Inventur, eine als Spanne."""
    t = {name: [] for name in commercial.SCHEMA}
    t["duefte.csv"] = [{"duft_id": "d1", "lieferanten_bezeichnung": "Fabrikname", "status": "RECORDED"}]
    t["produkte.csv"] = [{"produkt_id": "d1-500", "typ": "quellgebinde", "duft_id": "d1", "status": "RECORDED"}]
    base = {"artikel_typ": "produkt", "artikel_id": "d1-500", "einheit": "ml", "status": "RECORDED"}
    t["bestand_bewegungen.csv"] = [
        dict(base, buchung_id="z1", gebinde_id="G-1", datum="UNKNOWN", bewegung="zugang", menge="500",
             mengen_basis="nennmenge", einkaufspreis_gesamt_eur="50", preis_qualitaet="ANGABE", charge="111"),
        dict(base, buchung_id="z2", gebinde_id="G-2", datum="UNKNOWN", bewegung="zugang", menge="500",
             mengen_basis="nennmenge", einkaufspreis_gesamt_eur="UNKNOWN", preis_qualitaet="UNKNOWN", charge="UNKNOWN"),
        dict(base, buchung_id="i1", gebinde_id="G-1", datum="2026-01-10", bewegung="inventur", menge="300",
             menge_bis="325", mengen_basis="geschaetzt"),
        dict(base, buchung_id="i2", gebinde_id="G-2", datum="2026-01-10", bewegung="inventur", menge="100",
             mengen_basis="geschaetzt"),
    ]
    return t


class BottleInventoryTest(unittest.TestCase):
    def test_bottles_stay_separate(self):
        lv = commercial.stock_levels(bottles())
        self.assertIn(("produkt", "d1-500", "ml", "G-1"), lv)
        self.assertIn(("produkt", "d1-500", "ml", "G-2"), lv)

    def test_inventory_estimate_keeps_range_and_basis(self):
        g1 = commercial.stock_levels(bottles())[("produkt", "d1-500", "ml", "G-1")]
        self.assertEqual((g1["menge"], g1["menge_max"], g1["basis"]), (300, 325, "geschaetzt"))

    def test_later_movements_apply_after_inventory(self):
        t = bottles()
        t["bestand_bewegungen.csv"].append({"buchung_id": "a1", "datum": "2026-01-11", "artikel_typ": "produkt",
            "artikel_id": "d1-500", "gebinde_id": "G-2", "bewegung": "verlust", "menge": "10", "einheit": "ml",
            "status": "OBSERVED"})
        g2 = commercial.stock_levels(t)[("produkt", "d1-500", "ml", "G-2")]
        self.assertEqual(g2["menge"], 90)

    def test_capital_per_bottle_without_unknown_price(self):
        cap = commercial.capital(bottles())
        self.assertAlmostEqual(cap["min"], 300 * 0.1)        # nur G-1, Preis je ml aus eigener Flasche
        self.assertAlmostEqual(cap["max"], 325 * 0.1)
        self.assertTrue(cap["geschaetzt"])
        self.assertEqual(cap["unbewertet"], ["d1-500 G-2"])

    def test_open_items(self):
        offen = commercial.open_items(bottles())
        self.assertEqual(offen["Einkaufspreis"], ["d1-500 G-2"])
        self.assertEqual(offen["Charge"], ["d1-500 G-2"])
        self.assertEqual(len(offen["Kaufdatum"]), 2)

    def test_bottle_data_valid_and_checks(self):
        t = bottles()
        self.assertEqual(commercial.validate(t)[0], [])
        t["bestand_bewegungen.csv"][2]["menge_bis"] = "200"
        t["bestand_bewegungen.csv"][3]["datum"] = "07.10.2026"
        t["duefte.csv"][0]["lieferanten_bezeichnung"] = ""
        errs = commercial.validate(t)[0]
        self.assertTrue(any("kleiner" in e for e in errs))
        self.assertTrue(any("Inventur braucht ein Datum" in e for e in errs))
        self.assertTrue(any("'name' oder 'lieferanten_bezeichnung'" in e for e in errs))


class RepoDataTest(unittest.TestCase):
    def test_headers_match_schema(self):
        self.assertEqual(commercial.check_headers(REPO_DATA), [])

    def test_repo_data_valid(self):
        self.assertEqual(commercial.validate(commercial.load(REPO_DATA))[0], [])


if __name__ == "__main__":
    unittest.main()
