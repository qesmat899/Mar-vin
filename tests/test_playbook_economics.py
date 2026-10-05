"""Tests für die Rechenlogik in playbook.py (Definitionen: azizam-unit-economics, Abschnitt 5).

Ausführen: python3 -m unittest discover -s tests
Die Eingaben unten sind Testwerte, keine Azizam-Geschäftszahlen.
"""

import sys
import unittest
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))

import playbook  # noqa: E402

BASE = {
    "preis_brutto": 40.0, "mwst": 0.0, "cogs": 8.0, "versand_fulfillment": 6.0,
    "gebuehren_pct": 0.02, "cac_ziel": 10.0, "retouren_pct": 0.05, "kaeufe_pro_kunde": 2.0,
    "abo_rabatt_pct": 0.1, "abo_monate": 3, "geschenk_wert": 5.0, "geschenk_cogs": 2.0,
}


class UnitEconomicsTest(unittest.TestCase):
    def test_cm1_without_optional_inputs(self):
        r = playbook.unit_economics(dict(BASE))
        self.assertAlmostEqual(r["netto"], 40.0)
        self.assertAlmostEqual(r["gebuehren"], 0.8)
        self.assertAlmostEqual(r["cm1"], 40.0 - 8.0 - 6.0 - 0.8)
        self.assertEqual(set(r["nicht_erfasst"]), set(playbook.OPTIONAL_INPUTS.values()))

    def test_discount_shipping_fee_and_fixed_fee(self):
        e = dict(BASE, rabatt_eur=4.0, versandentgelt_kunde=5.0, gebuehr_fix_eur=0.35)
        r = playbook.unit_economics(e)
        self.assertAlmostEqual(r["netto"], 36.0)                     # Rabatt mindert Net Revenue
        self.assertAlmostEqual(r["versand_netto"], 1.0)              # Kosten − Entgelt
        self.assertAlmostEqual(r["gebuehren"], 41.0 * 0.02 + 0.35)   # auf gezahlten Betrag inkl. Entgelt
        self.assertAlmostEqual(r["cm1"], 36.0 - 8.0 - 1.0 - (41.0 * 0.02 + 0.35))
        self.assertEqual(r["nicht_erfasst"], [])

    def test_vat_registered_net_revenue(self):
        r = playbook.unit_economics(dict(BASE, mwst=0.19, preis_brutto=47.6))
        self.assertAlmostEqual(r["netto"], 40.0)
        self.assertAlmostEqual(r["gebuehren"], 47.6 * 0.02)

    def test_cm2_returns_and_contribution(self):
        r = playbook.unit_economics(dict(BASE))
        self.assertAlmostEqual(r["cm2"], r["cm1"] - 10.0)
        self.assertAlmostEqual(r["retouren"], r["cm1"] * 0.05)
        self.assertAlmostEqual(r["beitrag"], r["cm2"] - r["retouren"])

    def test_perspective_a_and_b(self):
        a = playbook.unit_economics(dict(BASE))
        self.assertIsNone(a["be_roas_b"])
        self.assertIsNone(a["max_cpa_b"])
        self.assertAlmostEqual(a["be_roas_a"], a["netto"] / a["cm1"])
        self.assertAlmostEqual(a["max_cac_a"], a["cm1"] - a["retouren"])
        b = playbook.unit_economics(dict(BASE), faktor=1.19)
        self.assertAlmostEqual(b["be_roas_a"], a["be_roas_a"])        # A bleibt gleich
        self.assertAlmostEqual(b["be_roas_b"], 1.19 * a["be_roas_a"])
        self.assertAlmostEqual(b["max_cpa_b"], a["max_cac_a"] / 1.19)

    def test_no_break_even_when_cm1_not_positive(self):
        r = playbook.unit_economics(dict(BASE, cogs=40.0), faktor=1.19)
        self.assertEqual(r["be_roas_a"], float("inf"))
        self.assertEqual(r["be_roas_b"], float("inf"))

    def test_ltv_is_cm1_times_purchases(self):
        r = playbook.unit_economics(dict(BASE))
        self.assertAlmostEqual(r["ltv"], r["cm1"] * 2.0)


class OffersTest(unittest.TestCase):
    def test_single_purchase_matches_unit_economics(self):
        single = playbook.offers(dict(BASE))[0]
        ue = playbook.unit_economics(dict(BASE))
        for key in ("netto", "cm1", "cm2", "beitrag", "max_cac_a"):
            self.assertAlmostEqual(single[key], ue[key], msg=key)

    def test_subscription_charges_shipping_fee_per_delivery(self):
        e = dict(BASE, versandentgelt_kunde=5.0, gebuehr_fix_eur=0.3)
        abo = playbook.offers(e)[1]
        self.assertAlmostEqual(abo["versandentgelt"], 15.0)
        self.assertAlmostEqual(abo["gebuehren"], (40.0 * 0.9 * 3 + 15.0) * 0.02 + 0.9)

    def test_offers_perspective_b(self):
        rows = playbook.offers(dict(BASE), faktor=1.19)
        for r in rows:
            self.assertAlmostEqual(r["max_cpa_b"], r["max_cac_a"] / 1.19)


class VariantsTest(unittest.TestCase):
    def test_private_channel_has_no_shipping_or_fees(self):
        brand = {"economics": dict(BASE), "varianten": [
            {"name": "50 ml", "preis_brutto": 40.0, "preis_privat": 35.0, "cogs": 8.0}]}
        rows = playbook.variant_rows(brand)
        privat = [r for r in rows if r["kanal"] == "privat"][0]
        self.assertAlmostEqual(privat["gebuehren"], 0.0)
        self.assertAlmostEqual(privat["versand_netto"], 0.0)
        self.assertAlmostEqual(privat["cm1"], 35.0 - 8.0)


class BrandFilesTest(unittest.TestCase):
    """Die echten brand.json-Dateien laden und rechnen sich ohne Fehler (keine Werteprüfung)."""

    def test_all_brands_compute(self):
        for slug in playbook.list_brands():
            brand = playbook.load_brand(slug)
            r = playbook.unit_economics(dict(brand["economics"]))
            self.assertIn("cm1", r)
            playbook.offers(dict(brand["economics"]))
            playbook.variant_rows(brand)


if __name__ == "__main__":
    unittest.main()
