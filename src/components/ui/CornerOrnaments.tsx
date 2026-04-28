"use client";

import Image from "next/image";
import { motion } from "framer-motion";

interface CornerOrnamentsProps {
  opacity?: number;
  size?: number;
}

export default function CornerOrnaments({ opacity = 0.4, size = 120 }: CornerOrnamentsProps) {
  const corners = [
    { id: "top-left", className: "-top-2 -left-2", rotate: 0 },
    { id: "top-right", className: "-top-2 -right-2", rotate: 90 },
    { id: "bottom-right", className: "-bottom-2 -right-2", rotate: 180 },
    { id: "bottom-left", className: "-bottom-2 -left-2", rotate: 270 },
  ];

  return (
    <div className="absolute inset-0 pointer-events-none z-10 overflow-hidden">
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
          <div className="relative" style={{ width: size, height: size }}>
            <Image
              src="/assets/branding/final/nusantara_corner_ornament_luxury_gold_3d_final_v1_1777373271596.webp"
              alt="Corner Ornament"
              fill
              sizes={`${size}px`}
              className="object-contain"
            />
          </div>
        </motion.div>
      ))}
    </div>
  );
}
