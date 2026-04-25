"use client";

import { useTheme } from "next-themes";
import { useState, useEffect } from "react";

export default function DashboardShell({ children }: { children: React.ReactNode }) {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const isDark = resolvedTheme === "dark" || !mounted;

  const theme = {
    bg: isDark ? "bg-slate-950" : "bg-[#FDFBF7]",
    text: isDark ? "text-white" : "text-[#111111]",
    transition: "transition-colors duration-1000"
  };

  if (!mounted) {
    return <div className="min-h-screen bg-slate-950 text-white">{children}</div>;
  }

  return (
    <div className={`min-h-screen ${theme.bg} ${theme.text} ${theme.transition} font-sans selection:bg-[#D4AF37] selection:text-black relative`}>
      {children}
    </div>
  );
}
