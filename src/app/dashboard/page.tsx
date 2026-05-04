import { redirect } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import PublishButton from "@/components/dashboard/PublishButton";
import DashboardNavbar from "@/components/dashboard/DashboardNavbar";
import AdminContactCard from "@/components/dashboard/AdminContactCard";
import MiniPricingGrid from "@/components/dashboard/MiniPricingGrid";
import DashboardShell from "@/components/dashboard/DashboardShell";
import SuccessNotification from "@/components/dashboard/SuccessNotification";
import WelcomeHero from "@/components/dashboard/WelcomeHero";
import DashboardEmptyState from "@/components/dashboard/DashboardEmptyState";
import Image from "next/image";
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
      <DashboardNavbar user={user} credits={userCredits} />

      <main className="max-w-7xl mx-auto px-4 py-8 md:py-12">
        <WelcomeHero userEmail={user.email || ""} />

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6 mb-12">
          {/* STAT 1: UNDANGAN (WAYANG) */}
          <div className="bg-white/80 dark:bg-wedding-base/90 lg:backdrop-blur-xl p-5 md:p-6 rounded-[1.5rem] md:rounded-[2rem] shadow-sm md:shadow-lg border border-white/50 dark:border-wedding-gold/20 flex items-center gap-3 md:gap-4 lg:hover:scale-[1.02] transition-transform duration-500 transform-gpu">
            <div className="relative w-12 h-12 md:w-14 md:h-14 bg-wedding-gold/10 border border-wedding-gold/20 rounded-2xl flex items-center justify-center overflow-hidden">
              <Image 
                src="/assets/branding/final/nusantara_wayang_solid_white_bg_1777349850175.webp" 
                alt="Wayang"
                width={40}
                height={40}
                className="object-contain relative z-10"
              />
            </div>
            <div className="min-w-0">
              <p className="text-[10px] text-wedding-text/50 font-bold uppercase tracking-[0.2em] mb-1 truncate">UNDANGAN</p>
              <p className="text-2xl md:text-3xl font-serif font-bold text-wedding-text leading-none">{totalInvitations}</p>
            </div>
          </div>

          {/* STAT 2: RSVP (GONG) */}
          <div className="bg-white/80 dark:bg-wedding-base/90 lg:backdrop-blur-xl p-5 md:p-6 rounded-[1.5rem] md:rounded-[2rem] shadow-sm md:shadow-lg border border-white/50 dark:border-wedding-gold/20 flex items-center gap-3 md:gap-4 lg:hover:scale-[1.02] transition-transform duration-500 transform-gpu">
            <div className="relative w-12 h-12 md:w-14 md:h-14 bg-blue-500/10 border border-blue-500/20 rounded-2xl flex items-center justify-center overflow-hidden">
              <Image 
                src="/assets/branding/final/nusantara_gong_solid_white_bg_1777350027916.webp" 
                alt="Gong"
                width={40}
                height={40}
                className="object-contain relative z-10"
              />
            </div>
            <div className="min-w-0">
              <p className="text-[10px] text-wedding-text/50 font-bold uppercase tracking-[0.2em] mb-1 truncate">RSVP</p>
              <p className="text-2xl md:text-3xl font-serif font-bold text-wedding-text leading-none">{totalRSVP}</p>
            </div>
          </div>

          {/* STAT 3: HADIR (PENDET) */}
          <div className="bg-white/80 dark:bg-wedding-base/90 lg:backdrop-blur-xl p-5 md:p-6 rounded-[1.5rem] md:rounded-[2rem] shadow-sm md:shadow-lg border border-white/50 dark:border-wedding-gold/20 flex items-center gap-3 md:gap-4 lg:hover:scale-[1.02] transition-transform duration-500 transform-gpu">
            <div className="relative w-12 h-12 md:w-14 md:h-14 bg-green-500/10 border border-green-500/20 rounded-2xl flex items-center justify-center overflow-hidden">
              <Image 
                src="/assets/branding/final/ai_guestbook_solid_white_bg_1777348210241.webp" 
                alt="Guestbook"
                width={40}
                height={40}
                className="object-contain relative z-10"
              />
            </div>
            <div className="min-w-0">
              <p className="text-[10px] text-wedding-text/50 font-bold uppercase tracking-[0.2em] mb-1 truncate">HADIR</p>
              <p className="text-2xl md:text-3xl font-serif font-bold text-wedding-text leading-none">{totalHadir}</p>
            </div>
          </div>

          {/* STAT 4: STATUS (STUPA) */}
          <div className="bg-white/80 dark:bg-wedding-base/90 lg:backdrop-blur-xl p-5 md:p-6 rounded-[1.5rem] md:rounded-[2rem] shadow-sm md:shadow-lg border border-white/50 dark:border-wedding-gold/20 flex items-center gap-3 md:gap-4 lg:hover:scale-[1.02] transition-transform duration-500 transform-gpu">
            <div className="relative w-12 h-12 md:w-14 md:h-14 bg-indigo-500/10 border border-indigo-500/20 rounded-2xl flex items-center justify-center overflow-hidden">
              <Image 
                src="/assets/branding/final/nusantara_topeng_gold.webp" 
                alt="Mask"
                width={40}
                height={40}
                className="object-contain relative z-10 scale-125"
              />
            </div>
            <div className="min-w-0">
              <p className="text-[10px] text-wedding-text/50 font-bold uppercase tracking-[0.2em] mb-1 truncate">STATUS</p>
              <p className="text-2xl md:text-3xl font-serif font-bold text-wedding-text leading-none uppercase text-xs tracking-widest">ACTIVE</p>
            </div>
          </div>
        </div>
        
        <MiniPricingGrid />
        <div className="mb-12">
          <AdminContactCard />
        </div>

        <div className="flex justify-between items-center mb-10">
          <h2 className="text-2xl font-serif font-bold text-wedding-text">Daftar Undangan Anda</h2>
          <span className="text-[10px] font-bold text-wedding-text/40 uppercase tracking-[0.3em]">{totalInvitations} ITEM</span>
        </div>

        {totalInvitations === 0 ? (
          <DashboardEmptyState />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            <Link href="/dashboard/create">
              <div className="bg-white/70 dark:bg-wedding-base/70 lg:backdrop-blur-xl p-10 rounded-[2rem] md:rounded-[2.5rem] shadow-sm md:shadow-lg border-2 border-dashed border-wedding-gold/40 text-center group cursor-pointer hover:bg-white/50 lg:hover:scale-[1.02] transition-all h-full flex flex-col justify-center duration-500 transform-gpu">
                <div className="w-16 h-16 bg-wedding-gold/10 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:bg-wedding-gold group-hover:text-white text-wedding-gold transition-colors">
                  <Plus className="w-8 h-8" />
                </div>
                <h3 className="font-serif text-2xl font-bold mb-2 text-wedding-text">Rancang Baru</h3>
                <p className="text-[10px] text-wedding-text/50 font-bold uppercase tracking-[0.2em]">KREASIKAN MAHAKARYA ANDA</p>
              </div>
            </Link>

            {invitations?.map((invitation) => (
              <div key={invitation.id} className="bg-white/80 dark:bg-wedding-base/90 lg:backdrop-blur-xl p-6 md:p-8 rounded-[2rem] md:rounded-[2.5rem] shadow-md md:shadow-xl border border-white/50 dark:border-wedding-gold/20 flex flex-col justify-between lg:hover:shadow-2xl lg:hover:scale-[1.02] transition-all duration-500 relative overflow-hidden group transform-gpu">
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
        )}

      </main>
    </DashboardShell>
  );
}
