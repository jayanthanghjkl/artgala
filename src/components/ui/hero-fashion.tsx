"use client";

import React, { useState } from "react";
import { motion } from "motion/react";
import { Link } from "react-router-dom";
import TextRoll from "../common/TextRoll";

interface HeroFashionProps {
  title?: string;
  season?: string;
  tagline?: string;
  categories?: string[];
  imageUrl?: string;
  fallbackImageUrl?: string;
  showBackLink?: boolean;
}

export default function HomePage({
  title = "JAYANTHAN.S",
  season = "",
  tagline = "draws inspiration from modern web systems, redefining responsive interfaces and web applications with a nod to clean code. Builds of the collection are engineered out of robust infrastructure, crafted from full-stack components and scalable backends, deployed...",
  categories = [
    "MERN Stack",
    "React / Next.js",
    "Web Development",
    "UI & UX Design",
    "AI Exploration",
  ],
  imageUrl = "https://raw.githubusercontent.com/jayanthanghjkl/Images/refs/heads/main/IMG_20261109_165151605_HDR%7E2.jpg",
  fallbackImageUrl = "https://raw.githubusercontent.com/jayanthanghjkl/Images/refs/heads/main/IMG_20251226_223030_757.webp",
  showBackLink = true,
}: HeroFashionProps) {
  const [currentImage, setCurrentImage] = useState(imageUrl);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 0.96 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className="h-screen w-full bg-pure-white text-black relative select-text overflow-hidden flex flex-col justify-between"
    >
      {/* Top Header / Back Navigation with Slide-Down Animation */}
      {showBackLink && (
        <motion.header
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="w-full z-30 flex items-center justify-end px-6 md:px-12 pt-5 md:pt-6 pb-2 shrink-0"
        >
          <Link
            to="/"
            className="pointer-events-auto flex items-center gap-2 text-zinc-1000 hover:text-white transition-colors duration-300 font-heading text-xs sm:text-sm font-bold tracking-widest uppercase group/link  px-4 sm:px-5 py-2 sm:py-2.5"
            aria-label="Go back"
          >
            <TextRoll text="BACK" />
          </Link>
        </motion.header>
      )}

      {/* Main Screen-Fitting Container */}
      <main className="container mx-auto px-6 md:px-12 flex-1 flex items-center justify-center min-h-0 py-4">
        <div className="grid md:grid-cols-2 gap-8 lg:gap-16 items-center w-full max-h-full">
          
          {/* Visual Showcase (Animated Image & Ambient Glows) */}
          <div className="md:order-2 relative flex items-center justify-center min-h-0">
            {/* Primary soft pink ambient breathing glow */}
            <motion.div
              animate={{
                scale: [1, 1.18, 1],
                opacity: [0.25, 0.4, 0.25],
                x: [0, 8, -8, 0],
                y: [0, -8, 8, 0],
              }}
              transition={{
                duration: 7,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="absolute -z-10 w-64 h-64 lg:w-80 lg:h-80 rounded-full bg-blush-pink blur-3xl pointer-events-none"
            />

            {/* Subtle crimson ambient accent glow */}
            <motion.div
              animate={{
                scale: [1.1, 0.95, 1.1],
                opacity: [0.12, 0.22, 0.12],
              }}
              transition={{
                duration: 6,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 1,
              }}
              className="absolute -z-10 w-60 h-60 rounded-full bg-vivid-crimson/20 blur-3xl -bottom-6 -right-6 pointer-events-none"
            />

            {/* Image card with fade-up and hover zoom effect */}
            <motion.div
              initial={{ opacity: 0, scale: 0.93, y: 35 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.9, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
              className="relative rounded-[5px] overflow-hidden shadow-2xl group cursor-pointer"
            >
              <motion.img
                src={currentImage}
                alt="Portrait"
                onError={() => setCurrentImage(fallbackImageUrl)}
                whileHover={{ scale: 1.03 }}
                transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                className="rounded-[5px] object-cover filter brightness-105 transition-all duration-500 w-auto max-w-full max-h-[55vh] md:max-h-[70vh] lg:max-h-[76vh] aspect-[3/4]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/25 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-400 pointer-events-none rounded-[5px]" />
            </motion.div>
          </div>

          {/* Editorial Content Column */}
          <div className="md:order-1 flex flex-col justify-center h-full max-h-[75vh] py-2">
            <div className="flex flex-col justify-between space-y-6 lg:space-y-8 max-w-lg">
              {/* Title with smooth reveal */}
              <motion.h1
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
                className="text-5xl sm:text-6xl lg:text-7xl font-bold text-black leading-none tracking-tighter"
              >
                {title}
              </motion.h1>

              {/* Categorical List with staggered entry & hover slides */}
              <ul className="space-y-2 md:space-y-2.5 tracking-tighter text-base sm:text-lg text-black/90">
                {categories.map((item, index) => (
                  <motion.li
                    key={item}
                    initial={{ opacity: 0, x: -25 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{
                      duration: 0.6,
                      delay: 0.35 + index * 0.08,
                      ease: [0.16, 1, 0.3, 1],
                    }}
                    whileHover={{
                      x: 8,
                      transition: { duration: 0.25, ease: "easeOut" },
                    }}
                    className="group flex items-center gap-2.5 cursor-pointer select-none"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-vivid-crimson opacity-0 group-hover:opacity-100 transition-opacity duration-200 transform scale-0 group-hover:scale-100 transition-transform" />
                    <a
                      href="#"
                      className="text-zinc-700 group-hover:text-black group-hover:font-medium transition-colors duration-200 inline-block"
                      onClick={(e) => e.preventDefault()}
                    >
                      {item}
                    </a>
                  </motion.li>
                ))}
              </ul>

              {/* Season & Collection Description with animated divider */}
              <div className="pt-2 space-y-3">
                <motion.div
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ duration: 0.8, delay: 0.7, ease: [0.16, 1, 0.3, 1] }}
                  className="origin-left h-px bg-black/10 w-full"
                />

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.7, delay: 0.8, ease: [0.16, 1, 0.3, 1] }}
                >
                  {season ? (
                    <h2 className="text-xl sm:text-2xl font-medium text-black">
                      {season}
                    </h2>
                  ) : null}
                  <p className="text-sm sm:text-base text-black/80 max-w-md pt-1 tracking-tight leading-relaxed">
                    <a
                      href="https://kokonutui.com/"
                      target="_blank"
                      rel="noreferrer"
                      className="underline font-semibold hover:text-vivid-crimson transition-colors"
                    >
                      "CS student in chennai"
                    </a>{" "}
                    {tagline}
                  </p>
                </motion.div>
              </div>
            </div>
          </div>

        </div>
      </main>
      
      {/* Bottom subtle spacing buffer */}
      <div className="h-4 md:h-6 shrink-0" />
    </motion.div>
  );
}

export { HomePage };
