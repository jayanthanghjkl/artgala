import { useLayoutEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';
import HeroSection from '../../pages/LandingPage/HeroSection';
import AboutPage from '../../pages/AboutPage/AboutPage';
import DecryptedText from '../effects/DecryptedText';

gsap.registerPlugin(ScrollTrigger);

export default function HeroTransitionWrapper({ isEntered = true }) {
  const containerRef = useRef(null);
  const [triggerDecrypt, setTriggerDecrypt] = useState(false);
  const [paraProgress1, setParaProgress1] = useState(0);
  const [paraProgress2, setParaProgress2] = useState(0);

  useLayoutEffect(() => {
    let ctx = gsap.context(() => {
      // Create the master timeline for the Hero -> About transition
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top top',
          end: '+=650%', // Optimized scroll distance to keep transitions fluid and responsive
          scrub: 1, // Smooth scrubbing
          pin: true,
          anticipatePin: 1,
        }
      });

      // Ensure initial positions at resting hero state
      gsap.set('.hero-blackout-overlay', { yPercent: 100 });
      gsap.set('.hero-navbar', { opacity: 1 });

      // We start the text centering immediately without waiting for the 3D model to finish zooming.
      tl.add('start')
        
        // --- PHASE 1: Center Text & Soft Gradient Blackout simultaneously (Zero Lag) ---
        .add('centerText')
        .to('.hero-text-container', { y: '-39vh', duration: 1, ease: 'power2.inOut' }, 'centerText')
        .to('.hero-blackout-overlay', { yPercent: 0, duration: 1, ease: 'power2.inOut' }, 'centerText')
        .to('.hero-model-canvas', { opacity: 0, duration: 0.9, ease: 'power2.inOut' }, 'centerText')
        .to('.hero-desc-wrapper', { opacity: 0, duration: 0.3, ease: 'power2.out' }, 'centerText')
        .fromTo('.hero-navbar', { opacity: 1 }, { opacity: 0, duration: 0.3, ease: 'power2.out' }, 'centerText')
        .to('.hero-text-shadow-bg', { opacity: 0, duration: 0.3, ease: 'power2.out' }, 'centerText')
        
        // --- PHASE 2: Split Text & Zoom In (Expanding Frame) ---
        .add('splitAndExpand', 'centerText+=1.4')
        .to('.hero-name-left', { x: '-150vw', duration: 1.5, ease: 'power3.inOut' }, 'splitAndExpand')
        .to('.hero-name-right', { x: '150vw', duration: 1.5, ease: 'power3.inOut' }, 'splitAndExpand')
        .to('.expanding-frame', { 
          scale: 1, 
          borderRadius: '0px', 
          duration: 1.5, 
          ease: 'power3.inOut' 
        }, 'splitAndExpand')

        // --- PHASE 2.2: Text Reveal ---
        .to('.decrypt-text-wrapper', {
          opacity: 1,
          duration: 0.5,
          ease: 'power3.inOut'
        }, 'splitAndExpand+=0.2')
        // Synchronously animate the progress of the decryption strictly tied to expansion
        .to({ val: 0 }, {
          val: 1,
          duration: 1.5,
          ease: 'none',
          onUpdate: function() {
            setTriggerDecrypt(this.targets()[0].val);
          }
        }, 'splitAndExpand+=0.2')
        
        // --- PHASE 2.5: Fade Out Text on "Next Scroll" ---
        // We wait for 1 full duration unit AFTER expansion is done before fading
        .add('fadeOutText', 'splitAndExpand+=2.5')
        .to('.decrypt-text-wrapper', {
          opacity: 0,
          duration: 0.5,
          ease: 'power2.inOut'
        }, 'fadeOutText')

        // --- PHASE 3: About Page Reveal ---
        .add('aboutReveal', 'fadeOutText+=0.5')
        .to('.about-rule', { scaleX: 1, duration: 0.5, ease: 'power2.out' }, 'aboutReveal')
        .to('.about-h2-anim', { opacity: 1, y: 0, filter: 'blur(0)', duration: 0.5 }, 'aboutReveal')
        .to('.about-portrait', { opacity: 1, y: 0, scale: 1, filter: 'blur(0)', duration: 0.5 }, 'aboutReveal')
        .to('.about-text-column', { opacity: 1, y: 0, duration: 0.5 }, 'aboutReveal')

        // --- PHASE 4: ScrollReveal Word Scrubbing ---
        .add('para1', 'aboutReveal+=0.2')
        .to({ val: 0 }, {
          val: 1,
          duration: 1.0,
          ease: 'none',
          onUpdate: function() {
            setParaProgress1(this.targets()[0].val);
          }
        }, 'para1')
        
        .add('para2', '+=0.3')
        .to({ val: 0 }, {
          val: 1,
          duration: 1.0,
          ease: 'none',
          onUpdate: function() {
            setParaProgress2(this.targets()[0].val);
          }
        }, 'para2')
        
        // --- TIMELINE PADDING ---
        .to(containerRef.current, { duration: 1.5 });

    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={containerRef} className="w-full h-screen relative overflow-hidden bg-[#070103]">
      
      {/* Layer 1: Hero Section (Contains 3D Canvas, Expanding Frame, and Text) */}
      <div className="absolute inset-0 z-10 w-full h-full">
        <HeroSection isEntered={isEntered}>
          <div className="decrypt-text-wrapper opacity-0 font-heading text-black text-xl md:text-3xl lg:text-5xl font-medium tracking-tight px-6 text-center">
            <DecryptedText
              text="I build websites and applications like this."
              speed={50}
              maxIterations={20}
              animateOn="scroll"
              trigger={triggerDecrypt}
              encryptedClassName="text-black/40"
              sequential={true}
              revealDirection="start"
            />
          </div>
        </HeroSection>
      </div>

      {/* Layer 3: About Page Content */}
      <div className="absolute inset-0 z-30 w-full h-full pointer-events-none">
        <style dangerouslySetInnerHTML={{
          __html: `
            .about-rule { transform: scaleX(0); transform-origin: left; }
            .about-h2-anim { opacity: 0; transform: translateY(48px); filter: blur(8px); }
            .about-portrait { transform: translateY(40px) scale(0.96); filter: blur(4px); }
            .about-text-column { transform: translateY(24px); }
          `
        }} />
        <AboutPage progress1={paraProgress1} progress2={paraProgress2} />
      </div>

    </div>
  );
}
