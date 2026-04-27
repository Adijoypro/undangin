"use client";

import { motion } from "framer-motion";

interface LogoProps {
  className?: string;
  size?: number;
}

export default function Logo({ className = "", size = 40 }: LogoProps) {
  return (
    <div className={`relative flex items-center justify-center ${className}`} style={{ width: size, height: size }}>
      <svg
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full"
      >
        <defs>
          <linearGradient id="goldGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#996515" />
            <stop offset="25%" stopColor="#D4AF37" />
            <stop offset="50%" stopColor="#F3C06B" />
            <stop offset="75%" stopColor="#D4AF37" />
            <stop offset="100%" stopColor="#996515" />
          </linearGradient>

          <mask id="uMask">
            {/* Elegant Couture Style "U" */}
            <path
              d="M30 15V65C30 76 38 85 50 85C62 85 70 76 70 65V15"
              stroke="white"
              strokeWidth="12"
              strokeLinecap="butt"
              fill="none"
            />
            {/* Thick Left Stroke for Contrast */}
            <path d="M24 15V65C24 79 35 90 50 90" stroke="white" strokeWidth="6" fill="none" />
            
            {/* Refined Bracketed Serifs */}
            <path d="M18 15H42V20H18V15Z" fill="white" />
            <path d="M62 15H78V20H62V15Z" fill="white" />
          </mask>

          {/* Nusantara Ornament Pattern */}
          <pattern id="nusantaraPattern" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
            <path 
              d="M0 10C5 5 15 5 20 10M10 0C5 5 5 15 10 20" 
              stroke="#D4AF37" 
              strokeWidth="0.5" 
              fill="none" 
              opacity="0.4"
            />
            <circle cx="10" cy="10" r="1" fill="#D4AF37" opacity="0.3" />
          </pattern>
        </defs>

        {/* Shadow/Depth Layer */}
        <path
          d="M30 15V65C30 76 38 85 50 85C62 85 70 76 70 65V15"
          stroke="black"
          strokeWidth="12"
          opacity="0.1"
          fill="none"
          transform="translate(1, 1)"
        />

        {/* Main Golden U Body */}
        <rect x="0" y="0" width="100" height="100" fill="url(#goldGradient)" mask="url(#uMask)" />

        {/* Nusantara Ornament Overlay */}
        <rect x="0" y="0" width="100" height="100" fill="url(#nusantaraPattern)" mask="url(#uMask)" />

        {/* Interactive Shimmer Effect */}
        <motion.rect
          x="-100"
          y="0"
          width="100"
          height="100"
          fill="url(#shimmerGradient)"
          mask="url(#uMask)"
          animate={{
            x: ["100%", "-100%"],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "linear",
            repeatDelay: 2
          }}
        />
      </svg>
    </div>
  );
}
