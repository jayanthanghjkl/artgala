"use client";

import React from "react";
import { motion } from "framer-motion";
import { ArrowLeft, ArrowUpRight } from "lucide-react";
import { Link } from "react-router-dom";
import TiltedCard from "./TiltedCard";

export default function HeroFashion() {
  const disciplines = [
    "Full-Stack Development",
    "Interactive 3D Experiences",
    "Creative Engineering",
    "Generative AI & LLMs",
    "Visual Identity & UI/UX",
  ];

  return (
    <div className="min-h-screen bg-[#0a0a0c] text-white selection:bg-[#e60026] selection:text-white relative overflow-hidden flex flex-col justify-center">
      {/* Background Ambient Glows */}
      <div className="absolute top-1/4 -right-20 w-[500px] h-[500px] rounded-full bg-[#e60026]/15 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-10 -left-20 w-[450px] h-[450px] rounded-full bg-[#7b61ff]/10 blur-[140px] pointer-events-none" />

      {/* Top Navigation */}
      <header className="absolute top-0 left-0 w-full z-30 flex items-center justify-between px-6 md:px-12 py-6 md:py-8 pointer-events-none">
        <Link
          to="/"
          className="pointer-events-auto flex items-center gap-2 text-zinc-300 hover:text-white transition-all duration-300 font-body text-xs md:text-sm font-semibold tracking-widest uppercase group bg-black/40 hover:bg-black/60 px-5 py-2.5 rounded-full backdrop-blur-md border border-white/10 hover:border-white/25 shadow-lg"
        >
          <ArrowLeft className="w-4 h-4 transition-transform duration-300 group-hover:-translate-x-1" />
          Back
        </Link>
        <span className="font-heading text-sm md:text-base font-bold tracking-[0.25em] text-zinc-400 uppercase">
          Info & About
        </span>
        <div className="w-[88px]" />
      </header>

      {/* Main Content Layout */}
      <main className="container mx-auto px-6 md:px-12 py-24 md:py-32 relative z-10">
        <div className="grid md:grid-cols-2 gap-12 lg:gap-16 items-center">

          {/* Visual Showcase (Tilted Card) */}
          <div className="md:order-2 relative flex items-center justify-center">
            <div className="absolute -z-10 w-80 h-80 rounded-full bg-[#e60026]/20 blur-3xl -top-10 -left-10 pointer-events-none"></div>
            <TiltedCard
              imageSrc="https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=1200&auto=format&fit=crop"
              altText="Jayantha - Creative Portfolio Portrait"
              captionText="Jayantha / Art Direction 2025"
              containerHeight="560px"
              containerWidth="100%"
              imageHeight="540px"
              imageWidth="100%"
              rotateAmplitude={12}
              scaleOnHover={1.05}
              showMobileWarning={false}
              showTooltip={true}
              displayOverlayContent={true}
              overlayContent={
                <div className="w-full h-full flex flex-col justify-end p-6 pointer-events-none rounded-[15px] bg-gradient-to-t from-black/85 via-transparent to-transparent">
                  <div className="flex items-center justify-between text-xs font-mono tracking-widest text-zinc-300">
                    <span className="bg-black/60 px-2.5 py-1 rounded-full border border-white/10 backdrop-blur-md">PORTFOLIO EDITORIAL</span>
                    <span className="text-[#e60026] font-semibold">VOL. 2025</span>
                  </div>
                </div>
              }
            />
          </div>

          {/* Editorial Content */}
          <div className="md:order-1 flex flex-col justify-between h-full space-y-8 md:space-y-12">
            <div>
              <span className="text-xs font-mono uppercase tracking-[0.25em] text-[#e60026] mb-3 block">
                Art Direction & Engineering
              </span>
              <h1 className="text-5xl md:text-7xl lg:text-8xl font-heading font-extrabold text-white tracking-tight leading-[0.95]">
                Jayantha.
              </h1>
            </div>

            {/* List of Disciplines / Domains */}
            <ul className="space-y-3 font-heading tracking-tight text-xl md:text-2xl text-zinc-300">
              {disciplines.map((item, index) => (
                <motion.li
                  key={item}
                  initial={{ opacity: 0.7 }}
                  whileHover={{
                    opacity: 1,
                    x: 6,
                    color: "#ffffff",
                    transition: { duration: 0.25, ease: "easeOut" },
                  }}
                  className="flex items-center gap-3 cursor-default"
                >
                  <span className="text-xs font-mono text-[#e60026] opacity-70">
                    0{index + 1}
                  </span>
                  <span>{item}</span>
                </motion.li>
              ))}
            </ul>

            {/* Narrative & Bio Section */}
            <div className="pt-4 border-t border-white/10 space-y-4">
              <h2 className="text-xs font-mono uppercase tracking-[0.2em] text-zinc-400">
                Creative Overview
              </h2>
              <p className="text-base md:text-lg text-zinc-300 max-w-lg leading-relaxed font-body">
                Bridging contemporary aesthetic design with high-performance computational
                engineering. Crafting WebGL shaders, fluid motion, and bespoke digital artifacts
                that redefine user interaction on the modern web.
              </p>

              <div className="pt-2 flex items-center gap-4">
                <Link
                  to="/work"
                  className="inline-flex items-center gap-2 bg-[#e60026] hover:bg-[#ff1a3d] text-white font-body text-xs md:text-sm font-semibold tracking-wider uppercase px-6 py-3 rounded-full transition-all duration-300 shadow-lg shadow-[#e60026]/30 group"
                >
                  View Works
                  <ArrowUpRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </Link>
                <Link
                  to="/#contact"
                  className="inline-flex items-center gap-2 bg-white/5 hover:bg-white/10 text-zinc-300 hover:text-white font-body text-xs md:text-sm font-semibold tracking-wider uppercase px-6 py-3 rounded-full transition-all duration-300 border border-white/10 hover:border-white/20"
                >
                  Get in Touch
                </Link>
              </div>
            </div>

          </div>
        </div>
      </main>
    </div>
  );
}
