import React from 'react';
import { Link } from 'react-router-dom';
import TextRoll from '../common/TextRoll';
import StaggeredMenu from './StaggeredMenu';

/**
 * Navbar component.
 * Renders the top navigation bar using Tailwind CSS.
 * - Floating glassmorphic dock anchored when entered.
 * - Staggered text roll hover transitions for links.
 */
export default function Navbar({ mobileMenuOpen, setMobileMenuOpen, isEntered }) {
  return (
    <>
      <header className={`hero-navbar absolute top-0 left-0 w-full z-50 transition-all duration-1000 ease-out ${
        isEntered ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4 pointer-events-none'
      }`}>
        <div className="w-full pt-10 mx-auto px-8 md:px-10 hidden md:flex items-center justify-end"
          style={{ transform: 'scale(1.15)', transformOrigin: 'right center' }}>


          {/* Desktop Navigation Links */}
          <nav className="flex items-center gap-6 py-2.5 opacity-90">
            <Link 
              to="/#about" 
              className="group/link font-body text-xs font-semibold uppercase tracking-[3px] text-pure-white transition-all duration-300"
            >
              <TextRoll text="ABOUT" />
            </Link>
            <Link 
              to="/projects" 
              className="group/link font-body text-xs font-semibold uppercase tracking-[3px] text-pure-white transition-all duration-300"
            >
              <TextRoll text="WORKS" />
            </Link>
            <Link 
              to="/#contact" 
              className="group/link font-body text-xs font-semibold uppercase tracking-[3px] text-pure-white transition-all duration-300"
            >
              <TextRoll text="CONTACT" />
            </Link>
          </nav>
        </div>

        {/* Mobile Menu implementation using StaggeredMenu */}
        <div className="block md:hidden">
          <StaggeredMenu
            position="right"
            items={[
              { label: 'About', ariaLabel: 'Go to about', link: '/#about' },
              { label: 'Works', ariaLabel: 'Go to works', link: '/projects' },
              { label: 'Contact', ariaLabel: 'Go to contact', link: '/#contact' }
            ]}
            socialItems={[
              { label: 'Twitter', link: 'https://twitter.com' },
              { label: 'GitHub', link: 'https://github.com' },
              { label: 'LinkedIn', link: 'https://linkedin.com' }
            ]}
            displaySocials={true}
            displayItemNumbering={true}
            menuButtonColor="#fff"
            openMenuButtonColor="#000"
            changeMenuColorOnOpen={true}
            colors={['#e60026', '#ff4d4d']}
            accentColor="#e60026"
            isFixed={true}
          />
        </div>
      </header>
    </>
  );
}
