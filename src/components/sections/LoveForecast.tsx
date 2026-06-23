"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Calendar, Percent, Flame, ShieldAlert } from "lucide-react";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

interface LoveForecastProps {
  data: any;
}

export default function LoveForecast({ data }: LoveForecastProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Timeline nodes and progress bar refs for GSAP animation
  const dot1Ref = useRef<HTMLDivElement>(null);
  const dot2Ref = useRef<HTMLDivElement>(null);
  const dot3Ref = useRef<HTMLDivElement>(null);
  
  const block1Ref = useRef<HTMLDivElement>(null);
  const block2Ref = useRef<HTMLDivElement>(null);
  const block3Ref = useRef<HTMLDivElement>(null);
  
  const progressLineRef = useRef<HTMLDivElement>(null);

  // Dynamic values calculated from analysis payload
  const singleScore = data?.singleScore ?? 75;
  const marriageScore = data?.marriageScore ?? 82;
  const situationshipRisk = data?.situationshipRisk ?? 45;

  const y2026 = {
    probability: Math.max(15, Math.floor(100 - singleScore * 1.1)),
    risk: situationshipRisk,
    label: "High initial turbulence. Expect text tag matches but low commitment."
  };

  const y2027 = {
    probability: Math.min(90, Math.floor(100 - singleScore * 0.75)),
    risk: Math.max(10, Math.floor(situationshipRisk * 0.6)),
    label: "Vibe shift. Shift from situationships to exclusive dating."
  };

  const y2028 = {
    probability: Math.min(99, Math.floor(100 - singleScore * 0.4)),
    marriage: marriageScore,
    label: "Lockdown. High compatibility match leading to long-term alignment."
  };

  useEffect(() => {
    if (!containerRef.current) return;

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: containerRef.current,
        start: "top top",
        end: "+=150%", // Pinned for 1.5 viewport heights
        scrub: 1.0,
        pin: true,
        anticipatePin: 1,
      },
    });

    // 1. Animate vertical timeline connecting line
    tl.fromTo(progressLineRef.current, { scaleY: 0 }, { scaleY: 1, ease: "none", duration: 3.0 })
      
      // 2. Animate Year 2026
      .fromTo(dot1Ref.current, { scale: 0, backgroundColor: "rgba(255,255,255,0.1)" }, { scale: 1.3, backgroundColor: "#7C3AED", duration: 0.5 }, 0.3)
      .fromTo(block1Ref.current, { opacity: 0, x: 50 }, { opacity: 1, x: 0, duration: 1.0 }, 0.4)
      .fromTo(
        block1Ref.current ? Array.from(block1Ref.current.querySelectorAll(".bar-fill")) : [],
        { width: "0%" },
        { width: "100%", duration: 1.0, ease: "power2.out" },
        0.6
      )

      // 3. Animate Year 2027
      .fromTo(dot2Ref.current, { scale: 0, backgroundColor: "rgba(255,255,255,0.1)" }, { scale: 1.3, backgroundColor: "#DB2777", duration: 0.5 }, 1.3)
      .fromTo(block2Ref.current, { opacity: 0, x: 50 }, { opacity: 1, x: 0, duration: 1.0 }, 1.4)
      .fromTo(
        block2Ref.current ? Array.from(block2Ref.current.querySelectorAll(".bar-fill")) : [],
        { width: "0%" },
        { width: "100%", duration: 1.0, ease: "power2.out" },
        1.6
      )

      // 4. Animate Year 2028
      .fromTo(dot3Ref.current, { scale: 0, backgroundColor: "rgba(255,255,255,0.1)" }, { scale: 1.3, backgroundColor: "#F59E0B", duration: 0.5 }, 2.3)
      .fromTo(block3Ref.current, { opacity: 0, x: 50 }, { opacity: 1, x: 0, duration: 1.0 }, 2.4)
      .fromTo(
        block3Ref.current ? Array.from(block3Ref.current.querySelectorAll(".bar-fill")) : [],
        { width: "0%" },
        { width: "100%", duration: 1.0, ease: "power2.out" },
        2.6
      )
      
      .to({}, { duration: 0.8 }); // Hold screen at end

    return () => {
      tl.scrollTrigger?.kill();
      tl.kill();
    };
  }, []);

  return (
    <div 
      ref={containerRef}
      id="section-6"
      className="relative w-full h-screen flex flex-col justify-between py-16 px-6 md:px-12 z-20 overflow-hidden bg-black/40 select-none"
    >
      {/* Section Header */}
      <div className="w-full text-center mt-6">
        <span className="text-xs font-bold tracking-[0.25em] text-[#DB2777] uppercase block mb-3">
          The Horizon
        </span>
        <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight">
          Love Forecast
        </h2>
      </div>

      {/* Main Timeline Body */}
      <div className="flex-1 w-full max-w-4xl mx-auto flex items-stretch justify-center relative my-10 z-20">
        
        {/* Left Side: Timeline Central Axis */}
        <div className="w-12 flex flex-col items-center relative mr-8 md:mr-16">
          {/* Base track */}
          <div className="absolute top-4 bottom-4 w-0.5 bg-white/10 rounded-full" />
          {/* Growing Progress fill line */}
          <div 
            ref={progressLineRef}
            className="absolute top-4 bottom-4 w-0.5 bg-gradient-to-b from-[#7C3AED] via-[#DB2777] to-[#F59E0B] rounded-full origin-top"
          />

          {/* Dots representing years */}
          <div className="flex-1 flex flex-col justify-between py-8 z-10 w-full items-center">
            {/* 2026 Dot */}
            <div ref={dot1Ref} className="w-4 h-4 rounded-full border border-white/20 shadow-lg transition-transform duration-300" />
            {/* 2027 Dot */}
            <div ref={dot2Ref} className="w-4 h-4 rounded-full border border-white/20 shadow-lg transition-transform duration-300" />
            {/* 2028 Dot */}
            <div ref={dot3Ref} className="w-4 h-4 rounded-full border border-white/20 shadow-lg transition-transform duration-300" />
          </div>
        </div>

        {/* Right Side: Timeline content cards */}
        <div className="flex-1 flex flex-col justify-between py-2 text-left">
          
          {/* 2026 Card block */}
          <div ref={block1Ref} className="space-y-4">
            <div className="flex items-center gap-3">
              <span className="font-sans text-3xl font-black tracking-tight text-[#7C3AED]">2026</span>
              <span className="px-2.5 py-0.5 rounded-full border border-[#7C3AED]/20 bg-[#7C3AED]/5 text-[10px] font-bold uppercase tracking-wider text-[#7C3AED]">
                Short Term
              </span>
            </div>
            <p className="text-sm font-semibold text-white/50 max-w-xl">
              {y2026.label}
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-xl">
              {/* Stat 1 */}
              <div className="reeded-glass p-4">
                <div className="noise-overlay" />
                <div className="flex items-center justify-between text-xs font-semibold text-white/60 mb-2 relative z-10">
                  <span className="flex items-center gap-1.5"><Percent className="w-3.5 h-3.5" /> Relationship Prob</span>
                  <span>{y2026.probability}%</span>
                </div>
                <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden relative z-10">
                  <div 
                    className="bar-fill h-full bg-[#7C3AED] rounded-full" 
                    style={{ width: `${y2026.probability}%` } as any}
                  />
                </div>
              </div>
              {/* Stat 2 */}
              <div className="reeded-glass p-4">
                <div className="noise-overlay" />
                <div className="flex items-center justify-between text-xs font-semibold text-white/60 mb-2 relative z-10">
                  <span className="flex items-center gap-1.5"><Flame className="w-3.5 h-3.5" /> Situationship Risk</span>
                  <span>{y2026.risk}%</span>
                </div>
                <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden relative z-10">
                  <div 
                    className="bar-fill h-full bg-[#DB2777] rounded-full" 
                    style={{ width: `${y2026.risk}%` } as any}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* 2027 Card block */}
          <div ref={block2Ref} className="space-y-4">
            <div className="flex items-center gap-3">
              <span className="font-sans text-3xl font-black tracking-tight text-[#DB2777]">2027</span>
              <span className="px-2.5 py-0.5 rounded-full border border-[#DB2777]/20 bg-[#DB2777]/5 text-[10px] font-bold uppercase tracking-wider text-[#DB2777]">
                Transition
              </span>
            </div>
            <p className="text-sm font-semibold text-white/50 max-w-xl">
              {y2027.label}
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-xl">
              {/* Stat 1 */}
              <div className="reeded-glass p-4">
                <div className="noise-overlay" />
                <div className="flex items-center justify-between text-xs font-semibold text-white/60 mb-2 relative z-10">
                  <span className="flex items-center gap-1.5"><Percent className="w-3.5 h-3.5" /> Relationship Prob</span>
                  <span>{y2027.probability}%</span>
                </div>
                <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden relative z-10">
                  <div 
                    className="bar-fill h-full bg-[#DB2777] rounded-full" 
                    style={{ width: `${y2027.probability}%` } as any}
                  />
                </div>
              </div>
              {/* Stat 2 */}
              <div className="reeded-glass p-4">
                <div className="noise-overlay" />
                <div className="flex items-center justify-between text-xs font-semibold text-white/60 mb-2 relative z-10">
                  <span className="flex items-center gap-1.5"><Flame className="w-3.5 h-3.5" /> Situationship Risk</span>
                  <span>{y2027.risk}%</span>
                </div>
                <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden relative z-10">
                  <div 
                    className="bar-fill h-full bg-emerald-400 rounded-full" 
                    style={{ width: `${y2027.risk}%` } as any}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* 2028 Card block */}
          <div ref={block3Ref} className="space-y-4">
            <div className="flex items-center gap-3">
              <span className="font-sans text-3xl font-black tracking-tight text-[#F59E0B]">2028</span>
              <span className="px-2.5 py-0.5 rounded-full border border-[#F59E0B]/20 bg-[#F59E0B]/5 text-[10px] font-bold uppercase tracking-wider text-[#F59E0B]">
                Marriage alignment
              </span>
            </div>
            <p className="text-sm font-semibold text-white/50 max-w-xl">
              {y2028.label}
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-xl">
              {/* Stat 1 */}
              <div className="reeded-glass p-4">
                <div className="noise-overlay" />
                <div className="flex items-center justify-between text-xs font-semibold text-white/60 mb-2 relative z-10">
                  <span className="flex items-center gap-1.5"><Percent className="w-3.5 h-3.5" /> Relationship Prob</span>
                  <span>{y2028.probability}%</span>
                </div>
                <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden relative z-10">
                  <div 
                    className="bar-fill h-full bg-[#F59E0B] rounded-full" 
                    style={{ width: `${y2028.probability}%` } as any}
                  />
                </div>
              </div>
              {/* Stat 2 */}
              <div className="reeded-glass p-4">
                <div className="noise-overlay" />
                <div className="flex items-center justify-between text-xs font-semibold text-white/60 mb-2 relative z-10">
                  <span className="flex items-center gap-1.5"><ShieldAlert className="w-3.5 h-3.5" /> Marriage Material</span>
                  <span>{y2028.marriage}/100</span>
                </div>
                <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden relative z-10">
                  <div 
                    className="bar-fill h-full bg-emerald-500 rounded-full" 
                    style={{ width: `${y2028.marriage}%` } as any}
                  />
                </div>
              </div>
            </div>
          </div>

        </div>

      </div>

      <div className="h-6" />
    </div>
  );
}
