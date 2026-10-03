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
