import React, { useEffect, useState } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import Layout from './components/layout/Layout';
import Home from './pages/Home';
import WorkRoute from './pages/WorkRoute';
import ProjectDetailPage from './pages/ProjectDetailPage/ProjectDetailPage';
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
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/work" element={<WorkRoute />} />
      </Routes>

      <AnimatePresence>
        {projectId && (
          <ProjectDetailPage key="project-overlay" projectId={projectId} />
        )}
      </AnimatePresence>
    </Layout>
  );
}
