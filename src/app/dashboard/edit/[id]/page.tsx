import { redirect } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { updateInvitation } from "./actions";
import LogoutButton from "@/components/dashboard/LogoutButton";
import UpgradeAiButton from "@/components/dashboard/UpgradeAiButton";
import SaveNotification from "@/components/dashboard/SaveNotification";
import InvitationForm from "@/components/dashboard/InvitationForm";
import DashboardShell from "@/components/dashboard/DashboardShell";
import { Suspense } from "react";


export default async function EditInvitationPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return redirect("/login");
  }

  // Fetch existing invitation
  const { data: invitation, error } = await supabase
    .from("invitations")
    .select("*")
    .eq("id", id)
    .eq("user_id", user.id)
    .single();

  if (error || !invitation) {
    return redirect("/dashboard");
  }

  return (
    <DashboardShell>
      <Suspense><SaveNotification /></Suspense>
      <header className="bg-wedding-base/80 border-b border-wedding-gold/10 backdrop-blur-md sticky top-0 z-50 transition-colors duration-500">
        <div className="max-w-7xl mx-auto px-4 h-16 flex justify-between items-center">
          <div className="flex items-center gap-6">
            <Link href="/dashboard" className="w-8 h-8 rounded-full bg-wedding-text/5 flex items-center justify-center text-wedding-text/40 hover:bg-wedding-gold hover:text-black transition-all">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
            </Link>
            <h1 className="font-serif text-lg font-bold text-wedding-text">Edit Undangan</h1>
          </div>
          <LogoutButton />
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-12">
        {/* BANNER UPGRADE AI - TAMPIL HANYA JIKA BELUM PREMIUM */}
        {!invitation.is_ai_enabled && (
          <div className="mb-10">
            <UpgradeAiButton 
              invitationId={invitation.id} 
              userId={user.id} 
              userEmail={user.email || ""} 
            />
          </div>
        )}

        <div className="bg-wedding-base p-8 rounded-3xl border border-wedding-gold/10 transition-all duration-500 shadow-sm">
          <InvitationForm action={updateInvitation} initialData={invitation} />
        </div>
      </main>
    </DashboardShell>
  );
}
