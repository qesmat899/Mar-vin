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

- **Was:** Azizam Fragrance, nebenberuflich, als Kleinunternehmer angemeldet.
- **Produkt:** Nachmach-Düfte als Tubes mit ca. 30 % Duftöl, Lieferant ist eine Parfumfabrik (Sicherheitsbewertung und CPNP laufen darüber). Alle Düfte haben eigene Azizam-Namen.
- **Zielgruppe:** 17,5 bis 25 Jahre. Bisherige Käufer ca. 19–23, kaufen für den Abend bzw. einen Duft, „der was bewirkt“.
- **Rückmeldungen bisher:** Viele Komplimente, gute Haltbarkeit. Meistgelobt: Velvet Vanilla.
- **Rahmen (nächste 3 Monate):** Investitionsbudget 500–1.500 €, unter 5 Std./Woche Zeit.
- **Repo:** `github.com/qesmat899/Mar-vin`, Haupt-Branch heißt `Azizam` und bleibt so.
- **Grundlage für Marketing/Wachstum:** E-Commerce-Playbook liegt im Repo: Original unter `docs/ECommerceBrandPlaybook.md` (+ PDF), Umsetzung für Azizam unter `playbook/` (Einstieg: `playbook/KONTEXT-EXPORT.md`, Stand 09.09.2026).

---

## Aktueller Stand (überschreiben, nicht anhängen)

- Verkauf bisher nur per persönlicher Auslieferung, überwiegend im Freundeskreis. Nicht konstant.
- Positionierung noch nicht vorhanden. Website veraltet. Store bleibt erstmal stehen.
- Ziel: In den nächsten 3 Monaten deutschlandweit online verkaufen, Shop komplett neu starten.
- **Wichtigste und dringendste Aufgabe:** passender Flakon (bestenfalls zylindrisch).

---

## Entscheidungen (dauerhaft, mit Datum)

- Flakon nur noch in **50 ml** (vorher 30 + 50 ml geplant). [Chat, 2026-10]
- Stil: luxuriös mit Goldakzent, hohe schlanke Form, Glas nicht foliert, Magnetkappe gewünscht. Max. ca. 3 € pro Flakon, erste Bestellung 100–200 Stück. [Chat, 2026-10]
- Drei zuvor vorgeschlagene Standardflakons (schwarz/kantig, mattschwarz mit Goldkappe, schwer quadratisch mit Box) wurden abgelehnt.
- Eigene Kreation/Sample erst später.

---

## Offene Fragen

- Welcher Flakon wird es? (Hängt davon ab: Verpackung, Etikett, Shop-Neustart)
- Etikettierung: Zum Etikett ist nichts geklärt.
- Positionierung und Markenauftritt für die Zielgruppe.
- **Widersprüche zwischen dieser Datei und `playbook/` (Stand 09.09.2026) — Mar muss klären, was gilt:** [Code, 2026-10-03]
  - Steuer: hier „Kleinunternehmer“, im Playbook „USt-IdNr., keine Kleinunternehmerregelung, MwSt. wird ausgewiesen“ (ändert alle Margen in `brand.json`).
  - Größen: hier „nur noch 50 ml“, im Playbook 30/50/100 ml mit Preisen und Kernzahlen.
  - Produkt: hier „Tubes“ und Flakon gesucht, im Playbook „Flakons vorhanden (1,85 €)“.
  - Website: hier „veraltet, Shop neu starten“, im Playbook „live, Single-Page, Shopify-Zahlungen, Vercel“.

---

## Aufgaben und Übergaben

| Wer | Aufgabe | Status |
|-----|---------|--------|
| Chat | Flakon-Optionen recherchieren und bewerten | offen |
| Mar | Widersprüche oben klären (danach passt Code `brand.json` und Playbook an) | offen |
| Code | Struktur für Marketing-/Wachstums-Skills im Repo vorbereiten | offen |

Status: `offen` · `in Arbeit` · `erledigt` (erledigte Zeilen nach dem nächsten Log-Eintrag löschen)

---

## Log (neueste oben, max. 10)

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
