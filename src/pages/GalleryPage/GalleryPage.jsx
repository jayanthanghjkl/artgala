import React from 'react';
import { ParallaxFloatingDemo } from '../../components/ui/parallax-floating-demo';

export default function GalleryPage() {
  return (
    <section id="gallery" className="relative w-full min-h-screen bg-[#101010] overflow-hidden z-20">
      <div
        className="absolute inset-0 z-0 pointer-events-none"
        style={{
          background: 'radial-gradient(circle_at_center,rgba(230, 0, 38, 0.45)_0%,transparent_60%)'
        }}
      />
      <div
        className="absolute inset-0 z-0 pointer-events-none"
        style={{
          background: 'radial-gradient(circle at center, transparent 35%, rgba(39, 1, 1, 0.51) 100%)'
        }}
      />
      <div className="relative z-10 w-full h-full min-h-screen flex items-center justify-center">
        <ParallaxFloatingDemo />
      </div>
    </section>
  );
}
