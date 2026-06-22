import React from 'react';
import BackgroundCanvas from './BackgroundCanvas';

import HeroSection from './pages/LandingPage/HeroSection';
import AboutPage from './pages/AboutPage/AboutPage';
import ProjectsPage from './pages/ProjectsPage/ProjectsPage';
import ContactPage from './pages/ContactPage/ContactPage';
import Footer from './components/common/Footer';

/**
 * Main application component.
 * Combines layout structures, navigation menus, backgrounds, and sub-page views.
 */
export default function App() {

  return (
    <div className="relative h-screen w-full overflow-y-auto snap-y snap-mandatory scroll-smooth bg-pure-black text-pure-white font-body selection:bg-vivid-crimson selection:text-pure-white">
      
      {/* 1. IMMOBILE GLOBAL BACKGROUND LAYER */}
      {/* fixed inset-0 completely lifts the canvas out of the page scroll flow */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <BackgroundCanvas />
      </div>

      {/* Top Navigation Bar (Stays on top of everything) */}
      

      {/* 2. SCROLLABLE CONTENT LAYERS */}
      {/* relative z-10 ensures text blocks stay stacked cleanly over the fixed canvas */}
      <main className="relative z-10 w-full h-full">
        
        {/* Hero Section */}
        <HeroSection />

        {/* About Me Section */}
        <AboutPage />

        {/* Projects Grid Section */}
        <ProjectsPage />

        {/* Contact Section & Footer Grouped for Snapping */}
        <div id="contact" className="relative h-screen w-full snap-start flex flex-col justify-between overflow-y-auto scrollbar-none">
          <ContactPage />
          <Footer />
        </div>
        
      </main>
    </div>
  );
}
