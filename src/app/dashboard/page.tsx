import { redirect } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import PublishButton from "@/components/dashboard/PublishButton";
import UserProfile from "@/components/dashboard/UserProfile";
import AdminContactCard from "@/components/dashboard/AdminContactCard";
import MiniPricingGrid from "@/components/dashboard/MiniPricingGrid";
import ThemeCatalog from "@/components/dashboard/ThemeCatalog";
import DashboardShell from "@/components/dashboard/DashboardShell";
import SuccessNotification from "@/components/dashboard/SuccessNotification";
import { Mail, Users, CheckCircle, Activity, Plus, ExternalLink, Edit3, Database, Share2 } from "lucide-react";

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
      <header className="bg-white/40 dark:bg-wedding-base/40 border-b border-white/50 dark:border-wedding-gold/20 backdrop-blur-2xl sticky top-0 z-50 transition-colors duration-500 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 h-20 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <Link href="/" className="flex items-center gap-2 group">
              <img src="/logo.png" alt="Logo" className="w-6 h-6 md:w-8 md:h-8 group-hover:rotate-12 transition-transform" />
              <span className="font-serif font-bold text-lg md:text-xl text-wedding-text group-hover:text-wedding-gold transition-colors truncate max-w-[100px] md:max-w-none">Undangin</span>
            </Link>
          </div>
          
          <div className="flex items-center gap-2 md:gap-4">
            <div className="bg-wedding-gold/10 px-3 py-1.5 md:px-4 md:py-2 rounded-full border border-wedding-gold/30 flex items-center gap-1.5 md:gap-2">
              <div className="w-4 h-4 md:w-5 md:h-5 bg-wedding-gold rounded-full flex items-center justify-center text-black text-[8px] md:text-[10px] font-bold italic">B</div>
              <span className="font-serif font-bold text-wedding-gold text-xs md:text-sm whitespace-nowrap">{userCredits} <span className="hidden xs:inline">Kredit</span></span>
            </div>
            <Link href="/dashboard/topup" className="hidden sm:flex bg-wedding-text text-wedding-base hover:opacity-80 px-3 py-1.5 md:px-6 md:py-2 rounded-lg text-[10px] md:text-xs font-bold uppercase tracking-widest transition-all whitespace-nowrap">
              Top Up
            </Link>
            <UserProfile user={user} />
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6 mb-12">
          {[
            { label: 'UNDANGAN', value: totalInvitations, icon: <Mail className="w-6 h-6" />, color: 'text-wedding-gold', bg: 'bg-wedding-gold/10 border-wedding-gold/20' },
            { label: 'RSVP', value: totalRSVP, icon: <Users className="w-6 h-6" />, color: 'text-blue-500', bg: 'bg-blue-500/10 border-blue-500/20' },
            { label: 'HADIR', value: totalHadir, icon: <CheckCircle className="w-6 h-6" />, color: 'text-green-500', bg: 'bg-green-500/10 border-green-500/20' },
            { label: 'STATUS', value: 'ACTIVE', icon: <Activity className="w-6 h-6" />, color: 'text-indigo-500', bg: 'bg-indigo-500/10 border-indigo-500/20' }
          ].map((item, idx) => (
            <div key={idx} className="bg-white/40 dark:bg-wedding-base/40 backdrop-blur-xl p-6 rounded-[2rem] shadow-lg border border-white/50 dark:border-wedding-gold/20 flex items-center gap-4 hover:scale-[1.02] transition-transform duration-500">
              <div className={`w-12 h-12 ${item.bg} border rounded-2xl flex items-center justify-center ${item.color}`}>
                {item.icon}
              </div>
              <div className="min-w-0">
                <p className="text-[10px] text-wedding-text/50 font-bold uppercase tracking-[0.2em] mb-1 truncate">{item.label}</p>
                <p className="text-3xl font-serif font-bold text-wedding-text leading-none">{item.value}</p>
              </div>
            </div>
          ))}
        </div>
        
        <MiniPricingGrid />
        <div className="mb-12">
          <AdminContactCard />
        </div>

        <div className="flex justify-between items-center mb-10">
          <h2 className="text-2xl font-serif font-bold text-wedding-text">Daftar Undangan Anda</h2>
          <span className="text-[10px] font-bold text-wedding-text/40 uppercase tracking-[0.3em]">{totalInvitations} ITEM</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          <Link href="/dashboard/create">
            <div className="bg-white/30 dark:bg-wedding-base/30 backdrop-blur-xl p-10 rounded-[2.5rem] shadow-lg border-2 border-dashed border-wedding-gold/40 text-center group cursor-pointer hover:bg-white/50 hover:border-wedding-gold hover:scale-[1.02] transition-all h-full flex flex-col justify-center duration-500">
              <div className="w-16 h-16 bg-wedding-gold/10 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:bg-wedding-gold group-hover:text-white text-wedding-gold transition-colors">
                <Plus className="w-8 h-8" />
              </div>
              <h3 className="font-serif text-2xl font-bold mb-2 text-wedding-text">Rancang Baru</h3>
              <p className="text-[10px] text-wedding-text/50 font-bold uppercase tracking-[0.2em]">KREASIKAN MAHAKARYA ANDA</p>
            </div>
          </Link>

          {invitations?.map((invitation) => (
            <div key={invitation.id} className="bg-white/40 dark:bg-wedding-base/40 backdrop-blur-xl p-8 rounded-[2.5rem] shadow-xl border border-white/50 dark:border-wedding-gold/20 flex flex-col justify-between hover:shadow-2xl hover:scale-[1.02] transition-all duration-500 relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-wedding-gold/5 rounded-full blur-2xl group-hover:bg-wedding-gold/10 transition-colors pointer-events-none" />
              
              <div className="relative z-10">
                <div className="flex justify-between items-start mb-6">
                  <span className="bg-wedding-gold/10 text-wedding-gold border border-wedding-gold/20 text-[9px] uppercase tracking-[0.2em] px-3 py-1.5 rounded-full font-bold">
                    {invitation.theme.replace(/-/g, ' ').toUpperCase()}
                  </span>
                  <div className={invitation.status === 'published' ? '' : 'bg-gradient-to-r from-wedding-gold to-[#B8962E] rounded-full overflow-hidden shadow-lg'}>
                    <PublishButton 
                      invitationId={invitation.id} 
                      status={invitation.status} 
                      userCredits={userCredits} 
                    />
                  </div>
                </div>
                <h3 className="font-serif text-3xl font-bold text-wedding-text mb-2 line-clamp-1">{invitation.bride_name} & {invitation.groom_name}</h3>
                <div className="flex items-center gap-2 mb-8">
                  <div className="w-1.5 h-1.5 rounded-full bg-wedding-gold" />
                  <p className="text-xs text-wedding-text/60 tracking-widest">{invitation.slug}</p>
                </div>

                <div className="grid grid-cols-3 gap-3 mb-6">
                  <a href={`/${invitation.slug}`} target="_blank" className="flex flex-col items-center justify-center py-3 bg-white/50 dark:bg-white/5 border border-white/50 dark:border-white/10 rounded-2xl hover:bg-wedding-gold hover:text-white transition-colors group/btn">
                    <ExternalLink className="w-4 h-4 mb-1 text-wedding-text/50 group-hover/btn:text-white" />
                    <span className="text-[9px] font-bold uppercase tracking-widest">LIHAT</span>
                  </a>
                  <Link href={`/dashboard/edit/${invitation.id}`} className="flex flex-col items-center justify-center py-3 bg-white/50 dark:bg-white/5 border border-white/50 dark:border-white/10 rounded-2xl hover:bg-wedding-gold hover:text-white transition-colors group/btn">
                    <Edit3 className="w-4 h-4 mb-1 text-wedding-text/50 group-hover/btn:text-white" />
                    <span className="text-[9px] font-bold uppercase tracking-widest">EDIT</span>
                  </Link>
                  <Link href={`/dashboard/invitation/${invitation.id}/guests`} className="flex flex-col items-center justify-center py-3 bg-white/50 dark:bg-white/5 border border-white/50 dark:border-white/10 rounded-2xl hover:bg-wedding-gold hover:text-white transition-colors group/btn">
                    <Database className="w-4 h-4 mb-1 text-wedding-text/50 group-hover/btn:text-white" />
                    <span className="text-[9px] font-bold uppercase tracking-widest">TAMU</span>
                  </Link>
                </div>
              </div>
              
                {invitation.status === 'published' && (
                  <a 
                    href={`https://wa.me/?text=${encodeURIComponent(`Yth. Bapak/Ibu/Saudara/i,\n\nTanpa mengurangi rasa hormat, perkenankan kami mengundang Anda untuk hadir dan memberikan doa restu di acara pernikahan kami:\n\n*${invitation.bride_name} & ${invitation.groom_name}*\n\nKlik link di bawah ini untuk melihat detail acara & RSVP:\n\n${origin}/${invitation.slug}\n\nMerupakan suatu kehormatan bagi kami apabila Anda dapat hadir dan memberikan doa restu. Terima kasih.`)}`}
                    target="_blank"
                    className="w-full py-4 bg-gradient-to-r from-[#00C853] to-[#00E676] text-white rounded-2xl text-[10px] font-bold uppercase tracking-[0.2em] flex items-center justify-center gap-2 hover:shadow-lg hover:shadow-[#00C853]/30 hover:scale-[1.02] transition-all"
                  >
                    <Share2 className="w-4 h-4" />
                    BAGIKAN UNDANGAN
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
