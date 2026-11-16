import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import TiltCascadeCarousel from '@/components/ui/tilt-cascade-carousel';
import { galleryItems } from '@/data/gallery';
import TextRoll from '@/components/common/TextRoll';

export default function ClosetPage() {
  const navigate = useNavigate();
  const [selectedItem, setSelectedItem] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  const handleSelect = (item, index) => {
    setSelectedItem(item);
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 80 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -80 }}
      transition={{ duration: 0.85, ease: [0.16, 1, 0.3, 1] }}
      data-lenis-prevent="true"
      className="relative w-full h-screen bg-black overflow-hidden select-none"
    >
      {/* Moving Ambient Curtain / Door Glow Transition */}
      <motion.div
        initial={{ opacity: 0, scale: 1.25, x: 100 }}
        animate={{ opacity: 1, scale: 1, x: 0 }}
        exit={{ opacity: 0, scale: 0.9, x: -100 }}
        transition={{ duration: 0.95, ease: [0.16, 1, 0.3, 1] }}
        className="absolute inset-0 pointer-events-none z-[1]"
        style={{
          background: 'radial-gradient(ellipse 90% 80% at 50% 25%, var(--color-dark-burgundy-start) 0%, var(--color-dark-burgundy-end) 50%, var(--color-pure-black) 100%)'
        }}
      />

      {/* Minimal Top Header - Clean Back Navigation on Right Top with slide-in */}
      <motion.header
        initial={{ opacity: 0, y: -25, x: 25 }}
        animate={{ opacity: 1, y: 0, x: 0 }}
        transition={{ duration: 0.6, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
        className="absolute top-0 left-0 right-0 z-30 flex items-center justify-end px-6 py-5 md:px-10 pointer-events-none"
      >
        <button
          onClick={() => navigate('/')}
          className="pointer-events-auto flex items-center gap-2 text-zinc-300 hover:text-white transition-colors duration-300 font-heading text-xs sm:text-sm font-bold tracking-widest uppercase group/link bg-black/60 hover:bg-black/90 px-4 sm:px-5 py-2 sm:py-2.5 rounded-full backdrop-blur-md shadow-lg"
          aria-label="Go back"
        >
          <TextRoll text="BACK" />
        </button>
      </motion.header>

      {/* Tilt Cascade Carousel Driven By Scroll & Gestures - Moving cascade slide animation */}
      <motion.main
        initial={{ opacity: 0, x: 90, y: 25, scale: 0.94 }}
        animate={{ opacity: 1, x: 0, y: 0, scale: 1 }}
        exit={{ opacity: 0, x: -90, y: -20, scale: 0.95 }}
        transition={{ duration: 0.9, delay: 0.05, ease: [0.16, 1, 0.3, 1] }}
        className="w-full h-full relative z-[2]"
      >
        <TiltCascadeCarousel
          items={galleryItems}
          height="100vh"
          slideSize="clamp(220px, 45vmin, 380px)"
          angle={26}
          drop={0.42}
          inactiveScale={0.62}
          radius={20}
          bounce={0.22}
          duration={0.75}
          loop={true}
          autoplay={0}
          titles={true}
          captions={true}
          controls={true}
          introAnimation={true}
          color="#f4f1ea"
          background="transparent"
          fontFamily="'Outfit', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
          defaultIndex={0}
          onIndexChange={(idx) => setCurrentIndex(idx)}
          onSelect={handleSelect}
        />
      </motion.main>

      {/* Subtle bottom scroll hint */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 0.6, y: 0 }}
        transition={{ delay: 0.9, duration: 0.8 }}
        className="absolute bottom-5 left-6 md:left-10 z-20 pointer-events-none hidden sm:flex items-center gap-2 text-[10px] uppercase tracking-widest text-white/50"
      >
        <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-crimson-bright)] animate-pulse" />
        <span>Scroll or drag to explore</span>
      </motion.div>

      {/* Detail Modal / Lightbox when a card is selected */}
      <AnimatePresence>
        {selectedItem && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            data-scroll-ignore="true"
            className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-8 bg-black/85 backdrop-blur-xl"
            onClick={() => setSelectedItem(null)}
          >
            <motion.div
              initial={{ scale: 0.92, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.92, opacity: 0, y: 20 }}
              transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
              className="relative w-full max-w-xl bg-zinc-950 border border-white/15 rounded-none overflow-hidden shadow-2xl p-6 md:p-8 flex flex-col md:flex-row gap-6"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close Button */}
              <button
                onClick={() => setSelectedItem(null)}
                className="absolute top-4 right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white/80 hover:text-white transition-colors z-10"
                aria-label="Close details"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Image Preview */}
              <div className="w-full md:w-1/2 aspect-square rounded-none overflow-hidden bg-black/50 border border-white/10 flex-shrink-0">
                <img
                  src={selectedItem.src}
                  alt={selectedItem.alt ?? selectedItem.title}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Details Content */}
              <div className="flex flex-col justify-between flex-grow">
                <div className="space-y-3">
                  {selectedItem.category && (
                    <span className="inline-block px-2.5 py-0.5 text-[10px] tracking-wider uppercase font-semibold rounded-full bg-[var(--color-crimson-deep)]/40 text-[var(--color-crimson-bright)] border border-[var(--color-vivid-crimson)]/40">
                      {selectedItem.category}
                    </span>
                  )}

                  <h2 className="text-2xl font-bold tracking-tight text-white">
                    {selectedItem.title}
                  </h2>

                  <p className="text-sm text-zinc-300 leading-relaxed">
                    {selectedItem.caption}
                  </p>
                </div>

                <div className="pt-6 mt-6 border-t border-white/10 flex items-center justify-between">
                  <span className="text-xs text-zinc-500 font-mono">
                    {currentIndex + 1} / {galleryItems.length}
                  </span>

                  <button
                    onClick={() => setSelectedItem(null)}
                    className="px-4 py-2 rounded-full bg-white/10 hover:bg-white/20 text-white text-xs font-medium transition-colors"
                  >
                    Close
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
