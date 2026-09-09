#!/usr/bin/env python3
"""
playbook.py — Werkzeugkasten für das E-Commerce Brand-Playbook (Azizam, Haus & Grün).

    python3 playbook.py brands
    python3 playbook.py status    [--brand azizam]
    python3 playbook.py economics --brand azizam [--price 69 --cogs 13.5 --cac 22 ...]
    python3 playbook.py offers    --brand azizam
    python3 playbook.py prompt 3  --brand azizam --data zitate.txt --var PERSONA="..." [--run]
    python3 playbook.py swipe     --brand azizam --source "r/fragrance" "wörtliches Zitat"

Alle Zahlen kommen aus playbook/<marke>/brand.json und lassen sich per Flag überschreiben.
`prompt --run` schickt Prompt + SYSTEM.md + brand-briefing.md an Claude (ANTHROPIC_API_KEY nötig).
"""

from __future__ import annotations

import argparse
import json
import os
import pathlib
import re
import sys
from datetime import date
from pathlib import Path

ROOT = Path(__file__).resolve().parent / "playbook"
DEFAULT_MODEL = "claude-opus-5"


# ---------------------------------------------------------------- Marken laden

def list_brands() -> list[str]:
    return sorted(p.parent.name for p in ROOT.glob("*/brand.json"))


def load_brand(slug: str) -> dict:
    path = ROOT / slug / "brand.json"
    if not path.exists():
        sys.exit(f"Unbekannte Marke '{slug}'. Verfügbar: {', '.join(list_brands())}")
    data = json.loads(path.read_text(encoding="utf-8"))
    data["_dir"] = path.parent
    return data


# ---------------------------------------------------------------- Unit Economics (Kap. 4.3)

def unit_economics(e: dict, cac: float | None = None) -> dict:
    """Vollständige Rechnung aus Kapitel 4.3. Retouren werden wie im Playbook auf CM1 bezogen."""
    cac = e["cac_ziel"] if cac is None else cac
    netto = e["preis_brutto"] / (1 + e["mwst"])
    gebuehren = netto * e["gebuehren_pct"]
    cm1 = netto - e["cogs"] - e["versand_fulfillment"] - gebuehren
    cm2 = cm1 - cac
    retouren = cm1 * e["retouren_pct"]
    beitrag = cm2 - retouren
    marge = cm1 / netto if netto else 0
    ltv = netto * e["kaeufe_pro_kunde"] * marge
    return {
        "preis_brutto": e["preis_brutto"],
        "netto": netto,
        "cogs": e["cogs"],
        "versand": e["versand_fulfillment"],
        "gebuehren": gebuehren,
        "cm1": cm1,
        "cac": cac,
        "cm2": cm2,
        "retouren": retouren,
        "beitrag": beitrag,
        "marge_pct": marge * 100,
        "cogs_faktor": netto / e["cogs"] if e["cogs"] else 0,
        "break_even_roas_netto": netto / cm1 if cm1 > 0 else float("inf"),
        "break_even_roas_brutto": e["preis_brutto"] / cm1 if cm1 > 0 else float("inf"),
        "ltv": ltv,
        "ltv_cac": ltv / cac if cac else float("inf"),
        "max_cac": cm1 - retouren,
        "payback_kaeufe": cac / (cm1 - retouren) if (cm1 - retouren) > 0 else float("inf"),
    }


def eur(x: float) -> str:
    return f"{x:,.2f} €".replace(",", "X").replace(".", ",").replace("X", ".")


def print_economics(brand: dict, r: dict) -> None:
    ok = "✅" if r["beitrag"] > 0 else "❌"
    print(f"\n{brand['name']} — Unit Economics ({brand['kategorie']})\n")
    print(f"   Verkaufspreis (netto)                    {eur(r['netto']):>12}   ({eur(r['preis_brutto'])} brutto)")
    print(f" − COGS (Produkt + Verpackung)             − {eur(r['cogs']):>10}")
    print(f" − Versand + Fulfillment                   − {eur(r['versand']):>10}")
    print(f" − Zahlungsgebühren                        − {eur(r['gebuehren']):>10}")
    print(" " + "─" * 58)
    print(f" = Deckungsbeitrag I (CM1)                   {eur(r['cm1']):>12}   ({r['marge_pct']:.0f} % Marge, Faktor {r['cogs_faktor']:.1f} auf COGS)")
    print(f" − CAC (Werbekosten pro Neukunde)          − {eur(r['cac']):>10}")
    print(" " + "─" * 58)
    print(f" = Deckungsbeitrag II (CM2)                  {eur(r['cm2']):>12}")
    print(f" − Retouren-/Ausfallquote                  − {eur(r['retouren']):>10}")
    print(" " + "─" * 58)
    print(f" = Beitrag zum Fixkostenblock                {eur(r['beitrag']):>12}   {ok}")
    print()
    print(f" Break-even-ROAS (netto)   {r['break_even_roas_netto']:.2f}   ← diese Zahl auswendig kennen")
    print(f" Break-even-ROAS (brutto)  {r['break_even_roas_brutto']:.2f}   (so rechnet die Plattform)")
    print(f" Max. tragbarer CAC        {eur(r['max_cac'])}   (CM1 nach Retouren — darüber verlierst Du beim Erstkauf)")
    print(f" LTV (netto × Käufe × Marge) {eur(r['ltv'])}   LTV:CAC = {r['ltv_cac']:.1f}:1   (Ziel ≥ 3:1)")
    print(f" Payback                   {r['payback_kaeufe']:.2f} Käufe bis CAC zurückverdient")
    print()
    checks = [
        (r["marge_pct"] >= 65, f"Marge ≥ 65 % ({r['marge_pct']:.0f} %)"),
        (r["cogs_faktor"] >= 4, f"Faktor ≥ 4 auf COGS ({r['cogs_faktor']:.1f})"),
        (30 <= r["preis_brutto"] <= 120, f"VK 30–120 € ({eur(r['preis_brutto'])})"),
        (r["beitrag"] > 0, "CM2 nach Retouren positiv"),
        (r["ltv_cac"] >= 3, f"LTV:CAC ≥ 3 ({r['ltv_cac']:.1f})"),
    ]
    for passed, label in checks:
        print(f"  {'✅' if passed else '⚠️ '} {label}")
    if r["beitrag"] <= 0:
        print("\n  Nicht skalieren. Erst CM2 nach Retouren dauerhaft positiv — sonst verstärkt jeder Euro Budget den Verlust.")


def variant_rows(brand: dict) -> list[dict]:
    """Alle Größen × Kanäle (Onlineshop mit Versand/Gebühren, Direktverkauf ohne beides)."""
    base = brand["economics"]
    rows = []
    for v in brand.get("varianten", []):
        for kanal, preis, versand, fee in (
            ("online", v["preis_brutto"], base["versand_fulfillment"], base["gebuehren_pct"]),
            ("privat", v.get("preis_privat"), 0.0, 0.0),
        ):
            if preis is None:
                continue
            e = dict(base, preis_brutto=preis, cogs=v["cogs"], versand_fulfillment=versand, gebuehren_pct=fee)
            r = unit_economics(e)
            r.update(variante=v["name"], kanal=kanal, rolle=v.get("rolle", ""))
            rows.append(r)
    return rows


def print_variants(brand: dict) -> None:
    rows = variant_rows(brand)
    if not rows:
        print(f"{brand['name']}: keine 'varianten' in brand.json")
        return
    print(f"\n{brand['name']} — alle Größen und Kanäle (CAC-Ziel {eur(brand['economics']['cac_ziel'])})\n")
    print(f"{'Variante':<9}{'Kanal':<8}{'Preis':>9}{'netto':>9}{'COGS':>8}{'CM1':>9}{'Marge':>7}{'BE-ROAS':>9}{'max CAC':>9}  Rolle")
    for r in rows:
        print(f"{r['variante']:<9}{r['kanal']:<8}{eur(r['preis_brutto']):>9}{eur(r['netto']):>9}{eur(r['cogs']):>8}"
              f"{eur(r['cm1']):>9}{r['marge_pct']:>6.0f}%{r['break_even_roas_netto']:>9.2f}{eur(r['max_cac']):>9}  {r['rolle'] if r['kanal']=='online' else ''}")
    print("\n  online = Shop-Preis inkl. Versand/Fulfillment und Zahlungsgebühren · privat = Abholpreis, kein Versand, keine Gebühren")
    print("  BE-ROAS = Break-even-ROAS auf Nettoumsatz · max CAC = CM1 nach Retouren (was ein Kunde beim Erstkauf kosten darf)")
    weak = [r for r in rows if r["kanal"] == "online" and r["preis_brutto"] < 30]
    for r in weak:
        print(f"  ⚠️  {r['variante']} online liegt unter 30 € — trägt laut Playbook kein Paid Media; als Einstieg/Probe führen, nicht bewerben.")


# ---------------------------------------------------------------- Offer-Engineering (Kap. 4.2)

def offers(e: dict) -> list[dict]:
    """Vergleicht Einmalkauf, Abo, 2+1 und 1+1+Geschenk bei identischem CAC."""
    base = unit_economics(e)
    netto1 = base["netto"]
    fee = e["gebuehren_pct"]
    ship = e["versand_fulfillment"]
    cogs = e["cogs"]
    cac = e["cac_ziel"]
    ret = e["retouren_pct"]
    rows = []

    def row(name, umsatz_netto, cogs_total, versand_total, note):
        cm1 = umsatz_netto - cogs_total - versand_total - umsatz_netto * fee
        cm2 = cm1 - cac
        beitrag = cm2 - cm1 * ret
        rows.append({
            "offer": name, "umsatz": umsatz_netto, "cm1": cm1, "cm2": cm2,
            "beitrag": beitrag, "max_cac": cm1 * (1 - ret), "note": note,
        })

    row("Einmalkauf", netto1, cogs, ship, "Referenz")
    abo_netto = netto1 * (1 - e["abo_rabatt_pct"])
    m = e["abo_monate"]
    row(f"Abo ({m} Mon., −{e['abo_rabatt_pct']*100:.0f} %)", abo_netto * m, cogs * m, ship * m,
        "Kündigungsbutton § 312k BGB; Umsatz über Laufzeit, CAC nur einmal")
    row("2+1", netto1 * 2, cogs * 3, ship * 1.3, "AOV ×2 bei gleichem CAC; Versand einmal, etwas schwerer")
    row("1+1+Geschenk", netto1, cogs * 2 + e["geschenk_cogs"], ship * 1.2,
        f"Ankerwert zeigen ({eur(e['geschenk_wert'])}) — muss belastbar sein (UWG)")
    return rows


def print_offers(brand: dict, rows: list[dict]) -> None:
    print(f"\n{brand['name']} — Offer-Vergleich bei identischem CAC ({eur(brand['economics']['cac_ziel'])})\n")
    print(f"{'Offer':<26}{'Umsatz netto':>14}{'CM1':>12}{'CM2':>12}{'nach Retouren':>15}{'max. CAC':>12}")
    for r in rows:
        print(f"{r['offer']:<26}{eur(r['umsatz']):>14}{eur(r['cm1']):>12}{eur(r['cm2']):>12}{eur(r['beitrag']):>15}{eur(r['max_cac']):>12}")
    print()
    for r in rows:
        print(f"  · {r['offer']}: {r['note']}")
    best = max(rows, key=lambda r: r["beitrag"])
    print(f"\n  Höchster Deckungsbeitrag pro Kunde: {best['offer']} — aber: alle drei bauen, gleiches Budget, Zahlen entscheiden.")
    print("  'max. CAC' = was Du für einen Kunden zahlen darfst, bevor das Offer Verlust macht. Wer mehr zahlen kann, gewinnt die Auktion.")


# ---------------------------------------------------------------- Status (Kap. 5.4)

def status(slug: str) -> None:
    brand = load_brand(slug)
    plans = [p for p in (brand["_dir"] / "NAECHSTE-SCHRITTE.md", brand["_dir"] / "90-tage-plan.md") if p.exists()]
    if not plans:
        print(f"{brand['name']}: kein 90-tage-plan.md gefunden")
        return
    section, sections, order = "Allgemein", {}, []
    lines = []
    for plan in plans:
        lines.append(f"## {plan.stem.replace('-', ' ').replace('_', ' ')}")
        lines.extend(plan.read_text(encoding="utf-8").splitlines())
    for line in lines:
        if line.startswith("## "):
            section = line[3:].strip()
            if section not in sections:
                sections[section] = [0, 0]
                order.append(section)
            continue
        m = re.match(r"\s*[-*]\s+\[( |x|X)\]", line)
        if m:
            sections.setdefault(section, [0, 0])
            if section not in order:
                order.append(section)
            sections[section][1] += 1
            if m.group(1).lower() == "x":
                sections[section][0] += 1
    total_done = sum(v[0] for v in sections.values())
    total = sum(v[1] for v in sections.values())
    print(f"\n{brand['name']} — 90-Tage-Plan · {total_done}/{total} erledigt · {brand.get('status', '')}\n")
    for sec in order:
        done, n = sections[sec]
        if n == 0:
            continue
        bar = "█" * done + "░" * (n - done)
        print(f"  {sec:<34} {bar} {done}/{n}")
    print()


# ---------------------------------------------------------------- Prompts (Kap. 2.2)

def load_prompt(n: int) -> tuple[str, str]:
    text = (ROOT / "prompts.md").read_text(encoding="utf-8")
    m = re.search(rf"^## Prompt {n} · (.+?)\n.*?```text\n(.*?)```", text, re.S | re.M)
    if not m:
        sys.exit(f"Prompt {n} nicht in playbook/prompts.md gefunden")
    return m.group(1).strip(), m.group(2)


def fill_prompt(template: str, brand: dict, variables: dict, data: str) -> str:
    values = dict(brand.get("prompt_defaults", {}))
    values.update(variables)
    values["DATEN"] = data.strip() if data.strip() else "[hier echte Rezensionen, Kommentare, Forenposts einfügen]"
    values.setdefault("ANZAHL", str(max(1, len([l for l in data.splitlines() if l.strip()]))) if data.strip() else "N")

    def sub(m):
        key = m.group(1)
        return values.get(key, f"[{key} EINFÜGEN]")

    return re.sub(r"\{([A-Z_0-9]+)\}", sub, template)


def run_claude(system: str, prompt: str, model: str) -> str:
    try:
        import anthropic  # type: ignore
    except ImportError:
        sys.exit("pip install anthropic — oder ohne --run nutzen und den Prompt manuell einfügen.")
    client = anthropic.Anthropic()
    with client.messages.stream(
        model=model,
        max_tokens=16000,
        system=[{"type": "text", "text": system, "cache_control": {"type": "ephemeral"}}],
        messages=[{"role": "user", "content": prompt}],
    ) as stream:
        for text in stream.text_stream:
            print(text, end="", flush=True)
        final = stream.get_final_message()
    print()
    if final.stop_reason == "refusal":
        sys.exit("Claude hat die Anfrage abgelehnt (stop_reason=refusal).")
    return "".join(b.text for b in final.content if b.type == "text")


def prompt_cmd(args) -> None:
    brand = load_brand(args.brand)
    title, template = load_prompt(args.number)
    data = Path(args.data).read_text(encoding="utf-8") if args.data else ""
    variables = dict(v.split("=", 1) for v in args.var) if args.var else {}
    prompt = fill_prompt(template, brand, variables, data)
    print(f"# Prompt {args.number} · {title} — {brand['name']}\n")
    if not args.run:
        print(prompt)
        if "[" in prompt and "EINFÜGEN]" in prompt:
            missing = sorted(set(re.findall(r"\[([A-Z_0-9]+) EINFÜGEN\]", prompt)))
            print(f"\n# Fehlende Variablen: {', '.join(missing)}  →  --var NAME=\"Wert\"")
        return
    system = (ROOT / "SYSTEM.md").read_text(encoding="utf-8")
    briefing = brand["_dir"] / "brand-briefing.md"
    if briefing.exists():
        system += "\n\n---\n\n" + briefing.read_text(encoding="utf-8")
    out = run_claude(system, prompt, args.model)
    outdir = brand["_dir"] / "output"
    outdir.mkdir(exist_ok=True)
    path = outdir / f"{date.today():%Y-%m-%d}-prompt{args.number}.md"
    path.write_text(f"# Prompt {args.number} · {title}\n\n## Prompt\n\n```\n{prompt}\n```\n\n## Antwort\n\n{out}\n", encoding="utf-8")
    print(f"\nGespeichert: {path}")


# ---------------------------------------------------------------- Swipe-Datei (Kap. 2.1)

def swipe_cmd(args) -> None:
    brand = load_brand(args.brand)
    path = brand["_dir"] / "swipe-file.md"
    quote = " ".join(args.quote).strip().strip('"„“')
    if not quote:
        sys.exit("Kein Zitat angegeben.")
    line = f'- "{quote}" — {args.source} ({date.today():%Y-%m-%d})'
    if args.persona:
        line += f" · Persona: {args.persona}"
    if args.pain:
        line += f" · Pain: {args.pain}"
    with path.open("a", encoding="utf-8") as f:
        f.write(line + "\n")
    count = sum(1 for l in path.read_text(encoding="utf-8").splitlines() if l.startswith('- "'))
    print(f"Gespeichert ({count} Zitate in {path.relative_to(ROOT.parent)}). Nach 100 schreiben sich die Anzeigen fast von selbst.")


# ---------------------------------------------------------------- Export (für andere Claude-Sitzungen)

def _export_files(brands: list[str]) -> list[pathlib.Path]:
    """Alle Playbook-Dateien in sinnvoller Lesereihenfolge."""
    files: list[pathlib.Path] = []
    for name in ("KONTEXT-EXPORT.md", "README.md", "SYSTEM.md", "prompts.md"):
        files.append(ROOT / name)
    files += sorted((ROOT / "templates").glob("*.md"))
    for slug in brands:
        d = ROOT / slug
        files.append(d / "README.md")
        files.append(d / "brand.json")
        files += sorted(p for p in d.glob("*.md") if p.name != "README.md")
    return [f for f in files if f.exists()]


def export_cmd(args) -> None:
    """Bündelt das komplette Playbook in EINE Markdown-Datei zum Weitergeben."""
    brands = [args.brand] if args.brand else list_brands()
    out = pathlib.Path(args.out)
    parts = [
        "# Azizam & Haus & Grün — komplettes Playbook (Einzeldatei-Export)",
        "",
        f"Automatisch gebündelt am {date.today():%Y-%m-%d} aus dem Repository `Mar-vin`, Verzeichnis `playbook/`.",
        "Erzeugt mit `python3 playbook.py export`. Diese Datei ist eine Kopie — Änderungen gehören ins Repository,",
        "nicht hierher, sonst laufen beide auseinander.",
        "",
        "Diese Datei enthält alles, was eine neue Claude-Sitzung braucht: Kontext, Regeln, beide Marken,",
        "Vorlagen und die Prompt-Bibliothek. Zum Einlesen einfach vollständig hochladen oder einfügen.",
        "",
        "---",
        "",
        "## Inhalt dieses Exports",
        "",
    ]
    included = _export_files(brands)
    for f in included:
        parts.append(f"- `{f.relative_to(ROOT.parent)}`")
    parts.append("")
    csvs = sorted(ROOT.rglob("*.csv"))
    if csvs:
        parts += ["Nicht enthalten (Tabellen, im Repository):", ""]
        parts += [f"- `{c.relative_to(ROOT.parent)}`" for c in csvs] + [""]

    for f in included:
        rel = f.relative_to(ROOT.parent)
        parts += ["", "=" * 100, "", f"# DATEI: `{rel}`", ""]
        text = f.read_text(encoding="utf-8").strip()
        if f.suffix == ".json":
            parts += ["```json", text, "```"]
        else:
            parts.append(text)

    out.parent.mkdir(parents=True, exist_ok=True)
    out.write_text("\n".join(parts) + "\n", encoding="utf-8")
    kb = out.stat().st_size / 1024
    print(f"Export geschrieben: {out}  ({len(included)} Dateien, {kb:.0f} KB)")
    print()
    print("So nutzt Du ihn in einer anderen Claude-Sitzung:")
    print("  1. Diese Datei dort hochladen — sie enthält den kompletten Kontext.")
    print("  2. Oder besser: das Repository klonen, dann liest Claude CLAUDE.md automatisch")
    print("     und arbeitet direkt auf den echten Dateien statt auf einer Kopie.")


# ---------------------------------------------------------------- CLI

def main() -> None:
    p = argparse.ArgumentParser(description="E-Commerce Brand-Playbook — Werkzeuge")
    sub = p.add_subparsers(dest="cmd", required=True)

    sub.add_parser("brands", help="Marken auflisten")

    s = sub.add_parser("status", help="Fortschritt im 90-Tage-Plan")
    s.add_argument("--brand", help="Marke (Standard: alle)")

    s = sub.add_parser("economics", help="Unit Economics (Kap. 4.3)")
    s.add_argument("--brand", required=True)
    s.add_argument("--variant", help="Größe aus brand.json 'varianten', z. B. '100 ml'")
    s.add_argument("--all", action="store_true", help="Tabelle aller Größen × Kanäle")
    for key in ("price", "cogs", "shipping", "cac", "fee-pct", "returns-pct", "repeat"):
        s.add_argument(f"--{key}", type=float)

    s = sub.add_parser("offers", help="Offer-Vergleich Abo / 2+1 / 1+1+Geschenk (Kap. 4.2)")
    s.add_argument("--brand", required=True)

    s = sub.add_parser("prompt", help="Prompt 1–6 mit Markenkontext füllen (Kap. 2.2)")
    s.add_argument("number", type=int, choices=range(1, 7))
    s.add_argument("--brand", required=True)
    s.add_argument("--data", help="Datei mit echten Rohzitaten")
    s.add_argument("--var", action="append", help="NAME=Wert (mehrfach)")
    s.add_argument("--run", action="store_true", help="an Claude schicken und Antwort speichern")
    s.add_argument("--model", default=DEFAULT_MODEL)

    s = sub.add_parser("export", help="Alles in eine Markdown-Datei bündeln (für andere Claude-Sitzungen)")
    s.add_argument("--brand", help="nur eine Marke (Standard: alle)")
    s.add_argument("--out", default="playbook-export.md", help="Zieldatei (Standard: playbook-export.md)")

    s = sub.add_parser("swipe", help="Wörtliches Zitat in die Swipe-Datei schreiben")
    s.add_argument("--brand", required=True)
    s.add_argument("--source", required=True, help="z. B. 'Amazon 2★ Lattafa' oder 'r/fragrance'")
    s.add_argument("--persona")
    s.add_argument("--pain")
    s.add_argument("quote", nargs="+")

    args = p.parse_args()

    if args.cmd == "brands":
        for slug in list_brands():
            b = load_brand(slug)
            print(f"  {slug:<16} {b['name']} — {b['kategorie']}")
    elif args.cmd == "status":
        for slug in ([args.brand] if args.brand else list_brands()):
            status(slug)
    elif args.cmd == "economics":
        brand = load_brand(args.brand)
        if args.all:
            print_variants(brand)
            return
        e = dict(brand["economics"])
        if args.variant:
            match = [v for v in brand.get("varianten", []) if v["name"].replace(" ", "") == args.variant.replace(" ", "")]
            if not match:
                sys.exit(f"Variante '{args.variant}' nicht gefunden. Vorhanden: {', '.join(v['name'] for v in brand.get('varianten', []))}")
            e.update(preis_brutto=match[0]["preis_brutto"], cogs=match[0]["cogs"])
            brand = dict(brand, kategorie=f"{brand['kategorie']} — {match[0]['name']}")
        overrides = {"price": "preis_brutto", "cogs": "cogs", "shipping": "versand_fulfillment",
                     "fee_pct": "gebuehren_pct", "returns_pct": "retouren_pct", "repeat": "kaeufe_pro_kunde"}
        for flag, key in overrides.items():
            val = getattr(args, flag)
            if val is not None:
                e[key] = val
        print_economics(brand, unit_economics(e, args.cac))
    elif args.cmd == "offers":
        brand = load_brand(args.brand)
        print_offers(brand, offers(brand["economics"]))
    elif args.cmd == "prompt":
        prompt_cmd(args)
    elif args.cmd == "export":
        export_cmd(args)
    elif args.cmd == "swipe":
        swipe_cmd(args)


if __name__ == "__main__":
    main()
