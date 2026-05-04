"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { useEffect } from "react";

interface BottomSheetProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  className?: string;
  titleClassName?: string;
}

export default function BottomSheet({ isOpen, onClose, title, children, className = "", titleClassName = "" }: BottomSheetProps) {
  // Prevent body scroll when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[9999] flex items-end justify-center">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          />

          {/* Sheet */}
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            drag="y"
            dragConstraints={{ top: 0 }}
            dragElastic={0.2}
            onDragEnd={(_, info) => {
              if (info.offset.y > 100) onClose();
            }}
            className={`relative w-full max-w-xl bg-white dark:bg-[#121212] rounded-t-[2.5rem] shadow-2xl border-t border-wedding-gold/20 overflow-hidden max-h-[90vh] flex flex-col ${className}`}
          >
            {/* Drag Handle */}
            <div className="w-full flex justify-center pt-4 pb-2">
              <div className="w-12 h-1.5 bg-wedding-text/10 dark:bg-white/10 rounded-full" />
            </div>

            {/* Header */}
            <div className="px-8 py-4 flex items-center justify-between border-b border-wedding-gold/5">
              <h3 className={`font-serif text-xl text-wedding-text ${titleClassName}`}>{title}</h3>
              <button 
                onClick={onClose}
                className="p-2 hover:bg-wedding-gold/10 rounded-full transition-colors"
              >
                <X className="w-5 h-5 text-wedding-text/40" />
              </button>
            </div>

            {/* Content */}
            <div className="px-8 py-6 overflow-y-auto no-scrollbar pb-12">
              {children}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
