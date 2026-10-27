import React from 'react';
import InfiniteMenu from '../../components/ui/InfiniteMenu';
import { projectsList } from '../../data/projects';

/**
 * ProjectsPage / WorkPage component.
 * Features the 3D Sphere/Disc InfiniteMenu from React Bits.
 */
export default function ProjectsPage() {
  const infiniteMenuItems = projectsList
    .filter(p => p.image) // ensure items with images
    .map(p => ({
      image: p.image,
      link: p.link || p.git || '#',
      title: p.title,
      description: p.desc
    }));

  return (
    <section 
      id="projects" 
      className="relative w-full h-full overflow-hidden bg-black flex items-center justify-center"
    >
      {/* Background Radial Glow */}
      <div className="absolute inset-0 z-[1] pointer-events-none bg-[radial-gradient(circle_at_center,rgba(230,0,38,0.18)_0%,transparent_70%)]" />

      {/* 3D Infinite Grid Menu */}
      <div className="relative z-10 w-full h-full">
        <InfiniteMenu
          items={infiniteMenuItems}
          scale={0.95}
          backgroundColor="transparent"
        />
      </div>
    </section>
  );
}
