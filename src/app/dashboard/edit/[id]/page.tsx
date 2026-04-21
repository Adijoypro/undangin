import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { updateInvitation } from "./actions";

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
    <div className="min-h-screen bg-gray-50 text-gray-800 font-sans pb-24">
      <nav className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center gap-4">
              <a href="/dashboard" className="text-sm font-bold text-gray-500 hover:text-wedding-gold">← Kembali</a>
              <span className="font-serif text-xl font-bold text-wedding-text">Edit Undangan</span>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-4xl mx-auto px-4 py-12">
        <form action={updateInvitation} className="bg-white p-8 md:p-12 rounded-2xl shadow-xl border border-gray-100 space-y-12">
          <input type="hidden" name="id" value={invitation.id} />
          
          {/* BAGIAN 1: PENGATURAN UMUM */}
          <section>
            <h2 className="font-serif text-2xl mb-6 text-wedding-text border-b pb-4">1. Pengaturan Dasar</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-bold text-gray-500 mb-1">Custom Link (URL)</label>
                <div className="flex items-center">
                  <span className="bg-gray-100 p-3 rounded-l-xl border border-r-0 text-gray-500 text-sm">undangin.com/</span>
                  <input type="text" name="slug" defaultValue={invitation.slug} required placeholder="ayu-phinisi" className="w-full p-3 border rounded-r-xl focus:border-wedding-gold outline-none" />
                </div>
                <p className="text-[10px] text-gray-400 mt-1">Hanya huruf kecil dan strip (-).</p>
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 mb-1">Pilih Tema</label>
                <select name="theme" defaultValue={invitation.theme} className="w-full p-3 border rounded-xl focus:border-wedding-gold outline-none bg-white">
                  <option value="premium">The Royal Split-Door (Sage & Gold)</option>
                  <option value="cinematic-dark">The Cinematic Dark (Framer Motion)</option>
                  <option value="ultra-luxury">The Ultra Luxury (Onyx & Rose Gold)</option>
                  <option value="majestic-eternity">Majestic Eternity (Emerald & Gold) - DEWA TIER</option>
                </select>
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
                  <input type="text" name="bride_name" defaultValue={invitation.bride_name} required placeholder="Ayu" className="w-full p-3 border rounded-xl focus:border-wedding-gold outline-none" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 mb-1">Nama Lengkap</label>
                  <input type="text" name="bride_fullname" defaultValue={invitation.bride_fullname} required placeholder="Ayu Lestari" className="w-full p-3 border rounded-xl focus:border-wedding-gold outline-none" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 mb-1">Update Foto Mempelai Wanita</label>
                  <input type="file" accept="image/*" name="bride_photo" className="w-full p-2 border rounded-xl focus:border-wedding-gold outline-none file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-bold file:bg-wedding-sage/10 file:text-wedding-sage hover:file:bg-wedding-sage/20" />
                  <p className="text-[10px] text-gray-400 mt-1">Kosongkan jika tidak ingin mengganti foto.</p>
                </div>
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
                  <label className="block text-xs font-bold text-gray-500 mb-1">Update Foto Mempelai Pria</label>
                  <input type="file" accept="image/*" name="groom_photo" className="w-full p-2 border rounded-xl focus:border-wedding-gold outline-none file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-bold file:bg-wedding-gold/10 file:text-wedding-gold hover:file:bg-wedding-gold/20" />
                  <p className="text-[10px] text-gray-400 mt-1">Kosongkan jika tidak ingin mengganti foto.</p>
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
            </div>
          </section>

          {/* BAGIAN 4: HADIRIN & KADO */}
          <section>
            <h2 className="font-serif text-2xl mb-6 text-wedding-text border-b pb-4">4. Quote & Digital Gift</h2>
            <div className="space-y-6">
              <div>
                <label className="block text-xs font-bold text-gray-500 mb-1">Quote / Kutipan</label>
                <textarea name="quote" defaultValue={invitation.quote} rows={2} className="w-full p-3 border rounded-xl focus:border-wedding-gold outline-none"></textarea>
              </div>
              
              <div>
                <label className="block text-xs font-bold text-gray-500 mb-1">Update Lagu Background (MP3)</label>
                <input type="file" accept="audio/mpeg" name="music_file" className="w-full p-2 border rounded-xl focus:border-wedding-gold outline-none file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-bold file:bg-gray-100 file:text-gray-700 hover:file:bg-gray-200" />
                <p className="text-[10px] text-gray-400 mt-1">Kosongkan jika tidak ingin mengganti lagu.</p>
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

          <button type="submit" className="w-full py-5 bg-wedding-text text-white font-bold rounded-xl hover:bg-wedding-gold transition-colors uppercase tracking-widest text-sm shadow-xl mt-12">
            Simpan Perubahan
          </button>
        </form>
      </main>
    </div>
  );
}
