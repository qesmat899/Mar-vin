#!/usr/bin/env python3
"""
Baut aus dem Markdown-Playbook eine vollausgestattete PDF:
Cover, Inhaltsverzeichnis mit Seitenzahlen, Teil-Trennseiten,
Kolumnentitel, PDF-Lesezeichen, klickbare Querverweise, Metadaten.

    python3 docs/build_playbook_pdf.py <input.md> <output.pdf>
"""
import html as htmlmod
import re
import sys
import datetime
from pathlib import Path

import markdown
from markdown.extensions.toc import slugify
from weasyprint import HTML, CSS
from weasyprint.text.fonts import FontConfiguration

HERE = Path(__file__).resolve().parent

PART_LEADS = {
    "Teil 0": "Warum der Markt voll ist — und warum genau das die Chance ist.",
    "Teil I": "Fünf Schichten von außen nach innen: Markt, Persona, Pain, Angle, Ad. "
              "Wer eine Schicht überspringt, rät in allen darunter.",
    "Teil II": "Research, Prompts und Produktwahl — die Arbeit, die vor jeder Anzeige liegt.",
    "Teil III": "Von der Persona zur Marke, die Menschen tragen wollen.",
    "Teil IV": "Testen, Offer rechnen, Creator skalieren — bis die Spirale nach oben läuft.",
    "Teil V": "KI, Retention, Recht und ein Fahrplan über 90 Tage.",
}


def slug(text: str) -> str:
    return slugify(text, "-")


def typografie(md_text: str) -> str:
    """Schließende Anführungszeichen auf deutsche Form („ … “) — Codeblöcke bleiben unberührt."""
    out, in_code, offen = [], False, False
    for line in md_text.split("\n"):
        if line.startswith("```"):
            in_code = not in_code
            out.append(line)
            continue
        if in_code:
            out.append(line)
            continue
        buf = []
        for ch in line:
            if ch == "„":
                offen = True
            elif ch == '"' and offen:
                ch, offen = "“", False
            buf.append(ch)
        out.append("".join(buf))
    return "\n".join(out)


def load(md_path: Path):
    raw = md_path.read_text(encoding="utf-8")
    lines = raw.split("\n")
    start = next(i for i, l in enumerate(lines) if l.startswith("# Teil "))
    body = "\n".join(lines[start:])
    # '---' direkt unter '---' wird sonst als Setext-Überschrift gelesen
    body = re.sub(r"(?m)^---\n---$", "---", body)
    return typografie(body)


def outline(body_md: str):
    """[(part_title, [(chapter_title, slug), ...]), ...] plus lose Kapitel am Ende."""
    parts, current = [], None
    in_code = False
    for line in body_md.split("\n"):
        if line.startswith("```"):
            in_code = not in_code
            continue
        if in_code:
            continue
        if line.startswith("# "):
            current = (line[2:].strip(), [])
            parts.append(current)
        elif line.startswith("## "):
            title = line[3:].strip()
            entry = (title, slug(title))
            if current is None:
                current = ("", [])
                parts.append(current)
            current[1].append(entry)
    return parts


def esc(s: str) -> str:
    return s.replace("&", "&amp;").replace("<", "&lt;").replace(">", "&gt;")


def split_number(title: str):
    """'1.4 Schicht 3 — Die Pains' -> ('1.4', 'Schicht 3 — Die Pains')"""
    m = re.match(r"^(\d+\.\d+)\s+(.*)$", title)
    return (m.group(1), m.group(2)) if m else ("", title)


def build_toc(parts) -> str:
    rows = ['<section class="toc">',
            '<div class="toc-head">Inhalt</div>',
            '<div class="toc-sub">Das vollständige System in fünf Teilen</div>']
    for part_title, chapters in parts:
        if part_title:
            rows.append(f'<div class="toc-part">{esc(part_title)}</div>')
        else:
            rows.append('<div class="toc-part">Anhang</div>')
        for title, sl in chapters:
            num, rest = split_number(title)
            rows.append(
                '<div class="toc-row">'
                f'<span class="num">{esc(num)}</span>'
                f'<span class="t">{esc(rest)}</span>'
                '<span class="dots"></span>'
                f'<span class="pg"><a href="#{sl}"></a></span>'
                "</div>"
            )
    rows.append(
        '<div class="toc-note"><strong>So liest Du dieses Dokument.</strong> '
        'Teil 0 bis III sind das Fundament — sie bauen aufeinander auf und sollten in '
        'dieser Reihenfolge gelesen werden. Teil IV und V sind Nachschlagewerk: '
        'Unit Economics, Creator-Briefings, Rechtsrahmen und der 90-Tage-Fahrplan '
        'lassen sich einzeln aufschlagen. Alle Seitenzahlen und Querverweise in dieser '
        'PDF sind anklickbar.</div>'
    )
    rows.append("</section>")
    return "\n".join(rows)


def build_cover(title, subtitle, pages) -> str:
    today = datetime.date.today().strftime("%m/%Y")
    return f"""
<section class="cover">
  <div class="cover-bar"></div>
  <div class="cover-glow"></div>
  <div class="cover-glow2"></div>
  <div class="cover-inner">
    <div class="cover-kicker">Playbook · Ausgabe {today}</div>
    <h1 class="cover-title">{esc(title).replace("E-Commerce ", "E-Commerce<br/>")}</h1>
    <div class="cover-sub">{esc(subtitle)}</div>
    <div class="cover-rule"></div>
    <div class="cover-desc">Ausgearbeitete Fassung des Webinar-Skripts — ergänzt um
    Market Sophistication, Awareness-Stufen, Unit Economics, den rechtlichen Rahmen
    für den DACH-Raum sowie Vorlagen, Prompts und einen 90-Tage-Fahrplan.</div>
  </div>
  <div class="cover-facts">
    <div class="cover-fact"><span class="n">5</span><span class="l">Schichten</span></div>
    <div class="cover-fact"><span class="n">6</span><span class="l">Prompts</span></div>
    <div class="cover-fact"><span class="n">90</span><span class="l">Tage-Plan</span></div>
    <div class="cover-fact"><span class="n">{pages}</span><span class="l">Seiten</span>
    </div>
  </div>
  <div class="cover-foot"><span>Vom Markt zur Culture Brand</span>
  <span>Vollständige Fassung</span></div>
</section>"""


def part_opener(part_title, chapters) -> str:
    m = re.match(r"^(Teil\s+[0IVX]+)\s*—\s*(.*)$", part_title)
    kicker, name = (m.group(1), m.group(2)) if m else ("", part_title)
    lead = PART_LEADS.get(kicker, "")
    items = []
    for title, sl in chapters:
        num, rest = split_number(title)
        items.append(f'<li><span class="n">{esc(num)}</span>'
                     f'<span>{esc(rest)}</span></li>')
    ghost = kicker.replace("Teil", "").strip() or "*"
    return (
        f'<section class="part-open" id="{slug(part_title)}">'
        f'<div class="pghost">{esc(ghost)}</div>'
        f'<div class="kicker">{esc(kicker)}</div>'
        f'<h1>{esc(name)}</h1>'
        f'<div class="prule"></div>'
        + (f'<div class="plead">{esc(lead)}</div>' if lead else "")
        + f'<ol class="pchapters">{"".join(items)}</ol></section>'
    )


def render_body(body_md: str, parts) -> str:
    md = markdown.Markdown(
        extensions=["extra", "sane_lists", "toc", "smarty", "nl2br"],
        extension_configs={
            "toc": {"slugify": lambda v, s: slugify(v, s)},
            "smarty": {"smart_quotes": False},
        },
    )
    html = md.convert(body_md)

    by_title = {p[0]: p[1] for p in parts}

    def repl_h1(m):
        title = htmlmod.unescape(re.sub(r"<[^>]+>", "", m.group(2)))
        return part_opener(title, by_title.get(title, []))

    html = re.sub(r'<h1 id="([^"]*)">(.*?)</h1>', repl_h1, html, flags=re.S)

    # erstes Kapitel eines Teils bekommt keine Trennlinie darüber
    html = re.sub(r'(</section>\s*(?:<hr\s*/?>\s*)*)<h2 ',
                  r'\1<h2 class="first-of-part" ', html)

    # ASCII-Diagramm erkennen und eigenständig setzen
    def mark_diagram(m):
        block = m.group(0)
        if any(ch in block for ch in "┌│└─"):
            return block.replace("<pre>", '<pre class="diagram">', 1)
        return block
    html = re.sub(r"<pre>.*?</pre>", mark_diagram, html, flags=re.S)

    # Schluss-Kapitel als Kolophon
    html = html.replace('<h2 id="das-ganze-system-auf-einer-seite">',
                        '<section class="colophon"><h2 class="first-of-part" '
                        'id="das-ganze-system-auf-einer-seite">')
    html += ('<div class="endmark">Ende des Playbooks · '
             'Erst der Mensch, dann das Produkt</div></section>')

    html = re.sub(r'<hr[^>]*/?>\s*(?=<h2)', '', html)
    html = re.sub(r'<hr[^>]*/?>\s*(?=<section class="colophon")', '', html)

    # doppelte Trennlinien der Quelle entschärfen
    html = re.sub(r'(<hr\s*/?>\s*){2,}', '<hr class="sep-strong"/>', html)
    return html


def main():
    src = Path(sys.argv[1]) if len(sys.argv) > 1 else HERE / "ECommerceBrandPlaybook.md"
    out = Path(sys.argv[2]) if len(sys.argv) > 2 else HERE / "ECommerceBrandPlaybook.pdf"

    full = src.read_text(encoding="utf-8")
    title = full.split("\n")[0].lstrip("# ").strip()
    subtitle = next(l.lstrip("# ").strip() for l in full.split("\n")[1:8]
                    if l.startswith("### "))
    body_md = load(src)
    parts = outline(body_md)

    def compose(page_count):
        return f"""<!DOCTYPE html>
<html lang="de">
<head>
<meta charset="utf-8"/>
<title>{esc(title)} — {esc(subtitle)}</title>
<meta name="author" content="Mar-vin"/>
<meta name="description" content="Vom Markt zur Culture Brand: Zwiebelmodell,
Customer Research, Unit Economics, Creator-Skalierung und Rechtsrahmen (DACH)."/>
<meta name="keywords" content="E-Commerce, D2C, Brand Building, Customer Research,
Personas, Pains, Angles, Unit Economics, Creator Marketing, Spark Ads, DACH-Recht"/>
<meta name="generator" content="WeasyPrint"/>
<meta name="dcterms.created" content="{datetime.date.today().isoformat()}"/>
</head>
<body>
{build_cover(title, subtitle, page_count)}
{build_toc(parts)}
{body_html}
</body></html>"""

    body_html = render_body(body_md, parts)
    font_config = FontConfiguration()
    stylesheet = CSS(filename=str(HERE / "playbook.css"), font_config=font_config)

    def render(page_count):
        html = compose(page_count)
        return html, HTML(string=html, base_url=str(HERE)).render(
            stylesheets=[stylesheet], font_config=font_config)

    # erster Durchlauf nur, um die Seitenzahl fürs Cover zu kennen
    _, doc = render(0)
    document, doc = render(len(doc.pages))
    (HERE / "_playbook.html").write_text(document, encoding="utf-8")
    doc.write_pdf(out, optimize_images=True)
    print(f"geschrieben: {out}  ({out.stat().st_size/1_048_576:.2f} MB)")


if __name__ == "__main__":
    main()
