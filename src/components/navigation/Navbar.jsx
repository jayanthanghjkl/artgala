import React from 'react';
import TextRoll from '../common/TextRoll';

/**
 * Navbar component.
 * Renders the top navigation bar using Tailwind CSS.
 * - Floating glassmorphic dock anchored when entered.
 * - Staggered text roll hover transitions for links.
 */
export default function Navbar({ mobileMenuOpen, setMobileMenuOpen, isEntered }) {
  return (
    <>
      <header className={`absolute top-0 left-0 w-full z-50 transition-all duration-1000 ease-out ${
        isEntered ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4 pointer-events-none'
      }`}>
        <div className="w-full pt-8 mx-auto px-8 md:px-12 flex items-center justify-end"
          style={{ transform: 'scale(1.15)', transformOrigin: 'right center' }}>


          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-10 py-2.5">
            <a 
              href="#about" 
              className="group/link font-body text-[10px] font-semibold uppercase tracking-[3px] text-pure-white transition-all duration-300"
            >
              <TextRoll text="ABOUT" />
            </a>
            <a 
              href="#skills" 
              className="group/link font-body text-[10px] font-semibold uppercase tracking-[3px] text-pure-white transition-all duration-300"
            >
              <TextRoll text="SKILLS" />
            </a>
            <a 
              href="#projects" 
              className="group/link font-body text-[10px] font-semibold uppercase tracking-[3px] text-pure-white transition-all duration-300"
            >
              <TextRoll text="PROJECTS" />
            </a>
            <a 
              href="#contact" 
              className="group/link font-body text-[10px] font-semibold uppercase tracking-[3px] text-pure-white transition-all duration-300"
            >
              <TextRoll text="CONTACT" />
            </a>
          </nav>

          {/* Mobile "Menu" text-based toggle button */}
          <button
            onClick={() => setMobileMenuOpen(true)}
            className="group/link block md:hidden font-body text-[10px] font-semibold uppercase tracking-[3px] text-pure-white focus:outline-none cursor-pointer"
            aria-label="Open navigation menu"
          >
            <TextRoll text="MENU" />
          </button>
        </div>
      </header>

      {/* Mobile Full-Screen Navigation Drawer */}
      <div 
        className={`fixed inset-0 w-full h-full bg-pure-black/95 backdrop-blur-md z-[100] transition-all duration-500 flex flex-col justify-center items-center ${
          mobileMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
      >
        {/* Subtle radial glow background behind links */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] bg-vivid-crimson/10 rounded-full blur-[80px] pointer-events-none"></div>

        {/* Close Button */}
        <button
          onClick={() => setMobileMenuOpen(false)}
          className="group/link absolute top-8 right-8 font-body text-[10px] font-semibold uppercase tracking-[3px] text-pure-white focus:outline-none cursor-pointer"
          aria-label="Close navigation menu"
        >
          <TextRoll text="CLOSE" />
        </button>

        {/* Stacked Vertical Menu Links */}
        <nav className="relative z-10 flex flex-col items-center gap-8">
          <a 
            href="#about" 
            onClick={() => setMobileMenuOpen(false)}
            className="group/link font-heading text-4xl font-extrabold uppercase tracking-[6px] text-pure-white hover:scale-105 transition-all duration-300"
          >
            <TextRoll text="ABOUT" />
          </a>
          <a 
            href="#skills" 
            onClick={() => setMobileMenuOpen(false)}
            className="group/link font-heading text-4xl font-extrabold uppercase tracking-[6px] text-pure-white hover:scale-105 transition-all duration-300"
          >
            <TextRoll text="SKILLS" />
          </a>
          <a 
            href="#projects" 
            onClick={() => setMobileMenuOpen(false)}
            className="group/link font-heading text-4xl font-extrabold uppercase tracking-[6px] text-pure-white hover:scale-105 transition-all duration-300"
          >
            <TextRoll text="PROJECTS" />
          </a>
          <a 
            href="#contact" 
            onClick={() => setMobileMenuOpen(false)}
            className="group/link font-heading text-4xl font-extrabold uppercase tracking-[6px] text-pure-white hover:scale-105 transition-all duration-300"
          >
            <TextRoll text="CONTACT" />
          </a>
        </nav>
      </div>
    </>
  );
}
