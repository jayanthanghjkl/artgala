"use client"

import React, { useEffect } from "react"
import { motion, stagger, useAnimate, useInView } from "motion/react"

import Floating, {
  FloatingElement,
} from "@/components/ui/parallax-floating"
import { projectsList } from "@/data/projects"

// Extract curated projects with images
const galleryProjects = projectsList.filter(p => p.image)

const Preview = ({ isActive }: { isActive?: boolean }) => {
  const [scope, animate] = useAnimate()
  const isInView = useInView(scope, { amount: 0.5, once: false })
  const isTriggered = isActive !== undefined ? isActive : isInView

  useEffect(() => {
    if (isTriggered) {
      // 1. Forward animation: Staggered card entrance ascending from the bottom
      animate(
        ".floating-card-item",
        {
          opacity: [0, 1],
          scale: [0.6, 1],
          y: [380, 0],
          rotate: [-6, 0]
        },
        {
          duration: 1.15,
          delay: stagger(0.1, { startDelay: 0.05, from: "first" }),
          ease: [0.16, 1, 0.3, 1]
        }
      )

      // 2. Center manifesto text reveal
      animate(
        ".about-me-content",
        {
          opacity: [0, 1],
          y: [40, 0],
          scale: [0.96, 1]
        },
        {
          duration: 0.9,
          delay: 0.25,
          ease: [0.16, 1, 0.3, 1]
        }
      )
    } else {
      // Reverse animation: Staggered retreat back down to the bottom when scrolled away
      animate(
        ".floating-card-item",
        {
          opacity: [1, 0],
          scale: [1, 0.6],
          y: [0, 380],
          rotate: [0, -6]
        },
        {
          duration: 0.75,
          delay: stagger(0.06, { from: "last" }),
          ease: [0.4, 0, 0.2, 1]
        }
      )

      animate(
        ".about-me-content",
        {
          opacity: 0,
          y: 40,
          scale: 0.96
        },
        {
          duration: 0.4,
          ease: "easeOut"
        }
      )
    }
  }, [isTriggered, animate])

  return (
    <div
      className="relative flex w-full h-full min-h-[750px] md:min-h-[850px] justify-center items-center overflow-hidden select-none"
      ref={scope}
    >
      {/* Center Manifesto Callout */}
      <div className="about-me-content z-50 text-center items-center flex flex-col pointer-events-auto px-6 opacity-0 max-w-2xl">
        <p className="text-xl md:text-3xl text-zinc-100 font-heading font-light tracking-tight leading-relaxed drop-shadow-[0_10px_35px_rgba(0,0,0,0.9)]">
          Every project represents a relentless pursuit of perfection and aesthetic
        </p>
      </div>

      {/* Parallax Floating Stage with Responsive Multi-Depth Cards */}
      <Floating sensitivity={-1.2} easingFactor={0.05} className="overflow-hidden">
        {/* Project 1: Lumina AI */}
        <FloatingElement depth={0.6} className="top-[6%] left-[8%]">
          <div className="floating-card-item opacity-0 will-change-transform">
            <a href={`#project-${galleryProjects[0]?.id || 1}`} className="group block relative">
              <img
                src={galleryProjects[0]?.image}
                alt={galleryProjects[0]?.title || "Project 1"}
                className="w-28 h-28 md:w-48 md:h-48 rounded-2xl md:rounded-3xl object-cover border border-white/15 shadow-2xl group-hover:scale-105 group-hover:border-red-500/40 duration-300 cursor-pointer transition-all"
              />
            </a>
          </div>
        </FloatingElement>

        {/* Project 2: Nexus Platform */}
        <FloatingElement depth={1.2} className="top-[8%] left-[30%]">
          <div className="floating-card-item opacity-0 will-change-transform">
            <a href={`#project-${galleryProjects[1]?.id || 2}`} className="group block relative">
              <img
                src={galleryProjects[1]?.image}
                alt={galleryProjects[1]?.title || "Project 2"}
                className="w-36 h-36 md:w-56 md:h-56 rounded-2xl md:rounded-3xl object-cover border border-white/15 shadow-2xl group-hover:scale-105 group-hover:border-red-500/40 duration-300 cursor-pointer transition-all"
              />
            </a>
          </div>
        </FloatingElement>

        {/* Project 3: Orbit Engine - Tall Showcase */}
        <FloatingElement depth={2.2} className="top-[2%] left-[55%]">
          <div className="floating-card-item opacity-0 will-change-transform">
            <a href={`#project-${galleryProjects[2]?.id || 3}`} className="group block relative">
              <img
                src={galleryProjects[2]?.image}
                alt={galleryProjects[2]?.title || "Project 3"}
                className="w-44 h-60 md:w-68 md:h-84 rounded-3xl object-cover border border-white/15 shadow-2xl group-hover:scale-105 group-hover:border-red-500/40 duration-300 cursor-pointer transition-all"
              />
            </a>
          </div>
        </FloatingElement>

        {/* Project 4: SwiftPay */}
        <FloatingElement depth={1.0} className="top-[2%] left-[80%]">
          <div className="floating-card-item opacity-0 will-change-transform">
            <a href={`#project-${galleryProjects[3]?.id || 4}`} className="group block relative">
              <img
                src={galleryProjects[3]?.image}
                alt={galleryProjects[3]?.title || "Project 4"}
                className="w-36 h-36 md:w-56 md:h-56 rounded-2xl md:rounded-3xl object-cover border border-white/15 shadow-2xl group-hover:scale-105 group-hover:border-red-500/40 duration-300 cursor-pointer transition-all"
              />
            </a>
          </div>
        </FloatingElement>

        {/* Project 5: Zenith CRM */}
        <FloatingElement depth={1.4} className="top-[42%] left-[3%]">
          <div className="floating-card-item opacity-0 will-change-transform">
            <a href={`#project-${galleryProjects[4]?.id || 6}`} className="group block relative">
              <img
                src={galleryProjects[4]?.image}
                alt={galleryProjects[4]?.title || "Project 5"}
                className="w-40 h-40 md:w-64 md:h-64 rounded-3xl object-cover border border-white/15 shadow-2xl group-hover:scale-105 group-hover:border-red-500/40 duration-300 cursor-pointer transition-all"
              />
            </a>
          </div>
        </FloatingElement>

        {/* Project 6: Aura Workspace */}
        <FloatingElement depth={2.4} className="top-[60%] left-[72%]">
          <div className="floating-card-item opacity-0 will-change-transform">
            <a href={`#project-${galleryProjects[5]?.id || 7}`} className="group block relative">
              <img
                src={galleryProjects[5]?.image}
                alt={galleryProjects[5]?.title || "Project 6"}
                className="w-44 h-44 md:w-68 md:h-76 rounded-3xl object-cover border border-white/15 shadow-2xl group-hover:scale-105 group-hover:border-red-500/40 duration-300 cursor-pointer transition-all"
              />
            </a>
          </div>
        </FloatingElement>

        {/* Project 7: Pulse Sync - Large Showcase */}
        <FloatingElement depth={3.8} className="top-[65%] left-[12%]">
          <div className="floating-card-item opacity-0 will-change-transform">
            <a href={`#project-${galleryProjects[6]?.id || 8}`} className="group block relative">
              <img
                src={galleryProjects[6]?.image}
                alt={galleryProjects[6]?.title || "Project 7"}
                className="w-56 md:w-88 h-44 md:h-68 rounded-3xl object-cover border border-white/15 shadow-2xl group-hover:scale-105 group-hover:border-red-500/40 duration-300 cursor-pointer transition-all"
              />
            </a>
          </div>
        </FloatingElement>

        {/* Project 8: Nova Shell */}
        <FloatingElement depth={1.1} className="top-[72%] left-[45%]">
          <div className="floating-card-item opacity-0 will-change-transform">
            <a href={`#project-${galleryProjects[7]?.id || 9}`} className="group block relative">
              <img
                src={galleryProjects[7]?.image}
                alt={galleryProjects[7]?.title || "Project 8"}
                className="w-36 h-36 md:w-56 md:h-56 rounded-2xl md:rounded-3xl object-cover border border-white/15 shadow-2xl group-hover:scale-105 group-hover:border-red-500/40 duration-300 cursor-pointer transition-all"
              />
            </a>
          </div>
        </FloatingElement>
      </Floating>
    </div>
  )
}

export { Preview }
export default Preview
