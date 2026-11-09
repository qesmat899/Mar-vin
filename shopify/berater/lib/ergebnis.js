// Aufbereitung des Ergebnisses für die Oberfläche (ohne Node-Abhängigkeiten, läuft auch im Browser).
import { empfehlbar, annaeherung, MAX_EMPFEHLUNGEN } from './matching.js';

export function ohneKi(angaben, profile, vorab, grund) {
  let empfehlungen = vorab.kandidaten
    .filter((k) => empfehlbar(k))
    .slice(0, MAX_EMPFEHLUNGEN)
    .map((k) => ausgabe(profile.find((p) => p.id === k.id), k, null));
  const naeherung = !empfehlungen.length;
  if (naeherung) empfehlungen = annaeherung(vorab.kandidaten).map((k) => ausgabe(profile.find((p) => p.id === k.id), k, null));
  return {
    quelle: 'ohne_ki',
    grund,
    empfehlungen,
    annaeherung: naeherung && empfehlungen.length > 0,
    kein_treffer: empfehlungen.length === 0,
    kundenwunsch: { zusammenfassung: '' },
    hinweise: vorab.hinweise,
    ausgeschlossen: vorab.ausgeschlossen.length,
  };
}

export function ausgabe(p, k, b) {
  return {
    product_id: p.id,
    shopify_id: p.shopify_id,
    name: p.name,
    url: p.url,
    bild: p.bild,
    bild_klein: p.bild_klein,
    preis_ab_text: p.preis_ab_text,
    familie: p.familie,
    hauptnoten: p.hauptnoten,
    match_score: k.match,
    matching_reasons: b?.matching_reasons?.length ? b.matching_reasons : k.gruende,
    matching_attributes: [...new Set([...(b?.matching_attributes ?? []), ...k.attribute])],
    possible_conflicts: [...new Set([...k.konflikte, ...(b?.possible_conflicts ?? [])])].slice(0, 4),
    fragrance_character: b?.fragrance_character || p.charakter || '',
    recommendation_explanation: b?.recommendation_explanation || '',
    ki_urteil: b?.urteil ?? null,
    daten_hinweis: k.datenluecken.length ? `Daten unvollständig: ${k.datenluecken.join(', ')}` : null,
  };
}

