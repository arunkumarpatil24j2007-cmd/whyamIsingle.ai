"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ArrowDown } from "lucide-react";

export default function Hero() {
  const containerRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Fade in text elements on mount
    const tl = gsap.timeline();
    tl.fromTo(
      textRef.current,
      { opacity: 0, y: 30 },
      { opacity: 1, y: 0, duration: 1.6, ease: "power4.out", delay: 0.5 }
    );
  }, []);

  return (
    <section 
      id="section-1" 
      ref={containerRef}
      className="relative w-full h-screen flex flex-col items-center justify-between py-24 px-6 z-20 text-center select-none"
    >
      <div className="flex-1" />
      
      {/* Hero Core Text */}
      <div ref={textRef} className="flex flex-col items-center max-w-2xl px-4 mt-12">
        <span className="text-xs font-semibold tracking-[0.2em] text-[#F59E0B] uppercase mb-4">
          A Cinematic AI Experience
        </span>
        <h1 className="font-sans text-5xl md:text-7xl font-bold tracking-tight text-white leading-tight mb-6">
          Why Are You Still{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#7C3AED] to-[#DB2777]">
            Single?
          </span>
        </h1>
        <p className="text-base md:text-lg text-white/60 font-medium max-w-lg mb-8 leading-relaxed">
          Your visual footprint holds the secrets to your love life. Upload, analyze, and discover your relationship forecast.
        </p>
      </div>

      <div className="flex-1 flex items-end justify-center">
        {/* Animated Scroll Indicator */}
        <div className="flex flex-col items-center gap-2 cursor-pointer opacity-70 hover:opacity-100 transition-opacity duration-300">
          <span className="text-xs tracking-[0.25em] text-white/40 uppercase font-semibold">
            Scroll to begin
          </span>
          <div className="w-6 h-10 rounded-full border border-white/20 flex items-start justify-center p-1.5 overflow-hidden">
            <div className="w-1 h-2 rounded-full bg-gradient-to-b from-[#7C3AED] to-[#DB2777] animate-bounce" />
          </div>
        </div>
      </div>
    </section>
  );
}
