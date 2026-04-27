import { redirect } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { createInvitation } from "./actions";
import ThemeSelector from "./ThemeSelector";
import SubmitButton from "@/components/dashboard/SubmitButton";
import LogoutButton from "@/components/dashboard/LogoutButton";
import MusicSelector from "@/components/dashboard/MusicSelector";
import QuoteSection from "@/components/dashboard/QuoteSection";
import InstantPhotoUpload from "@/components/dashboard/InstantPhotoUpload";
import AdminContactCard from "@/components/dashboard/AdminContactCard";
import SlugInput from "@/components/dashboard/SlugInput";
import InvitationForm from "@/components/dashboard/InvitationForm";

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
    <div className="min-h-screen bg-[#FDFBF7] text-gray-800 font-sans pb-24">
      <header className="bg-white/80 border-b border-gray-100 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 h-16 flex justify-between items-center">
          <div className="flex items-center gap-6">
            <Link href="/dashboard" className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 hover:bg-black hover:text-white transition-all">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
            </Link>
            <h1 className="font-serif text-lg font-bold text-gray-900">Buat Undangan Baru</h1>
          </div>
          <LogoutButton />
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-12">
        {error && (
          <div className="mb-8 p-4 bg-red-50 border border-red-200 rounded-2xl flex items-center gap-3 text-red-600">
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
          <div className="bg-white p-12 rounded-3xl shadow-sm border border-gray-100 text-center space-y-6">
            <div className="w-20 h-20 bg-[#D4AF37]/10 rounded-full flex items-center justify-center mx-auto">
              <svg className="w-10 h-10 text-[#D4AF37]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <div>
              <h2 className="text-2xl font-serif font-bold text-gray-800">Jatah Draft Penuh! 🔒</h2>
              <p className="text-gray-500 mt-2">
                Kamu sudah memiliki **{invitationCount}** draft. <br/>
                Batas maksimal untuk akun **{tierName}** adalah **{maxDrafts}** draft.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <a href="/dashboard" className="px-8 py-3 bg-gray-100 text-gray-600 rounded-xl font-bold hover:bg-gray-200 transition-all">
                Hapus Draft Lama
              </a>
              {credits < 10 && (
                <a href="/dashboard/topup" className="px-8 py-3 bg-gradient-to-r from-[#D4AF37] to-[#B8962E] text-white rounded-xl font-bold shadow-lg hover:scale-105 transition-all">
                  Upgrade Paket (Dapatkan s/d 30 Draft)
                </a>
              )}
            </div>
          </div>
        ) : (
          <InvitationForm action={createInvitation} />
        )}

        <div className="mt-12">
          <AdminContactCard />
        </div>
      </main>
    </div>
  );
}
