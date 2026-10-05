# Kontext-Übergabe — für eine neue Claude-Sitzung

> **Lies mich zuerst.** Diese Datei fasst zusammen, was in diesem Projekt entschieden, belegt und noch offen ist —
> damit eine Sitzung ohne Vorgeschichte sofort mitarbeiten kann, ohne dass die Entscheidungen erneut getroffen
> werden müssen. Stand: 09.09.2026, Korrekturen vom 03.10.2026 eingearbeitet (Mar). Für den Tagesstand gilt `SYNC.md` im Repo-Root.

## Was das hier ist

Im Repository (`qesmat899/Mar-vin`):

1. **`marvin.py`** — früheres Video-Transkriptions-Werkzeug aus der Zeit vor Azizam; am 05.10.2026 entfernt, nicht
   mehr Teil des Repositorys.
2. **`playbook/`** — die Umsetzung des „E-Commerce Brand-Playbook" (Vom Markt zur Culture Brand, Ausgabe 09/2026,
   64 Seiten) für Azizam. Nicht als Zusammenfassung, sondern als Arbeitssystem mit Rechner,
   Prompts und Checklisten. Bedient über `playbook.py`.

Die Kurzfassung des Playbooks steht in `playbook/SYSTEM.md` — das ist der Denkrahmen für alle Marketing-Aufgaben
hier. Wer Personas, Angles oder Zahlen anfasst, liest die zuerst.

## Die eisernen Arbeitsregeln

Diese Regeln kommen aus dem Playbook selbst und wurden in diesem Projekt schon mehrfach durchgesetzt. Sie sind
der Grund, warum manche Felder absichtlich leer sind:

1. **Nichts erfinden, was sich belegen lässt oder eben nicht.** Personas und Pains ohne wörtliches Kundenzitat
   bleiben als Hypothese markiert (`[ZITAT FEHLT]`). Duftnoten, die nicht bestätigt sind, werden nicht behauptet.
2. **Kein Angle ohne belegbaren Mechanismus.** Eine Behauptung braucht einen sichtbaren Grund, sonst erzeugt sie
   Misstrauen — und ist in Deutschland abmahnfähig.
3. **Rechtliche Verbotslisten stehen im jeweiligen `brand-briefing.md`** und gelten für jeden Text, auch für
   Creator-Skripte.
4. **Erst der Mensch, dann das Produkt.** Wer beim Produkt anfängt, rät.
5. **Die KI entscheidet den Markt nicht.** Modelle empfehlen bekannte, also überfüllte Märkte. Prüflisten werden
   ausgefüllt, entschieden wird vom Inhaber.

## Azizam — Parfum

Website **azizamfragrances.com** war bis ca. 25.09.2026 live (Single-Page, Shopify-Zahlungen, Vercel-Hosting) und
ist jetzt offline. Der Shop startet komplett neu, aber erst, wenn der Flakon feststeht — der Flakon ist ein Teil
der Website. **Flakon und Verpackung werden gesucht** (Stand 03.10.2026).

### Fakten und Zahlen mit Status

**Zahlenstatus (gilt für das ganze Repo):** `RECORDED (Mar)` = in `SYNC.md` als Mars Aussage/Entscheidung
dokumentiert · `OBSERVED` = beobachtet (alte Website 08.09.2026 bzw. Shopify-Abfrage) · `ASSUMPTION` = bewusst
formulierte Annahme · `OUTDATED` / `EXAMPLE` = altes Modell oder Beispiel · `UNKNOWN` = Herkunft nicht belegt.
Ein Vermerk „eigene Angaben“ in alten Claude-Commits ist **kein** Beleg; Mar hat diese Werte am 05.10.2026
ausdrücklich nicht bestätigt. Aus `UNKNOWN`-Werten wird nichts Neues abgeleitet.

| Thema | Stand |
|---|---|
| Geschäftsmodell | Fertige Düfte aus einer Parfumfabrik, in eigene Flakons abgefüllt (`SYNC.md`). Einkaufspreis: alter Wert 38 € je 500 ml (= 0,076 €/ml) `UNKNOWN`, nicht bestätigt |
| Flakon | noch nicht gewählt; max. ca. 3 € je Flakon `RECORDED (Mar)` — eine **Obergrenze, keine Kostenangabe** |
| Konzentration | **30 % Duftöl bei jedem Duft** `RECORDED (Mar)` (branchenüblich 12–18 %) |
| Größen | **Start mit 30 ml und 50 ml**; 100 ml kommt später, wenn sich einige 30/50 ml verkauft haben `RECORDED (Mar)` 03.10.2026 |
| Preise | **noch nicht entschieden** `RECORDED (Mar)` 03.10.2026. Alte Werte online 29,99 / 44,99 €, privat 25 / 40 € `OUTDATED`, Herkunft unbelegt, nicht bestätigt |
| Warenkosten (COGS) | `UNKNOWN`. Alte Werte 30 ml 6,28 € · 50 ml 7,80 € `OUTDATED` — abgeleitet aus unbelegten Komponenten (38 €/500 ml, 3 €-Obergrenze, 1,00 € Etikett/Box `ASSUMPTION`), Verschluss fehlt |
| Rechner | `playbook.py economics` rechnet nur mit den alten Werten aus `brand.json` — Ergebnisse sind Modellrechnungen, keine Geschäftsdaten |
| Firma | Marvin Farienfar, Einzelunternehmer, Würzburg · **Kleinunternehmer nach § 19 UStG** (Mar 03.10.2026), keine MwSt. · USt-IdNr. vorhanden |
| Versand | alte Website: Deutschland + Österreich, 2–4 Werktage, 4,95 €, kostenlos ab 80 € `OBSERVED (alte Website)`; für den Neustart nicht entschieden. Versandkosten für Azizam `UNKNOWN` |
| Shop & Buchhaltung | Neustart im Shopify-Shop „My Store 3“ (04.10.2026: 0 Produkte, 0 Bestellungen `OBSERVED`); Buchhaltung beim Steuerberater, Geschäftsjahr = Kalenderjahr (Mar 04.10.2026) |
| Rückgabe | gesetzlich 14 Tage; alte Website: freiwillig 30 Tage, wenn Flakon ≥ 80 % gefüllt `OBSERVED (alte Website)`, für den Neustart nicht entschieden |
| Sortiment | 7 Düfte laut alter Website `OBSERVED`: Narcos, Midnight Café, Erba Bomb, Imaginary, Goldstaub II., Velvet Vanilla, Kings Perfume |

Die alten Zahlen stehen in `playbook/azizam/brand.json`, jede mit Status im Feld `_status`. Sie bleiben dort nur als
Rechengrundlage für den Rechner, bis echte Werte vorliegen.

### Getroffene Entscheidungen

Historischer Stand 09/2026. **Neue kommerzielle Entscheidungen** (Preis, Rabatt, Offer, Bestellung, Sortiment,
Experimente) stehen nur im Decision Ledger `azizam/commercial/entscheidungen.csv`.

| Datum | Entscheidung |
|---|---|
| 09/2026 | **Zwei Duftlinien parallel.** *Heritage* (persisch-diasporisch, Persona Darius/Roya, Duft Narcos) und *Editions* (generisch-premium, Personas Leon/Selin, die übrigen sechs). Zuordnung in `azizam/04-produkt-marke.md`. |
| 09/2026 | **30 % Duftöl ist der Kernmechanismus**, zusammen mit Direktvertrieb ohne Handelsmarge. |
| 09/2026 | **Herstellungs-Aussagen kommen von der Website runter** („Handgefertigt in Deutschland", „Seltene Zutaten", „Haute Parfumerie", der Komposition-Absatz). Ersatztexte fertig in `azizam/website-korrekturen.md`. |
| 09/2026 | **Der Bewertungsblock kommt runter** (4.8 von 5, 247 Bewertungen, drei Testimonials) — ohne echte Verkäufe wettbewerbswidrig. Ersetzt durch Risikoumkehr über das 30-Tage-Rückgaberecht. |
| 09/2026 | **30 ml wird online nicht beworben** — unter 30 € trägt der Preis kein Paid Media. Bleibt als Einstieg und Post-Purchase-Upsell. Beruht auf dem alten Preis 29,99 € `OUTDATED`; mit echten Preisen neu prüfen. |

### Was offen ist

1. **Kosmetikrecht vor dem ersten Onlineverkauf.** Wer fertiges Parfum unter eigenem Namen abfüllt, ist selbst die
   verantwortliche Person nach Art. 4 Kosmetik-VO: CPNP-Notifizierung, PIF, Sicherheitsbewertung (CPSR), INCI-
   Kennzeichnung, dazu die erweiterte Duftallergen-Kennzeichnung nach VO (EU) 2023/1545 (für Produkte, die ab
   31.07.2026 in Verkehr gebracht werden). Anfrage an die Fabrik steht in `azizam/NAECHSTE-SCHRITTE.md`, Schritt 0A.
2. **Notenpyramiden für sechs der sieben Düfte.** Nur Narcos ist bekannt (Honig, Tabakblatt, Zimt, Lavendel,
   Zitrus, Vanille). Ohne die echten Noten bleibt die Linienzuordnung Hypothese — **keine Noten erfinden.**
3. **Website-Quellcode ist nicht zugänglich.** Nicht in diesem Repo (dort nur 3D-Flakon-Komponenten unter
   `frontend/components/`), und das verbundene Vercel-Team „MARN" zeigt keine Projekte. Für Änderungen braucht es
   das GitHub-Repo der Website oder die Dateien selbst.
4. **Neue Flakons ins Frontend.** Der 3D-Flakon ist eine Drehform (Lathe-Geometrie über `bodyPoints`) und
   funktioniert nur für runde Flakons. Für eckige braucht es ein GLB-Modell oder einen Foto-Hero.

### Der nächste Schritt

`azizam/NAECHSTE-SCHRITTE.md` ist der Fahrplan. Kern: die beiden Website-Korrekturen umsetzen, parallel die
Rechtsfreigabe bei der Fabrik anstoßen, und **die ersten 50 Flakons privat verkaufen** — das bringt sofort Geld
(alter Modellwert 26,96 € Deckungsbeitrag je 50 ml `OUTDATED`, aus unbelegten Zahlen) und liefert die echten Kundenzitate, die dem ganzen System
bisher fehlen.

## Die Dateien

```
playbook/
├── KONTEXT-EXPORT.md      ← diese Datei
├── SYSTEM.md              Playbook auf einer Seite — fester Kontext für alle Marketing-Aufgaben
├── prompts.md             Die sechs Prompts (Persona-Extraktion bis Rezensions-Mining)
├── templates/             Pain-Karte, Persona-Karte, Brand-Steckbrief, Creator-Briefing, Anschreiben, Vereinbarung, CSVs
└── azizam/
    ├── NAECHSTE-SCHRITTE.md    ← hier steht, was als Nächstes zu tun ist
    ├── website-korrekturen.md  ← fertige Vorher/Nachher-Texte für die Live-Seite
    ├── brand-briefing.md       ← fester KI-Kontext dieser Marke (Verbotsliste!)
    ├── brand.json              ← alte Zahlen mit Status (`_status`), maschinenlesbar
    └── 01-markt … 07-recht-retention, 90-tage-plan, swipe-file
```

## Befehle

```bash
python3 playbook.py status                          # Fortschritt der Pläne
python3 playbook.py economics --brand azizam --all  # alle Größen × Kanäle (online/privat)
python3 playbook.py offers --brand azizam           # Abo / 2+1 / 1+1+Geschenk (Modellrechnung)
python3 playbook.py prompt 1 --brand azizam --data zitate.txt [--run]
python3 playbook.py swipe --brand azizam --source "Parfumo" "wörtliches Zitat"
python3 playbook.py export                          # alles in eine Datei bündeln
```

## Wenn Du in einer neuen Sitzung weiterarbeitest

1. Diese Datei lesen, dann `SYSTEM.md`, dann `azizam/brand-briefing.md`.
2. Vor jeder Zahl: Status prüfen. `UNKNOWN`/`OUTDATED` bleibt so; nie als Fakt verwenden, nichts daraus ableiten.
3. Vor jedem Text: die Verbotsliste im `brand-briefing.md` prüfen.
4. Neue Erkenntnisse gehören in die Dateien, nicht nur in die Antwort — sonst sind sie in der nächsten Sitzung weg.
5. Wie Claude für Azizam arbeitet (Funktionen, Modelle, Compliance-System, Agenten, Freigaben, Routinen): `CLAUDE-MASTER.md`
   im Repo-Root (Stand 04.10.2026). Fertige Texte für claude.ai: `templates/claude-anweisungen.md`.
