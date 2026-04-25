"use client";

import { useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { toast } from "sonner";

export default function SuccessNotification() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const success = searchParams.get("success");

  useEffect(() => {
    if (success === "created") {
      toast.success("Undangan berhasil dibuat! 🎉");
      
      // Clean up the URL
      const newParams = new URLSearchParams(searchParams.toString());
      newParams.delete("success");
      const newUrl = window.location.pathname + (newParams.toString() ? `?${newParams.toString()}` : "");
      window.history.replaceState(null, "", newUrl);
    }
  }, [success, searchParams, router]);

  return null;
}
