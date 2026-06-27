import React, { useState, useEffect, useRef, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { useGLTF } from '@react-three/drei';
import * as THREE from 'three';
import Navbar from '../../components/navigation/Navbar';

// ── THREE.JS CAMERA AND PARALLAX CONFIGURATION ─────────────────────────────
const CAMERA_BASE_POS = [0, 0.4, 14]; // Starting camera position [X, Y, Z]
const SCROLL_CAM_MOVE_X = 0.008;    // Scroll camera flight scale on X
const SCROLL_CAM_MOVE_Y = -0.005;   // Scroll camera flight scale on Y
const SCROLL_CAM_ZOOM_Z = -0.015;   // Scroll camera zoom depth scale on Z

const CURSOR_Y      = 1;            // Mouse looking range on Y axis
const CURSOR_X      = 1;            // Mouse looking range on X axis
const LERP_SCROLL   = 0.9;          // Smoothing interpolation factor for scrolls
const LERP_CURSOR   = 0.9;          // Smoothing interpolation factor for mouse parallax

// ── 3D MODEL ELEMENT ────────────────────────────────────────────────────────
function HeroModel({ meshRef }) {
  const gltf = useGLTF('/hero.glb');
  
  return (
    <primitive
      ref={meshRef}
      object={gltf.scene}
      position={[0, -0.6, 0]}
      scale={[9, 9, 9]}
    />
  );
}

// ── CAMERA PARALLAX & FLIGHT MANAGER ────────────────────────────────────────
function CameraController({ spiralRef, cursorRef, isEntered }) {
  const smooth = useRef({ cX: 0, cY: 0, sX: 0, sY: 0, sZ: 0, bY: 2.0, bZ: 22 });

  useFrame((state) => {
    const s = smooth.current;
    const a = spiralRef.current;
    const camera = state.camera;

    // Smoothly transition base position from cinematic intro to interactive layout
    const targetBaseY = isEntered ? 0.4 : 2.0;
    const targetBaseZ = isEntered ? 14 : 22;
    s.bY = THREE.MathUtils.lerp(s.bY, targetBaseY, 0.05);
    s.bZ = THREE.MathUtils.lerp(s.bZ, targetBaseZ, 0.05);

    // 1. Calculate target scroll positions for the camera flight path
    s.sX = THREE.MathUtils.lerp(s.sX, a * SCROLL_CAM_MOVE_X, LERP_SCROLL);
    s.sY = THREE.MathUtils.lerp(s.sY, a * SCROLL_CAM_MOVE_Y, LERP_SCROLL);
    s.sZ = THREE.MathUtils.lerp(s.sZ, a * SCROLL_CAM_ZOOM_Z, LERP_SCROLL);

    // 2. Calculate smooth cursor offsets for subtle parallax looking around
    s.cY = THREE.MathUtils.lerp(s.cY,  cursorRef.current.nx * CURSOR_Y, LERP_CURSOR);
    s.cX = THREE.MathUtils.lerp(s.cX, -cursorRef.current.ny * CURSOR_X, LERP_CURSOR);

    // 3. Move the camera relative to the animated base coordinates
    camera.position.x = CAMERA_BASE_POS[0] + s.sX + s.cY;
    camera.position.y = s.bY + s.sY + s.cX;
    camera.position.z = s.bZ + s.sZ;

    // 4. Force the moving camera to keep its focus on the fixed statue model center
    camera.lookAt(0, -0.4, 0);
  });

  return null;
}

// ── COMBINED HERO & 3D CANVAS COMPONENT ─────────────────────────────────────
export default function HeroSection({ isEntered }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isHeroActive, setIsHeroActive] = useState(false);
  
  // Interactive 3D Model refs
  const sectionRef = useRef(null);
  const meshRef    = useRef();
  const spiralRef  = useRef(0);
  const lastY      = useRef(0);
  const cursorRef  = useRef({ nx: 0, ny: 0 });

  // Scroll and Parallax interaction tracking
  useEffect(() => {
    const onScroll = (e) => {
      const target = e.target;
      const currentY =
        target === document || target === document.body
          ? window.scrollY
          : target.scrollTop ?? 0;

      const delta = currentY - lastY.current;
      spiralRef.current += delta;
      lastY.current = currentY;
    };

    const onMouse = (e) => {
      cursorRef.current.nx = (e.clientX / window.innerWidth  - 0.5) * 2;
      cursorRef.current.ny = (e.clientY / window.innerHeight - 0.5) * 2;
    };

    const onTouch = (e) => {
      const t = e.touches[0];
      cursorRef.current.nx = (t.clientX / window.innerWidth  - 0.5) * 2;
      cursorRef.current.ny = (t.clientY / window.innerHeight - 0.5) * 2;
    };

    document.addEventListener('scroll',   onScroll, { capture: true, passive: true });
    window.addEventListener('mousemove',  onMouse,  { passive: true });
    window.addEventListener('touchmove',  onTouch,  { passive: true });

    return () => {
      document.removeEventListener('scroll',   onScroll, { capture: true });
      window.removeEventListener('mousemove', onMouse);
      window.removeEventListener('touchmove', onTouch);
    };
  }, []);

  // Intersection Observer for scroll animations reveal trigger
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsHeroActive(true);
        } else {
          setIsHeroActive(false);
        }
      },
      {
        root: null,
        threshold: 0.15
      }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      observer.disconnect();
    };
  }, []);

  return (
    <section 
      ref={sectionRef}
      id="hero" 
      className={`relative w-full min-h-screen flex flex-col justify-between overflow-hidden bg-black transition-all duration-300 ${
        isHeroActive ? 'hero-view-active' : ''
      }`}
    >
      
      {/* 1. THREE.JS 3D CANVAS BACKGROUND LAYER */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        {/* Red theme glow backdrop */}
        <div className="absolute inset-0 z-[1] pointer-events-none bg-[radial-gradient(circle_at_center,rgba(230,0,38,0.22)_0%,transparent_60%)]" />
        
        {/* WebGL Canvas */}
        <div className="absolute inset-0 z-[2]">
          <Canvas
            camera={{ position: CAMERA_BASE_POS, fov: 40 }}
            style={{ pointerEvents: 'none' }}
            gl={{ alpha: true, antialias: true }}
          >
            <ambientLight intensity={1} />
            <directionalLight position={[0, 10, 15]} intensity={2} />
            
            {/* Red rim kicker lights */}
            <pointLight position={[-10, 5, -10]} intensity={100} distance={100} decay={2} color="#e60026" />
            <pointLight position={[10, 5, -10]} intensity={100} distance={100} decay={2} color="#e60026" />
            
            <Suspense fallback={null}>
              <HeroModel meshRef={meshRef} />
            </Suspense>

            <CameraController spiralRef={spiralRef} cursorRef={cursorRef} isEntered={isEntered} />
          </Canvas>
        </div>
      </div>

      {/* Navbar rendered inside the Hero Section */}
      <Navbar mobileMenuOpen={mobileMenuOpen} setMobileMenuOpen={setMobileMenuOpen} isEntered={isEntered} />

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes heroTitleReveal {
          from { transform: translateY(105%) scaleY(1.1); opacity: 0; }
          to   { transform: translateY(0) scaleY(1); opacity: 1; }
        }
        @keyframes heroDescReveal {
          from { transform: translateY(30px); opacity: 0; filter: blur(2px); }
          to   { transform: translateY(0); opacity: 1; filter: blur(0); }
        }
        
        /* Dormant States: Safely hidden out of view to handle reverse entry snap */
        .hero-title-anim-1, .hero-title-anim-2, .hero-desc-anim {
          opacity: 0;
          display: inline-block;
        }

        /* Active CSS System: Only plays staggers when page container is actively in view */
        .hero-view-active .hero-title-anim-1 {
          animation: heroTitleReveal 1.4s cubic-bezier(0.16, 1, 0.3, 1) 0.1s both;
        }
        .hero-view-active .hero-title-anim-2 {
          animation: heroTitleReveal 1.4s cubic-bezier(0.16, 1, 0.3, 1) 0.22s both;
        }
        .hero-view-active .hero-desc-anim {
          animation: heroDescReveal 1.2s cubic-bezier(0.16, 1, 0.3, 1) 0.4s both;
        }

        .vertical-text {
          writing-mode: vertical-lr;
          transform: rotate(180deg);
        }
      `}} />

      {/* DESKTOP HERO VIEW CONTENT */}
      <div className="hidden md:flex flex-1 relative z-10 w-full items-end px-12 pb-24 pt-32 opacity-100 translate-y-0 transition-all duration-1000">
        <div className="relative max-w-[1400px] w-full mx-auto flex flex-col items-start">
          <div className="max-w-[480px] mb-8 overflow-hidden">
            <p className="hero-desc-anim font-body text-base ml-5 md:text-lg text-pure-white/95 leading-relaxed tracking-tight">
              Building digital experiences <br />
              that blend intuitive design with clean <br />
              scalable code
            </p>
          </div>
          
          <h1 
            className="font-heading font-black pt-3 leading-[0.82] tracking-[-0.04em] text-pure-white w-full select-none overflow-hidden flex flex-nowrap items-baseline whitespace-nowrap"
            style={{ fontSize: 'clamp(56px, 7.5vw, 115px)' }}
          >
            <span className="hero-title-anim-1">JAYANTHAN</span>
            <span className="hero-title-anim-2 ml-4 lg:ml-10">SATHIYAPAL</span>
          </h1>
        </div>
      </div>

      {/* MOBILE HERO VIEW CONTENT */}
      <div className="md:hidden flex flex-1 relative z-10 w-full items-end px-6 pb-16 pt-24 opacity-100 translate-y-0 transition-all duration-1000">
        <div className="relative w-full flex flex-col items-start">
          <div className="max-w-[280px] mb-6 overflow-hidden">
            <p className="hero-desc-anim font-body text-sm text-pure-white/95 leading-relaxed tracking-tight">
              Building digital experiences <br />
              that blend intuitive design with clean <br />
              scalable code
            </p>
          </div>
          
          <h1 
            className="font-heading font-black leading-[0.9] tracking-[-0.04em] text-pure-white w-full select-none overflow-hidden flex flex-col items-start"
            style={{ fontSize: 'clamp(32px, 10vw, 48px)' }}
          >
            <span className="hero-title-anim-1">JAYANTHAN</span>
            <span className="hero-title-anim-2 mt-1">SATHIYAPAL</span>
          </h1>
        </div>

        {/* Mobile Scroll Indicator */}
        <div className="hero-desc-anim absolute bottom-4 right-6 z-20 flex flex-col items-center gap-2 pointer-events-none select-none">
          <div className="w-4 h-7 rounded-full border border-pure-white/20 flex justify-center p-0.5">
            <div className="w-0.5 h-1.5 bg-vivid-crimson rounded-full animate-bounce"></div>
          </div>
        </div>
      </div>

    </section>
  );
}

useGLTF.preload('/hero.glb');
