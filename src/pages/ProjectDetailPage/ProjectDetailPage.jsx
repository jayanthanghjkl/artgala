import React, { useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import gsap from 'gsap';
import { motion } from 'framer-motion';
import { projectsList } from '../../data/projects';
import TextRoll from '../../components/common/TextRoll';

export default function ProjectDetailPage({ projectId }) {
  const imageContainerRef = useRef(null);
  
  // Find project by ID (projectId is a string)
  const project = projectsList.find(p => p.id === Number(projectId));

  const navigate = useNavigate();

  useEffect(() => {
    // Reset scroll of this specific overlay, not window
    const overlay = document.getElementById('project-detail-overlay');
    if (overlay) overlay.scrollTop = 0;
  }, [projectId]);

  if (!project) {
    return (
      <div className="w-full h-screen bg-black flex flex-col items-center justify-center text-white">
        <h1 className="text-2xl font-bold mb-4">Project Not Found</h1>
        <Link to="/" className="text-vivid-crimson hover:underline">Go Back</Link>
      </div>
    );
  }

  return (
    <motion.div 
      id="project-detail-overlay"
      className="fixed inset-0 z-[100] w-full h-full bg-black overflow-y-auto overflow-x-hidden text-white"
      initial={{ x: "100vw", y: "100vh" }}
      animate={{ x: 0, y: 0 }}
      exit={{ x: "100vw", y: "100vh" }}
      transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1] }}
    >
      {/* Absolute Header with Back Button */}
<div className="absolute top-0 left-0 w-full z-50 flex items-center px-6 md:px-10 py-8 md:py-10 pointer-events-none">
  <button 
    onClick={() => navigate(-1)} 
    className="pointer-events-auto flex items-center gap-0 text-zinc-300 hover:text-vivid-crimson transition-colors duration-300 font-heading text-sm md:text-base font-black tracking-tighter uppercase group/link hover:scale-110"
  >
    {/* Updated to a precise diagonal top-left arrow SVG */}
    <svg 
      width="1.5em" 
      height="1.5em" 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2.5" /* Increased thickness slightly to match the heavy font weight */
      strokeLinecap="round" 
      strokeLinejoin="round"
      className="shrink-0"
    >
      <line x1="16.5" y1="15" x2="7" y2="5.9"></line>
      <polyline points="7 16 7 6 17 6"></polyline>

    </svg>
    <TextRoll text="BACK" />
  </button>
</div>


      <div className="pt-32 pb-20 px-6 md:px-10 lg:px-20 max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
        {/* Left Column: Details */}
        <div className="flex flex-col items-start text-left order-2 lg:order-1">
          {/* Project Title */}
          <h1 className="font-heading text-4xl md:text-5xl lg:text-7xl font-bold tracking-tight mb-6">
            {project.title}
          </h1>
          
          {/* Project Tag */}
          {project.tag && (
            <div className="mb-8 text-xs md:text-sm font-mono tracking-widest text-vivid-crimson uppercase border border-vivid-crimson/30 px-3 py-1 rounded-full bg-vivid-crimson/5">
              {project.tag}
            </div>
          )}

          {/* Project Content / Description */}
          <div className="prose prose-invert prose-lg max-w-none mb-12">
            <p className="text-zinc-300 leading-relaxed text-base md:text-lg">
              {project.desc}
            </p>
          </div>

          {/* Action Button (External Link) */}
          {(project.link || project.git) && (
            <div>
              <a 
                href={project.link || project.git} 
                target="_blank" 
                rel="noreferrer"
                className="inline-block px-8 py-4 bg-vivid-crimson text-white font-heading font-bold text-sm tracking-widest uppercase rounded-full hover:bg-white hover:text-vivid-crimson hover:scale-105 hover:shadow-[0_10px_30px_rgba(230,0,38,0.4)] transition-all duration-300"
              >
                Visit Project
              </a>
            </div>
          )}
        </div>

        {/* Right Column: Image */}
        {project.image && (
          <div className="w-full h-full flex items-center justify-center order-1 lg:order-2" style={{ perspective: '1000px' }}>
            <div 
              ref={imageContainerRef}
              className="w-full rounded-2xl md:rounded-3xl overflow-hidden shadow-[0_20px_50px_rgba(230,0,38,0.15)] border border-white/10 bg-zinc-900 aspect-[4/3] lg:aspect-auto lg:h-[70vh] transform-gpu"
              style={{ transformStyle: 'preserve-3d' }}
              onMouseMove={(e) => {
                if (!imageContainerRef.current) return;
                const rect = imageContainerRef.current.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                const centerX = rect.width / 2;
                const centerY = rect.height / 2;
                const rotateX = ((y - centerY) / centerY) * -12;
                const rotateY = ((x - centerX) / centerX) * 12;
                gsap.to(imageContainerRef.current, { rotationX: rotateX, rotationY: rotateY, duration: 0.4, ease: 'power2.out' });
              }}
              onMouseLeave={() => {
                gsap.to(imageContainerRef.current, { rotationX: 0, rotationY: 0, duration: 0.7, ease: 'power3.out' });
              }}
            >
              <img 
                src={project.image} 
                alt={project.title} 
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-700 ease-out"
              />
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
}
