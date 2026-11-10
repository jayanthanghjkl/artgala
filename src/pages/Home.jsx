import React from 'react';
import { motion } from 'framer-motion';
import HeroTransitionWrapper from '../components/layout/HeroTransitionWrapper';
import ProjectPage from './ProjectPage/ProjectPage';
import StaggeredGrid from './SkillsPage/staggeredGrid';
import AchievementsPage from './AchievementsPage/AchievementsPage';
import Footer25 from '../components/ui/Footer25';
import { skillsBentoItems, skillsGridImages } from '../data/skills';

export default function Home() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
    >
      {/* Master Wrapper for Hero and About transitions */}
      <HeroTransitionWrapper />

      {/* Unified Project & Gallery Showcase with single persistent static background */}
      <ProjectPage />

      {/* Cinematic Black Fade Transition Buffer into Skills - compact 2-scroll pace */}
      <div className="w-full h-[6vh] md:h-[10vh] bg-black relative z-20 pointer-events-none" aria-hidden="true" />

      {/* ========================================================================= */}
      {/* 1. SKILLS SECTION                                                         */}
      {/* ========================================================================= */}
      <section id="skills" className="relative w-full z-20 bg-black">
        <StaggeredGrid 
          images={skillsGridImages} 
          bentoItems={skillsBentoItems} 
          centerText="Skills"
        />
      </section>


      {/* ========================================================================= */}
      {/* 2. ACHIEVEMENTS / AWARDS SECTION (Screen Height)                           */}
      {/* ========================================================================= */}
      <section id="achievements" className="relative w-full h-screen z-20 bg-[#000000] flex flex-col justify-center overflow-hidden">
        <AchievementsPage />
      </section>

      {/* Footer Section */}
      <div id="contact" className="w-full relative z-20">
        <Footer25 />
      </div>
    </motion.div>
  );
}