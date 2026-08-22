import React, { useRef, useEffect, useState } from 'react';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';
import OptionWheel from '../../components/effects/OptionWheel';
import { projectsList } from '../../data/projects';

gsap.registerPlugin(ScrollTrigger);

export default function GalleryPage() {
  const containerRef = useRef(null);
  const innerRef = useRef(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPinned, setIsPinned] = useState(false);
  
  // Filter out the featured text item, we only want actual projects with images
  const galleryProjects = projectsList.filter(p => p.image);
  const items = galleryProjects.map(p => p.title);
  
  useEffect(() => {
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
      gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top bottom', // when gallery starts sliding up from bottom
          end: 'top top',      // when gallery fully covers the viewport
          scrub: true,
        }
      })
      // Scale down and rotate back the About page
      .to('.hero-master-wrapper', { scale: 0.8, rotation: -5, transformOrigin: 'center center', ease: 'none' }, 0)
      // Scale up and rotate forward the Gallery page's inner container
      .fromTo(innerRef.current, 
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
        <div className="w-full md:w-1/2 h-full relative z-0 flex items-center justify-center p-4 md:p-8">
          <div className="relative w-full max-w-2xl aspect-[4/3] rounded-3xl overflow-hidden border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.5)] bg-zinc-900">
            {galleryProjects.map((project, idx) => (
              <img
                key={project.id}
                src={project.image}
                alt={project.title}
                className={`absolute inset-0 w-full h-full object-cover transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                  activeIndex === idx ? 'opacity-100 scale-100 z-10' : 'opacity-0 scale-105 z-0'
                }`}
              />
            ))}
            {/* Subtle inner shadow for the card */}
            <div className="absolute inset-0 border border-white/5 rounded-3xl pointer-events-none mix-blend-overlay" />
          </div>
        </div>
      </div>
    </section>
  );
}
