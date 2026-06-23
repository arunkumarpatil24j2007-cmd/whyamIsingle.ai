"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export default function MorphText() {
  const pinRef = useRef<HTMLDivElement>(null);
  const text1Ref = useRef<HTMLHeadingElement>(null);
  const text2Ref = useRef<HTMLHeadingElement>(null);
  const text3Ref = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    if (!pinRef.current) return;

    // Pin Section 2 and animate text lines one-by-one with pauses
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: pinRef.current,
        start: "top top",
        end: "+=150%", // Keep pinned for 1.5 viewport heights
        scrub: 1.0,
        pin: true,
        anticipatePin: 1,
      },
    });

    tl.fromTo(
      text1Ref.current,
      { opacity: 0, x: -80, filter: "blur(10px)" },
      { opacity: 1, x: 0, filter: "blur(0px)", duration: 1.2, ease: "power2.out" }
    )
    .to(text1Ref.current, { opacity: 0.15, duration: 0.8 }) // Dim line 1
    .fromTo(
      text2Ref.current,
      { opacity: 0, x: -80, filter: "blur(10px)" },
      { opacity: 1, x: 0, filter: "blur(0px)", duration: 1.2, ease: "power2.out" },
      "+=0.4" // Pause before line 2
    )
    .to(text2Ref.current, { opacity: 0.15, duration: 0.8 }) // Dim line 2
    .fromTo(
      text3Ref.current,
      { opacity: 0, x: -80, filter: "blur(10px)" },
      { opacity: 1, x: 0, filter: "blur(0px)", duration: 1.2, ease: "power2.out" },
      "+=0.4" // Pause before line 3
    )
    .to({}, { duration: 1.0 }); // End padding (hold third phrase)

    return () => {
      tl.scrollTrigger?.kill();
      tl.kill();
    };
  }, []);

  return (
    <div 
      ref={pinRef} 
      id="section-2"
      className="w-full h-screen flex flex-col justify-center px-12 md:px-24 z-20 select-none relative"
    >
      <div className="max-w-4xl flex flex-col gap-10 md:gap-14 text-left">
        <h2 
          ref={text1Ref} 
          className="font-sans text-6xl md:text-8xl lg:text-9xl font-black tracking-tight text-white"
        >
          Not ugly.
        </h2>
        <h2 
          ref={text2Ref} 
          className="font-sans text-6xl md:text-8xl lg:text-9xl font-black tracking-tight text-white"
        >
          Not broken.
        </h2>
        <h2 
          ref={text3Ref} 
          className="font-sans text-6xl md:text-8xl lg:text-9xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-[#7C3AED] to-[#DB2777]"
        >
          Just misunderstood.
        </h2>
      </div>
    </div>
  );
}
