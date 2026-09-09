# Kontext-Übergabe — für eine neue Claude-Sitzung

> **Lies mich zuerst.** Diese Datei fasst zusammen, was in diesem Projekt entschieden, belegt und noch offen ist —
> damit eine Sitzung ohne Vorgeschichte sofort mitarbeiten kann, ohne dass die Entscheidungen erneut getroffen
> werden müssen. Stand: 09.09.2026.

## Was das hier ist

Zwei Dinge im selben Repository (`qesmat899/Mar-vin`):

1. **`marvin.py`** — das ursprüngliche Werkzeug: Video-URL → Whisper-Transkript → KI-Zusammenfassung. Für das
   Playbook nützlich, um die Sprache der Zielgruppe aus TikTok-Videos wörtlich zu gewinnen.
2. **`playbook/`** — die Umsetzung des „E-Commerce Brand-Playbook" (Vom Markt zur Culture Brand, Ausgabe 09/2026,
   64 Seiten) für zwei Marken des Inhabers. Nicht als Zusammenfassung, sondern als Arbeitssystem mit Rechner,
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

## Marke 1 · Azizam — Parfum (aktiver Schwerpunkt)

Website **azizamfragrances.com** ist live (Single-Page, Shopify-Zahlungen, Vercel-Hosting). Produkt und Flakons
sind vorhanden. Es geht um Umsatz, nicht um Konzeptarbeit.

### Belegte Fakten

| Thema | Stand |
|---|---|
| Geschäftsmodell | Fertige Düfte aus einer Parfumfabrik (38 € je 500 ml = 0,076 €/ml), in eigene Flakons (1,85 €) abgefüllt |
| Konzentration | **30 % Duftöl bei jedem Duft** (vom Inhaber bestätigt; branchenüblich 12–18 %) |
| Preise online | 30 ml 29,99 € · 50 ml 44,99 € · 100 ml 64,99 € |
| Preise privat | 30 ml 25 € · 50 ml 40 € · 100 ml 60 € |
| Warenkosten | 30 ml 5,13 € · 50 ml 6,65 € · 100 ml 10,45 € |
| Kernzahlen 50 ml online | CM1 23,90 € · Break-even-ROAS 1,58 · max. CAC 22,94 € |
| Kernzahlen 100 ml online | CM1 36,57 € · Break-even-ROAS 1,49 · max. CAC 35,11 € |
| Firma | Marvin Farienfar, Einzelunternehmer, Lilienweg 8, 97084 Würzburg · USt-IdNr. DE459609298 (keine Kleinunternehmerregelung) |
| Versand | Deutschland + Österreich, 2–4 Werktage, 4,95 €, kostenlos ab 80 € |
| Rückgabe | gesetzlich 14 Tage; freiwillig 30 Tage, wenn Flakon ≥ 80 % gefüllt |
| Sortiment | 7 Düfte: Narcos, Midnight Café, Erba Bomb, Imaginary, Goldstaub II., Velvet Vanilla, Kings Perfume |

Alle Zahlen sind in `playbook/azizam/brand.json` hinterlegt und werden von `playbook.py economics` gerechnet —
nie von Hand nachrechnen, sondern den Befehl nutzen.

### Getroffene Entscheidungen

| Datum | Entscheidung |
|---|---|
| 09/2026 | **Zwei Duftlinien parallel.** *Heritage* (persisch-diasporisch, Persona Darius/Roya, Duft Narcos) und *Editions* (generisch-premium, Personas Leon/Selin, die übrigen sechs). Zuordnung in `azizam/04-produkt-marke.md`. |
| 09/2026 | **30 % Duftöl ist der Kernmechanismus**, zusammen mit Direktvertrieb ohne Handelsmarge. |
| 09/2026 | **Herstellungs-Aussagen kommen von der Website runter** („Handgefertigt in Deutschland", „Seltene Zutaten", „Haute Parfumerie", der Komposition-Absatz). Ersatztexte fertig in `azizam/website-korrekturen.md`. |
| 09/2026 | **Der Bewertungsblock kommt runter** (4.8 von 5, 247 Bewertungen, drei Testimonials) — ohne echte Verkäufe wettbewerbswidrig. Ersetzt durch Risikoumkehr über das 30-Tage-Rückgaberecht. |
| 09/2026 | **30 ml wird online nicht beworben** — unter 30 € trägt der Preis kein Paid Media. Bleibt als Einstieg und Post-Purchase-Upsell. |

### Was offen ist

1. **Kosmetikrecht vor dem ersten Onlineverkauf.** Wer fertiges Parfum unter eigenem Namen abfüllt, ist selbst die
   verantwortliche Person nach Art. 4 Kosmetik-VO: CPNP-Notifizierung, PIF, Sicherheitsbewertung (CPSR), INCI-
   Kennzeichnung. Anfrage an die Fabrik steht in `azizam/NAECHSTE-SCHRITTE.md`, Schritt 0A.
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
(26,96 € Deckungsbeitrag je 50 ml ohne Werbekosten) und liefert die echten Kundenzitate, die dem ganzen System
bisher fehlen.

## Marke 2 · Haus & Grün — Pflanzenpflege (ausgearbeitet, noch nicht gestartet)

Konzept, kein fertiges Produkt. Die Marktdatei stellt drei Kandidaten gegeneinander und empfiehlt ein
**Pflegesystem** (organischer Flüssigdünger + Blattpflege + Pflegeplan, 44,90 €, Abo 38,17 €), weil es als
einziges alle Playbook-Filter erfüllt: Verbrauch, leicht, nicht zerbrechlich, demonstrierbar.

Kernthese: *„Grüner Daumen ist kein Talent. Er ist ein Sonntag."* Pflanzen sterben am fehlenden Rhythmus, nicht
am fehlenden Dünger — deshalb liegt der Plan im Karton und die nächste Box kommt, wenn die alte leer ist.

Zahlen: CM1 25,48 € (68 % Marge) · Break-even-ROAS 1,48 · max. CAC 24,71 € · LTV:CAC 5,5. Das Abo darf 116 € CAC
tragen — der eigentliche Hebel.

**Die harte Rechtsgrenze:** Nie „gegen Trauermücken / Blattläuse / Schädlinge" behaupten. Das wäre ein
Pflanzenschutzmittel und braucht eine BVL-Zulassung. Der Pain darf benannt werden, das Produkt darf nicht dagegen
wirken. Steht in `haus-und-gruen/brand-briefing.md`.

## Die Dateien

```
playbook/
├── KONTEXT-EXPORT.md      ← diese Datei
├── SYSTEM.md              Playbook auf einer Seite — fester Kontext für alle Marketing-Aufgaben
├── prompts.md             Die sechs Prompts (Persona-Extraktion bis Rezensions-Mining)
├── templates/             Pain-Karte, Persona-Karte, Brand-Steckbrief, Creator-Briefing, Anschreiben, Vereinbarung, CSVs
├── azizam/
│   ├── NAECHSTE-SCHRITTE.md    ← hier steht, was als Nächstes zu tun ist
│   ├── website-korrekturen.md  ← fertige Vorher/Nachher-Texte für die Live-Seite
│   ├── brand-briefing.md       ← fester KI-Kontext dieser Marke (Verbotsliste!)
│   ├── brand.json              ← alle Zahlen, maschinenlesbar
│   └── 01-markt … 07-recht-retention, 90-tage-plan, swipe-file
└── haus-und-gruen/        dieselbe Struktur
```

## Befehle

```bash
python3 playbook.py status                          # Fortschritt beider Pläne
python3 playbook.py economics --brand azizam --all  # alle Größen × Kanäle (online/privat)
python3 playbook.py offers --brand haus-und-gruen   # Abo / 2+1 / 1+1+Geschenk
python3 playbook.py prompt 1 --brand azizam --data zitate.txt [--run]
python3 playbook.py swipe --brand azizam --source "Parfumo" "wörtliches Zitat"
python3 playbook.py export                          # alles in eine Datei bündeln
```

## Wenn Du in einer neuen Sitzung weiterarbeitest

1. Diese Datei lesen, dann `SYSTEM.md`, dann das `brand-briefing.md` der Marke, um die es geht.
2. Vor jeder Zahl: `playbook.py economics` laufen lassen, statt aus dem Text zu rechnen.
3. Vor jedem Text: die Verbotsliste im `brand-briefing.md` prüfen.
4. Neue Erkenntnisse gehören in die Dateien, nicht nur in die Antwort — sonst sind sie in der nächsten Sitzung weg.
