"""Tests für die Repo-Hygiene (hygiene.py). Arbeiten in einem temporären Ordner, nie im echten Repo.

Ausführen: python3 -m unittest discover -s tests
"""

import pathlib
import sys
import tempfile
import unittest

ROOT = pathlib.Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT))

import hygiene  # noqa: E402

BEWEGUNGEN = "buchung_id,gebinde_id\nB-1,G-01\nB-2,G-01\nB-3,G-02\n"
DUEFTE = "duft_id,name\na,A\nb,B\nc,C\n"
LEDGER = "decision_id,status\nD-001,decided\n"


class HygieneTest(unittest.TestCase):
    def setUp(self):
        self._tmp = tempfile.TemporaryDirectory()
        self.root = pathlib.Path(self._tmp.name)
        self.write("playbook/azizam/commercial/bestand_bewegungen.csv", BEWEGUNGEN)
        self.write("playbook/azizam/commercial/duefte.csv", DUEFTE)
        self.write("playbook/azizam/commercial/entscheidungen.csv", LEDGER)
        self.write("SYNC.md", "# SYNC\n\nAktuell: 2 Gebinde, 3 Düfte.\n")

    def tearDown(self):
        self._tmp.cleanup()

    def write(self, path, text):
        p = self.root / path
        p.parent.mkdir(parents=True, exist_ok=True)
        p.write_text(text, encoding="utf-8")

    def run_check(self):
        return hygiene.run(self.root, hygiene.tracked_files(self.root))

    def actions(self, r, path):
        return {a for a, p, _ in r.findings if p == path}

    def test_clean_repo_passes(self):
        r = self.run_check()
        self.assertEqual(r.conflicts, [])
        self.assertFalse(r.failed)
        self.assertEqual(r.files["SYNC.md"][0], "ACTIVE")

    def test_temp_file_is_safe_delete_candidate_and_fails(self):
        self.write("notes.bak", "x\n")
        self.write("playbook/azizam/output/antwort.md", "x\ny\nz\n")
        r = self.run_check()
        self.assertEqual(r.files["notes.bak"][0], "DELETE_CANDIDATE")
        self.assertIn(hygiene.SICHER, self.actions(r, "playbook/azizam/output/antwort.md"))
        self.assertTrue(r.failed)

    def test_unregistered_note_and_report_are_temporary_and_only_proposed(self):
        self.write("arbeitsnotiz.md", "a\nb\nc\n")
        self.write("bestandsbild-2026-10-07.md", "a\nb\nc\n")
        self.write("irgendwas.md", "a\nb\nc\n")
        r = self.run_check()
        for path in ("arbeitsnotiz.md", "bestandsbild-2026-10-07.md", "irgendwas.md"):
            self.assertEqual(r.files[path][0], "TEMPORARY")
            self.assertEqual(self.actions(r, path), {hygiene.PRUEFEN})
        self.assertFalse(r.failed)                  # unsicher → Vorschlag, kein Abbruch
        self.assertTrue((self.root / "arbeitsnotiz.md").exists())   # nie gelöscht

    def test_older_dated_report_is_superseded(self):
        self.write("AZIZAM-Boss-Status-2026-10-05.pdf", "pdf\n")
        self.write("AZIZAM-Boss-Status-2026-11-02.pdf", "pdf neu\n")
        r = self.run_check()
        self.assertEqual(r.files["AZIZAM-Boss-Status-2026-10-05.pdf"][0], "SUPERSEDED")
        self.assertEqual(r.files["AZIZAM-Boss-Status-2026-11-02.pdf"][0], "REFERENCE")

    def test_empty_file(self):
        self.write("playbook/templates/leer.md", "")
        r = self.run_check()
        self.assertIn(hygiene.PRUEFEN, self.actions(r, "playbook/templates/leer.md"))

    def test_identical_files_and_repeated_paragraphs(self):
        self.write("playbook/templates/a.md", "Zeile 1\nZeile 2\n")
        self.write("playbook/templates/b.md", "Zeile 1\nZeile 2\n")
        absatz = "Dieser Absatz ist lang. " * 15
        for n in range(3):
            self.write(f"playbook/azizam/kap{n}.md", f"# Kap {n}\n\n{absatz}\n\nEigenes {n}.\n")
        r = self.run_check()
        texts = " ".join(g for _, _, g in r.findings)
        self.assertIn("identischer Inhalt wie playbook/templates/b.md", texts)
        self.assertIn("gleicher Absatz in 3 Dateien", texts)

    def test_header_only_csv_templates_are_not_duplicates(self):
        self.write("playbook/templates/x.csv", "a,b\n")
        self.write("playbook/azizam/x.csv", "a,b\n")
        r = self.run_check()
        self.assertFalse(any("identischer Inhalt" in g for _, _, g in r.findings))

    def test_stock_numbers_outside_inventory_are_superseded(self):
        self.write("playbook/azizam/notiz-bestand.md", "x\ny\nG-01 Velvet Vanilla 570 ml\n")
        r = self.run_check()
        self.assertIn(hygiene.ERSETZT, self.actions(r, "playbook/azizam/notiz-bestand.md"))

    def test_count_conflict_but_not_in_log_or_historic_lines(self):
        self.write("SYNC.md", "# SYNC\n\nAktuell: 5 Gebinde.\n- **2026-10-01 [Code]** damals 9 Düfte\n"
                              "Alte Website zeigte 7 Düfte.\n")
        r = self.run_check()
        self.assertEqual(len(r.conflicts), 1)
        self.assertIn("5 Gebinde", r.conflicts[0])
        self.assertTrue(r.failed)

    def test_unknown_decision_reference(self):
        self.write("playbook/KONTEXT-EXPORT.md", "a\nsiehe D-001 und D-007\nc\n")
        r = self.run_check()
        self.assertEqual(len(r.conflicts), 1)
        self.assertIn("D-007", r.conflicts[0])

    def test_broken_link(self):
        self.write("playbook/azizam/kapitel.md", "a\n[da](../templates/fehlt.md) und `playbook/azizam/kapitel.md`\nc\n")
        r = self.run_check()
        self.assertEqual(len(r.conflicts), 1)
        self.assertIn("fehlt.md", r.conflicts[0])

    def test_sync_too_long_and_done_tasks(self):
        log = "".join(f"- **2026-10-{d:02d} [Code]** Eintrag\n" for d in range(1, 13))
        self.write("SYNC.md", "# SYNC\n| Code | Aufgabe | erledigt |\n" + log + "x\n" * 150)
        r = self.run_check()
        texts = " ".join(g for _, p, g in r.findings if p == "SYNC.md")
        self.assertIn("12 Log-Einträge", texts)
        self.assertIn("erledigte Aufgabe", texts)
        self.assertIn("Zeilen", texts)

    def test_render_lists_all_categories_and_never_writes(self):
        before = sorted(p for p in self.root.rglob("*"))
        out = hygiene.render(self.run_check())
        for key in hygiene.LIFECYCLE + ("CONFLICTS",):
            self.assertIn(f"{key}:", out)
        self.assertEqual(before, sorted(p for p in self.root.rglob("*")))


class RealRepoTest(unittest.TestCase):
    """Das echte Repo hat keine Widersprüche und keine temporären Dateien."""

    def test_repo_is_clean(self):
        r = hygiene.run(ROOT)
        self.assertEqual(r.conflicts, [])
        self.assertFalse(r.failed, hygiene.render(r))
        unregistered = [p for p, (_, zweck, _) in r.files.items() if zweck == "ohne Zweck-Eintrag"]
        self.assertEqual(unregistered, [], "Dateien ohne Lifecycle-Eintrag in hygiene.REGISTRY")


if __name__ == "__main__":
    unittest.main()
