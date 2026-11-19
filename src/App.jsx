import React, { useEffect, useState } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import Layout from './components/layout/Layout';
import Home from './pages/Home';
import WorkRoute from './pages/WorkRoute';
import ClosetPage from './pages/ClosetPage';
import HeroFashion from './components/ui/hero-fashion';
import ProjectDetailPage from './pages/ProjectDetailPage/ProjectDetailPage';
import ContactPage from './pages/ContactPage/ContactPage';
import SkillsPage from './pages/SkillsPage/SkillsPage';
import NotFoundPage from './pages/NotFoundPage/NotFoundPage';
import ScrollToTop from './components/common/ScrollToTop';
import Lenis from 'lenis';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

/**
 * Main application component.
 * Coordinates smooth scrolling (Lenis), global navigation menus, cinematic backgrounds,
 * and GSAP ScrollTrigger animations.
 */
export default function App() {
  const location = useLocation();
  const [projectId, setProjectId] = useState(null);

  useEffect(() => {
    // Intelligent wheel adapter: Differentiates physical mouse wheels from trackpads.
    // Mouse wheels produce discrete, notched impulses requiring higher base delta and acceleration.
    // Trackpads emit high-frequency float streams with OS momentum requiring velocity clamping.
    let lastWheelTime = 0;
    let lastIsTrackpad = false;
    let wheelStreak = 0;

    let lenis;
    lenis = new Lenis({
      duration: 1.0,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      wheelMultiplier: 1.0, // Base 1:1 multiplier; normalized dynamically in virtualScroll
      touchMultiplier: 1.2,
      syncTouch: false,
      virtualScroll: (data) => {
        const { event } = data;
        if (!event || event.type !== 'wheel') return;

        const now = performance.now();
        const dt = now - lastWheelTime;
        lastWheelTime = now;

        const rawDeltaY = event.deltaY || 0;
        const rawDeltaX = event.deltaX || 0;
        const absY = Math.abs(rawDeltaY);
        const absX = Math.abs(rawDeltaX);

        // Hardware heuristics to identify input device:
        // 1. Line mode (event.deltaMode !== 0, e.g. Firefox or Windows mouse wheel setting) is strictly a physical mouse.
        // 2. High-precision trackpads emit fractional/floating-point deltas (e.g. 1.25, 14.8).
        // 3. Discrete mouse detents in Windows/macOS emit integer step values (typically 100, 120, or 40).
        // 4. Trackpad gestures emit high-frequency stream bursts (dt < 30ms) with small individual deltas.
        const isLineMode = event.deltaMode !== 0;
        const isFractional = (absY % 1 !== 0) || (absX % 1 !== 0);
        const isStandardMouseStep = absY >= 80 && (absY % 100 === 0 || absY % 120 === 0 || absY % 40 === 0) && absX === 0;

        let isMouse = false;
        if (isLineMode) {
          isMouse = true;
          lastIsTrackpad = false;
        } else if (isFractional) {
          isMouse = false;
          lastIsTrackpad = true;
        } else if (isStandardMouseStep) {
          isMouse = true;
          lastIsTrackpad = false;
        } else if (dt < 30 && lastIsTrackpad) {
          isMouse = false;
        } else if (absY >= 100 && absX === 0) {
          isMouse = true;
          lastIsTrackpad = false;
        } else {
          isMouse = false;
          lastIsTrackpad = true;
        }

        if (isMouse) {
          // Physical mouse wheel optimization:
          // Build natural momentum when rolling the mouse wheel rapidly
          if (dt < 220) {
            wheelStreak = Math.min(wheelStreak + 1, 6);
          } else {
            wheelStreak = 0;
          }

          // Dynamic acceleration curve (1.0x at rest up to 2.5x during fast rolling)
          const accel = 1.0 + (wheelStreak * 0.25);

          // Calculate comfortable travel distance per notch (~180px - 220px base vs previous 60px)
          let baseDelta;
          if (isLineMode) {
            // Firefox/Windows line mode: Lenis produces ~50px default, boost to ~190px base
            baseDelta = Math.sign(rawDeltaY) * Math.max(Math.abs(data.deltaY) * 3.8, 190);
          } else {
            // Standard pixel mode (100px or 120px notch) -> boost to ~190-220px base
            baseDelta = Math.sign(rawDeltaY) * Math.max(Math.abs(data.deltaY) * 1.9, 190);
          }

          data.deltaY = baseDelta * accel;

          // Snappier response curve for crisp mouse feedback
          if (lenis) {
            lenis.options.duration = Math.max(0.75, 0.95 - (wheelStreak * 0.04));
          }
        } else {
          // Trackpad gesture optimization:
          wheelStreak = 0;

          // Soften trackpad flicks so rapid momentum does not violently skip sections
          const sign = Math.sign(data.deltaY);
          const clampedY = sign * Math.min(Math.abs(data.deltaY), 85);
          data.deltaY = clampedY * 0.85;

          // Smooth, luxurious glide for trackpad gestures
          if (lenis) {
            lenis.options.duration = 1.15;
          }
        }
      },
    });

    // Keep ScrollTrigger and Lenis in lockstep
    lenis.on('scroll', ScrollTrigger.update);
    const updateTicker = (time) => lenis.raf(time * 1000);
    gsap.ticker.add(updateTicker);
    gsap.ticker.lagSmoothing(0); // Prevents GSAP from dropping frames when CPU throttles

    const handleResize = () => {
      ScrollTrigger.refresh();
    };
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      gsap.ticker.remove(updateTicker);
      ScrollTrigger.getAll().forEach(t => t.kill());
      lenis.destroy();
    };
  }, []);

  useEffect(() => {
    if (location.hash.startsWith('#project-')) {
      const id = location.hash.replace('#project-', '');
      setProjectId(id);
      document.body.style.overflow = 'hidden'; // Prevent background scrolling
    } else {
      setProjectId(null);
      document.body.style.overflow = '';
    }
    
    return () => { document.body.style.overflow = ''; }
  }, [location.hash]);

  return (
    <Layout>
      <ScrollToTop />
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={<Home />} />
          <Route path="/work" element={<WorkRoute />} />
          <Route path="/closet" element={<ClosetPage />} />
          <Route path="/skills" element={<SkillsPage />} />
          <Route path="/info" element={<HeroFashion />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </AnimatePresence>

      <AnimatePresence>
        {projectId && (
          <ProjectDetailPage key="project-overlay" projectId={projectId} />
        )}
      </AnimatePresence>
    </Layout>
  );
}
