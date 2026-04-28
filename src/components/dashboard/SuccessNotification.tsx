"use client";

import { useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { toast } from "sonner";

export default function SuccessNotification() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const created = searchParams.get("created");
  const updated = searchParams.get("updated");

  useEffect(() => {
    if (created === "true") {
      toast.success("Mahakarya Undangan Berhasil Dibuat! ✨");
    } else if (updated === "true") {
      toast.success("Perubahan Berhasil Disimpan Ke Dashboard! ✨");
    }

    if (created || updated) {
      // Clean up the URL
      const newParams = new URLSearchParams(searchParams.toString());
      newParams.delete("created");
      newParams.delete("updated");
      const newUrl = window.location.pathname + (newParams.toString() ? `?${newParams.toString()}` : "");
      window.history.replaceState(null, "", newUrl);
    }
  }, [created, updated, searchParams]);

  return null;
}
