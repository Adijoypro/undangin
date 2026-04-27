import { redirect } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { createInvitation } from "./actions";
import SubmitButton from "@/components/dashboard/SubmitButton";
import LogoutButton from "@/components/dashboard/LogoutButton";
import AdminContactCard from "@/components/dashboard/AdminContactCard";
import InvitationForm from "@/components/dashboard/InvitationForm";
import DashboardShell from "@/components/dashboard/DashboardShell";

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
      <header className="bg-wedding-base/80 border-b border-wedding-gold/10 backdrop-blur-md sticky top-0 z-50 transition-colors duration-500">
        <div className="max-w-7xl mx-auto px-4 h-16 flex justify-between items-center">
          <div className="flex items-center gap-6">
            <Link href="/dashboard" className="w-8 h-8 rounded-full bg-wedding-text/5 flex items-center justify-center text-wedding-text/40 hover:bg-wedding-gold hover:text-black transition-all">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
            </Link>
            <h1 className="font-serif text-lg font-bold text-wedding-text">Buat Undangan Baru</h1>
          </div>
          <LogoutButton />
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-12">
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
          <div className="bg-wedding-base p-12 rounded-3xl shadow-sm border border-wedding-gold/10 text-center space-y-6 transition-all duration-500">
            <div className="w-20 h-20 bg-wedding-gold/10 rounded-full flex items-center justify-center mx-auto">
              <svg className="w-10 h-10 text-wedding-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
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
          <div className="bg-wedding-base p-8 rounded-3xl border border-wedding-gold/10 transition-all duration-500 shadow-sm">
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
