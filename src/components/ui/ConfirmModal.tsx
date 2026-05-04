"use client";

import { createPortal } from "react-dom";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface ConfirmModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
  confirmLabel?: string;
  cancelLabel?: string;
  isDanger?: boolean;
}

export default function ConfirmModal({
  isOpen,
  title,
  message,
  onConfirm,
  onCancel,
  confirmLabel = "Ya, Lanjutkan",
  cancelLabel = "Batal",
  isDanger = false
}: ConfirmModalProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!mounted) return null;

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[11000] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onCancel}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          />
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            className="relative bg-white dark:bg-wedding-base w-full max-w-sm rounded-[2.5rem] shadow-2xl overflow-hidden p-8 text-center border border-wedding-gold/20"
          >
            <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6 ${isDanger ? 'bg-red-50 text-red-500' : 'bg-wedding-gold/10 text-wedding-gold'}`}>
              {isDanger ? (
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>
              ) : (
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
              )}
            </div>
            
            <h3 className="font-serif text-2xl text-wedding-text mb-2">{title}</h3>
            <p className="text-gray-500 dark:text-gray-400 text-sm mb-8 leading-relaxed">{message}</p>
            
            <div className="flex flex-col gap-3">
              <button
                onClick={onConfirm}
                className={`w-full py-4 rounded-xl font-bold uppercase tracking-widest text-xs transition-all shadow-lg ${
                  isDanger 
                    ? 'bg-red-500 text-white hover:bg-red-600 shadow-red-500/20' 
                    : 'bg-wedding-gold text-white hover:opacity-90 shadow-wedding-gold/20'
                }`}
              >
                {confirmLabel}
              </button>
              <button
                onClick={onCancel}
                className="w-full py-4 rounded-xl font-bold uppercase tracking-widest text-xs text-gray-400 hover:bg-wedding-text/[0.05] transition-all"
              >
                {cancelLabel}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    document.body
  );
}
