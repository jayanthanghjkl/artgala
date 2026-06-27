import HeroSection from './pages/LandingPage/HeroSection';
import AboutPage from './pages/AboutPage/AboutPage';
import StaggeredGrid from './pages/SkillsPage/StaggeredGrid';
import ProjectsPage from './pages/ProjectsPage/ProjectsPage';
import Footer25 from './components/ui/Footer25';

import { skillsBentoItems, skillsGridImages } from './data/skills';

/**
 * Main application component.
 * Coordinates layouts, global navigation menus, cinematic backgrounds,
 * and snapped scrolling directly from initial mount.
 */
export default function App() {
  return (
    <div className="scroll-container relative w-full min-h-screen md:h-screen md:overflow-y-auto md:snap-y md:snap-mandatory scroll-smooth bg-pure-black text-pure-white font-body selection:bg-vivid-crimson selection:text-pure-white">

      {/* 2. SCROLLABLE CONTENT LAYERS */}
      <main className="relative z-10 w-full h-full">

        {/* Hero Section Container */}
        <div className="w-full h-[140vh] snap-start snap-always relative">
          <div className="sticky top-0 w-full h-screen">
            {/* Passed true directly to trigger internal hero text cascades instantly */}
            <HeroSection isEntered={true} />
          </div>
        </div>

        {/* About Section Container */}
        <div className="w-full h-screen snap-start snap-always">
          <AboutPage />
        </div>

        {/* Skills Section Container (Staggered Bento Grid) */}
        <div id="skills" className="w-full h-screen snap-start snap-always">
          <StaggeredGrid 
            images={skillsGridImages} 
            bentoItems={skillsBentoItems} 
            centerText="Skills"
          />
        </div>

        {/* Projects Section Container */}
        <div className="w-full h-screen snap-start snap-always">
          <ProjectsPage />
        </div>

        {/* Contact Section & Footer (Footer25) */}
        <div id="contact" className="w-full h-screen snap-start snap-always">
          <Footer25 />
        </div>

      </main>
    </div>
  );
}
