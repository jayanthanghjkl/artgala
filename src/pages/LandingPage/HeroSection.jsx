import React, { useState } from 'react';
import Navbar from '../../components/navigation/Navbar';

/**
 * HeroSection component.
 * Renders the hero section using Tailwind CSS v4.
 * Includes responsive rendering with a background 3D Canvas element.
 */
export default function HeroSection() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <section id="hero" className="relative h-screen w-full flex items-end overflow-hidden snap-start bg-transparent">
      
      {/* Navbar rendered locally at the top of the Hero Section */}
      <Navbar mobileMenuOpen={mobileMenuOpen} setMobileMenuOpen={setMobileMenuOpen} />

      {/* DESKTOP HERO VIEW CONTENT */}
      {/* Changed bg-pure-black to bg-transparent and z-[1] to z-10 */}
      <div className="hidden md:flex relative z-10 w-full min-h-screen bg-transparent items-end px-12 pb-24 pt-32">
        <div className="relative max-w-[1400px] w-full mx-auto flex flex-col items-start">
          {/* Lower left quadrant alignment */}
          <div className="max-w-[480px] mb-8">
            <p className="font-body text-base ml-5 md:text-lg text-pure-white/90 leading-relaxed tracking-tight">
              Building digital experiences<br />
              that blend intuitive design with clean<br />
              scalable code
            </p>
          </div>
          <h1 className="font-heading text-[115px] text-nowrap font-black pt-3 leading-[0.82] tracking-[-0.04em] text-pure-white w-full select-none">
            JAYANTHAN<span className='ml-10'> SATHIYAPAL</span>
          </h1>
        </div>    
      </div>

      {/* MOBILE HERO VIEW CONTENT */}
      {/* Changed bg-gradient to bg-transparent and z-[1] to z-10 */}
      <div className="md:hidden flex relative z-10 w-full min-h-screen bg-transparent items-center px-6 pt-28 pb-12">
        <div className="relative w-full grid grid-cols-[1.2fr_2fr] gap-1 items-center">
          
          {/* Vertical Stacked Typography on Left */}
          <div className="flex flex-col items-start gap-1 justify-center mt-20 ">
           {"JAYANTHAN".split("").map((letter, idx) => (
            <span
              key={idx}
              className="font-heading text-5xl sm:text-6xl font-black text-pure-white leading-[0.9] tracking-wider select-none inline-block -rotate-270"
            >
              {letter}
            </span>
           ))}
          </div>

          {/* Centered Right-Side Description */}
          <div className="flex flex-col text-right pr-2">
            <p className="font-body text-xs text-justify leading-relaxed text-zinc-300 font-medium max-w-[250px]">
              Building digital experiences that blend intuitive design with clean, scalable code.
            </p>
          </div>

        </div>
      </div>

    </section>
  );
}
