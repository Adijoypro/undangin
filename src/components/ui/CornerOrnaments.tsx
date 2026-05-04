"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";

interface CornerOrnamentsProps {
  opacity?: number;
  size?: number;
  topOffset?: string;
}

export default function CornerOrnaments({ opacity = 0.4, size = 120, topOffset = "top-18" }: CornerOrnamentsProps) {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 1024);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);
  const corners = [
    { id: "top-left", className: `${topOffset} -left-1 md:-left-2`, rotate: 0 },
    { id: "top-right", className: `${topOffset} -right-1 md:-right-2`, rotate: 90 },
    { id: "bottom-right", className: "-bottom-1 -right-1 md:-bottom-2 md:-right-2", rotate: 180 },
    { id: "bottom-left", className: "-bottom-1 -left-1 md:-bottom-2 md:-left-2", rotate: 270 },
  ];

  return (
    <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
      {corners.map((corner) => (
        <motion.div
          key={corner.id}
          initial={{ opacity: 0 }}
          whileInView={{ opacity: opacity }}
          viewport={{ once: true }}
          transition={{ duration: 1, delay: 0.2 }}
          className={`absolute ${corner.className}`}
          style={{ rotate: `${corner.rotate}deg` }}
        >
          <div 
            className="relative transform-gpu" 
            style={{ 
              width: isMobile ? `calc(${size}px / 2)` : `${size}px`, 
              height: isMobile ? `calc(${size}px / 2)` : `${size}px` 
            }}
          >
            <Image
              src="/assets/branding/final/nusantara_corner_ornament_luxury_gold_3d_final_v1_1777373271596.webp"
              alt="Corner Ornament"
              fill
              sizes="(max-width: 768px) 60px, 120px"
              className="object-contain"
            />
          </div>
        </motion.div>
      ))}
    </div>
  );
}
