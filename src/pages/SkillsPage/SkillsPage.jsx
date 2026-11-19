'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';
import { skillsCategories } from '../../data/skills';

gsap.registerPlugin(ScrollTrigger);

export default function SkillsPage() {
  const navigate = useNavigate();
  const [activeIndex, setActiveIndex] = useState(0); // Frontend open initially
  const isManualClick = useRef(false);
  const clickTimer = useRef(null);

  const containerRef = useRef(null);
  const gridRef = useRef(null);
  const leftColRef = useRef(null);
  const contentWrapperRef = useRef(null);
  const itemRefs = useRef([]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // 1. Entrance animation on inner content wrapper (leaves the sticky container pure & transform-free)
      if (contentWrapperRef.current) {
        gsap.fromTo(
          contentWrapperRef.current,
          { opacity: 0, y: 35 },
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            ease: 'power3.out',
            clearProps: 'transform',
            scrollTrigger: {
              trigger: containerRef.current,
              start: 'top 80%',
              toggleActions: 'play none none none',
              once: true,
            },
          }
        );
      }
    }, containerRef);

    // 2. High-performance, zero-layout-thrash IntersectionObserver for center expansion
    // Detects when each category crosses the center band of the viewport without forcing ScrollTrigger reflows
    const observer = new IntersectionObserver(
      (entries) => {
        if (isManualClick.current) return;
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const idx = Number(entry.target.getAttribute('data-index'));
            if (!isNaN(idx)) {
              setActiveIndex(idx);
            }
          }
        });
      },
      {
        rootMargin: '-30% 0px -30% 0px', // Active inside the comfortable center slice of the screen
        threshold: 0,
      }
    );

    itemRefs.current.forEach((el) => {
      if (el) observer.observe(el);
    });

    return () => {
      ctx.revert();
      observer.disconnect();
    };
  }, []);

  const handleToggle = (index) => {
    isManualClick.current = true;
    setActiveIndex((prev) => (prev === index ? null : index));

    clearTimeout(clickTimer.current);
    clickTimer.current = setTimeout(() => {
      isManualClick.current = false;
    }, 900);
  };

  const handleContactClick = (e) => {
    e.preventDefault();
    const contactEl = document.getElementById('contact');
    if (contactEl) {
      contactEl.scrollIntoView({ behavior: 'smooth' });
    } else {
      navigate('/contact');
    }
  };

  return (
    <section
      ref={containerRef}
      className="relative w-full bg-[#000000] text-white selection:bg-[#FF3300] selection:text-white font-sans antialiased pt-20 sm:pt-28 md:pt-36 pb-36 md:pb-48"
    >
      <div className="w-full max-w-[1540px] mx-auto px-6 sm:px-10 md:px-16 lg:px-20 relative">
        <div
          ref={gridRef}
          className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 relative items-start transform-gpu"
        >
          {/* ========================================================= */}
          {/* LEFT COLUMN (6 cols on Desktop)                           */}
          {/* Hardware-accelerated native sticky (top-0 h-screen)       */}
          {/* Perfect Y-axis center throughout skills, then scrolls up  */}
          {/* with buttery 60fps smoothness alongside the right column  */}
          {/* ========================================================= */}
          <div
            ref={leftColRef}
            className="lg:col-span-6 lg:h-screen lg:sticky lg:top-0 flex flex-col justify-center z-10 max-w-xl xl:max-w-2xl pt-8 lg:pt-0 transform-gpu will-change-transform"
          >
            <div ref={contentWrapperRef}>
              {/* Bold Punchy Headline (Formatted cleanly in 5 lines) */}
              <h2 className="text-2xl sm:text-3xl lg:text-[2rem] xl:text-[2.25rem] font-extrabold uppercase leading-[1.3] tracking-tight text-white select-text max-w-xl">
                COMPUTER SCIENCE STUDENT IN CHENNAI, SPECIALIZED IN WEB DEVELOPMENT AND INTELLIGENT SOFTWARE DEVELOPMENT.
              </h2>

              {/* Thin Separator Line */}
              <div className="border-t border-neutral-800/90 my-8 sm:my-10 max-w-md" />

              {/* Interactive Contact Link */}
              <div>
                <a
                  href="#contact"
                  onClick={handleContactClick}
                  className="group inline-flex items-center gap-1.5 uppercase text-xs font-bold tracking-[0.2em] text-neutral-300 hover:text-[#FF3300] transition-colors duration-300 cursor-pointer"
                >
                  <span>CONTACT ME</span>
                  <span className="text-[#FF3300] text-sm group-hover:rotate-45 transition-transform duration-300">✦</span>
                </a>
              </div>
            </div>
          </div>

          {/* ========================================================= */}
          {/* RIGHT COLUMN (6 cols on Desktop) - Spacious Length        */}
          {/* Expands smoothly at center with generous editorial flow   */}
          {/* ========================================================= */}
          <div className="lg:col-span-6 max-w-lg lg:max-w-xl xl:max-w-2xl ml-auto w-full flex flex-col space-y-16 sm:space-y-20 md:space-y-28 relative pt-8 sm:pt-12 lg:pt-16 pb-24">
            {skillsCategories.map((category, index) => {
              const isOpen = activeIndex === index;
              return (
                <div
                  key={category.id}
                  data-index={index}
                  ref={(el) => (itemRefs.current[index] = el)}
                  className={`group border-b border-neutral-900/70 py-6 sm:py-8 md:py-10 min-h-[140px] sm:min-h-[170px] md:min-h-[190px] flex flex-col justify-center transition-all duration-500 ease-out ${
                    isOpen ? 'opacity-100 scale-100' : 'opacity-40 hover:opacity-85 scale-[0.99]'
                  }`}
                >
                  {/* Category Header */}
                  <button
                    type="button"
                    onClick={() => handleToggle(index)}
                    className="w-full flex items-center justify-between text-left cursor-pointer group-hover:text-white transition-colors duration-200 focus:outline-none"
                    aria-expanded={isOpen}
                  >
                    <span
                      className={`text-3xl sm:text-4xl md:text-[2.65rem] font-semibold tracking-tight transition-all duration-300 ${
                        isOpen ? 'text-white' : 'text-neutral-300 group-hover:text-white'
                      }`}
                    >
                      {category.title}
                    </span>

                    {/* Toggle Indicator (+ / —) */}
                    <span
                      className="text-2xl sm:text-3xl md:text-4xl font-light text-vivid-crimson group-hover:text-vivid-crimson transition-all duration-300 w-10 text-right select-none"
                      aria-hidden="true"
                    >
                      {isOpen ? '-' : '+'}
                    </span>
                  </button>

                  {/* Smooth Height Expansion with CSS Grid */}
                  <div
                    className={`grid transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                      isOpen ? 'grid-rows-[1fr] opacity-100 mt-6' : 'grid-rows-[0fr] opacity-0 mt-0 pointer-events-none'
                    }`}
                  >
                    <div className="overflow-hidden">
                      <ul className="text-sm sm:text-base font-medium text-neutral-400 space-y-3 pl-1">
                        {category.skills.map((skill) => (
                          <li
                            key={skill}
                            className="hover:text-neutral-200 transition-colors duration-150 select-text cursor-default"
                          >
                            {skill}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

        </div>
      </div>
    </section>
  );
}
