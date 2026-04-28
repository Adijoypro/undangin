"use client";

import Image from "next/image";
import { motion } from "framer-motion";

interface CornerOrnamentsProps {
  opacity?: number;
  size?: number;
}

export default function CornerOrnaments({ opacity = 0.4, size = 120 }: CornerOrnamentsProps) {
  const corners = [
    { id: "top-left", className: "-top-1 -left-1 md:-top-2 md:-left-2", rotate: 0 },
    { id: "top-right", className: "-top-1 -right-1 md:-top-2 md:-right-2", rotate: 90 },
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
          {/* Responsive Size: Half size on mobile, full size on desktop */}
          <div className="relative w-[60px] h-[60px] md:w-[120px] md:h-[120px]" style={{ width: `calc(${size}px / 2.5)`, height: `calc(${size}px / 2.5)` }}>
            <div className="md:hidden w-full h-full relative">
               <Image
                src="/assets/branding/final/nusantara_corner_ornament_luxury_gold_3d_final_v1_1777373271596.webp"
                alt="Corner Ornament"
                fill
                sizes="60px"
                className="object-contain"
              />
            </div>
            <div className="hidden md:block w-full h-full relative" style={{ width: size, height: size }}>
              <Image
                src="/assets/branding/final/nusantara_corner_ornament_luxury_gold_3d_final_v1_1777373271596.webp"
                alt="Corner Ornament"
                fill
                sizes={`${size}px`}
                className="object-contain"
              />
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
