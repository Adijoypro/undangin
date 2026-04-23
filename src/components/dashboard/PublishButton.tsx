"use client";

import { useState } from "react";
import { publishInvitation } from "@/app/dashboard/edit/[id]/actions";
import { useRouter } from "next/navigation";

interface PublishButtonProps {
  invitationId: string;
  status: string;
}

export default function PublishButton({ invitationId, status }: PublishButtonProps) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  if (status === "published") {
    return (
      <span className="bg-green-100 text-green-700 text-[9px] uppercase tracking-widest px-2 py-0.5 rounded font-bold border border-green-200">
        Published
      </span>
    );
  }

  const handlePublish = async () => {
    if (!confirm("Publikasikan undangan ini? Tindakan ini akan memotong 1 Kredit.")) return;
    
    setLoading(true);
    try {
      const result = await publishInvitation(invitationId);
      if (result.success) {
        alert(result.message);
        router.refresh();
      } else {
        alert(result.message);
      }
    } catch (err) {
      alert("Terjadi kesalahan sistem.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handlePublish}
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
  );
}
