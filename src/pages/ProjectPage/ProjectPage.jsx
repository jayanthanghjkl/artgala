import React, { useRef, useState, useLayoutEffect } from 'react';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';
import OptionWheel from '../../components/effects/OptionWheel';
import { ParallaxFloatingDemo } from '../../components/ui/parallax-floating-demo';
import TiltedCard from '../../components/ui/TiltedCard';
import { projectsList } from '../../data/projects';
import { THEME_COLORS } from '../../lib/colors';

gsap.registerPlugin(ScrollTrigger);

export default function ProjectPage() {
  const containerRef = useRef(null);
  const innerRef = useRef(null);
  const cursorRef = useRef(null);
  const imageContainerRef = useRef(null);
  const projectShowcaseRef = useRef(null);
  const galleryShowcaseRef = useRef(null);
  const cameraWipeRef = useRef(null);
  const cameraWipeEdgeRef = useRef(null);
  const wheelContainerRef = useRef(null);
  const imageCardRef = useRef(null);
  const blackFadeRef = useRef(null);

  const [activeIndex, setActiveIndex] = useState(0);
  const [wheelScrollIndex, setWheelScrollIndex] = useState(0);
  const [isPinned, setIsPinned] = useState(false);
  const [isHoveringImage, setIsHoveringImage] = useState(false);
  const [galleryProgress, setGalleryProgress] = useState(0);
  const [isMobile, setIsMobile] = useState(typeof window !== 'undefined' ? window.innerWidth < 768 : false);

  useLayoutEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleOptionWheelClick = (index) => {
    const project = galleryProjects[index];
    if (project?.id) {
      window.location.hash = `#project-${project.id}`;
    }
  };

  // Performance tracking refs to prevent redundant React re-renders during high-frequency scroll
  const activeIndexRef = useRef(0);
  const wheelIndexRef = useRef(0);
  const galleryProgressRef = useRef(0);

  // Filter out the featured text item, we only want actual projects with images
  const galleryProjects = projectsList.filter(p => p.image);
  const items = galleryProjects.map(p => p.title);

  useLayoutEffect(() => {
    if (!cursorRef.current) return;

    // Set initial centering for the custom cursor
    gsap.set(cursorRef.current, { xPercent: -50, yPercent: -50 });

    // Create highly performant GSAP quickTo functions
    const xTo = gsap.quickTo(cursorRef.current, "x", { duration: 0.4, ease: "power3.out" });
    const yTo = gsap.quickTo(cursorRef.current, "y", { duration: 0.4, ease: "power3.out" });

    const handleMouseMove = (e) => {
      xTo(e.clientX);
      yTo(e.clientY);
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  useLayoutEffect(() => {
    if (!containerRef.current || !innerRef.current) return;

    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia();

      // DESKTOP (> 768px): Both Option Wheel + 3D Cards AND Floating Gallery are active
      mm.add("(min-width: 769px)", () => {
        const p1End = 0.35;
        const p2End = 0.40;
        const galleryStart = 0.36;

        ScrollTrigger.create({
          trigger: containerRef.current,
          start: 'top top',
          end: `+=${galleryProjects.length * 120 + 350}vh`,
          pin: true,
          scrub: 1.0, // Responsive, fluid catch-up curve
          anticipatePin: 1,
          fastScrollEnd: false,
          snap: {
            snapTo: (value) => {
              if (value > p1End) return value;
              const maxIndex = galleryProjects.length - 1;
              const step = p1End / maxIndex;
              return Math.min(p1End, Math.max(0, Math.round(value / step) * step));
            },
            directional: true,
            duration: { min: 0.2, max: 0.5 },
            delay: 0.05,
            ease: "power1.inOut"
          },
          onToggle: (self) => setIsPinned(self.isActive),
          onUpdate: (self) => {
            const p = self.progress;
            const maxIndex = galleryProjects.length - 1;

            // ACT 1: Dial & 3D Cards (0% – 35%)
            if (p < p1End) {
              const normP = p / p1End;
              const targetIndex = normP * maxIndex;
              const newActive = Math.min(maxIndex, Math.max(0, Math.round(targetIndex)));

              wheelIndexRef.current = targetIndex;
              setWheelScrollIndex(targetIndex);

              if (newActive !== activeIndexRef.current) {
                activeIndexRef.current = newActive;
                setActiveIndex(newActive);
              }
              if (galleryProgressRef.current !== 0) {
                galleryProgressRef.current = 0;
                setGalleryProgress(0);
              }

              if (projectShowcaseRef.current) {
                gsap.set(projectShowcaseRef.current, { x: 0, y: 0, opacity: 1, pointerEvents: 'auto' });
              }
              if (galleryShowcaseRef.current) {
                gsap.set(galleryShowcaseRef.current, { x: 0, y: 0, scale: 1, opacity: 0, pointerEvents: 'none' });
              }
              if (blackFadeRef.current) {
                gsap.set(blackFadeRef.current, { opacity: 0 });
              }
            } else {
              // ACT 2 & 3: Smooth Cross-Transition from Wheel Exit directly into Gallery Entrance
              const exitP = Math.min(1, Math.max(0, (p - p1End) / (p2End - p1End)));
              const targetIndex = maxIndex + exitP * 2.5;

              wheelIndexRef.current = targetIndex;
              setWheelScrollIndex(targetIndex);

              if (projectShowcaseRef.current) {
                const projectOpacity = Math.max(0, 1 - exitP * 1.2);
                gsap.set(projectShowcaseRef.current, {
                  x: 0,
                  y: -exitP * 220,
                  opacity: projectOpacity,
                  pointerEvents: exitP > 0.4 ? 'none' : 'auto'
                });
              }

              // Gallery progression starts blending in at 0.35
              const galleryP = Math.min(1, Math.max(0, (p - galleryStart) / (1.00 - galleryStart)));

              if (Math.abs(galleryP - galleryProgressRef.current) > 0.001) {
                galleryProgressRef.current = galleryP;
                setGalleryProgress(galleryP);
              }

              if (galleryShowcaseRef.current) {
                let galleryOpacity = 1;
                if (galleryP < 0.08) {
                  galleryOpacity = galleryP / 0.08;
                } else if (galleryP > 0.96) {
                  galleryOpacity = Math.max(0, (1 - galleryP) / 0.04);
                }

                gsap.set(galleryShowcaseRef.current, {
                  x: 0,
                  y: 0,
                  scale: 1,
                  opacity: galleryOpacity,
                  pointerEvents: galleryP >= 0.48 && galleryP < 0.76 ? 'auto' : 'none'
                });
              }

              // Black fade-out transition as gallery concludes (0.78 -> 0.97)
              if (blackFadeRef.current) {
                const blackOpacity = Math.min(1, Math.max(0, (galleryP - 0.78) / 0.18));
                gsap.set(blackFadeRef.current, { opacity: blackOpacity });
              }
            }
          }
        });
      });

      // MOBILE & TABLET (<= 768px): Gallery section is SKIPPED!
      // Only Option Wheel is scrolled, and smoothly transitions straight to the next section
      mm.add("(max-width: 768px)", () => {
        const maxIndex = galleryProjects.length - 1;

        ScrollTrigger.create({
          trigger: containerRef.current,
          start: 'top top',
          end: `+=${galleryProjects.length * 60 + 80}vh`,
          pin: true,
          scrub: 0.8,
          anticipatePin: 1,
          snap: {
            snapTo: (value) => {
              if (value > 0.85) return value;
              const step = 0.85 / maxIndex;
              return Math.min(0.85, Math.max(0, Math.round(value / step) * step));
            },
            duration: { min: 0.2, max: 0.4 },
            ease: "power1.inOut"
          },
          onToggle: (self) => setIsPinned(self.isActive),
          onUpdate: (self) => {
            const p = self.progress;

            // Gallery showcase is strictly invisible and inactive on mobile/tablet
            if (galleryShowcaseRef.current) {
              gsap.set(galleryShowcaseRef.current, { opacity: 0, pointerEvents: 'none' });
            }

            // 0.00 -> 0.85: Scroll through Option Wheel
            if (p <= 0.85) {
              const normP = p / 0.85;
              const targetIndex = normP * maxIndex;
              const newActive = Math.min(maxIndex, Math.max(0, Math.round(targetIndex)));

              wheelIndexRef.current = targetIndex;
              setWheelScrollIndex(targetIndex);

              if (newActive !== activeIndexRef.current) {
                activeIndexRef.current = newActive;
                setActiveIndex(newActive);
              }

              if (projectShowcaseRef.current) {
                gsap.set(projectShowcaseRef.current, { y: 0, opacity: 1, pointerEvents: 'auto' });
              }
              if (blackFadeRef.current) {
                gsap.set(blackFadeRef.current, { opacity: 0 });
              }
            } else {
              // 0.85 -> 1.00: Smooth fade-out into black, seamlessly exiting to Skills
              const exitP = (p - 0.85) / 0.15;
              if (projectShowcaseRef.current) {
                gsap.set(projectShowcaseRef.current, {
                  y: -exitP * 120,
                  opacity: Math.max(0, 1 - exitP * 1.5),
                  pointerEvents: exitP > 0.4 ? 'none' : 'auto'
                });
              }
              if (blackFadeRef.current) {
                gsap.set(blackFadeRef.current, { opacity: exitP });
              }
            }
          }
        });
      });

      // Card Stack Transition Animation from Hero/About
      const tl = gsap.timeline();
      ScrollTrigger.create({
        trigger: containerRef.current,
        start: 'top bottom',
        end: 'top top',
        animation: tl,
        scrub: true,
      });
      tl.to('.hero-master-wrapper', { scale: 0.8, rotation: -5, transformOrigin: 'center center', ease: 'none' }, 0);
      tl.fromTo(innerRef.current,
        { scale: 0.8, rotation: 5, transformOrigin: 'top center', borderTopLeftRadius: '40px', borderTopRightRadius: '40px' },
        { scale: 1, rotation: 0, borderTopLeftRadius: '0px', borderTopRightRadius: '0px', ease: 'none' },
        0
      );

    }, containerRef);

    return () => ctx.revert();
  }, [galleryProjects.length]);

  return (
    <section
      id="projects"
      ref={containerRef}
      className="relative w-full h-screen z-20 mt-[-100vh] pointer-events-none"
    >
      <div
        ref={innerRef}
        className="relative w-full h-full bg-[#101010] overflow-hidden pointer-events-auto"
      >
        {/* ========================================================================= */}
        {/* SINGLE PERSISTENT BACKGROUND (Stays completely static, never moves/scrolls) */}
        {/* ========================================================================= */}
        {/* Background Layer 1: Large radial crimson glow from center */}
        <div
          className="absolute inset-0 z-0 pointer-events-none"
          style={{
            background: 'radial-gradient(circle_at_center,rgba(230, 0, 38, 0.45)_0%,transparent_60%)'
          }}
        />

        {/* Background Layer 2: Subtle Vignette */}
        <div
          className="absolute inset-0 z-0 pointer-events-none"
          style={{
            background: 'radial-gradient(circle at center, transparent 35%, rgba(39, 1, 1, 0.51) 100%)'
          }}
        />

        {/* Background Layer 3: Soft noise texture using CSS SVG */}
        <div
          className="absolute inset-0 z-0 pointer-events-none opacity-[0.015] mix-blend-overlay"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`
          }}
        />

        {/* Bottom edge fade towards Skills section */}
        <div
          className="absolute bottom-0 left-0 right-0 h-32 md:h-40 pointer-events-none z-10"
          style={{
            background: 'linear-gradient(to top, #000000 0%, rgba(201, 17, 17, 0) 100%)'
          }}
        />

        {/* ========================================================================= */}
        {/* CONTENT STAGE 1: Project Option Wheel & 3D Flipping Whole Card Showcase */}
        {/* ========================================================================= */}
        <div
          ref={projectShowcaseRef}
          className="absolute inset-0 z-10 w-full h-full flex flex-col md:flex-row items-center justify-center will-change-transform"
        >
          {/* LEFT: Option Wheel */}
          <div
            ref={wheelContainerRef}
            className="w-full md:w-1/2 h-full flex items-center justify-center md:justify-start pointer-events-auto relative z-10 px-4 md:px-0"
          >
            <OptionWheel
              items={items}
              controlledIndex={wheelScrollIndex}
              onChange={setActiveIndex}
              onItemClick={handleOptionWheelClick}
              draggable={isPinned}
              maxOverscroll={5}
              side="left"
              textColor="#404040"
              activeColor={THEME_COLORS.vividCrimson}
              curve={isMobile ? 0.8 : 1.2}
              tilt={isMobile ? 8 : 10}
              spacing={isMobile ? 1.6 : 1.8}
              fontSize={isMobile ? 2.4 : 3.5}
              inset={isMobile ? 20 : 80}
              smoothing={50}
            />
          </div>

          {/* RIGHT: 3D Flipping Card - Hidden on mobile screens (<= 768px), visible on md and up */}
          <div
            ref={imageCardRef}
            className="hidden md:flex w-full md:w-1/2 h-full relative z-0 items-center justify-center p-4 md:p-6 lg:p-8 overflow-hidden"
            style={{
              perspective: '1200px',
              perspectiveOrigin: 'center center',
              transformStyle: 'preserve-3d'
            }}
          >
            <div
              ref={imageContainerRef}
              className="relative w-full max-w-xl lg:max-w-2xl max-h-[72vh] aspect-[16/9] flex items-center justify-center transform-gpu"
              style={{ transformStyle: 'preserve-3d' }}
            >
              {galleryProjects.map((project, idx) => {
                const diff = idx - wheelScrollIndex;
                const isNear = Math.abs(diff) < 1.6;

                // Continuous 3D flip transform calculation (linear scrub, zero step-jumping)
                let transformStyle = 'translate3d(0, 0, 0) rotateX(0deg) scale(1)';
                let opacity = 0;
                let zIndex = 0;
                let transformOrigin = 'center center';

                if (isNear) {
                  if (diff <= 0) {
                    // Card is active or flipping up and away to the top (0 to -1.5)
                    const clamped = Math.max(-1, diff);
                    const y = clamped * 90;
                    const z = clamped * 120;
                    const rotX = -clamped * 80;
                    const scale = 1 + clamped * 0.12;
                    opacity = Math.max(0, 1 + clamped * 1.4);
                    zIndex = Math.round(10 + clamped * 5);
                    transformOrigin = 'top center';
                    transformStyle = `translate3d(0, ${y.toFixed(2)}%, ${z.toFixed(2)}px) rotateX(${rotX.toFixed(2)}deg) scale(${scale.toFixed(3)}) translateZ(0)`;
                  } else {
                    // Card is upcoming and flipping up from the bottom (1.5 to 0)
                    const clamped = Math.min(1, diff);
                    const y = clamped * 90;
                    const z = -clamped * 120;
                    const rotX = -clamped * 80;
                    const scale = 1 - clamped * 0.12;
                    opacity = Math.max(0, 1 - clamped * 1.4);
                    zIndex = Math.round(10 - clamped * 5);
                    transformOrigin = 'bottom center';
                    transformStyle = `translate3d(0, ${y.toFixed(2)}%, ${z.toFixed(2)}px) rotateX(${rotX.toFixed(2)}deg) scale(${scale.toFixed(3)}) translateZ(0)`;
                  }
                }

                const isExactActive = Math.abs(diff) < 0.4;

                return (
                  <a
                    key={project.id}
                    href={`#project-${project.id}`}
                    className="absolute inset-0 w-full h-full rounded-sm overflow-hidden block will-change-transform transform-gpu cursor-pointer"
                    style={{
                      transform: transformStyle,
                      opacity: opacity,
                      zIndex: zIndex,
                      pointerEvents: isExactActive ? 'auto' : 'none',
                      transformOrigin: transformOrigin,
                      backfaceVisibility: 'hidden',
                      transformStyle: 'preserve-3d'
                    }}
                  >
                    <TiltedCard
                      imageSrc={project.image}
                      altText={project.title}
                      captionText={project.title}
                      containerHeight="100%"
                      containerWidth="100%"
                      imageHeight="100%"
                      imageWidth="100%"
                      rotateAmplitude={12}
                      scaleOnHover={1.06}
                      showMobileWarning={false}
                      showTooltip={true}
                      displayOverlayContent={true}
                      overlayContent={
                        <div className="w-full">
                          <p className="tilted-card-demo-text flex items-center justify-between">

                          </p>
                        </div>
                      }
                    />
                  </a>
                );
              })}
            </div>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* CONTENT STAGE 2: Parallax Floating Multi-Depth Gallery Showcase */}
        {/* ========================================================================= */}
        <div
          ref={galleryShowcaseRef}
          className="hidden md:flex absolute inset-0 z-20 w-full h-full items-center justify-center will-change-transform pointer-events-none opacity-0"
        >
          <ParallaxFloatingDemo progress={galleryProgress} />
        </div>

        {/* Full-screen black fade-out overlay transitioning cleanly into the Skills section */}
        <div
          ref={blackFadeRef}
          className="absolute inset-0 z-30 bg-black pointer-events-none opacity-0 will-change-[opacity]"
        />
      </div>

      {/* Custom Floating Cursor for Project Card */}
      <div
        ref={cursorRef}
        className={`hidden md:flex fixed top-0 left-0 pointer-events-none z-[100] items-center justify-center transition-all duration-300 ease-out ${isHoveringImage ? 'opacity-100 scale-100' : 'opacity-0 scale-50'}`}
      >
        <div className="w-28 h-16 md:w-36 md:h-9 rounded-[24px] bg-white/90 backdrop-blur-md flex items-center justify-center text-vivid-crimson font-heading text-[10px] md:text-xs font-bold uppercase tracking-widest text-center leading-tight shadow-[0_10px_30px_rgba(230,0,38,0.2)] border border-vivid-crimson/10">
          <span>See Project</span>
        </div>
      </div>
    </section>
  );
}
