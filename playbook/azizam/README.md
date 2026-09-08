# Azizam — E-Commerce Brand-Playbook (Umsetzung)

> **azizam** (عزیزم) — „mein Schatz“, „meine Liebe“. Das Wort, das man im Persischen zu Menschen sagt, die man
> nicht verlieren will.

## Was hier liegt

| Datei | Schicht / Kapitel | Inhalt |
|---|---|---|
| [01-markt.md](01-markt.md) | Schicht 1 · Kap. 1.2 | Prüfliste, Sophistication, Wettbewerber, Werkzeuge, Kaufgründe der Kategorie |
| [02-personas-pains.md](02-personas-pains.md) | Schicht 2+3 · Kap. 1.3–1.4 | Drei Personas, Pain-Karten mit vier Ebenen, Scoring, Awareness |
| [03-angles-hooks.md](03-angles-hooks.md) | Schicht 4+5 · Kap. 1.5–1.6 | 15 Angles, 15 Hooks, Creative-Aufbau, Landing-Page-Struktur |
| [04-produkt-marke.md](04-produkt-marke.md) | Kap. 2.3 + Teil III | Produktfilter, Unique Mechanism, Brand-Steckbrief, Culture-Brand-Bausteine |
| [05-offer-unit-economics.md](05-offer-unit-economics.md) | Kap. 4.2–4.3 | Drei Offer-Varianten, vollständige Rechnung, Break-even-ROAS, LTV |
| [06-creator-skalierung.md](06-creator-skalierung.md) | Kap. 3.3, 4.4–4.7 | Creator-Kriterien, Anschreiben, Beispiel-Briefing, Funnel, Skalierungsregel |
| [07-recht-retention.md](07-recht-retention.md) | Kap. 5.2–5.3 | Kosmetik-VO, CPNP, Gefahrgut, Markenrecht; Flows und Retention |
| [90-tage-plan.md](90-tage-plan.md) | Kap. 5.4 | Der Fahrplan als Checkliste — Fortschritt mit `playbook.py status` |
| [swipe-file.md](swipe-file.md) | Kap. 2.1 | Voice-of-Customer-Sammlung (wörtliche Zitate mit Quelle) |
| [brand-briefing.md](brand-briefing.md) | Kap. 5.1 | Das permanente Marken-Briefing für die KI — wird bei jedem Prompt mitgegeben |
| [brand.json](brand.json) | — | Zahlen und Prompt-Standardwerte für `playbook.py` |
| [creator-outreach.csv](creator-outreach.csv) | Kap. 4.4 | Outreach-Tracking (100+ Zeilen Ziel) |

## Annahmen — bitte prüfen und korrigieren

Das Playbook verbietet, Personas und Pains zu erfinden. Alles, was hier steht, ist deshalb als
**Hypothese** markiert, bis wörtliche Zitate aus dem Markt es belegen (Woche 1–2). Die Annahmen, auf denen
die Ausarbeitung sitzt:

1. **Kategorie:** Azizam ist eine Parfum-Marke (Eau de Parfum, 50 ml). Das 3D-Flakon-Frontend in
   `frontend/components/` deutet darauf hin.
2. **Herkunft als Kern:** Der Name ist Persisch. Die Marke spricht zuerst die zweite Generation der
   iranischen, afghanischen, kurdischen, türkischen und arabischen Diaspora im DACH-Raum an — und darüber
   hinaus alle, die orientalische Düfte lieben, aber das „Oud-Bomben“-Klischee satt haben.
3. **Preis:** 69 € für 50 ml — Nischen-Einstieg, deutlich unter Nischenhäusern (150–300 €), deutlich
   über Drogerie und Dupe-Anbietern (20–40 €).
4. **Mechanismus:** 25 % Duftölanteil und Rohstoffe aus der persischen Duftkultur. **Muss mit dem
   Lieferanten belegbar sein**, sonst ist er gestrichen (UWG).
5. **Startmarkt:** Deutschland, dann Österreich/Schweiz.

Wenn eine Annahme falsch ist: `brand.json` und `brand-briefing.md` ändern — alle Prompts und Rechnungen
ziehen daraus.

## Wo wir stehen

```bash
python3 playbook.py status --brand azizam        # Fortschritt im 90-Tage-Plan
python3 playbook.py economics --brand azizam     # CM1, CM2, Break-even-ROAS, LTV:CAC
python3 playbook.py offers --brand azizam        # Abo vs. 2+1 vs. 1+1+Geschenk
python3 playbook.py prompt 1 --brand azizam --data research/rohzitate.txt
```

**Nächster Schritt:** 150–200 Rohzitate sammeln (Quellenliste in `01-markt.md`), dann Prompt 1 laufen
lassen und die Personas in `02-personas-pains.md` gegen die echten Daten korrigieren.
