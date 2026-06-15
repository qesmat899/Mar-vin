"use client";

import { useEffect, useRef } from "react";

/**
 * Leichtgewichtige Canvas-Partikel – kein Three.js nötig.
 * Als Hintergrund-Layer verwendbar, z.B. auf der Produktseite.
 */
export default function FlaconsParticles({
  count = 40,
  color = "rgba(192, 150, 100, 0.5)",
}: {
  count?: number;
  color?: string;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null!);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d")!;
    let raf: number;

    const resize = () => {
      canvas.width = canvas.offsetWidth * window.devicePixelRatio;
      canvas.height = canvas.offsetHeight * window.devicePixelRatio;
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    };
    resize();
    window.addEventListener("resize", resize);

    // Partikel initialisieren
    const W = () => canvas.offsetWidth;
    const H = () => canvas.offsetHeight;
    const particles = Array.from({ length: count }, () => ({
      x: Math.random() * W(),
      y: Math.random() * H(),
      r: Math.random() * 2.5 + 0.5,
      vx: (Math.random() - 0.5) * 0.3,
      vy: -Math.random() * 0.5 - 0.1,
      alpha: Math.random() * 0.6 + 0.2,
    }));

    const draw = () => {
      ctx.clearRect(0, 0, W(), H());
      particles.forEach((p) => {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = color.replace(")", `, ${p.alpha})`).replace("rgba(", "rgba(");
        ctx.fill();

        p.x += p.vx;
        p.y += p.vy;
        if (p.y < -10) { p.y = H() + 10; p.x = Math.random() * W(); }
        if (p.x < 0) p.x = W();
        if (p.x > W()) p.x = 0;
      });
      raf = requestAnimationFrame(draw);
    };
    draw();

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
    };
  }, [count, color]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none"
      style={{ mixBlendMode: "multiply" }}
    />
  );
}
