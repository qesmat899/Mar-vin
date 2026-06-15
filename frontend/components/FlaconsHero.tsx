"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef } from "react";

// Lazy-load: Three.js nur client-side
const FlaconsScene = dynamic(() => import("./FlaconsScene"), { ssr: false });

export default function FlaconsHero() {
  const textRef = useRef<HTMLDivElement>(null!);

  // Text-Parallax beim Scrollen
  useEffect(() => {
    const onScroll = () => {
      if (!textRef.current) return;
      const y = window.scrollY;
      textRef.current.style.transform = `translateY(${y * 0.35}px)`;
      textRef.current.style.opacity = String(1 - y / 500);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <section
      className="relative w-full"
      style={{ height: "300vh" }} // Platz für 3-Seiten-Scroll
    >
      {/* 3D-Flakon – sticky im Viewport */}
      <div className="sticky top-0 h-screen w-full overflow-hidden">
        <FlaconsScene scrollPages={3} />

        {/* Eleganter Hintergrund-Gradient */}
        <div
          className="absolute inset-0 -z-10"
          style={{
            background:
              "radial-gradient(ellipse 80% 70% at 50% 60%, #fdf4ec 0%, #f0e0d0 40%, #d4b8a0 100%)",
          }}
        />

        {/* Marken-Text – überlagert den Flakon */}
        <div
          ref={textRef}
          className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none select-none"
          style={{ paddingBottom: "10vh" }}
        >
          <p
            className="uppercase tracking-[0.5em] text-xs mb-4"
            style={{ color: "#9e7b5e" }}
          >
            Collection 2026
          </p>
          <h1
            className="text-5xl md:text-7xl font-thin text-center leading-tight"
            style={{
              color: "#3d2b1f",
              fontFamily: "'Cormorant Garamond', 'Georgia', serif",
              letterSpacing: "0.08em",
            }}
          >
            L&apos;Essence
            <br />
            <em>Éternelle</em>
          </h1>
          <div
            className="mt-6 w-16 h-px"
            style={{ background: "#9e7b5e" }}
          />
          <p
            className="mt-4 text-sm tracking-widest"
            style={{ color: "#7a5c45" }}
          >
            Scroll to discover
          </p>
        </div>

        {/* Subtile Vignette */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse 100% 100% at 50% 50%, transparent 40%, rgba(61,43,31,0.15) 100%)",
          }}
        />
      </div>
    </section>
  );
}
