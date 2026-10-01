# Haus & Grün — E-Commerce Brand-Playbook (Umsetzung)

> Grüner Daumen ist kein Talent. Er ist ein System.

## Was hier liegt

| Datei | Schicht / Kapitel | Inhalt |
|---|---|---|
| [01-markt.md](01-markt.md) | Schicht 1 · Kap. 1.2 + 2.3 | Prüfliste, **Entscheidung zwischen drei Produktkandidaten**, Wettbewerber, Kaufgründe |
| [02-personas-pains.md](02-personas-pains.md) | Schicht 2+3 | Drei Personas, Pain-Karten mit vier Ebenen, Scoring |
| [03-angles-hooks.md](03-angles-hooks.md) | Schicht 4+5 | 14 Angles, Hooks, Creative-Aufbau, Landing-Page-Struktur |
| [04-produkt-marke.md](04-produkt-marke.md) | Kap. 2.3 + Teil III | Produktfilter, Unique Mechanism, Brand-Steckbrief, Culture-Brand-Bausteine |
| [05-offer-unit-economics.md](05-offer-unit-economics.md) | Kap. 4.2–4.3 | Abo als Kern-Offer, vollständige Rechnung, Break-even-ROAS |
| [06-creator-skalierung.md](06-creator-skalierung.md) | Kap. 3.3, 4.4–4.7 | #planttok-Creator, Anschreiben, Beispiel-Briefing, Funnel |
| [07-recht-retention.md](07-recht-retention.md) | Kap. 5.2–5.3 | Düngemittelrecht, Pflanzenschutzgesetz, ElektroG; Flows |
| [90-tage-plan.md](90-tage-plan.md) | Kap. 5.4 | Fahrplan als Checkliste |
| [swipe-file.md](swipe-file.md) | Kap. 2.1 | Voice-of-Customer-Sammlung |
| [brand-briefing.md](brand-briefing.md) | Kap. 5.1 | Permanentes Marken-Briefing für die KI |
| [brand.json](brand.json) | — | Zahlen und Prompt-Standardwerte für `playbook.py` |
| [creator-outreach.csv](creator-outreach.csv) | Kap. 4.4 | Outreach-Tracking |

## Annahmen — bitte prüfen und korrigieren

„Haus & Grün“ wurde als **Konzept** übergeben, nicht als fertiges Produkt. Das Playbook verlangt, beim Markt
anzufangen, nicht beim Produkt — deshalb ist der erste Arbeitsschritt hier eine **Entscheidung**, keine Umsetzung:

1. **Markt:** Zuhause + Pflanzen für Menschen in Stadtwohnungen (Zimmerpflanzen, Balkon, naturnaher Haushalt).
   Das ist ein bewiesener Markt mit hoher Wiederkaufrate und stark emotionaler Ladung („ich bringe alles um“).
2. **Drei Produktkandidaten** werden in `01-markt.md` gegen die Playbook-Filter gestellt:
   **A** Pflanzenpflege-System (Verbrauchsset) · **B** Balkon-Anbau-Kit · **C** Selbstbewässernde Design-Töpfe.
   Die Ausarbeitung ab `02-personas-pains.md` ist für **Kandidat A** geschrieben, weil er die meisten Filter
   erfüllt (Verbrauch → Abo → LTV; leicht; nicht zerbrechlich; demonstrierbar). Wenn die Marktdaten anders
   ausfallen, wird umgeschrieben — die Struktur bleibt.
3. **Preis:** 44,90 € für das Set (6–8 Wochen für 10–15 Pflanzen); Abo 38,17 €.
4. **Startmarkt:** Deutschland.

Wenn Haus & Grün etwas anderes ist (Gartenbau-Dienstleistung, Möbel, Immobilien …): Schicht 1 bleibt gültig,
alles ab Schicht 2 wird auf die neue Kategorie neu gebaut — die Vorlagen und Prompts sind dieselben.

## Wo wir stehen

```bash
python3 playbook.py status --brand haus-und-gruen
python3 playbook.py economics --brand haus-und-gruen
python3 playbook.py offers --brand haus-und-gruen
python3 playbook.py prompt 1 --brand haus-und-gruen --data research/rohzitate.txt
```

**Nächster Schritt:** Marktprüfung der drei Kandidaten (Meta Ads Library, Google Trends, Amazon 2–3★) und
150–200 Rohzitate — dann Entscheidung dokumentieren.
