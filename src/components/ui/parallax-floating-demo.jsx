import React from "react"
import Floating, { FloatingElement } from "@/components/ui/parallax-floating"
import { projectsList } from "@/data/projects"

const galleryProjects = projectsList.filter(p => p.image)
const TOTAL_CARDS = 8

function getCardStyle(progress, index) {
  // Phase 1: Slow, majestic Jump-In (0.00 -> 0.48)
  const jumpDuration = 0.38;
  const jumpStart = (index / TOTAL_CARDS) * 0.10; 
  const rawJump = (progress - jumpStart) / jumpDuration;
  const clampedJump = Math.min(1, Math.max(0, rawJump));

  // Heavy, natural cubic ease-out
  const easedJump = 1 - Math.pow(1 - clampedJump, 3);

  let yPercent = 0;
  let rotate = 0;

  if (progress < 0.48) {
    // Starts completely off-screen below and climbs slowly into resting view
    yPercent = (1 - easedJump) * 260;
    rotate = (1 - easedJump) * (index % 2 === 0 ? -8 : 8);
  } else {
    yPercent = 0;
    rotate = 0;
  }

  // Fade out cards at the very end of the POV pass as they fly past camera
  let cardOpacity = 1;
  if (progress >= 0.74) {
    const pDolly = (progress - 0.74) / 0.24;
    if (pDolly > 0.72) {
      cardOpacity = Math.max(0, 1 - (pDolly - 0.72) / 0.26);
    }
  }

  const isInteractive = progress >= 0.48 && progress < 0.74;

  return {
    transform: `translate3d(0, ${yPercent.toFixed(1)}%, 0) rotate(${rotate.toFixed(2)}deg)`,
    opacity: cardOpacity,
    pointerEvents: isInteractive ? 'auto' : 'none',
    willChange: 'transform, opacity',
    backfaceVisibility: 'hidden',
  };
}

function getTextStyle(progress) {
  // Phase 2: Fade in after cards settle (0.48 -> 0.58)
  // Phase 3: Hold / Read Buffer (0.58 -> 0.70)
  // Phase 4: Fade out upwards before POV fly-through (0.70 -> 0.74)
  let opacity = 0;
  let y = 30;
  let scale = 0.96;

  if (progress < 0.48) {
    // Hidden while cards are slowly jumping in
    opacity = 0;
    y = 30;
    scale = 0.96;
  } else if (progress >= 0.48 && progress < 0.58) {
    const t = (progress - 0.48) / 0.10;
    opacity = t;
    y = (1 - t) * 30;
    scale = 0.96 + t * 0.04;
  } else if (progress >= 0.58 && progress < 0.70) {
    opacity = 1;
    y = 0;
    scale = 1;
  } else if (progress >= 0.70 && progress < 0.74) {
    const t = (progress - 0.70) / 0.04;
    opacity = Math.max(0, 1 - t);
    y = -t * 35;
    scale = 1 - t * 0.04;
  } else {
    opacity = 0;
    y = -35;
  }

  return {
    transform: `translate3d(0, ${y.toFixed(1)}px, 0) scale(${scale.toFixed(3)})`,
    opacity,
    pointerEvents: opacity > 0.8 ? 'auto' : 'none',
    willChange: 'transform, opacity',
  };
}

export const ParallaxFloatingDemo = ({ progress = 0, isActive = true }) => {
  const effectiveProgress = typeof progress === "number" ? progress : (isActive ? 1 : 0)
  const textStyle = getTextStyle(effectiveProgress)

  // Phase 5: Camera Dolly forward continuously as cards fly towards and past camera (0.74 -> 0.98)
  const isDollyPhase = effectiveProgress >= 0.74
  const dollyProgress = Math.min(1, Math.max(0, (effectiveProgress - 0.74) / 0.24))
  const easedDolly = Math.pow(dollyProgress, 2.2) // Accelerates past camera seamlessly

  // The entire 3D world pushes forward along the Z axis right through the camera lens (up to 3200px)
  const worldZ = isDollyPhase ? easedDolly * 3200 : 0
  const worldPitch = isDollyPhase ? easedDolly * -5 : 0 // Subtle cinematic pitch

  // Stage dissolves smoothly right as cards finish flying past camera
  const stageOpacity = isDollyPhase && dollyProgress > 0.78
    ? Math.max(0, 1 - (dollyProgress - 0.78) / 0.20)
    : 1

  // Enable mouse tracking only during the settled hold window
  const isFloatingActive = effectiveProgress >= 0.48 && effectiveProgress < 0.74

  return (
    <div
      className="relative flex w-full h-full min-h-[750px] md:min-h-[850px] justify-center items-center select-none overflow-visible"
      style={{
        perspective: '800px', // Wider POV focal length (closer to 24mm cinema lens)
        perspectiveOrigin: '50% 50%',
        opacity: stageOpacity,
        willChange: 'transform, opacity'
      }}
    >
      {/* Center Manifesto Quote */}
      <div 
        className="about-me-content z-50 text-center items-center flex flex-col px-6 max-w-2xl pointer-events-none fixed"
        style={textStyle}
      >
        <p className="text-xl md:text-3xl text-zinc-100 font-heading font-light tracking-tight leading-relaxed drop-shadow-[0_10px_35px_rgba(0,0,0,0.95)]">
          Every project represents a relentless pursuit of perfection and aesthetic
        </p>
      </div>

      {/* 3D POV World Rig — This container moves toward the camera */}
      <div
        className="w-full h-full relative transform-gpu"
        style={{
          transformStyle: 'preserve-3d',
          transform: `translate3d(0, 0, ${worldZ.toFixed(1)}px) rotateX(${worldPitch.toFixed(2)}deg)`,
          willChange: 'transform'
        }}
      >
        <Floating 
          sensitivity={isFloatingActive ? -0.8 : 0} 
          easingFactor={0.04} 
          className="w-full h-full overflow-visible"
        >
          {/* Project 1: zuzz (1:1 Square) */}
          <FloatingElement depth={0.6} className="top-[6%] left-[8%] ">
            <div className="floating-card-item" style={getCardStyle(effectiveProgress, 0)}>
              <a href={`#project-${galleryProjects[0]?.id || 1}`} className="group block relative overflow-hidden rounded-sm border border-white/15 shadow-2xl bg-[#0a0306]">
                <img
                  src={galleryProjects[0]?.image}
                  alt={galleryProjects[0]?.title || "Project 1"}
                  loading="eager"
                  decoding="async"
                  className="w-32 md:w-52 aspect-square object-cover rounded-sm group-hover:scale-105 duration-300 transition-all block"
                />
              </a>
            </div>
          </FloatingElement>

          {/* Project 2: CornerStone (16:9 Widescreen) */}
          <FloatingElement depth={1.2} className="top-[8%] left-[28%]">
            <div className="floating-card-item" style={getCardStyle(effectiveProgress, 1)}>
              <a href={`#project-${galleryProjects[1]?.id || 2}`} className="group block relative overflow-hidden rounded-sm border border-white/15 shadow-2xl bg-[#0a0306]">
                <img
                  src={galleryProjects[1]?.image}
                  alt={galleryProjects[1]?.title || "Project 2"}
                  loading="eager"
                  decoding="async"
                  className="w-44 md:w-68 aspect-[16/9] object-cover rounded-sm group-hover:scale-105 duration-300 transition-all block"
                />
              </a>
            </div>
          </FloatingElement>

          {/* Project 3: artgala (16:9 Widescreen) */}
          <FloatingElement depth={2.2} className="top-[2%] left-[54%]">
            <div className="floating-card-item" style={getCardStyle(effectiveProgress, 2)}>
              <a href={`#project-${galleryProjects[2]?.id || 3}`} className="group block relative overflow-hidden rounded-sm border border-white/15 shadow-2xl bg-[#0a0306]">
                <img
                  src={galleryProjects[2]?.image}
                  alt={galleryProjects[2]?.title || "Project 3"}
                  loading="eager"
                  decoding="async"
                  className="w-48 md:w-76 aspect-[16/9] object-cover rounded-sm group-hover:scale-105 duration-300 transition-all block"
                />
              </a>
            </div>
          </FloatingElement>

          {/* Project 4: taskvault (16:9 Widescreen) */}
          <FloatingElement depth={1.0} className="top-[2%] left-[78%]">
            <div className="floating-card-item" style={getCardStyle(effectiveProgress, 3)}>
              <a href={`#project-${galleryProjects[3]?.id || 4}`} className="group block relative overflow-hidden rounded-sm border border-white/15 shadow-2xl bg-[#0a0306]">
                <img
                  src={galleryProjects[3]?.image}
                  alt={galleryProjects[3]?.title || "Project 4"}
                  loading="eager"
                  decoding="async"
                  className="w-44 md:w-68 aspect-[16/9] object-cover rounded-sm group-hover:scale-105 duration-300 transition-all block"
                />
              </a>
            </div>
          </FloatingElement>

          {/* Project 5: SmartGuard LPG (16:9 Widescreen) */}
          <FloatingElement depth={1.4} className="top-[42%] left-[3%]">
            <div className="floating-card-item" style={getCardStyle(effectiveProgress, 4)}>
              <a href={`#project-${galleryProjects[4]?.id || 5}`} className="group block relative overflow-hidden rounded-sm border border-white/15 shadow-2xl bg-[#0a0306]">
                <img
                  src={galleryProjects[4]?.image}
                  alt={galleryProjects[4]?.title || "Project 5"}
                  loading="eager"
                  decoding="async"
                  className="w-48 md:w-76 aspect-[16/9] object-cover rounded-sm group-hover:scale-105 duration-300 transition-all block"
                />
              </a>
            </div>
          </FloatingElement>

          {/* Project 6: nexus (16:9 Widescreen) */}
          <FloatingElement depth={2.4} className="top-[60%] left-[70%]">
            <div className="floating-card-item" style={getCardStyle(effectiveProgress, 5)}>
              <a href={`#project-${galleryProjects[5]?.id || 6}`} className="group block relative overflow-hidden rounded-sm border border-white/15 shadow-2xl bg-[#0a0306]">
                <img
                  src={galleryProjects[5]?.image}
                  alt={galleryProjects[5]?.title || "Project 6"}
                  loading="eager"
                  decoding="async"
                  className="w-44 md:w-68 aspect-[16/9] object-cover rounded-sm group-hover:scale-105 duration-300 transition-all block"
                />
              </a>
            </div>
          </FloatingElement>

          {/* Project 7: harmonic-waves (16:9 Widescreen) */}
          <FloatingElement depth={3.8} className="top-[65%] left-[10%]">
            <div className="floating-card-item" style={getCardStyle(effectiveProgress, 6)}>
              <a href={`#project-${galleryProjects[6]?.id || 7}`} className="group block relative overflow-hidden rounded-sm border border-white/15 shadow-2xl bg-[#0a0306]">
                <img
                  src={galleryProjects[6]?.image}
                  alt={galleryProjects[6]?.title || "Project 7"}
                  loading="eager"
                  decoding="async"
                  className="w-48 md:w-76 aspect-[16/9] object-cover rounded-sm group-hover:scale-105 duration-300 transition-all block"
                />
              </a>
            </div>
          </FloatingElement>

          {/* Project 8: bloggify (3:2 Aspect Ratio) */}
          <FloatingElement depth={1.1} className="top-[72%] left-[44%]">
            <div className="floating-card-item" style={getCardStyle(effectiveProgress, 7)}>
              <a href={`#project-${galleryProjects[7]?.id || 8}`} className="group block relative overflow-hidden rounded-sm border border-white/15 shadow-2xl bg-[#0a0306]">
                <img
                  src={galleryProjects[7]?.image}
                  alt={galleryProjects[7]?.title || "Project 8"}
                  loading="eager"
                  decoding="async"
                  className="w-44 md:w-68 aspect-[3/2] object-cover rounded-sm group-hover:scale-105 duration-300 transition-all block"
                />
              </a>
            </div>
          </FloatingElement>
        </Floating>
      </div>
    </div>
  )
}

export { ParallaxFloatingDemo as Preview }
export default ParallaxFloatingDemo
