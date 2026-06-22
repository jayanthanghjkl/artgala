import React from 'react';

/**
 * Footer component.
 * Renders the responsive footer using Tailwind CSS v4.
 * - Desktop: Light gray background, left copyright, right-aligned bold stacked links.
 * - Mobile: Light gray background, left dense legal text, right-aligned simple black links.
 */
export default function Footer() {
  return (
    <footer className="w-full ">

      {/* DESKTOP FOOTER */}
      <div className="hidden md:block text-pure-black py-6 px-12 lg:px-24">
        <div className="max-w-[1400px] mx-auto flex justify-between items-start">
          
          {/* Left copyright & slogan */}
          <div className="max-w-[450px]">
            <p className="font-body text-xs text-zinc-500 leading-relaxed tracking-wide">
              copyright 2026 Jayanthan S Building the future through code design and innovation
            </p>
          </div>

          {/* Right stacked bold links */}
          <div className="flex flex-col items-end gap-2"> 
            <a 
              href="https://github.com/jayanthanghjkl" 
              target="_blank" 
              rel="noopener noreferrer"
              className="font-heading font-bold text-sm text-white hover:text-vivid-crimson transition-colors"
            >
              Github
            </a>
            <a 
              href="https://www.linkedin.com/in/jayanthan-s-724b64325" 
              target="_blank" 
              rel="noopener noreferrer"
              className="font-heading font-bold text-sm text-white hover:text-vivid-crimson transition-colors"
            >
              Linkedin
            </a>
            <a 
              href="mailto:jayanthansathiyapal@gmail.com"
              className="font-heading font-bold text-sm text-white hover:text-vivid-crimson transition-colors"
            >
              Gmail
            </a>
          </div>

        </div>
      </div>

      {/* MOBILE FOOTER */}
      <div className="md:hidden bg-pure-black text-pure-black border-t border-zinc-300/40 py-4 px-6">
        <div className="flex justify-between items-start gap-4">
          
          {/* Left dense legal text */}
          <div className="max-w-[65%]">
            <p className="font-body text-[10px] text-white opacity-50 leading-normal font-semibold">
              © 2026 Jayanthan S • Building the future through code, design, and innovation
            </p>
          </div>

          {/* Right simple black links */}
          <div className="flex flex-col items-end gap-1.5 ">
            <a 
              href="https://github.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="font-body text-[11px] font-bold text-white hover:text-vivid-crimson transition-colors"
            >
              Github
            </a>
            <a 
              href="https://linkedin.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="font-body text-[11px] font-bold text-white hover:text-vivid-crimson transition-colors"
            >
              Linkedin
            </a>
            <a 
              href="mailto:jayanthansathiyapal@gmail.com"
              className="font-body text-[11px] font-bold text-white hover:text-vivid-crimson transition-colors"
            >
              Gmail
            </a>
          </div>

        </div>
      </div>

    </footer>
  );
}
