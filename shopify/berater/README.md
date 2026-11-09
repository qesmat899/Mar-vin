# Duftberater (React-Insel + KI-Server)

Kundinnen und Kunden beantworten 5 Fragen als Auswahlkarten: Anlass, Stimmung, Präsenz, Richtung und optional
Feinschliff (Abneigungen, Budget, Freitext). Die Jahreszeit wird automatisch gesetzt. Das Ergebnis sind höchstens 3 Düfte
mit nachvollziehbarem Match-%, Gründen und Hinweisen. Gibt es keinen passenden Duft, sagt der Berater das ehrlich.

## Aufbau

| Teil | Ort | Aufgabe |
|---|---|---|
| Oberfläche | `src/` (Vite, React, Tailwind gekapselt `tw-`/`.azb`, Motion) | Fragen, Laden, Ergebnis; Build → `../theme/assets/azizam-berater.js` und `azizam-berater.css` |
| Engine | `lib/` (läuft auf Server **und** im Browser) | Produktprofile, harte Ausschlüsse, gewichtete Bewertung, Qualitäts-Gate |
| Claude-Stufe | `lib/claude.js`, `lib/beratung.js` | ein Claude-Aufruf je Beratung, JSON-Schema, serverseitige Validierung |
| Server | `api/` (Vercel-Funktionen) | `POST /api/beratung`, `GET /api/kosten`, `GET /api/status` |
| Shopify | `../theme/sections/azizam-berater.liquid`, `../theme/snippets/azizam-berater-produkt.liquid`, `../theme/templates/collection.berater.liquid` | Section; Produktdaten als JSON; öffentlicher Feed `/collections/all?view=berater` für den Server |
| Tests | `tests/`, `src/logik.test.js` | 36 Kundenprofile + Claude-Stufe (simuliert) + Endpunkte |

## Ablauf einer Beratung (seit 09.11.2026: adaptiv)

**Gesprächsführung** (`lib/gespraech.js`, läuft im Browser): Nach jeder Antwort rechnet die Engine für jede noch
offene Frage aus, ob eine andere Antwort einen anderen besten Duft ergäbe. Gefragt wird nur, was die Empfehlung
verändert, und nie, was schon feststeht (auch aus dem Freitext).
1. „Welche Art von Duft gefällt dir spontan am besten?“ (frisch · warm · süß · holzig · dunkel · weiß ich noch nicht),
   wahlweise in eigenen Worten. Bei „weiß ich noch nicht“: „Was riechst du lieber?“ (frisch oder warm).
2. 0–3 Fragen aus Süße, Stärke, Anlass – die erste, wenn sie den besten Duft ändern kann, jede weitere nur bei
   größerem Nutzen.
3. „Gibt es etwas, das du gar nicht magst?“ (entfällt, wenn der Freitext schon Abneigungen nennt).
4. Nur wenn zwei Düfte fast gleichauf liegen: eine Unterscheidungsfrage aus ihrem größten Unterschied.
Messwert (`npm run qualitaet`): im Mittel 4,1 Fragen, höchstens 5.

**Freitext** (`lib/verstehen.js`, ohne KI): Satzteile, Verneinung nur im eigenen Satzteil, auch nachgestellt
(„Oud geht gar nicht“). Klare Ablehnung → harter Ausschluss; Gradangabe („nicht zu süß“, „etwas weniger frisch“) →
weiche Grenze. Die KI ergänzt Abneigungen nur, wenn sie an einem Notenwort im Text hängen.

**Kundenprofil** (`lib/kunde.js`): Antworten + Freitext an einer Stelle; eine Antwort wird nie überschrieben.

**Bewertung** (`lib/matching.js`), Gewichte als Hypothese, geprüft mit Tests und `npm run qualitaet`:
- Duftprofil 50 – 12 Merkmale (süß, frisch, warm, rauchig, holzig, würzig, blumig, fruchtig, ledrig, pudrig, cremig,
  sauber) und Intensität gegen das Zielprofil. Status je Produktwert: bestätigt (zählt voll), aus Hauptnoten
  geschätzt (zählt weniger), unbekannt (zählt gar nicht, nie als „nicht vorhanden“). Hat der Kunde nur wenig zum
  Profil gesagt, zählt dieser Teil entsprechend weniger.
- Vorlieben 25 – genannte Noten; zählt nur mit Kern-Hauptnote oder genau der genannten Note.
- Charakter 15 – Duftart ↔ Duftrichtung, Stimmungs-Etiketten, Richtung (in der alten Frageform 30).
- Kontext 10 – Anlass und Jahreszeit.
Harte Ausschlüsse vor der Bewertung: Abneigungen · zu stark fürs Büro · Budget · Intensität weit weg · nicht
verfügbar · „Andere Vorschläge“. **Die Rangfolge entsteht nur hier**, nie aus der KI.

**Claude** (ein Aufruf am Ende, wenn der Server erreichbar ist) prüft alle nicht ausgeschlossenen Düfte, urteilt
`passt`/`teilweise`/`passt_nicht` und erklärt in einfacher Sprache. Validierung wie bisher (unbekannte IDs,
unbelegte Attribute, Verbotsliste, fremde Duftnamen werden verworfen).

**Ergebnis** (`lib/erklaerung.js`): keine Prozentzahlen. Einstufung („Passt sehr gut zu dir“ …), „Warum wir ihn
empfehlen“ nur aus erfüllten Wünschen und Produktdaten, bei Platz 2/3 der Unterschied („etwas süßer – mit der Note
Vanille“), Link zur 10-ml-Variante. **Nachjustieren** („etwas weniger süß“, „wärmer“, „frischer“, „dezenter“,
„intensiver“, „andere Vorschläge“) rechnet im Browser neu, alle Antworten bleiben.

Ohne Server oder KI läuft dieselbe Engine im Browser (`quelle: "ohne_ki"`).

**Duftprofile pflegen:** Shopify Admin → Produkt → Metafelder → „Duftprofil: …“ (0–3; leer = nicht bestätigt).
Kontrolle: `npm run profile` (✓ bestätigt · ~ aus Noten geschätzt · ? unbekannt).

## Kosten und Schutz

- Pro Beratung höchstens **1 Claude-Aufruf**. Der Systemprompt ist für Prompt-Caching markiert; gleiche Angaben
  innerhalb von 7 Tagen kommen aus dem Cache (0 €). Gleichzeitige gleiche Anfragen lösen nur einen Aufruf aus.
- Token und Kosten je Aufruf: `lib/kosten.js` (Listenpreise je Modell, vor Nutzung prüfen). Monatsübersicht:
  `GET /api/kosten?monat=2026-11` mit `Authorization: Bearer <ADMIN_TOKEN>`.
- Größenordnung mit Claude Sonnet 5.5 (2 $/10 $ je 1 Mio. Token): etwa 3.000 Eingabe- und 1.000–1.500
  Ausgabe-Token, also rund 0,02 $ je Beratung. Das ist eine **Schätzung**; die echten Werte stehen nach dem ersten
  Live-Test in der Kostenübersicht.
- Schutz: CORS nur für die Shop-Domains · nur `POST` · Eingabe höchstens 4 KB · 20 Beratungen je IP und Stunde
  (IP nur gehasht) · höchstens 300 KI-Beratungen pro Tag (danach ohne KI) · Zeitlimit 20 s je Versuch, das SDK
  wiederholt 429/5xx/Verbindungsfehler bis zu 2-mal.
- Ohne `KV_REST_API_URL`/`KV_REST_API_TOKEN` liegen Cache, Rate-Limit und Kosten nur im Arbeitsspeicher einer
  Server-Instanz und gehen bei Neustart verloren. Für eine verlässliche Monatsübersicht Upstash Redis (Vercel
  Marketplace) verbinden.

## Einrichtung (einmalig)

1. Theme-Kopie mit Feed-Template und Section veröffentlichen (Mar). Danach liefert
   `https://azizamfragrances.com/collections/all?view=berater` die Produktdaten als JSON.
2. Vercel-Projekt mit Root-Verzeichnis `shopify/berater` anlegen. Umgebungsvariablen laut `.env.example` setzen,
   mindestens `ANTHROPIC_API_KEY` und `ADMIN_TOKEN`.
3. Prüfen: `GET https://<projekt>.vercel.app/api/status` muss `ki_schluessel_gesetzt: true` und
   `produkte_geladen: 19` zeigen.
4. Im Theme-Editor bei der Section „Azizam Duftberater“ das Feld **Berater-API (KI)** auf
   `https://<projekt>.vercel.app/api/beratung` setzen. Ist das Feld leer, läuft der Berater ohne KI im Browser.

## Befehle

```bash
cd shopify/berater
npm install
npm test                                   # Engine, Kundenprofile, Freitext-Sätze, Beratungsgespräche, Claude-Stufe (simuliert), Endpunkte
npm run qualitaet [-- pfad/zu/alter/lib]   # Matching-Qualität und Beratungslänge messen (optional Vergleich mit alter Engine)
npm run profile                            # Duftprofile aller Düfte mit Status (✓ ~ ?)
npm run build                              # Oberfläche → ../theme/assets/azizam-berater.*
ANTHROPIC_API_KEY=… npm run test:live      # echte API: Profile + JSON + Kosten (kostet Geld; LIVE_ANZAHL=5 begrenzt)
npm run luecken > luecken.csv              # fehlende Produktdaten je Duft als Vorlage zum Ergänzen
```

## Produktdaten ergänzen

`npm run luecken` listet je Duft, was unbekannt ist bzw. nur abgeleitet wurde. Mar trägt nur Belegtes ein, z. B. aus
den Fabrik-Unterlagen. Claude Code schreibt die Werte danach als Metafelder `azizam_profil.*` (kopfnote, herznote,
basisnote als Listen; haltbarkeit, sillage 1–5; suesse … wuerzig 0–3) in Shopify. Bestätigte Werte ersetzen
abgeleitete automatisch.
