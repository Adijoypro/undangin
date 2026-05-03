import { redirect } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { updateInvitation, deductCredit } from "./actions";
import DashboardNavbar from "@/components/dashboard/DashboardNavbar";
import SaveNotification from "@/components/dashboard/SaveNotification";
import InvitationForm from "@/components/dashboard/InvitationForm";
import DashboardShell from "@/components/dashboard/DashboardShell";
import { Suspense } from "react";
import { Sparkles } from "lucide-react";


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

  // Fetch user profile for credits
  const { data: profile } = await supabase
    .from("profiles")
    .select("credits")
    .eq("id", user.id)
    .single();

  const userCredits = profile?.credits || 0;

  if (error || !invitation) {
    return redirect("/dashboard");
  }

  return (
    <DashboardShell>
      <Suspense><SaveNotification /></Suspense>
      <DashboardNavbar user={user} credits={userCredits} />

      <main className="max-w-6xl mx-auto px-4 py-12">
        {/* AI Studio Banner - Consistency Fix */}
        <Link href="/dashboard/ai-studio" className="block mb-10 group">
          <div className="p-5 bg-gradient-to-r from-wedding-gold/10 via-transparent to-transparent border border-wedding-gold/20 rounded-2xl flex items-center justify-between overflow-hidden relative backdrop-blur-xl hover:border-wedding-gold/40 transition-all duration-500 hover:shadow-lg hover:shadow-wedding-gold/5">
            <div className="absolute -right-4 -top-4 w-24 h-24 bg-wedding-gold/5 rounded-full blur-2xl group-hover:bg-wedding-gold/10 transition-all duration-700" />
            <div className="flex items-center gap-4 relative z-10">
              <div className="w-12 h-12 bg-wedding-gold/20 rounded-xl flex items-center justify-center border border-wedding-gold/30 group-hover:scale-110 transition-transform duration-500">
                <Sparkles className="w-6 h-6 text-wedding-gold animate-pulse" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-wedding-text uppercase tracking-widest group-hover:text-wedding-gold transition-colors">AI Prewedding Studio</h3>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-[9px] bg-wedding-gold text-black px-2 py-0.5 rounded-full font-black uppercase tracking-tighter">Coming Soon</span>
                  <p className="text-[10px] text-wedding-text/40 italic">Ubah foto biasa jadi foto Prewedd mewah secara instan</p>
                </div>
              </div>
            </div>
            <div className="hidden md:flex items-center gap-3">
              <div className="px-4 py-2 bg-wedding-text/5 border border-wedding-text/10 rounded-lg text-[9px] font-bold text-wedding-text/30 uppercase tracking-[0.2em]">
                Premium Only
              </div>
              <div className="w-8 h-8 rounded-full bg-wedding-gold/20 flex items-center justify-center text-wedding-gold group-hover:bg-wedding-gold group-hover:text-black transition-all">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="rotate-180"><path d="m15 18-6-6 6-6"/></svg>
              </div>
            </div>
          </div>
        </Link>

        <div className="bg-wedding-base p-8 rounded-3xl border border-wedding-gold/10 transition-all duration-500 shadow-sm">
          <InvitationForm 
            action={updateInvitation} 
            deductCreditAction={deductCredit}
            initialData={invitation} 
            credits={userCredits} 
          />
        </div>
      </main>
    </DashboardShell>
  );
}
