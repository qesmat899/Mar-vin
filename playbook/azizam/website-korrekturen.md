# Website-Korrekturen — azizamfragrances.com

> **Entscheidung des Inhabers (09/2026):** Beide Punkte werden entfernt. Diese Datei ist die Arbeitsvorlage:
> linke Spalte = exakter Text, wie er heute auf der Seite steht (wörtlich abgerufen), rechte Spalte = was
> stattdessen dort stehen soll. Der Website-Quellcode liegt nicht in diesem Repo — die Änderungen müssen im
> Website-Projekt selbst gemacht werden (Vercel-Deployment, Quelle unbekannt).

## 1 · Herstellungs-Aussagen entfernen

**Warum:** Die Düfte werden fertig aus einer Parfumfabrik bezogen und in eigene Flakons abgefüllt. Aussagen, die
eigene Herstellung, eigene Komposition oder Handarbeit behaupten, sind eine Irreführung über wesentliche Merkmale
der Ware (§ 5 Abs. 1 Nr. 1 UWG) — abmahnfähig durch Wettbewerber und Verbände, unabhängig von der Absicht.

| Steht heute auf der Seite | Was damit passiert | Neuer Text |
|---|---|---|
| „Handgefertigt in Deutschland“ | **ersetzen** | „In Deutschland abgefüllt“ |
| „Seltene Zutaten“ | **entfernen**, bis die Fabrik die Rohstoffe schriftlich belegt | ersatzlos streichen — oder später „30 % Duftöl“ an diese Stelle rücken |
| „Haute Parfumerie“ | **entfernen** | ersatzlos streichen (impliziert ein eigenes Parfümeurshaus) |
| „30 % Duftöl“ | **bleibt** | unverändert — vom Inhaber bestätigt, echter Mechanismus |
| „Kostenloser Versand ab 80 €“ | **bleibt** | unverändert, stimmt mit den AGB überein |

### Der Geschichte-Abschnitt

**Heute (wörtlich):**

> Wir haben dieses Haus um eine einzige Idee herum aufgebaut: dass Duft der Erinnerung am nächsten kommt. Keine
> Nostalgie — Erinnerung. Die Art, die sich einstellt, bevor man sich entschieden hat, sich zu erinnern.
>
> Jeder Duft der Azizam-Kollektion wurde ohne Kompromisse komponiert. Kein Massenmarkt-Briefing. Keine
> Fokusgruppen. Jeder war fertig, wenn er fertig war — wenn die Person, die ihn schuf, das Gefühl hatte, etwas
> geschaffen zu haben, das sich nicht mehr verbessern lässt.
>
> Diese Düfte sind nicht für jeden. Sie wurden für Menschen gemacht, die das verstehen.

**Problem:** Absatz 2 behauptet durchgehend eigene Komposition („komponiert“, „die Person, die ihn schuf“,
„geschaffen“). Absatz 1 und 3 sind unproblematisch — sie sagen nichts über Herstellung.

**Neuer Text (Absatz 1 und 3 bleiben, Absatz 2 wird ersetzt):**

> Wir haben dieses Haus um eine einzige Idee herum aufgebaut: dass Duft der Erinnerung am nächsten kommt. Keine
> Nostalgie — Erinnerung. Die Art, die sich einstellt, bevor man sich entschieden hat, sich zu erinnern.
>
> **Wir stellen unsere Düfte nicht selbst her — wir wählen sie aus. Aus hunderten Kompositionen bleiben die
> wenigen, die diese eine Prüfung bestehen: Erinnert sie an etwas? Jeder Duft wird mit 30 % Duftöl abgefüllt,
> statt der 12 bis 18 %, die bei Eau de Parfum üblich sind. Deshalb bleibt er nah, statt laut zu sein.**
>
> Diese Düfte sind nicht für jeden. Sie wurden für Menschen ausgewählt, die das verstehen.

Das ist die ehrliche Version derselben Geschichte — und nach dem Playbook sogar die stärkere: Kuration plus
30 % Duftöl sind zwei belegbare Mechanismen, „handgefertigt“ war nur eine Behauptung.

## 2 · Bewertungsblock entfernen

**Warum:** Bewertungen müssen von echten Kunden stammen und nachvollziehbar sein (§ 5 Abs. 1, § 5b Abs. 3 UWG,
Nr. 23b Anhang zu § 3 Abs. 3 UWG). Ein Shop ohne bisherige Onlineverkäufe kann keine 247 Bewertungen haben.

**Komplett entfernen — jedes dieser Elemente:**

- „4.8 von 5“
- „247 Bewertungen“
- „Narcos trägt sich wie ein Maßanzug — präsent, ohne laut zu sein. Ich werde ständig darauf angesprochen, was ich trage.“ — Karim A., Frankfurt am Main
- „Midnight Café riecht wie ein Abend, den man nicht vergessen will. Der Kaffee-Vanille-Akkord ist einfach umwerfend.“ — Sarah K., Berlin
- „Erba Bomb ist Sommer im Flakon. Ein Sprühstoß, und ich stehe wieder an der Amalfiküste. Hält bei mir erstaunlich lange.“ — Nina B., Wien
- „Alle 247 Bewertungen ansehen“

Der letzte Testimonial-Text enthält zusätzlich eine Haltbarkeitsaussage („Hält bei mir erstaunlich lange“) — auch
die wäre ohne echte Grundlage angreifbar.

### Was an die Stelle kommt

Die Lücke im Layout nicht leer lassen — Vertrauen anders erzeugen, mit Aussagen, die wahr sind:

> **Neu gestartet. Deshalb ohne Bewertungen — und mit 30 Tagen Rückgaberecht.**
> Wir sind eine junge Marke. Statt Sterne, die wir noch nicht verdient haben, geben wir Dir das hier: Wenn der
> Duft nicht Deiner ist, schick ihn innerhalb von 30 Tagen zurück, solange der Flakon noch zu 80 % gefüllt ist.
> Das Risiko liegt bei uns, nicht bei Dir.

Das ist Risikoumkehr statt Social Proof — bei einer neuen Marke ohnehin der stärkere Conversion-Hebel, und es
deckt sich exakt mit den bereits geltenden AGB (freiwilliges 30-Tage-Rückgaberecht ab 80 % Füllstand).

### Wann echte Bewertungen zurückkommen

Sobald die ersten Privatverkäufe laufen (`NAECHSTE-SCHRITTE.md`, Schritt 0B):

1. Nach 3–5 Tagen nachfragen: „Hat Dich jemand darauf angesprochen?“
2. Einwilligung einholen, den Text wörtlich zu verwenden — schriftlich, per WhatsApp reicht.
3. Nur mit Vornamen und Ort veröffentlichen, wie es die Person freigegeben hat.
4. Sternebewertungen erst anzeigen, wenn sie aus einem echten System kommen (Shopify-Reviews, Trustpilot, Judge.me)
   — der Durchschnitt muss sich aus den tatsächlich vorhandenen Bewertungen errechnen.

## Umsetzung

Der Quellcode der Seite liegt nicht in diesem Repo (`Mar-vin` enthält nur die 3D-Flakon-Komponenten unter
`frontend/components/`). Für die Umsetzung gibt es zwei Wege:

- **Selbst ändern:** Die Texte oben sind Suchen-und-Ersetzen-fertig.
- **Von mir ändern lassen:** Das Website-Repo als Quelle hinzufügen (GitHub-Repo-Name genügt), dann übernehme ich
  die Änderungen direkt und Du bekommst sie als Commit.
