import React from 'react';
import { Link } from 'react-router-dom';
import ProjectsPage from './ProjectsPage/ProjectsPage';

export default function ProjectsRoute() {
  return (
    <div className="w-full h-screen bg-black overflow-hidden relative">
      {/* Absolute Header for Works Page */}
      <div className="absolute top-0 left-0 w-full z-50 flex items-center justify-between px-6 md:px-10 py-6 md:py-8 pointer-events-none">
        <Link 
          to="/" 
          className="pointer-events-auto flex items-center gap-2 text-zinc-400 hover:text-white transition-colors duration-300 font-body text-xs md:text-sm font-semibold tracking-widest uppercase group bg-black/40 px-4 py-2 rounded-full backdrop-blur-md border border-white/5"
        >
          <span className="transform transition-transform duration-300 group-hover:-translate-x-1">←</span>
          Back
        </Link>
        
        <h1 className="font-heading text-xl md:text-2xl font-bold text-white tracking-[0.2em] uppercase drop-shadow-md">
          Works
        </h1>
        
        {/* Empty div to balance flex-between */}
        <div className="w-[88px]"></div>
      </div>

      <ProjectsPage />
    </div>
  );
}
