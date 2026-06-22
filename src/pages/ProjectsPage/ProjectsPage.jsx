import React from 'react';
import InfiniteGrid from '../../components/common/InfiniteGrid';

/**
 * ProjectsPage component.
 * Renders the projects section using Tailwind CSS over the global background.
 * - Desktop: Transparent backdrop with a backdrop blur overlay revealing the global canvas.
 */
export default function ProjectsPage() {
  return (
    // Changed bg-pure-black to bg-transparent so the global canvas can bleed through and blur
    <section id="projects" className="flex items-center relative w-full h-screen bg-transparent overflow-hidden snap-start">
      
      {/* 
        This absolute full-bleed div handles the backdrop blur uniformly 
        over the global background canvas streaming underneath it.
      */}
      <div className="absolute inset-0 backdrop-blur-sm pointer-events-none z-0"></div>

      {/* Interactive Content Container */}
      <div className="relative z-10 w-full h-full flex items-center">
        <div className="w-full h-full mx-auto flex flex-col justify-center">
          <InfiniteGrid />
        </div>
      </div>

    </section>
  );
}
