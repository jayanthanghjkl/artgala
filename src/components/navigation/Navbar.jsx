import React from 'react';

/**
 * Navbar component.
 * Renders the top navigation bar using Tailwind CSS.
 * - Desktop: Pure black background, right-aligned uppercase sans-serif links (ABOUT, PROJECT, CONTACT).
 * - Mobile: Minimal "Menu" button in the upper-right corner that toggles a full-screen navigation drawer.
 */
export default function Navbar({ mobileMenuOpen, setMobileMenuOpen }) {
  return (
    <>
      <header className=" absolute top-0 left-0 w-full z-50 mix-blend-difference">
        <div className="w-full max-w-screen pt-10 mx-auto px-8 md:px-12 py-6 flex items-center justify-between">
          {/* Brand/Signature Logo (Optional, styled minimally to fit Swiss grid) */}
          <a href="#" className="font-heading text-lg font-bold tracking-[3px] text-pure-white hover:text-vivid-crimson transition-colors">

          </a>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-12">
            <a 
              href="#about" 
              className="font-body text-xs font-medium uppercase tracking-[3px] text-pure-white hover:text-vivid-crimson transition-all duration-300"
            >
              ABOUT
            </a>
            <a 
              href="#projects" 
              className="font-body text-xs font-medium uppercase tracking-[3px] text-pure-white hover:text-vivid-crimson transition-all duration-300"
            >
              PROJECT
            </a>
            <a 
              href="#contact" 
              className="font-body text-xs font-medium uppercase tracking-[3px] text-pure-white hover:text-vivid-crimson transition-all duration-300"
            >
              CONTACT
            </a>
          </nav>

          {/* Mobile "Menu" text-based toggle button */}
          <button
            onClick={() => setMobileMenuOpen(true)}
            className="block md:hidden font-body text-xs font-medium uppercase tracking-[3px] text-pure-white hover:text-vivid-crimson transition-colors focus:outline-none cursor-pointer"
            aria-label="Open navigation menu"
          >
            Menu
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
          className="absolute top-6 right-8 font-body text-xs font-medium uppercase tracking-[3px] text-pure-white hover:text-vivid-crimson transition-colors focus:outline-none cursor-pointer"
          aria-label="Close navigation menu"
        >
          Close
        </button>

        {/* Stacked Vertical Menu Links */}
        <nav className="relative z-10 flex flex-col items-center gap-10">
          <a 
            href="#about" 
            onClick={() => setMobileMenuOpen(false)}
            className="font-heading text-4xl font-extrabold uppercase tracking-[6px] text-pure-white hover:text-vivid-crimson hover:scale-105 transition-all duration-300"
          >
            ABOUT
          </a>
          <a 
            href="#projects" 
            onClick={() => setMobileMenuOpen(false)}
            className="font-heading text-4xl font-extrabold uppercase tracking-[6px] text-pure-white hover:text-vivid-crimson hover:scale-105 transition-all duration-300"
          >
            PROJECT
          </a>
          <a 
            href="#contact" 
            onClick={() => setMobileMenuOpen(false)}
            className="font-heading text-4xl font-extrabold uppercase tracking-[6px] text-pure-white hover:text-vivid-crimson hover:scale-105 transition-all duration-300"
          >
            CONTACT
          </a>
        </nav>
      </div>
    </>
  );
}
