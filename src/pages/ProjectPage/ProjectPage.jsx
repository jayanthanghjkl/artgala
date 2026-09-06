import React, { useRef, useState, useLayoutEffect } from 'react';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';
import OptionWheel from '../../components/effects/OptionWheel';
import { ParallaxFloatingDemo } from '../../components/ui/parallax-floating-demo';
import { projectsList } from '../../data/projects';

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
  
  const [activeIndex, setActiveIndex] = useState(0);
  const [wheelScrollIndex, setWheelScrollIndex] = useState(0);
  const [isPinned, setIsPinned] = useState(false);
  const [isHoveringImage, setIsHoveringImage] = useState(false);
  const [isGalleryActive, setIsGalleryActive] = useState(false);

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
      // Precise timeline segmentation:
      // 0.00 -> 0.40: Phase 1 - Project Wheel items cycle (with 3D Card Flipping from bottom to top)
      // 0.40 -> 0.55: Phase 2 - Project Section animation finishes (Wheel empties out & moves up)
      // 0.55 -> 0.70: Phase 3 - Gallery Page animation starts (Floating cards ascend from bottom)
      // 0.70 -> 0.85: Phase 4 - Gallery Showcase fully active & interactive
      // 0.85 -> 1.00: Phase 5 - Object Over Camera Wipe Transition into Skills page
      const p1End = 0.40;
      const p2End = 0.55;
      const p3End = 0.70;
      const p4End = 0.85;

      ScrollTrigger.create({
        trigger: containerRef.current,
        start: 'top top',
        end: `+=${galleryProjects.length * 150 + 400}vh`,
        pin: true,
        scrub: true,
        snap: {
          snapTo: (predictedProgress) => {
            if (predictedProgress >= p1End) return predictedProgress;
            const maxIndex = galleryProjects.length - 1;
            const step = p1End / maxIndex;
            const predictedIndex = Math.round(predictedProgress / step);
            return Math.min(maxIndex, Math.max(0, predictedIndex)) * step;
          },
          duration: 0.35,
          delay: 0.05,
          ease: "power1.inOut"
        },
        onToggle: (self) => setIsPinned(self.isActive),
        onUpdate: (self) => {
          const p = self.progress;
          const maxIndex = galleryProjects.length - 1;

          if (p < p1End) {
            // PHASE 1: Project Wheel Active
            const normP = p / p1End;
            const targetIndex = normP * maxIndex;
            setWheelScrollIndex(targetIndex);
            setActiveIndex(Math.min(maxIndex, Math.max(0, Math.round(targetIndex))));
            setIsGalleryActive(false);

            if (projectShowcaseRef.current) {
              gsap.set(projectShowcaseRef.current, { x: 0, y: 0, opacity: 1, pointerEvents: 'auto' });
            }
            if (galleryShowcaseRef.current) {
              gsap.set(galleryShowcaseRef.current, { x: 0, y: 400, scale: 1, filter: 'none', opacity: 0, pointerEvents: 'none' });
            }
            if (cameraWipeRef.current) {
              gsap.set(cameraWipeRef.current, { clipPath: 'inset(0% 0% 100% 0%)', opacity: 0 });
            }
            if (cameraWipeEdgeRef.current) {
              gsap.set(cameraWipeEdgeRef.current, { opacity: 0 });
            }
          } else if (p >= p1End && p < p2End) {
            // PHASE 2: Project section animation finishes (Wheel empties out and moves up)
            const exitP = (p - p1End) / (p2End - p1End);
            
            // Advance wheel index to empty out the wheel
            const targetIndex = maxIndex + exitP * 4.5;
            setWheelScrollIndex(targetIndex);
            setActiveIndex(maxIndex);
            setIsGalleryActive(false);

            // Project showcase glides up off the top and fades
            if (projectShowcaseRef.current) {
              gsap.set(projectShowcaseRef.current, {
                x: 0,
                y: -exitP * 380,
                opacity: Math.max(0, 1 - exitP * 1.2),
                pointerEvents: exitP > 0.6 ? 'none' : 'auto'
              });
            }

            // Gallery remains hidden below until project section finishes
            if (galleryShowcaseRef.current) {
              gsap.set(galleryShowcaseRef.current, { x: 0, y: 400, scale: 1, filter: 'none', opacity: 0, pointerEvents: 'none' });
            }
            if (cameraWipeRef.current) {
              gsap.set(cameraWipeRef.current, { clipPath: 'inset(0% 0% 100% 0%)', opacity: 0 });
            }
            if (cameraWipeEdgeRef.current) {
              gsap.set(cameraWipeEdgeRef.current, { opacity: 0 });
            }
          } else if (p >= p2End && p < p3End) {
            // PHASE 3: Project section finished -> Gallery ascends from bottom until it fits the screen
            const enterP = (p - p2End) / (p3End - p2End);
            setWheelScrollIndex(maxIndex + 5.0);
            
            // Keep floating gallery animation inactive until the page is fully centered & fit to screen
            setIsGalleryActive(false);

            // Project section is completely gone off the top
            if (projectShowcaseRef.current) {
              gsap.set(projectShowcaseRef.current, { x: 0, y: -380, opacity: 0, pointerEvents: 'none' });
            }

            // Gallery ascends from the bottom into the center
            if (galleryShowcaseRef.current) {
              gsap.set(galleryShowcaseRef.current, {
                x: 0,
                y: (1 - enterP) * 380,
                scale: 1,
                filter: 'none',
                opacity: Math.min(1, enterP * 1.3),
                pointerEvents: 'none'
              });
            }
            if (cameraWipeRef.current) {
              gsap.set(cameraWipeRef.current, { clipPath: 'inset(0% 0% 100% 0%)', opacity: 0 });
            }
            if (cameraWipeEdgeRef.current) {
              gsap.set(cameraWipeEdgeRef.current, { opacity: 0 });
            }
          } else if (p >= p3End && p < p4End) {
            // PHASE 4: Gallery page is now 100% FIT TO SCREEN -> Floating animation starts!
            setWheelScrollIndex(maxIndex + 5.0);
            setIsGalleryActive(true);

            if (projectShowcaseRef.current) {
              gsap.set(projectShowcaseRef.current, { x: 0, y: -380, opacity: 0, pointerEvents: 'none' });
            }
            if (galleryShowcaseRef.current) {
              gsap.set(galleryShowcaseRef.current, { x: 0, y: 0, scale: 1, filter: 'none', opacity: 1, pointerEvents: 'auto' });
            }
            if (cameraWipeRef.current) {
              gsap.set(cameraWipeRef.current, { clipPath: 'inset(0% 0% 100% 0%)', opacity: 0 });
            }
            if (cameraWipeEdgeRef.current) {
              gsap.set(cameraWipeEdgeRef.current, { opacity: 0 });
            }
          } else {
            // PHASE 5: Transition to Skills Page -> Object Over Camera Wipe Transition Effect
            const nextP = (p - p4End) / (1 - p4End);
            setWheelScrollIndex(maxIndex + 5.0);

            if (projectShowcaseRef.current) {
              gsap.set(projectShowcaseRef.current, { x: 0, y: -380, opacity: 0, pointerEvents: 'none' });
            }

            // Object over the camera 3D zoom & cinematic fly-past
            if (galleryShowcaseRef.current) {
              const zoomScale = 1 + Math.pow(nextP, 1.3) * 6.5;
              const cardBlur = nextP * 14;
              const cardOpacity = Math.max(0, 1 - Math.pow(nextP, 1.25) * 1.5);

              gsap.set(galleryShowcaseRef.current, {
                x: 0,
                y: 0,
                scale: zoomScale,
                opacity: cardOpacity,
                filter: cardBlur > 0.5 ? `blur(${cardBlur.toFixed(1)}px)` : 'none',
                pointerEvents: nextP > 0.15 ? 'none' : 'auto'
              });
            }

            // Object Camera Wipe Aperture Layer unrolling over the camera lens
            if (cameraWipeRef.current) {
              const easedWipe = Math.pow(nextP, 1.15);
              const remainingInset = ((1 - easedWipe) * 100).toFixed(2);
              gsap.set(cameraWipeRef.current, {
                clipPath: `inset(0% 0% ${remainingInset}% 0%)`,
                opacity: nextP > 0.01 ? 1 : 0
              });
            }

            // Glowing Leading Edge Laser Beam
            if (cameraWipeEdgeRef.current) {
              const easedWipe = Math.pow(nextP, 1.15);
              const edgePos = (easedWipe * 100).toFixed(2);
              gsap.set(cameraWipeEdgeRef.current, {
                top: `${edgePos}%`,
                opacity: nextP > 0.02 && nextP < 0.98 ? 1 : 0
              });
            }
          }
        }
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
            className="w-full md:w-1/2 h-full flex items-center justify-start pointer-events-none relative z-10 px-4 md:px-0"
          >
            <OptionWheel
              items={items}
              controlledIndex={wheelScrollIndex}
              onChange={setActiveIndex}
              draggable={isPinned}
              maxOverscroll={5}
              side="left"
              textColor="#404040"
              activeColor="#e60026"
              curve={1.2}
              tilt={10}
              spacing={1.8}
              fontSize={3.5}
            />
          </div>

          {/* RIGHT: 3D Flipping Card - The Whole Div Flips from Bottom to Top */}
          <div 
            ref={imageCardRef}
            className="w-full md:w-1/2 h-full relative z-0 flex items-center justify-center p-4 md:p-8" 
            style={{ perspective: '1500px' }}
          >
            <div 
              ref={imageContainerRef}
              className="relative w-full max-w-2xl aspect-[4/3] flex items-center justify-center cursor-none transform-gpu"
              style={{ transformStyle: 'preserve-3d' }}
              onMouseEnter={() => setIsHoveringImage(true)}
              onMouseMove={(e) => {
                if (!imageContainerRef.current) return;
                const rect = imageContainerRef.current.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                const centerX = rect.width / 2;
                const centerY = rect.height / 2;
                const rotateX = ((y - centerY) / centerY) * -12;
                const rotateY = ((x - centerX) / centerX) * 12;
                gsap.to(imageContainerRef.current, { rotationX: rotateX, rotationY: rotateY, duration: 0.4, ease: 'power2.out' });
              }}
              onMouseLeave={() => {
                setIsHoveringImage(false);
                gsap.to(imageContainerRef.current, { rotationX: 0, rotationY: 0, duration: 0.7, ease: 'power3.out' });
              }}
            >
              {galleryProjects.map((project, idx) => {
                const isActive = activeIndex === idx;
                const isPast = idx < activeIndex;
                const isFuture = idx > activeIndex;

                // 3D Bottom-to-Top Whole Div Flip transforms
                let transformStyle = 'translate3d(0, 0, 0) rotateX(0deg) scale(1)';
                let opacity = 1;
                let zIndex = 10;

                if (isPast) {
                  // The entire card div flips upwards and rotates away to the top
                  transformStyle = 'translate3d(0, -90%, -120px) rotateX(85deg) scale(0.88)';
                  opacity = 0;
                  zIndex = 0;
                } else if (isFuture) {
                  // The entire card div waits below and flips UP from the bottom
                  transformStyle = 'translate3d(0, 90%, -120px) rotateX(-85deg) scale(0.88)';
                  opacity = 0;
                  zIndex = 0;
                }

                return (
                  <a
                    key={project.id}
                    href={`#project-${project.id}`}
                    className="absolute inset-0 w-full h-full rounded-3xl overflow-hidden border border-white/10 shadow-[0_25px_70px_rgba(0,0,0,0.7)] bg-zinc-900 block will-change-transform transform-gpu"
                    style={{
                      transform: transformStyle,
                      opacity: opacity,
                      zIndex: zIndex,
                      pointerEvents: isActive ? 'auto' : 'none',
                      transformOrigin: isPast ? 'top center' : 'bottom center',
                      transition: 'transform 0.8s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.7s cubic-bezier(0.16, 1, 0.3, 1)',
                      backfaceVisibility: 'hidden',
                      transformStyle: 'preserve-3d'
                    }}
                  >
                    <img
                      src={project.image}
                      alt={project.title}
                      className="w-full h-full object-cover rounded-3xl"
                    />
                    {/* Dynamic 3D depth sheen / lighting overlay on the whole card */}
                    <div 
                      className="absolute inset-0 rounded-3xl pointer-events-none transition-opacity duration-700 bg-gradient-to-t from-black/70 via-transparent to-white/15"
                      style={{ opacity: isActive ? 0.12 : 0.85 }}
                    />
                    {/* Glass border reflection overlay on the whole card */}
                    <div className="absolute inset-0 border border-white/10 rounded-3xl pointer-events-none mix-blend-overlay" />
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
          className="absolute inset-0 z-20 w-full h-full flex items-center justify-center will-change-transform pointer-events-none opacity-0"
        >
          <ParallaxFloatingDemo isActive={isGalleryActive} />
        </div>
      </div>

      {/* Custom Floating Cursor for Project Card */}
      <div 
        ref={cursorRef}
        className={`fixed top-0 left-0 pointer-events-none z-[100] flex items-center justify-center transition-all duration-300 ease-out ${isHoveringImage ? 'opacity-100 scale-100' : 'opacity-0 scale-50'}`}
      >
        <div className="w-28 h-16 md:w-36 md:h-9 rounded-[24px] bg-white/90 backdrop-blur-md flex items-center justify-center text-vivid-crimson font-heading text-[10px] md:text-xs font-bold uppercase tracking-widest text-center leading-tight shadow-[0_10px_30px_rgba(230,0,38,0.2)] border border-vivid-crimson/10">
          <span>See Project</span>
        </div>
      </div>
    </section>
  );
}
