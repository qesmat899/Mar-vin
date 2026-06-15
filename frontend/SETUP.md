# 3D Flakon – Integration in dein Next.js Projekt

## 1. Pakete installieren

```bash
npm install three @react-three/fiber @react-three/drei
npm install -D @types/three
```

> Kein `framer-motion` nötig – die Scroll-Reaktion kommt aus `@react-three/drei/ScrollControls`.

## 2. Komponenten kopieren

Kopiere den Ordner `components/` in dein Projekt:

```
src/
  components/
    FlaconsScene.tsx      ← Three.js 3D-Szene
    FlaconsHero.tsx       ← Hero-Section mit Text + Parallax
    FlaconsParticles.tsx  ← Leichte Canvas-Partikel (optional)
```

## 3. Einbinden

In deiner Seite (`app/page.tsx` o. ä.):

```tsx
import FlaconsHero from "@/components/FlaconsHero";

export default function HomePage() {
  return (
    <main>
      <FlaconsHero />
      {/* ... rest der seite */}
    </main>
  );
}
```

## 4. Font (optional, für den Serif-Titel)

In `app/layout.tsx`:

```tsx
import { Cormorant_Garamond } from "next/font/google";
const cormorant = Cormorant_Garamond({ subsets: ["latin"], weight: ["300","400","600"] });
```

## 5. Anpassen

| Was | Wo | Wie |
|---|---|---|
| Flakon-Form | `FlaconsScene.tsx` → `bodyPoints` | x/y-Koordinaten anpassen |
| Glasfarbe | `color="#e8d5c4"` | Hex-Wert der Flakon-Farbe |
| Kappenfarbe | `color="#c8a882"` | Gold, Silber, Schwarz... |
| Scroll-Geschwindigkeit | `scrollPages={3}` | Mehr = langsamer |
| Titeltext | `FlaconsHero.tsx` | `L'Essence Éternelle` ersetzen |
| Hintergrund | `radial-gradient(...)` | Gradient-Farben |

## Visuelle Effekte im Überblick

- **MeshTransmissionMaterial** → echte Glas-Brechung + Irisieren
- **Environment preset="studio"** → professionelle Lichtkuppel
- **Sparkles** → schwebende Goldpartikel in der 3D-Szene
- **Float** → sanftes Schweben des Flakons
- **Text-Parallax** → Titel scrollt weg während Flakon bleibt
- **Vignette** → eleganter Rand-Abdunkelungseffekt
