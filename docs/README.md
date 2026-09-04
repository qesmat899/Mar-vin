# docs/ — E-Commerce Brand-Playbook

| Datei | Inhalt |
|---|---|
| `ECommerceBrandPlaybook.md` | Quelltext des Playbooks (Markdown) |
| `ECommerceBrandPlaybook.pdf` | Gesetzte PDF, 64 Seiten |
| `build_playbook_pdf.py` | Konverter Markdown → PDF |
| `playbook.css` | Print-Stylesheet (WeasyPrint) |
| `fonts/` | Eingebettete Schriften (SIL OFL 1.1) |

## PDF neu bauen

```bash
pip install weasyprint markdown
python3 docs/build_playbook_pdf.py docs/ECommerceBrandPlaybook.md docs/ECommerceBrandPlaybook.pdf
```

Der Build erzeugt aus dem Markdown eine vollständig ausgestattete PDF:
Cover, Inhaltsverzeichnis mit automatisch ermittelten Seitenzahlen,
Teil-Trennseiten, Kolumnentitel, PDF-Lesezeichen (Outline über drei Ebenen),
klickbare Querverweise, deutsche Silbentrennung, Dokument-Metadaten.
Die Seitenzahl auf dem Cover stammt aus einem ersten Render-Durchlauf.

Inhaltliche Änderungen gehören in die Markdown-Datei, gestalterische in
`playbook.css`.
