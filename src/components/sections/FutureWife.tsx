"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Star } from "lucide-react";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export default function FutureWife() {
  const containerRef = useRef<HTMLDivElement>(null);
  const quoteRef = useRef<HTMLDivElement>(null);
  const starsRef = useRef<HTMLDivElement>(null);
  const captionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // Pin Section 7 and reveal review components slowly
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: containerRef.current,
        start: "top top",
        end: "+=120%", // Pinned for 1.2 viewport heights
        scrub: 1.0,
        pin: true,
        anticipatePin: 1,
      },
    });

    // Slow emotional reveal
    tl.fromTo(
      quoteRef.current,
      { opacity: 0, y: 40, filter: "blur(8px)" },
      { opacity: 1, y: 0, filter: "blur(0px)", duration: 1.5, ease: "power2.out" }
    )
    .fromTo(
      starsRef.current ? Array.from(starsRef.current.querySelectorAll(".star-icon")) : [],
      { opacity: 0, scale: 0, rotate: -30 },
      { opacity: 1, scale: 1, rotate: 0, stagger: 0.15, duration: 0.8, ease: "back.out(2)" },
      "+=0.2"
    )
    .fromTo(
      captionRef.current,
      { opacity: 0, y: 20 },
      { opacity: 0.7, y: 0, duration: 1.0, ease: "power2.out" },
      "+=0.1"
    )
    .to({}, { duration: 0.8 }); // End padding

    return () => {
      tl.scrollTrigger?.kill();
      tl.kill();
    };
  }, []);

  return (
    <div 
      ref={containerRef}
      id="section-7"
      className="relative w-full h-screen flex flex-col justify-between py-20 px-6 md:px-16 z-20 overflow-hidden bg-black/40 select-none text-center"
    >
      <div className="flex-1" />

      {/* Quote Display Area */}
      <div className="max-w-4xl mx-auto flex flex-col items-center gap-12 z-20">
        
        {/* The Quote */}
        <div ref={quoteRef} className="space-y-4 md:space-y-6">
          <p className="font-sans text-4xl md:text-6xl font-semibold italic leading-tight tracking-tight text-white/90">
            "He replies late.
          </p>
          <p className="font-sans text-4xl md:text-6xl font-semibold italic leading-tight tracking-tight text-white/90">
            But he always keeps his promises."
          </p>
        </div>

        {/* 5 Stars Rating */}
        <div ref={starsRef} className="flex gap-2.5">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="star-icon p-1 text-[#F59E0B] relative">
              <Star className="w-8 h-8 md:w-10 md:h-10 fill-[#F59E0B] filter drop-shadow-[0_0_8px_rgba(245,158,11,0.3)]" />
            </div>
          ))}
        </div>

        {/* Caption signature */}
        <div ref={captionRef} className="flex flex-col items-center gap-1">
          <span className="text-sm md:text-base font-bold tracking-[0.25em] text-[#DB2777] uppercase">
            — Future Wife
          </span>
          <span className="text-[10px] md:text-xs text-white/30 tracking-[0.1em] font-medium uppercase mt-1">
            Calculated from facial profile matching algorithms
          </span>
        </div>

      </div>

      <div className="flex-1" />
    </div>
  );
}
