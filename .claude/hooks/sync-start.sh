#!/usr/bin/env bash
# SessionStart: ARBEITSWEISE.md und SYNC.md als Kontext in die Session laden.
cd "${CLAUDE_PROJECT_DIR:-.}" || exit 0
if [ -f ARBEITSWEISE.md ]; then
  echo "Werkzeug-Kompass (ARBEITSWEISE.md). Weise Mar kurz darauf hin, wenn eine Aufgabe in Chat/Cowork/Konnektor besser aufgehoben ist:"
  echo
  cat ARBEITSWEISE.md
  echo
fi
[ -f SYNC.md ] || exit 0
echo "Inhalt von SYNC.md (Übergabe Chat/Code). Regeln darin beachten, am Ende aktualisieren:"
echo
cat SYNC.md

# Repo-Hygiene: nur bei Handlungsbedarf (Widerspruch oder temporäre Datei) kurz melden.
if out=$(python3 playbook.py hygiene 2>/dev/null); then :; else
  echo
  echo "Repo-Hygiene meldet Handlungsbedarf (python3 playbook.py hygiene):"
  echo "$out" | grep -E "^  ❌" | head -10
  echo "$out" | grep -q "sicher entfernbar" && echo "  + temporäre Datei(en) im Repo, siehe Cleanup-Vorschlag"
fi
