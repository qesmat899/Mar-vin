# SYNC.md – Übergabe zwischen Claude Chat und Claude Code (Azizam)

> Gemeinsame Datei für **Claude Chat** und **Claude Code**. Sie ist die einzige Brücke zwischen beiden.
> Zuletzt aktualisiert: 2026-10-03 [Code]

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

- Verkauf in **30 ml und 50 ml**, 100 ml entfällt. [Mar, 2026-10-03]
- Stil: luxuriös mit Goldakzent, hohe schlanke Form, Glas nicht foliert, Magnetkappe gewünscht. Max. ca. 3 € pro Flakon, erste Bestellung 100–200 Stück. [Chat, 2026-10]
- Drei zuvor vorgeschlagene Standardflakons (schwarz/kantig, mattschwarz mit Goldkappe, schwer quadratisch mit Box) wurden abgelehnt.
- Eigene Kreation/Sample erst später.
- Bleiben gültig aus dem Playbook (09/2026): 30 % Duftöl als Kernversprechen; keine erfundenen Bewertungen; keine Herstellungsaussagen wie „Handgefertigt in Deutschland“, „Seltene Zutaten“, „Haute Parfumerie“. [Mar, 2026-10-03]
- Kein Privatkram im Repo: Adresse, Telefon, USt-IdNr. stehen nur im Impressum. [Mar, 2026-10-03]

---

## Offene Fragen

- Welcher Flakon wird es (in 30 und 50 ml)? (Hängt davon ab: Verpackung, Etikett, Shop-Neustart)
- Verpackung: wird gesucht.
- Preise für 30 und 50 ml: offen. Rechengrundlage in `brand.json` sind die alten Preise.
- Etikettierung: Zum Etikett ist nichts geklärt.
- Kosmetikrecht (CPNP, Sicherheitsbewertung, INCI): Fabrik soll es übernehmen, schriftliche Bestätigung fehlt. Muss vor dem ersten Onlineverkauf stehen.
- Zwei Duftlinien (Heritage/Editions) aus dem Playbook: Mar ist unsicher, offen.
- Positionierung und Markenauftritt für die Zielgruppe.

---

## Aufgaben und Übergaben

| Wer | Aufgabe | Status |
|-----|---------|--------|
| Chat | Flakon-Optionen recherchieren und bewerten (30 + 50 ml) | offen |
| Code | Struktur für Marketing-/Wachstums-Skills im Repo vorbereiten | offen |
| Mar | Bei der Fabrik schriftlich bestätigen lassen: CPNP, Sicherheitsbewertung, INCI für die Azizam-Namen | offen |
| Code | Kapitel 03, 04, 06 und 90-Tage-Plan von 100 ml/alten Preisen bereinigen (07 und 05 erledigt, Hinweis im README) | offen |

Status: `offen` · `in Arbeit` · `erledigt` (erledigte Zeilen nach dem nächsten Log-Eintrag löschen)

---

## Log (neueste oben, max. 10)

- **2026-10-03 [Code]** Mars Antworten eingearbeitet (kein Verkauf aktuell, CPNP offen, 09/2026-Regeln gelten außer Duftlinien), Adresse/Telefon/USt-IdNr. aus dem Repo entfernt, Steuerteil in `07-recht-retention.md` auf Kleinunternehmer umgestellt.
- **2026-10-03 [Code]** Mars Klärung eingearbeitet (Kleinunternehmer, 30 + 50 ml, Preise offen, Website offline): `brand.json` und `playbook/KONTEXT-EXPORT.md` angepasst, Economics neu gerechnet.
- **2026-10-03 [Code]** Geprüft: Playbook (`docs/ECommerceBrandPlaybook.md`) und `playbook/KONTEXT-EXPORT.md` lagen schon im Repo, hochgeladene Fassung identisch. Widersprüche zu dieser Datei unter „Offene Fragen“ eingetragen.
- **2026-10-02 [Code]** SYNC.md ins Repo (Branch `Azizam`) gelegt, Verweis in `CLAUDE.md` ergänzt.
- **2026-10-02 [Chat]** SYNC.md angelegt, Stand aus bisherigen Gesprächen übernommen.

### Verlauf (zusammengefasst)

_(noch leer)_

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
