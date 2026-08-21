import React, { useEffect, useRef } from 'react';
import HeroTransitionWrapper from './components/layout/HeroTransitionWrapper';
import StaggeredGrid from './pages/SkillsPage/staggeredGrid'; 
import ProjectsPage from './pages/ProjectsPage/ProjectsPage';
import Footer25 from './components/ui/Footer25';
import { skillsBentoItems, skillsGridImages } from './data/skills';
import Layout from './components/layout/Layout';
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
    <Layout>
      {/* Master Wrapper for Hero and About transitions */}
      <HeroTransitionWrapper />

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
    </Layout>
  );
}
