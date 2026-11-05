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

## Ablauf einer Beratung

1. **Angaben prüfen** (`kundenAngaben`): nur erlaubte Werte, Freitext gekürzt (400 Zeichen) und bereinigt.
2. **Kundenprofil:** Karten plus Freitext. Abneigungen aus dem Freitext erkennt immer auch eine Regel ohne KI.
3. **Produktprofile** (`lib/profil.js`) aus Shopify. Jede Angabe hat eine Quelle:
   - `shopify`: Metafelder `azizam.*` / `azizam_berater.*`, von Mar freigegeben
   - `bestaetigt`: Metafelder `azizam_profil.*`, gezielt ergänzt
   - `abgeleitet`: Regel in `lib/lexikon.js` aus den Hauptnoten
   Was nicht belegt ist, bleibt `null` (unbekannt): aktuell Kopf-/Herz-/Basisnote, Haltbarkeit und Sillage für alle Düfte.
4. **Harte Ausschlüsse:** Note aus „Bitte nicht drin“ · fürs Büro zu stark · über dem Budget (30 ml) · Intensität
   weit weg vom Wunsch · nicht verfügbar.
5. **Gewichtete Bewertung** (`lib/matching.js`): Stimmung 35 · Anlass 15 · Präsenz 15 · Jahreszeit 15 · Richtung 10 ·
   gewünschte Noten 10. Gezählt werden nur beantwortete Kriterien. Deutliche Widersprüche (Gegensatz zur Stimmung,
   entgegengesetzte Richtung) kosten 10 Punkte. **Das Match-% entsteht nur hier**, nie aus der KI.
6. **Claude** (ein Aufruf, `output_config.format` mit JSON-Schema) bekommt die besten ≤ 10 Kandidaten mit belegten Daten.
   Claude liefert Vorlieben und Abneigungen aus dem Freitext (feste Werteliste) und je Kandidat ein Urteil
   (`passt`/`teilweise`/`passt_nicht`), Gründe, Attribute, Konflikte und eine Erklärung.
7. **Validierung:** Unbekannte oder doppelte `product_id` werden verworfen. Attribute, die nicht in den Produktdaten
   stehen, werden entfernt. Texte mit Verbotsliste-Begriffen, Prozentangaben oder fremden Duftnamen werden verworfen.
   Danach wird neu gerechnet; von Claude erkannte Abneigungen gelten als harter Ausschluss.
8. **Qualitäts-Gate:** empfohlen nur bei Match ≥ 60 %, zuverlässigen Daten und ohne KI-Veto. Bei „teilweise“ ab 70 %,
   bei deutlichem Widerspruch ab 80 %. Höchstens 3 Düfte, sonst „kein passender Duft“.

Ohne Schlüssel, bei API-Fehlern, über dem Tageslimit oder wenn der Server nicht erreichbar ist, läuft dieselbe Engine
ohne KI (`quelle: "ohne_ki"`). Im Browser zeigt sich das nur daran, dass der Hinweis „von KI geprüft“ fehlt.

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
npm test                                   # Engine, 36 Kundenprofile, Claude-Stufe (simuliert), Endpunkte
npm run build                              # Oberfläche → ../theme/assets/azizam-berater.*
ANTHROPIC_API_KEY=… npm run test:live      # echte API: Profile + JSON + Kosten (kostet Geld; LIVE_ANZAHL=5 begrenzt)
npm run luecken > luecken.csv              # fehlende Produktdaten je Duft als Vorlage zum Ergänzen
```

## Produktdaten ergänzen

`npm run luecken` listet je Duft, was unbekannt ist bzw. nur abgeleitet wurde. Mar trägt nur Belegtes ein, z. B. aus
den Fabrik-Unterlagen. Claude Code schreibt die Werte danach als Metafelder `azizam_profil.*` (kopfnote, herznote,
basisnote als Listen; haltbarkeit, sillage 1–5; suesse … wuerzig 0–3) in Shopify. Bestätigte Werte ersetzen
abgeleitete automatisch.
