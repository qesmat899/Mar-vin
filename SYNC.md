# SYNC.md – Übergabe zwischen Claude Chat und Claude Code (Azizam)

> Gemeinsame Datei für **Claude Chat** und **Claude Code**. Sie ist die einzige Brücke zwischen beiden.
> Zuletzt aktualisiert: 2026-10-04 [Code]

---

## Regeln (gelten für beide)

1. **Zu Beginn jeder Session:** Diese Datei komplett lesen, bevor du etwas tust.
   - Claude Code liest sie selbst aus dem Repo.
   - Claude Chat kann das Repo nicht lesen. Mar fügt die Datei am Chat-Anfang ein. Ist sie nicht da, bitte Mar darum.
2. **Am Ende jeder Session** (und nach jeder wichtigen Entscheidung): Datei aktualisieren.
   - Claude Code bearbeitet die Datei direkt.
   - Claude Chat gibt einen **Update-Block** (Vorlage ganz unten) aus, den Mar in die Datei einfügt.
3. **Nur Gesichertes eintragen:** Was Mar gesagt oder entschieden hat, oder was wirklich umgesetzt wurde. Eigene Vorschläge gehören unter „Offene Fragen“ und beginnen mit „Vorschlag:“. Nie als Entscheidung eintragen.
4. **Jeder Eintrag bekommt Datum und Quelle:** `[Chat]` oder `[Code]`.
5. **Widerspruch:** Gilt Mars aktuelle Aussage, wird die Datei korrigiert. Veraltetes löschen, nicht stehen lassen.
6. **Keine Geheimnisse:** Keine Zugangsdaten, API-Keys, Kundendaten, Rechnungen oder Passwörter in dieser Datei.
7. **Kurz halten:** Maximal ca. 150 Zeilen. Im Log nur die 10 neuesten Einträge. Älteres in „Verlauf (zusammengefasst)“ in 1–2 Sätzen bündeln.
8. **Rollen:**
   - **Chat:** Strategie, Recherche, Entscheidungen, Texte, Abwägen (z. B. Flakon).
   - **Code:** Dateien, Website, Skripte, Shopify-Importe, Auswertungen.
   - Gehört eine Aufgabe in die andere Umgebung, wird sie unter „Aufgaben und Übergaben“ eingetragen.
9. **Abgrenzung:** Diese Datei gilt nur für Azizam. Für Haus & Grün Konzept eine eigene Datei `SYNC-hausgruen.md` anlegen.

---

## Projekt in Kürze (stabil, nur bei echten Änderungen anpassen)

- **Was:** Azizam Fragrance, nebenberuflich, Kleinunternehmer nach § 19 UStG (keine MwSt.).
- **Produkt:** Nachmach-Düfte mit ca. 30 % Duftöl, Lieferant ist eine Parfumfabrik. Alle Düfte haben eigene Azizam-Namen. Sicherheitsbewertung und CPNP sollen über die Fabrik laufen, sind aber noch nicht schriftlich bestätigt.
- **Zielgruppe:** 17,5 bis 25 Jahre. Bisherige Käufer ca. 19–23, kaufen für den Abend bzw. einen Duft, „der was bewirkt“.
- **Rückmeldungen bisher:** Viele Komplimente, gute Haltbarkeit. Meistgelobt: Velvet Vanilla.
- **Rahmen (nächste 3 Monate):** Investitionsbudget 500–1.500 €, unter 5 Std./Woche Zeit.
- **Repo:** `github.com/qesmat899/Mar-vin`, Haupt-Branch heißt `Azizam` und bleibt so.
- **Grundlage für Marketing/Wachstum:** E-Commerce-Playbook liegt im Repo: Original unter `docs/ECommerceBrandPlaybook.md` (+ PDF), Umsetzung für Azizam unter `playbook/` (Einstieg: `playbook/KONTEXT-EXPORT.md`, Stand 09.09.2026).

---

## Aktueller Stand (überschreiben, nicht anhängen)

- Bisher nur persönlicher Verkauf im Freundeskreis. **Aktuell kein Verkauf**, bis Flakon und Verpackung da sind.
- Positionierung noch nicht vorhanden. Website (Single-Page, Shopify, Vercel) war bis ca. 25.09.2026 live, jetzt offline und veraltet.
- Website kann erst gebaut werden, wenn der Flakon feststeht (Flakon ist Teil der Website).
- Ziel: In den nächsten 3 Monaten deutschlandweit online verkaufen, Shop komplett neu starten.
- **Wichtigste und dringendste Aufgabe:** passender Flakon (bestenfalls zylindrisch) und Verpackung.

---

## Entscheidungen (dauerhaft, mit Datum)

- Start mit **30 ml und 50 ml**. **100 ml kommt später**, wenn sich einige 30/50-ml-Flaschen verkauft haben. [Mar, 2026-10-03]
- Stil: luxuriös mit Goldakzent, hohe schlanke Form, Glas nicht foliert, Magnetkappe gewünscht. Max. ca. 3 € pro Flakon, erste Bestellung 100–200 Stück. [Chat, 2026-10]
- Drei zuvor vorgeschlagene Standardflakons (schwarz/kantig, mattschwarz mit Goldkappe, schwer quadratisch mit Box) wurden abgelehnt.
- Eigene Kreation/Sample erst später.
- Bleiben gültig aus dem Playbook (09/2026): 30 % Duftöl als Kernversprechen; keine erfundenen Bewertungen; keine Herstellungsaussagen wie „Handgefertigt in Deutschland“, „Seltene Zutaten“, „Haute Parfumerie“. [Mar, 2026-10-03]
- Kein Privatkram im Repo: Adresse, Telefon, USt-IdNr. stehen nur im Impressum. [Mar, 2026-10-03]
- Shop-Neustart im Shopify-Shop „My Store 3“ (pbznmb-fy.myshopify.com; Stand 04.10.: 0 Produkte, 0 Bestellungen). Buchhaltung macht der Steuerberater (kein Buchhaltungsprogramm). Geschäftsjahr = Kalenderjahr. Wochenüberblick montags. Geschäfts-E-Mail ist `azizamfragrance@gmail.com` (ohne „s“). [Mar, 2026-10-04]

---

## Offene Fragen

- Welcher Flakon wird es (in 30 und 50 ml)? (Hängt davon ab: Verpackung, Etikett, Shop-Neustart)
- Verpackung: wird gesucht.
- Ab wie vielen Verkäufen kommt 100 ml (und im selben Flakon-Design)? Offen.
- Preise für 30 und 50 ml: offen. Rechengrundlage in `brand.json` sind die alten Preise.
- Etikettierung: Zum Etikett ist nichts geklärt.
- Kosmetikrecht (CPNP, Sicherheitsbewertung, INCI): Fabrik soll es übernehmen, schriftliche Bestätigung fehlt. Muss vor dem ersten Onlineverkauf stehen. Dabei auch die erweiterte Duftallergen-Kennzeichnung nach VO (EU) 2023/1545 klären (gilt für Produkte, die ab 31.07.2026 in Verkehr gebracht werden).
- Vorschlag: Welcher Claude-Plan (Pro, Max 5x, Max 20x) passt zu 500–1.500 € Budget und unter 5 Std./Woche? Abwägung in `CLAUDE-MASTER.md` §4. Offen.
- Zwei Duftlinien (Heritage/Editions) aus dem Playbook: Mar ist unsicher, offen.
- Positionierung und Markenauftritt für die Zielgruppe.

---

## Aufgaben und Übergaben

| Wer | Aufgabe | Status |
|-----|---------|--------|
| Chat | Flakon-Optionen recherchieren und bewerten (30 + 50 ml) | offen |
| Code | Struktur für Marketing-/Wachstums-Skills im Repo vorbereiten | offen |
| Mar | Bei der Fabrik schriftlich bestätigen lassen: CPNP, Sicherheitsbewertung, INCI für die Azizam-Namen | offen |
| Mar | `CLAUDE-MASTER.md` ins Chat-Projekt „Azizam“ hochladen; globale Anweisung und Memory aus `playbook/templates/claude-anweisungen.md` in claude.ai setzen | offen |

Status: `offen` · `in Arbeit` · `erledigt` (erledigte Zeilen nach dem nächsten Log-Eintrag löschen)

---

## Log (neueste oben, max. 10)

- **2026-10-04 [Code]** E-Mail-Adresse korrigiert auf `azizamfragrance@gmail.com` (`brand.json`, `07-recht-retention.md`).
- **2026-10-04 [Code]** Small-Business-Plugin eingerichtet: Profil `BUSINESS-CONTEXT.md` (von Mar bestätigt, über `CLAUDE.md` immer geladen), Aufbauplan in Stufen mit passenden Plugin-Skills in `playbook/azizam/SYSTEM-AUFBAU.md`. Shopify geprüft (nur gelesen).
- **2026-10-04 [Code]** `CLAUDE-MASTER.md` angelegt: Wissensbasis aus Mars sechs Recherche-Texten (Claude-Funktionen, Modelle, Compliance-System, Agenten, Freigaben, Routinen), auf Azizam zugeschnitten, Ungeprüftes markiert. Wird über `CLAUDE.md` immer geladen. Fertige Anweisungen in `playbook/templates/claude-anweisungen.md`.
- **2026-10-03 [Code]** 100 ml als spätere Größe wieder aufgenommen (nach ersten 30/50-Verkäufen): `SYNC.md`, `brand.json`, Kontext-Export, README, Briefing.
- **2026-10-03 [Code]** `ARBEITSWEISE.md` (Werkzeug-Kompass) angelegt; wird beim Sessionstart mitgeladen, Claude Code erinnert Mar aktiv daran.
- **2026-10-03 [Code]** Playbook-Kapitel 01, 03, 04, 06, 90-Tage-Plan, Briefing, Nächste Schritte und README bereinigt: 100 ml raus, Preise als `[Preis offen]`, Zahlen auf Kleinunternehmer/Flakon-Annahme; Kapitel 05 als Ganzes als veraltet markiert.
- **2026-10-03 [Code]** Mars Antworten eingearbeitet (kein Verkauf aktuell, CPNP offen, 09/2026-Regeln gelten außer Duftlinien), Adresse/Telefon/USt-IdNr. aus dem Repo entfernt, Steuerteil in `07-recht-retention.md` auf Kleinunternehmer umgestellt.
- **2026-10-03 [Code]** Mars Klärung eingearbeitet (Kleinunternehmer, 30 + 50 ml, Preise offen, Website offline): `brand.json` und `playbook/KONTEXT-EXPORT.md` angepasst, Economics neu gerechnet.
- **2026-10-03 [Code]** Geprüft: Playbook (`docs/ECommerceBrandPlaybook.md`) und `playbook/KONTEXT-EXPORT.md` lagen schon im Repo, hochgeladene Fassung identisch. Widersprüche zu dieser Datei unter „Offene Fragen“ eingetragen.
- **2026-10-02 [Code]** SYNC.md ins Repo (Branch `Azizam`) gelegt, Verweis in `CLAUDE.md` ergänzt.

### Verlauf (zusammengefasst)

- 2026-10-02: SYNC.md im Chat angelegt und ins Repo gelegt.

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
