import React, { useState, useEffect, useRef } from 'react';
import InfiniteGrid from '../../components/common/InfiniteGrid';

/**
 * ProjectsPage component.
 * Renders the projects section using Tailwind CSS over the global background.
 * - Desktop: Transparent backdrop with a backdrop blur overlay revealing the global canvas.
 */
export default function ProjectsPage() {
  const [inView, setInView] = useState(false);
  const sectionRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
        } else {
          setInView(false);
        }
      },
      { threshold: 0.15 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }
    return () => observer.disconnect();
  }, []);

  return (
    // Changed bg-pure-black to bg-transparent so the global canvas can bleed through and blur
    <section 
      ref={sectionRef} 
      id="projects" 
      className={`relative flex w-full h-full items-center overflow-hidden bg-black project-section ${inView ? 'in-view' : ''}`}
    >
      <div className="absolute inset-0 z-[1] pointer-events-none
                    bg-[radial-gradient(circle_at_center,rgba(230,0,38,0.22)_0%,transparent_60%)]" />

      {/* 
        This absolute full-bleed div handles the backdrop blur uniformly 
        over the global background canvas streaming underneath it.
      */}
      <div className="absolute inset-0 pointer-events-none z-0"></div>

      {/* Interactive Content Container */}
      <div className="relative z-10 w-full h-full flex items-center">
        <div className="w-full h-full mx-auto flex flex-col justify-center">
          <InfiniteGrid inView={inView} />
        </div>
      </div>

    </section>
  );
}
