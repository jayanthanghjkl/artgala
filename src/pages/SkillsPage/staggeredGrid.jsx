'use client'
import React, { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { cn } from '../../lib/utils'
import { skillsList } from '../../data/skills'
import AsciiHands from '../../components/common/AsciiHands'
import { 
  FaGithub, 
  FaJava, 
  FaHtml5, 
  FaCss3Alt, 
  FaReact, 
  FaGitAlt, 
  FaFigma 
} from 'react-icons/fa'
import { 
  SiTypescript, 
  SiJavascript, 
  SiNextdotjs, 
  SiTailwindcss, 
  SiFlutter, 
  SiBlender, 
  SiTurborepo, 
  SiDart, 
  SiPostgresql, 
  SiGithubactions, 
  SiVercel 
} from 'react-icons/si'

// 1. BRAND ICON REGISTRY MAP
const IconMap = {
    Java: FaJava,
    Html5: FaHtml5,
    Css3Alt: FaCss3Alt,
    React: FaReact,
    Git: FaGitAlt,
    Github: FaGithub,
    Figma: FaFigma,
    TypeScript: SiTypescript,
    JavaScript: SiJavascript,
    NextJs: SiNextdotjs,
    TailwindCSS: SiTailwindcss,
    Flutter: SiFlutter,
    Blender: SiBlender,
    Turborepo: SiTurborepo,
    Dart: SiDart,
    Postgresql: SiPostgresql,
    GithubActions: SiGithubactions,
    Vercel: SiVercel,
    C: (props) => <span className={cn("text-xs font-black font-mono tracking-tighter select-none leading-none", props.className)}>C</span>
};

// Helper component to render SVGs for the bento items
const RenderBentoIcon = ({ type }) => {
    if (type === 'languages') {
        return (
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 6.75 22.5 12l-5.25 5.25m-10.5 0L1.5 12l5.25-5.25m7.5-3-4.5 16.5" />
            </svg>
        );
    }
    if (type === 'frameworks') {
        return (
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6.429 9.75 2.25 12l4.179 2.25m11.142 0L21.75 12l-4.179-2.25M12 5.25v13.5" />
            </svg>
        );
    }
    return (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M10.343 3.94c.09-.542.56-.94 1.11-.94h1.093c.55 0 1.02.398 1.11.94l.149.894c.07.424.384.764.78.93.398.164.855.142 1.205-.108l.737-.527a1.125 1.125 0 0 1 1.45.12l.773.774c.39.389.44 1.002.12 1.45l-.527.737c-.25.35-.272.806-.107 1.204.165.397.505.71.93.78l.893.15c.543.09.94.559.94 1.109v1.094c0 .55-.397 1.02-.94 1.11l-.894.149c-.424.07-.764.383-.929.78-.165.398-.143.854.107 1.204l.527.738c.32.447.269 1.06-.12 1.45l-.774.773a1.125 1.125 0 0 1-1.449.12l-.738-.527c-.35-.25-.806-.272-1.203-.107-.398.165-.71.505-.781.929l-.149.894c-.09.542-.56.94-1.11.94h-1.094c-.55 0-1.019-.398-1.11-.94l-.148-.894c-.071-.424-.384-.764-.781-.93-.398-.164-.854-.142-1.204.108l-.738.527a1.125 1.125 0 0 1-1.448-.12l-.774-.774a1.125 1.125 0 0 1-.12-1.45l.527-.737c.25-.35.272-.806.108-1.204-.165-.397-.506-.71-.93-.78l-.894-.15c-.542-.09-.94-.56-.94-1.109v-1.094c0-.55.398-1.02.94-1.11l.894-.149c.424-.07.765-.383.93-.78.165-.398.143-.854-.108-1.204l-.526-.738a1.125 1.125 0 0 1 .12-1.45l.773-.773a1.125 1.125 0 0 1 1.45-.12l.737.527c.35.25.807.272 1.204.107.397-.165.71-.505.78-.929l.15-.894Z" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
        </svg>
    );
};

// 2. MAIN COMPONENT DEFINITION
export function StaggeredGrid({
    images = [],
    bentoItems = [],
    centerText = "Skills",
    className,
    scroller
}) {
    // 3. TARGET REFS FOR GSAP TIMELINES
    const containerRef = useRef(null) // Bounding wrapper of the section
    const gridFullRef = useRef(null)   // Grid list containing bento cards and standard brand cards
    const textRef = useRef(null)       // Split characters header container
    
    // 4. ANIMATION STATE TRIGGERS
    const [isInView, setIsInView] = useState(false)   // Toggled by IntersectionObserver for snaps
    const [activeBento, setActiveBento] = useState(0) // Tracks active index of the hovered accordion bento item

    // 5. HELPER LOGIC: Splitting text for character cascades
    const splitText = (text) => {
        return text.split('').map((char, i) => (
            <span key={i} className="char inline-block" style={{ willChange: 'transform' }}>
                {char === ' ' ? '\u00A0' : char}
            </span>
        ))
    }

    // 6. SCROLL SNAPPING VIEWPORT MONITOR
    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                setIsInView(entry.isIntersecting);
            },
            {
                root: scroller ? document.querySelector(scroller) : null,
                threshold: 0.25
            }
        )

        if (containerRef.current) observer.observe(containerRef.current);
        return () => observer.disconnect();
    }, [scroller])

    // 7. VIEWPORT-SNAP ENTRANCE TIMELINE CONFIGURATION
    useEffect(() => {
        if (!isInView) {
            if (textRef.current) {
                gsap.set(textRef.current.querySelectorAll('.char'), { yPercent: 100, autoAlpha: 0 })
            }
            if (gridFullRef.current) {
                gsap.set(gridFullRef.current.querySelectorAll('.grid__item'), { yPercent: 40, autoAlpha: 0 })
            }
            return;
        }

        let ctx = gsap.context(() => {
            const tl = gsap.timeline();

            // Text Split Entrance
            if (textRef.current) {
                tl.to(textRef.current.querySelectorAll('.char'), {
                    yPercent: 0,
                    autoAlpha: 1,
                    duration: 0.6,
                    ease: 'power3.out',
                    stagger: { each: 0.03, from: 'center' }
                });
            }

            // Columns Stagger Cascade (animates columns outwards from the middle column)
            if (gridFullRef.current) {
                const gridFullItems = gridFullRef.current.querySelectorAll('.grid__item');
                const numColumns = 7;
                const middleColumnIndex = Math.floor(numColumns / 2);

                const columns = Array.from({ length: numColumns }, () => []);
                gridFullItems.forEach((item) => {
                    const colAttr = item.getAttribute('data-col');
                    const columnIndex = colAttr !== null ? parseInt(colAttr, 10) : 0;
                    if (columns[columnIndex]) columns[columnIndex].push(item);
                });

                columns.forEach((columnItems, columnIndex) => {
                    if (columnItems.length === 0) return;
                    const delayFactor = Math.abs(columnIndex - middleColumnIndex) * 0.08;

                    tl.to(columnItems, {
                        yPercent: 0,
                        autoAlpha: 1,
                        duration: 0.7,
                        ease: 'power2.out',
                        force3D: true
                    }, `-=${0.5 - delayFactor}`);
                });
            }
        }, containerRef);

        return () => ctx.revert();
    }, [isInView]);

    // 8. MATRIX GRID CALCULATOR & BUILDER
    // Generates a dynamic array based on skillsList length, reserving index 16 for Bento and index 20 for ASCII Art
    const totalSlots = Math.max(21, skillsList.length + 4); // Added 4 for offset space (3 bento + 1 ascii)
    const mixedGridItems = Array.from({ length: totalSlots }, (_, i) => images.length > 0 ? images[i % images.length] : 'BG_IMAGE');
    mixedGridItems[16] = 'BENTO_GROUP';
    mixedGridItems[20] = 'ASCII_ART';

    return (
        <div
            ref={containerRef}
            className={cn("relative w-full h-screen max-h-screen overflow-hidden flex flex-col justify-center bg-zinc-950 px-4 md:px-8", className)}
        >
            {/* Elegant Ambient Background glow dot */}
            <div className="absolute inset-0 z-[1] pointer-events-none
                    bg-[radial-gradient(circle_at_center,rgba(230,0,38,0.05)_0%,transparent_60%)]" />

            {/* Section Header Title layout */}
            <section className="w-full max-w-5xl mx-auto text-center mt-[2vh] mb-[1vh]">
                <div ref={textRef} className="text font-bold uppercase tracking-tighter text-[clamp(2.5rem,8vw,5.5rem)] leading-none text-neutral-900 dark:text-white select-none">
                    {splitText(centerText)}
                </div>
            </section>

            {/* Viewport Constrained Grid Wrapper: Fit exactly in viewport, h-[65vh] max-h-[850px] */}
            <section className="w-full max-w-6xl mx-auto flex items-center justify-center h-[65vh] max-h-[850px]">
                <div 
                    ref={gridFullRef} 
                    className="grid--full relative w-full h-full p-2 grid gap-3 grid-cols-7 grid-rows-5 overflow-visible"
                >
                    {mixedGridItems.map((item, i) => {
                        // A: Expandable Accordion Bento Block (starts at index 16)
                        if (item === 'BENTO_GROUP') {
                            if (!bentoItems || bentoItems.length === 0) return null;

                            return (
                                <div key="bento-group" data-col={2} className="grid__item bento-container col-span-3 row-span-1 relative z-20 flex items-center justify-center gap-2.5 h-full w-full will-change-transform">
                                    {bentoItems.map((bentoItem, index) => {
                                        const isActive = activeBento === index;
                                        return (
                                            <div
                                                key={bentoItem.id}
                                                className={cn(
                                                    "relative cursor-pointer overflow-hidden rounded-xl h-full transition-all duration-700 ease-[cubic-bezier(0.25,1,0.5,1)]",
                                                    isActive ? "bg-zinc-900/10 shadow-[0_10px_30px_rgba(0,0,0,0.5)]" : "bg-zinc-900"
                                                )}
                                                style={{ width: isActive ? "64%" : "18%" }}
                                                onMouseEnter={() => setActiveBento(index)}
                                                onClick={() => setActiveBento(index)}
                                            >
                                                {/* Liquid Glass Edge border overlay */}
                                                <div className={cn(
                                                    "absolute inset-0 rounded-xl border z-50 pointer-events-none transition-colors duration-500",
                                                    isActive ? "border-zinc-500/30" : "border-zinc-800/40"
                                                )} />

                                                {/* Card Background image and gradients */}
                                                <div className="relative z-10 w-full h-full flex flex-col p-0">
                                                    <div className={cn(
                                                        "absolute inset-0 flex flex-col transition-all duration-500 ease-in-out",
                                                        isActive ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2 pointer-events-none"
                                                    )}>
                                                        <div className="absolute inset-0 bg-zinc-900 overflow-hidden z-0">
                                                            {bentoItem.image && (
                                                                <>
                                                                    <img
                                                                        src={bentoItem.image}
                                                                        alt=""
                                                                        className="absolute inset-0 w-full h-full object-cover opacity-40"
                                                                    />
                                                                    <div className="absolute bottom-0 left-0 w-full h-24 bg-gradient-to-t from-black via-black/80 to-transparent pointer-events-none" />
                                                                </>
                                                            )}
                                                        </div>

                                                        {/* Details reveal layout */}
                                                        <div className="absolute bottom-0 left-0 w-full h-16 flex flex-col justify-end p-3 z-20">
                                                            <div className="flex items-center justify-between">
                                                                <div className="flex flex-col">
                                                                    <h3 className="text-xs font-bold text-white tracking-wide">{bentoItem.title}</h3>
                                                                    <p className="text-[9px] text-zinc-400 font-medium truncate max-w-[140px] mt-0.5">{bentoItem.description}</p>
                                                                </div>
                                                                <div className="text-white/80 text-sm">
                                                                    <RenderBentoIcon type={bentoItem.iconType} />
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Closed card state view */}
                                                <div className={cn(
                                                    "absolute inset-0 flex flex-col items-center justify-center gap-1.5 transition-all duration-500",
                                                    isActive ? "opacity-0 scale-90 pointer-events-none" : "opacity-100 scale-100"
                                                )}>
                                                    <div className="text-zinc-500">
                                                        <RenderBentoIcon type={bentoItem.iconType} />
                                                    </div>
                                                    <span className="text-[8px] font-bold text-zinc-500 tracking-wider uppercase hidden md:block">{bentoItem.title}</span>
                                                </div>
                                            </div>
                                        )
                                    })}
                                </div>
                            )
                        }

                        // B: Interactive ASCII Art dedicated CRT Monitor Card (Slot 20)
                        if (item === 'ASCII_ART') {
                            return (
                                <figure key="ascii-art-card" data-col={6} className="grid__item m-0 relative z-10 will-change-[transform,opacity]">
                                    <div className="grid__item-img w-full h-full rounded-xl overflow-hidden border border-zinc-800 bg-black flex items-center justify-center transition-all duration-500 ease-out group cursor-crosshair hover:border-vivid-crimson">
                                        <AsciiHands opacity={0.8} />
                                        {/* Subtle terminal header overlay */}
                                        <div className="absolute top-2 left-3 flex items-center gap-1.5 z-20 pointer-events-none opacity-40 group-hover:opacity-100 transition-opacity">
                                            <div className="w-1.5 h-1.5 rounded-full bg-vivid-crimson animate-pulse" />
                                            <span className="text-[7px] font-mono uppercase tracking-wider text-white">ASCII_SYS</span>
                                        </div>
                                    </div>
                                </figure>
                            );
                        }

                        // Skip rendering indices that overlap with Bento Group span (17, 18)
                        if (i === 17 || i === 18) return null;

                        // C: Standard Grid Cards (populates brand icons dynamically from skills.js config)
                        // Maps around BENTO_GROUP (offset 3) and ASCII_ART (offset 1)
                        let skillIndex = i;
                        if (i < 16) {
                            skillIndex = i;
                        } else if (i === 19) {
                            skillIndex = 16;
                        } else {
                            skillIndex = i - 4;
                        }

                        const skill = skillsList[skillIndex % skillsList.length];
                        if (!skill) return null;
                        
                        const Icon = IconMap[skill.iconType] || FaGithub;
                        const label = skill.name;

                        return (
                            <figure key={`img-${i}`} data-col={i % 7} className="grid__item m-0 relative z-10 will-change-[transform,opacity]">
                                <div className="grid__item-img w-full h-full rounded-xl overflow-hidden border border-zinc-200 dark:border-zinc-900 bg-zinc-100 dark:bg-zinc-900/60 flex items-center justify-center transition-all duration-500 ease-out group cursor-pointer hover:border-vivid-crimson">
                                    <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/80 to-black opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-0" />
                                    <div className="relative z-10 flex flex-col items-center justify-center gap-2">
                                        <div className="text-zinc-400 dark:text-zinc-600 transition-all duration-300 group-hover:text-vivid-crimson group-hover:scale-105">
                                            <Icon className="w-5 h-5" />
                                        </div>
                                        <div className="text-center opacity-0 group-hover:opacity-100 transform translate-y-1 group-hover:translate-y-0 transition-all text-vivid-crimson duration-300">
                                            <span className="block text-[9px] font-bold tracking-tight">{label}</span>
                                        </div>
                                    </div>
                                </div>
                            </figure>
                        )
                    })}
                </div>
            </section >
        </div >
    )
}

export default StaggeredGrid;