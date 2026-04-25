"use client";

import { useState } from "react";
import { publishInvitation } from "@/app/dashboard/edit/[id]/actions";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import ConfirmModal from "../ui/ConfirmModal";

interface PublishButtonProps {
  invitationId: string;
  status: string;
  userCredits: number;
}

export default function PublishButton({ invitationId, status, userCredits }: PublishButtonProps) {
  const [loading, setLoading] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const router = useRouter();

  if (status === "published") {
    return (
      <span className="bg-green-100 dark:bg-green-950/30 text-green-700 dark:text-green-400 text-[9px] uppercase tracking-widest px-2 py-0.5 rounded font-bold border border-green-200 dark:border-green-800">
        Published
      </span>
    );
  }

  const handlePublish = async () => {
    setLoading(true);
    setShowConfirm(false);
    try {
      const result = await publishInvitation(invitationId);
      if (result.success) {
        toast.success(result.message);
        router.refresh();
      } else {
        toast.error(result.message);
      }
    } catch (err) {
      toast.error("Terjadi kesalahan sistem.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <button
        onClick={() => setShowConfirm(true)}
        disabled={loading}
        className="bg-wedding-gold text-white text-[9px] uppercase tracking-widest px-2 py-0.5 rounded font-bold hover:bg-yellow-600 disabled:opacity-50 flex items-center gap-1"
      >
        {loading ? "..." : (
          <>
            <svg className="w-2.5 h-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
            Publikasikan (1 Kredit)
          </>
        )}
      </button>

      {/* CONFIRM MODAL */}
      <ConfirmModal 
        isOpen={showConfirm}
        title={userCredits < 1 ? "Kredit Tidak Cukup" : "Publikasikan Undangan?"}
        message={userCredits < 1 
          ? "Anda membutuhkan 1 Kredit untuk mempublikasikan undangan ini. Silakan Top Up terlebih dahulu." 
          : "Tindakan ini akan memotong 1 Kredit dari akun Anda. Undangan akan segera aktif secara publik."}
        onConfirm={userCredits < 1 ? () => setShowConfirm(false) : handlePublish}
        onCancel={() => setShowConfirm(false)}
        confirmLabel={userCredits < 1 ? "Tutup" : "Ya, Publikasikan"}
        isDanger={userCredits < 1}
      />
    </>
  );
}
