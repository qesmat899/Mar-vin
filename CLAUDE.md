# Mar-vin – Projekt-Kontext für Claude

## Was ist dieses Projekt?
Mar-vin ist ein automatisiertes Pipeline-Tool: TikTok/YouTube-Video → Audio → Whisper-Transkript → KI-Zusammenfassung.

## Haupttool
`marvin.py` — nimmt eine URL, lädt das Video, transkribiert es und fasst es zusammen.

```bash
# Grundnutzung
python3 marvin.py <URL>

# Mit Claude-Zusammenfassung (wenn API-Key verfügbar)
ANTHROPIC_API_KEY=sk-... python3 marvin.py <URL> --model small --lang de

# Ausgabe landet in: output/<slug>/
#   transcript.txt               – Rohtext
#   transcript_timestamped.txt   – Mit Zeitstempeln [MM:SS]
#   summary.md                   – KI-Zusammenfassung oder Extrakt
```

## Abhängigkeiten
```bash
pip install yt-dlp openai-whisper anthropic
apt install ffmpeg
```

## Wichtig: Whisper-Modellgrößen
- `tiny` / `base`: schnell, CPU-tauglich, für kurze Videos
- `small` / `medium`: besser bei gemischten Sprachen (DE+EN)
- `large`: beste Qualität, braucht viel RAM

## Bekannte Eigenheit
Videos mit mehrsprachigem Inhalt (DE/EN mix) führen bei `base` zu Halluzinationen.
Empfehlung: `--model small` für bessere Ergebnisse.

## Nächste sinnvolle Erweiterungen
- Batch-Verarbeitung: `marvin.py urls.txt` (mehrere URLs aus Datei)
- YouTube-Kanal-Tracking: Neueste Videos von Liste von Kanälen automatisch verarbeiten
- Web-Dashboard: Output-Verzeichnis als Browse-fähige HTML-Seite rendern

## E-Commerce Brand-Playbook (`playbook/`, `playbook.py`)
Umsetzung des E-Commerce Brand-Playbooks („Vom Markt zur Culture Brand“) für zwei Marken:
- `playbook/azizam/` — Parfum-Marke (persisch inspiriert, „Duft der zweiten Generation“)
- `playbook/haus-und-gruen/` — Pflanzenpflege-System („Grüner Daumen ist ein Sonntag“)

Pro Marke: Schicht 1–5 des Zwiebelmodells (Markt → Personas → Pains → Angles → Ads), Produkt & Marke,
Offer & Unit Economics, Creator-System, Recht & Retention, 90-Tage-Plan, Swipe-Datei, `brand.json`
(Zahlen + Prompt-Defaults) und `brand-briefing.md` (fester KI-Kontext).

```bash
python3 playbook.py status                          # Fortschritt der 90-Tage-Pläne
python3 playbook.py economics --brand azizam        # CM1/CM2/Break-even-ROAS/LTV:CAC
python3 playbook.py offers --brand haus-und-gruen   # Abo / 2+1 / 1+1+Geschenk
python3 playbook.py prompt 1 --brand azizam --data zitate.txt [--run]   # Prompts 1–6 aus playbook/prompts.md
python3 playbook.py swipe --brand azizam --source "Quelle" "Zitat"
```

Regeln beim Weiterarbeiten: `playbook/SYSTEM.md` ist die Kurzfassung des Playbooks und gilt als Kontext für
alle Marketing-Aufgaben. Personas/Pains ohne wörtliches Zitat bleiben als Hypothese markiert (`[ZITAT FEHLT]`).
Kein Angle ohne belegbaren Mechanismus. Rechtliche Verbotslisten stehen im jeweiligen `brand-briefing.md`.
