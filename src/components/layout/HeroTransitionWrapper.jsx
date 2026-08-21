import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';
import HeroSection from '../../pages/LandingPage/HeroSection';
import AboutPage from '../../pages/AboutPage/AboutPage';

gsap.registerPlugin(ScrollTrigger);

export default function HeroTransitionWrapper() {
  const containerRef = useRef(null);

  useEffect(() => {
    let ctx = gsap.context(() => {
      // Create the master timeline for the Hero -> About transition
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top top',
          end: '+=500%', // 5 screen heights of scroll
          scrub: 1, // Smooth scrubbing
          pin: true,
          anticipatePin: 1,
        }
      });

      // We start the text centering immediately without waiting for the 3D model to finish zooming.
      tl.add('start')
        
        // --- PHASE 1: Center Text & Blur ---
        .add('centerText')
        .to('.hero-text-container', { y: '-39vh', duration: 1, ease: 'power2.inOut' }, 'centerText')
        .to('.hero-blur-overlay', { opacity: 1, duration: 1, ease: 'power2.inOut' }, 'centerText')
        // Fade out the description wrapper right as the text reaches the center
        .to('.hero-desc-wrapper', { opacity: 0, duration: 0.3, ease: 'power2.out' }, 'centerText+=0.7')
        // --- PHASE 2: Split Text & Expand Frame Simultaneously ---
        .add('splitAndExpand', '+=0.5')
        .to('.hero-name-left', { x: '-150vw', duration: 1.5, ease: 'power3.inOut' }, 'splitAndExpand')
        .to('.hero-name-right', { x: '150vw', duration: 1.5, ease: 'power3.inOut' }, 'splitAndExpand')
        .to('.expanding-frame', { 
          scale: 1, 
          borderRadius: '0px', 
          duration: 1.5, 
          ease: 'power3.inOut' 
        }, 'splitAndExpand')
        .to('.hero-blur-overlay', { opacity: 0, duration: 0.5 }, 'splitAndExpand')

        // --- PHASE 3: About Page Reveal ---
        .add('aboutReveal', '+=0.2')
        .to('.about-rule', { scaleX: 1, duration: 0.5, ease: 'power2.out' }, 'aboutReveal')
        .to('.about-h2-anim', { opacity: 1, y: 0, filter: 'blur(0)', duration: 0.5 }, 'aboutReveal')
        .to('.about-portrait', { opacity: 1, y: 0, scale: 1, filter: 'blur(0)', duration: 0.5 }, 'aboutReveal')
        .to('.about-text-column', { opacity: 1, y: 0, duration: 0.5 }, 'aboutReveal')

        // --- PHASE 4: Paragraph Highlights ---
        .add('para1', '+=0.2')
        .to('.about-para-1', { opacity: 1, duration: 0.5 }, 'para1')
        
        .add('para2', '+=0.5')
        .to('.about-para-2', { opacity: 1, duration: 0.5 }, 'para2');

    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={containerRef} className="w-full h-screen relative overflow-hidden bg-black">
      
      {/* Layer 1: Hero Section (Contains 3D Canvas, Expanding Frame, and Text) */}
      <div className="absolute inset-0 z-10 w-full h-full">
        <HeroSection isEntered={true} />
      </div>

      {/* Layer 2: About Page Content */}
      {/* Opacities and transforms match the GSAP starting states needed */}
      <div className="absolute inset-0 z-30 w-full h-full pointer-events-none">
        {/* We need AboutPage styles to start correctly for GSAP */}
        <style dangerouslySetInnerHTML={{
          __html: `
            .about-rule { transform: scaleX(0); transform-origin: left; }
            .about-h2-anim { opacity: 0; transform: translateY(48px); filter: blur(8px); }
            .about-portrait { transform: translateY(40px) scale(0.96); filter: blur(4px); }
            .about-text-column { transform: translateY(24px); }
          `
        }} />
        <AboutPage />
      </div>

    </div>
  );
}
