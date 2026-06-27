import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { HugeiconsIcon } from "@hugeicons/react";
import { ArrowRight01Icon, ArrowUpRight01Icon } from "@hugeicons/core-free-icons";
import { supabase } from "../../../lib/supabaseClient";

export default function Footer25() {
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Handles form submission via Supabase or falls back to Mailto if keys are missing
  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    
    // Get the email input value safely
    const emailInput = e.target.elements.email;
    const email = emailInput ? emailInput.value : "";
    if (!email) return;
    
    setIsSubmitting(true);

    // FALLBACK PATH: If Supabase env keys are not configured, use local mail client
    if (!supabase) {
      const subject = encodeURIComponent("Thank you for showing interest in my portfolio!");
      const body = encodeURIComponent(
        `Hi there,\n\nThank you for visiting my portfolio and showing interest!\n\nIf you have any questions or projects you would like to discuss, please feel free to write back directly to this email or reply to jayanthansathiyapal@gmail.com.\n\nBest regards,\nJayanthan Sathiyapal`
      );
      
      const mailtoUrl = `mailto:${email}?cc=jayanthansathiyapal@gmail.com&subject=${subject}&body=${body}`;
      
      const tempLink = document.createElement("a");
      tempLink.href = mailtoUrl;
      tempLink.style.display = "none";
      document.body.appendChild(tempLink);
      tempLink.click();
      
      setTimeout(() => {
        document.body.removeChild(tempLink);
      }, 100);

      setToastMessage("Redirected to Mail Client. (Please add Supabase keys to your .env to automate this!)");
      setShowToast(true);
      setIsSubmitting(false);
      
      setTimeout(() => {
        setShowToast(false);
      }, 7000);
      return;
    }

    // SUPABASE INTEGRATED PATH
    try {
      // 1. Insert into contacts table (saves the subscriber email to your database)
      await supabase.from('contacts').insert([{ email }]);

      // 2. Trigger Supabase Authentication signup which automatically sends verification mail to the subscriber
      const { error: authError } = await supabase.auth.signUp({
        email,
        password: 'TemporaryPassword123!', // Dummy password for account generation
      });

      if (authError) throw authError;

      setToastMessage("Success! Welcome email triggered. Please check your inbox!");
      setShowToast(true);
      if (emailInput) emailInput.value = ""; // Clear input
    } catch (err) {
      console.error("Supabase Error:", err);
      setToastMessage(`Error: ${err.message || 'Could not trigger Supabase mail'}`);
      setShowToast(true);
    } finally {
      setIsSubmitting(false);
      setTimeout(() => {
        setShowToast(false);
      }, 7000);
    }
  };

  return (
    <footer className="relative flex min-h-screen w-full flex-col justify-between overflow-hidden bg-black text-[#FAFAFA] font-sans antialiased selection:bg-[#FAFAFA] selection:text-black">
      
      {/* 1. CONSISTENT RED AMBIENT GLOW BACKDROP */}
      <div className="absolute inset-0 z-0 bg-black overflow-hidden">
        {/* Deep Red Radial Glow Blobs */}
        <div className="absolute -bottom-48 -left-48 w-[600px] h-[600px] rounded-full bg-[#e60026]/20 blur-[150px] pointer-events-none" />
        <div className="absolute -bottom-48 -right-48 w-[600px] h-[600px] rounded-full bg-[#e60026]/15 blur-[150px] pointer-events-none" />
        {/* Bottom vertical red fading gradient */}
        <div className="absolute bottom-0 left-0 w-full h-[50vh] bg-gradient-to-t from-[#e60026]/10 to-transparent pointer-events-none" />
      </div>

      {/* Main Content Container */}
      <div className="relative z-10 mx-auto flex w-full max-w-[1400px] flex-1 flex-col justify-between px-6 py-16 md:px-12 md:py-20 lg:py-24">
        
        {/* Top Section */}
        <div className="flex flex-col gap-16 md:flex-row md:justify-between lg:gap-24">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col gap-4"
          >
            <a href="#about" className="text-3xl font-semibold tracking-tight transition-opacity hover:text-vivid-crimson cursor-pointer sm:text-4xl">About</a>
            <a href="#skills" className="text-3xl font-semibold tracking-tight transition-opacity hover:text-vivid-crimson cursor-pointer sm:text-4xl">Skills</a>
            <a href="#projects" className="text-3xl font-semibold tracking-tight transition-opacity hover:text-vivid-crimson cursor-pointer sm:text-4xl">Projects</a>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false }}
            transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="flex w-full max-w-sm flex-col md:max-w-md"
          >
            <p className="mb-8 text-xl text-zinc-200 md:text-2xl">
              Let's connect and build something <br className="hidden sm:block" /> meaningful together.
            </p>
            
            {/* Direct Email Submission Form */}
            <form 
              onSubmit={handleEmailSubmit}
              className="relative flex items-center justify-between border-b border-white/20 pb-4 transition-colors focus-within:border-white"
            >
              <input
                type="email"
                name="email"
                required
                disabled={isSubmitting}
                placeholder={isSubmitting ? "Submitting..." : "Email address"}
                className="w-full bg-transparent text-lg text-white placeholder-zinc-500 outline-none disabled:opacity-50"
              />
              <button
                type="submit"
                disabled={isSubmitting}
                className="text-zinc-400 transition-colors hover:text-white cursor-pointer disabled:opacity-50"
              >
                {isSubmitting ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <HugeiconsIcon icon={ArrowRight01Icon} className="size-6" />
                )}
              </button>
            </form>
          </motion.div>
        </div>

        {/* Middle Section (Socials) */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: false }}
          transition={{ duration: 1, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="mt-24 mb-16 flex items-center justify-between"
        >
          {/* Horizontal line extending from the left */}
          <div className="hidden h-px flex-1 bg-white/20 md:block md:mr-16 lg:mr-32" />
          
          <div className="flex w-full flex-wrap items-center justify-between gap-6 md:w-auto md:justify-end sm:gap-8 lg:gap-12">
            {[
              { name: "GITHUB", href: "https://github.com/jayanthanghjkl" },
              { name: "LINKEDIN", href: "https://www.linkedin.com/in/jayanthan-s-724b64325" },
              { name: "GMAIL", href: "mailto:jayanthansathiyapal@gmail.com" }
            ].map((social) => (
              <a
                key={social.name}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center gap-2 text-xs font-bold tracking-[0.15em] text-zinc-200 transition-colors hover:text-vivid-crimson sm:text-sm"
              >
                {social.name}
                <HugeiconsIcon
                  icon={ArrowUpRight01Icon}
                  className="size-4 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                />
              </a>
            ))}
          </div>
        </motion.div>

        {/* Bottom Section (Massive Logo) */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false }}
          transition={{ duration: 1.2, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className="mt-auto mb-10 w-full"
        >
          <svg 
            viewBox="0 0 1040 200" 
            className="h-auto w-full fill-current text-white" 
            aria-hidden="true"
            preserveAspectRatio="xMidYMid meet"
          >
            <path d="M0 0 H200 V200 H160 V68 L28 200 L0 172 L132 40 H0 V0 Z" />
            <text 
              x="245" 
              y="175" 
              fontSize="160" 
              fontWeight="black" 
              fontFamily="inherit" 
              letterSpacing="-0.03em"
              textLength="795"
            >
              JAYANTHAN
            </text>
          </svg>
          <h1 className="sr-only">JAYANTHAN</h1>
        </motion.div>

        {/* Footer Meta */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: false }}
          transition={{ duration: 1, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-col items-start justify-between gap-4 text-white md:flex-row md:items-end"
        >
          <p className="max-w-3xl leading-relaxed text-sm text-zinc-400">
            © 2026 Jayanthan Sathiyapal. All rights reserved. <br /> Built with React, GSAP, Tailwind CSS, and Framer Motion.
          </p>
          <div className="flex items-center gap-8 whitespace-nowrap font-medium text-sm text-zinc-400">
            <a href="mailto:jayanthansathiyapal@gmail.com" className="transition-colors hover:text-white">Email Me</a>
            <a href="https://github.com/jayanthanghjkl" className="transition-colors hover:text-white">GitHub profile</a>
          </div>
        </motion.div>

      </div>

      {/* Floating Glassmorphic Toaster Notification */}
      <AnimatePresence>
        {showToast && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="fixed bottom-6 right-6 z-[999] max-w-sm p-4 bg-zinc-950/95 border border-zinc-800 rounded-xl shadow-[0_20px_50px_rgba(0,0,0,0.8)] backdrop-blur-md flex gap-3 items-start select-none"
          >
            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-vivid-crimson/10 flex items-center justify-center text-vivid-crimson text-sm">
              ✉️
            </div>
            <div className="flex flex-col flex-1 min-w-0 pr-2">
              <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-0.5">Status Update</h4>
              <p className="text-[10px] text-zinc-400 leading-normal">
                {toastMessage}
              </p>
            </div>
            <button 
              onClick={() => setShowToast(false)}
              className="text-zinc-500 hover:text-white text-xs cursor-pointer focus:outline-none transition-colors"
            >
              ✕
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </footer>
  );
}
