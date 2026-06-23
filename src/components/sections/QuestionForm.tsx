"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Upload, Sparkles, AlertCircle } from "lucide-react";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

interface QuestionFormProps {
  onAnalysisComplete: (result: any) => void;
}

export default function QuestionForm({ onAnalysisComplete }: QuestionFormProps) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);

  // Form State
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [age, setAge] = useState<number>(24);
  const [height, setHeight] = useState<number>(172);
  const [instagram, setInstagram] = useState<string>("");
  
  // App States
  const [uploading, setUploading] = useState<boolean>(false);
  const [analyzing, setAnalyzing] = useState<boolean>(false);
  const [loadingStep, setLoadingStep] = useState<string>("");
  const [error, setError] = useState<string | null>(null);

  // Letter by letter animation
  useEffect(() => {
    if (!titleRef.current) return;
    
    const element = titleRef.current;
    const text = element.innerText;
    element.innerHTML = "";
    
    // Split text into characters wrapping each in a span
    const chars = text.split("").map((char) => {
      const span = document.createElement("span");
      span.className = "inline-block opacity-0 translate-y-4 filter blur-sm transition-all duration-300";
      span.innerHTML = char === " " ? "&nbsp;" : char;
      element.appendChild(span);
      return span;
    });

    // GSAP ScrollTrigger to reveal letters
    const st = ScrollTrigger.create({
      trigger: element,
      start: "top 75%",
      onEnter: () => {
        gsap.to(chars, {
          opacity: 1,
          y: 0,
          filter: "blur(0px)",
          stagger: 0.04,
          duration: 0.8,
          ease: "back.out(1.7)",
        });
      },
    });

    // Fade in form card
    const cardSt = gsap.fromTo(
      cardRef.current,
      { opacity: 0, y: 50 },
      {
        opacity: 1,
        y: 0,
        duration: 1.2,
        ease: "power3.out",
        scrollTrigger: {
          trigger: cardRef.current,
          start: "top 80%",
        },
      }
    );

    return () => {
      st.kill();
      cardSt.scrollTrigger?.kill();
      cardSt.kill();
    };
  }, []);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setError(null);
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith("image/")) {
        setError("Please upload an image file");
        return;
      }
      if (file.size > 4 * 1024 * 1024) {
        setError("Image must be smaller than 4MB");
        return;
      }
      setImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setError(null);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      if (!file.type.startsWith("image/")) {
        setError("Please upload an image file");
        return;
      }
      setImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!image) {
      setError("Please upload a picture of yourself first.");
      return;
    }

    setUploading(true);
    setError(null);
    setLoadingStep("Uploading image...");

    try {
      // 1. Upload File (local fallback)
      const formData = new FormData();
      formData.append("file", image);
      
      const uploadResp = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (!uploadResp.ok) throw new Error("Image upload failed");
      const uploadData = await uploadResp.json();
      const uploadedUrl = uploadData.url;

      // 2. Perform Gemini analysis
      setUploading(false);
      setAnalyzing(true);
      
      const steps = [
        "Scanning facial symmetry...",
        "Scraping dating market coefficients...",
        "Querying Gemini AI analyzer...",
        "Formulating red flags...",
        "Synthesizing future wife review...",
        "Finalizing score report..."
      ];
      
      let stepIdx = 0;
      setLoadingStep(steps[0]);
      
      const interval = setInterval(() => {
        stepIdx = (stepIdx + 1) % steps.length;
        setLoadingStep(steps[stepIdx]);
      }, 2000);

      const analyzeResp = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          instagram: instagram || "anonymous",
          age,
          height,
          imageUrl: window.location.origin + uploadedUrl,
        }),
      });

      clearInterval(interval);

      if (!analyzeResp.ok) throw new Error("Analysis failed");
      const resultData = await analyzeResp.json();

      setAnalyzing(false);
      onAnalysisComplete(resultData);

      // Smoothly scroll to the analysis section (Section 5)
      setTimeout(() => {
        const lenis = (window as any).lenis;
        const target = document.querySelector("#section-5");
        if (lenis && target) {
          lenis.scrollTo(target, { offset: 0, duration: 1.8 });
        }
      }, 200);

    } catch (err: any) {
      console.error(err);
      setError(err.message || "An unexpected error occurred. Please try again.");
      setUploading(false);
      setAnalyzing(false);
    }
  };

  return (
    <section 
      ref={sectionRef}
      id="section-4"
      className="relative min-h-screen w-full flex flex-col lg:flex-row items-center justify-center gap-12 py-24 px-6 md:px-16 lg:px-24 z-20 overflow-hidden bg-black/40"
    >
      {/* Left Typography Block */}
      <div className="flex-1 text-left flex flex-col justify-center max-w-xl">
        <span className="text-xs font-bold tracking-[0.25em] text-[#DB2777] uppercase mb-4">
          The Moment of Truth
        </span>
        <h2 
          ref={titleRef} 
          className="font-sans text-5xl md:text-7xl font-extrabold tracking-tight text-white leading-tight mb-6"
        >
          WHY ARE YOU STILL SINGLE?
        </h2>
        <p className="text-lg text-white/50 leading-relaxed font-medium mb-4">
          Millions of people ask this question to themselves every single night.
        </p>
        <p className="text-lg text-[#F59E0B] font-semibold leading-relaxed">
          Very few receive a completely honest, raw answer. Until now.
        </p>
      </div>

      {/* Right Form Card */}
      <div className="flex-1 w-full max-w-lg">
        <div ref={cardRef} className="reeded-glass p-8 md:p-10 relative">
          <div className="noise-overlay" />
          
          {(uploading || analyzing) ? (
            // Loading Overlay
            <div className="flex flex-col items-center justify-center py-20 text-center select-none relative z-10">
              <div className="w-16 h-16 rounded-full border-t-2 border-r-2 border-[#7C3AED] animate-spin mb-8" />
              <h3 className="text-xl font-bold mb-3">Analyzing Profile</h3>
              <p className="text-sm text-white/60 animate-pulse">{loadingStep}</p>
            </div>
          ) : (
            // Main Form
            <form onSubmit={handleSubmit} className="space-y-6 relative z-10 text-left">
              <h3 className="text-2xl font-bold tracking-tight mb-2">Upload Profile</h3>
              
              {error && (
                <div className="flex items-center gap-2 p-4 bg-red-950/20 border border-red-500/20 rounded-xl text-red-400 text-sm">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              {/* File Upload drag area */}
              <div 
                onDragOver={handleDragOver}
                onDrop={handleDrop}
                onClick={() => document.getElementById("file-upload")?.click()}
                className="group relative border-2 border-dashed border-white/10 hover:border-[#7C3AED]/40 rounded-2xl p-6 flex flex-col items-center justify-center text-center cursor-pointer transition-all duration-300 bg-white/[0.01]"
              >
                {imagePreview ? (
                  <div className="relative w-full h-44 rounded-xl overflow-hidden">
                    <img 
                      src={imagePreview} 
                      alt="Profile preview" 
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <span className="text-xs font-semibold px-3 py-1.5 bg-black/60 rounded-full border border-white/10">
                        Replace image
                      </span>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="p-4 rounded-xl bg-white/4 group-hover:bg-[#7C3AED]/10 text-white/40 group-hover:text-[#7C3AED] transition-all duration-300 mb-4">
                      <Upload className="w-6 h-6" />
                    </div>
                    <span className="text-sm font-semibold text-white/80 mb-1">
                      Drag & drop your portrait here
                    </span>
                    <span className="text-xs text-white/40">
                      Or click to browse (Max 4MB)
                    </span>
                  </>
                )}
                <input 
                  id="file-upload"
                  type="file" 
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
              </div>

              {/* Age Slider */}
              <div className="space-y-2">
                <div className="flex justify-between text-sm font-semibold">
                  <span className="text-white/60">Age</span>
                  <span>{age} years old</span>
                </div>
                <input 
                  type="range" 
                  min="18" 
                  max="60"
                  value={age}
                  onChange={(e) => setAge(parseInt(e.target.value))}
                  className="w-full accent-[#7C3AED] bg-white/10 h-1 rounded-lg cursor-pointer"
                />
              </div>

              {/* Height Slider */}
              <div className="space-y-2">
                <div className="flex justify-between text-sm font-semibold">
                  <span className="text-white/60">Height</span>
                  <span>{height} cm</span>
                </div>
                <input 
                  type="range" 
                  min="120" 
                  max="220"
                  value={height}
                  onChange={(e) => setHeight(parseInt(e.target.value))}
                  className="w-full accent-[#DB2777] bg-white/10 h-1 rounded-lg cursor-pointer"
                />
              </div>

              {/* Instagram handle */}
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-white/60">
                  Instagram handle
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30 font-semibold">
                    @
                  </span>
                  <input 
                    type="text" 
                    placeholder="username"
                    value={instagram}
                    onChange={(e) => setInstagram(e.target.value)}
                    className="w-full bg-white/4 border border-white/8 focus:border-[#7C3AED]/40 rounded-xl py-3 pl-10 pr-4 text-sm text-white placeholder-white/20 outline-none transition-all duration-300 font-semibold"
                  />
                </div>
              </div>

              {/* Submit CTA */}
              <button
                type="submit"
                className="w-full flex items-center justify-center gap-2 relative py-4 text-sm font-bold text-white rounded-xl bg-gradient-to-r from-[#7C3AED] to-[#DB2777] shadow-xl transition-transform duration-300 active:scale-[0.98] cursor-pointer overflow-hidden"
              >
                <div className="absolute inset-0 bg-white/10 opacity-0 hover:opacity-100 transition-opacity duration-300" />
                <Sparkles className="w-4 h-4" />
                Analyze Vibe
              </button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
