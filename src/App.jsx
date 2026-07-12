import React, { useEffect, useRef } from 'react';
import HeroSection from './pages/LandingPage/HeroSection';
import AboutPage from './pages/AboutPage/AboutPage';
import StaggeredGrid from './pages/SkillsPage/staggeredGrid'; 
import ProjectsPage from './pages/ProjectsPage/ProjectsPage';
import Footer25 from './components/ui/Footer25';
import { skillsBentoItems, skillsGridImages } from './data/skills';

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

  return (
    <div className="relative w-full min-h-screen bg-pure-black text-pure-white font-body selection:bg-vivid-crimson selection:text-pure-white">
      <main className="relative z-10 w-full">

        {/* Hero -> About Transition Wrapper */}
        {/* We make the wrapper 200vh so it takes 1 full screen height to scrub the transition */}
        <div className="hero-about-transition relative w-full h-[200vh]">
          
          {/* Hero Section stays fixed underneath during the 200vh scroll */}
          <div className="sticky top-0 w-full h-screen">
            <HeroSection isEntered={true} />
          </div>
          
          {/* About Section acts as the sliding overlay with clip-path animated by GSAP */}
          {/* When the user scrolls past 100vh of scrub, it naturally flows up */}
          <div className="top-0 left-0 w-full h-screen">
            <AboutPage />
          </div>
        </div>

        {/* Skills Section Container */}
        <div id="skills" className="w-full relative z-20 bg-[#101010]">
          <StaggeredGrid 
            images={skillsGridImages} 
            bentoItems={skillsBentoItems} 
            centerText="Skills"
          />
        </div>

        {/* Projects Section Container */}
        <div className="w-full h-screen relative z-20">
          <ProjectsPage />
        </div>

        {/* Contact Section & Footer (Footer25) */}
        <div id="contact" className="w-full h-screen relative z-20">
          <Footer25 />
        </div>

      </main>
    </div>
  );
}
