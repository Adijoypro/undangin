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
          <form action={createInvitation} className="space-y-8">
          
          {/* BAGIAN 1: PENGATURAN UMUM */}
          <section className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
            <h2 className="font-serif text-2xl mb-8 text-gray-900 flex items-center gap-3">
              <span className="w-8 h-8 bg-gray-50 rounded-lg flex items-center justify-center text-sm font-bold text-gray-400">01</span>
              Pengaturan Dasar
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="md:col-span-1">
                <SlugInput />
              </div>
              <div className="md:col-span-2">
                <ThemeSelector />
              </div>
            </div>
          </section>

          {/* BAGIAN 2: DATA MEMPELAI */}
          <section className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
            <h2 className="font-serif text-2xl mb-8 text-gray-900 flex items-center gap-3">
              <span className="w-8 h-8 bg-gray-50 rounded-lg flex items-center justify-center text-sm font-bold text-gray-400">02</span>
              Data Mempelai
            </h2>
            <div className="grid md:grid-cols-2 gap-10">
              {/* Bride */}
              <div className="space-y-4">
                <h3 className="font-bold text-sm uppercase tracking-widest text-wedding-sage">Mempelai Wanita</h3>
                <div>
                  <label className="block text-xs font-bold text-gray-500 mb-1">Nama Panggilan</label>
                  <input type="text" name="bride_name" required placeholder="Mempelai Wanita" className="w-full p-3 border rounded-xl focus:border-wedding-gold outline-none" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 mb-1">Nama Lengkap</label>
                  <input type="text" name="bride_fullname" required placeholder="Nama Lengkap Mempelai Wanita" className="w-full p-3 border rounded-xl focus:border-wedding-gold outline-none" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 mb-1">Nama Ayah</label>
                  <input type="text" name="bride_father" placeholder="Nama Ayah" className="w-full p-3 border rounded-xl focus:border-wedding-gold outline-none" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 mb-1">Nama Ibu</label>
                  <input type="text" name="bride_mother" placeholder="Nama Ibu" className="w-full p-3 border rounded-xl focus:border-wedding-gold outline-none" />
                </div>
                <InstantPhotoUpload 
                  label="Foto Mempelai Wanita" 
                  name="bride_photo" 
                  accentColor="sage"
                />
              </div>

              {/* Groom */}
              <div className="space-y-4">
                <h3 className="font-bold text-sm uppercase tracking-widest text-wedding-gold">Mempelai Pria</h3>
                <div>
                  <label className="block text-xs font-bold text-gray-500 mb-1">Nama Panggilan</label>
                  <input type="text" name="groom_name" required placeholder="Mempelai Pria" className="w-full p-3 border rounded-xl focus:border-wedding-gold outline-none" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 mb-1">Nama Lengkap</label>
                  <input type="text" name="groom_fullname" required placeholder="Nama Lengkap Mempelai Pria" className="w-full p-3 border rounded-xl focus:border-wedding-gold outline-none" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 mb-1">Nama Ayah</label>
                  <input type="text" name="groom_father" placeholder="Nama Ayah" className="w-full p-3 border rounded-xl focus:border-wedding-gold outline-none" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 mb-1">Nama Ibu</label>
                  <input type="text" name="groom_mother" placeholder="Nama Ibu" className="w-full p-3 border rounded-xl focus:border-wedding-gold outline-none" />
                </div>
                <InstantPhotoUpload 
                  label="Foto Mempelai Pria" 
                  name="groom_photo" 
                  accentColor="gold"
                />
              </div>
              
              <div className="md:col-span-2">
                <InstantPhotoUpload 
                  label="Foto Berdua (Hero/Halaman Utama)" 
                  name="couple_photo" 
                  showAiStudio={true}
                  isAiEnabled={false}
                />
              </div>
            </div>
          </section>

          {/* BAGIAN 3: DETAIL ACARA */}
          <section className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
            <h2 className="font-serif text-2xl mb-8 text-gray-900 flex items-center gap-3">
              <span className="w-8 h-8 bg-gray-50 rounded-lg flex items-center justify-center text-sm font-bold text-gray-400">03</span>
              Detail Acara
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-bold text-gray-500 mb-1">Tanggal Acara (Misal: 14 Februari 2027)</label>
                <input type="text" name="event_date" required placeholder="14 Februari 2027" className="w-full p-3 border rounded-xl focus:border-wedding-gold outline-none" />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 mb-1">Waktu Acara</label>
                <input type="text" name="event_time" required placeholder="08:00 - Selesai" className="w-full p-3 border rounded-xl focus:border-wedding-gold outline-none" />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 mb-1">Nama Gedung/Lokasi</label>
                <input type="text" name="event_location" required placeholder="Hotel Mulia Senayan" className="w-full p-3 border rounded-xl focus:border-wedding-gold outline-none" />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 mb-1">Link Google Maps</label>
                <input type="url" name="maps_link" required placeholder="https://maps.google.com/..." className="w-full p-3 border rounded-xl focus:border-wedding-gold outline-none" />
              </div>
              <div className="md:col-span-2">
                <label className="block text-xs font-bold text-gray-500 mb-1">Alamat Lengkap</label>
                <textarea name="event_address" rows={2} required placeholder="Jl. Asia Afrika Senayan..." className="w-full p-3 border rounded-xl focus:border-wedding-gold outline-none"></textarea>
              </div>
              <div className="md:col-span-2">
                <label className="block text-xs font-bold text-gray-500 mb-1">Turut Mengundang (Pisahkan dengan koma)</label>
                <textarea name="turut_mengundang" rows={3} placeholder="Kel. Besar Bpk. Ahmad, Sahabat SMP 1, Aliansi Musisi..." className="w-full p-3 border rounded-xl focus:border-wedding-gold outline-none"></textarea>
              </div>
            </div>
          </section>

          {/* BAGIAN 4: HADIRIN & KADO */}
          <section className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
            <h2 className="font-serif text-2xl mb-8 text-gray-900 flex items-center gap-3">
              <span className="w-8 h-8 bg-gray-50 rounded-lg flex items-center justify-center text-sm font-bold text-gray-400">04</span>
              Quote & Digital Gift
            </h2>
            <div className="space-y-6">
              <QuoteSection 
                initialQuote="Dan di antara tanda-tanda kebesaran-Nya ialah Dia menciptakan pasangan-pasangan untukmu..." 
                initialBrideName="" 
                initialGroomName="" 
                isAiEnabled={false}
              />
              
              <div>
                <label className="block text-xs font-bold text-gray-500 mb-3">Lagu Latar Belakang</label>
                <MusicSelector />
              </div>
              
              <div className="grid md:grid-cols-3 gap-6 bg-gray-50 p-6 rounded-xl border border-gray-100">
                <div>
                  <label className="block text-xs font-bold text-gray-500 mb-1">Nama Bank</label>
                  <input type="text" name="bank_name" placeholder="BCA" className="w-full p-3 border rounded-xl focus:border-wedding-gold outline-none" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 mb-1">Nomor Rekening</label>
                  <input type="text" name="account_number" placeholder="1234567890" className="w-full p-3 border rounded-xl focus:border-wedding-gold outline-none" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 mb-1">Atas Nama</label>
                  <input type="text" name="account_name" placeholder="Ayu Lestari" className="w-full p-3 border rounded-xl focus:border-wedding-gold outline-none" />
                </div>
              </div>
            </div>
          </section>

          <SubmitButton label="Simpan & Buat Undangan" loadingLabel="Sedang Membuat Undangan..." />
        </form>
        )}

        <div className="mt-12">
          <AdminContactCard />
        </div>
      </main>
    </div>
  );
}
