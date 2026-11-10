import React from 'react';
import { motion } from 'framer-motion';
import InfiniteMenu from '../../components/ui/InfiniteMenu';
import { projectsList } from '../../data/projects';

/**
 * ProjectsPage / WorkPage component.
 * Features the 3D Sphere InfiniteMenu from React Bits with dynamic intro spin effects.
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
      {/* Background Radial Glow with pulsing aura */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ 
          opacity: [0.45, 0.75, 0.45], 
          scale: [0.9, 1.12, 0.9] 
        }}
        transition={{
          duration: 7,
          repeat: Infinity,
          ease: 'easeInOut'
        }}
        className="absolute inset-0 z-[1] pointer-events-none bg-[radial-gradient(circle_at_center,var(--color-glow-red,rgba(230,0,38,0.22))_0%,transparent_70%)]" 
      />

      {/* 3D Infinite Grid Menu Sphere */}
      <div className="relative z-10 w-full h-full flex items-center justify-center">
        <InfiniteMenu
          items={infiniteMenuItems}
          scale={0.95}
          backgroundColor="transparent"
        />
      </div>
    </section>
  );
}
