#!/usr/bin/env python3
"""
playbook.py — Werkzeugkasten für das E-Commerce Brand-Playbook (Azizam).

    python3 playbook.py brands
    python3 playbook.py status    [--brand azizam]
    python3 playbook.py economics --brand azizam [--price <€> --cogs <€> --cac <€> ...]
    python3 playbook.py offers    --brand azizam [--ad-factor 1.19]
    python3 playbook.py daten     --brand azizam   (Commercial-Daten prüfen und auswerten)
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

import commercial

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

# Definitionen wie in .claude/skills/azizam-unit-economics/SKILL.md, Abschnitt 5:
#   Net Revenue = (Listenpreis brutto − Rabatt) ÷ (1 + USt)            (Kleinunternehmer: USt 0, netto = brutto)
#   CM1         = Net Revenue − COGS − (Versandkosten − Versandentgelt Kunde netto) − Zahlungsgebühren
#   Gebühren    = Prozentsatz × tatsächlich gezahlter Betrag (inkl. Versandentgelt) + feste Gebühr je Transaktion
#   CM2         = CM1 − CAC (effektiv, Perspektive A)
#   Beitrag     = CM2 − Retouren/Ausfall (Playbook-Konvention: Quote × CM1, vereinfachte Modellannahme)
#   Break-even-ROAS (A) = Net Revenue ÷ CM1 · max. CAC (A) = CM1 − Retouren
#   Break-even-ROAS (B) = f × Net Revenue ÷ CM1 · max. Plattform-CPA (B) = max. CAC (A) ÷ f  (nur mit belegtem f)

# Eingaben, die brand.json (noch) nicht führt. Fehlen sie, wird mit 0 gerechnet und das in der Ausgabe als
# „nicht erfasst (UNKNOWN)“ ausgewiesen — nie still als Tatsache.
OPTIONAL_INPUTS = {
    "rabatt_eur": "Rabatt",
    "versandentgelt_kunde": "Versandentgelt des Kunden",
    "gebuehr_fix_eur": "feste Zahlungsgebühr je Transaktion",
}


def contribution(e: dict, *, preis_brutto: float, cogs: float, versand: float, cac: float,
                 rabatt: float = 0.0, versandentgelt: float = 0.0, gebuehr_pct: float | None = None,
                 gebuehr_fix: float = 0.0, retouren_pct: float | None = None) -> dict:
    """Kernrechnung je Bestellung. Einzige Stelle, an der CM1, CM2 und Beitrag berechnet werden."""
    mwst = e["mwst"]
    pct = e["gebuehren_pct"] if gebuehr_pct is None else gebuehr_pct
    ret_pct = e["retouren_pct"] if retouren_pct is None else retouren_pct
    realisiert_brutto = preis_brutto - rabatt
    netto = realisiert_brutto / (1 + mwst)
    versandentgelt_netto = versandentgelt / (1 + mwst)
    gezahlt = realisiert_brutto + versandentgelt
    gebuehren = gezahlt * pct + gebuehr_fix
    versand_netto = versand - versandentgelt_netto
    cm1 = netto - cogs - versand_netto - gebuehren
    cm2 = cm1 - cac
    retouren = cm1 * ret_pct
    return {
        "preis_brutto": preis_brutto, "rabatt": rabatt, "realisiert_brutto": realisiert_brutto,
        "netto": netto, "versandentgelt": versandentgelt, "versand": versand, "versand_netto": versand_netto,
        "cogs": cogs, "gebuehren": gebuehren, "cm1": cm1, "cac": cac, "cm2": cm2,
        "retouren": retouren, "beitrag": cm2 - retouren,
    }


def ad_perspectives(r: dict, faktor: float | None) -> dict:
    """Break-even-ROAS und max. CAC in Perspektive A (effektiv) und B (Plattform, nur mit Faktor f)."""
    cm1, netto = r["cm1"], r["netto"]
    max_cac_a = cm1 - r["retouren"]
    out = {
        "werbe_faktor": faktor,
        "be_roas_a": netto / cm1 if cm1 > 0 else float("inf"),
        "max_cac_a": max_cac_a,
        "be_roas_b": None,
        "max_cpa_b": None,
    }
    if faktor:
        out["be_roas_b"] = faktor * netto / cm1 if cm1 > 0 else float("inf")
        out["max_cpa_b"] = max_cac_a / faktor
    return out


def unit_economics(e: dict, cac: float | None = None, faktor: float | None = None) -> dict:
    """Unit Economics einer Bestellung mit einer Einheit (Bezugsgröße wie im Skill)."""
    cac = e["cac_ziel"] if cac is None else cac
    r = contribution(
        e, preis_brutto=e["preis_brutto"], cogs=e["cogs"], versand=e["versand_fulfillment"], cac=cac,
        rabatt=e.get("rabatt_eur", 0.0), versandentgelt=e.get("versandentgelt_kunde", 0.0),
        gebuehr_fix=e.get("gebuehr_fix_eur", 0.0),
    )
    r.update(ad_perspectives(r, faktor))
    netto, cm1 = r["netto"], r["cm1"]
    marge = cm1 / netto if netto else 0
    ltv = cm1 * e["kaeufe_pro_kunde"]  # Beitrags-LTV: CM1 je Kauf × Käufe/Kunde (Annahme), Wiederkäufe ohne CAC
    r.update(
        marge_pct=marge * 100,
        cogs_faktor=netto / e["cogs"] if e["cogs"] else 0,
        be_roas_brutto_umsatz=r["realisiert_brutto"] / cm1 if cm1 > 0 else float("inf"),
        ltv=ltv,
        ltv_cac=ltv / cac if cac else float("inf"),
        payback_kaeufe=cac / r["max_cac_a"] if r["max_cac_a"] > 0 else float("inf"),
        nicht_erfasst=[label for key, label in OPTIONAL_INPUTS.items() if key not in e],
    )
    return r


def eur(x: float) -> str:
    return f"{x:,.2f} €".replace(",", "X").replace(".", ",").replace("X", ".")


def input_notes(brand: dict, r: dict) -> list[str]:
    """Hinweise zur Datenlage: alte Werte und nicht erfasste Eingaben."""
    notes = []
    status = brand["economics"].get("_preis_status")
    if status:
        notes.append(f"Datenlage: {status}")
    for key, st in brand["economics"].get("_status", {}).items():
        if not st.startswith("RECORDED"):
            notes.append(f"{key}: {st.split(' — ')[0]}")
    if r.get("nicht_erfasst"):
        notes.append("Nicht erfasst, mit 0 gerechnet (UNKNOWN): " + ", ".join(r["nicht_erfasst"]))
    notes.append("Retouren = Quote × CM1 (Playbook-Konvention, Modellannahme); Käufe/Kunde für LTV = Annahme aus brand.json")
    return notes


def print_ad_perspectives(r: dict) -> None:
    print(f" Break-even-ROAS (A, effektiv)     {r['be_roas_a']:.2f}   gegen ROAS auf effektive Werbekosten")
    print(f" max. CAC (A, effektiv)            {eur(r['max_cac_a'])}   CM1 nach Retouren")
    if r["werbe_faktor"]:
        print(f" Break-even-ROAS (B, Plattform)    {r['be_roas_b']:.2f}   gegen den Plattform-ROAS (f = {r['werbe_faktor']:.2f})")
        print(f" max. Plattform-CPA (B)            {eur(r['max_cpa_b'])}   Ausgabe im Werbekonto je Neukunden-Bestellung")
    else:
        print(" Break-even-ROAS (B, Plattform)    UNKNOWN — Faktor f nicht angegeben (--ad-factor, Bedingungen im Skill §5)")
        print(" max. Plattform-CPA (B)            UNKNOWN")
    print("   Einen Plattform-ROAS nie mit Perspektive A vergleichen.")


def print_economics(brand: dict, r: dict) -> None:
    ok = "✅" if r["beitrag"] > 0 else "❌"
    print(f"\n{brand['name']} — Unit Economics ({brand['kategorie']})\n")
    print(f"   Net Revenue                              {eur(r['netto']):>12}   ({eur(r['preis_brutto'])} brutto, Rabatt {eur(r['rabatt'])})")
    print(f" − COGS (Produkt + Verpackung)             − {eur(r['cogs']):>10}")
    print(f" − Versand netto (Kosten − Entgelt Kunde)  − {eur(r['versand_netto']):>10}   ({eur(r['versand'])} − {eur(r['versandentgelt'])})")
    print(f" − Zahlungsgebühren                        − {eur(r['gebuehren']):>10}")
    print(" " + "─" * 58)
    print(f" = Deckungsbeitrag I (CM1)                   {eur(r['cm1']):>12}   ({r['marge_pct']:.0f} % Marge, Faktor {r['cogs_faktor']:.1f} auf COGS)")
    print(f" − CAC (effektiv, Perspektive A)           − {eur(r['cac']):>10}")
    print(" " + "─" * 58)
    print(f" = Deckungsbeitrag II (CM2)                  {eur(r['cm2']):>12}")
    print(f" − Retouren/Ausfall (Quote × CM1)          − {eur(r['retouren']):>10}")
    print(" " + "─" * 58)
    print(f" = Beitrag zum Fixkostenblock                {eur(r['beitrag']):>12}   {ok}")
    print()
    print_ad_perspectives(r)
    if brand["economics"]["mwst"] > 0:
        print(f" Break-even-ROAS auf Bruttoumsatz  {r['be_roas_brutto_umsatz']:.2f}   (nur Umsatzseite inkl. USt, kein Faktor f)")
    print(f" Beitrags-LTV (Szenario)           {eur(r['ltv'])}   LTV:CAC = {r['ltv_cac']:.1f}:1 — Käufe/Kunde ist eine Annahme")
    print(f" Payback                           {r['payback_kaeufe']:.2f} Käufe bis CAC zurückverdient")
    print()
    checks = [
        (r["marge_pct"] >= 65, f"Marge ≥ 65 % ({r['marge_pct']:.0f} %)"),
        (r["cogs_faktor"] >= 4, f"Faktor ≥ 4 auf COGS ({r['cogs_faktor']:.1f})"),
        (30 <= r["preis_brutto"] <= 120, f"VK 30–120 € ({eur(r['preis_brutto'])})"),
        (r["beitrag"] > 0, "CM2 nach Retouren positiv"),
    ]
    for passed, label in checks:
        print(f"  {'✅' if passed else '⚠️ '} {label}")
    print(f"  ℹ️  LTV:CAC {r['ltv_cac']:.1f} ist ein Szenario, kein Prüfergebnis (keine Kohortendaten)")
    if r["beitrag"] <= 0:
        print("\n  Nicht skalieren. Erst CM2 nach Retouren dauerhaft positiv — sonst verstärkt jeder Euro Budget den Verlust.")
    print()
    for note in input_notes(brand, r):
        print(f"  ⚠️  {note}")


def variant_rows(brand: dict, faktor: float | None = None) -> list[dict]:
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
            if kanal == "privat":  # kein Versand, keine Zahlungsgebühr: diese Eingaben sind hier nicht offen
                e.update(versandentgelt_kunde=0.0, gebuehr_fix_eur=0.0)
            r = unit_economics(e, faktor=faktor)
            r.update(variante=v["name"], kanal=kanal, rolle=v.get("rolle", ""))
            rows.append(r)
    return rows


def print_variants(brand: dict, faktor: float | None = None) -> None:
    rows = variant_rows(brand, faktor)
    if not rows:
        print(f"{brand['name']}: keine 'varianten' in brand.json")
        return
    print(f"\n{brand['name']} — alle Größen und Kanäle (CAC-Ziel {eur(brand['economics']['cac_ziel'])}, effektiv)\n")
    b_head = "BE-ROAS B" if faktor else ""
    print(f"{'Variante':<9}{'Kanal':<8}{'Preis':>9}{'netto':>9}{'COGS':>8}{'CM1':>9}{'Marge':>7}{'BE-ROAS A':>11}{'max CAC A':>11}{b_head:>11}  Rolle")
    for r in rows:
        b_val = f"{r['be_roas_b']:>11.2f}" if faktor else f"{'':>11}"
        print(f"{r['variante']:<9}{r['kanal']:<8}{eur(r['preis_brutto']):>9}{eur(r['netto']):>9}{eur(r['cogs']):>8}"
              f"{eur(r['cm1']):>9}{r['marge_pct']:>6.0f}%{r['be_roas_a']:>11.2f}{eur(r['max_cac_a']):>11}{b_val}  {r['rolle'] if r['kanal']=='online' else ''}")
    print("\n  online = Shop-Preis inkl. Versand/Fulfillment und Zahlungsgebühren · privat = Abholpreis, kein Versand, keine Gebühren")
    print("  A = effektive Werbekosten (Skill §5) · max CAC A = CM1 nach Retouren")
    if not faktor:
        print("  Perspektive B (Plattform) = UNKNOWN ohne --ad-factor. Plattform-ROAS nie mit BE-ROAS A vergleichen.")
    weak = [r for r in rows if r["kanal"] == "online" and r["preis_brutto"] < 30]
    for r in weak:
        print(f"  ⚠️  {r['variante']} online liegt unter 30 € — trägt laut Playbook kein Paid Media; als Einstieg/Probe führen, nicht bewerben.")
    online = next((r for r in rows if r["kanal"] == "online"), None)
    if online:
        for note in input_notes(brand, online):
            print(f"  ⚠️  {note}")


# ---------------------------------------------------------------- Offer-Engineering (Kap. 4.2)

def offers(e: dict, faktor: float | None = None) -> list[dict]:
    """Vergleicht Einmalkauf, Abo, 2+1 und 1+1+Geschenk bei identischem CAC.
    Rechnet über dieselbe Kernfunktion wie `economics`. Die Mengen- und Versandfaktoren der Offers sind
    Modellannahmen aus dem Playbook (Kap. 4.2), keine belegten Werte."""
    cac = e["cac_ziel"]
    p = e["preis_brutto"]
    ship = e["versand_fulfillment"]
    cogs = e["cogs"]
    entgelt = e.get("versandentgelt_kunde", 0.0)
    fix = e.get("gebuehr_fix_eur", 0.0)
    rows = []

    def row(name, preis_brutto, cogs_total, versand_total, note, n_bestellungen=1):
        r = contribution(e, preis_brutto=preis_brutto, cogs=cogs_total, versand=versand_total, cac=cac,
                         versandentgelt=entgelt * n_bestellungen, gebuehr_fix=fix * n_bestellungen)
        r.update(ad_perspectives(r, faktor))
        r.update(offer=name, umsatz=r["netto"], note=note)
        rows.append(r)

    row("Einmalkauf", p, cogs, ship, "Referenz")
    m = e["abo_monate"]
    row(f"Abo ({m} Lieferungen, −{e['abo_rabatt_pct']*100:.0f} %)", p * (1 - e["abo_rabatt_pct"]) * m, cogs * m, ship * m,
        "Kündigungsbutton § 312k BGB; Umsatz über Laufzeit, CAC nur einmal. Laufzeit in Kap. 05 abweichend (OUTDATED)",
        n_bestellungen=m)
    row("2+1", p * 2, cogs * 3, ship * 1.3, "AOV ×2 bei gleichem CAC; Versand einmal, Faktor 1,3 = Modellannahme")
    row("1+1+Geschenk", p, cogs * 2 + e["geschenk_cogs"], ship * 1.2,
        f"Ankerwert zeigen ({eur(e['geschenk_wert'])}) — muss belastbar sein (UWG); Geschenk-COGS = Annahme")
    return rows


def print_offers(brand: dict, rows: list[dict]) -> None:
    faktor = rows[0]["werbe_faktor"] if rows else None
    print(f"\n{brand['name']} — Offer-Vergleich bei identischem CAC ({eur(brand['economics']['cac_ziel'])}, effektiv)\n")
    b_head = "max CPA B" if faktor else ""
    print(f"{'Offer':<30}{'Umsatz netto':>14}{'CM1':>12}{'CM2':>12}{'nach Retouren':>15}{'max CAC A':>12}{b_head:>12}")
    for r in rows:
        b_val = f"{eur(r['max_cpa_b']):>12}" if faktor else ""
        print(f"{r['offer']:<30}{eur(r['umsatz']):>14}{eur(r['cm1']):>12}{eur(r['cm2']):>12}{eur(r['beitrag']):>15}{eur(r['max_cac_a']):>12}{b_val}")
    print()
    for r in rows:
        print(f"  · {r['offer']}: {r['note']}")
    best = max(rows, key=lambda r: r["beitrag"])
    print(f"\n  Höchster Deckungsbeitrag pro Kunde im Modell: {best['offer']} — Modellrechnung, keine Empfehlung. Zahlen aus Tests entscheiden.")
    print("  max CAC A = effektive Werbekosten je Neukunde, bevor das Offer Verlust macht. Plattform-Schwelle nur mit --ad-factor (B).")
    status = brand["economics"].get("_preis_status")
    if status:
        print(f"  ⚠️  Preise: {status}")


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
        "# Azizam — komplettes Playbook (Einzeldatei-Export)",
        "",
        f"Automatisch gebündelt am {date.today():%Y-%m-%d} aus dem Repository `Mar-vin`, Verzeichnis `playbook/`.",
        "Erzeugt mit `python3 playbook.py export`. Diese Datei ist eine Kopie — Änderungen gehören ins Repository,",
        "nicht hierher, sonst laufen beide auseinander.",
        "",
        "Diese Datei enthält alles, was eine neue Claude-Sitzung braucht: Kontext, Regeln, die Marke,",
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


# ---------------------------------------------------------------- Commercial-Daten (commercial.py)

def daten_cmd(slug: str) -> int:
    """Prüft die Commercial-Daten und zeigt nur abgeleitete Werte. Schreibt nichts."""
    brand = load_brand(slug)
    directory = commercial.data_dir(ROOT, slug)
    print(f"\n{brand['name']} — Commercial-Daten ({directory.relative_to(ROOT.parent)})\n")
    if not directory.exists():
        print("  Kein Ordner commercial/ vorhanden.")
        return 1
    t = commercial.load(directory)
    errors = commercial.check_headers(directory)
    v_errors, notes = commercial.validate(t)
    errors += v_errors

    print("Objekte")
    for name in commercial.SCHEMA:
        print(f"  {name:<28}{len(t[name]):>5} Einträge")

    if t["produkte.csv"]:
        print("\nCOGS je Produkt (aus Stückliste × Komponentenpreis, nicht gespeichert)")
        for pid, c in commercial.cogs_by_product(t).items():
            wert = eur(c["wert"]) if c["wert"] is not None else "UNKNOWN"
            print(f"  {pid:<28}{wert:>12}  {'offen: ' + ', '.join(c['offen']) if c['offen'] else ''}")

    levels = commercial.stock_levels(t)
    if levels:
        print("\nBestand (Summe der Bewegungen)")
        for (typ, artikel, einheit), entry in sorted(levels.items()):
            menge = "UNKNOWN" if entry["unknown"] else f"{entry['menge']:g}"
            print(f"  {artikel:<28}{menge:>10} {einheit}")
        total, unbewertet = commercial.capital(t)
        print(f"  Gebundenes Kapital (bewertbarer Teil): {eur(total)}")
        if unbewertet:
            print(f"  Ohne belegten Wert (UNKNOWN, nicht geschätzt): {', '.join(unbewertet)}")

    if t["transaktionen.csv"]:
        mwst = brand["economics"].get("mwst", 0.0)
        bekannt = [commercial.transaction_contribution(t, tx, mwst) for tx in t["transaktionen.csv"]
                   if tx.get("status") != "storniert"]
        cm1 = [x["cm1"] for x in bekannt if x["cm1"] is not None]
        print("\nTransaktionen (Ist, ohne CAC)")
        print(f"  {len(bekannt)} gezählt · CM1 belegt für {len(cm1)} · Summe CM1 {eur(sum(cm1))}")
        if len(cm1) < len(bekannt):
            print(f"  {len(bekannt) - len(cm1)} Transaktion(en) mit fehlenden Werten → CM1 UNKNOWN")

    if t["experimente.csv"]:
        print("\nExperimente (Kette Hypothese → … → nächster Test)")
        for exp in t["experimente.csv"]:
            c = commercial.experiment_chain(t, exp)
            done = sum(c["schritte"].values())
            offen = [k for k, ok in c["schritte"].items() if not ok]
            print(f"  {exp['experiment_id']:<16}{done}/8  Evidenz {c['evidenz']:<15}{'offen: ' + ', '.join(offen) if offen else ''}")

    print()
    for n in notes:
        print(f"  ℹ️  {n}")
    for e in errors:
        print(f"  ❌ {e}")
    if not errors:
        print("  ✅ Schema, Verweise, Freigaben und Datenschutz ohne Fehler")
    return 1 if errors else 0


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
    for key in ("price", "cogs", "shipping", "cac", "fee-pct", "returns-pct", "repeat",
                "discount", "shipping-fee", "fee-fixed"):
        s.add_argument(f"--{key}", type=float)
    s.add_argument("--ad-factor", type=float, help="Faktor f für Perspektive B (z. B. 1.19 bei Reverse Charge ohne Vorsteuerabzug)")

    s = sub.add_parser("offers", help="Offer-Vergleich Abo / 2+1 / 1+1+Geschenk (Kap. 4.2)")
    s.add_argument("--brand", required=True)
    s.add_argument("--ad-factor", type=float, help="Faktor f für Perspektive B")

    s = sub.add_parser("daten", help="Commercial-Daten prüfen: Schema, Verweise, COGS, Bestand, Transaktionen")
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
            print_variants(brand, args.ad_factor)
            return
        e = dict(brand["economics"])
        if args.variant:
            match = [v for v in brand.get("varianten", []) if v["name"].replace(" ", "") == args.variant.replace(" ", "")]
            if not match:
                sys.exit(f"Variante '{args.variant}' nicht gefunden. Vorhanden: {', '.join(v['name'] for v in brand.get('varianten', []))}")
            e.update(preis_brutto=match[0]["preis_brutto"], cogs=match[0]["cogs"])
            brand = dict(brand, kategorie=f"{brand['kategorie']} — {match[0]['name']}")
        overrides = {"price": "preis_brutto", "cogs": "cogs", "shipping": "versand_fulfillment",
                     "fee_pct": "gebuehren_pct", "returns_pct": "retouren_pct", "repeat": "kaeufe_pro_kunde",
                     "discount": "rabatt_eur", "shipping_fee": "versandentgelt_kunde", "fee_fixed": "gebuehr_fix_eur"}
        for flag, key in overrides.items():
            val = getattr(args, flag)
            if val is not None:
                e[key] = val
        print_economics(brand, unit_economics(e, args.cac, args.ad_factor))
    elif args.cmd == "offers":
        brand = load_brand(args.brand)
        print_offers(brand, offers(brand["economics"], args.ad_factor))
    elif args.cmd == "daten":
        sys.exit(daten_cmd(args.brand))
    elif args.cmd == "prompt":
        prompt_cmd(args)
    elif args.cmd == "export":
        export_cmd(args)
    elif args.cmd == "swipe":
        swipe_cmd(args)


if __name__ == "__main__":
    main()
