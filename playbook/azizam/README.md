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
| [05-offer-unit-economics.md](05-offer-unit-economics.md) | Kap. 4.2–4.3 | Echte Zahlen: alle Größen × Kanäle, Offer-Struktur, Break-even-ROAS |
| [NAECHSTE-SCHRITTE.md](NAECHSTE-SCHRITTE.md) | — | Die konkreten Handlungsschritte der nächsten 14 Tage, in Reihenfolge |
| [06-creator-skalierung.md](06-creator-skalierung.md) | Kap. 3.3, 4.4–4.7 | Creator-Kriterien, Anschreiben, Beispiel-Briefing, Funnel, Skalierungsregel |
| [07-recht-retention.md](07-recht-retention.md) | Kap. 5.2–5.3 | Kosmetik-VO, CPNP, Gefahrgut, Markenrecht; Flows und Retention |
| [90-tage-plan.md](90-tage-plan.md) | Kap. 5.4 | Der Fahrplan als Checkliste — Fortschritt mit `playbook.py status` |
| [swipe-file.md](swipe-file.md) | Kap. 2.1 | Voice-of-Customer-Sammlung (wörtliche Zitate mit Quelle) |
| [brand-briefing.md](brand-briefing.md) | Kap. 5.1 | Das permanente Marken-Briefing für die KI — wird bei jedem Prompt mitgegeben |
| [brand.json](brand.json) | — | Zahlen und Prompt-Standardwerte für `playbook.py` |
| [creator-outreach.csv](creator-outreach.csv) | Kap. 4.4 | Outreach-Tracking (100+ Zeilen Ziel) |

## Fakten (Stand September 2026) und offene Annahmen

**Bekannt:**
- Produkt: fertige Düfte aus einer Parfumfabrik (38 € je 500 ml), in eigene Flakons (1,85 €) abgefüllt. Neue Flakons sind da; die alten im 3D-Frontend müssen ausgetauscht werden.
- Preise online: 30 ml 29,99 € · 50 ml 44,99 € · 100 ml 64,99 €. Privat/Abholung: 25 / 40 / 60 €.
- Website steht fast. Ziel: Umsatz.

**Noch Annahme — bitte korrigieren:**
1. **Zwei Duftlinien, entschieden 09/2026:** Azizam **Heritage** (persisch-diasporisch, „Duft der zweiten Generation“, Persona Darius/Roya, Duft **Narcos**) und Azizam **Editions** (generisch-premium, Personas Leon/Selin, die übrigen sechs Düfte der Live-Seite). Zuordnung und offene Notenpyramiden: `04-produkt-marke.md`.
2. **Duftkonzentration:** **30 % Duftöl bei jedem Duft** (bestätigt vom Inhaber, 09/2026) — branchenüblich bei Eau de Parfum sind 12–18 %. Kernmechanismus, siehe `04-produkt-marke.md`. Für Rückfragen von Kunden/Behörden lohnt sich trotzdem eine schriftliche Fabrikbestätigung (INCI, Konzentration, Sicherheitsdatenblatt).
3. Etikett/Box 1,00 €, Versand 6,50 € (Gefahrgut-LQ) — Schätzwerte in `brand.json`.

Was als Nächstes zu tun ist, steht in [`NAECHSTE-SCHRITTE.md`](NAECHSTE-SCHRITTE.md).

## Wo wir stehen

```bash
python3 playbook.py status --brand azizam        # Fortschritt im 90-Tage-Plan
python3 playbook.py economics --brand azizam     # CM1, CM2, Break-even-ROAS, LTV:CAC
python3 playbook.py offers --brand azizam        # Abo vs. 2+1 vs. 1+1+Geschenk
python3 playbook.py prompt 1 --brand azizam --data research/rohzitate.txt
```

**Nächster Schritt:** `NAECHSTE-SCHRITTE.md` — Rechtsfreigabe bei der Fabrik anstoßen, Flakons im Frontend tauschen, erste 50 Flakons privat verkaufen und dabei die drei Research-Fragen stellen.
