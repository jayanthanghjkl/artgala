import React, { useLayoutEffect, useRef } from 'react';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const clamp = (val, min, max) => Math.min(Math.max(val, min), max);

/**
 * FiniteSpiralGallery
 * 
 * Completely wordless, pure visual 3D helical scroll experience:
 * 1. Pinned fullscreen on scroll (`top top`, `pin: true`).
 * 2. Visual-only project cards ascend from the bottom of the helix to the focal plane.
 * 3. 6th card zooms directly into camera, expanding to cover the entire viewport.
 * 4. Smooth dark wipe transition.
 * 5. Unpins and moves seamlessly to the next page.
 */
export default function FiniteSpiralGallery({
  id = "gallery",
  items = [],
  baseRadius = 450,
  baseCardWidth = 190,
  baseCardHeight = 115,
  baseVerticalSpacing = 50,
  basePerspective = 800,
  cardsPerTurn = 15,
  centerScale = 1.3,
  cardRadius = 12,
  edgeBlur = 2,
  edgeFade = 0.1,
  cardTilt = 0,
  className = ""
}) {
  const containerRef = useRef(null);
  const cardRefs = useRef([]);
  const backdropRef = useRef(null);
  const targetProgressRef = useRef(0);
  const currentProgressRef = useRef(0);

  useLayoutEffect(() => {
    const container = containerRef.current;
    if (!container || items.length === 0) return;

    const count = items.length;
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const renderCardState = (progress) => {
      const viewWidth = window.innerWidth;
      const viewHeight = window.innerHeight;

      // Dynamic responsive spread: wide radius spanning across the sides of the screen
      const fit = Math.min(
        1.15,
        Math.max(0.68, viewWidth / 1100),
        Math.max(0.70, viewHeight / 800)
      );

      // Wider horizontal helix that gracefully spans across the sides of the viewport
      const responsiveRadius = Math.max(baseRadius * fit, Math.min(viewWidth * 0.38, 540));
      const responsiveSpacing = baseVerticalSpacing * fit;

      // Phase 1 (0.00 -> 0.70): Helical card ascension
      // Card 0 starts below the center plane (-0.85, coming from bottom)
      // Card 5 (count - 1) reaches focal center at progress = 0.70
      const spiralProgress = clamp(progress / 0.70, 0, 1);
      const startCenterCard = -0.85;
      const endCenterCard = count - 1;
      const currentCenterCard = startCenterCard + spiralProgress * (endCenterCard - startCenterCard);

      // Phase 2 (0.70 -> 1.00): Camera zoom wipe
      const zoomProgress = clamp((progress - 0.70) / 0.30, 0, 1);

      items.forEach((_, index) => {
        const card = cardRefs.current[index];
        if (!card) return;

        const isLast = index === count - 1;

        if (isLast && zoomProgress > 0) {
          // Final card: zooms forward toward camera and generously covers all sides of viewport
          const zoomFactor = Math.pow(zoomProgress, 1.35);
          const zoomScale = centerScale * fit + zoomFactor * 38;
          const zTravel = zoomFactor * 950;

          // Wipe fade into pure dark canvas once covering screen
          const wipeFade = clamp(1 - (zoomProgress - 0.55) / 0.35, 0, 1);
          const cardRadius = clamp(16 * (1 - zoomProgress * 2.5), 0, 16);

          card.style.transform = `translate(-50%, -50%) translate3d(0px, 0px, ${zTravel}px) scale(${zoomScale})`;
          card.style.opacity = wipeFade.toFixed(3);
          card.style.zIndex = '999';
          card.style.filter = 'none';
          card.style.borderRadius = `${cardRadius}px`;
          card.style.boxShadow = `0 0 ${50 * (1 - zoomProgress)}px rgba(0,0,0,0.85)`;
          card.style.pointerEvents = 'none';
        } else {
          // Helical spiral positioning
          const offset = index - currentCenterCard;
          const angle = offset * (360 / cardsPerTurn);
          const angleRad = (angle * Math.PI) / 180;

          const x = Math.sin(angleRad) * responsiveRadius;
          const z = Math.cos(angleRad) * responsiveRadius;
          const y = offset * responsiveSpacing;

          const dist = Math.abs(offset);
          const focus = clamp(1 - dist / 2.2, 0, 1);
          const scale = (1 + (centerScale - 1) * focus) * fit;

          // Keep edge images clearly visible across the entire helix:
          // Minimum base opacity of 0.45 even at the far edges, peaking at 1.0 at the center
          const distNorm = Math.min(dist / Math.max(cardsPerTurn / 1.6, 1), 1);
          const opacity = Math.max(0.45, 1 - distNorm * 0.55);
          const blur = prefersReduced ? 0 : clamp((dist - 1.2) * edgeBlur * 0.8, 0, edgeBlur * 1.5);
          const depth = (z / responsiveRadius + 1) / 2;

          // Fade earlier cards only when zoom wipe starts
          const hideDuringZoom = isLast ? 1 : clamp(1 - zoomProgress * 3.5, 0, 1);
          const finalOpacity = (opacity * hideDuringZoom).toFixed(3);

          card.style.transform = `translate(-50%, -50%) translate3d(${x}px, ${y}px, ${z}px) scale(${scale})`;
          card.style.opacity = finalOpacity;
          card.style.filter = blur > 0.05 ? `blur(${blur.toFixed(1)}px)` : 'none';
          card.style.zIndex = String(Math.round(depth * 1000) + index);
          card.style.borderRadius = `${cardRadius}px`;
          card.style.pointerEvents = opacity > 0.35 && hideDuringZoom > 0.5 ? 'auto' : 'none';
        }
      });

      // Dark wipe layer: wipes over during zoom (0.70 -> 0.88), then smoothly fades out (0.88 -> 1.00)
      // so the next section (#skills) immediately reveals without any black block!
      if (backdropRef.current) {
        let backdropOpacity = 0;
        if (zoomProgress > 0 && zoomProgress <= 0.65) {
          backdropOpacity = clamp((zoomProgress - 0.05) / 0.40, 0, 1);
        } else if (zoomProgress > 0.65) {
          // Fade out the black overlay so the next section (#skills) reveals underneath!
          backdropOpacity = clamp(1 - (zoomProgress - 0.65) / 0.35, 0, 1);
        }
        backdropRef.current.style.opacity = backdropOpacity.toFixed(3);
      }
    };

    // GSAP ScrollTrigger Pinned Instance: significantly increased scroll distance to reduce scroll speed
    // More scroll distance gives a relaxed, cinematic pace to each card's journey
    const scrollDistanceVh = Math.max(800, count * 150);
    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: container,
        start: 'top top',
        end: `+=${scrollDistanceVh}vh`,
        pin: true,
        scrub: 1.5,
        anticipatePin: 1,
        onUpdate: (self) => {
          targetProgressRef.current = self.progress;
        },
      });
    }, container);

    // Smooth render loop with interpolation
    let frameId;
    const tick = () => {
      // Gentle smoothing factor so rapid wheel scrolling does not violently jump cards
      currentProgressRef.current += (targetProgressRef.current - currentProgressRef.current) * 0.10;
      renderCardState(currentProgressRef.current);
      frameId = requestAnimationFrame(tick);
    };
    frameId = requestAnimationFrame(tick);

    // Initial render
    renderCardState(0);

    ScrollTrigger.refresh();

    return () => {
      cancelAnimationFrame(frameId);
      ctx.revert();
    };
  }, [
    items,
    baseRadius,
    baseCardWidth,
    baseCardHeight,
    baseVerticalSpacing,
    basePerspective,
    cardsPerTurn,
    centerScale,
    cardTilt
  ]);

  return (
    <section
      id={id}
      ref={containerRef}
      className={`relative w-full h-screen bg-[#07070a] overflow-hidden select-none z-20 ${className}`}
    >
      {/* Subtle atmospheric backdrop without text */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-red-600/10 rounded-full blur-[140px]" />
        <div className="absolute bottom-10 right-10 w-[450px] h-[450px] bg-indigo-600/10 rounded-full blur-[130px]" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff04_1px,transparent_1px),linear-gradient(to_bottom,#ffffff04_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)]" />
      </div>

      {/* Pure 3D Helix Cards Stage (No text overlays) */}
      <div
        className="relative w-full h-full [transform-style:preserve-3d] flex items-center justify-center pointer-events-none"
        style={{ perspective: `${basePerspective}px` }}
      >
        {items.map((item, index) => {
          const CardTag = item.link ? 'a' : 'div';
          return (
            <CardTag
              key={item.id || index}
              href={item.link || `#project-${item.id}`}
              target={item.link?.startsWith('http') ? '_blank' : undefined}
              rel={item.link?.startsWith('http') ? 'noopener noreferrer' : undefined}
              ref={el => (cardRefs.current[index] = el)}
              className="group absolute left-1/2 top-1/2 overflow-hidden border border-white/20 shadow-2xl bg-zinc-950 will-change-transform cursor-pointer"
              style={{
                width: `${baseCardWidth}px`,
                height: `${baseCardHeight}px`,
                borderRadius: `${cardRadius}px`,
              }}
            >
              <img
                src={item.src || item.image}
                alt={item.title || `Project ${index + 1}`}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                draggable={false}
              />
              {/* Subtle glass highlight border */}
              <div
                className="absolute inset-0 border border-white/15 pointer-events-none group-hover:border-red-500/40 transition-colors"
                style={{ borderRadius: `${cardRadius}px` }}
              />
            </CardTag>
          );
        })}
      </div>

      {/* Blackout Wipe Layer */}
      <div
        ref={backdropRef}
        className="absolute inset-0 bg-[#07070a] pointer-events-none opacity-0 z-40 transition-opacity"
      />
    </section>
  );
}

