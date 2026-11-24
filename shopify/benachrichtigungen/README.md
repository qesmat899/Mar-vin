# Shopify-Benachrichtigungen im Azizam-Stil

Einfügen in: Shopify-Admin → Einstellungen → Benachrichtigungen → Kundenbenachrichtigungen → Mail wählen → **Code bearbeiten**.

## Grundregel bei echten Kundenmails (Bestellung, Versand, Konto)

Shopifys Logik bleibt unangetastet. Geändert werden nur kleine, klar abgegrenzte Stellen. Mar schickt den Originalcode;
Claude liefert genau diese Ersetzungen (Strg+F im Code-Editor, Text ersetzen, speichern, „Vorschau“ und
„Test-E-Mail senden“ prüfen). Zurück geht es jederzeit über „Auf Standard zurücksetzen“.

1. **Stil:** Den Block `<style>` … `</style>` im `<head>` (4 Zeilen mit `shop.email_accent_color`) komplett durch den
   Inhalt von `azizam-stil.liquid` ersetzen. Gleicher Block für alle Standard-Mails.
2. **Text:** je Mail nur die Überschrift bzw. einzelne Sätze (Tabelle unten).
3. **Fußzeile:** hinter `<!-- shopify-managed-taxes-footer --></p>` (Markierung nicht löschen) diese Zeile einfügen:

```liquid
<p class="disclaimer__subtext">Gemäß § 19 UStG wird keine Umsatzsteuer berechnet. · <a href="{{ shop.url }}/policies/legal-notice">Impressum</a></p>
```

## Stand je Mail

| Mail | Was | Stand |
|---|---|---|
| Bestätigung für Kundenmarketing | eigene Vorlage `marketing-bestaetigung.liquid` (ganz ersetzen) | live, getestet 24.11.2026 |
| Bestellbestätigung | Stil (1) · Überschrift `Vielen Dank für deine Bestellung!` → `Danke, azizam.` · Fußzeile (3) | geliefert 24.11.2026, Test durch Mar offen |

Bei Mails ohne die Fußzeilen-Markierung die Zeile aus (3) direkt vor das schließende `</p>` der letzten
`disclaimer__subtext`-Zeile setzen; Claude nennt die genaue Stelle.
