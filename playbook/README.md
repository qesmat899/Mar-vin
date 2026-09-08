# E-Commerce Brand-Playbook — Umsetzung für Azizam und Haus & Grün

Dieses Verzeichnis setzt das **E-Commerce Brand-Playbook** („Vom Markt zur Culture Brand“, Ausgabe 09/2026,
64 Seiten) für zwei Marken um. Nicht als Zusammenfassung, sondern als **Arbeitssystem**: jede Schicht des
Zwiebelmodells hat eine Datei, jede Zahl einen Rechner, jeder Prompt einen Befehl, jeder Schritt ein Kästchen.

```
playbook/
├── SYSTEM.md              Das Playbook auf einer Seite — fester KI-Kontext (Kap. 5.1)
├── prompts.md             Die sechs Prompts aus Kap. 2.2 mit Platzhaltern
├── templates/             Pain-Karte, Persona-Karte, Brand-Steckbrief, Creator-Briefing, Anschreiben, Vereinbarung, CSVs
├── azizam/                Parfum-Marke — 12 Dateien, Schicht 1–5 + Zahlen + Creator + Recht + 90-Tage-Plan
└── haus-und-gruen/        Pflanzenpflege-Marke — dieselbe Struktur
```

Werkzeug: [`../playbook.py`](../playbook.py) (nur Standardbibliothek; `anthropic` optional für `--run`).

## Der Arbeitsablauf — Schritt für Schritt zu großen Zahlen

Das Playbook ist eindeutig in der Reihenfolge. Wer eine Schicht überspringt, rät in allen darunter.

| Phase | Wochen | Was passiert | Datei | Befehl |
|---|---|---|---|---|
| **1 · Markt** | 1–2 | Prüfliste, 20 Wettbewerber, Marktentscheidung | `01-markt.md` | — |
| **2 · Research** | 1–2 | 150–200 wörtliche Zitate sammeln | `swipe-file.md` | `playbook.py swipe` |
| **3 · Personas & Pains** | 2 | Prompt 1 + 2 auf echte Daten, Pain-Karten, Scoring | `02-personas-pains.md` | `playbook.py prompt 1/2 --data …` |
| **4 · Produkt & Marke** | 3–4 | Mechanismus belegen, Unit Economics, Brand-Steckbrief | `04-…`, `05-…` | `playbook.py economics`, `offers` |
| **5 · Angles & Hooks** | 5–6 | 12–18 Angles, 5 Hooks je Winner-Kandidat | `03-angles-hooks.md` | `playbook.py prompt 3/4` |
| **6 · Aufbau** | 5–6 | Shop, Recht, Tracking, Flows | `07-recht-retention.md` | — |
| **7 · Testing** | 7–8 | Creatives in den Markt, Diagnose-Kette, Offer-Test | `templates/testing-log.csv` | — |
| **8 · Creator** | 9–10 | 100+ anschreiben, Barter, Briefings | `06-creator-skalierung.md`, `creator-outreach.csv` | `playbook.py prompt 5` |
| **9 · Skalierung** | 11–12 | Spark Ads, Funnel, +20–30 % alle 2–3 Tage bei CM2 > 0 | `06-…` | `playbook.py status` |

Jede Marke hat einen `90-tage-plan.md` mit allen Schritten als Checkliste. `python3 playbook.py status` zeigt beide Marken.

## Die Befehle

```bash
python3 playbook.py brands                                   # welche Marken gibt es
python3 playbook.py status                                   # Fortschritt beider 90-Tage-Pläne
python3 playbook.py economics --brand azizam                 # CM1, CM2, Break-even-ROAS, max. CAC, LTV:CAC
python3 playbook.py economics --brand azizam --cogs 12 --cac 28   # Szenario mit echten Angeboten
python3 playbook.py offers --brand haus-und-gruen            # Abo vs. 2+1 vs. 1+1+Geschenk
python3 playbook.py prompt 1 --brand azizam --data research/zitate.txt          # Prompt ausgeben
python3 playbook.py prompt 3 --brand azizam --var PERSONA="Darius, 27" --run    # an Claude schicken
python3 playbook.py swipe --brand azizam --source "Parfumo" --persona Darius "wörtliches Zitat"
```

`prompt --run` gibt Claude `SYSTEM.md` + das `brand-briefing.md` der Marke als Kontext mit — das ist der
„eigene Kontext als Wettbewerbsvorteil“ aus Kapitel 5.1. Antworten landen in `<marke>/output/`.
Standardmodell: `claude-opus-5` (`--model` zum Ändern). Benötigt `ANTHROPIC_API_KEY` und `pip install anthropic`.

## Wo Mar-vin hilft

`marvin.py` transkribiert TikTok-/YouTube-Videos. Für das Playbook heißt das:
- **Voice of Customer aus Video:** Creator-Videos der Nische transkribieren, die Sprache der Zielgruppe wörtlich in die Swipe-Datei.
- **Wettbewerber-Ads lesen:** Spark Ads und UGC der Konkurrenz transkribieren → Hook, Pain, Mechanismus zerlegen (Kap. 4.5).
- **Eigene Creator-Videos prüfen:** Transkript gegen das Briefing halten — steht der Hook in den ersten drei Sekunden? Fällt ein verbotenes Wort?

```bash
python3 marvin.py <tiktok-url> --model small --lang de
# → output/<slug>/transcript.txt → Zitate per playbook.py swipe übernehmen
```

## Was hier bewusst *nicht* steht

- **Keine erfundenen Zitate.** Alle Personas und Pains sind als Hypothesen markiert; `[ZITAT FEHLT]` bleibt stehen, bis ein echtes Zitat mit Quelle da ist. Das ist keine Lücke, das ist die Methode (Kap. 1.4: „Pain erfinden statt finden“).
- **Keine Marktentscheidung durch die KI.** Kapitel 5.1: Modelle empfehlen bekannte, also überfüllte Märkte. Die Prüflisten sind ausgefüllt, die Entscheidung ist Deine.
- **Kein Rechtsrat.** Kapitel 5.3 und die produktspezifischen Ergänzungen (Kosmetik-VO, Düngemittel-/Pflanzenschutzrecht) sind die Liste, die Du kennen musst — nicht der Ersatz für den Anwalt vor dem ersten Verkauf.

## Die drei Sätze

1. Erst der Mensch, dann das Produkt. Wer beim Produkt anfängt, rät.
2. Wer mehr für einen Kunden zahlen kann als alle anderen, gewinnt jeden Auktionsmarkt. Das kann nur, wer LTV hat — und LTV hat nur, wer eine Marke hat.
3. Die KI ist der Verstärker, nicht das Verständnis. Multiplikator, kein Summand.
