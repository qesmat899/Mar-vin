# SYNC.md – Übergabe zwischen Claude Chat und Claude Code (Azizam)

> Gemeinsame Datei für **Claude Chat** und **Claude Code**. Sie ist die einzige Brücke zwischen beiden.
> Zuletzt aktualisiert: 2026-11-05 [Code]

---

## Regeln (gelten für beide)

1. **Zu Beginn jeder Session:** Diese Datei komplett lesen, bevor du etwas tust.
   - Claude Code liest sie selbst aus dem Repo.
   - Claude Chat kann das Repo nicht lesen. Mar fügt die Datei am Chat-Anfang ein. Ist sie nicht da, bitte Mar darum.
2. **Am Ende einer Session, wenn sich der Übergabestatus geändert hat** (Stand, Entscheidung, offene Frage, Aufgabe): Datei aktualisieren. Kleine Änderungen gehören nicht hierher; die Git-Historie hält sie fest.
   - Claude Code bearbeitet die Datei direkt.
   - Claude Chat gibt einen **Update-Block** (Vorlage ganz unten) aus, den Mar in die Datei einfügt.
3. **Nur Gesichertes eintragen:** Was Mar gesagt oder entschieden hat, oder was wirklich umgesetzt wurde. Eigene Vorschläge gehören unter „Offene Fragen“ und beginnen mit „Vorschlag:“. Nie als Entscheidung eintragen.
4. **Jeder Eintrag bekommt Datum und Quelle:** `[Chat]` oder `[Code]`.
5. **Widerspruch:** Gilt Mars aktuelle Aussage, wird die Datei korrigiert. Veraltetes löschen, nicht stehen lassen.
6. **Keine Geheimnisse:** Keine Zugangsdaten, API-Keys, Kundendaten, Rechnungen oder Passwörter in dieser Datei.
7. **Kurz halten:** Maximal ca. 150 Zeilen. Im Log nur die 10 neuesten Einträge mit operativer Relevanz. Älteres in „Verlauf (zusammengefasst)“ in 1–2 Sätzen bündeln oder streichen, wenn es keine Relevanz mehr hat. Keine Datenwerte (Bestand, Preise, Mengen) kopieren, sondern auf die autoritative Datei verweisen. Prüfung: `python3 playbook.py hygiene`.
8. **Rollen:**
   - **Chat:** Strategie, Recherche, Entscheidungen, Texte, Abwägen (z. B. Flakon).
   - **Code:** Dateien, Website, Skripte, Shopify-Importe, Auswertungen.
   - Gehört eine Aufgabe in die andere Umgebung, wird sie unter „Aufgaben und Übergaben“ eingetragen.
9. **Abgrenzung:** Diese Datei und das ganze Repo betreffen nur Azizam.
10. **Kommerzielle Entscheidungen** (Preis, Rabatt, Offer, Bestellung, Sortiment, Experimente) stehen verbindlich im
    Decision Ledger `playbook/azizam/commercial/entscheidungen.csv`. Hier höchstens kurz mit `decision_id`. Die dauerhafte Entscheidungshistorie steht nur dort.

---

## Projekt in Kürze (stabil, nur bei echten Änderungen anpassen)

- **Was:** Azizam Fragrance, nebenberuflich, Kleinunternehmer nach § 19 UStG (keine MwSt.).
- **Produkt:** Nachmach-Düfte mit ca. 30 % Duftöl, Lieferant ist eine Parfumfabrik. Alle Düfte haben eigene Azizam-Namen. Die Fabrik liefert die Rechtsdokumente (u. a. Sicherheitsbewertung, INCI), Mar trägt die Produkte selbst im CPNP-Portal ein.
- **Zielgruppe:** 17,5 bis 25 Jahre. Bisherige Käufer ca. 19–23, kaufen für den Abend bzw. einen Duft, „der was bewirkt“.
- **Rückmeldungen bisher:** Viele Komplimente, gute Haltbarkeit. Meistgelobt: Velvet Vanilla.
- **Rahmen (nächste 3 Monate):** Investitionsbudget 500–1.500 €, unter 5 Std./Woche Zeit.
- **Repo:** `github.com/qesmat899/Mar-vin`, Haupt-Branch heißt `Azizam` und bleibt so.
- **Grundlage für Marketing/Wachstum:** E-Commerce-Playbook liegt im Repo: Original unter `docs/ECommerceBrandPlaybook.md` (+ PDF), Umsetzung für Azizam unter `playbook/` (Einstieg: `playbook/KONTEXT-EXPORT.md`, Stand 09.09.2026).

---

## Aktueller Stand (überschreiben, nicht anhängen)

- Bisher nur persönlicher Verkauf im Freundeskreis. **Aktuell kein Verkauf**, bis Flakon und Verpackung da sind.
- Positionierung noch nicht vorhanden. Alte Website (Vercel) offline.
- **Shop-Neubau in Shopify läuft (03.11.):** Entwurfs-Theme „Azizam – Entwurf (Claude)“ (unveröffentlicht, Live-Theme unverändert), **Shop ist live auf azizamfragrances.com** (Theme und Domain von Mar am 03./04.11. freigeschaltet), 19 Düfte aktiv mit je 10 Stück pro Größe (Mar, 04.11.) mit Azizam-Namen (03.11., in `duefte.csv`), 30/50 ml, Preise nach D-003 gesetzt; Bilder für alle Düfte (Produktfoto + Stimmungsbild), 3 Kollektionen nach Duftrichtung, Hauptmenü auf Deutsch. Duftdaten aus Mars Duftübersicht (PDF, 03.11.). Theme-Bausteine im Repo unter `shopify/theme/`. Hero zeigt Mars Flakon-Video (03.11.); auf der Startseite außerdem Kurations-Text, Duftkarte, Anlass-Finder, „ohne Bewertungen“-Block (Rückgabe-Absatz aus, bis Mar entscheidet) und Launch-Liste.
- Ziel: In den nächsten 3 Monaten deutschlandweit online verkaufen, Shop komplett neu starten.
- **Wichtigste und dringendste Aufgabe:** passender Flakon (bestenfalls zylindrisch) und Verpackung.

---

## Entscheidungen (dauerhaft, mit Datum)

- Frühere interne Namen (Originale) bleiben in `duefte.csv`; nur Kundentexte bleiben ohne fremde Markennamen. Berater: Assassin nicht „elegant“; Royal Cedar, Oud Majesté, Ombroso „unisex-maskulin“. [Mar, 2026-11-09]
- Kostenloser Versand ab 20 €, Details im Ledger `D-006`. [Mar, 2026-11-04]
- Reiseflakon 10 ml je Duft, kein Entdecker-Trio, Details im Ledger `D-005`. Theme-Änderungen als Kopie statt GitHub-Verbindung. [Mar, 2026-11-04]
- Discovery-Set als Einstiegsangebot, Details im Ledger `D-004`. [Mar, 2026-11-04]
- Verkaufspreise nach Originalpreis in zwei Stufen, verbindlich im Ledger `D-003`. [Mar, 2026-11-03]
- Azizam-Namen für alle 19 Düfte (Liste in `duefte.csv`); Markenprüfung der Namen und Intensität 1–5 je Duft (Metafeld `azizam.intensitaet`) von Mar als erledigt bestätigt. [Mar, 2026-11-03]
- Start mit **30 ml und 50 ml**. **100 ml kommt später**, wenn sich einige 30/50-ml-Flaschen verkauft haben. [Mar, 2026-10-03]
- Stil: luxuriös mit Goldakzent, hohe schlanke Form, Glas nicht foliert, Magnetkappe gewünscht. Max. ca. 3 € pro Flakon, erste Bestellung 100–200 Stück. [Chat, 2026-10]
- Drei zuvor vorgeschlagene Standardflakons (schwarz/kantig, mattschwarz mit Goldkappe, schwer quadratisch mit Box) wurden abgelehnt.
- Eigene Kreation/Sample erst später.
- Bleiben gültig aus dem Playbook (09/2026): 30 % Duftöl als Kernversprechen; keine erfundenen Bewertungen; keine Herstellungsaussagen wie „Handgefertigt in Deutschland“, „Seltene Zutaten“, „Haute Parfumerie“. [Mar, 2026-10-03]
- Les Sables Roses ist im Sortiment (`D-002`). [Mar, 2026-10-16]
- Kein Privatkram im Repo: Adresse, Telefon, USt-IdNr. stehen nur im Impressum. [Mar, 2026-10-03]
- Shop-Neustart im Shopify-Shop „My Store 3“ (pbznmb-fy.myshopify.com; Stand 04.10.: 0 Produkte, 0 Bestellungen). Buchhaltung macht der Steuerberater (kein Buchhaltungsprogramm). Geschäftsjahr = Kalenderjahr. Wochenüberblick montags. Claude-Plan: Pro. Geschäfts-E-Mail ist `azizamfragrance@gmail.com` (ohne „s“). [Mar, 2026-10-04]

---

## Offene Fragen

- KI-Duftberater: Claude-API-Kosten (geschätzt ca. 0,02 $ je Beratung mit Sonnet 5.5, Tageslimit 300) und Vercel-Hosting brauchen Mars Zustimmung; API wird separat von Pro bezahlt. Kopf-/Herz-/Basisnote, Haltbarkeit, Sillage sind für alle Düfte UNKNOWN (Vorlage: `npm run luecken`).
- 21st.dev: Der hinterlegte Schlüssel wird nicht als Konto erkannt (Antwort „signed-out“, nur 2 freie Abrufe/Tag; Hauptdomain `21st.dev` ohne Schlüssel, nur `api.21st.dev` bekommt ihn). Mar prüft Schlüssel bzw. Abo; der Duftberater braucht 21st.dev nicht.
- Weitere Bundles (Signature, Tag & Nacht) offen; Trio verworfen, Reiseflakon 10 ml umgesetzt (`D-005`). Stückkosten der Proben UNKNOWN.
- Theme-Änderungen laufen über Kopien, die Mar veröffentlicht (keine GitHub-Verbindung, Mar 04.11.). Live ist „Azizam – Duftberater 05.11. (Claude)“ (Mar, 05.11.); „Azizam – KI-Duftberater 05.11. (Claude)“ (Matching-Engine, Feinschliff-Schritt, Produkt-Feed) wartet auf Veröffentlichung durch Mar. Live ist seit 09.11. „Azizam – Favoriten 09.11. (Claude)“ (Mar). Neu: „Azizam – Berater-Fix 09.11. (Claude)“ (Favoriten-Stand plus neues Berater-Bundle) wartet auf Veröffentlichung durch Mar; der Berater-Server (Vercel) läuft seit dem Merge von PR #9 mit der neuen Logik.
- GPSR: Produktseiten brauchen Name, Post- und E-Mail-Adresse der verantwortlichen Person; bisher steht die Anschrift laut Entscheidung nur im Impressum. Mar entscheidet (Feld im Theme-Baustein „Azizam Produktinfos“).
- Rückgaberegel für den Neustart (30 Tage bei ≥ 80 % Füllung wie früher?) offen; erst danach den Rückgabe-Absatz auf der Startseite einschalten.
- Welcher Flakon wird es (in 30 und 50 ml)? (Hängt davon ab: Verpackung, Etikett, Shop-Neustart)
- Verpackung: wird gesucht.
- Ab wie vielen Verkäufen kommt 100 ml (und im selben Flakon-Design)? Offen.
- Stückkosten, Versandkosten, Gebühren, CAC und Retouren sind `UNKNOWN` (Mar, 05.10.2026); erst damit lässt sich die Marge der neuen Preise (D-003) prüfen.
- Etikettierung: Zum Etikett ist nichts geklärt.
- Kosmetikrecht: Die Fabrik stellt die nötigen Dokumente bereit (Sicherheitsbewertung, INCI u. a.), Mar trägt die Produkte selbst im CPNP-Portal der EU ein (Mar, 04.10.). Offen: Liste der Fabrik-Dokumente prüfen (deckt sie CPSR/PIF-Inhalte und die erweiterte Allergen-Kennzeichnung nach VO (EU) 2023/1545 ab?), CPNP-Eintrag je Duft vor dem ersten Onlineverkauf.
- Zwei Duftlinien (Heritage/Editions) aus dem Playbook: offen. Mar entscheidet erst, wenn Flakon, Verpackung und Tüte endgültig gekauft sind (Suche läuft, Stand 16.10.).
- Positionierung und Markenauftritt für die Zielgruppe.

---

## Aufgaben und Übergaben

| Wer | Aufgabe | Status |
|-----|---------|--------|
| Mar | Shop-Livegang: Shopify-Einstellungen (Sprache Deutsch, Shopname, Steuern aus, Versand, Zahlung), Rechtstexte, dann Theme veröffentlichen und Passwort entfernen. Checkliste im Chat vom 03.11. | in Arbeit |
| Mar | PR #6 prüfen und über das Merge nach `Azizam` entscheiden (offene Punkte in der PR-Beschreibung) | offen |
| Mar | Flakon (30 ml), Etikett und Verpackung selbst klären — ohne Claude, bis Mar es wieder einbringt | offen |
| Code | Struktur für Marketing-/Wachstums-Skills im Repo vorbereiten | offen |
| Mar | KI-Duftberater freischalten: (1) Anthropic-API-Schlüssel anlegen, (2) Claude Code anlegen lassen: Vercel-Projekt `azizam-berater` (Team MARN), Schlüssel trägt Mar dort selbst ein, (3) Theme-Kopie „Azizam – KI-Duftberater 05.11. (Claude)“ prüfen und veröffentlichen, (4) API-Adresse in der Section eintragen. Anleitung: `shopify/berater/README.md` | offen |
| Mar | Bestandsaufnahme ergänzen: Kaufdaten/Belege für Imagination und Les Sables Roses, Chargen Velvet Vanilla G-17 und Les Sables Roses G-19 (Termin 16.10. 18:30), Azizam-Namen (Aufgaben auch in Todoist, Projekt „Azizam“); danach Komponenten (Flakons, Proben, Verpackung) — Liste in `playbook/azizam/commercial/README.md` | in Arbeit |
| Mar | Dokumente der Fabrik je Duft sammeln und ins Repo/Drive legen; danach jeden Duft im CPNP-Portal eintragen | offen |
| Mar | `CLAUDE-MASTER.md` ins Chat-Projekt „Azizam“ hochladen; globale Anweisung und Memory aus `playbook/templates/claude-anweisungen.md` in claude.ai setzen | offen |

Status: `offen` · `in Arbeit` · `erledigt` (erledigte Zeilen nach dem nächsten Log-Eintrag löschen)

---

## Log (neueste oben, max. 10)

- **2026-11-09 [Code]** Auf Mars Wunsch Berater-Merkmale in Shopify geändert: Assassin ohne „elegant“ (nur noch „kraftvoll“); Royal Cedar, Oud Majesté, Ombroso jetzt „unisex-maskulin“. Simulation: bei „elegant“ kommt Assassin nicht mehr auf Platz 1. Server liest den Feed alle 10 Min., die Änderung wirkt ohne Deploy. Testdaten auf Shop-Stand 09.11. aktualisiert, 70 Tests grün. Originalnamen bleiben in `duefte.csv` (Mar).
- **2026-11-09 [Code]** Duftberater nachgeschärft (Mars Rückmeldung: zu oft Assassin, oft „kein Treffer“): Hauptmerkmal zählt mehr als Nebeneintrag, ganzjährig < passende Saison, unisex näher an maskulin/feminin, Gleichstand nicht mehr alphabetisch, KI-Urteil „passt“ beeinflusst die Reihenfolge, statt leerer Seite „Am nächsten dran“ (ehrlich gekennzeichnet, nie gegen KI-Veto). Simulation über 1.512 Antwortkombinationen: Assassin auf Platz 1 Herbst 11,8 → 7,3 %, Sommer 15,3 → 11,2 %; leere Ergebnisse Herbst 4,5 → 1,8 %, Sommer 9,7 → 6,3 %. 70 Tests grün. Server (Vercel) wird erst nach Merge aktiv; Browser-Bundle in Theme-Kopie „Berater-Fix 09.11.“. Mare Vita = Megamare, Borbus = Blue Talisman von Mar bestätigt (`duefte.csv`).
- **2026-11-09 [Code]** „Unsere Favoriten“ gebaut (Mars Auswahl: Dolce Sole, Calura, Ombroso, Velvet Vanilla, Mare Vita), bewusst nicht „Bestseller“ (bisher 1 Bestellung). Section `azizam-favoriten` + `assets/azizam-favoriten.css`, direkt unter dem Hero: Desktop aufklappende Paneele mit Auto-Wechsel, Handy wischbare Karten; Muster nach 21st.dev „Interactive Selector“. Nur in Theme-Kopie „Favoriten 09.11.“, nichts veröffentlicht. Hinweis: Metafeld `charakter` von Velvet Vanilla enthält „Von unseren Kunden am häufigsten gelobt“ (Beleg offen).
- **2026-11-09 [Code]** Auf Mars Wunsch Bildreihenfolge bei allen 19 Düften getauscht: Stimmungsbild (Cover) jetzt Bild 1, Flakon (Produkt) Bild 2. Folge mit der Theme-Logik (`media[1]` auf Karten): Startseite/Kollektion zeigen den Flakon, Produktseite öffnet mit dem Cover. Cover ist damit auch Vorschaubild in Warenkorb, Checkout und beim Teilen.
- **2026-11-05 [Code]** KI-Duftberater gebaut: deterministische Matching-Engine (Match-% nachvollziehbar, harte Ausschlüsse, Qualitäts-Gate, ehrlich „kein Treffer“), ein Claude-Aufruf je Beratung (Sonnet 5.5, JSON-Schema, serverseitige Validierung), Server für Vercel (`shopify/berater/api/`), Kostenprotokoll, 36 Kundenprofile + 29 weitere Tests grün. Ohne API-Schlüssel noch nicht live mit KI getestet. Neue Theme-Kopie „KI-Duftberater 05.11.“, nichts veröffentlicht.
- **2026-11-05 [Code]** Duftberater gebaut: React-Insel (Vite, React, Tailwind gekapselt, Motion), 4 Auswahlkarten-Fragen, Jahreszeit automatisch, Ergebnis mit Gründen + 2 Alternativen; Quelle `shopify/berater/`, Section `azizam-berater.liquid`. In neuer Theme-Kopie „Azizam – Duftberater 05.11. (Claude)“ eingespielt und in der Vorschau getestet (Desktop/Handy), nichts veröffentlicht.
- **2026-11-05 [Code]** Duftberater: Merkmale je Duft aus Online-Recherche (Bewertungen der Originale), von Mar abgesegnet, als Metafelder `azizam_berater.*` (tendenz, stimmung, saison, anlass, nicht_buero) in Shopify eingetragen. Rohdaten mit Originalnamen nur intern, nicht im Repo. 21st.dev: Mar hinterlegt API-Schlüssel in der Cloud-Umgebung, danach neue Session.
- **2026-11-04 [Code]** Gesamtcheck der Live-Seite (Desktop/Handy, Checkout, Rechtstexte). Live geändert: Discovery Set im Hauptmenü, Kontaktseite deutsch. Theme-Kopie „Check 04.11.“ mit den übrigen Korrekturen. Offen bei Mar: „Express 7,99 €“ und Name „Standard“ im Checkout (nicht im Versandprofil), Anschrift in der Kontakt-Richtlinie („Lilienweg 97084“), Versand-Richtlinie fehlt, Discovery-Bild.
- **2026-11-04 [Code]** Discovery-Set freigeschaltet; Versandprofil: 4,95 € unter 20 €, sonst kostenlos, Express und Auslandszonen entfernt; Versandseite angepasst.
- **2026-11-04 [Code]** 10-ml-Variante für alle 19 Düfte; Gutscheincode für Discovery-Käufer angelegt; Theme-Kopie mit Duft-Finder, Discovery-Auswahl, Vertrauensleiste, Logo/Favicon, ohne Ankündigungsleiste, neuem Haltung-Text.

### Verlauf (zusammengefasst)

- 2026-10-02/04: SYNC.md im Chat angelegt; `CLAUDE-MASTER.md` (Wissensbasis, über `CLAUDE.md` immer geladen) angelegt.
- 2026-10-03: `ARBEITSWEISE.md` (Werkzeug-Kompass) angelegt; wird beim Sessionstart mitgeladen, Claude Code erinnert Mar aktiv daran.
- 2026-10-03: Playbook-Kapitel 01, 03, 04, 06, 90-Tage-Plan, Briefing, Nächste Schritte und README bereinigt: 100 ml raus, Preise als `[Preis offen]`, Zahlen auf Kleinunternehmer/Flakon-Annahme; Kapitel 05 als Ganzes als veraltet markiert.
- 2026-10-03: Mars Klärungen eingearbeitet (Kleinunternehmer, kein Verkauf, CPNP offen, 30 + 50 ml, 100 ml später); Privatdaten aus den Dateien entfernt.

---

## Update-Block (Vorlage, von Claude Chat auszugeben)

Claude Chat gibt am Ende einer Session genau diesen Block aus. Mar fügt ihn in die passenden Abschnitte ein:

```
UPDATE für SYNC.md – [Datum] [Chat]

Aktueller Stand (ersetzen):
- ...

Neue Entscheidungen:
- ...

Offene Fragen (neu / erledigt):
- ...

Aufgaben und Übergaben (neu / Status geändert):
- Wer | Aufgabe | Status

Log-Eintrag:
- [Datum] [Chat] Ein Satz, was passiert ist.
```
