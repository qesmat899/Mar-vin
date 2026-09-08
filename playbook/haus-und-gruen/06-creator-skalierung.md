# Creator, Spark Ads & die Aufwärtsspirale

**Phase 3.** Erst validierte Angles, dann getestetes Offer, dann Creator.

## Assoziations-Transfer — welche Creator

Haus & Grün soll **Ruhe, Rhythmus, Zuhause** übertragen bekommen — und vor allem **Entlastung**.

| Kriterium | Haus & Grün-Passung | Warnsignal |
|---|---|---|
| Audience = Persona | Frauen und Männer 25–40 in Stadtwohnungen, Pflanzen-Anfänger und -Wiederholungstäter | reine Profi-Gärtner-Audience, Gartenbesitzer 60+ (das ist Brigitte — zweite Welle) |
| Assoziation | ehrlich über eigene Fehler, gemütliche Wohnung, Sonntagsstimmung | perfekte Dschungel-Wohnung, belehrend, „10 Fehler, die DU machst“ |
| Echtes Engagement | Kommentare: „bei mir auch!“ | nur Emojis |
| Werbedichte | < jeder vierte Post | Dünger-Codes im Wochentakt |
| Sprachraum | DACH > 60 % | |

**Creator-Pools (je 30–40, Ziel 100+):**
1. **#planttok / #pflanzenmama DACH, Anfänger-Ecke** — Leute, die ihre toten Pflanzen zeigen und lachen. Trägt A1, A6.
2. **Cozy-Home / Interior, Mietwohnung** — Einrichtung, Sonntagsroutinen, „Reset-Sunday“. Trägt A4, A7, A8.
3. **Familien-/Balkon-Creator** — für den Frühjahrs-Drop (B1, B2).
4. **Naturnah-/Garten-Creator 50+** — für Brigitte (C1–C3), zweite Welle.

Nano (1–10 K) und Micro (10–100 K) in der Breite. Barter ist hier extrem günstig: Einsatz 7 € COGS, Wert 44,90 €.

## Das Anschreiben (unter 120 Wörter)

```
Hey {Vorname},

Dein Video mit der Monstera „auf der Intensivstation“ — ich hab laut gelacht, weil meine genauso aussah.

Wir sind Haus & Grün: ein Pflegesystem für alle, die glauben, sie hätten keinen grünen Daumen.
Dünger, Blattpflege und ein Plan für den Kühlschrank — Sonntag, zehn Uhr, fünf Minuten.

Du zeigst ehrlich, was schiefgeht. Genau das brauchen wir — kein perfekter Dschungel.

Ich schicke Dir die erste Box (44,90 €) — ohne Kosten, ohne Pflicht zum Lob.

Wenn es Dir gefällt: ein Video (9:16, ~30 s) nach vier Wochen mit Deiner ehrlichen Bilanz,
mit Werbekennzeichnung und Spark-Code für 30 Tage.

Soll ich Dir eine schicken? Dann brauche ich nur Deine Adresse.

{Name}, Haus & Grün
```

Kanal: IG-DM → E-Mail → TikTok-DM. Follow-up nach 4–5 Tagen, einmal. Tracking: `creator-outreach.csv`.
Vereinbarung: `../templates/creator-vereinbarung.md` — Nutzungsrechte 12 Monate, Spark-Code 30 Tage,
Kennzeichnung, Verbotsliste (**kein „gegen Schädlinge“**), Rohdatei, **datierte Fotos für die 4-Wochen-Reihe**.

## Beispiel-Briefing · Format „Vier Wochen, eine Kamera“ (Angle A1 + A9, Persona Mia)

```
CREATOR-BRIEFING
Marke: Haus & Grün · Produkt: Pflegesystem-Box · Format: Problem-Story + Vorher/Nachher (4 Wochen)
Länge: 30–40 s · Plattform: TikTok + IG Reels · Deadline: Box-Ankunft + 5 Wochen

── STRATEGISCHER KERN (nicht verhandelbar) ──
Persona:          Mia — hat dieses Jahr schon mehrere Pflanzen verloren
Pain:             „Ich bringe alles um. Es liegt an mir.“
Angle:            Du hast keinen schwarzen Daumen. Du hast keinen Rhythmus.
Unique Mechanism: Der Plan liegt im Karton, die nächste Box kommt, wenn die alte leer ist.
CTA:              „Link in Bio — erste Box, dann alle sechs Wochen, jederzeit kündbar.“

── AUFBAU ──
0–3 s   HOOK   A: „Wenn Du dieses Jahr schon drei Pflanzen beerdigt hast —“
               B: „Es gibt keinen schwarzen Daumen. Ich beweise es Dir in 30 Sekunden.“
               C: „Der Fehler ist nicht, dass Du zu wenig gießt.“
3–10 s  PROBLEM  Gesagt: „Das war meine dritte Monstera. Ich hatte Dünger, eine App, drei YouTube-Videos. Und trotzdem.“
                 Gezeigt: die kranke Pflanze, Tag 0, mit Datum im Bild
10–25 s LÖSUNG   Kernsatz: „Haus & Grün hat mir keinen besseren Dünger gegeben. Sondern einen Sonntag. Plan an den Kühlschrank, zehn Uhr, fünf Minuten — und die Box kommt, bevor ich’s vergesse.“
                 Zu zeigen: Karton auf, Plan-Karte an den Kühlschrank, Sprühen, dann Fotos Woche 1 → 2 → 3 → 4 (datiert)
25–35 s CTA      „Wenn Du auch die bist, bei der alles eingeht: Link in Bio. Es liegt nicht an Dir.“

── FREI ──  Deine Worte, Deine Wohnung, Dein Humor. Gern auch, was NICHT funktioniert hat.

── PFLICHT ──  „Werbung“ zu Beginn · Box ≥ 5 s · 9:16 · Rohdatei · Spark-Code · Fotos mit Datum
── VERBOTEN ── „gegen Trauermücken/Blattläuse/Schädlinge“ · „garantiert“ · Händler-/Marken-Namen · „Bio“ (sag „organisch“) · „reinigt die Luft“
── HINWEIS ──  Vorher/Nachher immer mit Einblendung „individuelles Ergebnis“
── TONALITÄT ── So: ruhig / ehrlich / konkret   Nicht so: belehrend / perfekt
```

Weitere Briefings: `python3 playbook.py prompt 5 --brand haus-und-gruen --var FORMAT="Day in my Life" --var PERSONA="Mia, 29" --var PAIN="..." --var ANGLE="Pflanzen-Sonntag"`

**Formate nach Funnel:** Problem-Story, „3 Dinge, die ich falsch gemacht habe“, Pflanzen-Sonntag Day in my Life → TOF ·
4-Wochen-Reihe, Honest Review, Mythen-Check („mehr Wasser hilft nicht“), How-to Plan-Karte → MOF ·
Reaktion auf Kommentar („bei mir stirbt trotzdem alles“), Frühjahrs-Drop-Restock → BOF.

## Spark Ads & Creator-oder-Skript-Matrix

2–3 Creator × „Vier Wochen, eine Kamera“ + 1 Creator × 3 Skripte (A1, A3, A4). Nach zwei Runden ist klar, was trägt.
Besonderheit: **Die 4-Wochen-Reihe braucht 5 Wochen Vorlauf** — Creator-Outreach deshalb schon in Woche 7 starten, parallel zum Testing.

## Funnel & Budget

| Stufe | Zielgruppe | Creatives | Budget | Kennzahl |
|---|---|---|---|---|
| TOF | kalt, breit | Spark Ads Problem-Story, „3 Fehler“, Pflanzen-Sonntag | 60–70 % | Hook Rate, CPM |
| MOF | Viewer 50 %+, Engager, Seitenbesucher | Mechanismus (Plan-Karte), 4-Wochen-Reihe, Honest Review | 20–25 % | CTR, Add-to-Cart |
| BOF | Warenkorb-/Produktseiten-Besucher | Rezensionen, Garantie, Abo-Erklärung („jederzeit kündbar“), Reaktion auf Kommentar | 10–15 % | ROAS, CR |

## Die Aufwärtsspirale — Bruchstellen bei Haus & Grün

1. **Creative-Nachschub:** 4-Wochen-Reihen sind der stärkste Beweis, aber langsam → immer 10+ Creator gleichzeitig in der Pipeline.
2. **Cashflow:** Abo-Umsatz kommt gestaffelt, Erstcharge kostet vorab. Liquiditätsplan.
3. **Operations:** Abo-Logistik (Zyklen, Pausen, Adressänderungen) und **Kundenservice als Pflanzen-Sprechstunde** — Antworten auf „meine Pflanze hat gelbe Blätter“ innerhalb 24 h sind Teil des Produkts. Vorlagen + KI-Assistent (aus der Steckkarten-Datenbank) vorbereiten.
