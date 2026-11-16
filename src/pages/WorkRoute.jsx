import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import WorkPage from './WorkPage/WorkPage';
import TextRoll from '../components/common/TextRoll.jsx';

export default function WorkRoute() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className="w-full h-screen bg-black overflow-hidden relative"
    >
      {/* Absolute Header for Works Page */}
      <motion.div
        initial={{ opacity: 0, y: -25 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
        className="absolute top-0 left-0 w-full z-50 flex items-center justify-between px-4 sm:px-6 md:px-10 py-5 sm:py-6 md:py-8 pointer-events-none"
      >
        <h1 className="pointer-events-auto font-heading text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white tracking-tight drop-shadow-md">
          Work
        </h1>
        
        <Link 
          to="/" 
          className="pointer-events-auto flex items-center gap-2 text-zinc-300 hover:text-white transition-colors duration-300 font-heading text-xs sm:text-sm font-bold tracking-widest uppercase group/link bg-black/60 hover:bg-black/90 px-4 sm:px-5 py-2 sm:py-2.5 rounded-full backdrop-blur-md shadow-lg"
          aria-label="Go back"
        >
          <TextRoll text="BACK" />
        </Link>
      </motion.div>

      <WorkPage />
    </motion.div>
  );
}
