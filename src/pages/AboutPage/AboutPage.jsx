'use client'
import React, { useEffect, useRef, useState } from 'react';

/**
 * AboutPage component.
 * Features an asymmetric light-mode editorial portrait spread.
 * Plays premium cinematic staggers every time it enters the viewport (up or down).
 */
export default function AboutPage() {
  const [step, setStep] = useState(1); 
  const [isScrolledIntoView, setIsScrolledIntoView] = useState(false);
  const containerRef = useRef(null);
  const isTransitioning = useRef(false);

  useEffect(() => {
    // 1. Dual-directional Intersection Observer
    const viewObserver = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          // Fire premium animations when page comes into focus zone
          setIsScrolledIntoView(true);
        } else {
          // Reset states completely when leaving the page (scrolling up or down away from it)
          setIsScrolledIntoView(false);
          setStep(1); // Optional: resets paragraphs to first step for a fresh revisit
        }
      },
      { 
        root: null,
        threshold: 0.1 // Triggers quickly as soon as 10% of the page crosses the boundary
      }
    );

    if (containerRef.current) {
      viewObserver.observe(containerRef.current);
    }

    // 2. Dual-step single-notch scroll mechanics controller
    const handleWheel = (e) => {
      if (!containerRef.current) return;

      const rect = containerRef.current.getBoundingClientRect();
      const isPageFocused = Math.abs(rect.top) < 10;

      if (!isPageFocused) return;

      // Scroll DOWN
      if (e.deltaY > 0) {
        if (step === 1) {
          e.preventDefault();
          if (!isTransitioning.current) {
            isTransitioning.current = true;
            setStep(2);
            setTimeout(() => { isTransitioning.current = false; }, 600);
          }
        }
      }
      
      // Scroll UP
      if (e.deltaY < 0) {
        if (step === 2) {
          e.preventDefault();
          if (!isTransitioning.current) {
            isTransitioning.current = true;
            setStep(1);
            setTimeout(() => { isTransitioning.current = false; }, 600);
          }
        }
      }
    };

    const element = containerRef.current;
    if (element) {
      element.addEventListener('wheel', handleWheel, { passive: false });
    }

    return () => {
      if (element) element.removeEventListener('wheel', handleWheel);
      viewObserver.disconnect();
    };
  }, [step]);

  return (
    <section 
      ref={containerRef}
      id="about" 
      className={`relative w-full h-screen bg-[#f4f1ea] text-zinc-900 px-6 md:px-16 py-12 flex flex-col justify-between overflow-hidden select-none ${
        isScrolledIntoView ? 'active-scroll' : ''
      }`}
    >
      <style dangerouslySetInnerHTML={{
        __html: `
        /* ════════════════════════════════════════════════
           PREMIUM REPLAYABLE CINEMATIC SCROLL TRIGGER
        ════════════════════════════════════════════════ */
        @keyframes aboutLineExpand {
          from { transform: scaleX(0); }
          to   { transform: scaleX(1); }
        }
        @keyframes aboutHeadingRise {
          from { opacity: 0; transform: translateY(48px); filter: blur(8px); }
          to   { opacity: 1; transform: translateY(0);    filter: blur(0);   }
        }
        @keyframes aboutPortraitReveal {
          from { opacity: 0; transform: translateY(40px) scale(0.96); filter: blur(4px); }
          to   { opacity: 1; transform: translateY(0)    scale(1);    filter: blur(0);   }
        }
        @keyframes aboutFadeRise {
          from { opacity: 0; transform: translateY(24px); }
          to   { opacity: 1; transform: translateY(0);    }
        }

        /* Dormant States: Resets cleanly when out of viewport focus */
        .about-rule {
          height: 1px;
          background: #d4d4d8; 
          transform-origin: left;
          transform: scaleX(0);
        }
        .about-h2-anim, .about-portrait, .about-text-column { 
          opacity: 0;
          transform: translateY(20px);
        }

        /* Active State System: Fires staggers whenever class modifier returns */
        .active-scroll .about-rule {
          animation: aboutLineExpand 1.2s cubic-bezier(0.16, 1, 0.3, 1) 0.1s both;
        }
        .active-scroll .about-h2-anim { 
          animation: aboutHeadingRise 1.4s cubic-bezier(0.16, 1, 0.3, 1) 0.2s both; 
        }
        .active-scroll .about-portrait { 
          animation: aboutPortraitReveal 1.5s cubic-bezier(0.16, 1, 0.3, 1) 0.3s both; 
        }
        .active-scroll .about-text-column { 
          animation: aboutFadeRise 1.2s cubic-bezier(0.16, 1, 0.3, 1) 0.45s both; 
        }

        /* Image interactions */
        .about-portrait-img {
          transition: transform 1.2s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .about-portrait-wrap:hover .about-portrait-img {
          transform: scale(1.05);
        }
      `}} />

      {/* ── DESIGN TOP HALF: STRUCTURAL VISUAL ANCHOR ── */}
      <div className="w-full flex flex-col items-start pt-4 md:pt-2">
        <h2 className="about-h2-anim font-heading font-black text-[12vw] leading-[0.8] tracking-[-0.05em] uppercase text-neutral-800/80 select-none pointer-events-none">
          ABOUT·ME
        </h2>
        <div className="about-rule w-full h-[1px] mt-4 md:mt-6 mb-4" />
      </div>

      {/* ── DESIGN BOTTOM HALF: ASYMMETRIC PORTRAIT & BIO SPREAD ── */}
      <div className="w-full grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-16 items-center justify-center mt-auto pb-4 md:pb-8">
        
        {/* COLUMN LEFT (Span 4): Premium Animated Portrait Frame */}
        <div className="md:col-span-4 flex justify-center items-center w-full">
          <div
            className="about-portrait about-portrait-wrap relative rounded-2xl overflow-hidden w-full max-w-[340px] border border-zinc-200 shadow-[0_30px_60px_-15px_rgba(0,0,0,0.15)]"
            style={{ aspectRatio: '3 / 4' }}
          >
            <img
              src="https://raw.githubusercontent.com/jayanthanghjkl/Images/refs/heads/main/IMG_20251226_223030_757.webp"
              alt="Portrait of Jayanthan"
              className="about-portrait-img absolute inset-0 w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent pointer-events-none" />
            <span className="absolute bottom-4 left-4 font-mono text-[10px] tracking-[0.15em] uppercase text-zinc-800 bg-white/80 backdrop-blur-md px-2 py-0.5 rounded border border-white/40">
              CSE &rsquo;26
            </span>
          </div>
        </div>

        {/* COLUMN RIGHT (Span 8): Interlocking Typography Block */}
        <div className="about-text-column md:col-span-8 flex flex-col gap-6">
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-3">
              <div className="h-px w-8 bg-vivid-crimson" />
              <h3 className="text-vivid-crimson font-mono text-xs uppercase tracking-widest font-bold">
                Biography
              </h3>
            </div>
            
            {/* Paragraph 1 */}
            <p className={`font-body text-lg md:text-xl leading-relaxed tracking-wide max-w-2xl transition-all duration-500 ease-out ${
              step === 1 ? 'text-zinc-800 font-normal opacity-100' : 'text-zinc-700 font-light opacity-40'
            }`}>
              I am a software engineer focused on building high-performance digital experiences. 
              My work lives at the intersection of complex architectural design systems and clean, 
              highly scalable, fluid code implementation.
            </p>
          </div>
          
          {/* Paragraph 2 */}
          <p className={`font-body text-base md:text-lg leading-relaxed max-w-xl transition-all duration-500 ease-out ${
            step === 2 ? 'text-zinc-800 font-normal opacity-100' : 'text-zinc-700 font-light opacity-40'
          }`}>
            Driven by design psychology and creative technology, I engineer interactive products 
            that don&rsquo;t just function perfectly under the hood, but feel premium and natural to the end user.
          </p>
        </div>

      </div>
    </section>
  );
}
