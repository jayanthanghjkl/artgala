import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Compass, Eye, Sparkles } from 'lucide-react';

/**
 * 404 NotFoundPage Component
 * Displays a cinematic error room when a requested exhibition route does not exist.
 */
export default function NotFoundPage() {
  const location = useLocation();
  const navigate = useNavigate();

  const handleGoBack = () => {
    if (window.history.length > 1) {
      navigate(-1);
    } else {
      navigate('/');
    }
  };

  return (
    <motion.section
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className="relative w-full min-h-screen bg-[#070707] text-[#F4F1EA] flex flex-col justify-between px-6 sm:px-12 md:px-16 py-8 sm:py-12 overflow-hidden selection:bg-[#e60026] selection:text-white"
    >
      {/* Background Ambience & Red Radial Lighting */}
      <div 
        className="pointer-events-none absolute inset-0 z-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_20%,rgba(230,0,38,0.22),transparent_75%)]" 
        aria-hidden="true" 
      />
      <div 
        className="pointer-events-none absolute bottom-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-96 bg-[radial-gradient(ellipse_at_bottom,rgba(138,13,23,0.25),transparent_70%)]" 
        aria-hidden="true" 
      />

      {/* Subtle Noise Texture Overlay */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.035] mix-blend-overlay z-0"
        aria-hidden="true"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
        }}
      />

      {/* Top Header Bar */}
      <header className="relative z-10 w-full flex items-center justify-between border-b border-white/10 pb-6">
        <Link 
          to="/" 
          className="flex items-center gap-2 group transition-opacity hover:opacity-80"
          aria-label="Art Gala Home"
        >
          <span className="w-2.5 h-2.5 rounded-full bg-[#e60026] shadow-[0_0_10px_#e60026]" />
          <span className="font-heading text-sm sm:text-base tracking-[0.25em] uppercase font-bold text-white">
            Art Gala
          </span>
        </Link>

        <div className="flex items-center gap-2 font-mono text-[11px] sm:text-xs text-zinc-400 bg-white/[0.04] px-3.5 py-1.5 rounded-full border border-white/10">
          <span className="text-[#ff2b4c]">STATUS</span>
          <span className="text-zinc-600">//</span>
          <span>404_ROOM_UNDEFINED</span>
        </div>
      </header>

      {/* Main 404 Presentation */}
      <main className="relative z-10 w-full max-w-3xl mx-auto my-auto py-12 flex flex-col items-center text-center">
        {/* Eyebrow Label */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.03] border border-white/10 text-xs font-mono uppercase tracking-[0.3em] text-[#ff2b4c] mb-4"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>Spatial Anomaly Detected</span>
        </motion.div>

        {/* Dramatic 404 Headline */}
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="relative select-none my-2"
        >
          <span className="absolute -inset-4 bg-[#e60026]/15 blur-3xl rounded-full pointer-events-none" />
          <h1 className="relative font-heading text-8xl sm:text-9xl md:text-[12rem] font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-white via-zinc-200 to-zinc-600 leading-none drop-shadow-2xl">
            404
          </h1>
        </motion.div>

        {/* Subtitle */}
        <motion.h2
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="font-heading text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-white mb-4"
        >
          This Exhibition Room Does Not Exist
        </motion.h2>

        {/* Narrative Description */}
        <motion.p
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="font-body text-sm sm:text-base text-zinc-400 max-w-xl leading-relaxed mb-8"
        >
          You have ventured past the mapped corridors of Art Gala. The gallery chamber, artwork installation, or link you navigated to might have been curated under a different title or lost in the digital void.
        </motion.p>

        {/* Diagnostic Path Readout */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.45 }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-black/60 border border-white/10 font-mono text-xs text-zinc-400 mb-8 max-w-md truncate"
        >
          <span className="text-zinc-500">Unmapped Path:</span>
          <code className="text-[#ff2b4c] font-semibold">{location.pathname}</code>
        </motion.div>

        {/* Primary Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="flex flex-wrap items-center justify-center gap-4 w-full"
        >
          <Link
            to="/"
            className="group inline-flex items-center gap-2.5 px-6 py-3.5 rounded-full bg-gradient-to-r from-[#e60026] to-[#8a0d17] hover:from-[#ff1744] hover:to-[#e60026] text-white font-heading text-xs sm:text-sm font-semibold tracking-wider uppercase transition-all duration-300 shadow-[0_4px_25px_rgba(230,0,38,0.4)] hover:shadow-[0_4px_35px_rgba(230,0,38,0.65)] hover:scale-105 active:scale-95 cursor-pointer"
          >
            <Compass className="w-4 h-4 group-hover:rotate-45 transition-transform duration-300" />
            <span>Return to Main Floor</span>
          </Link>

          <Link
            to="/work"
            className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full bg-white/[0.04] hover:bg-white/[0.08] border border-white/15 hover:border-white/30 text-white font-heading text-xs sm:text-sm font-semibold tracking-wider uppercase transition-all duration-300 hover:scale-105 active:scale-95 cursor-pointer backdrop-blur-sm"
          >
            <Eye className="w-4 h-4 text-zinc-400" />
            <span>Explore Works</span>
          </Link>

          <button
            onClick={handleGoBack}
            type="button"
            className="inline-flex items-center gap-2 px-5 py-3.5 rounded-full text-zinc-400 hover:text-white font-heading text-xs sm:text-sm font-semibold tracking-wider uppercase transition-colors duration-200 cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Go Back</span>
          </button>
        </motion.div>

        {/* Curated Directory Shortcuts */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="mt-12 pt-8 border-t border-white/10 w-full max-w-lg flex flex-wrap justify-center gap-x-6 gap-y-2 text-xs font-mono uppercase tracking-wider text-zinc-500"
        >
          <span className="text-zinc-600">Quick Directory:</span>
          <Link to="/" className="hover:text-white transition-colors">Home</Link>
          <Link to="/work" className="hover:text-white transition-colors">Work</Link>
          <Link to="/info" className="hover:text-white transition-colors">Info</Link>
          <Link to="/skills" className="hover:text-white transition-colors">Skills</Link>
          <Link to="/closet" className="hover:text-white transition-colors">Closet</Link>
          <Link to="/contact" className="hover:text-white transition-colors">Contact</Link>
        </motion.div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 w-full flex flex-col sm:flex-row items-center justify-between border-t border-white/10 pt-6 text-[11px] font-mono text-zinc-500 gap-2">
        <span>© 2026 Art Gala · All Rights Reserved</span>
        <span>ERROR_CODE: HTTP_404_NOT_FOUND</span>
      </footer>
    </motion.section>
  );
}
