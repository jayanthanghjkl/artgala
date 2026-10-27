import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, X } from 'lucide-react';
import TiltCascadeCarousel from '@/components/ui/tilt-cascade-carousel';
import { galleryItems } from '@/data/gallery';

export default function ClosetPage() {
  const navigate = useNavigate();
  const [selectedItem, setSelectedItem] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  const handleSelect = (item, index) => {
    setSelectedItem(item);
  };

  return (
    <div className="relative w-full h-screen bg-black overflow-hidden select-none">
      {/* Minimal Top Header - Clean Back Navigation */}
      <header className="absolute top-0 left-0 right-0 z-30 flex items-center justify-between px-6 py-5 md:px-10 pointer-events-none">
        <button
          onClick={() => navigate('/')}
          className="pointer-events-auto group flex items-center gap-2 px-4 py-2 rounded-full bg-black/50 hover:bg-white/10 backdrop-blur-md border border-white/15 text-white/80 hover:text-white transition-all duration-300 text-xs tracking-wider uppercase font-medium shadow-lg"
          aria-label="Back to home"
        >
          <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
          <span>Back</span>
        </button>
      </header>

      {/* Tilt Cascade Carousel Driven By Scroll & Gestures */}
      <main className="w-full h-full">
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
          color="#f4f1ea"
          background="radial-gradient(ellipse 90% 80% at 50% 25%, #23080f 0%, #0c0205 50%, #000000 100%)"
          fontFamily="'Outfit', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
          defaultIndex={0}
          onIndexChange={(idx) => setCurrentIndex(idx)}
          onSelect={handleSelect}
        />
      </main>

      {/* Detail Modal / Lightbox when a card is selected */}
      {selectedItem && (
        <div
          data-scroll-ignore="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-8 bg-black/85 backdrop-blur-xl animate-in fade-in duration-300"
          onClick={() => setSelectedItem(null)}
        >
          <div
            className="relative w-full max-w-xl bg-zinc-950 border border-white/15 rounded-3xl overflow-hidden shadow-2xl p-6 md:p-8 flex flex-col md:flex-row gap-6 animate-in zoom-in-95 duration-200"
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
            <div className="w-full md:w-1/2 aspect-square rounded-2xl overflow-hidden bg-black/50 border border-white/10 flex-shrink-0">
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
                  <span className="inline-block px-2.5 py-0.5 text-[10px] tracking-wider uppercase font-semibold rounded-full bg-red-600/30 text-red-400 border border-red-500/30">
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
          </div>
        </div>
      )}
    </div>
  );
}
