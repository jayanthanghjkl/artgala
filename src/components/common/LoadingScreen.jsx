import { useEffect, useRef, useState } from 'react';
import ScrollTrigger from 'gsap/ScrollTrigger';
import './LoadingScreen.css';

const FIRST_NAME = 'Jayanthan';
const LAST_NAME = 'Sathiyapal.';

// Module-scoped flag: resets to false whenever the browser reloads the page,
// but remains true across client-side React Router route transitions.
let hasLoadedOnce = false;

// Center across the OVERALL text "Jayanthan Sathiyapal." (length 21)
// Center point is index 9.5 (between the space at 9 and 'S' at 10)
const TOTAL_CENTER = 9.5;

const firstNameChars = FIRST_NAME.split('').map((char, i) => {
  const globalIndex = i; // 0 to 8
  const distanceFromCenter = Math.abs(globalIndex - TOTAL_CENTER);
  const delay = (distanceFromCenter * 0.08) + 0.1;
  return {
    char,
    delay: delay.toFixed(2),
  };
});

const lastNameChars = LAST_NAME.split('').map((char, i) => {
  const globalIndex = 10 + i; // 10 to 20
  const distanceFromCenter = Math.abs(globalIndex - TOTAL_CENTER);
  const delay = (distanceFromCenter * 0.08) + 0.1;
  return {
    char,
    delay: delay.toFixed(2),
  };
});

/**
 * LoadingScreen Component
 * Sequenced Animation:
 * 1. Centered text letters fall into place outward from the OVERALL text center
 * 2. Color changing sweep wipe plays across the screen
 * 3. Overlay backdrop dissolves to reveal the landing page background, 3D model, subtitle & navbar
 * 4. Center text glides down to the exact landing page title coordinates
 * 5. Target heading takes over seamlessly with zero rearrange or shift
 */
export default function LoadingScreen({ onComplete }) {
  const [isDone, setIsDone] = useState(hasLoadedOnce);
  const [revealBg, setRevealBg] = useState(false);
  const loaderTitleWrapperRef = useRef(null);
  const loaderTitleRef = useRef(null);
  const colorSweepRef = useRef(null);

  useEffect(() => {
    // If the animation already completed in this session/reload, skip it completely on route changes
    if (hasLoadedOnce) {
      document.body.classList.add('loaded');
      document.body.style.overflow = '';
      const targetHeading = document.getElementById('targetHeading');
      if (targetHeading) {
        targetHeading.style.transition = 'none';
        targetHeading.style.opacity = '1';
      }
      return;
    }

    const loaderTitle = loaderTitleRef.current;
    const colorSweep = colorSweepRef.current;
    const body = document.body;

    body.classList.remove('loaded');
    body.style.overflow = 'hidden';

    // Keep the target heading in HeroSection hidden during loading so it doesn't clash
    const targetHeading = document.getElementById('targetHeading');
    if (targetHeading) {
      targetHeading.style.opacity = '0';
    }

    let t1, t2, t3, t4, t5;

    // 1. Once letters finish falling in center (~1.3s), trigger the color changing sweep wipe
    t1 = setTimeout(() => {
      if (colorSweep) {
        colorSweep.classList.add('sweep-active');
      }

      // 2. Reveal Landing Page Background (at 850ms, as the color sweep reaches the top)
      t2 = setTimeout(() => {
        setRevealBg(true);

        // 3. Glide the centered loader title down to the bottom target heading position (after 300ms)
        t3 = setTimeout(() => {
          const heading = document.getElementById('targetHeading');

          if (loaderTitle && heading) {
            const loaderRect = loaderTitle.getBoundingClientRect();
            const targetRect = heading.getBoundingClientRect();

            const translateX = targetRect.left - loaderRect.left;
            const translateY = targetRect.top - loaderRect.top;

            // Smooth clean translation to resting coordinates
            loaderTitle.style.transform = `translate(${translateX}px, ${translateY}px)`;
          }

          // 4. Instantaneous handover to target heading when glide reaches destination (no crossfade dip)
          t4 = setTimeout(() => {
            hasLoadedOnce = true;
            body.classList.add('loaded');
            const heading = document.getElementById('targetHeading');
            if (heading) {
              heading.style.transition = 'none';
              heading.style.opacity = '1';
            }
            if (loaderTitleWrapperRef.current) {
              loaderTitleWrapperRef.current.style.transition = 'none';
              loaderTitleWrapperRef.current.style.opacity = '0';
              loaderTitleWrapperRef.current.style.display = 'none';
            }
          }, 1500);

          // 5. Cleanup Overlay Element (1750ms into glide)
          t5 = setTimeout(() => {
            hasLoadedOnce = true;
            setIsDone(true);
            body.style.overflow = '';
            ScrollTrigger.refresh();
            if (onComplete) {
              onComplete();
            }
          }, 1750);
        }, 300);
      }, 850);
    }, 1300);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
      clearTimeout(t5);
    };
  }, [onComplete]);

  if (hasLoadedOnce || isDone) return null;

  return (
    <>
      {/* Loading Overlay Backdrop with Color Sweep */}
      <div
        className={`loader-overlay ${revealBg ? 'reveal-bg' : ''}`}
        id="loaderOverlay"
        aria-hidden="true"
      >
        <div className="color-sweep" id="colorSweep" ref={colorSweepRef} />
      </div>

      {/* Centered Initial Title with identical padding, hierarchy, and typography as targetHeading */}
      <div
        className="loader-title-wrapper px-2 sm:px-4 md:px-6 lg:px-8"
        id="loaderTitleWrapper"
        ref={loaderTitleWrapperRef}
        aria-hidden="true"
      >
        <div
          className="loader-title w-full text-center whitespace-nowrap select-none overflow-visible flex items-baseline justify-center tracking-[-0.02em] leading-[0.96] text-[#F4F1EA] pb-3 sm:pb-5 md:pb-0"
          id="loaderTitle"
          ref={loaderTitleRef}
          style={{
            fontSize: 'clamp(2.4rem, 11.5vw, 22rem)',
            textShadow: 'none',
            filter: 'none',
          }}
        >
          {/* First Name ("Jayanthan") */}
          <span
            className="hero-name-left flex-1 flex justify-end pr-2 sm:pr-3 md:pr-5 font-extralight overflow-visible pb-2 sm:pb-3"
            style={{
              fontFamily: "'GGX89 Extra Light', 'Ggx89', 'GGX89', 'Inter Tight', 'Helvetica Neue', Arial, sans-serif",
              fontWeight: 400,
              letterSpacing: '-0.034em',
            }}
          >
            <span className="overflow-visible inline-block">
              {firstNameChars.map((item, idx) => (
                <span
                  key={`fn-${idx}`}
                  className="split-char inline-block"
                  style={{ animationDelay: `${item.delay}s` }}
                >
                  {item.char}
                </span>
              ))}
            </span>
          </span>

          {/* Last Name ("Sathiyapal.") */}
          <span
            className="hero-name-right flex-1 flex justify-start pl-2 sm:pl-3 md:pl-7 italic font-normal overflow-visible pb-2 sm:pb-3"
            style={{
              fontFamily: "'Behind The Nineties Italic', 'Behind The Nineties', 'Instrument Serif', Georgia, serif",
              fontStyle: 'italic',
              fontWeight: 200,
              letterSpacing: '-0.02em',
            }}
          >
            <span className="overflow-visible inline-block">
              {lastNameChars.map((item, idx) => (
                <span
                  key={`ln-${idx}`}
                  className="split-char inline-block"
                  style={{ animationDelay: `${item.delay}s` }}
                >
                  {item.char}
                </span>
              ))}
            </span>
          </span>
        </div>
      </div>
    </>
  );
}
