import { redirect } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import PublishButton from "@/components/dashboard/PublishButton";
import LogoutButton from "@/components/dashboard/LogoutButton";

export default async function DashboardPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect("/login");
  }

  // Fetch user's profile for credits
  const { data: profile } = await supabase
    .from("profiles")
    .select("credits")
    .eq("id", user.id)
    .single();

  const userCredits = profile?.credits || 0;

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

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 font-sans">
      {/* NAVBAR */}
      <nav className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-3">
                <img src="/logo.png" alt="Undangin Logo" className="w-10 h-10 object-contain" />
                <span className="font-serif text-xl font-bold text-wedding-text hidden sm:inline">Undangin</span>
              </div>
              <div className="h-6 w-[1px] bg-gray-200 hidden sm:block"></div>
              <a href="/" className="text-sm font-bold text-gray-500 hover:text-wedding-gold transition-colors">Beranda</a>
            </div>
            <div className="flex items-center gap-2 sm:gap-4">
              <div className="bg-wedding-gold/10 px-3 py-1.5 rounded-lg flex items-center gap-2">
                <svg className="w-4 h-4 text-wedding-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                <span className="text-xs font-bold text-wedding-gold">{userCredits} Kredit</span>
              </div>
              <Link href="/dashboard/topup" className="bg-wedding-text text-white px-3 py-1.5 rounded-lg text-xs font-bold hover:bg-gray-800 transition-colors">
                Top Up
              </Link>
              <LogoutButton />
            </div>
          </div>
        </div>
      </nav>

      {/* CONTENT */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        {/* Analytics Grid - OPTIMIZED FOR MOBILE */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6 mb-12">
          <div className="bg-white p-3 sm:p-5 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-3 sm:gap-4 hover:border-wedding-gold/20 transition-all">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-wedding-gold/10 rounded-xl sm:rounded-2xl flex items-center justify-center text-wedding-gold shrink-0">
              <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
            </div>
            <div className="min-w-0">
              <p className="text-[9px] sm:text-[10px] text-gray-400 font-bold uppercase tracking-wider mb-0.5 sm:mb-1 truncate">Undangan</p>
              <p className="text-xl sm:text-2xl font-serif font-bold text-gray-800 leading-none">{totalInvitations}</p>
            </div>
          </div>
          
          <div className="bg-white p-3 sm:p-5 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-3 sm:gap-4 hover:border-wedding-sage/20 transition-all">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-wedding-sage/10 rounded-xl sm:rounded-2xl flex items-center justify-center text-wedding-sage shrink-0">
              <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z"></path></svg>
            </div>
            <div className="min-w-0">
              <p className="text-[9px] sm:text-[10px] text-gray-400 font-bold uppercase tracking-wider mb-0.5 sm:mb-1 truncate">RSVP</p>
              <p className="text-xl sm:text-2xl font-serif font-bold text-gray-800 leading-none">{totalRSVP}</p>
            </div>
          </div>

          <div className="bg-white p-3 sm:p-5 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-3 sm:gap-4 hover:border-green-100 transition-all">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-green-50 rounded-xl sm:rounded-2xl flex items-center justify-center text-green-500 shrink-0">
              <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
            </div>
            <div className="min-w-0">
              <p className="text-[9px] sm:text-[10px] text-gray-400 font-bold uppercase tracking-wider mb-0.5 sm:mb-1 truncate">Hadir</p>
              <p className="text-xl sm:text-2xl font-serif font-bold text-gray-800 leading-none">{totalHadir}</p>
            </div>
          </div>

          <div className="bg-white p-3 sm:p-5 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-3 sm:gap-4 hover:border-wedding-gold/20 transition-all">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gray-50 rounded-xl sm:rounded-2xl flex items-center justify-center text-gray-400 shrink-0">
              <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"></path></svg>
            </div>
            <div className="min-w-0">
              <p className="text-[9px] sm:text-[10px] text-gray-400 font-bold uppercase tracking-wider mb-0.5 sm:mb-1 truncate">Growth</p>
              <p className="text-xl sm:text-2xl font-serif font-bold text-gray-800 leading-none">High</p>
            </div>
          </div>
        </div>
        
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-serif font-bold text-wedding-text">Daftar Undangan Anda</h2>
          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{totalInvitations} Item</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Create New Invite Card */}
          <Link href="/dashboard/create">
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-dashed border-wedding-gold text-center group cursor-pointer hover:bg-wedding-gold/5 transition-colors h-full flex flex-col justify-center">
              <div className="w-12 h-12 bg-wedding-gold/10 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                <svg className="w-6 h-6 text-wedding-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path></svg>
              </div>
              <h3 className="font-bold mb-1 text-gray-800">Buat Baru</h3>
              <p className="text-[10px] text-gray-500 uppercase tracking-widest">Mulai Desain Sekarang</p>
            </div>
          </Link>

          {/* List of Invitations */}
          {invitations && invitations.length > 0 ? (
            invitations.map((invitation) => (
              <div key={invitation.id} className="bg-white p-6 rounded-2xl shadow-md border border-gray-100 flex flex-col justify-between hover:shadow-lg transition-all">
                <div>
                  <div className="flex justify-between items-start mb-4">
                    <span className="bg-wedding-sage/10 text-wedding-sage text-[9px] uppercase tracking-widest px-2 py-0.5 rounded font-bold border border-wedding-sage/20">
                      {invitation.theme}
                    </span>
                    <PublishButton invitationId={invitation.id} status={invitation.status} />
                  </div>
                  <h3 className="font-serif text-2xl text-wedding-text mb-1 line-clamp-1">{invitation.bride_name} & {invitation.groom_name}</h3>
                  <div className="flex items-center gap-1 group/link">
                    <svg className="w-2.5 h-2.5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"></path></svg>
                    <p className="text-[10px] text-wedding-gold font-mono font-bold tracking-tight">/{invitation.slug}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-2 pt-4 border-t border-gray-100">
                  <a href={`/${invitation.slug}`} target="_blank" className="flex-1 text-center py-2 bg-gray-100 text-gray-700 rounded-lg text-[10px] font-bold uppercase tracking-widest hover:bg-gray-200 transition-colors">
                    Lihat
                  </a>
                  <Link href={`/dashboard/edit/${invitation.id}`} className="flex-1 text-center py-2 border border-gray-200 text-gray-700 rounded-lg text-[10px] font-bold uppercase tracking-widest hover:border-wedding-gold hover:text-wedding-gold transition-colors">
                    Edit
                  </Link>
                  <a 
                    href={`https://wa.me/?text=${encodeURIComponent(`Tanpa mengurangi rasa hormat, kami mengundang Bapak/Ibu/Saudara/i untuk hadir di acara pernikahan kami.\n\nBuka undangan digital kami melalui link di bawah ini:\n\n`)}https://${typeof window !== 'undefined' ? window.location.host : 'undanginaja.vercel.app'}/${invitation.slug}`} 
                    target="_blank" 
                    className="flex-1 flex items-center justify-center gap-1 py-2 bg-green-500 text-white rounded-lg text-[10px] font-bold uppercase tracking-widest hover:bg-green-600 transition-colors"
                  >
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

        {/* NEW: THEME CATALOG SECTION */}
        <div className="mt-16 mb-12">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-serif font-bold text-wedding-text">Katalog Tema Premium</h2>
            <span className="text-[10px] font-bold text-wedding-gold uppercase tracking-widest">Arahkan untuk Demo</span>
          </div>
          
          <div className="relative">
            {/* Optimized Scroll Container for Mobile */}
            <div className="overflow-x-auto pb-8 no-scrollbar snap-x snap-mandatory [ -webkit-overflow-scrolling:touch ]">
              <div className="flex gap-5 sm:gap-8 w-fit mx-auto px-4">
                {[
                  { id: "ultra-luxury", name: "Ultra Luxury", color: "bg-black", text: "text-white" },
                  { id: "cinematic-dark", name: "Cinematic Dark", color: "bg-gray-900", text: "text-white" },
                  { id: "premium", name: "Premium Sage", color: "bg-[#7C8C77]", text: "text-white" },
                  { id: "renaissance-garden", name: "Renaissance", color: "bg-[#F9F6F0]", text: "text-gray-800" },
                  { id: "majestic-eternity", name: "Majestic", color: "bg-[#0A1C14]", text: "text-white" }
                ].map((theme) => (
                  <div key={theme.id} className="w-[200px] sm:w-[240px] snap-center shrink-0 group">
                    <div className={`aspect-[9/16] rounded-2xl overflow-hidden ${theme.color} border border-gray-100 relative shadow-md group-hover:shadow-2xl transition-all duration-500 group-hover:-translate-y-2`}>
                      <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center z-10 group-hover:opacity-0 transition-opacity duration-300">
                        <h4 className={`font-serif text-lg font-bold ${theme.text}`}>{theme.name}</h4>
                        <div className="w-8 h-[1px] bg-wedding-gold mt-2"></div>
                        <p className="text-[9px] text-wedding-gold font-bold uppercase tracking-[0.2em] mt-4">Ketuk untuk Demo</p>
                      </div>
                      {/* Live Preview Iframe - Fixed Scale */}
                      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 z-20 bg-white">
                         <iframe 
                          src={`/demo/${theme.id}`} 
                          className="w-full h-full border-none pointer-events-none"
                          title={`Demo ${theme.name}`}
                        ></iframe>
                      </div>
                      <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent group-hover:opacity-0 transition-opacity"></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
