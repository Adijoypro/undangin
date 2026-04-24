import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { createInvitation } from "./actions";
import ThemeSelector from "./ThemeSelector";
import SubmitButton from "@/components/dashboard/SubmitButton";
import LogoutButton from "@/components/dashboard/LogoutButton";

export default async function CreateInvitationPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return redirect("/login");
  }

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 font-sans pb-24">
      <nav className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center gap-4">
              <a href="/dashboard" className="text-sm font-bold text-gray-500 hover:text-wedding-gold">← Kembali</a>
              <span className="font-serif text-xl font-bold text-wedding-text">Buat Undangan</span>
            </div>
            <LogoutButton />
          </div>
        </div>
      </nav>

      <main className="max-w-4xl mx-auto px-4 py-12">
        <form action={createInvitation} className="bg-white p-8 md:p-12 rounded-2xl shadow-xl border border-gray-100 space-y-12">
          
          {/* BAGIAN 1: PENGATURAN UMUM */}
          <section>
            <h2 className="font-serif text-2xl mb-6 text-wedding-text border-b pb-4">1. Pengaturan Dasar</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-bold text-gray-500 mb-1">Custom Link (URL)</label>
                <div className="flex items-center">
                  <span className="bg-gray-100 p-3 rounded-l-xl border border-r-0 text-gray-500 text-sm">undangin.com/</span>
                  <input type="text" name="slug" required placeholder="link-undangan-anda" className="w-full p-3 border rounded-r-xl focus:border-wedding-gold outline-none" />
                </div>
                <p className="text-[10px] text-gray-400 mt-1">Hanya huruf kecil dan strip (-).</p>
              </div>
              <div className="md:col-span-2">
                <ThemeSelector />
              </div>
            </div>
          </section>

          {/* BAGIAN 2: DATA MEMPELAI */}
          <section>
            <h2 className="font-serif text-2xl mb-6 text-wedding-text border-b pb-4">2. Data Mempelai</h2>
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
                <div>
                  <label className="block text-xs font-bold text-gray-500 mb-1">Foto Mempelai Wanita</label>
                  <input type="file" accept="image/*" name="bride_photo" required className="w-full p-2 border rounded-xl focus:border-wedding-gold outline-none file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-bold file:bg-wedding-sage/10 file:text-wedding-sage hover:file:bg-wedding-sage/20" />
                </div>
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
                <div>
                  <label className="block text-xs font-bold text-gray-500 mb-1">Foto Mempelai Pria</label>
                  <input type="file" accept="image/*" name="groom_photo" required className="w-full p-2 border rounded-xl focus:border-wedding-gold outline-none file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-bold file:bg-wedding-gold/10 file:text-wedding-gold hover:file:bg-wedding-gold/20" />
                </div>
              </div>
              
              <div className="md:col-span-2 pt-4">
                <label className="block text-sm font-bold text-gray-700 mb-2">Foto Berdua (Hero/Halaman Utama)</label>
                <div className="flex items-center gap-4 bg-gray-50 p-4 rounded-xl border border-dashed border-wedding-gold/30">
                  <div className="w-16 h-16 bg-white rounded-lg border border-gray-200 flex items-center justify-center text-gray-300">
                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                  </div>
                  <div className="flex-1">
                    <input type="file" name="couple_photo" accept="image/*" className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-bold file:bg-wedding-gold/10 file:text-wedding-gold hover:file:bg-wedding-gold/20 cursor-pointer" />
                    <p className="text-[10px] text-gray-400 mt-1 italic">Orientasi landscape sangat disarankan untuk tampilan hero.</p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* BAGIAN 3: DETAIL ACARA */}
          <section>
            <h2 className="font-serif text-2xl mb-6 text-wedding-text border-b pb-4">3. Detail Acara</h2>
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
          <section>
            <h2 className="font-serif text-2xl mb-6 text-wedding-text border-b pb-4">4. Quote & Digital Gift</h2>
            <div className="space-y-6">
              <div>
                <label className="block text-xs font-bold text-gray-500 mb-1">Quote / Kutipan</label>
                <textarea name="quote" rows={2} defaultValue="Dan di antara tanda-tanda kebesaran-Nya ialah Dia menciptakan pasangan-pasangan untukmu..." className="w-full p-3 border rounded-xl focus:border-wedding-gold outline-none"></textarea>
              </div>
              
              <div>
                <label className="block text-xs font-bold text-gray-500 mb-1">Upload Lagu Background (MP3)</label>
                <input type="file" accept="audio/mpeg" name="music_file" className="w-full p-2 border rounded-xl focus:border-wedding-gold outline-none file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-bold file:bg-gray-100 file:text-gray-700 hover:file:bg-gray-200" />
                <p className="text-[10px] text-gray-400 mt-1">Kosongkan jika ingin menggunakan lagu default.</p>
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
      </main>
    </div>
  );
}
