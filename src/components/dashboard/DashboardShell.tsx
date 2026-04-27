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
      {children}
    </div>
  );
}
