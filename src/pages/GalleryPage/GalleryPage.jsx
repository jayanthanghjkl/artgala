import React, { useRef, useState, useLayoutEffect } from 'react';
import { Link } from 'react-router-dom';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';
import OptionWheel from '../../components/effects/OptionWheel';
import { projectsList } from '../../data/projects';

gsap.registerPlugin(ScrollTrigger);

export default function GalleryPage() {
  const containerRef = useRef(null);
  const innerRef = useRef(null);
  const cursorRef = useRef(null);
  const imageContainerRef = useRef(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPinned, setIsPinned] = useState(false);
  const [isHoveringImage, setIsHoveringImage] = useState(false);

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

    // 1. Wheel pinning animation
    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: containerRef.current,
        start: 'top top',
        end: `+=${galleryProjects.length * 100}vh`,
        pin: true,
        scrub: true,
        onToggle: (self) => setIsPinned(self.isActive),
        onUpdate: (self) => {
          const maxIndex = galleryProjects.length - 1;
          const mappedIndex = Math.min(
            maxIndex,
            Math.max(0, Math.floor(self.progress * galleryProjects.length))
          );
          setActiveIndex(mappedIndex);
        }
      });

      // 2. Card Stack Transition Animation
      const tl = gsap.timeline();
      ScrollTrigger.create({
        trigger: containerRef.current,
        start: 'top bottom', // when gallery starts sliding up from bottom
        end: 'top top',      // when gallery fully covers the viewport
        animation: tl,
        scrub: true,
      });
      // Scale down and rotate back the About page
      tl.to('.hero-master-wrapper', { scale: 0.8, rotation: -5, transformOrigin: 'center center', ease: 'none' }, 0);
      // Scale up and rotate forward the Gallery page's inner container
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
      ref={containerRef}
      className="relative w-full h-screen z-20 mt-[-100vh] pointer-events-none"
    >
      <div
        ref={innerRef}
        className="relative w-full h-full bg-[#101010] flex flex-col md:flex-row overflow-hidden border-t border-white/5 shadow-[0_-20px_80px_rgba(0,0,0,0.8)] pointer-events-auto"
      >
        {/* Bottom edge should fade into pure black (transition to next section) */}
        <div
          className="absolute bottom-0 left-0 right-0 h-32 md:h-40 pointer-events-none z-10"
          style={{
            background: 'linear-gradient(to top, #000000 0%, rgba(201, 17, 17, 0) 100%)'
          }}
        />

        {/* Background Layer 1: Large radial glow from top center */}
        <div
          className="absolute inset-0 z-0 pointer-events-none"
          style={{
            background: 'radial-gradient(circle_at_center,rgba(230, 0, 38, 0.5)_0%,transparent_60%)'
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
        {/* LEFT: Option Wheel */}
        <div className="w-full md:w-1/2 h-full flex items-center justify-start pointer-events-none relative z-10 px-4 md:px-0">
          <OptionWheel
            items={items}
            controlledIndex={activeIndex}
            onChange={setActiveIndex}
            draggable={isPinned}
            side="left"
            textColor="#404040"
            activeColor="#e60026"
            curve={1.2}
            tilt={10}
            spacing={1.8}
            fontSize={3.5}
          />
        </div>

        {/* RIGHT: Image Crossfade in a Card */}
        <div className="w-full md:w-1/2 h-full relative z-0 flex items-center justify-center p-4 md:p-8" style={{ perspective: '1000px' }}>
          <a 
            ref={imageContainerRef}
            href={`#project-${galleryProjects[activeIndex]?.id || ''}`}
            className="relative w-full max-w-2xl aspect-[4/3] rounded-3xl overflow-hidden border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.5)] bg-zinc-900 cursor-none block transform-gpu"
            style={{ transformStyle: 'preserve-3d' }}
            onMouseEnter={() => setIsHoveringImage(true)}
            onMouseMove={(e) => {
              if (!imageContainerRef.current) return;
              const rect = imageContainerRef.current.getBoundingClientRect();
              const x = e.clientX - rect.left;
              const y = e.clientY - rect.top;
              const centerX = rect.width / 2;
              const centerY = rect.height / 2;
              // Max rotation of 12 degrees
              const rotateX = ((y - centerY) / centerY) * -12;
              const rotateY = ((x - centerX) / centerX) * 12;
              gsap.to(imageContainerRef.current, { rotationX: rotateX, rotationY: rotateY, duration: 0.4, ease: 'power2.out' });
            }}
            onMouseLeave={() => {
              setIsHoveringImage(false);
              gsap.to(imageContainerRef.current, { rotationX: 0, rotationY: 0, duration: 0.7, ease: 'power3.out' });
            }}
          >
            {galleryProjects.map((project, idx) => (
              <img
                key={project.id}
                src={project.image}
                alt={project.title}
                className={`absolute inset-0 w-full h-full object-cover transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] ${activeIndex === idx ? 'opacity-100 scale-100 z-10' : 'opacity-0 scale-105 z-0'
                  }`}
              />
            ))}
            {/* Subtle inner shadow for the card */}
            <div className="absolute inset-0 border border-white/5 rounded-3xl pointer-events-none mix-blend-overlay z-20" />
          </a>
        </div>
      </div>

      {/* Custom Floating Cursor */}
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
