"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence, useScroll, useMotionValueEvent } from "framer-motion";

interface InvitationCoverProps {
  bride: string;
  groom: string;
  onOpen: () => void;
  forcedOpen?: boolean;
  variant?: 'default' | 'premium' | 'ultra-luxury' | 'cinematic' | 'majestic' | 'renaissance';
  guestName?: string;
  imageUrl?: string;
}

export default function InvitationCover({ bride, groom, onOpen, forcedOpen = false, variant = 'default', guestName, imageUrl }: InvitationCoverProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [manualName, setManualName] = useState("");
  const [showInput, setShowInput] = useState(!guestName);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const handleOpen = () => {
    setIsOpen(true);
    onOpen(); // Trigger music playback in parent
  };

  const currentGuestName = guestName || manualName;

  const [isEditingName, setIsEditingName] = useState(false);

  const handleNameSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (manualName.trim()) {
      setIsEditingName(false);
    }
  };

  const isActuallyOpen = isOpen || forcedOpen;

  // -------------------------
  // VARIANT: RENAISSANCE
  // -------------------------
  if (variant === 'renaissance') {
    return (
      <AnimatePresence>
        {!isActuallyOpen && (
          <motion.div 
            initial={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 1.1 }}
            transition={{ duration: 1.5, ease: "easeInOut" }}
            className="fixed inset-0 z-[9999] bg-[#F5EFE6] flex flex-col items-center justify-center overflow-hidden"
          >
            {/* Soft Botanical Overlay */}
            <div className="absolute inset-0 opacity-[0.08] bg-[url('/assets/renaissance/garden-bg.webp')] bg-cover mix-blend-multiply"></div>
            
            <div className="relative z-10 text-center px-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 2 }}
                className="mb-12"
              >
                <div className="w-20 h-[1px] bg-[#3D3229]/20 mx-auto mb-10"></div>
                <p className="text-[#8B7355] uppercase tracking-[0.4em] text-[10px] mb-8 font-bold">The Fine Art of Love</p>
                <h1 className="font-serif text-3xl sm:text-5xl md:text-8xl text-[#3D3229] mb-4 italic leading-tight">
                   {bride} <span className="text-[#B8963E]">&</span> {groom}
                </h1>
                <div className="w-20 h-[1px] bg-[#3D3229]/20 mx-auto mt-10"></div>
              </motion.div>

              <motion.button
                onClick={handleOpen}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-12 py-4 bg-[#8B7355] text-white font-serif italic text-sm tracking-widest transition-all duration-700 shadow-lg"
              >
                Untie the Ribbon
              </motion.button>
              
              <p className="text-[#7A6E62] text-[10px] mt-12 uppercase tracking-[0.3em] font-light italic">A Garden Celebration</p>
            </div>
            
            {/* Paper Grain */}
            <div className="absolute inset-0 pointer-events-none opacity-[0.05] bg-[url('/assets/noise.png')]"></div>
          </motion.div>
        )}
      </AnimatePresence>
    );
  }

  // -------------------------
  // VARIANT: MAJESTIC
  // -------------------------
  if (variant === 'majestic') {
    return (
      <AnimatePresence>
        {!isActuallyOpen && (
          <motion.div 
            initial={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 1.1 }}
            transition={{ duration: 1.5 }}
            className="fixed inset-0 z-[9999] bg-[#0A1C14] flex flex-col items-center justify-center overflow-hidden"
          >
            {/* Gate Leaves for Exit Animation */}
            <motion.div 
              exit={{ rotateY: -110, x: "-100%", opacity: 0 }}
              transition={{ duration: 2, ease: [0.22, 1, 0.36, 1] }}
              className="absolute inset-y-0 left-0 w-1/2 bg-[#0A1C14] z-10 border-r border-[#D4AF37]/20 origin-left shadow-2xl"
            >
               <div className="absolute inset-0 opacity-10 bg-[url('/assets/noise.png')]"></div>
            </motion.div>
            <motion.div 
              exit={{ rotateY: 110, x: "100%", opacity: 0 }}
              transition={{ duration: 2, ease: [0.22, 1, 0.36, 1] }}
              className="absolute inset-y-0 right-0 w-1/2 bg-[#0A1C14] z-10 border-l border-[#D4AF37]/20 origin-right shadow-2xl"
            >
               <div className="absolute inset-0 opacity-10 bg-[url('/assets/noise.png')]"></div>
            </motion.div>

            {/* Content Container - Raised z-index to be above leaves */}
            <motion.div 
              initial="hidden"
              animate="visible"
              variants={{
                visible: { transition: { staggerChildren: 0.2 } }
              }}
              className="relative z-20 text-center px-6 flex flex-col items-center"
            >
              <motion.div
                variants={{
                  hidden: { opacity: 0, y: 30 },
                  visible: { opacity: 1, y: 0, transition: { duration: 1.5, ease: [0.22, 1, 0.36, 1] } }
                }}
                className="mb-12"
              >
                <div className="w-24 h-24 border-2 border-[#D4AF37]/40 rounded-full mx-auto mb-10 flex items-center justify-center relative">
                   <motion.div 
                     animate={{ rotate: 360 }}
                     transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                     className="absolute inset-[-4px] border-t-2 border-[#D4AF37]/20 rounded-full"
                   />
                   <span className="font-serif italic text-[#D4AF37] text-4xl">M</span>
                </div>
                <motion.p 
                  variants={{
                    hidden: { opacity: 0, letterSpacing: "0.2em" },
                    visible: { opacity: 1, letterSpacing: "0.6em" }
                  }}
                  className="text-[#D4AF37] uppercase text-[10px] mb-8 font-bold"
                >
                  The Royal Invitation
                </motion.p>
                <motion.h1 
                  variants={{
                    hidden: { opacity: 0, scale: 0.9 },
                    visible: { opacity: 1, scale: 1 }
                  }}
                  className="font-script text-4xl sm:text-6xl md:text-8xl text-white mb-6 drop-shadow-2xl"
                >
                   {bride} <span className="text-[#D4AF37]">&</span> {groom}
                </motion.h1>
                <motion.p 
                  variants={{
                    hidden: { opacity: 0 },
                    visible: { opacity: 1 }
                  }}
                  className="font-serif text-[#D4AF37] text-lg italic tracking-widest mt-8 opacity-60"
                >
                  For Eternity and Beyond
                </motion.p>
              </motion.div>

              <motion.button
                variants={{
                  hidden: { opacity: 0, y: 20 },
                  visible: { opacity: 1, y: 0 }
                }}
                onClick={handleOpen}
                whileHover={{ scale: 1.05, letterSpacing: "0.6em", backgroundColor: "rgba(212,175,55,0.1)" }}
                whileTap={{ scale: 0.95 }}
                className="px-12 py-5 bg-transparent border-2 border-[#D4AF37] text-[#D4AF37] font-sans text-[10px] uppercase tracking-[0.4em] font-bold transition-all duration-700 relative overflow-hidden group"
              >
                <span className="relative z-10">Enter the Kingdom</span>
              </motion.button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    );
  }

  // -------------------------
  // VARIANT: CINEMATIC
  // -------------------------
  if (variant === 'cinematic') {
    return (
      <AnimatePresence>
        {!isActuallyOpen && (
          <motion.div 
            initial={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 1.1, filter: "blur(20px)" }}
            transition={{ duration: 1.5, ease: "easeInOut" }}
            className={`fixed inset-0 z-[9999] bg-black flex flex-col items-center justify-center overflow-hidden ${isActuallyOpen ? 'pointer-events-none' : 'pointer-events-auto'}`}
          >
            {/* LUXURY DARK BACKGROUND WITH CINEMATIC SPOTLIGHT */}
            <div className="absolute inset-0 z-0 bg-[#050505]">
              {/* Subtle Ambient Light (Not a blob) */}
              <div 
                className="absolute inset-0 opacity-40 pointer-events-none"
                style={{
                  background: "radial-gradient(circle at 50% 45%, rgba(212,175,55,0.08) 0%, transparent 70%)"
                }}
              />
              
              {/* Deep Vignette Overlay */}
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.8)_100%)] pointer-events-none" />
              
              {/* Moving Light Glint (Projector Effect) */}
              <motion.div 
                animate={{ 
                  opacity: [0.05, 0.1, 0.05],
                  x: ["-20%", "20%"]
                }}
                transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
                className="absolute inset-0 pointer-events-none"
                style={{
                  background: "linear-gradient(45deg, transparent 45%, rgba(255,255,255,0.03) 50%, transparent 55%)"
                }}
              />
            </div>

            {/* GOLD DUST PARTICLES (Enhanced for dark bg) */}
            <div className="absolute inset-0 z-[5] pointer-events-none">
              {isMounted && [...Array(40)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-[1.5px] h-[1.5px] bg-wedding-gold rounded-full blur-[0.5px]"
                  initial={{ 
                    x: Math.random() * 100 + "%", 
                    y: Math.random() * 100 + "%",
                    opacity: 0 
                  }}
                  animate={{ 
                    y: ["0%", "100%"],
                    x: ["0%", (Math.random() > 0.5 ? "2%" : "-2%")],
                    opacity: [0, 0.4, 0]
                  }}
                  transition={{ 
                    duration: 10 + Math.random() * 20, 
                    repeat: Infinity, 
                    delay: Math.random() * 10 
                  }}
                />
              ))}
            </div>

            <div className="relative z-10 text-center px-6">
              <motion.div
                initial="hidden"
                animate="visible"
                variants={{
                  visible: { transition: { staggerChildren: 0.4 } }
                }}
                className="mb-12 flex flex-col items-center"
              >
                <motion.div 
                  variants={{
                    hidden: { width: 0, opacity: 0 },
                    visible: { width: 100, opacity: 0.3, transition: { duration: 2 } }
                  }}
                  className="h-[1px] bg-wedding-gold mb-8"
                />
                
                <motion.p 
                  variants={{
                    hidden: { opacity: 0, y: 10 },
                    visible: { opacity: 1, y: 0, transition: { duration: 1.5 } }
                  }}
                  className="text-wedding-gold uppercase tracking-[0.8em] text-[9px] mb-8 font-black ml-[0.8em]"
                >
                  The Royal Premiere
                </motion.p>
                
                <div className="relative overflow-hidden group">
                  <motion.h1 
                    variants={{
                      hidden: { opacity: 0, filter: "blur(10px)", scale: 0.9 },
                      visible: { opacity: 1, filter: "blur(0px)", scale: 1, transition: { duration: 2, ease: [0.22, 1, 0.36, 1] } }
                    }}
                    className="font-serif text-4xl sm:text-6xl md:text-8xl text-white mb-2 font-bold tracking-tight relative"
                  >
                     <span className="relative z-10">{bride} <span className="text-gray-700 font-light">&</span> {groom}</span>
                     
                     {/* SHIMMER EFFECT LAYER */}
                     <motion.span 
                       animate={{ x: ["-100%", "200%"] }}
                       transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", repeatDelay: 2 }}
                       className="absolute inset-0 z-20 bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-[-20deg] pointer-events-none"
                     />
                  </motion.h1>
                </div>

                <motion.div 
                  variants={{
                    hidden: { width: 0, opacity: 0 },
                    visible: { width: 100, opacity: 0.3, transition: { duration: 2, delay: 1 } }
                  }}
                  className="h-[1px] bg-wedding-gold mt-8"
                />
              </motion.div>

              {/* ACTION BUTTON */}
              <div className="flex flex-col items-center gap-12">
                <motion.button
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 2 }}
                  onClick={handleOpen}
                  whileHover={{ scale: 1.05, backgroundColor: "rgba(255,255,255,0.1)" }}
                  whileTap={{ scale: 0.95 }}
                  className="group relative px-12 py-4 bg-white/5 border border-white/20 text-white font-sans text-[10px] uppercase tracking-[0.4em] overflow-hidden transition-all duration-700"
                >
                  <span className="absolute inset-0 bg-white translate-y-full group-hover:translate-y-0 transition-transform duration-500"></span>
                  <span className="relative z-10 group-hover:text-black font-bold">Watch Now</span>
                </motion.button>
                
                {/* GUEST LABEL - NOW INTERACTIVE */}
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 2.5 }}
                  className="text-center min-h-[60px]"
                >
                  <p className="text-gray-600 text-[10px] uppercase tracking-[0.3em] italic mb-3">Exclusive For</p>
                  
                  <AnimatePresence mode="wait">
                    {isEditingName && !guestName ? (
                      <motion.form 
                        key="input"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        onSubmit={handleNameSubmit}
                        className="relative"
                      >
                        <input 
                          autoFocus
                          type="text"
                          value={manualName}
                          onChange={(e) => setManualName(e.target.value)}
                          onBlur={() => !manualName && setIsEditingName(false)}
                          placeholder="TULIS NAMA ANDA..."
                          className="bg-transparent border-b border-wedding-gold/40 py-1 text-center font-serif text-lg text-white focus:border-wedding-gold focus:outline-none transition-all uppercase tracking-widest outline-none"
                        />
                        <button type="submit" className="hidden">Submit</button>
                      </motion.form>
                    ) : (
                      <motion.div
                        key="label"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="cursor-pointer group/label"
                        onClick={() => !guestName && setIsEditingName(true)}
                      >
                        <p className="text-white text-lg font-serif italic tracking-wide flex items-center justify-center gap-2">
                          {currentGuestName || "Tamu Undangan"}
                          {!guestName && (
                            <svg className="w-3 h-3 text-wedding-gold/40 group-hover/label:text-wedding-gold transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path></svg>
                          )}
                        </p>
                        {!guestName && !manualName && (
                          <p className="text-[9px] text-wedding-gold/40 mt-1 uppercase tracking-widest group-hover/label:text-wedding-gold transition-colors">
                            Klik untuk personalisasi
                          </p>
                        )}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              </div>
            </div>
            
            {/* Fine Film Grain/Dust */}
            <div className="absolute inset-0 pointer-events-none opacity-[0.05] bg-[url('/assets/noise.png')] mix-blend-screen"></div>
          </motion.div>
        )}
      </AnimatePresence>
    );
  }

  // -------------------------
  // VARIANT: ULTRA LUXURY
  // -------------------------
  if (variant === 'ultra-luxury') {
    return (
      <AnimatePresence>
        {!isActuallyOpen && (
          <motion.div 
            className="fixed inset-0 z-[9999] bg-[#050505] overflow-hidden flex items-center justify-center"
          >
            {/* Sliding Panels for Exit Animation */}
            <motion.div 
              exit={{ x: "-100%" }}
              transition={{ duration: 1.5, ease: [0.83, 0, 0.173, 1] }}
              className="absolute inset-y-0 left-0 w-1/2 bg-[#050505] z-20 border-r border-[#D4AF37]/10"
            >
              <div className="absolute inset-0 opacity-20 bg-[url('/assets/marble-bg.webp')] bg-cover"></div>
            </motion.div>
            <motion.div 
              exit={{ x: "100%" }}
              transition={{ duration: 1.5, ease: [0.83, 0, 0.173, 1] }}
              className="absolute inset-y-0 right-0 w-1/2 bg-[#050505] z-20 border-l border-[#D4AF37]/10"
            >
              <div className="absolute inset-0 opacity-20 bg-[url('/assets/marble-bg.webp')] bg-cover"></div>
            </motion.div>

            {/* Background Texture & Particles */}
            <div className="absolute inset-0 z-0">
               <div className="absolute inset-0 bg-[url('/assets/marble-bg.webp')] bg-cover opacity-20"></div>
               <div className="absolute inset-0 bg-gradient-to-b from-black via-transparent to-black"></div>
               
               {/* Gold Dust Particles */}
               {isMounted && [...Array(20)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="absolute w-1 h-1 bg-[#D4AF37] rounded-full blur-[1px]"
                    initial={{ 
                      x: Math.random() * 100 + "%", 
                      y: Math.random() * 100 + "%",
                      opacity: 0 
                    }}
                    animate={{ 
                      y: ["0%", "100%"],
                      opacity: [0, 1, 0]
                    }}
                    transition={{ 
                      duration: 5 + Math.random() * 10, 
                      repeat: Infinity, 
                      delay: Math.random() * 5 
                    }}
                  />
               ))}
            </div>

            <motion.div
              initial="hidden"
              animate="visible"
              exit={{ opacity: 0, scale: 0.8, filter: "blur(10px)" }}
              transition={{ duration: 0.8 }}
              variants={{
                visible: { transition: { staggerChildren: 0.3 } }
              }}
              className="relative z-30 text-center px-6 flex flex-col items-center"
            >
              <motion.div
                variants={{
                  hidden: { opacity: 0, y: 30 },
                  visible: { opacity: 1, y: 0, transition: { duration: 2, ease: [0.22, 1, 0.36, 1] } }
                }}
                className="mb-12"
              >
                <motion.p 
                  variants={{
                    hidden: { opacity: 0, letterSpacing: "0.4em" },
                    visible: { opacity: 1, letterSpacing: "0.8em" }
                  }}
                  className="text-[#D4AF37] uppercase text-[10px] mb-8 font-bold ml-[0.8em]"
                >
                  Exclusively For You
                </motion.p>
                <motion.h1 
                  variants={{
                    hidden: { opacity: 0, scale: 0.9 },
                    visible: { opacity: 1, scale: 1 }
                  }}
                  className="font-serif text-4xl sm:text-6xl md:text-8xl text-white mb-6 tracking-tighter leading-none"
                >
                  {bride} <span className="text-[#D4AF37] font-script text-5xl md:text-7xl block my-4 italic">&</span> {groom}
                </motion.h1>
                <div className="w-24 h-px bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent mx-auto"></div>
              </motion.div>

              <motion.button
                variants={{
                  hidden: { opacity: 0, y: 20 },
                  visible: { opacity: 1, y: 0 }
                }}
                onClick={handleOpen}
                whileHover={{ scale: 1.05, boxShadow: "0 0 40px rgba(212,175,55,0.4)" }}
                whileTap={{ scale: 0.95 }}
                className="px-12 py-5 bg-transparent border border-[#D4AF37] text-[#D4AF37] font-sans text-[10px] uppercase tracking-[0.4em] font-bold relative overflow-hidden group transition-all duration-700"
              >
                <span className="absolute inset-0 bg-[#D4AF37] translate-y-full group-hover:translate-y-0 transition-transform duration-500"></span>
                <span className="relative z-10 group-hover:text-black">Enter Experience</span>
              </motion.button>
              
                <p className="text-white text-[10px] mt-12 uppercase tracking-[0.3em] font-light">
                  The Wedding Celebration
                </p>

                <div className="mt-10">
                  <p className="text-[#D4AF37] text-[10px] uppercase tracking-[0.4em] font-bold mb-1">Dear Distinguished Guest</p>
                  <p className="text-white text-xl font-serif italic tracking-wider">{guestName || "Tamu Undangan"}</p>
                </div>
              </motion.div>
            </motion.div>
        )}
      </AnimatePresence>
    );
  }

  // -------------------------
  // VARIANT: PREMIUM
  // -------------------------
  if (variant === 'premium') {
    return (
      <AnimatePresence>
        {!isActuallyOpen && (
          <motion.div 
            initial={{ opacity: 1 }}
            exit={{ y: "-100%", opacity: 0 }}
            transition={{ duration: 1.2, ease: [0.83, 0, 0.173, 1] }}
            className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-[#FDFBF7] overflow-hidden"
          >
            {/* Paper Texture Overlay */}
            <div className="absolute inset-0 opacity-[0.03] mix-blend-multiply pointer-events-none bg-[url('/assets/noise.png')]"></div>
            
            {/* Envelope Flap Lines (Simulated with SVG) */}
            <div className="absolute inset-0 pointer-events-none flex justify-center items-center opacity-30">
               <svg className="w-full h-full" preserveAspectRatio="none" viewBox="0 0 100 100">
                  <path d="M0,0 L50,45 L100,0" fill="none" stroke="#D4AF37" strokeWidth="0.2" />
                  <path d="M0,100 L50,45 L100,100" fill="none" stroke="#D4AF37" strokeWidth="0.2" />
               </svg>
            </div>

            <div className="relative text-center z-10 px-6 flex flex-col items-center">
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.3, duration: 1 }}
                className="mb-16 mt-[-10vh]"
              >
                <p className="text-[#D4AF37] uppercase tracking-[0.4em] text-[10px] mb-6 font-bold">The Wedding of</p>
                <h1 className="font-serif text-3xl sm:text-5xl md:text-7xl text-[#2C2C2C] mb-4 italic">
                  {groom} <span className="text-[#D4AF37] text-4xl">&</span> {bride}
                </h1>
              </motion.div>

              {/* Wax Seal / Open Button */}
              <motion.button
                onClick={handleOpen}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="relative group w-24 h-24 flex items-center justify-center"
              >
                {/* Seal Background */}
                <div className="absolute inset-0 bg-gradient-to-br from-[#D4AF37] via-[#AA7C11] to-[#684C0A] rounded-full shadow-[0_5px_15px_rgba(212,175,55,0.4)] flex items-center justify-center group-hover:shadow-[0_8px_25px_rgba(212,175,55,0.6)] transition-all duration-500 border-2 border-[#D4AF37]/50">
                  {/* Inner Ring */}
                  <div className="w-[85%] h-[85%] rounded-full border border-white/30 flex items-center justify-center bg-black/5">
                    <span className="font-serif italic text-white text-3xl font-bold drop-shadow-md">{bride[0]}{groom[0]}</span>
                  </div>
                </div>
              </motion.button>

              <motion.p 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1, duration: 1 }}
                className="text-gray-500 text-[10px] mt-12 uppercase tracking-[0.3em]"
              >
                Tap to Open
              </motion.p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    );
  }

  // -------------------------
  // VARIANT: DEFAULT
  // -------------------------
  return (
    <AnimatePresence>
      {!isActuallyOpen && (
        <motion.div 
          initial={{ opacity: 1 }}
          exit={{ y: "-100%", opacity: 0 }}
          transition={{ duration: 1, ease: [0.43, 0.13, 0.23, 0.96] }}
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-[#111111] overflow-hidden"
        >
          {/* Decorative Background Elements */}
          <div className="absolute inset-0 opacity-20">
            <div className="absolute top-0 left-0 w-64 h-64 border-l-2 border-t-2 border-[#D4AF37] m-8 rounded-tl-[100px]"></div>
            <div className="absolute bottom-0 right-0 w-64 h-64 border-r-2 border-b-2 border-[#D4AF37] m-8 rounded-br-[100px]"></div>
          </div>

          <div className="relative text-center px-6">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.8 }}
              className="mb-8"
            >
              <p className="text-[#D4AF37] uppercase tracking-[0.3em] text-[10px] mb-4 font-bold">The Wedding of</p>
              <h1 className="font-serif text-2xl sm:text-4xl md:text-6xl text-white mb-2 italic">
                {groom} <span className="text-[#D4AF37]">&</span> {bride}
              </h1>
              <div className="w-12 h-[1px] bg-[#D4AF37] mx-auto mt-6"></div>
            </motion.div>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleOpen}
              className="bg-[#D4AF37] text-white px-10 py-4 rounded-full font-bold uppercase tracking-widest text-[10px] shadow-2xl hover:bg-yellow-600 transition-colors flex items-center gap-3 mx-auto"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 14.5v-9l6 4.5-6 4.5z"/></svg>
              Buka Undangan
            </motion.button>
            
            <p className="text-gray-400 text-[10px] mt-8 uppercase tracking-widest font-bold">Kepada Bapak/Ibu/Saudara/i</p>
            <p className="text-white text-sm mt-2 font-serif italic">Tamu Undangan</p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// -------------------------
// COMPONENT: SCROLL INDICATOR
// -------------------------
export function ScrollIndicator({ color = "#D4AF37" }: { color?: string }) {
  const { scrollY } = useScroll();
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  useMotionValueEvent(scrollY, "change", (latest) => {
    // Hide when scrolling down, show when scrolling up
    if (latest > lastScrollY && latest > 50) {
      setIsVisible(false);
    } else if (latest < lastScrollY) {
      setIsVisible(true);
    }
    
    // Hide if at the bottom of the page
    if (typeof window !== 'undefined') {
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;
      if (latest + windowHeight >= documentHeight - 100) {
        setIsVisible(false);
      }
    }

    setLastScrollY(latest);
  });

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.5 }}
          className="fixed bottom-10 left-1/2 -translate-x-1/2 z-50 flex flex-col items-center gap-2 pointer-events-none"
        >
          <p className="text-[9px] uppercase tracking-[0.4em] font-bold" style={{ color }}>Scroll Down</p>
          <div className="w-[1px] h-12 relative bg-current opacity-20" style={{ color }}>
            <motion.div 
              animate={{ 
                y: [0, 48, 0],
                opacity: [0, 1, 0]
              }}
              transition={{ 
                duration: 2, 
                repeat: Infinity, 
                ease: "easeInOut" 
              }}
              className="absolute top-0 left-0 w-full h-1/3 bg-current"
              style={{ color }}
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

