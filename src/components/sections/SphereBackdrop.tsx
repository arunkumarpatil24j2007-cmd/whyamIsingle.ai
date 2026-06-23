"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export default function SphereBackdrop() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const row1Ref = useRef<HTMLDivElement>(null);
  const row2Ref = useRef<HTMLDivElement>(null);
  const row3Ref = useRef<HTMLDivElement>(null);
  const row4Ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!sectionRef.current) return;

    // Pin Section 3 and animate the background text layers
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: sectionRef.current,
        start: "top top",
        end: "+=100%", // Pin for 1 viewport height
        scrub: 1.0,
        pin: true,
        anticipatePin: 1,
      },
    });

    // Animate rows in alternating directions
    tl.to(row1Ref.current, { xPercent: -20, ease: "none" }, 0)
      .to(row2Ref.current, { xPercent: 20, ease: "none" }, 0)
      .to(row3Ref.current, { xPercent: -15, ease: "none" }, 0)
      .to(row4Ref.current, { xPercent: 25, ease: "none" }, 0);

    return () => {
      tl.scrollTrigger?.kill();
      tl.kill();
    };
  }, []);

  return (
    <div 
      ref={sectionRef} 
      id="section-3"
      className="w-full h-screen relative flex flex-col justify-center items-center overflow-hidden bg-black z-0 select-none"
    >
      {/* Background scrolling words container - placed behind 3D Canvas */}
      <div className="absolute inset-0 flex flex-col justify-around py-16 opacity-35">
        
        {/* Row 1 - Desperate */}
        <div className="w-[200vw] -translate-x-[20vw] overflow-hidden" ref={row1Ref}>
          <div className="scrolling-bg-text">
            DESPERATE &bull; DESPERATE &bull; DESPERATE &bull; DESPERATE &bull; DESPERATE
          </div>
        </div>

        {/* Row 2 - Confused */}
        <div className="w-[200vw] -translate-x-[40vw] overflow-hidden" ref={row2Ref}>
          <div className="scrolling-bg-text text-[#DB2777]/5">
            CONFUSED &bull; CONFUSED &bull; CONFUSED &bull; CONFUSED &bull; CONFUSED
          </div>
        </div>

        {/* Row 3 - Overthinking */}
        <div className="w-[200vw] -translate-x-[25vw] overflow-hidden" ref={row3Ref}>
          <div className="scrolling-bg-text">
            OVERTHINKING &bull; OVERTHINKING &bull; OVERTHINKING &bull; OVERTHINKING &bull; OVERTHINKING
          </div>
        </div>

        {/* Row 4 - Hopeful */}
        <div className="w-[200vw] -translate-x-[50vw] overflow-hidden" ref={row4Ref}>
          <div className="scrolling-bg-text text-[#7C3AED]/5">
            HOPEFUL &bull; HOPEFUL &bull; HOPEFUL &bull; HOPEFUL &bull; HOPEFUL
          </div>
        </div>
      </div>
    </div>
  );
}
