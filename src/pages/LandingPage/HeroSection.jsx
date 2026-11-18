import { useState, useEffect, useRef, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { useGLTF } from '@react-three/drei';
import * as THREE from 'three';
import Navbar from '../../components/navigation/Navbar';
import LiquidEther from '../../components/effects/LiquidEther';
import { THEME_COLORS } from '../../lib/colors';

// ── THREE.JS CAMERA AND PARALLAX CONFIGURATION ─────────────────────────────
const CAMERA_BASE_POS = [0, 0.4, 14]; // Starting camera position [X, Y, Z]
const SCROLL_CAM_MOVE_X = 0.008;    // Scroll camera flight scale on X
const SCROLL_CAM_MOVE_Y = -0.005;   // Scroll camera flight scale on Y
const SCROLL_CAM_ZOOM_Z = -0.015;   // Scroll camera zoom depth scale on Z

const CURSOR_Y = 1;            // Mouse looking range on Y axis
const CURSOR_X = 1;            // Mouse looking range on X axis
const LERP_SCROLL = 0.9;          // Smoothing interpolation factor for scrolls
const LERP_CURSOR = 0.9;          // Smoothing interpolation factor for mouse parallax

// ── 3D MODEL ELEMENT ────────────────────────────────────────────────────────
function HeroModel({ meshRef, isEntered }) {
  const gltf = useGLTF('/hero-optimized.glb');
  const scaleVal = useRef(isEntered ? 8.5 : 6.0);
  const rotY = useRef(isEntered ? 0 : -0.25);

  useFrame((_, delta) => {
    const targetScale = isEntered ? 8.5 : 6.0;
    const targetRotY = isEntered ? 0 : -0.25;
    scaleVal.current = THREE.MathUtils.lerp(scaleVal.current, targetScale, Math.min(delta * 3.5, 0.08));
    rotY.current = THREE.MathUtils.lerp(rotY.current, targetRotY, Math.min(delta * 3.5, 0.08));

    if (meshRef.current) {
      meshRef.current.scale.set(scaleVal.current, scaleVal.current, scaleVal.current);
      meshRef.current.rotation.y = targetRotY === 0 && Math.abs(rotY.current) < 0.005 ? 0 : rotY.current;
    }
  });

  return (
    <primitive
      ref={meshRef}
      object={gltf.scene}
      position={[0, -0.3, 0]}
      scale={[8.5, 8.5, 8.5]}
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
    s.cY = THREE.MathUtils.lerp(s.cY, cursorRef.current.nx * CURSOR_Y, LERP_CURSOR);
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
export default function HeroSection({ isEntered = true, children }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isHeroActive, setIsHeroActive] = useState(false);

  // Interactive 3D Model refs
  const sectionRef = useRef(null);
  const meshRef = useRef();
  const spiralRef = useRef(0);
  const lastY = useRef(0);
  const cursorRef = useRef({ nx: 0, ny: 0 });

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
      cursorRef.current.nx = (e.clientX / window.innerWidth - 0.5) * 2;
      cursorRef.current.ny = (e.clientY / window.innerHeight - 0.5) * 2;
    };

    const onTouch = (e) => {
      const t = e.touches[0];
      cursorRef.current.nx = (t.clientX / window.innerWidth - 0.5) * 2;
      cursorRef.current.ny = (t.clientY / window.innerHeight - 0.5) * 2;
    };

    document.addEventListener('scroll', onScroll, { capture: true, passive: true });
    window.addEventListener('mousemove', onMouse, { passive: true });
    window.addEventListener('touchmove', onTouch, { passive: true });

    return () => {
      document.removeEventListener('scroll', onScroll, { capture: true });
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
      className={`relative w-full min-h-screen flex flex-col justify-between overflow-hidden bg-[#070103] transition-all duration-300 ${isHeroActive ? 'hero-view-active' : ''
        }`}
    >

      {/* 1. THREE.JS 3D CANVAS & ATMOSPHERIC EDITORIAL BACKGROUND LAYERS */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        {/* Liquid Ether Background */}
        <div className="absolute inset-0 z-[0]">
          <LiquidEther
            colors={[THEME_COLORS.vividCrimson, THEME_COLORS.crimsonBright, THEME_COLORS.crimsonDeep]}
            mouseForce={20}
            cursorSize={100}
            isViscous={false}
            autoDemo={true}
          />
        </div>

        {/* 1. Soft glowing red radial spotlight backdrop emanating from behind the head */}
        <div
          className="absolute inset-0 z-[1] pointer-events-none"
          style={{
            background: `
              radial-gradient(circle at 50% 42%, rgba(220, 20, 38, 0.42) 0%, rgba(165, 12, 26, 0.18) 26%, transparent 52%),
              radial-gradient(ellipse 68% 58% at 50% 44%, rgba(155, 10, 24, 0.48) 0%, rgba(85, 5, 14, 0.35) 38%, rgba(22, 2, 5, 0.88) 68%, #070103 100%)
            `,
          }}
        />

        {/* 2. Subtle, fine-grain film noise overlay matching editorial aesthetic */}
        <div
          className="absolute inset-0 z-[2] pointer-events-none opacity-[0.06] mix-blend-soft-light"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
            backgroundRepeat: 'repeat',
          }}
        />

        {/* WebGL Canvas with chiaroscuro lighting */}
        <div className="hero-model-canvas absolute inset-0 z-[3]">
          <Canvas
            camera={{ position: CAMERA_BASE_POS, fov: 38 }}
            style={{ pointerEvents: 'none' }}
            gl={{ alpha: true, antialias: true ,toneMapping: THREE.ACESFilmicToneMapping,
    toneMappingExposure: 1.05,}}
          >
            {/* Chiaroscuro shading: dark warm ambient + strong right directional light */}
            <ambientLight intensity={0.4} color="#24070c" />
            <directionalLight position={[12, 7, 12]} intensity={2.6} color="#fff4eb" />
            <directionalLight position={[6, -2, 6]} intensity={0.5} color="#e8c89b" />

            {/* Red rim kicker lights */}
            <pointLight position={[-12, 4, -8]} intensity={80} distance={40} decay={2} color="#c81428" />
            <pointLight position={[12, 6, -8]} intensity={40} distance={40} decay={2} color="#9e0c1b" />

            <Suspense fallback={null}>
              <HeroModel meshRef={meshRef} isEntered={isEntered} />
            </Suspense>

            <CameraController spiralRef={spiralRef} cursorRef={cursorRef} isEntered={isEntered} />
          </Canvas>
        </div>
      </div>

      {/* Navbar rendered inside the Hero Section */}
      <Navbar mobileMenuOpen={mobileMenuOpen} setMobileMenuOpen={setMobileMenuOpen} isEntered={isEntered} />

      <style dangerouslySetInnerHTML={{
        __html: `
        @keyframes heroTitleReveal {
          from { transform: translateY(105%) scaleY(1.05); opacity: 0; }
          to   { transform: translateY(0) scaleY(1); opacity: 1; }
        }
        
        /* Dormant States: Safely hidden out of view to handle reverse entry snap */
        .hero-title-anim-1, .hero-title-anim-2 {
          opacity: 0;
          display: inline-block;
        }

        /* Active CSS System: Only plays staggers when page container is actively in view */
        .hero-view-active .hero-title-anim-1 {
          animation: heroTitleReveal 1.4s cubic-bezier(0.16, 1, 0.3, 1) 0.12s both;
        }
        .hero-view-active .hero-title-anim-2 {
          animation: heroTitleReveal 1.4s cubic-bezier(0.16, 1, 0.3, 1) 0.24s both;
        }

        /* Coordinated states with LoadingScreen */
        body:not(.loaded) #targetHeading {
          opacity: 0 !important;
        }
        body:not(.loaded) #targetHeading .hero-title-anim-1,
        body:not(.loaded) #targetHeading .hero-title-anim-2 {
          opacity: 0 !important;
          transform: none !important;
          animation: none !important;
        }
        body.loaded #targetHeading {
          opacity: 1 !important;
          transition: none !important;
        }
        body.loaded #targetHeading .hero-title-anim-1,
        body.loaded #targetHeading .hero-title-anim-2 {
          opacity: 1 !important;
          transform: none !important;
          animation: none !important;
        }

        /* Subtitle Paragraph reveal coordinated with loading (no blur, no dim/brighten flash) */
        .hero-desc-anim {
          opacity: 0;
          transform: translateY(16px);
          display: inline-block;
          filter: none !important;
          text-shadow: none !important;
        }

        body:not(.loaded) .hero-desc-anim {
          opacity: 0 !important;
          transform: translateY(16px) !important;
          animation: none !important;
        }

        body.loaded .hero-desc-anim {
          opacity: 1 !important;
          transform: translateY(0) !important;
          transition: opacity 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.15s, transform 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.15s !important;
          animation: none !important;
        }

        /* Navbar reveal coordinated with loading (hidden during initial loader, fades in with text roll) */
        body:not(.loaded) .hero-navbar {
          opacity: 0 !important;
          pointer-events: none !important;
        }

        body.loaded .hero-navbar {
          opacity: 1 !important;
          pointer-events: auto !important;
          transition: opacity 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.12s !important;
        }

        .vertical-text {
          writing-mode: vertical-lr;
          transform: rotate(180deg);
        }
      `}} />

      {/* Total Blackout Curtain for transition (Rises from bottom to top, lag-free hardware accelerated) */}
      <div
        className="hero-blackout-overlay absolute inset-x-0 bottom-0 pointer-events-none z-10"
        style={{
          top: '-120px',
          height: 'calc(100% + 120px)',
          background: 'linear-gradient(to top, #070103 0%, #070103 calc(100% - 120px), rgba(7, 1, 3, 0.8) calc(100% - 50px), transparent 100%)',
          transform: 'translateY(100%)',
          willChange: 'transform',
        }}
      />

      {/* 2. THE EXPANDING FRAME (Sits exactly between 3D canvas and Text) */}
      <div className="absolute inset-0 z-20 flex items-center justify-center pointer-events-none">
        <div
          className="expanding-frame bg-[#f4f1ea] w-full h-full rounded-[200px] flex items-center justify-center overflow-hidden"
          style={{ transform: 'scale(0)' }}
        >
          {children}
        </div>
      </div>

      {/* Top Left: Subtitle description (Desktop >= 768px) */}
      <div className="hidden md:block absolute md:top-8 md:left-9 hero-desc-wrapper overflow-hidden z-30 pointer-events-auto">
        <p className="hero-desc-anim font-sans text-[16px] text-white/70 leading-[1.62] tracking-[0.03em] font-normal max-w-[340px]">
          Building digital experiences<br />
          that blend intuitive design with clean<br />
          scalable code
        </p>
      </div>

      {/* HERO VIEW CONTENT: Full screen width typography with GGX89 Extra Light for Jayanthan and Behind The Nineties Italic for Sathiyapal */}
      <div className="flex-1 relative z-30 w-full flex items-end justify-center px-2 sm:px-4 md:px-6 lg:px-8 pb-3 sm:pb-5 md:pb-6 lg:pb-8 pt-24 translate-y-0">
        {/* Dark shadow backdrop gradient behind text for maximum contrast & visibility — strictly scoped to resting home hero */}
        <div
          className="hero-text-shadow-bg absolute inset-x-0 bottom-0 h-44 sm:h-56 md:h-64 pointer-events-none z-0 transition-opacity duration-500"
          style={{
            background:
              'linear-gradient(to top, rgba(0, 0, 0, 0.92) 0%, rgba(5, 1, 3, 0.7) 45%, rgba(7, 1, 3, 0.25) 75%, transparent 100%)',
          }}
        />

        <div className="hero-text-container relative z-10 w-full mx-auto flex flex-col items-start overflow-visible">
          {/* Mobile View (< 768px): Subtitle positioned directly above Jayanthan Sathiyapal */}
          <div className="block md:hidden w-full px-2 sm:px-3 mb-2 sm:mb-3 hero-desc-wrapper overflow-hidden pointer-events-auto">
            <p className="hero-desc-anim font-sans text-[12px] sm:text-[13px] text-white/80 leading-[1.5] tracking-[0.03em] font-normal text-left">
              Building digital experiences<br />
              that blend intuitive design with clean<br />
              scalable code
            </p>
          </div>

          <h1
            id="targetHeading"
            className="w-full text-center whitespace-nowrap select-none overflow-visible flex items-baseline justify-center tracking-[-0.02em] leading-[0.96] text-[#F4F1EA] pb-3 sm:pb-5 md:pb-0"
            style={{
              fontSize: 'clamp(2.4rem, 11.5vw, 22rem)',
              filter: 'none',
              textShadow: 'none',
              transition: 'none',
            }}
          >
            <span
              className="hero-name-left flex-1 flex justify-end pr-2 sm:pr-3 md:pr-5 font-extralight overflow-visible pb-2 sm:pb-3"
              style={{
                fontFamily: "'GGX89 Extra Light', 'Ggx89', 'GGX89', 'Inter Tight', 'Helvetica Neue', Arial, sans-serif",
                fontWeight: 400,
                letterSpacing: '-0.034em',
              }}
            >
              <span className="hero-title-anim-1 overflow-visible inline-block">
                {'Jayanthan'.split('').map((char, i) => (
                  <span key={i} className="inline-block">{char}</span>
                ))}
              </span>
            </span>
            <span
              className="hero-name-right flex-1 flex justify-start pl-2 sm:pl-3 md:pl-7 italic font-normal overflow-visible pb-2 sm:pb-3"
              style={{
                fontFamily: "'Behind The Nineties Italic', 'Behind The Nineties', 'Instrument Serif', Georgia, serif",
                fontStyle: 'italic',
                fontWeight: 200,
                letterSpacing: '-0.02em',
              }}
            >
              <span className="hero-title-anim-2 overflow-visible inline-block">
                {'Sathiyapal.'.split('').map((char, i) => (
                  <span key={i} className="inline-block">{char}</span>
                ))}
              </span>
            </span>
          </h1>
        </div>
      </div>

    </section>
  );
}

useGLTF.preload('/hero-optimized.glb');
