"use client";

import { useEffect, useState } from "react";

export default function Logo() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const MantaGlyph = () => (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="group-hover:scale-105 transition-transform duration-700 ease-in-out"
    >
      {/* High-Fidelity Manta Silhouette */}
      <path 
        d="M12 17C10 17 3 14.5 1 9C6 10 9 9.5 10 6C10 4.5 10.5 3.5 11.5 3C12 4 12 5 12 5C12 5 12 4 12.5 3C13.5 3.5 14 4.5 14 6C15 9.5 18 10 23 9C21 14.5 14 17 12 17Z" 
        fill="currentColor" 
        fillOpacity="0.05" 
      />
      
      {/* Spinal Detail */}
      <path d="M12 7V17" opacity="0.3" />
      
      {/* Tail Filament */}
      <path d="M12 17V22" opacity="0.4" />
      
      {/* Lateral Detail Lines (Wings) */}
      <path d="M7 11.5C9 12 11 12 12 12" opacity="0.15" />
      <path d="M17 11.5C15 12 13 12 12 12" opacity="0.15" />
    </svg>
  );

  if (!mounted) {
    return (
      <div className="flex items-center gap-3">
        <div className="text-white opacity-20">
          <MantaGlyph />
        </div>
        <span className="font-bold text-sm tracking-[0.2em] uppercase">
          Axeom.
        </span>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-3 group">
      <div className="text-white">
        <MantaGlyph />
      </div>
      <span className="font-bold text-sm tracking-[0.2em] uppercase transition-colors group-hover:text-white/80">
        Axeom.
      </span>
    </div>
  );
}
