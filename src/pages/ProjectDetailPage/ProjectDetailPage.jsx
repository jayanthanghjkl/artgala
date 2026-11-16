import React, { useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import gsap from 'gsap';
import { motion } from 'framer-motion';
import { projectsList } from '../../data/projects';
import TextRoll from '../../components/common/TextRoll';

export default function ProjectDetailPage({ projectId }) {
  const imageContainerRef = useRef(null);
  
  // Find project by ID (projectId is a string or number)
  const project = projectsList.find(p => p.id === Number(projectId));

  const navigate = useNavigate();

  useEffect(() => {
    // Reset scroll of this specific overlay, not window
    const overlay = document.getElementById('project-detail-overlay');
    if (overlay) overlay.scrollTop = 0;
  }, [projectId]);

  const handleBack = () => {
    if (window.history.length > 1) {
      navigate(-1);
    } else {
      navigate('/');
    }
  };

  if (!project) {
    return (
      <div className="w-full h-screen bg-black flex flex-col items-center justify-center text-white px-4">
        <h1 className="text-2xl font-bold mb-4 uppercase font-heading">Project Not Found</h1>
        <Link 
          to="/" 
          className="pointer-events-auto flex items-center gap-2 text-zinc-300 hover:text-white transition-colors duration-300 font-heading text-xs sm:text-sm font-bold tracking-widest uppercase group/link bg-black/60 hover:bg-black/90 px-4 sm:px-5 py-2 sm:py-2.5 rounded-full backdrop-blur-md shadow-lg"
          aria-label="Go back"
        >
          <TextRoll text="BACK" />
        </Link>
      </div>
    );
  }

  return (
    <motion.div 
      id="project-detail-overlay"
      className="fixed inset-0 z-[100] w-full h-full bg-black overflow-y-auto overflow-x-hidden text-white"
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.96 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
    >
      {/* Ambient background glows */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-1/4 right-1/4 w-[320px] sm:w-[500px] h-[320px] sm:h-[500px] rounded-full bg-vivid-crimson/10 blur-[120px]" />
        <div className="absolute bottom-1/4 left-1/4 w-[280px] sm:w-[450px] h-[280px] sm:h-[450px] rounded-full bg-vivid-crimson/8 blur-[100px]" />
      </div>

      {/* Header with Back Button */}
      <div className="absolute top-0 left-0 w-full z-50 flex items-center justify-end px-4 sm:px-6 md:px-10 py-5 sm:py-6 md:py-8 pointer-events-none">
        <button 
          onClick={handleBack} 
          className="pointer-events-auto flex items-center gap-2 text-zinc-300 hover:text-white transition-colors duration-300 font-heading text-xs sm:text-sm font-bold tracking-widest uppercase group/link bg-black/60 hover:bg-black/90 px-4 sm:px-5 py-2 sm:py-2.5 rounded-full backdrop-blur-md shadow-lg"
          aria-label="Go back"
        >
          <TextRoll text="BACK" />
        </button>
      </div>

      {/* Main Content Container */}
      <div className="relative z-10 min-h-screen w-full flex flex-col justify-center pt-24 sm:pt-28 md:pt-32 pb-16 sm:pb-20 md:pb-24 px-4 sm:px-6 md:px-10 lg:px-12 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 sm:gap-10 lg:gap-12 xl:gap-16 items-center">
          
          {/* Details Column */}
          <div className="flex flex-col items-start text-left order-2 lg:order-1 lg:col-span-5">
            {/* Project Tag */}
            {project.tag && (
              <div className="mb-4 sm:mb-6 text-[11px] sm:text-xs font-mono tracking-widest text-vivid-crimson uppercase border border-vivid-crimson/30 px-3.5 py-1.5 rounded-full bg-vivid-crimson/10 inline-flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-vivid-crimson animate-pulse" />
                {project.tag}
              </div>
            )}

            {/* Project Title */}
            <h1 className="font-heading text-3xl sm:text-4xl md:text-5xl lg:text-5xl xl:text-6xl font-black tracking-tight uppercase mb-4 sm:mb-6 text-white leading-[1.08] break-words">
              {project.title}
            </h1>

            {/* Project Description */}
            <div className="mb-8 sm:mb-10 max-w-xl">
              <p className="text-zinc-300 leading-relaxed text-sm sm:text-base md:text-lg">
                {project.desc}
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-4 w-full sm:w-auto">
              {(project.link || project.git) && (
                <a 
                  href={project.link || project.git} 
                  target="_blank" 
                  rel="noreferrer"
                  className="inline-flex items-center justify-center gap-2.5 px-7 sm:px-8 py-3.5 sm:py-4 bg-vivid-crimson text-white font-heading font-bold text-xs sm:text-sm tracking-widest uppercase rounded-full hover:bg-white hover:text-vivid-crimson hover:scale-105 hover:shadow-[0_10px_35px_rgba(230,0,38,0.5)] transition-all duration-300 w-full sm:w-auto"
                >
                  <span>Visit Project</span>
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M7 17L17 7M17 7H9M17 7V15" />
                  </svg>
                </a>
              )}

              {project.git && project.link && project.git !== project.link && (
                <a 
                  href={project.git} 
                  target="_blank" 
                  rel="noreferrer"
                  className="inline-flex items-center justify-center gap-2 px-6 sm:px-7 py-3.5 sm:py-4 bg-white/5 border border-white/15 text-zinc-300 font-heading font-bold text-xs sm:text-sm tracking-widest uppercase rounded-full hover:bg-white/10 hover:text-white hover:border-white/30 transition-all duration-300 w-full sm:w-auto"
                >
                  <span>GitHub</span>
                </a>
              )}
            </div>
          </div>

          {/* Rectangular Image Column */}
          {project.image && (
            <div className="w-full flex items-center justify-center order-1 lg:order-2 lg:col-span-7" style={{ perspective: '1000px' }}>
              <div 
                ref={imageContainerRef}
                className="w-full aspect-[16/10] sm:aspect-[16/9]   overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.8),0_0_35px_rgba(230,0,38,0.2)] border border-white/15 bg-zinc-950/90 backdrop-blur-md transform-gpu relative group"
                style={{ transformStyle: 'preserve-3d' }}
                onMouseMove={(e) => {
                  if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;
                  if (!imageContainerRef.current) return;
                  const rect = imageContainerRef.current.getBoundingClientRect();
                  const x = e.clientX - rect.left;
                  const y = e.clientY - rect.top;
                  const centerX = rect.width / 2;
                  const centerY = rect.height / 2;
                  const rotateX = ((y - centerY) / centerY) * -8;
                  const rotateY = ((x - centerX) / centerX) * 8;
                  gsap.to(imageContainerRef.current, { rotationX: rotateX, rotationY: rotateY, duration: 0.35, ease: 'power2.out' });
                }}
                onMouseLeave={() => {
                  gsap.to(imageContainerRef.current, { rotationX: 0, rotationY: 0, duration: 0.6, ease: 'power3.out' });
                }}
              >
                <img 
                  src={project.image} 
                  alt={project.title} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                />
                
                {/* Subtle glass rim highlight */}
                <div className="absolute inset-0 pointer-events-none rounded-xl sm:rounded-2xl ring-1 ring-inset ring-white/10 group-hover:ring-vivid-crimson/30 transition-all duration-500" />
              </div>
            </div>
          )}

        </div>
      </div>
    </motion.div>
  );
}
