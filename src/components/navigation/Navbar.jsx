import React from 'react';
import StaggeredMenu from './StaggeredMenu';
import { THEME_COLORS } from '../../lib/colors';

/**
 * Navbar component with StaggeredMenu.
 */
export default function Navbar({ mobileMenuOpen, setMobileMenuOpen, isEntered }) {
  const menuItems = [
    { label: 'Work', ariaLabel: 'Go to work', link: '/work' },
    { label: 'Info', ariaLabel: 'Go to info / about', link: '/info' },
    { label: 'Contact', ariaLabel: 'Go to contact', link: '/contact' }
  ];

  const socialItems = [
    { label: 'GitHub', link: 'https://github.com/jayanthanghjkl' },
    { label: 'LinkedIn', link: 'https://www.linkedin.com' },
    { label: 'Twitter', link: 'https://twitter.com' }
  ];

  return (
    <header
      className={`hero-navbar absolute top-0 left-0 w-full h-full z-50 transition-all duration-1000 ease-out pointer-events-none ${isEntered ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'
        }`}
    >
      <StaggeredMenu
        position="right"
        items={menuItems}
        socialItems={socialItems}
        displaySocials={true}
        displayItemNumbering={true}
        menuButtonColor={THEME_COLORS.pureWhite}
        openMenuButtonColor={THEME_COLORS.pureBlack}
        changeMenuColorOnOpen={true}
        colors={[
          THEME_COLORS.crimsonWineDark,
          THEME_COLORS.crimsonWineDeep,
          THEME_COLORS.crimsonRuby,
          THEME_COLORS.vividCrimson,
        ]}
        accentColor={THEME_COLORS.vividCrimson}
        logoUrl=""
        isFixed={false}
      />
    </header>
  );
}
