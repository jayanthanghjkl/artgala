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
      // Extended scroll budget with generous dwell plateaus so the text centers slowly and popup expands majestically
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top top',
          end: '+=700%', // 7 * window.innerHeight for slow, luxurious pacing
          scrub: 0.8, // Silky smooth, organic scrubbing
          pin: true,
          anticipatePin: 1,
        }
      });

      // Ensure initial positions at resting hero state
      gsap.set('.hero-blackout-overlay', { yPercent: 100 });
      gsap.set('.hero-navbar', { opacity: 1 });
      gsap.set('.expanding-frame', { scale: 0, opacity: 0, borderRadius: '240px' });
      gsap.set('.decrypt-text-wrapper', { opacity: 0, y: 0 });

      // --- STAGE 0 -> STAGE 1 (Time 0.0 -> 1.30): Hero Text Glides to Center Slowly with Atmospheric Blackout ---
      // 1. Navbar, subtitle, and text shadow background dissolve softly
      tl.to('.hero-desc-wrapper', { opacity: 0, duration: 0.45, ease: 'power2.out' }, 0.0)
        .fromTo('.hero-navbar', { opacity: 1 }, { opacity: 0, duration: 0.45, ease: 'power2.out' }, 0.0)
        .to('.hero-text-shadow-bg', { opacity: 0, duration: 0.50, ease: 'power2.out' }, 0.0)

        // 2. 3D Model canvas dissolves smoothly into atmospheric darkness
        .to('.hero-model-canvas', { opacity: 0, duration: 1.05, ease: 'power2.inOut' }, 0.05)

        // 3. Blackout overlay rises progressively with soft atmospheric gradient
        .to('.hero-blackout-overlay', { yPercent: 0, duration: 1.25, ease: 'power2.inOut' }, 0.05)

        // 4. Name typography glides up slowly to screen center with gentle acceleration and deceleration
        .to('.hero-text-container', { y: '-39vh', duration: 1.20, ease: 'power2.inOut' }, 0.05);

      // --- HOLD PLATEAU (Time 1.30 -> 1.70): Centered Text Rests Serenely on Screen ---
      // Gives the user a comfortable moment to see and appreciate the centered name before splitting!

      // --- STAGE 1 -> STAGE 2 (Time 1.70 -> 3.60): Split Text, Slow Majestic Popup Expansion & Decryption ---
      // 1. Name splits apart smoothly toward left and right
      tl.to('.hero-name-left', { x: '-140vw', duration: 1.15, ease: 'power2.inOut' }, 1.70)
        .to('.hero-name-right', { x: '140vw', duration: 1.15, ease: 'power2.inOut' }, 1.70)

        // 2. Popup frame expands SLOWLY and smoothly from center with soft border-radius easing
        .fromTo('.expanding-frame',
          { scale: 0, opacity: 0, borderRadius: '240px' },
          {
            scale: 1,
            opacity: 1,
            borderRadius: '0px',
            duration: 1.25,
            ease: 'power2.inOut'
          },
          1.75
        )

        // 3. Decrypted text wrapper fades in once the frame is comfortably expanded
        .to('.decrypt-text-wrapper', { opacity: 1, duration: 0.45, ease: 'power2.out' }, 2.65)

        // 4. Controlled decryption reveal runs clearly across center of expanded frame
        .fromTo({ val: 0 }, { val: 0 }, {
          val: 1,
          duration: 0.80,
          ease: 'sine.inOut',
          onUpdate: function () {
            setTriggerDecrypt(this.targets()[0].val);
          }
        }, 2.80);

      // --- READING HOLD (Time 3.60 -> 4.00): Comfortable Buffer to Read Decrypted Text ---

      // --- STAGE 2 -> STAGE 3 (Time 4.00 -> 5.30): Decrypt Text Fades, Staggered About Reveal & Paragraph 1 ---
      // 1. Decrypted text fades away with a subtle upward float
      tl.to('.decrypt-text-wrapper', { opacity: 0, y: -24, duration: 0.40, ease: 'power2.inOut' }, 4.00)

        // 2. Staggered reveal of About headline with de-blur
        .to('.about-h2-anim', { opacity: 1, y: 0, filter: 'blur(0)', duration: 0.60, ease: 'power3.out' }, 4.20)

        // 3. Staggered expansion of the divider rule
        .to('.about-rule', { scaleX: 1, duration: 0.55, ease: 'power2.out' }, 4.30)

        // 4. Staggered entrance of the 3D portrait card with de-blur
        .to('.about-portrait', { opacity: 1, y: 0, scale: 1, filter: 'blur(0)', duration: 0.60, ease: 'power3.out' }, 4.30)

        // 5. Staggered entrance of the biography column
        .to('.about-text-column', { opacity: 1, y: 0, duration: 0.50, ease: 'power2.out' }, 4.40)

        // 6. Smooth, gradual reveal of Paragraph 1 word-by-word
        .fromTo({ val: 0 }, { val: 0 }, {
          val: 1,
          duration: 0.75,
          ease: 'sine.inOut',
          onUpdate: function () {
            setParaProgress1(this.targets()[0].val);
          }
        }, 4.50);

      // --- STAGE 3 -> STAGE 4 (Time 5.35 -> 6.50): Paragraph 2 Smooth Word-by-Word Reveal ---
      // Steady, readable cadence with a gentle resting cushion before exit
      tl.fromTo({ val: 0 }, { val: 0 }, {
        val: 1,
        duration: 0.90,
        ease: 'sine.inOut',
        onUpdate: function () {
          setParaProgress2(this.targets()[0].val);
        }
      }, 5.35);

      // --- STAGE 4 -> STAGE 5 (Time 6.55 -> 7.40): Smooth Transition to Project Section (Lands on Project 1) ---
      // 1. Graceful exit of About portrait and text column with gentle upward lift
      tl.to('.about-portrait', { opacity: 0, y: -35, duration: 0.65, ease: 'power2.inOut' }, 6.55)
        .to('.about-text-column', { opacity: 0, y: -35, duration: 0.65, ease: 'power2.inOut' }, 6.55)

        // 2. Headline and rule gracefully dissolve
        .to('.about-h2-anim', { opacity: 0, y: -25, duration: 0.50, ease: 'power2.inOut' }, 6.65)
        .to('.about-rule', { scaleX: 0, duration: 0.50, ease: 'power2.inOut' }, 6.65)

        // 3. Seamless handover pad to 7.40 where Project 1 is perfectly positioned at 'top top'
        .to({}, { duration: 0.35 }, 7.35);

    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={containerRef} className="hero-master-wrapper w-full h-screen relative overflow-hidden bg-[#070103]">

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
