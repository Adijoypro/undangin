"use client";

import { useState, useEffect } from "react";

export default function DashboardShell({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div className="min-h-screen bg-wedding-base text-wedding-text">{children}</div>;
  }

  return (
    <div className="min-h-screen bg-wedding-base text-wedding-text transition-colors duration-500 font-sans selection:bg-wedding-gold selection:text-black relative">
      {/* Background Decorative Blurs - Optimized for Mobile (Hidden on small screens) */}
      <div className="hidden lg:block absolute top-[-10%] right-[-5%] w-[800px] h-[800px] bg-wedding-gold/10 rounded-full blur-[150px] pointer-events-none fixed transform-gpu" />
      <div className="hidden lg:block absolute bottom-[-10%] left-[-5%] w-[800px] h-[800px] bg-wedding-gold/5 rounded-full blur-[150px] pointer-events-none fixed transform-gpu" />
      
      <div className="relative z-10 h-full w-full overflow-y-auto">
        {children}
      </div>
    </div>
  );
}
