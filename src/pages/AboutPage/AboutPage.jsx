import React from 'react';
import { skillsData } from '../../data/skills';

/**
 * AboutPage component.
 * Renders the responsive About Me section.
 * - Desktop: Stark white background, left-aligned enormous heading, portrait placeholder, paragraph block, and categorised list.
 * - Mobile: Off-white background, stacked vertical header "ABOUT ME" down the left margin, skills taxonomy, and rounded block placeholder below.
 */
export default function AboutPage() {
  return (
    <section id="about" className="relative w-full h-screen  snap-start overflow-hidden">

      {/* DESKTOP ABOUT VIEW */}
      <div className="hidden md:block bg-pure-white text-pure-black h-screen lg:px-24">
        <div className="max-w-[1400px] mx-auto">
          <h1 className="font-heading text-9xl font-black text-pure-black mb-10 tracking-tighter select-none text-center">
            ABOUT ME
          </h1>

          <div className="grid grid-cols-[1fr_2fr] gap-16 lg:gap-24 mt-20">
            {/* Left Side: Portrait placeholder */}
            <div className="w-full aspect-[3/4] bg-zinc-100 border border-zinc-200/80 rounded-xl flex flex-col justify-center items-center p-8 select-none relative overflow-hidden group shadow-sm">
              <div className="absolute inset-0 bg-gradient-to-tr from-zinc-200/40 via-transparent to-zinc-200/20 group-hover:scale-105 transition-transform duration-500"></div>
              <div className="relative z-10 w-full h-full border border-dashed border-zinc-300 rounded-lg flex items-center justify-center">
                <span className="font-body text-xs font-semibold tracking-[4px] text-zinc-400 text-center uppercase p-4">
                  Portrait Placeholder
                </span>
              </div>
            </div>

            {/* Right Side: Copy & Lists */}
            <div className="flex flex-col">
              <p className="font-body text-base lg:text-lg text-zinc-800 leading-relaxed font-normal mt-8 mb-6">
                I am a third-year Computer Science and Engineering student with a keen interest in Full Stack Development. I specialize in building digital experiences that combine sleek visual design with clean, scalable, and modular codebases.
              </p>
              <p className="font-body text-base lg:text-lg text-zinc-800 leading-relaxed font-normal mb-8">
                My passion lies in bridging user-centric design architectures with performant developer toolings. I enjoy working on structural systems, front-end visual states, and DevOps pipelines to deliver cohesive and modern digital products.
              </p>

              {/* Skills categorization */}
              <div className="space-y-6 pt-6 border-t border-zinc-200/60">
                <div>
                  <h3 className="font-heading text-sm font-bold text-pure-black uppercase tracking-wider mb-2">
                    Languages
                  </h3>
                  <p className="font-body text-zinc-600 text-sm leading-relaxed tracking-wide">
                    {skillsData.languages.desktop}
                  </p>
                </div>
                <div>
                  <h3 className="font-heading text-sm font-bold text-pure-black uppercase tracking-wider mb-2">
                    Frameworks and Technologies
                  </h3>
                  <p className="font-body text-zinc-600 text-sm leading-relaxed tracking-wide">
                    {skillsData.frameworks.desktop}
                  </p>
                </div>
                <div>
                  <h3 className="font-heading text-sm font-bold text-pure-black uppercase tracking-wider mb-2">
                    Tools and DevOps
                  </h3>
                  <p className="font-body text-zinc-600 text-sm leading-relaxed tracking-wide">
                    {skillsData.tools.desktop}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* MOBILE ABOUT VIEW */}
      <div className="md:hidden bg-zinc-50 text-pure-black py-16 px-6">
        <div className="relative z-10 w-full grid grid-cols-[1.2fr_2fr] gap-6 items-start">

          {/* Vertical Stacked Typography on Left */}
          <div className="flex flex-col items-start gap-1 justify-start pt-1">
            {"ABOUT ME".split("").map((letter, idx) => (
              <span
                key={idx}
                className="font-heading text-5xl sm:text-6xl font-black text-pure-black leading-[0.9] tracking-wider select-none inline-block -rotate-270"
              >
                {letter}
              </span>
            ))}
          </div>

          {/* Right Column content */}
          <div className="flex flex-col">
            <p className="font-body text-[0.875rem] text-zinc-800 leading-relaxed font-normal mb-6">
              I'm a third-year Computer Science and Engineering student with a strong interest in Full-Stack Development, focusing on crafting robust workflows and intuitive design.
            </p>

            {/* Skills taxonomy */}
            <div className="space-y-4 border-t border-zinc-200/80 pt-4">
              <div>
                <span className="font-body text-[0.8rem] font-bold text-pure-black block mb-1">
                  Languages
                </span>
                <span className="font-body text-[0.75rem] text-zinc-600 leading-relaxed block">
                  • {skillsData.languages.mobile}
                </span>
              </div>
              <div>
                <span className="font-body text-[0.8rem] font-bold text-pure-black block mb-1">
                  Frameworks and Technologies
                </span>
                <span className="font-body text-[0.75rem] text-zinc-600 leading-relaxed block">
                  • {skillsData.frameworks.mobile}
                </span>
              </div>
              <div>
                <span className="font-body text-[0.8rem] font-bold text-pure-black block mb-1">
                  Tools and DevOps
                </span>
                <span className="font-body text-[0.75rem] text-zinc-600 leading-relaxed block">
                  • {skillsData.tools.mobile}
                </span>
              </div>
            </div>

            {/* Sizable light gray rounded rectangle placeholder */}
            <div className="w-full h-40 bg-zinc-200 border border-zinc-300 rounded-xl flex items-center justify-center mt-8 p-6 select-none shadow-inner">
              <div className="w-full h-full border border-dashed border-zinc-400/50 rounded-lg flex items-center justify-center">
                <span className="font-body text-[10px] font-semibold tracking-[3px] text-zinc-400 uppercase">
                  Image Block
                </span>
              </div>
            </div>
          </div>

        </div>
      </div>

    </section>
  );
}
