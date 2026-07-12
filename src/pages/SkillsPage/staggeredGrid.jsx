'use client'
import React, { useEffect, useRef } from 'react'
import gsap from 'gsap'
import ScrollTrigger from 'gsap/ScrollTrigger'
import { cn } from '../../lib/utils'
import { skillsList } from '../../data/skills'
import { FaGithub, FaJava, FaHtml5, FaCss3Alt, FaReact, FaGitAlt, FaFigma } from 'react-icons/fa'
import { SiTypescript, SiJavascript, SiNextdotjs, SiTailwindcss, SiFlutter, SiBlender, SiTurborepo, SiDart, SiPostgresql, SiGithubactions, SiVercel, SiC } from 'react-icons/si'

gsap.registerPlugin(ScrollTrigger);

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
    C: SiC,
};

// 2. MEMOIZED SKILL CARD COMPONENT WITH CURSOR PARALLAX
const SkillCard = React.memo(({ skill, Icon }) => {
    const cardRef = useRef(null);

    const handleMouseMove = (e) => {
        const card = cardRef.current;
        if (!card) return;
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        const mx = x / (rect.width / 2);
        const my = y / (rect.height / 2);
        card.style.setProperty('--mx', mx.toFixed(3));
        card.style.setProperty('--my', my.toFixed(3));
    };

    const handleMouseLeave = () => {
        const card = cardRef.current;
        if (!card) return;
        card.style.setProperty('--mx', '0');
        card.style.setProperty('--my', '0');
    };

    return (
        <div
            ref={cardRef}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            className="grid-card relative rounded-[20px] border border-white/5 overflow-hidden aspect-square flex flex-col items-center justify-center p-4 md:p-6 transition-all duration-300 ease-out group cursor-pointer hover:border-vivid-crimson/40 hover:-translate-y-1.5 hover:shadow-2xl hover:shadow-black/60 will-change-transform"
            style={{
                background: 'linear-gradient(to bottom, rgba(255, 255, 255, 0.03), rgba(219, 13, 13, 0.01))',
                boxShadow: 'inset 0 1px 0 0 rgba(255, 255, 255, 0.08), 0 4px 20px -2px rgba(0, 0, 0, 0.4)',
            }}
        >
            {/* Glow behind icon */}
            <div className="absolute w-20 h-20 md:w-24 md:h-24 rounded-full bg-vivid-crimson/10 blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 ease-out pointer-events-none left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2" />

            {/* Brightening hover overlay */}
            <div className="absolute inset-0 bg-white/[0.02] opacity-0 group-hover:opacity-100 transition-opacity duration-300 ease-out pointer-events-none" />

            {/* Watermark Label - Stationary at bottom-left */}
            <span className="absolute bottom-3 left-4 text-[9px] font-mono tracking-wider text-white opacity-10 uppercase select-none pointer-events-none z-10 group-hover:hidden">
                {skill.name}
            </span>

            {/* Inner parallax container */}
            <div
                className="w-full h-full flex flex-col items-center justify-center will-change-transform"
                style={{
                    transform: 'translate(calc(var(--mx, 0) * 4px), calc(var(--my, 0) * 4px))',
                }}
            >
                {/* Icon */}
                <div className="text-zinc-300/80 group-hover:text-vivid-crimson transform scale-[0.95] group-hover:scale-110 group-hover:-translate-y-3 transition-all duration-300 ease-out flex items-center justify-center">
                    <Icon className="w-9 h-9 md:w-10 md:h-10" />
                </div>

                {/* Hover Hidden Label */}
                <div className="absolute bottom-6 text-center opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all duration-300 pointer-events-none">
                    <span className="block text-[11px] md:text-[12px] font-bold tracking-tight text-vivid-crimson">{skill.name}</span>
                </div>
            </div>
        </div>
    );
});

SkillCard.displayName = 'SkillCard';

// 3. MAIN COMPONENT DEFINITION
export function StaggeredGrid({
    className
}) {
    const containerRef = useRef(null)
    const captionRef = useRef(null)
    const titleRef = useRef(null)
    const subtitleRef = useRef(null)
    const gridRef = useRef(null)

    // Helper logic: Splitting text for character cascades
    const splitText = (text) => {
        return text.split('').map((char, i) => (
            <span key={i} className="char inline-block" style={{ willChange: 'transform, opacity' }}>
                {char === ' ' ? '\u00A0' : char}
            </span>
        ))
    }

    // Viewport entrance animation timeline configuration via GSAP ScrollTrigger
    useEffect(() => {
        let ctx = gsap.context(() => {
            const tl = gsap.timeline({
                scrollTrigger: {
                    trigger: containerRef.current,
                    start: 'top 70%', // Play when top of section hits 70% viewport
                    toggleActions: 'play none none reverse',
                }
            });

            // Caption Entrance
            if (captionRef.current) {
                tl.fromTo(captionRef.current,
                    { opacity: 0, y: 15 },
                    { opacity: 1, y: 0, duration: 0.5, ease: 'power3.out' }
                );
            }

            // Title Characters
            if (titleRef.current) {
                const chars = titleRef.current.querySelectorAll('.char');
                tl.fromTo(chars,
                    { opacity: 0, y: 20 },
                    { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out', stagger: 0.012 },
                    '-=0.3'
                );
            }

            // Subtitle Description
            if (subtitleRef.current) {
                tl.fromTo(subtitleRef.current,
                    { opacity: 0, y: 15 },
                    { opacity: 0.7, y: 0, duration: 0.5, ease: 'power3.out' },
                    '-=0.3'
                );
            }

            // Cards Stagger
            if (gridRef.current) {
                const cards = gridRef.current.querySelectorAll('.grid-card');
                tl.fromTo(cards,
                    { opacity: 0, y: 40 },
                    { opacity: 1, y: 0, duration: 0.7, ease: 'power3.out', stagger: 0.04 },
                    '-=0.3'
                );
            }
        }, containerRef);

        return () => ctx.revert();
    }, []);

    return (
        <div
            ref={containerRef}
            className={cn(
                "relative w-full min-h-screen md:h-screen flex flex-col justify-center items-center bg-[#101010] text-white overflow-y-auto md:overflow-hidden px-4 md:px-8 py-16 md:py-0 select-none",
                className
            )}
        >

            {/* Bottom edge should fade into pure black (transition to next section) */}
            <div
                className="absolute bottom-0 left-0 right-0 h-32 md:h-40 pointer-events-none z-10"
                style={{
                    background: 'linear-gradient(to top, #000000 0%, rgba(201, 17, 17, 0) 100%)'
                }}
            />

            {/* Background Layer 1: Large radial glow from top center */}
            <div
                className="absolute inset-0 z-0 pointer-events-none"
                style={{
                    background: 'radial-gradient(circle_at_center,rgba(230, 0, 38, 0.5)_0%,transparent_60%)'
                }}
            />

            {/* Background Layer 2: Subtle Vignette */}
            <div
                className="absolute inset-0 z-0 pointer-events-none"
                style={{
                    background: 'radial-gradient(circle at center, transparent 35%, rgba(39, 1, 1, 0.51) 100%)'
                }}
            />

            {/* Background Layer 3: Soft noise texture using CSS SVG */}
            <div
                className="absolute inset-0 z-0 pointer-events-none opacity-[0.015] mix-blend-overlay"
                style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`
                }}
            />

            {/* Content Bounding Wrapper (Max Width: 1400px, Vertically Centered) */}
            <div className="relative z-20 w-full max-w-[1400px] flex flex-col items-center">

                {/* Section Header */}
                <header className="w-full text-center flex flex-col items-center">
                    <h1 ref={titleRef} className="font-heading font-black text-[10vw]">
                        {splitText("SKILLS")}
                    </h1>
                </header>

                {/* Grid Container */}
                <div
                    ref={gridRef}
                    className="grid grid-cols-4 md:grid-cols-5 lg:grid-cols-7 gap-3 md:gap-4 lg:gap-4 w-full justify-center max-w-[1200px]"
                >
                    {skillsList.map((skill) => {
                        const Icon = IconMap[skill.iconType] || FaGithub;
                        return (
                            <SkillCard
                                key={skill.name}
                                skill={skill}
                                Icon={Icon}
                            />
                        );
                    })}
                </div>

            </div>
        </div>
    )
}

export default StaggeredGrid;