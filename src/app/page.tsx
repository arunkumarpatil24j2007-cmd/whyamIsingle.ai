"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import Navbar from "@/components/sections/Navbar";
import Hero from "@/components/sections/Hero";
import MorphText from "@/components/sections/MorphText";
import SphereBackdrop from "@/components/sections/SphereBackdrop";
import QuestionForm from "@/components/sections/QuestionForm";
import AnalysisCards from "@/components/sections/AnalysisCards";
import LoveForecast from "@/components/sections/LoveForecast";
import FutureWife from "@/components/sections/FutureWife";
import ShareCard from "@/components/sections/ShareCard";

// Load React Three Fiber canvas dynamically to prevent SSR hydration errors
const CinematicCanvas = dynamic(() => import("@/components/CinematicCanvas"), {
  ssr: false,
  loading: () => (
    <div className="fixed inset-0 w-full h-full bg-[#09090B] flex items-center justify-center z-10">
      <div className="text-white/20 text-xs tracking-[0.2em] uppercase font-bold animate-pulse">
        Initializing 3D Space...
      </div>
    </div>
  ),
});

export default function Home() {
  // State holds the Gemini AI analysis payload
  const [analysisResult, setAnalysisResult] = useState<any>(null);

  return (
    <div className="relative w-full min-h-screen bg-[#09090B] font-sans selection:bg-[#7C3AED]/30 selection:text-white">
      {/* 3D WebGL Canvas Layer */}
      <CinematicCanvas />
      
      {/* Floating Header */}
      <Navbar />

      {/* HTML Sections Overlay (z-20) */}
      <main className="relative w-full flex flex-col z-20">
        <Hero />
        <MorphText />
        <SphereBackdrop />
        <QuestionForm onAnalysisComplete={setAnalysisResult} />
        <AnalysisCards data={analysisResult} />
        <LoveForecast data={analysisResult} />
        <FutureWife />
        <ShareCard data={analysisResult} />
      </main>
    </div>
  );
}

