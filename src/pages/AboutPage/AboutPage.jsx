import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';
import HoverHighlightText from '../../components/effects/HoverHighlightText';
import HalftoneReveal from '../../components/effects/HalftoneReveal';
import VariableProximity from '../../components/effects/VariableProximity';

gsap.registerPlugin(ScrollTrigger);

/**
 * AboutPage component.
 * Features an asymmetric light-mode editorial portrait spread.
 * Plays premium cinematic staggers smoothly via GSAP ScrollTrigger.
 */
export default function AboutPage() {
  const containerRef = useRef(null);

  return (
    <section
      ref={containerRef}
      id="about"
      className="relative w-full h-full text-zinc-900 px-6 md:px-16 py-12 flex flex-col justify-between overflow-hidden select-none pointer-events-none"
    >
      <style dangerouslySetInnerHTML={{
        __html: `
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
          <VariableProximity
            label="ABOUT·ME"
            className="variable-proximity-demo"
            fromFontVariationSettings="'wght' 900"
            toFontVariationSettings="'wght' 300"
            containerRef={containerRef}
            radius={300}
            falloff="linear"
          />
        </h2>
        <div className="about-rule w-full h-[1px] mt-4 md:mt-6 mb-4 bg-[#d4d4d8]" />
      </div>

      {/* ── DESIGN BOTTOM HALF: ASYMMETRIC PORTRAIT & BIO SPREAD ── */}
      <div className="w-full grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-16 items-center justify-center mt-auto pb-4 md:pb-8">

        {/* COLUMN LEFT (Span 5): Premium Animated Portrait Frame */}
        <div className="md:col-span-5 flex justify-center items-center w-full">
          <div
            className="about-portrait about-portrait-wrap relative rounded-2xl overflow-hidden h-[75vh] md:h-[67vh] max-h-[600px] max-w-[90vw] border border-zinc-200 shadow-[0_30px_60px_-15px_rgba(0,0,0,0.15)] opacity-0 pointer-events-auto"
            style={{ aspectRatio: '3 / 4' }}
          >
            <HalftoneReveal
              src="https://raw.githubusercontent.com/jayanthanghjkl/Images/refs/heads/main/IMG_20251226_223030_757.webp"
              inkColor="#e60026"
              paperColor="#000000"
              mode="duotone"
              dotDensity={90}
              angle={28}
              revealRadius={0.3}
              follow={0.05}
              invert={true}
              className="absolute inset-0 w-full h-full z-0"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent pointer-events-none z-10" />
            <span className="absolute bottom-4 left-4 font-mono text-[10px] tracking-[0.15em] uppercase text-zinc-800 bg-white/80 backdrop-blur-md px-2 py-0.5 rounded border border-white/40 z-20">
              [ 2028 &mdash; passout ]
            </span>
          </div>
        </div>

        {/* COLUMN RIGHT (Span 7): Interlocking Typography Block */}
        <div className="about-text-column md:col-span-7 flex flex-col gap-8 opacity-0">
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-3">
              <div className="h-px w-8 bg-vivid-crimson" />
              <h3 className="text-vivid-crimson font-mono text-sm uppercase tracking-widest font-bold">
                Biography
              </h3>
            </div>

            {/* Paragraph 1 */}
            <HoverHighlightText 
              className="about-para-1 font-body text-xl md:text-2xl leading-relaxed tracking-wide max-w-2xl text-zinc-800 font-normal opacity-40 transition-opacity"
              radius={80}
            >
              I am a software engineer focused on building high-performance digital experiences.
              My work lives at the intersection of complex architectural design systems and clean,
              highly scalable, fluid code implementation.
            </HoverHighlightText>
          </div>

          {/* Paragraph 2 */}
          <HoverHighlightText 
            className="about-para-2 font-body text-xl md:text-2xl leading-relaxed tracking-wide max-w-2xl text-zinc-800 font-normal opacity-40 transition-opacity"
            radius={80}
          >
            Driven by design psychology and creative technology, I engineer interactive products<br />
            that don&rsquo;t just function perfectly under the hood, but feel premium and natural to the end user.
          </HoverHighlightText>
        </div>

      </div>
    </section>
  );
}
