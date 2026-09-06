import React, { useRef } from 'react';
import { ParallaxFloatingDemo } from '../../components/ui/parallax-floating-demo';

export default function GalleryPage() {
  const cameraWipeRef = useRef(null);

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

      {/* Camera Wipe Aperture Overlay Layer */}
      <div
        ref={cameraWipeRef}
        className="absolute inset-0 z-30 pointer-events-none opacity-0 will-change-[clip-path,opacity] bg-[#101010]"
        style={{ clipPath: 'inset(0% 0% 100% 0%)' }}
      >
        <div
          className="absolute left-0 right-0 h-[3px] bg-gradient-to-r from-transparent via-red-500 to-transparent pointer-events-none z-40 opacity-0 -translate-y-1/2"
          style={{
            boxShadow: '0 0 20px #ff1a40, 0 0 45px #e60026, 0 0 80px rgba(230,0,38,0.8)'
          }}
        />
      </div>
    </section>
  );
}
