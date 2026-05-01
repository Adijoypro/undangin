import { redirect } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { createInvitation } from "./actions";
import DashboardNavbar from "@/components/dashboard/DashboardNavbar";
import AdminContactCard from "@/components/dashboard/AdminContactCard";
import InvitationForm from "@/components/dashboard/InvitationForm";
import DashboardShell from "@/components/dashboard/DashboardShell";
import { ChevronLeft, AlertTriangle, Sparkles } from "lucide-react";

export default async function CreateInvitationPage({ searchParams }: { searchParams: Promise<{ error?: string }> }) {
  const { error } = await searchParams;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return redirect("/login");
  }

  // Cek jumlah undangan dan status premium
  const { data: profile } = await supabase
    .from("profiles")
    .select("credits")
    .eq("id", user.id)
    .single();

  const { count } = await supabase
    .from("invitations")
    .select("*", { count: "exact", head: true })
    .eq("user_id", user.id);

  const credits = profile?.credits || 0;
  let maxDrafts = 2; // Default Free
  let tierName = "Gratis";

  if (credits >= 10) {
    maxDrafts = 30;
    tierName = "Enterprise";
  } else if (credits >= 5) {
    maxDrafts = 15;
    tierName = "WO / Agensi";
  } else if (credits >= 1) {
    maxDrafts = 5;
    tierName = "Premium";
  }

  const invitationCount = count || 0;
  const isLimitReached = invitationCount >= maxDrafts;

  return (
    <DashboardShell>
      <DashboardNavbar user={user} credits={credits} />

      <main className="max-w-6xl mx-auto px-4 py-12">
        {error && (
          <div className="mb-8 p-4 bg-red-500/10 border border-red-500/20 rounded-2xl flex items-center gap-3 text-red-500 transition-all">
            <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-xs font-bold uppercase tracking-widest">
              {error === 'slug_reserved' && "Link (URL) ini tidak boleh digunakan."}
              {error === 'slug_taken' && "Link (URL) sudah dipakai orang lain. Coba yang lain ya!"}
              {error === 'db_error' && "Terjadi kesalahan sistem saat menyimpan. Cek kembali data kamu."}
              {error === 'limit_reached' && "Jatah draft kamu sudah penuh."}
              {!['slug_reserved', 'slug_taken', 'db_error', 'limit_reached'].includes(error) && "Terjadi kesalahan yang tidak diketahui."}
            </p>
          </div>
        )}

        {isLimitReached ? (
          <div className="bg-white/40 dark:bg-wedding-base/40 backdrop-blur-xl p-12 rounded-[2.5rem] shadow-xl border border-white/50 dark:border-wedding-gold/20 text-center space-y-6 transition-all duration-500">
            <div className="w-24 h-24 bg-wedding-gold/10 rounded-full flex items-center justify-center mx-auto border border-wedding-gold/20">
              <AlertTriangle className="w-12 h-12 text-wedding-gold" />
            </div>
            <div>
              <h2 className="text-2xl font-serif font-bold text-wedding-text">Jatah Draft Penuh! 🔒</h2>
              <p className="text-wedding-text/40 mt-2">
                Kamu sudah memiliki **{invitationCount}** draft. <br/>
                Batas maksimal untuk akun **{tierName}** adalah **{maxDrafts}** draft.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <a href="/dashboard" className="px-8 py-3 bg-wedding-text/5 text-wedding-text/60 rounded-xl font-bold hover:bg-wedding-text hover:text-wedding-base transition-all">
                Hapus Draft Lama
              </a>
              {credits < 10 && (
                <a href="/dashboard/topup" className="px-8 py-3 bg-gradient-to-r from-wedding-gold to-[#B8962E] text-white rounded-xl font-bold shadow-lg hover:scale-105 transition-all">
                  Upgrade Paket (Dapatkan s/d 30 Draft)
                </a>
              )}
            </div>
          </div>
        ) : (
          <div className="bg-white/40 dark:bg-wedding-base/40 backdrop-blur-xl p-8 md:p-12 rounded-[2.5rem] border border-white/50 dark:border-wedding-gold/20 transition-all duration-500 shadow-xl relative overflow-hidden">
             <div className="absolute top-0 right-0 w-64 h-64 bg-wedding-gold/5 rounded-full blur-3xl pointer-events-none" />
             
             {/* AI Coming Soon Banner */}
             <Link href="/dashboard/ai-studio" className="block mb-10 group">
               <div className="p-5 bg-gradient-to-r from-wedding-gold/10 via-transparent to-transparent border border-wedding-gold/20 rounded-2xl flex items-center justify-between overflow-hidden relative hover:border-wedding-gold/40 transition-all duration-500 hover:shadow-lg hover:shadow-wedding-gold/5">
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
                      <ChevronLeft className="w-4 h-4 rotate-180" />
                   </div>
                 </div>
               </div>
             </Link>

             <InvitationForm action={createInvitation} />
          </div>
        )}

        <div className="mt-12">
          <AdminContactCard />
        </div>
      </main>
    </DashboardShell>
  );
}
