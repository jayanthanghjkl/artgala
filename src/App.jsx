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
    let lastWheelTime = 0;
    let wheelStreak = 0;

    let lenis;
    lenis = new Lenis({
      duration: 1.0,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      wheelMultiplier: 1.0,
      touchMultiplier: 1.2,
      syncTouch: false,
      virtualScroll: (data) => {
        const { event } = data;
        if (!event) return;

        const now = performance.now();
        const dt = now - lastWheelTime;
        lastWheelTime = now;

        const rawDeltaY = event.deltaY || 0;
        const rawDeltaX = event.deltaX || 0;
        const absY = Math.abs(rawDeltaY);
        const absX = Math.abs(rawDeltaX);

        if (absY < 1 && absX < 1) return;

        // Detect if currently scrolling inside precision interactive sections (#projects or #skills)
        let isPrecisionSection = false;
        const projectsEl = document.getElementById('projects');
        if (projectsEl) {
          const rect = projectsEl.getBoundingClientRect();
          if (rect.top <= window.innerHeight * 0.85 && rect.bottom >= -window.innerHeight * 0.1) {
            isPrecisionSection = true;
          }
        }
        if (!isPrecisionSection) {
          const skillsEl = document.getElementById('skills');
          if (skillsEl) {
            const rect = skillsEl.getBoundingClientRect();
            if (rect.top <= window.innerHeight * 0.85 && rect.bottom >= window.innerHeight * 0.1) {
              isPrecisionSection = true;
            }
          }
        }

        // Hardware heuristics to identify input device:
        // 1. Line mode (event.deltaMode !== 0, e.g. Firefox or Windows mouse wheel setting) is strictly a physical mouse.
        // 2. High-precision trackpads emit fractional deltas, horizontal drift, small deltas (<60), or high-frequency stream bursts (dt < 55ms).
        // 3. Discrete mouse detents in Windows/macOS emit integer step values (typically 100 or 120) with zero horizontal drift and spaced intervals.
        const isLineMode = event.deltaMode !== 0;
        const isFractional = (absY % 1 !== 0) || (absX % 1 !== 0);
        const hasHorizontal = absX > 0;
        const isStandardMouseNotch = !isFractional && !hasHorizontal && (absY === 100 || absY === 120 || absY === 200 || absY === 240);

        let isTrackpad = false;
        if (isLineMode) {
          // Line mode is strictly mouse wheel
          isTrackpad = false;
        } else if (isFractional || hasHorizontal || absY < 60) {
          // Small deltas (<60), fractional values, or horizontal drift are strictly trackpads
          isTrackpad = true;
        } else if (dt > 0 && dt < 55) {
          // Continuous high-frequency stream (<55ms interval) is strictly a trackpad gesture
          isTrackpad = true;
        } else if (isStandardMouseNotch && (dt === 0 || dt >= 55)) {
          // Discrete mouse notch with proper inter-click spacing
          isTrackpad = false;
        } else {
          // Conservative default for Windows precision touchpads: treat continuous/variable events as trackpad
          isTrackpad = true;
        }

        if (!isTrackpad) {
          // Physical mouse wheel - Preserved exactly as tuned
          if (isPrecisionSection) {
            // REDUCE SCROLL SPEED IN PROJECTS & SKILLS:
            // Zero runaway acceleration and gentle notch delta (~90px) so items scroll deliberately one by one!
            wheelStreak = 0;
            const sign = Math.sign(rawDeltaY) || 1;
            const notchDistance = 90;
            data.deltaY = sign * notchDistance;

            if (lenis) {
              lenis.options.duration = 0.95;
            }
          } else {
            // Normal browsing sections (Hero, About, Achievements, Footer, etc.)
            if (dt < 250) {
              wheelStreak = Math.min(wheelStreak + 1, 5);
            } else {
              wheelStreak = 0;
            }

            const accel = 1.0 + (wheelStreak * 0.12);
            const sign = Math.sign(rawDeltaY) || 1;
            const notchDistance = Math.max(Math.abs(data.deltaY) * 1.35, 140);

            data.deltaY = sign * notchDistance * accel;

            if (lenis) {
              lenis.options.duration = 1.05;
            }
          }
        } else {
          // Trackpad gesture:
          // Substantially dampen delta magnitude and clamp momentum flicks so the page
          // scrolls smoothly with luxurious control and does not fly fast
          wheelStreak = 0;
          const sign = Math.sign(data.deltaY) || 1;

          if (isPrecisionSection) {
            // Precision sections (#projects, #skills):
            // Deliberate, gentle stepping so cards and skills step one by one
            const clamped = Math.min(Math.abs(data.deltaY), 12);
            data.deltaY = sign * clamped * 0.22;
            if (lenis) {
              lenis.options.duration = 0.65;
            }
          } else {
            // Normal browsing sections (Hero, About, Achievements, Footer, etc.):
            // Tame fast trackpad scrolls so navigation feels calm, stable, and cinematic
            const clamped = Math.min(Math.abs(data.deltaY), 16);
            data.deltaY = sign * clamped * 0.26;
            if (lenis) {
              lenis.options.duration = 0.70;
            }
          }
        }
      },
    });

    window.__lenis = lenis;

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
