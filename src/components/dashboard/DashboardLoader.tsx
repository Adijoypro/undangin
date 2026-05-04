"use client";

import { motion } from "framer-motion";

export default function DashboardLoader({ message = "Memproses..." }: { message?: string }) {
  return (
    <div className="flex flex-col items-center justify-center p-12 space-y-8">
      <div className="relative w-20 h-16">
        {/* Main Envelope Body */}
        <motion.div 
          className="absolute inset-0 bg-wedding-gold/20 border-2 border-wedding-gold rounded-lg shadow-lg"
          animate={{
            scale: [1, 1.05, 1],
          }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        />
        
        {/* Envelope Flap (Top) */}
        <motion.div 
          className="absolute top-0 left-0 right-0 h-1/2 bg-wedding-gold border-2 border-wedding-gold origin-top"
          initial={{ rotateX: 0 }}
          animate={{ rotateX: [0, -160, 0] }}
          transition={{ 
            duration: 2.5, 
            repeat: Infinity, 
            ease: "easeInOut",
            times: [0, 0.5, 1]
          }}
          style={{ 
            clipPath: "polygon(0 0, 100% 0, 50% 100%)",
            backfaceVisibility: "hidden"
          }}
        />

        {/* Paper coming out */}
        <motion.div 
          className="absolute top-2 left-2 right-2 h-12 bg-white rounded-sm shadow-sm z-[-1]"
          animate={{
            y: [0, -20, 0],
            opacity: [0, 1, 0]
          }}
          transition={{ 
            duration: 2.5, 
            repeat: Infinity, 
            ease: "easeInOut",
            times: [0, 0.5, 1]
          }}
        >
          <div className="p-2 space-y-1">
            <div className="h-1 w-full bg-wedding-gold/10 rounded-full" />
            <div className="h-1 w-3/4 bg-wedding-gold/10 rounded-full" />
          </div>
        </motion.div>
      </div>

      <div className="text-center">
        <motion.p 
          animate={{ opacity: [0.4, 1, 0.4] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="text-[10px] font-bold text-wedding-gold uppercase tracking-[0.3em]"
        >
          {message}
        </motion.p>
      </div>
    </div>
  );
}
