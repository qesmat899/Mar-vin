# SYNC.md – Übergabe zwischen Claude Chat und Claude Code (Azizam)

> Gemeinsame Datei für **Claude Chat** und **Claude Code**. Sie ist die einzige Brücke zwischen beiden.
> Zuletzt aktualisiert: 2026-11-20 [Code]

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
- **Shop-Neubau in Shopify läuft (03.11.):** Entwurfs-Theme „Azizam – Entwurf (Claude)“ (unveröffentlicht, Live-Theme unverändert), **Shop ist live auf azizamfragrances.com** (Theme und Domain von Mar am 03./04.11. freigeschaltet), 19 Düfte aktiv mit je 10 Stück pro Größe (Mar, 04.11.) mit Azizam-Namen (03.11., in `duefte.csv`), 30/50 ml, Preise nach D-007 (seit 20.11. live); Bilder für alle Düfte (Produktfoto + Stimmungsbild), 3 Kollektionen nach Duftrichtung, Hauptmenü auf Deutsch. Duftdaten aus Mars Duftübersicht (PDF, 03.11.). Theme-Bausteine im Repo unter `shopify/theme/`. Hero zeigt Mars Flakon-Video (03.11.); auf der Startseite außerdem Kurations-Text, Duftkarte, Anlass-Finder, „ohne Bewertungen“-Block (Rückgabe-Absatz aus, bis Mar entscheidet) und Launch-Liste.
- Ziel: In den nächsten 3 Monaten deutschlandweit online verkaufen, Shop komplett neu starten.
- **Flakon und Verpackung provisorisch vorhanden** (Mar, 20.11.); endgültige Lösung weiter offen.
- **CPNP:** Mar trägt zuerst fünf Düfte ein; Velvet Vanilla ist eingetragen (Mar, 20.11.), die übrigen vier offen.

---

## Entscheidungen (dauerhaft, mit Datum)

- Preisleiter einheitlich für alle Düfte: 10 ml 12,99 €, 30 ml 29,99 €, 50 ml 44,99 €, verbindlich im Ledger `D-007` (ersetzt D-003 und D-005). [Mar, 2026-11-20]
- Frühere interne Namen (Originale) bleiben in `duefte.csv`; nur Kundentexte bleiben ohne fremde Markennamen. Berater: Assassin nicht „elegant“; Royal Cedar, Oud Majesté, Ombroso „unisex-maskulin“. [Mar, 2026-11-09]
- Kostenloser Versand ab 20 €, Details im Ledger `D-006`. [Mar, 2026-11-04]
- Reiseflakon 10 ml je Duft, kein Entdecker-Trio (heute in `D-007`). Theme-Änderungen als Kopie statt GitHub-Verbindung. [Mar, 2026-11-04]
- Discovery-Set als Einstiegsangebot, Details im Ledger `D-004`. [Mar, 2026-11-04]
- Azizam-Namen für alle 19 Düfte (Liste in `duefte.csv`); Markenprüfung der Namen und Intensität 1–5 je Duft (Metafeld `azizam.intensitaet`) von Mar als erledigt bestätigt. [Mar, 2026-11-03]
- Start mit **30 ml und 50 ml**. **100 ml kommt später**, wenn sich einige 30/50-ml-Flaschen verkauft haben. [Mar, 2026-10-03]
- Stil: luxuriös mit Goldakzent, hohe schlanke Form, Glas nicht foliert, Magnetkappe gewünscht. Max. ca. 3 € pro Flakon, erste Bestellung 100–200 Stück. [Chat, 2026-10]
- Drei zuvor vorgeschlagene Standardflakons (schwarz/kantig, mattschwarz mit Goldkappe, schwer quadratisch mit Box) wurden abgelehnt.
- Eigene Kreation/Sample erst später.
- Bleiben gültig aus dem Playbook (09/2026): 30 % Duftöl als Kernversprechen; keine erfundenen Bewertungen; keine Herstellungsaussagen wie „Handgefertigt in Deutschland“, „Seltene Zutaten“, „Haute Parfumerie“. [Mar, 2026-10-03]
- Les Sables Roses ist im Sortiment (`D-002`). [Mar, 2026-10-16]
- Kein Privatkram im Repo: Adresse, Telefon, USt-IdNr. stehen nur im Impressum. [Mar, 2026-10-03]
- Shop läuft seit 19.11. im neuen Shopify-Shop „Azizam Fragrances“ (pyxp-v308b4-80.myshopify.com, Domain azizamfragrances.de; .com leitet weiter), Theme „Azizam (Kopie aus My Store 3)“ live; vorher „My Store 3“ (pbznmb-fy). [Code, festgestellt 20.11.] Buchhaltung macht der Steuerberater (kein Buchhaltungsprogramm). Geschäftsjahr = Kalenderjahr. Wochenüberblick montags. Claude-Plan: Pro. Geschäfts-E-Mail ist `azizamfragrance@gmail.com` (ohne „s“). [Mar, 2026-10-04]

---

## Offene Fragen

- **Bestand klären:** In Shopify stehen je Duft 10 Stück pro Größe (10/30/50 ml = 900 ml Duft, Mar 04.11.); die letzte Bestandsaufnahme im Repo (07.10., `bestand_bewegungen.csv`) zeigt bei allen Düften außer Velvet Vanilla weniger Duft (z. B. Sicilia Nobile ca. 95 ml). Mar: gibt es neuere Zugänge oder schon abgefüllte Flaschen? Dann in `bestand_bewegungen.csv` nachtragen.
- **Drop-Teaser live schalten:** Mar prüft und veröffentlicht die Theme-Kopie „Drop 1 Teaser 20.11.“; gleichzeitig müssen die 14 dunklen Düfte im Onlineshop ausgeblendet werden (Code nach Mars Go), sonst stehen sie doppelt da. Hinweise auf den Karten von Mar bestätigen.

- KI-Duftberater: Claude-API-Kosten (geschätzt ca. 0,02 $ je Beratung mit Sonnet 5.5, Tageslimit 300) und Vercel-Hosting brauchen Mars Zustimmung; API wird separat von Pro bezahlt. Kopf-/Herz-/Basisnote, Haltbarkeit, Sillage sind für alle Düfte UNKNOWN (Vorlage: `npm run luecken`).
- 21st.dev: Der hinterlegte Schlüssel wird nicht als Konto erkannt (Antwort „signed-out“, nur 2 freie Abrufe/Tag; Hauptdomain `21st.dev` ohne Schlüssel, nur `api.21st.dev` bekommt ihn). Mar prüft Schlüssel bzw. Abo; der Duftberater braucht 21st.dev nicht.
- Weitere Bundles (Signature, Tag & Nacht) offen; Trio verworfen, Reiseflakon 10 ml umgesetzt (`D-005`). Stückkosten der Proben UNKNOWN.
- Theme-Änderungen laufen über Kopien, die Mar veröffentlicht (keine GitHub-Verbindung, Mar 04.11.). Live ist „Azizam – Duftberater 05.11. (Claude)“ (Mar, 05.11.); „Azizam – KI-Duftberater 05.11. (Claude)“ (Matching-Engine, Feinschliff-Schritt, Produkt-Feed) wartet auf Veröffentlichung durch Mar. Live ist seit 09.11. „Azizam – Favoriten 09.11. (Claude)“ (Mar). Live ist „Azizam – Berater-Fix 09.11. (Claude)“ (Mar, 09.11.). Neu: „Azizam – Berater neu 09.11. (Claude)“ mit adaptivem Duftberater wartet auf Veröffentlichung durch Mar (sicher auch vor dem Merge: antwortet der Server noch im alten Format, rechnet die Seite selbst mit der neuen Engine; KI-Erklärungen kommen erst nach dem Merge).
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
| Mar | Pixel: Shopify-Apps „Facebook & Instagram“ und „TikTok“ verbinden, Datenschutzerklärung ergänzen, Double-Opt-in an, Testkauf (Anleitung im Artifact „Azizam Release-Plan“) | offen |
| Mar | CPNP für Dolce Sole, Orphéa, Calura, Assassin | offen |
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

- **2026-11-20 [Code]** Preisleiter B (`D-007`) live in Shopify. Drop 1 (`D-008`): Velvet Vanilla, Dolce Sole, Orphéa, Calura, Assassin. Theme-Kopie „Azizam – Drop 1 Teaser 20.11. (Claude)“: 14 dunkle Karten (Hinweis aus Metafeld `noten`, Kennung d01–d14, Zuordnung in der Block-Notiz), Warteliste mit Tags `warteliste`/`interesse-dXX`, Favoriten = Drop 1, alte Launch-Liste aus; nichts veröffentlicht. Cookie-Banner läuft, Meta/TikTok-Pixel fehlen (Apps, Mar).
- **2026-11-09 [Code]** Duftberater neu (Auftrag Mar): adaptive Beratung (3–5 einfache Fragen, Mittel 4,1), Freitext neu (Abneigung hart, „nicht zu …“ weich), Bewertung nach Duftprofil (12 Merkmale mit Status bestätigt/geschätzt/unbekannt), Ergebnis ohne Prozent mit Begründung, Unterschied der Alternativen, 10-ml-Link und Nachjustieren. 17 Metafeld-Definitionen `azizam_profil.*` in Shopify angelegt (Pflege im Admin), Kontrolle `npm run profile`. 119 Tests grün; `npm run qualitaet`: 41/41 Kundenprofile, 0 Verstöße, 1,1 % leer. Offen: Dolce Sole 21,9 % Platz 1 (Ziel ≤ 15 %), Profilwerte von Mar bestätigen.
- **2026-11-09 [Code]** Auf Mars Wunsch Berater-Merkmale in Shopify geändert: Assassin ohne „elegant“ (nur noch „kraftvoll“); Royal Cedar, Oud Majesté, Ombroso jetzt „unisex-maskulin“. Simulation: bei „elegant“ kommt Assassin nicht mehr auf Platz 1. Server liest den Feed alle 10 Min., die Änderung wirkt ohne Deploy. Testdaten auf Shop-Stand 09.11. aktualisiert, 70 Tests grün. Originalnamen bleiben in `duefte.csv` (Mar).
- **2026-11-09 [Code]** Duftberater nachgeschärft (Mars Rückmeldung: zu oft Assassin, oft „kein Treffer“): Hauptmerkmal zählt mehr als Nebeneintrag, ganzjährig < passende Saison, unisex näher an maskulin/feminin, Gleichstand nicht mehr alphabetisch, KI-Urteil „passt“ beeinflusst die Reihenfolge, statt leerer Seite „Am nächsten dran“ (ehrlich gekennzeichnet, nie gegen KI-Veto). Simulation über 1.512 Antwortkombinationen: Assassin auf Platz 1 Herbst 11,8 → 7,3 %, Sommer 15,3 → 11,2 %; leere Ergebnisse Herbst 4,5 → 1,8 %, Sommer 9,7 → 6,3 %. 70 Tests grün. Server (Vercel) wird erst nach Merge aktiv; Browser-Bundle in Theme-Kopie „Berater-Fix 09.11.“. Mare Vita = Megamare, Borbus = Blue Talisman von Mar bestätigt (`duefte.csv`).
- **2026-11-05 [Code]** KI-Duftberater gebaut: deterministische Matching-Engine (Match-% nachvollziehbar, harte Ausschlüsse, Qualitäts-Gate, ehrlich „kein Treffer“), ein Claude-Aufruf je Beratung (Sonnet 5.5, JSON-Schema, serverseitige Validierung), Server für Vercel (`shopify/berater/api/`), Kostenprotokoll, 36 Kundenprofile + 29 weitere Tests grün. Ohne API-Schlüssel noch nicht live mit KI getestet. Neue Theme-Kopie „KI-Duftberater 05.11.“, nichts veröffentlicht.

### Verlauf (zusammengefasst)

- 2026-11-04/09: Gesamtcheck Live-Seite, Versandprofil (4,95 € unter 20 €), Discovery-Set live; Duftberater als React-Insel mit Metafeldern `azizam_berater.*`; Bildreihenfolge getauscht (Stimmungsbild zuerst).
- 2026-10-02/04: SYNC.md, `CLAUDE-MASTER.md` und `ARBEITSWEISE.md` angelegt.

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
