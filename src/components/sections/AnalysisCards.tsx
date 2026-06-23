"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Check, Flame, HelpCircle, Heart } from "lucide-react";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

interface AnalysisCardsProps {
  data: any;
}

export default function AnalysisCards({ data }: AnalysisCardsProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const card1Ref = useRef<HTMLDivElement>(null);
  const card2Ref = useRef<HTMLDivElement>(null);
  const card3Ref = useRef<HTMLDivElement>(null);
  const card4Ref = useRef<HTMLDivElement>(null);

  // Fallback placeholder data if analysis isn't done yet
  const displayData = data || {
    assumptions: [
      "Girls probably assume he plays sports and ignores texts, but he just spends hours adjusting CSS line heights.",
      "They assume he's high maintenance because of his nice shoes, but he eats leftover pizza for breakfast."
    ],
    greenFlags: [
      "Replies instantly if he is on his phone (which is 99% of the time).",
      "Has a high credit score and a clean bathroom cabinet.",
      "Owns more than two pillows on his bed."
    ],
    redFlags: [
      "Replies to texts in his head but forgets to actually hit send.",
      "Watches YouTube tutorials on 1.75x speed to 'save time'.",
      "Still talks about building a SaaS startup that makes $10k/month."
    ],
    whoWouldLikeYou: "A highly competent girl who works in Tech or Design, enjoys quiet coffee dates, and appreciates a guy with a structured daily routine."
  };

  useEffect(() => {
    if (!containerRef.current) return;

    // Pin Section 5 and animate cards moving at different parallax speeds
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: containerRef.current,
        start: "top top",
        end: "+=120%", // Pin for 1.2 viewport heights
        scrub: 1.0,
        pin: true,
        anticipatePin: 1,
      },
    });

    // 2.5D Parallax: Translate cards in opposite directions or different speed ratios
    tl.fromTo(card1Ref.current, { y: 250, opacity: 0 }, { y: -30, opacity: 1, ease: "none" }, 0)
      .fromTo(card2Ref.current, { y: 380, opacity: 0 }, { y: -120, opacity: 1, ease: "none" }, 0)
      .fromTo(card3Ref.current, { y: 180, opacity: 0 }, { y: -60, opacity: 1, ease: "none" }, 0)
      .fromTo(card4Ref.current, { y: 300, opacity: 0 }, { y: -90, opacity: 1, ease: "none" }, 0);

    return () => {
      tl.scrollTrigger?.kill();
      tl.kill();
    };
  }, []);

  return (
    <div 
      ref={containerRef}
      id="section-5"
      className="relative w-full h-screen flex flex-col justify-between py-16 px-6 md:px-12 z-20 overflow-hidden bg-black/40 select-none"
    >
      {/* Title Header */}
      <div className="w-full text-center mt-6">
        <span className="text-xs font-bold tracking-[0.25em] text-[#7C3AED] uppercase block mb-3">
          The Breakdown
        </span>
        <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight">
          Vibe Assessment
        </h2>
      </div>

      {/* Floating 2.5D Parallax Cards Grid */}
      <div className="flex-1 w-full max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6 items-center content-center relative z-20">
        
        {/* Card 1: What girls probably assume */}
        <div 
          ref={card1Ref} 
          className="reeded-glass p-6 md:p-8 flex flex-col text-left self-start md:translate-x-[-20px] max-w-[450px]"
        >
          <div className="noise-overlay" />
          <div className="flex items-center gap-3 mb-4 text-[#F59E0B]">
            <HelpCircle className="w-5 h-5" />
            <span className="text-xs font-bold uppercase tracking-wider">What girls assume</span>
          </div>
          <div className="space-y-4">
            {displayData.assumptions.map((item: string, idx: number) => (
              <p key={idx} className="text-sm font-medium text-white/80 leading-relaxed border-l-2 border-white/10 pl-3">
                "{item}"
              </p>
            ))}
          </div>
        </div>

        {/* Card 2: Green flags */}
        <div 
          ref={card2Ref} 
          className="reeded-glass p-6 md:p-8 flex flex-col text-left self-end md:justify-self-end md:translate-x-[20px] max-w-[450px]"
        >
          <div className="noise-overlay" />
          <div className="flex items-center gap-3 mb-4 text-emerald-400">
            <Check className="w-5 h-5" />
            <span className="text-xs font-bold uppercase tracking-wider">Green Flags</span>
          </div>
          <ul className="space-y-3">
            {displayData.greenFlags.map((item: string, idx: number) => (
              <li key={idx} className="flex gap-3 items-start text-sm font-medium text-white/80">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-2 shrink-0" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Card 3: Red flags */}
        <div 
          ref={card3Ref} 
          className="reeded-glass p-6 md:p-8 flex flex-col text-left self-start md:translate-x-[-40px] max-w-[450px]"
        >
          <div className="noise-overlay" />
          <div className="flex items-center gap-3 mb-4 text-[#DB2777]">
            <Flame className="w-5 h-5" />
            <span className="text-xs font-bold uppercase tracking-wider">Red Flags</span>
          </div>
          <ul className="space-y-3">
            {displayData.redFlags.map((item: string, idx: number) => (
              <li key={idx} className="flex gap-3 items-start text-sm font-medium text-white/80">
                <span className="w-1.5 h-1.5 rounded-full bg-[#DB2777] mt-2 shrink-0" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Card 4: Who would actually like you */}
        <div 
          ref={card4Ref} 
          className="reeded-glass p-6 md:p-8 flex flex-col text-left self-end md:justify-self-end md:translate-x-[40px] max-w-[450px]"
        >
          <div className="noise-overlay" />
          <div className="flex items-center gap-3 mb-4 text-[#7C3AED]">
            <Heart className="w-5 h-5" />
            <span className="text-xs font-bold uppercase tracking-wider">Who would date you</span>
          </div>
          <p className="text-sm font-medium text-white/80 leading-relaxed border-l-2 border-[#7C3AED]/40 pl-3">
            {displayData.whoWouldLikeYou}
          </p>
        </div>

      </div>

      <div className="h-6" />
    </div>
  );
}
