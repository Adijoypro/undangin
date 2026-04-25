import { redirect } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import PublishButton from "@/components/dashboard/PublishButton";
import LogoutButton from "@/components/dashboard/LogoutButton";
import AdminContactCard from "@/components/dashboard/AdminContactCard";
import MiniPricingGrid from "@/components/dashboard/MiniPricingGrid";
import ThemeCatalog from "@/components/dashboard/ThemeCatalog";
import DashboardShell from "@/components/dashboard/DashboardShell";
import SuccessNotification from "@/components/dashboard/SuccessNotification";

export default async function DashboardPage() {
  const supabase = await createClient();
  const origin = "https://undanginaja.vercel.app";

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect("/login");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("credits")
    .eq("id", user.id)
    .single();

  const userCredits = profile?.credits || 0;

  const { data: invitations } = await supabase
    .from("invitations")
    .select("*, guestbook(*)")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

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
    <DashboardShell>
      <SuccessNotification />
      <header className="bg-white/80 dark:bg-slate-950/80 border-b border-gray-100 dark:border-white/5 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 h-20 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <Link href="/" className="flex items-center gap-2 group">
              <img src="/logo.png" alt="Logo" className="w-6 h-6 md:w-8 md:h-8 group-hover:rotate-12 transition-transform" />
              <span className="font-serif font-bold text-lg md:text-xl text-wedding-text dark:text-white truncate max-w-[100px] md:max-w-none">Undangin</span>
            </Link>
          </div>
          
          <div className="flex items-center gap-2 md:gap-4">
            <div className="bg-[#FFF9E6] px-3 py-1.5 md:px-4 md:py-2 rounded-full border border-[#FFE699] flex items-center gap-1.5 md:gap-2">
              <div className="w-4 h-4 md:w-5 md:h-5 bg-[#D4AF37] rounded-full flex items-center justify-center text-white text-[8px] md:text-[10px] font-bold italic">B</div>
              <span className="font-serif font-bold text-[#D4AF37] text-xs md:text-sm whitespace-nowrap">{userCredits} <span className="hidden xs:inline">Kredit</span></span>
            </div>
            <Link href="/dashboard/topup" className="bg-[#111111] hover:bg-black text-white px-3 py-1.5 md:px-6 md:py-2 rounded-lg text-[10px] md:text-xs font-bold uppercase tracking-widest transition-all whitespace-nowrap">
              Top Up
            </Link>
            <LogoutButton />
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6 mb-12">
          {[
            { label: 'UNDANGAN', value: totalInvitations, icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>, color: 'text-[#D4AF37]', bg: 'bg-yellow-50' },
            { label: 'RSVP', value: totalRSVP, icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z"></path>, color: 'text-blue-600', bg: 'bg-blue-50' },
            { label: 'HADIR', value: totalHadir, icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>, color: 'text-green-600', bg: 'bg-green-50' },
            { label: 'STATUS', value: 'ACTIVE', icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"></path>, color: 'text-indigo-600', bg: 'bg-indigo-50' }
          ].map((item, idx) => (
            <div key={idx} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
              <div className={`w-12 h-12 ${item.bg} rounded-xl flex items-center justify-center ${item.color}`}>
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">{item.icon}</svg>
              </div>
              <div className="min-w-0">
                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-1 truncate">{item.label}</p>
                <p className="text-2xl font-serif font-bold text-gray-900 leading-none">{item.value}</p>
              </div>
            </div>
          ))}
        </div>
        
        <MiniPricingGrid />
        <div className="mb-12">
          <AdminContactCard />
        </div>

        <div className="flex justify-between items-center mb-10">
          <h2 className="text-2xl font-serif font-bold text-gray-900">Daftar Undangan Anda</h2>
          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.3em]">{totalInvitations} ITEM</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <Link href="/dashboard/create">
            <div className="bg-white p-10 rounded-2xl shadow-sm border-2 border-dashed border-[#D4AF37]/30 text-center group cursor-pointer hover:bg-yellow-50/50 transition-all h-full flex flex-col justify-center">
              <div className="w-14 h-14 bg-yellow-50 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                <svg className="w-8 h-8 text-[#D4AF37]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path></svg>
              </div>
              <h3 className="font-serif text-2xl font-bold mb-2 text-gray-900">Buat Baru</h3>
              <p className="text-[10px] text-gray-400 font-bold uppercase tracking-[0.2em]">MULAI DESAIN SEKARANG</p>
            </div>
          </Link>

          {invitations?.map((invitation) => (
            <div key={invitation.id} className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex flex-col justify-between hover:shadow-md transition-all duration-300">
              <div>
                <div className="flex justify-between items-start mb-6">
                  <span className="bg-gray-50 text-gray-400 text-[8px] uppercase tracking-widest px-3 py-1 rounded font-bold">
                    {invitation.theme.replace(/-/g, ' ').toUpperCase()}
                  </span>
                  <div className={invitation.status === 'published' ? '' : 'bg-[#D4AF37] rounded overflow-hidden shadow-sm'}>
                    <PublishButton 
                      invitationId={invitation.id} 
                      status={invitation.status} 
                      userCredits={userCredits} 
                    />
                  </div>
                </div>
                <h3 className="font-serif text-3xl text-gray-800 mb-2 line-clamp-1">{invitation.bride_name} & {invitation.groom_name}</h3>
                <div className="flex items-center gap-2 mb-6">
                  <svg className="w-3 h-3 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"></path></svg>
                  <p className="text-[10px] text-[#D4AF37] font-bold tracking-widest">/ {invitation.slug}</p>
                </div>

                <div className="grid grid-cols-3 gap-2 mb-4">
                  <a href={`/${invitation.slug}`} target="_blank" className="text-center py-2 bg-gray-50 text-gray-500 rounded-lg text-[9px] font-bold uppercase tracking-widest hover:bg-[#111] hover:text-white transition-all">
                    LIHAT
                  </a>
                  <Link href={`/dashboard/edit/${invitation.id}`} className="text-center py-2 bg-gray-50 text-gray-500 rounded-lg text-[9px] font-bold uppercase tracking-widest hover:bg-[#111] hover:text-white transition-all">
                    EDIT
                  </Link>
                  <Link href={`/dashboard/invitation/${invitation.id}/guests`} className="text-center py-2 bg-gray-50 text-gray-500 rounded-lg text-[9px] font-bold uppercase tracking-widest hover:bg-[#111] hover:text-white transition-all">
                    DATA TAMU
                  </Link>
                </div>
              </div>
              
                {invitation.status === 'published' && (
                  <a 
                    href={`https://wa.me/?text=${encodeURIComponent(`Yth. Bapak/Ibu/Saudara/i,\n\nTanpa mengurangi rasa hormat, perkenankan kami mengundang Anda untuk hadir dan memberikan doa restu di acara pernikahan kami:\n\n*${invitation.bride_name} & ${invitation.groom_name}*\n\nKlik link di bawah ini untuk melihat detail acara & RSVP:\n\n${origin}/${invitation.slug}\n\nMerupakan suatu kehormatan bagi kami apabila Anda dapat hadir dan memberikan doa restu. Terima kasih.`)}`}
                    target="_blank"
                    className="w-full py-3 bg-[#00C853] text-white rounded-xl text-[10px] font-bold uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-[#00E676] transition-all"
                  >
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.414 0 .004 5.412.001 12.048a11.827 11.827 0 001.578 5.91L0 24l6.102-1.6c1.863.516 3.827.788 5.792.788h.005c6.632 0 12.042-5.412 12.045-12.048a11.82 11.82 0 00-3.526-8.433"/></svg>
                    SHARE WHATSAPP
                  </a>
                )}
            </div>
          ))}
        </div>

        <ThemeCatalog />
      </main>
    </DashboardShell>
  );
}
