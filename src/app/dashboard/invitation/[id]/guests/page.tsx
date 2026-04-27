import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import LogoutButton from "@/components/dashboard/LogoutButton";
import { deleteGuestbookEntry } from "./actions";
import DashboardShell from "@/components/dashboard/DashboardShell";

export default async function GuestListPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return redirect("/login");
  }

  // Fetch invitation to verify ownership
  const { data: invitation } = await supabase
    .from("invitations")
    .select("bride_name, groom_name, user_id")
    .eq("id", id)
    .single();

  if (!invitation || invitation.user_id !== user.id) {
    return redirect("/dashboard");
  }

  // Fetch guestbook entries
  const { data: guests } = await supabase
    .from("guestbook")
    .select("*")
    .eq("invitation_id", id)
    .order("created_at", { ascending: false });

  const totalGuests = guests?.length || 0;
  const totalHadir = guests?.filter(g => g.attendance === 'Hadir').length || 0;

  return (
    <DashboardShell>
      <header className="bg-wedding-base/80 border-b border-wedding-gold/10 backdrop-blur-md sticky top-0 z-50 transition-colors duration-500">
        <div className="max-w-7xl mx-auto px-4 h-16 flex justify-between items-center">
          <div className="flex items-center gap-3 md:gap-6">
            <Link href="/dashboard" className="w-8 h-8 rounded-full bg-wedding-text/5 flex items-center justify-center text-wedding-text/40 hover:bg-wedding-gold hover:text-black transition-all">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
            </Link>
            <h1 className="font-serif text-sm md:text-lg font-bold text-wedding-text truncate max-w-[150px] md:max-w-none">Data Tamu & RSVP</h1>
          </div>
          <LogoutButton />
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-8 md:py-12">
        <div className="mb-8 md:mb-10">
          <h2 className="text-xl md:text-3xl font-serif font-bold text-wedding-text mb-2 transition-colors duration-500">Undangan {invitation.bride_name} & {invitation.groom_name}</h2>
          <div className="flex gap-4">
            <span className="text-[10px] font-bold text-wedding-text/40 uppercase tracking-widest">{totalGuests} TOTAL UCAPAN</span>
            <span className="text-[10px] font-bold text-green-500 uppercase tracking-widest">{totalHadir} AKAN HADIR</span>
          </div>
        </div>

        <div className="bg-wedding-base rounded-2xl md:rounded-3xl shadow-sm border border-wedding-gold/10 overflow-hidden transition-all duration-500">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-wedding-text/[0.03] border-b border-wedding-gold/10">
                  <th className="px-4 md:px-6 py-4 text-[10px] font-bold text-wedding-text/40 uppercase tracking-widest">Nama Tamu</th>
                  <th className="px-4 md:px-6 py-4 text-[10px] font-bold text-wedding-text/40 uppercase tracking-widest">Kehadiran</th>
                  <th className="px-4 md:px-6 py-4 text-[10px] font-bold text-wedding-text/40 uppercase tracking-widest">Pesan / Ucapan</th>
                  <th className="px-4 md:px-6 py-4 text-[10px] font-bold text-wedding-text/40 uppercase tracking-widest text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-wedding-gold/5">
                {guests && guests.length > 0 ? (
                  guests.map((guest) => (
                    <tr key={guest.id} className="hover:bg-wedding-text/[0.02] transition-colors">
                      <td className="px-4 md:px-6 py-4 md:py-6 font-serif text-base md:text-lg text-wedding-text font-bold">{guest.name}</td>
                      <td className="px-4 md:px-6 py-4 md:py-6">
                        <span className={`px-2 md:px-3 py-1 rounded-full text-[8px] md:text-[10px] font-black uppercase tracking-widest ${
                          guest.attendance === 'Hadir' ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'
                        }`}>
                          {guest.attendance}
                        </span>
                      </td>
                      <td className="px-4 md:px-6 py-4 md:py-6 text-xs md:text-sm text-wedding-text/60 leading-relaxed min-w-[200px] max-w-md">{guest.message}</td>
                      <td className="px-4 md:px-6 py-4 md:py-6 text-right">
                        <form action={deleteGuestbookEntry}>
                          <input type="hidden" name="entryId" value={guest.id} />
                          <input type="hidden" name="invitationId" value={id} />
                          <button className="text-wedding-text/20 hover:text-red-500 transition-colors">
                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/><line x1="10" y1="11" x2="10" y2="17"/><line x1="14" y1="11" x2="14" y2="17"/></svg>
                          </button>
                        </form>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={4} className="px-6 py-20 text-center text-wedding-text/20 italic">Belum ada ucapan dari tamu...</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </DashboardShell>
  );
}
