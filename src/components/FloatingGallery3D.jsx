import React, { useRef, useLayoutEffect, useMemo } from 'react';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function FloatingGallery3D({ items }) {
  const containerRef = useRef(null);
  const cardsWrapperRef = useRef(null);

  // Generate Flex Grid and scatter coordinates
  const cardData = useMemo(() => {
    const seedRandom = (seed) => {
      const x = Math.sin(seed) * 10000;
      return x - Math.floor(x);
    };

    // Determine number of rows to perfectly fit 100vh
    const rows = Math.max(3, Math.ceil(Math.sqrt(items.length)));
    const heightPerItem = 100 / rows; 

    const generatedCards = items.map((item, i) => {
      const flexBasis = 15 + seedRandom(i + 1) * 20; 
      
      const scatterX = (seedRandom(i + 10) - 0.5) * 2000; 
      const scatterY = (seedRandom(i + 20) - 0.5) * 1500; 
      // Depth stagger: some are closer (-200), some are very deep (-1500)
      const scatterZ = -200 + seedRandom(i + 30) * -1300; 
      
      return {
        ...item,
        id: i,
        flexBasis,
        heightPerItem,
        scatterX, 
        scatterY,
        scatterZ,
        isWipeCard: false // Will be determined in the next step
      };
    });

    // Find the card that is naturally closest to the camera (highest scatterZ)
    let closestIndex = 0;
    let maxZ = -Infinity;
    generatedCards.forEach((c, index) => {
      if (c.scatterZ > maxZ) {
        maxZ = c.scatterZ;
        closestIndex = index;
      }
    });

    // Assign the wipe card role to the closest card
    generatedCards[closestIndex].isWipeCard = true;

    return generatedCards;
  }, [items]);

  useLayoutEffect(() => {
    if (!containerRef.current || !cardsWrapperRef.current) return;
    
    let ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top top",
          end: "+=600%", // Extended to 600% to fit the new Scramble phase
          pin: true,
          scrub: 1,
          anticipatePin: 1
        }
      });

      document.querySelectorAll(".floating-gallery-card").forEach((card, index) => {
        const data = cardData[index];
        const rotZ = (index % 2 === 0 ? 1 : -1) * (4 + index * 1.5);
        const rotY = (index % 2 === 0 ? -1 : 1) * 8;

        gsap.set(card, { transformPerspective: 1000, clipPath: 'inset(0% 0% 0% 0%)' });

        // Phase 1: Scrambled -> Grid (0.0 to 1.0)
        // Animating FROM random chaotic positions INTO their natural CSS Flex grid layout
        tl.from(card, {
          x: (Math.random() - 0.5) * 3000,
          y: (Math.random() - 0.5) * 2000,
          z: (Math.random() - 0.5) * 1000 - 1000,
          rotationZ: (Math.random() - 0.5) * 180,
          rotationY: (Math.random() - 0.5) * 180,
          opacity: 0,
          duration: 1,
          ease: "power3.out"
        }, 0);

        // Phase 2: Grid -> Scatter (1.5 to 2.5)
        tl.to(card, {
          x: data.scatterX,
          y: data.scatterY,
          z: data.scatterZ,
          rotationZ: rotZ * 0.4,
          rotationY: rotY * 0.5,
          duration: 1,
          ease: "power2.inOut"
        }, 1.5);

        // Phase 3: Fly through (2.7 to 4.2)
        tl.to(card, {
          z: data.isWipeCard ? 950 : data.scatterZ + 1500, // Wipe card stops exactly at lens
          x: data.isWipeCard ? 0 : data.scatterX, 
          y: data.isWipeCard ? 0 : data.scatterY - 200, 
          rotationZ: data.isWipeCard ? 0 : rotZ, 
          rotationY: data.isWipeCard ? 0 : rotY,
          opacity: data.isWipeCard ? 1 : 0, 
          scale: data.isWipeCard ? 4 : 1, // Massive scale to completely cover the screen
          duration: 1.5,
          ease: "power2.in"
        }, 2.7); 
        
        // Phase 4: Object Wipe Transition (4.2 to 4.7)
        if (data.isWipeCard) {
          gsap.set(card, { clipPath: 'inset(0% 0% 0% 0%)' });
          tl.to(card, {
            x: "-300vw", // Slides completely off the left side of the screen
            duration: 0.5,
            ease: "power2.inOut"
          }, 4.2);
        }
      });

      // Phase 5: Text reveal (4.5 to 5.0)
      tl.fromTo(".center-quote", 
        { filter: "blur(20px)", opacity: 0, scale: 0.8 },
        { filter: "blur(0px)", opacity: 1, scale: 1, duration: 0.5, ease: "power2.out" }, 
        4.5
      );

      // Phase 6: Text scales out and disappears (5.5 to 6.0)
      tl.fromTo(".center-quote", 
        { filter: "blur(0px)", opacity: 1, scale: 1 },
        { filter: "blur(12px)", opacity: 0, scale: 1.5, duration: 0.5, ease: "power2.in", immediateRender: false }, 
        5.5
      );

      tl.set({}, {}, 6.5);
    }, containerRef);

    const onMouseMove = (e) => {
      const x = (e.clientX / window.innerWidth - 0.5) * 30;
      const y = (e.clientY / window.innerHeight - 0.5) * 30;

      gsap.to(cardsWrapperRef.current, {
        rotationY: x,
        rotationX: -y,
        duration: 1,
        ease: "power2.out"
      });
    };
    
    window.addEventListener("mousemove", onMouseMove);

    return () => {
      ctx.revert();
      window.removeEventListener("mousemove", onMouseMove);
    };
  }, [cardData]);

  return (
    <section 
      ref={containerRef} 
      className="relative w-full h-screen overflow-hidden flex items-center justify-center bg-[#080808] font-sans"
      style={{ perspective: '1000px' }}
    >
      
      {/* Background gradients */}
      <div className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(circle at center, #1a1a1a 0%, #080808 70%)' }} />

      {/* Center Quote - Will be revealed by the object wipe */}
      <h2 className="center-quote absolute z-10 text-[clamp(1.5rem,3.5vw,3rem)] font-light text-center max-w-[800px] leading-[1.4] pointer-events-none text-zinc-300">
        Every project represents a <br/>
        <span className="quote-highlight inline-block">
          relentless pursuit of perfection and aesthetic.
        </span>
      </h2>

      {/* Flex Perfect-Fill Wrapper */}
      <div 
        ref={cardsWrapperRef} 
        className="absolute inset-0 w-full h-[100vh] flex flex-wrap content-start pointer-events-none" 
        style={{ transformStyle: 'preserve-3d' }}
      >
        {cardData.map((card) => (
          <div 
            key={card.id}
            className="floating-gallery-card relative overflow-hidden bg-zinc-900"
            style={{
              transformStyle: 'preserve-3d',
              willChange: 'transform, opacity, clip-path',
              zIndex: card.isWipeCard ? 50 : 1,
              flexGrow: 1,
              flexBasis: `${card.flexBasis}%`,
              height: `${card.heightPerItem}vh`,
              border: '1px solid rgba(255,255,255,0.05)'
            }}
          >
            <img 
              src={card.image} 
              alt={card.text || card.title} 
              className="w-full h-full object-cover block"
            />
          </div>
        ))}
      </div>
    </section>
  );
}
