# Die Prompt-Bibliothek

Alle sechs Prompts aus Kapitel 2.2. **Jeder Prompt setzt echte Rohdaten voraus** — kopierte Rezensionen,
Kommentare, Forenposts. Ohne echte Eingabe ist die Ausgabe Dekoration.

Platzhalter in `{GESCHWEIFTEN_KLAMMERN}` werden von `playbook.py prompt N --brand <marke>` automatisch
aus `brand.json` gefüllt; fehlende Werte gibst Du mit `--var NAME=Wert` mit, Rohdaten mit `--data datei.txt`.

```bash
python3 playbook.py prompt 1 --brand azizam --data research/rohzitate.txt
python3 playbook.py prompt 3 --brand haus-und-gruen --var PERSONA="Mia, 29" --var PAIN_EBENE_4="..." --run
```

Mit `--run` wird der Prompt zusammen mit `SYSTEM.md` und dem `brand-briefing.md` der Marke an Claude geschickt
(benötigt `ANTHROPIC_API_KEY` und `pip install anthropic`).

---

## Prompt 1 · Persona-Extraktion

```text
Ich baue eine Marke im Markt {MARKT}.
Unten findest Du {ANZAHL} echte Rezensionen, Kommentare und Forenposts
von Menschen aus diesem Markt.

Aufgabe:
1. Identifiziere 3–5 klar unterscheidbare Personas.
   Zwei Personas gelten nur dann als getrennt, wenn sich Trigger,
   Haupteinwand oder gewünschte Identität unterscheiden.
2. Für jede Persona:
   - Name, Alter, Lebenssituation
   - Trigger-Event (was hat das Problem akut gemacht?)
   - Bisherige Lösungsversuche und warum sie gescheitert sind
   - Top-3-Einwände gegen einen Kauf
   - Awareness-Stufe (unaware / problem / solution / product / most aware)
   - 5 wörtliche Zitate aus den Daten, die diese Persona belegen

Regel: Erfinde nichts. Jede Aussage muss durch ein Zitat aus den
Daten belegt sein. Wenn die Daten etwas nicht hergeben, schreibe
"nicht belegt".

DATEN:
{DATEN}
```

## Prompt 2 · Pain-Tiefenbohrung

```text
Hier ist eine Persona: {PERSONA}
Hier ist ihr Haupt-Pain in ihren eigenen Worten: "{ZITAT}"

Arbeite diesen Pain über vier Ebenen aus:
1. Funktional — was ist objektiv das Problem?
2. Praktisch — was kostet es sie konkret im Alltag?
3. Emotional — welches Gefühl löst es aus?
4. Identitär — wer wird sie dadurch in ihren eigenen Augen?

Bewerte danach auf je 1–5: Intensität, Frequenz, soziale
Sichtbarkeit, Zahlungsbereitschaft.

Formuliere zum Schluss Ebene 4 in EINEM Satz, in ihrer Sprache,
nicht in Marketingsprache.

DATEN (falls vorhanden, weitere Zitate dieser Persona):
{DATEN}
```

## Prompt 3 · Angle-Generierung

```text
Persona: {PERSONA}
Pain (Ebene 4): {PAIN_EBENE_4}
Produkt: {PRODUKT}
Unique Mechanism: {UNIQUE_MECHANISM}

Erstelle 10 Angles nach dieser Formel:
Persona + Pain + Transformation + Mechanismus + Beweis

Nutze unterschiedliche Angle-Typen: Transformation, Feindbild,
Mechanismus, Identität, Insider-Wissen, Gegen-Intuition, Zeugnis,
Vergleich, Kosten des Nichtstuns, Zugehörigkeit.

Pro Angle:
- Angle-Name (3 Worte)
- Kernbotschaft (1 Satz, in Kundensprache)
- Passende Awareness-Stufe
- Warum dieser Angle bei DIESER Persona greift

Keine Produkteigenschaften. Nur Transformationen.

Wörtliche Kundenzitate als Sprachmaterial:
{DATEN}
```

## Prompt 4 · Hook-Varianten

```text
Angle: {ANGLE}
Persona: {PERSONA}

Schreibe 15 Hooks für die ersten 3 Sekunden eines UGC-Videos.
Jeder Hook maximal 12 Wörter, gesprochene Sprache, kein
Marketing-Ton.

Mische die Typen:
direkte Ansprache · wörtliches Zitat · Widerspruch · Ergebnis
vorweg · Frage · Fehler-Framing · Demonstration

Markiere pro Hook, welchen Typ er nutzt.

Wörtliche Kundenzitate als Sprachmaterial:
{DATEN}
```

## Prompt 5 · Creator-Briefing

```text
Erstelle ein Creator-Briefing für ein {FORMAT}-Video.

Marke: {MARKE}
Produkt: {PRODUKT}
Persona: {PERSONA}
Pain: {PAIN}
Angle: {ANGLE}
Unique Mechanism: {UNIQUE_MECHANISM}

Struktur:
1. Hook (0–3 Sek) — 3 Varianten zur Auswahl
2. Problem (3–10 Sek) — was gesagt und gezeigt wird
3. Lösung + Mechanismus (10–25 Sek)
4. CTA (25–35 Sek)

Plus:
- Was der Creator NICHT sagen darf (rechtlich): {VERBOTEN}
- Setting, Licht, Kleidung
- Tonalität in 3 Worten: {TONALITAET}
- Verbotene Formulierungen: Heilaussagen, Garantien, Vergleiche
  mit Wettbewerbern, fremde Markennamen

Schreibe es so, dass der Creator es ohne Rückfragen umsetzen kann.
```

## Prompt 6 · Rezensions-Mining

```text
Unten sind {ANZAHL} Rezensionen zu Produkten meiner Wettbewerber
im Markt {MARKT}, gefiltert auf 2 und 3 Sterne.

1. Cluster die Beschwerden. Nenne pro Cluster die Häufigkeit.
2. Ziehe pro Cluster die 3 wörtlichsten, emotionalsten Zitate.
3. Leite daraus ab: welche Produkteigenschaft müsste ein Produkt
   haben, das diese Enttäuschung nicht auslöst?
4. Formuliere daraus 5 mögliche Unique Mechanisms.

DATEN:
{DATEN}
```
