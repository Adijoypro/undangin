"use client";

import { useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { toast } from "sonner";

export default function SaveNotification() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const updated = searchParams.get("updated");

  useEffect(() => {
    if (updated === "true") {
      toast.success("Perubahan Berhasil Disimpan!", {
        description: "Draft undangan Anda telah diperbarui dengan aman.",
        duration: 4000,
      });

      // Bersihkan URL biar gak muncul lagi pas direfresh
      const params = new URLSearchParams(searchParams.toString());
      params.delete("updated");
      const newUrl = `${window.location.pathname}${params.toString() ? `?${params.toString()}` : ""}`;
      window.history.replaceState(null, "", newUrl);
    }
  }, [updated, searchParams]);

  return null;
}
