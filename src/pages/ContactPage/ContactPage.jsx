import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import GhostFibers from '../../components/ui/GhostFibers';
import { THEME_COLORS } from '../../lib/colors';

export default function ContactPage({ isEmbedded = false }) {
  const navigate = useNavigate();

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
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
      className={`fixed inset-0 w-screen h-screen h-dvh bg-obsidian-black text-white flex flex-col justify-between px-6 sm:px-10 md:px-14 lg:px-16 py-4 sm:py-6 lg:py-8 select-none overflow-hidden font-sans antialiased ${
        isEmbedded ? 'z-20' : 'z-[100]'
      }`}
    >
      {/* ========================================================================= */}
      {/* INTERACTIVE GHOST FIBERS BACKGROUND (Linked to Index.css Palette)          */}
      {/* ========================================================================= */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-auto">
        <GhostFibers
          glowColor={THEME_COLORS.vividCrimson}
          lineColor={THEME_COLORS.crimsonBright}
          secondaryColor={THEME_COLORS.crimsonDeep}
          layers={3}
          twist={1.2}
          threads={76}
          fiberStyle="dots"
          depthOfField={0.85}
          hoverEffect="focus"
          intro={true}
          mouseInteraction={true}
          vignette={0.4}
          glow={0.95}
          brightness={1.15}
          sparkle={0.5}
        />
        {/* Cinematic gradient wash to guarantee high contrast and legible typography */}
        <div className="absolute inset-0 bg-gradient-to-b from-obsidian-black/60 via-transparent to-obsidian-black/80 pointer-events-none" />
      </div>

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
      <header className="relative z-10 w-full flex justify-between items-center pb-2 sm:pb-4 shrink-0">
        <motion.h1
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-2xl sm:text-3xl lg:text-4xl font-semibold tracking-tight text-white font-heading"
        >
          Contact
        </motion.h1>

        <motion.button
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.15 }}
          onClick={handleBack}
          type="button"
          className="text-xs md:text-sm font-semibold tracking-widest text-neutral-400 hover:text-white transition-colors duration-200 uppercase cursor-pointer py-1.5 px-3 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 focus:outline-none"
        >
          BACK
        </motion.button>
      </header>

      {/* ========================================================================= */}
      {/* 2. MAIN CONTENT AREA (Fitted Screen Layout)                               */}
      {/* ========================================================================= */}
      <div className="relative z-10 w-full grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-12 my-auto items-center flex-1 min-h-0">
        {/* ----------------------------------------------------------------------- */}
        {/* LEFT COLUMN: Glassmorphism Message Card & Metadata Rows                 */}
        {/* ----------------------------------------------------------------------- */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="lg:col-span-4 flex flex-col space-y-4 sm:space-y-6 max-w-md w-full"
        >
          {/* Glassmorphism Message Card */}
          <div className="bg-white/[0.03] border border-white/10 rounded-xl p-5 sm:p-6 backdrop-blur-md shadow-2xl">
            <h2 className="text-lg sm:text-xl font-semibold text-white leading-snug tracking-tight font-heading">
              Let&apos;s talk about your project.
            </h2>
            <p className="text-xs sm:text-sm text-neutral-400 leading-relaxed mt-2.5 font-normal">
              I respond quickly to internship requests, freelance missions and
              collaborations around interactive web experiences.
            </p>
          </div>

          {/* Metadata Key-Value Rows */}
          <div className="flex flex-col border-t border-white/10">
            <div className="border-b border-white/10 py-2.5 sm:py-3 flex justify-between items-center text-xs">
              <span className="uppercase tracking-widest text-neutral-500 font-medium">
                BASED IN
              </span>
              <span className="text-neutral-200 font-medium">
                Chennai, India
              </span>
            </div>

            <div className="border-b border-white/10 py-2.5 sm:py-3 flex justify-between items-center text-xs">
              <span className="uppercase tracking-widest text-neutral-500 font-medium">
                STATUS
              </span>
              <span className="text-neutral-200 font-medium">
                Student / Freelance
              </span>
            </div>

            <div className="border-b border-white/10 py-2.5 sm:py-3 flex justify-between items-center text-xs">
              <span className="uppercase tracking-widest text-neutral-500 font-medium">
                AVG. RESPONSE
              </span>
              <span className="text-crimson-bright font-semibold">
                48h
              </span>
            </div>
          </div>
        </motion.div>

        {/* ----------------------------------------------------------------------- */}
        {/* RIGHT COLUMN: Eyebrow, Giant Headline, Lead Paragraphs & Sub-Lists      */}
        {/* ----------------------------------------------------------------------- */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className="lg:col-span-8 flex flex-col justify-center space-y-4 sm:space-y-6 pl-0 lg:pl-6 xl:pl-10"
        >
          {/* Eyebrow & Giant Headline */}
          <div className="space-y-2">
            <span className="block text-[10px] sm:text-[11px] font-mono tracking-widest text-crimson-bright uppercase">
              CONTACT
            </span>
            <h2 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight text-white leading-[0.95] font-heading">
              Let&apos;s build
              <br />
              together.
            </h2>
          </div>

          {/* Lead Paragraphs */}
          <div className="space-y-2 sm:space-y-3 max-w-xl">
            <p className="text-sm sm:text-base md:text-lg font-medium text-white leading-normal">
              Creative developer, focused on animation, interaction, and tailor-made
              web experiences.
            </p>
            <p className="text-xs sm:text-sm text-neutral-400 leading-relaxed">
              If you have a project in mind, an ambitious idea, I&apos;d be glad to
              discuss it with you and explore a potential collaboration.
            </p>
          </div>

          {/* Sub-Lists Section */}
          <div className="border-t border-white/10 pt-4 mt-2 sm:mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-8 max-w-xl">
            {/* Column 1: SHORTCUTS */}
            <div>
              <h3 className="text-[10px] tracking-widest text-neutral-500 uppercase font-semibold mb-2 sm:mb-2.5">
                SHORTCUTS
              </h3>
              <ul className="flex flex-col space-y-2 text-xs sm:text-sm text-neutral-300">
                <li>
                  <a
                    href="mailto:jayanthan@example.com"
                    className="inline-block hover:text-crimson-bright hover:translate-x-1 duration-200 transition-all cursor-pointer"
                  >
                    Direct mail
                  </a>
                </li>
                <li>
                  <a
                    href="https://linkedin.com"
                    target="_blank"
                    rel="noreferrer"
                    className="inline-block hover:text-crimson-bright hover:translate-x-1 duration-200 transition-all cursor-pointer"
                  >
                    LinkedIn
                  </a>
                </li>
                <li>
                  <a
                    href="https://github.com/jayanthanghjkl"
                    target="_blank"
                    rel="noreferrer"
                    className="inline-block hover:text-crimson-bright hover:translate-x-1 duration-200 transition-all cursor-pointer"
                  >
                    GitHub
                  </a>
                </li>
              </ul>
            </div>

            {/* Column 2: BRIEF FORMAT */}
            <div>
              <h3 className="text-[10px] tracking-widest text-neutral-500 uppercase font-semibold mb-2 sm:mb-2.5">
                BRIEF FORMAT
              </h3>
              <ul className="flex flex-col space-y-1.5 sm:space-y-2 text-xs sm:text-sm text-neutral-300">
                <li className="hover:text-neutral-100 transition-colors">
                  Product goal
                </li>
                <li className="hover:text-neutral-100 transition-colors">
                  Target deadline
                </li>
                <li className="hover:text-neutral-100 transition-colors">
                  Tech stack & deliverables
                </li>
              </ul>
            </div>
          </div>
        </motion.div>
      </div>

      {/* ========================================================================= */}
      {/* 3. FOOTER BAR                                                             */}
      {/* ========================================================================= */}
      <footer className="relative z-10 w-full flex justify-between items-center text-xs text-neutral-500 pt-2 sm:pt-4 border-t border-transparent shrink-0">
        <a
          href="mailto:jayanthan@example.com"
          className="font-medium text-neutral-300 hover:text-crimson-bright hover:underline transition-colors select-text"
        >
          Jayanthan
        </a>

        <span className="font-mono tracking-widest text-[10px] sm:text-[11px] uppercase text-neutral-500">
          AVAILABLE 2028
        </span>
      </footer>
    </motion.section>
  );
}
