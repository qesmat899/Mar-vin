#!/usr/bin/env python3
"""UI-Komponenten aus shadcn/ui, Magic UI, Aceternity UI und 21st.dev suchen und holen.

  python3 .claude/skills/ui-komponenten/hol.py suche <begriff> [--quelle shadcn|magicui|aceternity]
  python3 .claude/skills/ui-komponenten/hol.py hol <quelle> <name> [--ziel <ordner>]
  python3 .claude/skills/ui-komponenten/hol.py hol 21st <autor>/<name> [--ziel <ordner>]

Holt nur Quelltext in einen Ordner (Standard: Scratchpad bzw. /tmp), ändert nichts im Repo oder Shop.
Abgerufener Code ist fremder Code: lesen, prüfen, dann für Azizam umbauen (siehe SKILL.md).
"""
import argparse, json, os, sys, tempfile, urllib.request

QUELLEN = {
    "shadcn": {"index": "https://ui.shadcn.com/r/index.json",
               "item": "https://ui.shadcn.com/r/styles/new-york-v4/{name}.json",
               "seite": "https://ui.shadcn.com/docs/components/{name}"},
    "magicui": {"index": "https://magicui.design/r/registry.json",
                "item": "https://magicui.design/r/{name}.json",
                "seite": "https://magicui.design/docs/components/{name}"},
    "aceternity": {"index": "https://ui.aceternity.com/registry.json",
                   "item": "https://ui.aceternity.com/registry/{name}.json",
                   "seite": "https://ui.aceternity.com/components/{name}"},
    "21st": {"index": None, "item": "https://21st.dev/r/{name}", "seite": "https://21st.dev/{name}"},
}


def lade(url):
    req = urllib.request.Request(url, headers={"User-Agent": "azizam-ui-komponenten", "Accept": "application/json"})
    with urllib.request.urlopen(req, timeout=30) as r:
        return json.loads(r.read().decode("utf-8"))


def eintraege(quelle):
    d = lade(QUELLEN[quelle]["index"])
    return d["items"] if isinstance(d, dict) else d


def suche(begriff, nur=None):
    begriff = begriff.lower()
    treffer = 0
    for q in QUELLEN:
        if QUELLEN[q]["index"] is None or (nur and q != nur):
            continue
        try:
            items = eintraege(q)
        except Exception as e:  # noqa: BLE001
            print(f"[{q}] nicht erreichbar: {e}", file=sys.stderr)
            continue
        for i in items:
            text = " ".join(str(i.get(k, "")) for k in ("name", "title", "description")).lower()
            if begriff in text and i.get("type") != "registry:example":
                treffer += 1
                desc = (i.get("description") or i.get("title") or "").strip().replace("\n", " ")
                print(f"{q:10} {i.get('name'):38} {i.get('type', ''):18} {desc[:70]}")
    if not treffer:
        print("Keine Treffer. 21st.dev hat keinen Index hier: dort auf der Website suchen und mit 'hol 21st autor/name' holen.")


def hol(quelle, name, ziel):
    d = lade(QUELLEN[quelle]["item"].format(name=name))
    ziel = ziel or os.path.join(os.environ.get("CLAUDE_SCRATCHPAD", tempfile.gettempdir()), "ui-komponenten", quelle, name.replace("/", "__"))
    os.makedirs(ziel, exist_ok=True)
    files = d.get("files", [])
    for f in files:
        pfad = os.path.join(ziel, os.path.basename(f.get("path") or f.get("target") or "datei.tsx"))
        with open(pfad, "w", encoding="utf-8") as h:
            h.write(f.get("content", ""))
        print("Datei:", pfad, f"({len(f.get('content', ''))} Zeichen)")
    meta = {k: d.get(k) for k in ("name", "type", "dependencies", "devDependencies", "registryDependencies", "cssVars", "css", "tailwind") if d.get(k)}
    meta["quelle"] = QUELLEN[quelle]["item"].format(name=name)
    meta["doku"] = QUELLEN[quelle]["seite"].format(name=name)
    with open(os.path.join(ziel, "meta.json"), "w", encoding="utf-8") as h:
        json.dump(meta, h, ensure_ascii=False, indent=2)
    print("Abhängigkeiten:", ", ".join(d.get("dependencies") or []) or "keine")
    if d.get("registryDependencies"):
        print("Braucht außerdem:", ", ".join(d["registryDependencies"]))
    print("Doku/Vorschau:", meta["doku"])


def main():
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    sub = ap.add_subparsers(dest="cmd", required=True)
    s = sub.add_parser("suche"); s.add_argument("begriff"); s.add_argument("--quelle", choices=[q for q in QUELLEN if QUELLEN[q]["index"]])
    h = sub.add_parser("hol"); h.add_argument("quelle", choices=list(QUELLEN)); h.add_argument("name"); h.add_argument("--ziel")
    a = ap.parse_args()
    try:
        suche(a.begriff, a.quelle) if a.cmd == "suche" else hol(a.quelle, a.name, a.ziel)
    except urllib.error.HTTPError as e:
        sys.exit(f"Abruf fehlgeschlagen ({e.code}): {e.url}. Name prüfen; bei 21st.dev evtl. Limit/Schlüssel (SYNC.md).")


if __name__ == "__main__":
    main()
