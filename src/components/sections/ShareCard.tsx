"use client";

import { useRef, useState } from "react";
import { toPng } from "html-to-image";
import { Download, Share2, Sparkles, Star, Check, Copy } from "lucide-react";
import confetti from "canvas-confetti";

interface ShareCardProps {
  data: any;
}

export default function ShareCard({ data }: ShareCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [downloading, setDownloading] = useState(false);
  const [copied, setCopied] = useState(false);

  // Fallback defaults
  const instagram = data?.instagram ?? "anonymous";
  const singleScore = data?.singleScore ?? 75;
  const marriageScore = data?.marriageScore ?? 82;
  const greenFlag = data?.greenFlags?.[0] ?? "Replies instantly if he is on his phone.";
  const redFlag = data?.redFlags?.[0] ?? "Replies 4 hours late with 'sorry was sleeping'.";
  const relationshipPotential = data?.relationshipPotential ?? "High marriage material but high initial effort.";

  // Download logic (rendering the DOM card node as a PNG)
  const handleDownload = async () => {
    if (!cardRef.current) return;
    setDownloading(true);

    try {
      // Fire confetti for celebration
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });

      // Capture options
      const dataUrl = await toPng(cardRef.current, {
        cacheBust: true,
        backgroundColor: "#09090B",
        width: 412,
        height: 732,
        style: {
          transform: "scale(1)",
          margin: "0",
          borderRadius: "0",
        }
      });

      const link = document.createElement("a");
      link.download = `WhyAmISingle-Report-${instagram}.png`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error("Error capturing report card image:", err);
    } finally {
      setDownloading(false);
    }
  };

  // Web Share API or copy link fallback
  const handleShare = async () => {
    const shareUrl = typeof window !== "undefined" ? window.location.href : "https://whyamisingle.ai";
    const title = `My Single Score is ${singleScore}%!`;
    const text = `Check out my WhyAmISingle.ai analysis: single score ${singleScore}%, marriage material ${marriageScore}%!`;

    if (navigator.share) {
      try {
        await navigator.share({
          title,
          text,
          url: shareUrl,
        });
      } catch (err) {
        console.warn("Share API cancelled or failed:", err);
      }
    } else {
      // Fallback: Copy link
      try {
        await navigator.clipboard.writeText(`${text} - ${shareUrl}`);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch (err) {
        console.error("Failed to copy share link:", err);
      }
    }
  };

  return (
    <section 
      id="section-8"
      className="relative min-h-screen w-full flex flex-col items-center justify-center py-24 px-6 z-20 bg-black/50"
    >
      <div className="w-full text-center max-w-xl mx-auto mb-10">
        <span className="text-xs font-bold tracking-[0.25em] text-[#7C3AED] uppercase block mb-3">
          Share Vibe
        </span>
        <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4">
          Report Card
        </h2>
        <p className="text-white/50 text-sm md:text-base font-semibold leading-relaxed">
          Your official relationship analysis is generated. Share your score or save it for verification.
        </p>
      </div>

      {/* Grid: Preview Card + Control Buttons */}
      <div className="w-full max-w-4xl flex flex-col md:flex-row items-center justify-center gap-12">
        
        {/* Instagram Story Format Card (Hidden scaling/margins for download render) */}
        <div className="relative p-[1px] rounded-[32px] overflow-hidden bg-gradient-to-b from-[#7C3AED] to-[#DB2777]/30 shadow-2xl shrink-0">
          
          {/* Main Card to render */}
          <div 
            ref={cardRef} 
            className="w-[340px] h-[600px] md:w-[360px] md:h-[640px] bg-[#09090B] text-white p-8 flex flex-col justify-between relative rounded-[32px] overflow-hidden"
          >
            <div className="noise-overlay" />
            
            {/* Top Branding Header */}
            <div className="flex items-center justify-between border-b border-white/5 pb-4 relative z-10">
              <div className="flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-[#7C3AED]" />
                <span className="text-[10px] font-bold tracking-[0.15em] uppercase">WhyAmISingle.ai</span>
              </div>
              <span className="text-[10px] font-bold text-white/40 tracking-wider">
                @{instagram}
              </span>
            </div>

            {/* Score Showcase */}
            <div className="flex flex-col items-center justify-center py-4 relative z-10 select-none">
              <span className="text-[10px] font-bold tracking-[0.25em] text-[#DB2777] uppercase mb-1">
                Singlehood Rating
              </span>
              <div className="relative flex items-center justify-center">
                {/* Score Big Text */}
                <h3 className="text-7xl font-black tracking-tighter text-gradient bg-clip-text text-transparent bg-gradient-to-r from-[#7C3AED] to-[#DB2777]">
                  {singleScore}%
                </h3>
              </div>
            </div>

            {/* Key Assessment stats */}
            <div className="space-y-4 flex-1 flex flex-col justify-center relative z-10 text-left">
              {/* Green Flag */}
              <div className="p-3.5 rounded-2xl bg-white/[0.03] border border-white/5">
                <div className="flex items-center gap-2 mb-1.5 text-emerald-400">
                  <Check className="w-3.5 h-3.5" />
                  <span className="text-[9px] font-bold uppercase tracking-wider">Primary Green Flag</span>
                </div>
                <p className="text-xs font-semibold leading-relaxed text-white/80">
                  {greenFlag}
                </p>
              </div>

              {/* Red Flag */}
              <div className="p-3.5 rounded-2xl bg-white/[0.03] border border-white/5">
                <div className="flex items-center gap-2 mb-1.5 text-[#DB2777]">
                  <Star className="w-3.5 h-3.5 fill-[#DB2777]" />
                  <span className="text-[9px] font-bold uppercase tracking-wider">Primary Red Flag</span>
                </div>
                <p className="text-xs font-semibold leading-relaxed text-white/80">
                  {redFlag}
                </p>
              </div>

              {/* Marriage Forecast */}
              <div className="p-3.5 rounded-2xl bg-white/[0.03] border border-white/5">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-[9px] font-bold uppercase tracking-wider text-white/40">Future Wife Rating</span>
                  <div className="flex text-[#F59E0B]">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-2.5 h-2.5 fill-[#F59E0B]" />
                    ))}
                  </div>
                </div>
                <p className="text-xs font-bold text-white/95 leading-relaxed">
                  {relationshipPotential}
                </p>
              </div>
            </div>

            {/* Bottom URL watermark */}
            <div className="border-t border-white/5 pt-4 text-center relative z-10 flex flex-col items-center gap-1 select-none">
              <span className="text-[8px] font-bold tracking-[0.3em] uppercase text-white/20">Scan code to match</span>
              <span className="text-[10px] font-bold text-white/60">https://whyamisingle.ai</span>
            </div>
            
          </div>
        </div>

        {/* Buttons Controls */}
        <div className="flex flex-col gap-4 w-full max-w-[280px]">
          {/* Download button */}
          <button
            onClick={handleDownload}
            disabled={downloading}
            className="w-full flex items-center justify-center gap-2.5 py-4 px-6 text-sm font-bold text-white rounded-2xl bg-gradient-to-r from-[#7C3AED] to-[#DB2777] shadow-xl hover:shadow-[#7C3AED]/20 hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 cursor-pointer overflow-hidden relative"
          >
            <div className="absolute inset-0 bg-white/10 opacity-0 hover:opacity-100 transition-opacity duration-300" />
            <Download className="w-4 h-4" />
            {downloading ? "Generating PNG..." : "Download Card"}
          </button>

          {/* Share button */}
          <button
            onClick={handleShare}
            className="w-full flex items-center justify-center gap-2.5 py-4 px-6 text-sm font-bold text-white/80 hover:text-white rounded-2xl border border-white/10 bg-white/4 hover:bg-white/8 hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 cursor-pointer"
          >
            {copied ? (
              <>
                <Check className="w-4 h-4 text-emerald-400" />
                Copied Report Link!
              </>
            ) : (
              <>
                <Share2 className="w-4 h-4" />
                Share Report
              </>
            )}
          </button>
        </div>

      </div>
    </section>
  );
}
