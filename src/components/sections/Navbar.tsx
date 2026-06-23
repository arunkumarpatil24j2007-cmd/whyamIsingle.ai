"use client";

import { Sparkles } from "lucide-react";

export default function Navbar() {
  const scrollToSection = (id: string) => {
    const lenis = (window as any).lenis;
    const target = document.querySelector(id);
    if (lenis && target) {
      lenis.scrollTo(target, { offset: 0, duration: 1.5 });
    } else if (target) {
      target.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <nav className="fixed top-6 left-1/2 -translate-x-1/2 z-50 w-[90%] max-w-5xl">
      <div className="reeded-glass px-6 py-4 flex items-center justify-between">
        <div className="noise-overlay" />
        
        {/* Logo */}
        <div 
          onClick={() => scrollToSection("#section-1")}
          className="flex items-center gap-2 cursor-pointer group"
        >
          <div className="p-1.5 rounded-lg bg-gradient-to-r from-[#7C3AED] to-[#DB2777] text-white">
            <Sparkles className="w-5 h-5 group-hover:rotate-12 transition-transform duration-300" />
          </div>
          <span className="font-sans font-bold tracking-tight text-white text-lg">
            WhyAmISingle<span className="text-gradient bg-clip-text text-transparent bg-gradient-to-r from-[#7C3AED] to-[#DB2777]">.ai</span>
          </span>
        </div>

        {/* Links */}
        <div className="hidden md:flex items-center gap-8 text-sm font-medium">
          <button 
            onClick={() => scrollToSection("#section-2")}
            className="text-secondary-text hover:text-white transition-colors duration-200"
          >
            How it works
          </button>
          <button 
            onClick={() => scrollToSection("#section-5")}
            className="text-secondary-text hover:text-white transition-colors duration-200"
          >
            Examples
          </button>
          <button 
            onClick={() => scrollToSection("#section-4")}
            className="text-secondary-text hover:text-white transition-colors duration-200"
          >
            Try Now
          </button>
        </div>

        {/* CTA Actions */}
        <div className="flex items-center gap-4">
          <a
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 rounded-full border border-white/8 hover:bg-white/4 text-secondary-text hover:text-white transition-all duration-200"
          >
            <svg 
              className="w-4 h-4" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round"
            >
              <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
              <path d="M9 18c-4.51 2-5-2-7-2" />
            </svg>
          </a>
          <button
            onClick={() => scrollToSection("#section-4")}
            className="relative px-5 py-2 text-xs font-semibold text-white rounded-full bg-gradient-to-r from-[#7C3AED] to-[#DB2777] transition-transform duration-300 active:scale-95 cursor-pointer hidden sm:block overflow-hidden"
          >
            <div className="absolute inset-0 bg-white/10 opacity-0 hover:opacity-100 transition-opacity duration-300" />
            Analyze Now
          </button>
        </div>
      </div>
    </nav>
  );
}
