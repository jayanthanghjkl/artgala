import { useState, useEffect } from 'react';
import { Monitor, Smartphone, Copy, Check, AlertCircle } from 'lucide-react';

/**
 * MobileBlocker Component
 * Appears exclusively on mobile screens (< 768px) to inform visitors
 * that the 3D WebGL exhibition is not applicable on mobile devices.
 */
export default function MobileBlocker() {
  const [copied, setCopied] = useState(false);
  const [dimensions, setDimensions] = useState({
    width: typeof window !== 'undefined' ? window.innerWidth : 0,
    height: typeof window !== 'undefined' ? window.innerHeight : 0,
  });

  useEffect(() => {
    const handleResize = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      setDimensions({ width: w, height: h });

      if (w < 768) {
        document.body.style.overflow = 'hidden';
      } else {
        document.body.style.overflow = '';
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
      document.body.style.overflow = '';
    };
  }, []);

  const handleCopyLink = () => {
    const url = window.location.origin || window.location.href;
    navigator.clipboard.writeText(url).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }).catch(() => {
      // Fallback
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    });
  };

  return (
    <aside
      role="alert"
      aria-label="Application not applicable on mobile screens"
      className="fixed inset-0 z-[99999999] md:hidden w-screen h-screen h-dvh bg-[#070707] text-[#F4F1EA] flex flex-col justify-between p-6 sm:p-8 overflow-y-auto selection:bg-[#e60026] selection:text-white"
    >
      {/* Background Ambience & Red Glow */}
      <div 
        className="pointer-events-none absolute inset-0 z-0 bg-[radial-gradient(ellipse_75%_55%_at_50%_0%,rgba(230,0,38,0.22),transparent_75%)]" 
        aria-hidden="true" 
      />
      
      {/* Subtle Noise Texture */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.035] mix-blend-overlay z-0"
        aria-hidden="true"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
        }}
      />

      {/* Top Header */}
      <header className="relative z-10 w-full flex items-center justify-between border-b border-white/10 pb-4">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#e60026] shadow-[0_0_8px_#e60026] animate-pulse" />
          <span className="font-heading text-xs tracking-[0.25em] uppercase text-zinc-300 font-semibold">
            Art Gala
          </span>
        </div>
        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/[0.04] border border-white/10 text-[10px] tracking-wider uppercase text-zinc-400 font-mono">
          <AlertCircle className="w-3 h-3 text-[#ff1744]" />
          <span>Desktop Only</span>
        </div>
      </header>

      {/* Center Body & Notice */}
      <main className="relative z-10 w-full max-w-md mx-auto my-auto py-8 flex flex-col items-center text-center">
        {/* Device Comparison Visual */}
        <div className="relative mb-6 flex items-center justify-center">
          <div className="absolute inset-0 bg-[#e60026]/20 blur-2xl rounded-full" />
          <div className="relative flex items-center gap-3 p-4 rounded-2xl bg-white/[0.03] border border-white/10 backdrop-blur-md shadow-2xl">
            <div className="relative p-3 rounded-xl bg-black/60 border border-white/10 text-zinc-500">
              <Smartphone className="w-7 h-7" />
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-[#e60026] text-white text-[10px] flex items-center justify-center font-bold">
                ✕
              </span>
            </div>
            <div className="h-0.5 w-6 bg-gradient-to-r from-zinc-700 to-[#e60026]" />
            <div className="p-3 rounded-xl bg-[#e60026]/15 border border-[#e60026]/40 text-[#ff2b4c] shadow-[0_0_15px_rgba(230,0,38,0.3)]">
              <Monitor className="w-7 h-7" />
            </div>
          </div>
        </div>

        {/* Eyebrow */}
        <span className="font-mono text-[10px] sm:text-xs tracking-[0.3em] uppercase text-[#ff2b4c] mb-2 font-semibold">
          [ Code 412 // Screen Incompatible ]
        </span>

        {/* Title */}
        <h1 className="font-heading text-2xl sm:text-3xl font-bold tracking-tight text-white mb-3 leading-snug">
          Application Not Applicable on Mobile Screens
        </h1>

        {/* Description */}
        <p className="font-body text-xs sm:text-sm text-zinc-400 leading-relaxed mb-6 max-w-sm">
          Art Gala is an experimental 3D audiovisual exhibition powered by spatial WebGL canvases, real-time shaders, and inertial scroll interactions engineered exclusively for desktop and widescreen viewports.
        </p>

        {/* Telemetry / Viewport Diagnostics Card */}
        <div className="w-full bg-black/50 border border-white/10 rounded-xl p-3.5 mb-6 text-left font-mono text-[11px] text-zinc-400 space-y-1.5 shadow-inner">
          <div className="flex justify-between items-center">
            <span className="text-zinc-500">Current Viewport:</span>
            <span className="text-zinc-300 font-semibold">{dimensions.width}px × {dimensions.height}px</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-zinc-500">Required Viewport:</span>
            <span className="text-[#ff1744] font-semibold">≥ 768px (Desktop / Laptop)</span>
          </div>
          <div className="flex justify-between items-center pt-1 border-t border-white/5">
            <span className="text-zinc-500">Status:</span>
            <span className="text-amber-400">Restricted on Mobile Devices</span>
          </div>
        </div>

        {/* Copy Link Action Button */}
        <button
          onClick={handleCopyLink}
          type="button"
          className="group relative w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-[#e60026] to-[#8a0d17] hover:from-[#ff1744] hover:to-[#e60026] text-white font-heading text-xs tracking-wider uppercase font-semibold transition-all duration-300 shadow-[0_4px_20px_rgba(230,0,38,0.35)] hover:shadow-[0_4px_30px_rgba(230,0,38,0.6)] cursor-pointer active:scale-95"
        >
          {copied ? (
            <>
              <Check className="w-4 h-4 text-white" />
              <span>Link Copied to Clipboard</span>
            </>
          ) : (
            <>
              <Copy className="w-4 h-4 text-white group-hover:scale-110 transition-transform" />
              <span>Copy Link for Desktop</span>
            </>
          )}
        </button>
        <span className="text-[10px] text-zinc-500 mt-2">
          Paste on your desktop browser to explore the full exhibition
        </span>
      </main>

      {/* Footer */}
      <footer className="relative z-10 w-full text-center border-t border-white/10 pt-4">
        <p className="font-mono text-[10px] tracking-wider uppercase text-zinc-600">
          Curated for Widescreen Displays · Art Gala © 2026
        </p>
      </footer>
    </aside>
  );
}
