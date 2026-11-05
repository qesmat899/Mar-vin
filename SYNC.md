# SYNC.md – Übergabe zwischen Claude Chat und Claude Code (Azizam)

> Gemeinsame Datei für **Claude Chat** und **Claude Code**. Sie ist die einzige Brücke zwischen beiden.
> Zuletzt aktualisiert: 2026-11-03 [Code]

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

- Weitere Bundles (Signature, Tag & Nacht) offen; Trio verworfen, Reiseflakon 10 ml umgesetzt (`D-005`). Stückkosten der Proben UNKNOWN.
- Theme-Änderungen laufen über Kopien, die Mar veröffentlicht (keine GitHub-Verbindung, Mar 04.11.). „Azizam – Update 04.11.“ ist live; „Azizam – Check 04.11. (Claude)“ (Footer mit Rechtslinks, deutsche Texte, Vertrauensleiste 20 €, Discovery-Kachel) wartet auf Veröffentlichung durch Mar.
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
| Mar | Bestandsaufnahme ergänzen: Kaufdaten/Belege für Imagination und Les Sables Roses, Chargen Velvet Vanilla G-17 und Les Sables Roses G-19 (Termin 16.10. 18:30), Azizam-Namen (Aufgaben auch in Todoist, Projekt „Azizam“); danach Komponenten (Flakons, Proben, Verpackung) — Liste in `playbook/azizam/commercial/README.md` | in Arbeit |
| Mar | Dokumente der Fabrik je Duft sammeln und ins Repo/Drive legen; danach jeden Duft im CPNP-Portal eintragen | offen |
| Mar | `CLAUDE-MASTER.md` ins Chat-Projekt „Azizam“ hochladen; globale Anweisung und Memory aus `playbook/templates/claude-anweisungen.md` in claude.ai setzen | offen |

Status: `offen` · `in Arbeit` · `erledigt` (erledigte Zeilen nach dem nächsten Log-Eintrag löschen)

---

## Log (neueste oben, max. 10)

- **2026-11-05 [Code]** Duftberater: Merkmale je Duft aus Online-Recherche (Bewertungen der Originale), von Mar abgesegnet, als Metafelder `azizam_berater.*` (tendenz, stimmung, saison, anlass, nicht_buero) in Shopify eingetragen. Rohdaten mit Originalnamen nur intern, nicht im Repo. 21st.dev: Mar hinterlegt API-Schlüssel in der Cloud-Umgebung, danach neue Session.
- **2026-11-04 [Code]** Gesamtcheck der Live-Seite (Desktop/Handy, Checkout, Rechtstexte). Live geändert: Discovery Set im Hauptmenü, Kontaktseite deutsch. Theme-Kopie „Check 04.11.“ mit den übrigen Korrekturen. Offen bei Mar: „Express 7,99 €“ und Name „Standard“ im Checkout (nicht im Versandprofil), Anschrift in der Kontakt-Richtlinie („Lilienweg 97084“), Versand-Richtlinie fehlt, Discovery-Bild.
- **2026-11-04 [Code]** Discovery-Set freigeschaltet; Versandprofil: 4,95 € unter 20 €, sonst kostenlos, Express und Auslandszonen entfernt; Versandseite angepasst.
- **2026-11-04 [Code]** 10-ml-Variante für alle 19 Düfte; Gutscheincode für Discovery-Käufer angelegt; Theme-Kopie mit Duft-Finder, Discovery-Auswahl, Vertrauensleiste, Logo/Favicon, ohne Ankündigungsleiste, neuem Haltung-Text.
- **2026-11-04 [Code]** Logo (Wortmarke, Symbol) in Shopify-Dateien hochgeladen; Discovery-Set als Entwurfsprodukt angelegt (D-004).
- **2026-11-04 [Code]** Hero-Video auf Handys repariert (eigene 720×1280-Datei, robustere Wiedergabe) im unveröffentlichten Theme „Azizam – Video-Fix (Claude)“; Mar muss es veröffentlichen. Interne Duftreferenz (Azizam-Name → Original) als PDF an Mar übergeben, bewusst nicht im öffentlichen Repo.
- **2026-11-04 [Code]** Rechtsseiten angelegt (Impressum, AGB, Widerrufsbelehrung ohne Versiegelungs-Ausschluss, Versand: DHL, 4,95 €, frei ab 60 €, 2–4 Werktage, nur DE), im Footer verlinkt; Bestand 10 je Duft und Größe. Offen bei Mar: Versandprofil in Shopify angleichen, Richtlinienfelder füllen, Datenschutz auf Deutsch, Steuern aus, PayPal/Klarna, Haltung-Text („selbst her“) und Ehrlich-Abschnitt im Theme-Editor.
- **2026-11-03 [Code]** Auf Mars Wunsch alle 19 Produkte aktiviert und im Onlineshop-Kanal veröffentlicht; Shop bleibt passwortgeschützt, Live-Theme unverändert. Bestand steht auf 0 (Ausverkauft-Anzeige), bis Mar echte Stückzahlen nennt.
- **2026-11-03 [Code]** Preise für alle 19 Düfte in Shopify gesetzt (D-003), Grundpreis €/100 ml läuft automatisch.
- **2026-11-03 [Code]** Bilder Dunkel & edel (7 Düfte) hochgeladen; alle 19 Produkte haben Produktfoto und Stimmungsbild.

### Verlauf (zusammengefasst)

- 2026-10-04: `CLAUDE-MASTER.md` angelegt (Wissensbasis aus Mars Recherche-Texten, über `CLAUDE.md` immer geladen).
- 2026-10-03: 100 ml als spätere Größe wieder aufgenommen (nach ersten 30/50-Verkäufen).
- 2026-10-03: `ARBEITSWEISE.md` (Werkzeug-Kompass) angelegt; wird beim Sessionstart mitgeladen, Claude Code erinnert Mar aktiv daran.
- 2026-10-03: Playbook-Kapitel 01, 03, 04, 06, 90-Tage-Plan, Briefing, Nächste Schritte und README bereinigt: 100 ml raus, Preise als `[Preis offen]`, Zahlen auf Kleinunternehmer/Flakon-Annahme; Kapitel 05 als Ganzes als veraltet markiert.
- 2026-10-02: SYNC.md im Chat angelegt und ins Repo gelegt.
- 2026-10-03: Mars Antworten eingearbeitet (kein Verkauf aktuell, CPNP offen), Adresse/Telefon/USt-IdNr. aus den Dateien entfernt, Steuerteil auf Kleinunternehmer umgestellt.
- 2026-10-03: Playbook (`docs/ECommerceBrandPlaybook.md`) und `playbook/KONTEXT-EXPORT.md` lagen schon im Repo, hochgeladene Fassung identisch; Widersprüche zu dieser Datei unter „Offene Fragen“ eingetragen. Mars Klärung (Kleinunternehmer, 30 + 50 ml, Preise offen, Website offline) in `brand.json` und Kontext-Export eingearbeitet.

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
