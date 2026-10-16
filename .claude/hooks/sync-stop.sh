#!/usr/bin/env bash
# Stop: Wenn Dateien geändert wurden, aber SYNC.md nicht, einmal an das Update erinnern.
cd "${CLAUDE_PROJECT_DIR:-.}" || exit 0
input=$(cat)
python3 - "$input" <<'P'
import json, subprocess, sys
try:
    data = json.loads(sys.argv[1] or "{}")
except Exception:
    sys.exit(0)
if data.get("stop_hook_active"):
    sys.exit(0)
out = subprocess.run(["git", "status", "--porcelain"], capture_output=True, text=True).stdout
files = [l[3:] for l in out.splitlines()]
if files and "SYNC.md" not in files:
    print(json.dumps({"decision": "block",
        "reason": "Es gibt Änderungen, aber SYNC.md ist nicht aktualisiert. Nur wenn sich der Übergabestatus geändert hat (Stand, Entscheidung, offene Frage, Aufgabe): nach den Regeln in SYNC.md nachtragen, ohne Datenwerte zu kopieren. Sonst einfach beenden. Bei neuen oder umbenannten Dateien vorher python3 playbook.py hygiene laufen lassen."}))
P
