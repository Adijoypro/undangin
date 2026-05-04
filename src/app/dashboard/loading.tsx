"use client";

import DashboardLoader from "@/components/dashboard/DashboardLoader";

export default function Loading() {
  return (
    <div className="min-h-screen bg-wedding-base flex items-center justify-center">
      <DashboardLoader message="Menyiapkan Dasbor VVIP..." />
    </div>
  );
}
