#!/usr/bin/env bash
# SessionStart: SYNC.md als Kontext in die Session laden.
cd "${CLAUDE_PROJECT_DIR:-.}" || exit 0
[ -f SYNC.md ] || exit 0
echo "Inhalt von SYNC.md (Übergabe Chat/Code). Regeln darin beachten, am Ende aktualisieren:"
echo
cat SYNC.md
