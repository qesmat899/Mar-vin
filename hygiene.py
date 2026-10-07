"""Repo-Hygiene und Lifecycle für Azizam: prüft, löscht nie.

Grundsatz: Azizam optimiert nicht die Menge seiner Dokumentation, sondern die Qualität seiner autoritativen
Informationen. Jede Information hat genau einen autoritativen Ort (SOURCES). Jede Datei braucht einen Zweck
(LIFECYCLE); eine Datei ohne Eintrag wird gemeldet.

Aufruf: python3 playbook.py hygiene [--alle]
Die Prüfung schreibt keine Datei und löscht nichts. Sie liefert Status und einen Cleanup-Vorschlag;
entfernt wird erst nach Prüfung (eindeutig temporäre Dateien) bzw. nach Mars Freigabe (alles andere).
"""

from __future__ import annotations

import csv
import fnmatch
import hashlib
import os
import pathlib
import re
import subprocess
from dataclasses import dataclass, field

LIFECYCLE = ("ACTIVE", "REFERENCE", "TEMPORARY", "SUPERSEDED", "ARCHIVE", "DELETE_CANDIDATE")

# Was am Ende mit einem Befund passiert. Nichts davon geschieht automatisch.
SICHER = "sicher entfernbar"    # eindeutig temporär/generiert, keine produktiven Daten
ERSETZT = "ersetzt"             # Information liegt aktuell an der autoritativen Stelle
PRUEFEN = "prüfen"              # könnte noch relevant sein → Mar entscheidet
BEHALTEN = "behalten"

# Autoritative Orte (Source of Truth). Informationen von hier werden anderswo nur verwiesen, nicht kopiert.
SOURCES = {
    "Bestand, Gebinde, Einkaufspreise": "playbook/azizam/commercial/bestand_bewegungen.csv",
    "Produkt- und Duftstammdaten": "playbook/azizam/commercial/duefte.csv, produkte.csv",
    "kommerzielle Entscheidungen": "playbook/azizam/commercial/entscheidungen.csv",
    "aktueller Übergabestatus": "SYNC.md",
    "Regeln und Governance": "CLAUDE.md, CLAUDE-MASTER.md, .claude/skills/azizam-*",
    "Berechnungslogik": "playbook.py, commercial.py, hygiene.py",
}

# Lifecycle je Datei (erster passender Eintrag gilt). Neue Dateien bekommen hier einen Eintrag mit Zweck.
# (Muster, Lifecycle, Zweck, ersetzt durch)
REGISTRY: list[tuple[str, str, str, str]] = [
    ("SYNC.md", "ACTIVE", "aktueller Übergabestatus Chat/Code", ""),
    ("CLAUDE.md", "ACTIVE", "Projektregeln für Claude", ""),
    ("CLAUDE-MASTER.md", "ACTIVE", "Wissensbasis: wie Claude für Azizam arbeitet", ""),
    ("BUSINESS-CONTEXT.md", "ACTIVE", "Profil für das Small-Business-Plugin", ""),
    ("ARBEITSWEISE.md", "ACTIVE", "Werkzeug-Kompass", ""),
    ("AI-REVIEW-CONTRACT.md", "REFERENCE", "Schnittstelle optionaler AI Review", ""),
    ("AZIZAM-Boss-Status-*.pdf", "REFERENCE", "bewusst erzeugter Management-Bericht (nur der neueste)", ""),
    ("playbook.py", "ACTIVE", "Werkzeug: Rechner, Prüfungen", ""),
    ("commercial.py", "ACTIVE", "Logik der Commercial-Daten", ""),
    ("hygiene.py", "ACTIVE", "Repo-Hygiene und Lifecycle", ""),
    ("tests/*.py", "ACTIVE", "Tests", ""),
    (".gitignore", "ACTIVE", "hält Generiertes aus dem Repo", ""),
    (".claude/settings.json", "ACTIVE", "Hooks", ""),
    (".claude/hooks/*", "ACTIVE", "Sessionstart/-ende", ""),
    (".claude/skills/*", "ACTIVE", "Skills", ""),
    ("playbook/azizam/commercial/*", "ACTIVE", "Commercial-Daten (Source of Truth) und ihre Regeln", ""),
    ("playbook/KONTEXT-EXPORT.md", "ACTIVE", "belegte Fakten und Entscheidungen, Einstieg", ""),
    ("playbook/azizam/brand.json", "ACTIVE", "Rechner-Eingaben (Status je Wert in _status)", ""),
    ("playbook/azizam/brand-briefing.md", "ACTIVE", "Marke und Verbotsliste", ""),
    ("playbook/azizam/SYSTEM-AUFBAU.md", "ACTIVE", "Aufbauplan des Systems", ""),
    ("playbook/azizam/swipe-file.md", "ACTIVE", "Kundenzitate (wörtlich, mit Quelle)", ""),
    ("playbook/azizam/creator-outreach.csv", "ACTIVE", "Creator-Tracking (noch leer)", ""),
    ("playbook/azizam/*", "REFERENCE", "Playbook-Umsetzung (Markt, Personas, Angles, Recht …)", ""),
    ("playbook/SYSTEM.md", "REFERENCE", "Playbook auf einer Seite", ""),
    ("playbook/README.md", "REFERENCE", "Übersicht Playbook-Ordner", ""),
    ("playbook/prompts.md", "REFERENCE", "Prompt-Vorlagen für playbook.py prompt", ""),
    ("playbook/templates/*", "REFERENCE", "Vorlagen", ""),
    ("docs/*", "REFERENCE", "Original-Playbook und PDF-Build", ""),
    ("frontend/*", "REFERENCE", "3D-Flakon-Komponenten (warten auf Flakon)", ""),
]

# Eindeutig temporär oder generiert: darf nicht dauerhaft im Repo liegen.
TEMP_PATTERNS = ("*.tmp", "*.bak", "*.orig", "*.swp", "*~", ".DS_Store", "*/.DS_Store", "__pycache__/*",
                 "*/__pycache__/*", "*.pyc", "playbook-export.md", "docs/_playbook.html", "playbook/*/output/*",
                 "tmp/*", "scratch/*", "*/scratch/*")
# Name klingt nach Arbeitsnotiz oder Zwischenstand.
NOTE_RE = re.compile(r"(notiz|notes?|todo|scratch|entwurf|draft|wip|zwischenstand|temp|kopie|copy|_old|-alt\b|test-?lauf)",
                     re.I)
# Name klingt nach Bericht/Statusreport (Arbeitsberichte sind grundsätzlich temporär).
REPORT_RE = re.compile(r"(report|bericht|status|analyse|auswertung|bestandsbild|uebersicht|übersicht)", re.I)
DATED_RE = re.compile(r"(\d{4}-\d{2}-\d{2})")

LOG_LINE_RE = re.compile(r"^\s*-\s+\*\*\d{4}-\d{2}-\d{2}")
# Zeilen, die ausdrücklich Historisches beschreiben, werden nicht gegen den aktuellen Stand geprüft.
HISTORIC_RE = re.compile(r"(`OUTDATED`|historisch|alte[nr]? Website|entfernt|nicht mehr Teil)", re.I)
COUNT_RE = re.compile(r"\b(\d+)\s+(Gebinde|Düfte)\b")
GEBINDE_ML_RE = re.compile(r"\bG-\d{2}\b.*?\b\d[\d.,]*\s?ml\b")
DECISION_RE = re.compile(r"\bD-\d{3}\b")
PATH_TOKEN_RE = re.compile(r"`([^`\s]+\.(?:md|py|csv|json|pdf|sh|tsx|css|html))`|\]\(([^)\s#]+)\)")

# Dateien, deren Zählangaben (Gebinde/Düfte) zum Datenstand passen müssen (Log-Einträge ausgenommen).
COUNT_MIRRORS = ("SYNC.md", "playbook/azizam/commercial/README.md", "playbook/KONTEXT-EXPORT.md")
SYNC_MAX_LINES = 150
SYNC_MAX_LOG = 10


@dataclass
class Report:
    files: dict[str, tuple[str, str, str]] = field(default_factory=dict)   # path → (lifecycle, zweck, ersetzt durch)
    findings: list[tuple[str, str, str]] = field(default_factory=list)     # (aktion, pfad, grund)
    conflicts: list[str] = field(default_factory=list)

    def add(self, aktion: str, path: str, grund: str) -> None:
        if (aktion, path, grund) not in self.findings:
            self.findings.append((aktion, path, grund))

    def by_lifecycle(self) -> dict[str, list[str]]:
        out = {k: [] for k in LIFECYCLE}
        for path, (lc, _, _) in sorted(self.files.items()):
            out.setdefault(lc, []).append(path)
        return out

    @property
    def failed(self) -> bool:
        return bool(self.conflicts) or any(a == SICHER for a, _, _ in self.findings)


# ---------------------------------------------------------------- Dateien

def tracked_files(root: pathlib.Path) -> list[str]:
    """Versionierte und neue, nicht ignorierte Dateien (git ls-files); ohne Git alle Dateien außer .git."""
    try:
        out = subprocess.run(["git", "ls-files", "--cached", "--others", "--exclude-standard"], cwd=root, capture_output=True, text=True, check=True).stdout
        files = [f for f in out.splitlines() if f and (root / f).exists()]
        if files:
            return files
    except (OSError, subprocess.CalledProcessError):
        pass
    result = []
    for dirpath, dirnames, filenames in os.walk(root):
        dirnames[:] = [d for d in dirnames if d != ".git"]
        for name in filenames:
            result.append(str((pathlib.Path(dirpath) / name).relative_to(root)).replace(os.sep, "/"))
    return sorted(result)


def _match(path: str, pattern: str) -> bool:
    if pattern.endswith("/*"):
        return path.startswith(pattern[:-1]) if "*" not in pattern[:-2] else fnmatch.fnmatch(path, pattern + "*")
    return fnmatch.fnmatch(path, pattern)


def classify(path: str) -> tuple[str, str, str] | None:
    for pattern, lc, zweck, ersetzt in REGISTRY:
        if _match(path, pattern):
            return lc, zweck, ersetzt
    return None


def _read(root: pathlib.Path, path: str) -> str:
    try:
        return (root / path).read_text(encoding="utf-8")
    except (UnicodeDecodeError, OSError):
        return ""


def _is_text(path: str) -> bool:
    return path.endswith((".md", ".py", ".csv", ".json", ".sh", ".tsx", ".css", ".html", ".txt"))


# ---------------------------------------------------------------- Prüfungen

def check_files(root: pathlib.Path, files: list[str], r: Report) -> None:
    """Lifecycle zuordnen; temporäre, Notiz-, Report- und leere Dateien erkennen (Prüfungen 2, 4, 5, 6, 10)."""
    reports: dict[str, list[tuple[str, str]]] = {}
    for path in files:
        name = pathlib.PurePosixPath(path).name
        if any(_match(path, p) for p in TEMP_PATTERNS):
            r.files[path] = ("DELETE_CANDIDATE", "temporär/generiert", "")
            r.add(SICHER, path, "temporäre oder generierte Datei liegt im Repo")
            continue
        entry = classify(path)
        if entry is None:
            if NOTE_RE.search(name):
                r.files[path] = ("TEMPORARY", "Arbeitsnotiz/Zwischenstand", "")
                r.add(PRUEFEN, path, "sieht nach Arbeitsnotiz/Zwischenstand aus; Inhalt an die autoritative Stelle, dann entfernen")
            elif REPORT_RE.search(name):
                r.files[path] = ("TEMPORARY", "Arbeitsbericht", "")
                r.add(PRUEFEN, path, "Arbeitsbericht ohne dauerhaften Zweck; Zahlen kommen aus den Daten, nicht aus Reports")
            else:
                r.files[path] = ("TEMPORARY", "ohne Zweck-Eintrag", "")
                r.add(PRUEFEN, path, "kein Lifecycle-Eintrag in hygiene.py REGISTRY: Zweck festlegen oder entfernen")
        else:
            r.files[path] = entry
            lc, _, ersetzt = entry
            if lc == "SUPERSEDED":
                r.add(ERSETZT, path, f"ersetzt durch {ersetzt}; Verweise umstellen, dann archivieren oder entfernen")
            elif lc in ("TEMPORARY", "DELETE_CANDIDATE"):
                r.add(PRUEFEN, path, f"Lifecycle {lc}")
        m = DATED_RE.search(name)
        if m and (REPORT_RE.search(name) or entry is not None):
            stem = name.replace(m.group(1), "{datum}")
            reports.setdefault(str(pathlib.PurePosixPath(path).parent / stem), []).append((m.group(1), path))
        full = root / path
        if full.is_file() and _is_text(path):
            text = _read(root, path)
            nonblank = [l for l in text.splitlines() if l.strip()]
            if not nonblank:
                r.add(PRUEFEN, path, "leere Datei")
            elif path.endswith(".md") and len(nonblank) < 3:
                r.add(PRUEFEN, path, "praktisch leer (unter 3 Zeilen)")
        elif full.is_file() and full.stat().st_size == 0:
            r.add(PRUEFEN, path, "leere Datei")
    # Datierte Reports mit gleichem Namen: nur der neueste bleibt aktuell.
    for group in reports.values():
        if len(group) < 2:
            continue
        for _, path in sorted(group)[:-1]:
            r.files[path] = ("SUPERSEDED", "älterer datierter Bericht", sorted(group)[-1][1])
            r.add(ERSETZT, path, f"älterer Stand; neuester ist {sorted(group)[-1][1]}")


def check_duplicates(root: pathlib.Path, files: list[str], r: Report) -> None:
    """Prüfung 1: identische Dateien und identische längere Absätze in mehreren Markdown-Dateien."""
    hashes: dict[str, list[str]] = {}
    for path in files:
        full = root / path
        if not full.is_file():
            continue
        data = full.read_bytes()
        if data.count(b"\n") <= 1:      # leere Vorlagen (nur Kopfzeile) sind gewollt gleich
            continue
        hashes.setdefault(hashlib.sha256(data).hexdigest(), []).append(path)
    for paths in hashes.values():
        if len(paths) > 1:
            r.add(PRUEFEN, paths[0], "identischer Inhalt wie " + ", ".join(paths[1:]))

    seen: dict[str, set[str]] = {}
    for path in files:
        if not path.endswith(".md") or path.startswith((".claude/skills/", "docs/")):
            continue
        for block in re.split(r"\n\s*\n", _read(root, path)):
            norm = " ".join(block.split())
            if len(norm) >= 300:
                seen.setdefault(norm, set()).add(path)
    for norm, paths in seen.items():
        if len(paths) > 2:
            r.add(PRUEFEN, ", ".join(sorted(paths)),
                  f"gleicher Absatz in {len(paths)} Dateien („{norm[:50]}…“); einmal autoritativ, sonst verweisen")


def check_superseded_numbers(root: pathlib.Path, files: list[str], r: Report) -> None:
    """Prüfungen 3 und 9: Bestandszahlen je Gebinde außerhalb der Commercial-Daten."""
    for path in files:
        if not path.endswith(".md") or path.startswith(("playbook/azizam/commercial/", ".claude/skills/", "docs/")):
            continue
        hits = [i + 1 for i, line in enumerate(_read(root, path).splitlines()) if GEBINDE_ML_RE.search(line)]
        if hits:
            r.add(ERSETZT, path, f"Bestandszahlen je Gebinde (Zeile {', '.join(map(str, hits))}); "
                  "autoritativ ist bestand_bewegungen.csv, hier nur verweisen")


def _data_counts(root: pathlib.Path) -> dict[str, int] | None:
    d = root / "playbook/azizam/commercial"
    if not (d / "bestand_bewegungen.csv").exists() or not (d / "duefte.csv").exists():
        return None
    with open(d / "bestand_bewegungen.csv", encoding="utf-8", newline="") as fh:
        gebinde = {row.get("gebinde_id", "") for row in csv.DictReader(fh)} - {""}
    with open(d / "duefte.csv", encoding="utf-8", newline="") as fh:
        duefte = sum(1 for _ in csv.DictReader(fh))
    return {"Gebinde": len(gebinde), "Düfte": duefte}


def _decisions(root: pathlib.Path) -> set[str] | None:
    p = root / "playbook/azizam/commercial/entscheidungen.csv"
    if not p.exists():
        return None
    with open(p, encoding="utf-8", newline="") as fh:
        return {row.get("decision_id", "") for row in csv.DictReader(fh)}


def check_conflicts(root: pathlib.Path, files: list[str], r: Report) -> None:
    """Prüfung 7: Widersprüche zwischen Source of Truth und den Dateien, die sie zusammenfassen."""
    counts = _data_counts(root)
    if counts:
        for path in COUNT_MIRRORS:
            if path not in files:
                continue
            for i, line in enumerate(_read(root, path).splitlines(), 1):
                if LOG_LINE_RE.match(line) or HISTORIC_RE.search(line):
                    continue
                for n, what in COUNT_RE.findall(line):
                    if int(n) != counts[what]:
                        r.conflicts.append(f"{path}:{i}: „{n} {what}“, Daten: {counts[what]} {what}")
    known = _decisions(root)
    if known is not None:
        for path in files:
            if not path.endswith(".md") or path.startswith((".claude/skills/", "docs/")):
                continue
            for i, line in enumerate(_read(root, path).splitlines(), 1):
                for d in DECISION_RE.findall(line):
                    if d not in known:
                        r.conflicts.append(f"{path}:{i}: verweist auf {d}, im Ledger nicht vorhanden")


def check_links(root: pathlib.Path, files: list[str], r: Report) -> None:
    """Prüfung 8: Dokumentation verweist auf Dateien, die es nicht mehr gibt."""
    existing = set(files)
    names = {pathlib.PurePosixPath(f).name for f in files}
    for path in files:
        # frontend/ beschreibt Dateien im Ziel-Projekt (Next.js), nicht in diesem Repo.
        if not path.endswith(".md") or path.startswith(("docs/", "frontend/")) \
                or path.startswith(".claude/skills/") and "/azizam-" not in path:
            continue
        base = pathlib.PurePosixPath(path).parent
        for i, line in enumerate(_read(root, path).splitlines(), 1):
            if LOG_LINE_RE.match(line) or HISTORIC_RE.search(line):
                continue
            for a, b in PATH_TOKEN_RE.findall(line):
                ref = (a or b).strip()
                if not ref or "://" in ref or ref.startswith(("mailto:", "#")) or any(c in ref for c in "*{}<>[]$"):
                    continue
                ref = ref.split("#")[0].rstrip("/")
                cand = {ref, os.path.normpath(str(base / ref)).replace(os.sep, "/")}
                if cand & existing or any(f.startswith(c + "/") for c in cand for f in existing):
                    continue
                if "/" not in ref and ref in names:      # bloßer Dateiname, der irgendwo existiert
                    continue
                r.conflicts.append(f"{path}:{i}: Verweis auf nicht vorhandene Datei `{ref}`")


def check_sync(root: pathlib.Path, r: Report) -> None:
    """Prüfung 4 für SYNC.md: kurz, max. 10 Log-Einträge, erledigte Aufgaben raus."""
    text = _read(root, "SYNC.md")
    if not text:
        return
    lines = text.splitlines()
    if len(lines) > SYNC_MAX_LINES:
        r.add(PRUEFEN, "SYNC.md", f"{len(lines)} Zeilen (Ziel max. {SYNC_MAX_LINES}): Log verdichten")
    log = [l for l in lines if LOG_LINE_RE.match(l)]
    if len(log) > SYNC_MAX_LOG:
        r.add(PRUEFEN, "SYNC.md", f"{len(log)} Log-Einträge (max. {SYNC_MAX_LOG}): ältere in „Verlauf“ verdichten")
    done = [l for l in lines if l.startswith("|") and re.search(r"\|\s*erledigt\s*\|\s*$", l)]
    if done:
        r.add(PRUEFEN, "SYNC.md", f"{len(done)} erledigte Aufgabe(n) noch in der Tabelle")


def run(root: pathlib.Path, files: list[str] | None = None) -> Report:
    files = tracked_files(root) if files is None else files
    r = Report()
    check_files(root, files, r)
    check_duplicates(root, files, r)
    check_superseded_numbers(root, files, r)
    check_conflicts(root, files, r)
    check_links(root, files, r)
    if "SYNC.md" in files:
        check_sync(root, r)
    return r


# ---------------------------------------------------------------- Ausgabe

def _group(paths: list[str]) -> str:
    """Viele Dateien kompakt: nach Ordner zählen."""
    groups: dict[str, int] = {}
    for p in paths:
        parts = p.split("/")
        key = "/".join(parts[:2]) + "/" if len(parts) > 2 else p
        groups[key] = groups.get(key, 0) + 1
    return ", ".join(f"{k} ({n})" if n > 1 else k for k, n in groups.items())


def render(r: Report, alle: bool = False) -> str:
    out = ["Repo-Hygiene (nur Prüfung: nichts wird geändert oder gelöscht)", ""]
    for lc, paths in r.by_lifecycle().items():
        if not paths:
            out.append(f"{lc}: –")
        elif alle or lc not in ("ACTIVE", "REFERENCE"):
            out.append(f"{lc}: " + ", ".join(paths))
        else:
            out.append(f"{lc}: {len(paths)} Dateien — {_group(paths)}")
    out.append("CONFLICTS: " + ("–" if not r.conflicts else str(len(r.conflicts))))
    out += [f"  ❌ {c}" for c in r.conflicts]
    if r.findings:
        out += ["", "Cleanup-Vorschlag (Mar entscheidet; nichts davon wird automatisch ausgeführt)"]
        for aktion in (SICHER, ERSETZT, PRUEFEN):
            items = [(p, g) for a, p, g in r.findings if a == aktion]
            if items:
                out.append(f"  {aktion}:")
                out += [f"    - {p}: {g}" for p, g in items]
    out.append("")
    out.append("❌ Handlungsbedarf (Widerspruch oder temporäre Datei im Repo)" if r.failed
               else "✅ Keine Widersprüche, keine temporären Dateien im Repo")
    return "\n".join(out)
