import { redirect } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";

export default async function DashboardPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect("/login");
  }

  // Fetch user's invitations with guestbook relations
  const { data: invitations } = await supabase
    .from("invitations")
    .select("*, guestbook(*)")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  // Calculate Analytics
  const totalInvitations = invitations?.length || 0;
  let totalRSVP = 0;
  let totalHadir = 0;

  if (invitations) {
    invitations.forEach(inv => {
      if (inv.guestbook) {
        totalRSVP += inv.guestbook.length;
        totalHadir += inv.guestbook.filter((g: any) => g.attendance === 'Hadir').length;
      }
    });
  }

  // Placeholder for User Credit (Future: Fetch from DB)
  const userCredits = 5;

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 font-sans">
      {/* NAVBAR */}
      <nav className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-wedding-gold rounded-full flex items-center justify-center text-white font-bold font-serif">U</div>
              <span className="font-serif text-xl font-bold text-wedding-text">Dasbor Undangin</span>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-500">{user.email}</span>
              <form action={async () => {
                "use server";
                const supabase = await createClient();
                await supabase.auth.signOut();
                redirect("/login");
              }}>
                <button className="text-sm font-bold text-red-500 hover:underline">Keluar</button>
              </form>
            </div>
          </div>
        </div>
      </nav>

      {/* MAIN */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-serif font-bold text-wedding-text">Selamat Datang!</h1>
            <p className="text-gray-500 text-sm mt-1">Pantau performa undangan dan daftar tamu Anda di sini.</p>
          </div>
          
          <div className="bg-white px-4 py-3 rounded-xl shadow-sm border border-wedding-gold/20 flex items-center gap-4">
            <div>
              <p className="text-xs text-gray-500 font-bold uppercase tracking-wider">Sisa Saldo Kredit</p>
              <p className="font-serif text-xl font-bold text-wedding-gold">{userCredits} Undangan</p>
            </div>
            <Link href="/dashboard/topup" className="bg-wedding-text text-white px-4 py-2 rounded-lg text-xs font-bold hover:bg-wedding-gold transition-colors">
              Top Up
            </Link>
          </div>
        </div>

        {/* ANALYTICS CARDS */}
        <div className="grid grid-cols-3 gap-6 mb-10">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
            <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center text-blue-500">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 19v-8.93a2 2 0 01.89-1.664l7-4.666a2 2 0 012.22 0l7 4.666A2 2 0 0121 10.07V19M3 19a2 2 0 002 2h14a2 2 0 002-2M3 19l6.75-4.5M21 19l-6.75-4.5M3 10l6.75 4.5M21 10l-6.75 4.5m0 0l-1.14.76a2 2 0 01-2.22 0l-1.14-.76"></path></svg>
            </div>
            <div>
              <p className="text-xs text-gray-500 font-bold uppercase tracking-wider">Total Undangan</p>
              <p className="text-2xl font-serif font-bold text-gray-800">{totalInvitations}</p>
            </div>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
            <div className="w-12 h-12 bg-wedding-sage/10 rounded-full flex items-center justify-center text-wedding-sage">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z"></path></svg>
            </div>
            <div>
              <p className="text-xs text-gray-500 font-bold uppercase tracking-wider">Total Ucapan (RSVP)</p>
              <p className="text-2xl font-serif font-bold text-gray-800">{totalRSVP}</p>
            </div>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
            <div className="w-12 h-12 bg-green-50 rounded-full flex items-center justify-center text-green-500">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
            </div>
            <div>
              <p className="text-xs text-gray-500 font-bold uppercase tracking-wider">Tamu Akan Hadir</p>
              <p className="text-2xl font-serif font-bold text-gray-800">{totalHadir}</p>
            </div>
          </div>
        </div>
        
        <h2 className="text-xl font-serif font-bold text-wedding-text mb-6">Daftar Undangan Anda</h2>
        <div className="grid md:grid-cols-3 gap-6">
          {/* Create New Invite Card */}
          <Link href="/dashboard/create">
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-dashed border-wedding-gold text-center group cursor-pointer hover:bg-wedding-gold/5 transition-colors h-full">
              <div className="w-12 h-12 bg-wedding-gold/10 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                <svg className="w-6 h-6 text-wedding-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path></svg>
              </div>
              <h3 className="font-bold mb-2">Buat Undangan Baru</h3>
              <p className="text-xs text-gray-500">Mulai rancang undangan digital Anda.</p>
            </div>
          </Link>

          {/* List of Invitations */}
          {invitations && invitations.length > 0 ? (
            invitations.map((invitation) => (
              <div key={invitation.id} className="bg-white p-6 rounded-2xl shadow-md border border-gray-100 flex flex-col justify-between hover:shadow-lg transition-shadow">
                <div>
                  <div className="flex justify-between items-start mb-4">
                    <span className="bg-wedding-sage/10 text-wedding-sage text-[10px] uppercase tracking-widest px-3 py-1 rounded-full font-bold">
                      {invitation.theme === 'cinematic' || invitation.theme === 'cinematic-dark' ? 'Cinematic Dark' : 
                       invitation.theme === 'ultra-luxury' ? 'Ultra Luxury' : 
                       invitation.theme === 'majestic-eternity' ? 'Majestic Eternity' : 
                       'Premium Sage'}
                    </span>
                  </div>
                  <h3 className="font-serif text-2xl text-wedding-text mb-1">{invitation.bride_name} & {invitation.groom_name}</h3>
                  <p className="text-sm text-gray-500 mb-4">/{invitation.slug}</p>
                </div>
                
                <div className="flex items-center gap-2 pt-4 border-t border-gray-100">
                  <a href={`/${invitation.slug}`} target="_blank" className="flex-1 text-center py-2 bg-gray-100 text-gray-700 rounded-lg text-[10px] font-bold uppercase tracking-widest hover:bg-gray-200 transition-colors">
                    Lihat
                  </a>
                  <Link href={`/dashboard/edit/${invitation.id}`} className="flex-1 text-center py-2 border border-gray-200 text-gray-700 rounded-lg text-[10px] font-bold uppercase tracking-widest hover:border-wedding-gold hover:text-wedding-gold transition-colors">
                    Edit
                  </Link>
                  <a href={`https://wa.me/?text=${encodeURIComponent(`Tanpa mengurangi rasa hormat, kami mengundang Bapak/Ibu/Saudara/i untuk hadir di acara pernikahan kami.\n\nBuka undangan digital: https://undangin.com/${invitation.slug}`)}`} target="_blank" className="flex-1 flex items-center justify-center gap-1 py-2 bg-green-500 text-white rounded-lg text-[10px] font-bold uppercase tracking-widest hover:bg-green-600 transition-colors">
                    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 00-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                    Share
                  </a>
                </div>
              </div>
            ))
          ) : (
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-200 opacity-50 flex flex-col items-center justify-center text-center">
              <svg className="w-10 h-10 text-gray-300 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"></path></svg>
              <h3 className="font-bold mb-1 text-gray-400">Belum Ada Undangan</h3>
              <p className="text-xs text-gray-400">Buat undangan pertama Anda.</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
