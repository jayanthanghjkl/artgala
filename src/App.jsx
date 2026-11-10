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
    // Initialize Lenis with velocity clamping to prevent trackpad flick skips
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      wheelMultiplier: 0.6, // Softens strong wheel flicks
      touchMultiplier: 1.2,
      syncTouch: false,
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
