import { redirect } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { updateInvitation } from "./actions";
import MusicSelector from "@/components/dashboard/MusicSelector";
import ThemeSelector from "../../create/ThemeSelector";
import SubmitButton from "@/components/dashboard/SubmitButton";
import LogoutButton from "@/components/dashboard/LogoutButton";
import QuoteSection from "@/components/dashboard/QuoteSection";
import InstantPhotoUpload from "@/components/dashboard/InstantPhotoUpload";
import UpgradeAiButton from "@/components/dashboard/UpgradeAiButton";
import SlugInput from "@/components/dashboard/SlugInput";


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
    <div className="min-h-screen bg-[#FDFBF7] text-gray-800 font-sans pb-24">
      <header className="bg-white/80 border-b border-gray-100 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 h-16 flex justify-between items-center">
          <div className="flex items-center gap-6">
            <Link href="/dashboard" className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 hover:bg-black hover:text-white transition-all">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
            </Link>
            <h1 className="font-serif text-lg font-bold text-gray-900">Edit Undangan</h1>
          </div>
          <LogoutButton />
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-12">
        <form action={updateInvitation} className="space-y-8">
          <input type="hidden" name="id" value={invitation.id} />
          
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
          
          {/* BAGIAN 1: PENGATURAN UMUM */}
          <section className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
            <h2 className="font-serif text-2xl mb-8 text-gray-900 flex items-center gap-3">
              <span className="w-8 h-8 bg-gray-50 rounded-lg flex items-center justify-center text-sm font-bold text-gray-400">01</span>
              Pengaturan Dasar
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="md:col-span-1">
                <SlugInput defaultValue={invitation.slug} />
              </div>
              <div className="md:col-span-2">
                <ThemeSelector defaultValue={invitation.theme} />
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
                  <input type="text" name="bride_name" defaultValue={invitation.bride_name} required placeholder="Ayu" className="w-full p-3 border rounded-xl focus:border-wedding-gold outline-none" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 mb-1">Nama Lengkap</label>
                  <input type="text" name="bride_fullname" defaultValue={invitation.bride_fullname} required placeholder="Ayu Lestari" className="w-full p-3 border rounded-xl focus:border-wedding-gold outline-none" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 mb-1">Nama Ayah</label>
                  <input type="text" name="bride_father" defaultValue={invitation.bride_father} placeholder="Nama Ayah" className="w-full p-3 border rounded-xl focus:border-wedding-gold outline-none" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 mb-1">Nama Ibu</label>
                  <input type="text" name="bride_mother" defaultValue={invitation.bride_mother} placeholder="Nama Ibu" className="w-full p-3 border rounded-xl focus:border-wedding-gold outline-none" />
                </div>
                <InstantPhotoUpload 
                  label="Update Foto Mempelai Wanita" 
                  name="bride_photo" 
                  initialPhotoUrl={invitation.bride_photo}
                  accentColor="sage"
                />
              </div>

              {/* Groom */}
              <div className="space-y-4">
                <h3 className="font-bold text-sm uppercase tracking-widest text-wedding-gold">Mempelai Pria</h3>
                <div>
                  <label className="block text-xs font-bold text-gray-500 mb-1">Nama Panggilan</label>
                  <input type="text" name="groom_name" defaultValue={invitation.groom_name} required placeholder="Phinisi" className="w-full p-3 border rounded-xl focus:border-wedding-gold outline-none" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 mb-1">Nama Lengkap</label>
                  <input type="text" name="groom_fullname" defaultValue={invitation.groom_fullname} required placeholder="Phinisi Wijaya" className="w-full p-3 border rounded-xl focus:border-wedding-gold outline-none" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 mb-1">Nama Ayah</label>
                  <input type="text" name="groom_father" defaultValue={invitation.groom_father} placeholder="Nama Ayah" className="w-full p-3 border rounded-xl focus:border-wedding-gold outline-none" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 mb-1">Nama Ibu</label>
                  <input type="text" name="groom_mother" defaultValue={invitation.groom_mother} placeholder="Nama Ibu" className="w-full p-3 border rounded-xl focus:border-wedding-gold outline-none" />
                </div>
                <InstantPhotoUpload 
                  label="Update Foto Mempelai Pria" 
                  name="groom_photo" 
                  initialPhotoUrl={invitation.groom_photo}
                  accentColor="gold"
                />
              </div>

              <div className="md:col-span-2 pt-4">
                <InstantPhotoUpload 
                  label="Update Foto Berdua (Hero/Halaman Utama)" 
                  name="couple_photo" 
                  initialPhotoUrl={invitation.couple_photo}
                  showAiStudio={true}
                  isAiEnabled={invitation.is_ai_enabled || false}
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
                <input type="text" name="event_date" defaultValue={invitation.event_date} required placeholder="14 Februari 2027" className="w-full p-3 border rounded-xl focus:border-wedding-gold outline-none" />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 mb-1">Waktu Acara</label>
                <input type="text" name="event_time" defaultValue={invitation.event_time} required placeholder="08:00 - Selesai" className="w-full p-3 border rounded-xl focus:border-wedding-gold outline-none" />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 mb-1">Nama Gedung/Lokasi</label>
                <input type="text" name="event_location" defaultValue={invitation.event_location} required placeholder="Hotel Mulia Senayan" className="w-full p-3 border rounded-xl focus:border-wedding-gold outline-none" />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 mb-1">Link Google Maps</label>
                <input type="url" name="maps_link" defaultValue={invitation.maps_link} required placeholder="https://maps.google.com/..." className="w-full p-3 border rounded-xl focus:border-wedding-gold outline-none" />
              </div>
              <div className="md:col-span-2">
                <label className="block text-xs font-bold text-gray-500 mb-1">Alamat Lengkap</label>
                <textarea name="event_address" defaultValue={invitation.event_address} rows={2} required placeholder="Jl. Asia Afrika Senayan..." className="w-full p-3 border rounded-xl focus:border-wedding-gold outline-none"></textarea>
              </div>
              <div className="md:col-span-2">
                <label className="block text-xs font-bold text-gray-500 mb-1">Turut Mengundang (Pisahkan dengan koma)</label>
                <textarea name="turut_mengundang" defaultValue={invitation.turut_mengundang} rows={3} placeholder="Kel. Besar Bpk. Ahmad, Sahabat SMP 1, Aliansi Musisi..." className="w-full p-3 border rounded-xl focus:border-wedding-gold outline-none"></textarea>
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
                initialQuote={invitation.quote} 
                initialBrideName={invitation.bride_name} 
                initialGroomName={invitation.groom_name} 
                isAiEnabled={invitation.is_ai_enabled || false}
              />
              
              <div>
                <label className="block text-xs font-bold text-gray-500 mb-3">Lagu Latar Belakang</label>
                <MusicSelector currentMusicUrl={invitation.music_url} />
              </div>
              
              <div className="grid md:grid-cols-3 gap-6 bg-gray-50 p-6 rounded-xl border border-gray-100">
                <div>
                  <label className="block text-xs font-bold text-gray-500 mb-1">Nama Bank</label>
                  <input type="text" name="bank_name" defaultValue={invitation.bank_name} placeholder="BCA" className="w-full p-3 border rounded-xl focus:border-wedding-gold outline-none" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 mb-1">Nomor Rekening</label>
                  <input type="text" name="account_number" defaultValue={invitation.account_number} placeholder="1234567890" className="w-full p-3 border rounded-xl focus:border-wedding-gold outline-none" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 mb-1">Atas Nama</label>
                  <input type="text" name="account_name" defaultValue={invitation.account_name} placeholder="Ayu Lestari" className="w-full p-3 border rounded-xl focus:border-wedding-gold outline-none" />
                </div>
              </div>
            </div>
          </section>

          <SubmitButton label="Simpan Perubahan" loadingLabel="Sedang Menyimpan..." />
        </form>
      </main>
    </div>
  );
}
