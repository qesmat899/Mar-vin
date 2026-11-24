# SYNC.md – Übergabe zwischen Claude Chat und Claude Code (Azizam)

> Gemeinsame Datei für **Claude Chat** und **Claude Code**. Sie ist die einzige Brücke zwischen beiden.
> Zuletzt aktualisiert: 2026-11-21 [Code]

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

- Bisher persönlicher Verkauf im Freundeskreis; seit 20.11. sind die fünf Drop-1-Düfte im Shop bestellbar (Kaufweg bis Warenkorb am 21.11. geprüft). Positionierung noch nicht festgelegt.
- **Shop live auf azizamfragrances.de** (Shopify-Shop „Azizam Fragrances“, einziger aktiver Shop seit 20.11.; .com leitet weiter). 19 Düfte mit Azizam-Namen (`duefte.csv`), 10/30/50 ml, Preise nach `D-007`, Grundpreis €/100 ml an allen Preisen. Shop im Pre-Launch (Passwortschutz). Live-Theme seit 24.11.: „Azizam #06 – Passwortseite Du bist dabei 24.11. (Claude)“ (von Mar veröffentlicht; Double-Opt-in mit eigener Mail, Bestätigung landet auf der Passwortseite mit „Du bist dabei“, getestet 24.11.). Theme-Bausteine im Repo unter `shopify/theme/`; Templates und Einstellungen gelten so, wie sie im Shopify-Theme stehen.
- Ziel: In den nächsten 3 Monaten deutschlandweit online verkaufen, Shop komplett neu starten.
- **Flakon und Verpackung provisorisch vorhanden** (Mar, 20.11.); endgültige Lösung weiter offen.
- **Drop-1-Teaser live (20.11.):** Theme „Azizam – Drop 1 Teaser 20.11. (Claude)“ von Mar veröffentlicht; Nebel als WebGL-Wolke (nach Aceternity „cloud-shader“, `assets/azizam-nebel.js` nur im Theme, Lizenz) live mit Mars Go. Die 14 dunklen Düfte stehen in Shopify auf „Entwurf“ (Ausblenden aus dem Kanal ist über den Konnektor gesperrt; Mars Go 20.11.); zum Enthüllen wieder auf „Aktiv“.
- **CPNP:** Für die fünf Drop-1-Düfte laut Mar vorhanden, damit verkaufsbereit (Mar, 20.11.); Nachweise noch nicht abgelegt.

---

## Entscheidungen (dauerhaft, mit Datum)

- Theme-Kopien von Claude werden fortlaufend nummeriert: „Azizam #NN – Inhalt TT.MM. (Claude)“; vergeben bis #02, **nächste: #03**. [Mar, 2026-11-09]
- Shop gewechselt: Alles läuft über den Shopify-Shop „Azizam Fragrances“ (pyxp-v308b4-80.myshopify.com), Hauptdomain azizamfragrances.de. [Mar, 2026-11-20]
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
- Buchhaltung macht der Steuerberater (kein Buchhaltungsprogramm). Geschäftsjahr = Kalenderjahr. Wochenüberblick montags. Claude-Plan: Pro. Geschäfts-E-Mail ist `azizamfragrance@gmail.com` (ohne „s“). [Mar, 2026-10-04]

---

## Offene Fragen

- **Bestand klären:** In Shopify stehen je Duft 10 Stück pro Größe (10/30/50 ml = 900 ml Duft, Mar 04.11.); die letzte Bestandsaufnahme im Repo (07.10., `bestand_bewegungen.csv`) zeigt bei allen Düften außer Velvet Vanilla weniger Duft (z. B. Sicilia Nobile ca. 95 ml). Mar: gibt es neuere Zugänge oder schon abgefüllte Flaschen? Dann in `bestand_bewegungen.csv` nachtragen.
- KI-Duftberater: Claude-API-Kosten (geschätzt ca. 0,02 $ je Beratung mit Sonnet 5.5, Tageslimit 300) und Vercel-Hosting brauchen Mars Zustimmung; API wird separat von Pro bezahlt. Kopf-/Herz-/Basisnote, Haltbarkeit, Sillage sind für alle Düfte UNKNOWN (Vorlage: `npm run luecken`).
- UI-Bibliotheken shadcn/ui, Magic UI, Aceternity UI über Skill `ui-komponenten` nutzbar (frei, ohne Schlüssel; Mar 20.11.). 21st.dev: Der hinterlegte Schlüssel wird nicht als Konto erkannt (Antwort „signed-out“, nur 2 freie Abrufe/Tag; Hauptdomain `21st.dev` ohne Schlüssel, nur `api.21st.dev` bekommt ihn). Mar prüft Schlüssel bzw. Abo; der Duftberater braucht 21st.dev nicht.
- Weitere Bundles (Signature, Tag & Nacht) offen; Trio verworfen, Reiseflakon 10 ml umgesetzt (`D-005`). Stückkosten der Proben UNKNOWN.
- Theme-Änderungen laufen über Kopien, die Mar veröffentlicht (keine GitHub-Verbindung, Mar 04.11.). Wartet: „Azizam #02 – Next Level 21.11. (Claude)“. Die Kopien aus „My Store 3“ (05.–11.11., u. a. #01 „Nächstbester Duft“) sind mit dem Shopwechsel hinfällig; ihre Inhalte stecken in #02.
- **KI-Duftberater ohne KI seit dem Shopwechsel:** Der Server (mar-vin.vercel.app) lehnte Anfragen von azizamfragrances.de ab (CORS, geprüft 21.11.), der Berater rechnete deshalb nur im Browser. Fix im Code (Branch `claude/relaxed-galileo-s09d74`), wirkt nach Merge und Vercel-Deploy. Ist in Vercel die Variable `ERLAUBTE_HERKUNFT` gesetzt, dort die .de-Domains ergänzen (Mar).
- Vorschlag: Geldformat in Shopify auf „12,99 €“ statt „€12,99“ (Einstellungen → Shopdetails → Währungsformat); Knopf „Auschecken“ → „Zur Kasse“ (Theme-Texte). Mar entscheidet.
- Shop-Einstellung „Preise inkl. Steuern“ ist an; der Warenkorb schrieb deshalb „Inkl. … Steuern“. In #02 per Theme durch den § 19-Hinweis ersetzt; Einstellung selbst mit dem Steuerberater prüfen (Mar).
- GPSR: Produktseiten brauchen Name, Post- und E-Mail-Adresse der verantwortlichen Person; bisher steht die Anschrift laut Entscheidung nur im Impressum. Mar entscheidet (Feld im Theme-Baustein „Azizam Produktinfos“).
- **Widerruf:** Hausnummer 8 ist richtig (Mar, 21.11.); Mar korrigiert Widerrufsbelehrung (2×) und AGB im Shopify-Admin (Konnektor darf Rechtstexte nicht ändern). Probe zu jeder 30/50-ml-Flasche (`D-009`), kein Siegel. Offen: Probengröße, Wiegen vor Versand/nach Rücksendung (Vorschlag), Hinweis auf Produktseite sobald Proben beiliegen, Rechtstexte-Dienst.
- Endgültiger Flakon (30/50 ml), Verpackung und Etikett offen (provisorisch vorhanden, Mar 20.11.); 100 ml erst nach den ersten Verkäufen.
- Stückkosten, Versandkosten, Gebühren, CAC und Retouren sind `UNKNOWN` (Mar, 05.10.2026); erst damit lässt sich die Marge der neuen Preise (D-003) prüfen.
- Kosmetikrecht: Die Fabrik stellt die nötigen Dokumente bereit (Sicherheitsbewertung, INCI u. a.), Mar trägt die Produkte selbst im CPNP-Portal der EU ein (Mar, 04.10.). Offen: Liste der Fabrik-Dokumente prüfen (deckt sie CPSR/PIF-Inhalte und die erweiterte Allergen-Kennzeichnung nach VO (EU) 2023/1545 ab?), CPNP-Eintrag je Duft vor dem ersten Onlineverkauf.
- Zwei Duftlinien (Heritage/Editions) aus dem Playbook: offen. Mar entscheidet erst, wenn Flakon, Verpackung und Tüte endgültig gekauft sind (Suche läuft, Stand 16.10.).
- Shop-Grundsprache ist Englisch (Rechtstext-Titel, „Email address“ u. a. erscheinen englisch). Vorschlag: in Shopify unter Einstellungen → Sprachen Deutsch als Standard setzen (Mar).
- Positionierung und Markenauftritt für die Zielgruppe.

---

## Aufgaben und Übergaben

| Wer | Aufgabe | Status |
|-----|---------|--------|
| Mar | **Zum Launch (Passwort weg):** Button-Link der Bestätigungs-Mail auf `{{ customer.subscribe_url }}` zurückstellen, sonst bestätigt niemand mehr (Hinweis im Kopf der Mail-Vorlage) | offen |
| Mar | Theme-Kopie „Azizam #02 – Next Level 21.11. (Claude)“ in der Vorschau prüfen und veröffentlichen; PR des Branches `claude/relaxed-galileo-s09d74` mergen (enthält auch die offenen Stände Drop 1, Grundpreis, Berater-Feinschliff und #11) | offen |
| Mar | Vor den Pixeln klären (Todoist, Label `vor-pixel`): CPNP je Duft eingetragen? · LUCID registriert? · GPSR-Angaben auf Produktseiten · Hausnummer Impressum/Widerruf vereinheitlichen · Titel und Meta-Beschreibung der Startseite im Admin | offen |
| Mar | Pixel: Shopify-Apps „Facebook & Instagram“ und „TikTok“ verbinden, Datenschutzerklärung ergänzen, Double-Opt-in an, Testkauf (Anleitung im Artifact „Azizam Release-Plan“) | offen |
| Mar | CPNP-Nachweise der fünf Drop-1-Düfte ablegen (Drive/Repo) | offen |
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

- **2026-11-21 [Code]** „Next Level“ in Theme-Kopie #02 (nichts veröffentlicht): Duftberater-Felder in Creme mit Goldlinie und dunklen Buchstaben-Tasten (Wunsch Mar), Skript lädt erst bei Bedarf; Startseite neu geordnet (Hero mit Faktenzeile und Link zum Berater → Die ersten fünf → „Erst testen“ mit Live-Preisen → Berater → Warum Azizam → Nach Anlass → Teaser ohne doppelte Düfte → FAQ mit 11 Fragen); Duftfarbe (Bildfarbe des Dufts als Schein) auf Favoriten, Kacheln und Duftwelt; Produktseite „Erst testen?“; Warenkorb deutsch, § 19-Hinweis, Versand-Fortschritt (aus #11). Vier offene Branches zusammengeführt. 121 Berater-Tests, 66 Python-Tests grün.
- **2026-11-21 [Code]** Grundpreis €/100 ml an allen Preisen und Hero-Video-Fix live (Mar); Probe zu jeder 30/50-ml-Flasche als `D-009` (Hinweis erst, wenn Proben beiliegen).
- **2026-11-20 [Code]** Teaser live: Kollektion `drop-1` (fünf Düfte), fünf Fragezeichen-Karten, neun im Nebel („Bald geht es weiter“, Mar); Startseite ohne „Begriffe“, Footer ohne Newsletter und Menü, nur Aufklappmenü „Rechtliches“ (Impressum, AGB, Widerruf, Versand, Datenschutz, Kontakt; deutsche Bezeichnungen im Theme, weil die Shop-Grundsprache Englisch ist); Nebel als WebGL-Wolke neu (Mars Kritik an der CSS-Wolke), Theme mit Mars Go neu veröffentlicht; 14 Düfte auf „Entwurf“ (Direktlinks 404). Skill `ui-komponenten` (shadcn/ui, Magic UI, Aceternity UI) angelegt.
- **2026-11-20 [Code]** Preisleiter B (`D-007`) live in Shopify. Drop 1 (`D-008`): Velvet Vanilla, Dolce Sole, Orphéa, Calura, Assassin. Theme-Kopie „Azizam – Drop 1 Teaser 20.11. (Claude)“: 5 Fragezeichen-Karten (Hinweis aus Metafeld `noten`) + 9 im Nebel (Kennung d01–d14, Zuordnung in der Block-Notiz), Kollektion `drop-1` angelegt, Warteliste mit Tags `warteliste`/`interesse-dXX`, Favoriten = Drop 1, alte Launch-Liste aus; nichts veröffentlicht. Cookie-Banner läuft, Meta/TikTok-Pixel fehlen (Apps, Mar).
- **2026-11-09 [Code]** Duftberater neu (Auftrag Mar): adaptive Beratung (3–5 einfache Fragen, Mittel 4,1), Freitext neu (Abneigung hart, „nicht zu …“ weich), Bewertung nach Duftprofil (12 Merkmale mit Status bestätigt/geschätzt/unbekannt), Ergebnis ohne Prozent mit Begründung, Unterschied der Alternativen, 10-ml-Link und Nachjustieren. 17 Metafeld-Definitionen `azizam_profil.*` in Shopify angelegt (Pflege im Admin), Kontrolle `npm run profile`. 119 Tests grün; `npm run qualitaet`: 41/41 Kundenprofile, 0 Verstöße, 1,1 % leer. Offen: Dolce Sole 21,9 % Platz 1 (Ziel ≤ 15 %), Profilwerte von Mar bestätigen.

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
