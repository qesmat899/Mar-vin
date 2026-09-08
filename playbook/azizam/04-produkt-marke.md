# Produkt & Marke — Winning Product, Unique Mechanism, Brand-Steckbrief

## Die vier Kriterien (Kap. 2.3)

| Kriterium | Azizam | Status |
|---|---|---|
| 1 · Nicht komplett saturiert | Parfum ist saturiert — **das Segment „persische Duftkultur für die zweite Generation“ ist es nicht.** Kein einziger D2C-Player besetzt es. | ✅ (Meta Ads Library bestätigt: ☐) |
| 2 · Klarer, belegbarer Bedarf | Orientalische Düfte sind seit 2022 der stärkste Trend im Segment; Diaspora-Community in DACH zählt Millionen. Belege: Trends, Parfumo-Threads, TikTok-Volumen | ☐ Zahlen dokumentieren |
| 3 · Löst genau diesen Pain | Ein Duft, der Herkunft trägt, ohne Klischee zu sein (A1) · der näher ist statt lauter (B1) · den keine zweite trägt (C1) | ✅ per Design |
| 4 · Unique Mechanism | 25 % Duftöl + Rohstoffe aus der persischen Duftkultur | ⚠️ **muss vom Lieferanten schriftlich belegt werden** |

## Praxisfilter

| Filter | Azizam EdP 50 ml | |
|---|---|---|
| VK 30–120 € | 69 € | ✅ |
| Marge ≥ 65–70 % | 60 % bei COGS 13,50 € — **Ziel: COGS ≤ 12 € → 63 %**, oder VK 74 € | ⚠️ verhandeln |
| Leicht & klein | 50 ml, ~250 g mit Box | ✅ |
| Nicht zerbrechlich | **Glasflakon** — Retourenrisiko | ⚠️ Kartonage mit Einlage, Bruchquote messen |
| Wiederkauf | 4–6 Monate; plus Wardrobe (zweiter Duft), Discovery-Set → Full Size | ✅ |
| Visuell demonstrierbar | Flakon, Handgelenk-Test, Reaktion anderer Menschen | ✅ (Duft selbst nicht — deshalb Reaktion zeigen) |
| In 10 s erklärbar | „Persische Rose, 25 % Duftöl, riecht nach niemandem sonst.“ | ✅ |
| Kein Monopol | fragmentiert | ✅ |

## Der Unique Mechanism

**Ein-Satz-Test:** *„Unser Duft hält näher an der Haut und länger, weil 25 % Duftöl drin sind statt 15 — und
er riecht nach Rose und Safran, wie sie in Iran seit tausend Jahren benutzt werden, nicht nach einem
Laborbaukasten.“* — Versteht eine 60-jährige Nicht-Kundin das? Ja.

| Quelle des Mechanismus | Azizam |
|---|---|
| Formulierung | 25 % Duftölanteil (Extrait-de-Parfum-Nähe) statt 12–18 % EdP-Standard |
| Inhaltsstoff | Damaszener-Rose (Rosa damascena), Safran, Kardamom, Oud in Spuren — nicht als Hauptnote |
| Herkunft | Rezeptur aus persischer Duftkultur; Abfüllung in Deutschland |
| Ausschluss | kein Oud-Nebel, keine Zuckerwatte, kein Dupe von irgendetwas |
| Geschäftsmodell | Direktvertrieb: Nischenkonzentration ohne Nischenhandelsmarge |

**Wahrheitspflicht:** Jeder dieser Punkte wird im Lieferantenvertrag festgehalten (Duftölanteil in %,
Herkunftsnachweis der Rose). Was nicht belegt ist, wird nicht behauptet. „Made in Germany“ nur, wenn Juice
*und* Abfüllung in DE — sonst „in Deutschland abgefüllt“.

**Prompt 6 (Rezensions-Mining)** auf 100 Wettbewerber-Rezensionen laufen lassen, um zu prüfen, ob der Markt
den Mechanismus „näher statt lauter“ tatsächlich vermisst: `python3 playbook.py prompt 6 --brand azizam --data research/amazon-2-3-sterne.txt`

---

## Brand-Steckbrief (Kap. 3.2)

```
BRAND-FUNDAMENT
Persona (Kern):        Darius/Roya, 27 — die zweite Generation
Ihr Pain (Ebene 4):    „Ich bin hier zu persisch und dort zu deutsch. Ich will etwas tragen, das nach MIR riecht.“
Gewünschte Identität:  Beides sein — und sich für keins entschuldigen.

MISSION
Wir existieren, damit die zweite Generation ihre Herkunft tragen kann wie eine gute Uhr — nicht wie ein Kostüm.

GEGNER
Wir sind gegen das Klischee. Gegen „orientalisch = laut, süß, Shisha-Bar“. Gegen Designer-Düfte, die jeder
zweite in der Bahn trägt. Gegen Nischenhäuser, die unsere Rose als exotisches Zitat für 250 € verkaufen.

VERSPRECHEN
Wer uns kauft, wird der Mensch, an den man sich erinnert — und erkennt sich zum ersten Mal in einem Duft wieder.

ASSOZIATIONEN (3 Worte)
1. Nähe   2. Herkunft   3. Stille (leise statt laut)

GEFÜHL
Wenn jemand unsere Marke berührt, soll er sich erkannt fühlen. Wie das Wort, das die Mutter sagt.

TONALITÄT
Wir klingen: warm / selbstbewusst / poetisch-knapp
Wir klingen NIE: laut-rabattig („nur heute!“) / exotisierend („1001 Nacht“, „Orient-Zauber“)

VISUELL
Farben:        Tiefes Safran-Gold auf mattem Nacht-Blau — Begründung: Safran ist der Geruch der Elternküche
               (Persona A2), Nachtblau ist die Farbe der Yalda-Nacht und wirkt im Feed nicht wie das
               Gold-Schwarz der Dupe-Anbieter. Akzent: Rosé der Damaszener-Rose, sparsam.
Typografie:    Cormorant Garamond (bereits im Frontend) für Markenname und Zitate; klare Grotesk für Text.
               Nastaliq-Schriftzug „عزیزم“ als wiederkehrendes Detail (sichtbare Zugehörigkeit).
Bildsprache:   Menschen, nicht Flakons: Hände, Küchen, Familienfeste, Bahnsteige. Warmes Licht, keine
               Wüsten, keine Kamele, kein Rauch.
Packaging:     Schwerer Flakon (frontend/components/FlaconsScene.tsx), Box innen safran-gold, eine Karte
               mit einem Gedichtvers (Hafis/Rumi, zweisprachig) — der Unboxing-Moment, den man fotografiert.

DER EINE SATZ
"Azizam ist der Duft der zweiten Generation."
```

## Die vier Bausteine der Culture Brand (Kap. 3.1)

| Baustein | Azizam |
|---|---|
| Gemeinsamer Gegner | Das Klischee — und die Austauschbarkeit |
| Gemeinsame Sprache | azizam · joon · delbar · „riecht nach Zuhause“ · „zweite Generation“ — die Community benutzt persische Kosewörter im deutschen Satz, genau so schreibt die Marke |
| Sichtbare Zugehörigkeit | Nastaliq-Schriftzug auf Flakon und Karte · Hashtag #azizamduft · die Gedichtkarte als Story-Motiv |
| Wiederkehrendes Ritual | **Nowruz-Drop** (20./21. März) und **Yalda-Drop** (21. Dezember): je eine limitierte Charge, einmal im Jahr. Monatlich: „Ein Vers, ein Duft“ — Newsletter mit Gedicht und Duftnotiz. |

**Warum das ökonomisch ist (Kap. 3.1):** Wiederkaufrate 40–60 % statt 15–25 %, Creator melden sich von selbst,
Preis ist Teil des Signals. Das Produkt ist in sechs Monaten kopiert. Die Community nicht.

## Markenrechtlicher Check vor dem Start
☐ DPMA/EUIPO-Recherche „Azizam“ in Klasse 3 (Parfümeriewaren) — ☐ Domain und Handles gesichert — ☐ Wortmarke anmelden (Klasse 3, ggf. 35).
