"use client";

import { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import {
  ScrollControls,
  useScroll,
  Environment,
  MeshTransmissionMaterial,
  Float,
  Sparkles,
} from "@react-three/drei";
import * as THREE from "three";

// ─── Flakon-Geometrie via LatheGeometry ─────────────────────────────────────
function FlaconeBottle() {
  const meshRef = useRef<THREE.Mesh>(null!);
  const capRef = useRef<THREE.Mesh>(null!);
  const scroll = useScroll();

  // Profil-Punkte für Drerehkörper (Parfümflakon-Silhouette)
  const bodyPoints = useMemo(() => {
    return [
      [0.0, 0.0],   // Boden-Mitte
      [0.55, 0.0],  // Boden-Rand
      [0.6, 0.05],
      [0.62, 0.3],  // breite Schulter
      [0.6, 0.7],
      [0.55, 1.1],
      [0.45, 1.4],  // Taille
      [0.3, 1.6],
      [0.25, 1.8],  // Hals
      [0.22, 2.0],
      [0.22, 2.15], // Hals oben
    ].map(([x, y]) => new THREE.Vector2(x, y));
  }, []);

  // Scroll → Rotation & leichter Y-Versatz
  useFrame(() => {
    const t = scroll.offset; // 0…1
    if (meshRef.current) {
      meshRef.current.rotation.y = t * Math.PI * 2;
      meshRef.current.position.y = -0.5 + t * 0.4;
    }
    if (capRef.current) {
      capRef.current.rotation.y = t * Math.PI * 2;
      capRef.current.position.y = 1.65 + t * 0.4;
    }
  });

  return (
    <group>
      {/* Flakon-Körper */}
      <mesh ref={meshRef} castShadow receiveShadow>
        <latheGeometry args={[bodyPoints, 128]} />
        <MeshTransmissionMaterial
          backside
          samples={16}
          resolution={512}
          transmission={0.95}
          roughness={0.02}
          thickness={0.3}
          chromaticAberration={0.06}
          anisotropy={0.1}
          distortion={0.1}
          distortionScale={0.1}
          temporalDistortion={0.02}
          iridescence={1}
          iridescenceIOR={1}
          iridescenceThicknessRange={[0, 1400]}
          color="#e8d5c4"
        />
      </mesh>

      {/* Deckel / Kappe */}
      <mesh ref={capRef} position={[0, 1.65, 0]} castShadow>
        <cylinderGeometry args={[0.26, 0.22, 0.55, 64]} />
        <meshPhysicalMaterial
          color="#c8a882"
          metalness={0.9}
          roughness={0.1}
          reflectivity={1}
        />
      </mesh>
    </group>
  );
}

// ─── Hauptszene ──────────────────────────────────────────────────────────────
function Scene() {
  return (
    <>
      {/* Ambiente Licht-Setup */}
      <ambientLight intensity={0.3} />
      <directionalLight position={[5, 8, 3]} intensity={1.2} castShadow />
      <directionalLight position={[-4, 2, -3]} intensity={0.5} color="#ffe4d6" />
      <pointLight position={[0, 4, 2]} intensity={0.8} color="#fff5e6" />

      {/* HDRI-Umgebung für Reflexionen */}
      <Environment preset="studio" />

      {/* Schwebende Partikel */}
      <Sparkles
        count={60}
        scale={4}
        size={1.2}
        speed={0.3}
        color="#f0c090"
        opacity={0.6}
      />

      {/* Flakon mit leichtem Float-Effekt */}
      <Float speed={1.4} rotationIntensity={0.1} floatIntensity={0.3}>
        <FlaconeBottle />
      </Float>
    </>
  );
}

// ─── Exportierbare Komponente ────────────────────────────────────────────────
interface FlaconsSceneProps {
  /** Scroll-Länge in "Seiten" — mehr = langsamere Rotation */
  scrollPages?: number;
  className?: string;
}

export default function FlaconsScene({
  scrollPages = 3,
  className = "",
}: FlaconsSceneProps) {
  return (
    <div className={`w-full h-screen ${className}`} style={{ background: "transparent" }}>
      <Canvas
        camera={{ position: [0, 0.5, 4], fov: 45 }}
        gl={{ antialias: true, alpha: true }}
        shadows
        dpr={[1, 2]}
      >
        <ScrollControls pages={scrollPages} damping={0.25}>
          <Scene />
        </ScrollControls>
      </Canvas>
    </div>
  );
}
