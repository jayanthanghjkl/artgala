import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

export default function ContactPage({ isEmbedded = false }) {
  const navigate = useNavigate();
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e) => {
    const { clientX, clientY } = e;
    const { innerWidth, innerHeight } = window;
    setMousePos({
      x: (clientX / innerWidth - 0.5) * 40,
      y: (clientY / innerHeight - 0.5) * 40,
    });
  };

  const handleBack = () => {
    if (window.history.length > 1) {
      navigate(-1);
    } else {
      navigate('/');
    }
  };

  return (
    <motion.section
      id="contact"
      onMouseMove={handleMouseMove}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
      className={`relative w-full min-h-screen bg-[#070707] text-white flex flex-col justify-between p-6 sm:p-10 md:p-14 lg:p-16 select-none overflow-hidden font-sans antialiased ${
        isEmbedded ? 'z-20' : 'fixed inset-0 z-[100] overflow-y-auto'
      }`}
    >
      {/* ========================================================================= */}
      {/* ATMOSPHERIC GLOW / MESH GRADIENT BACKGROUND                               */}
      {/* ========================================================================= */}
      {/* Main Crimson Radial Light bleeding from top-center/right */}
      <motion.div
        animate={{
          x: mousePos.x,
          y: mousePos.y,
        }}
        transition={{ type: 'spring', damping: 30, stiffness: 60 }}
        className="pointer-events-none absolute -top-24 right-0 md:right-[5%] lg:right-[10%] w-[550px] md:w-[750px] lg:w-[950px] h-[550px] md:h-[750px] lg:h-[950px] rounded-full opacity-80 filter blur-[100px] md:blur-[140px] will-change-transform z-0"
        style={{
          background:
            'radial-gradient(circle at 45% 45%, #C4150C 0%, #8A1B0E 35%, #5A0505 60%, transparent 80%)',
        }}
      />

      {/* Secondary Soft Amber/Warm Red Highlight Accent */}
      <div
        className="pointer-events-none absolute top-1/4 right-[-10%] w-[350px] md:w-[500px] h-[350px] md:h-[500px] rounded-full opacity-40 filter blur-[120px] z-0"
        style={{
          background:
            'radial-gradient(circle, #e60026 0%, #5A0505 50%, transparent 75%)',
        }}
      />

      {/* Modern Film Grain / Noise Overlay */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.025] mix-blend-overlay z-0"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
        }}
      />

      {/* ========================================================================= */}
      {/* 1. TOP NAVIGATION BAR                                                     */}
      {/* ========================================================================= */}
      <header className="relative z-10 w-full flex justify-between items-center pb-6">
        <motion.h1
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-4xl sm:text-5xl lg:text-6xl font-semibold tracking-tight text-white font-heading"
        >
          Contact
        </motion.h1>

        <motion.button
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.15 }}
          onClick={handleBack}
          type="button"
          className="text-xs md:text-sm font-semibold tracking-widest text-neutral-400 hover:text-white transition-colors duration-200 uppercase cursor-pointer py-2 px-1 focus:outline-none"
        >
          BACK
        </motion.button>
      </header>

      {/* ========================================================================= */}
      {/* 2. MAIN CONTENT AREA (Two-Column Asymmetric Grid)                         */}
      {/* ========================================================================= */}
      <div className="relative z-10 w-full grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 my-auto py-8 sm:py-10 lg:py-12 items-start">
        {/* ----------------------------------------------------------------------- */}
        {/* LEFT COLUMN: Glassmorphism Message Card & Metadata Rows                 */}
        {/* ----------------------------------------------------------------------- */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="lg:col-span-4 flex flex-col space-y-8 max-w-md w-full"
        >
          {/* Glassmorphism Message Card */}
          <div className="bg-white/[0.03] border border-white/10 rounded-none p-6 sm:p-7 md:p-8 backdrop-blur-md shadow-2xl">
            <h2 className="text-xl sm:text-2xl font-semibold text-white leading-snug tracking-tight font-heading">
              Let&apos;s talk about your project.
            </h2>
            <p className="text-xs sm:text-sm text-neutral-400 leading-relaxed mt-4 font-normal">
              I respond quickly to internship requests, freelance missions and
              collaborations around interactive web experiences.
            </p>
          </div>

          {/* Metadata Key-Value Rows */}
          <div className="flex flex-col border-t border-white/10">
            <div className="border-b border-white/10 py-3.5 flex justify-between items-center text-xs">
              <span className="uppercase tracking-widest text-neutral-500 font-medium">
                BASED IN
              </span>
              <span className="text-neutral-200 font-medium">
                Vannes, France
              </span>
            </div>

            <div className="border-b border-white/10 py-3.5 flex justify-between items-center text-xs">
              <span className="uppercase tracking-widest text-neutral-500 font-medium">
                STATUS
              </span>
              <span className="text-neutral-200 font-medium">
                Student / Freelance
              </span>
            </div>

            <div className="border-b border-white/10 py-3.5 flex justify-between items-center text-xs">
              <span className="uppercase tracking-widest text-neutral-500 font-medium">
                AVG. RESPONSE
              </span>
              <span className="text-white font-semibold">
                48h
              </span>
            </div>
          </div>
        </motion.div>

        {/* ----------------------------------------------------------------------- */}
        {/* RIGHT COLUMN: Eyebrow, Giant Headline, Lead Paragraphs & Sub-Lists      */}
        {/* ----------------------------------------------------------------------- */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className="lg:col-span-8 flex flex-col space-y-8 pl-0 lg:pl-8 xl:pl-12"
        >
          {/* Eyebrow & Giant Headline */}
          <div className="space-y-3">
            <span className="block text-[11px] font-mono tracking-widest text-neutral-400 uppercase">
              CONTACT
            </span>
            <h2 className="text-5xl sm:text-6xl md:text-7xl lg:text-[5.5rem] xl:text-[6.25rem] font-bold tracking-tight text-white leading-[0.95] font-heading">
              Let&apos;s build
              <br />
              together.
            </h2>
          </div>

          {/* Lead Paragraphs */}
          <div className="space-y-4 max-w-2xl">
            <p className="text-base sm:text-lg md:text-xl font-medium text-white leading-normal">
              Creative developer, focused on animation, interaction, and tailor-made
              web experiences.
            </p>
            <p className="text-sm sm:text-base text-neutral-400 leading-relaxed">
              If you have a project in mind, an ambitious idea, I&apos;d be glad to
              discuss it with you and explore a potential collaboration.
            </p>
          </div>

          {/* Sub-Lists Section */}
          <div className="border-t border-white/10 pt-6 mt-6 grid grid-cols-1 sm:grid-cols-2 gap-8 max-w-xl">
            {/* Column 1: SHORTCUTS */}
            <div>
              <h3 className="text-[10px] tracking-widest text-neutral-500 uppercase font-semibold mb-3">
                SHORTCUTS
              </h3>
              <ul className="flex flex-col space-y-2.5 text-sm text-neutral-300">
                <li>
                  <a
                    href="mailto:luke.baffait@yahoo.com"
                    className="inline-block hover:text-white hover:translate-x-1 duration-200 transition-all cursor-pointer"
                  >
                    Direct mail
                  </a>
                </li>
                <li>
                  <a
                    href="https://linkedin.com"
                    target="_blank"
                    rel="noreferrer"
                    className="inline-block hover:text-white hover:translate-x-1 duration-200 transition-all cursor-pointer"
                  >
                    LinkedIn
                  </a>
                </li>
                <li>
                  <a
                    href="https://github.com"
                    target="_blank"
                    rel="noreferrer"
                    className="inline-block hover:text-white hover:translate-x-1 duration-200 transition-all cursor-pointer"
                  >
                    GitHub
                  </a>
                </li>
                <li>
                  <a
                    href="https://behance.net"
                    target="_blank"
                    rel="noreferrer"
                    className="inline-block hover:text-white hover:translate-x-1 duration-200 transition-all cursor-pointer"
                  >
                    Behance
                  </a>
                </li>
              </ul>
            </div>

            {/* Column 2: BRIEF FORMAT */}
            <div>
              <h3 className="text-[10px] tracking-widest text-neutral-500 uppercase font-semibold mb-3">
                BRIEF FORMAT
              </h3>
              <ul className="flex flex-col space-y-2.5 text-sm text-neutral-300">
                <li className="hover:text-neutral-100 transition-colors">
                  Product goal
                </li>
                <li className="hover:text-neutral-100 transition-colors">
                  Target deadline
                </li>
                <li className="hover:text-neutral-100 transition-colors">
                  Tech stack
                </li>
                <li className="hover:text-neutral-100 transition-colors">
                  Expected deliverables
                </li>
              </ul>
            </div>
          </div>
        </motion.div>
      </div>

      {/* ========================================================================= */}
      {/* 3. FOOTER BAR                                                             */}
      {/* ========================================================================= */}
      <footer className="relative z-10 w-full flex justify-between items-center text-xs text-neutral-500 pt-6 border-t border-transparent">
        <a
          href="mailto:luke.baffait@yahoo.com"
          className="font-medium text-neutral-200 hover:text-white hover:underline transition-colors select-text"
        >
          luke.baffait@yahoo.com
        </a>

        <span className="font-mono tracking-widest text-[11px] uppercase text-neutral-500">
          AVAILABLE 2026
        </span>
      </footer>
    </motion.section>
  );
}