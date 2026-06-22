import React from 'react';
import AsciiHands from '../../components/common/AsciiHands';

/**
 * ContactPage component.
 * Renders a 3D canvas on the top half of the screen and the contact section on the bottom half.
 */
export default function ContactPage() {
  return (
    <section className="w-full min-h-screen flex flex-col">
      
      {/* TOP HALF: 3D CANVAS CONTAINER */}
      <div className="w-full h-[70vh] relative overflow-hidden backdrop-blur-md flex items-center justify-center">
        <AsciiHands />
      </div>

      {/* BOTTOM HALF: CONTACT SECTION */}
      <div className="w-full h-[50vh] border border-black/80 rounded-t-2xl ">

        {/* DESKTOP CONTACT VIEW */}
        {/* Adjusted padding and height to fit perfectly inside h-[50vh] */}
        <div className="hidden md:block bg-zinc-100 text-pure-black h-full pt-12 pb-6 px-12 lg:px-24 overflow-y-auto ">
          <div className="max-w-screen mx-auto ">
            <h2 className="font-heading text-5xl font-black tracking-tight mb-2 select-none">
              Let's get in touch
            </h2>
            <p className="font-body text-zinc-500 text-base mb-6 max-w-[600px] leading-relaxed">
              Let's connect and build something meaningful together.
            </p>

            <div className="max-w-[800px] space-y-4">
              {/* Wide input field placeholders */}
              <div className="w-full h-12 bg-zinc-200 border border-zinc-300/80 rounded-xl flex items-center px-6 text-zinc-400/80 font-body text-sm select-none shadow-inner relative overflow-hidden group">
                <div className="absolute inset-y-0 left-0 w-1 bg-transparent group-hover:bg-vivid-crimson transition-all duration-300"></div>
                <span>Your email address / name</span>
              </div>
              
              <div className="w-full h-24 bg-zinc-200 border border-zinc-300/80 rounded-xl flex items-start p-4 text-zinc-400/80 font-body text-sm select-none shadow-inner relative overflow-hidden group">
                <div className="absolute inset-y-0 left-0 w-1 bg-transparent group-hover:bg-vivid-crimson transition-all duration-300"></div>
                <span>Describe your project details or just say hello...</span>
              </div>
            </div>
          </div>
        </div>

        {/* MOBILE CONTACT VIEW */}
        {/* Removed the harsh dark-to-light gradient since top half is dark canvas */}
        <div className="md:hidden bg-zinc-200 h-full pt-6 pb-4 px-6 overflow-y-auto">
          <div className="w-full max-w-[480px] mx-auto">
            
            {/* Card Container */}
            <div className="bg-zinc-50 border border-zinc-300/60 rounded-2xl p-6 shadow-lg flex flex-col">
              <h2 className="font-heading text-xl font-black text-pure-black text-center mb-1 select-none">
                Let's get in touch
              </h2>
              <p className="font-body text-zinc-500 text-[11px] text-center mb-4 leading-relaxed">
                Let's connect and build something meaningful together
              </p>

              {/* Elongated gray input field placeholders */}
              <div className="space-y-3">
                <div className="w-full h-10 bg-zinc-200 border border-zinc-300/80 rounded-xl flex items-center px-4 text-zinc-400/80 font-body text-xs select-none shadow-inner">
                  <span>Enter your email</span>
                </div>
                
                <div className="w-full h-20 bg-zinc-200 border border-zinc-300/80 rounded-xl flex items-start p-3 text-zinc-400/80 font-body text-xs select-none shadow-inner">
                  <span>Enter your message</span>
                </div>
              </div>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
}
