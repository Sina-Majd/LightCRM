"use client";

import React, { useEffect, useState, useRef } from "react";

export function AmbientBackground() {
  const [mousePos, setMousePos] = useState<{ x: number; y: number } | null>(null);
  const [isPointerDevice, setIsPointerDevice] = useState(false);
  const requestRef = useRef<number | null>(null);
  const targetPos = useRef<{ x: number; y: number }>({ x: 0, y: 0 });

  useEffect(() => {
    if (typeof window !== "undefined" && window.matchMedia("(pointer: fine)").matches) {
      setIsPointerDevice(true);

      const handleMouseMove = (e: MouseEvent) => {
        targetPos.current = { x: e.clientX, y: e.clientY };

        if (!requestRef.current) {
          requestRef.current = requestAnimationFrame(() => {
            setMousePos({ x: targetPos.current.x, y: targetPos.current.y });
            requestRef.current = null;
          });
        }
      };

      window.addEventListener("mousemove", handleMouseMove, { passive: true });
      return () => {
        window.removeEventListener("mousemove", handleMouseMove);
        if (requestRef.current) cancelAnimationFrame(requestRef.current);
      };
    }
  }, []);

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 -z-10 overflow-hidden select-none"
    >
      {/* 1. Deep Space Base Backdrop */}
      <div className="absolute inset-0 bg-[#09090b]" />

      {/* 2. Global Visible Blueprint Grid */}
      <div className="absolute inset-0 bg-grid-pattern opacity-100" />
      <div className="absolute inset-0 bg-dot-pattern opacity-50" />

      {/* 3. Subtle Vignette to keep focus on center content */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_25%,#09090b_90%)] opacity-80" />

      {/* 4. Interactive Cursor Spotlight (Dynamic Flashlight / Glow) */}
      {isPointerDevice && mousePos && (
        <div
          className="absolute inset-0 transition-opacity duration-150"
          style={{
            background: `radial-gradient(650px circle at ${mousePos.x}px ${mousePos.y}px, rgba(99, 102, 241, 0.22), rgba(168, 85, 247, 0.1) 35%, transparent 70%)`,
          }}
        />
      )}



      {/* 6. Floating Constellation Star Accents */}
      <div className="absolute top-[12%] left-[10%] font-mono text-[11px] text-indigo-400/80 animate-particle-float">✦</div>
      <div className="absolute top-[25%] right-[12%] font-mono text-[12px] text-cyan-400/80 animate-particle-float" style={{ animationDelay: "2s" }}>✦</div>
      <div className="absolute top-[48%] left-[14%] font-mono text-[10px] text-purple-400/80 animate-particle-float" style={{ animationDelay: "4s" }}>✦</div>
      <div className="absolute top-[72%] right-[16%] font-mono text-[12px] text-indigo-400/80 animate-particle-float" style={{ animationDelay: "1.5s" }}>✦</div>
      <div className="absolute top-[88%] left-[18%] font-mono text-[11px] text-cyan-400/80 animate-particle-float" style={{ animationDelay: "3s" }}>✦</div>

      {/* 7. Cinematic Micro-Grain Texture Overlay */}
      <div className="absolute inset-0 bg-grain opacity-60 mix-blend-overlay pointer-events-none" />
    </div>
  );
}
