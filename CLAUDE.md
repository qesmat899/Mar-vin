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
