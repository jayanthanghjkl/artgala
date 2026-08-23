import React from 'react';
import HeroTransitionWrapper from '../components/layout/HeroTransitionWrapper';
import GalleryPage from './GalleryPage/GalleryPage';
import StaggeredGrid from './SkillsPage/staggeredGrid';
import Footer25 from '../components/ui/Footer25';
import { skillsBentoItems, skillsGridImages } from '../data/skills';

export default function Home() {
  return (
    <>
      {/* Master Wrapper for Hero and About transitions */}
      <HeroTransitionWrapper />

      {/* Scroll-linked Gallery Section */}
      <GalleryPage />

      {/* Skills Section Container */}
      <div id="skills" className="w-full relative z-20 bg-[#101010]">
        <StaggeredGrid 
          images={skillsGridImages} 
          bentoItems={skillsBentoItems} 
          centerText="Skills"
        />
      </div>

      {/* Contact Section & Footer (Footer25) */}
      <div id="contact" className="w-full h-screen relative z-20">
        <Footer25 />
      </div>
    </>
  );
}
