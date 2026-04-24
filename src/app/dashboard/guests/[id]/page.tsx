import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import LogoutButton from "@/components/dashboard/LogoutButton";
import GuestTable from "./GuestTable";

export default async function GuestManagementPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return redirect("/login");
  }

  // Fetch invitation details
  const { data: invitation } = await supabase
    .from("invitations")
    .select("bride_name, groom_name, slug")
    .eq("id", id)
    .eq("user_id", user.id)
    .single();

  if (!invitation) {
    return redirect("/dashboard");
  }

  // Fetch guestbook entries
  const { data: guests } = await supabase
    .from("guestbook")
    .select("*")
    .eq("invitation_id", id)
    .order("created_at", { ascending: false });

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 font-sans">
      <nav className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center gap-4">
              <a href="/dashboard" className="text-sm font-bold text-gray-500 hover:text-wedding-gold transition-colors">← Kembali</a>
              <span className="font-serif text-xl font-bold text-wedding-text">Data Tamu</span>
            </div>
            <LogoutButton />
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white p-8 rounded-3xl shadow-xl border border-gray-100">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
            <div>
              <h1 className="font-serif text-3xl text-wedding-text mb-2">
                {invitation.bride_name} & {invitation.groom_name}
              </h1>
              <p className="text-gray-500 text-sm">Kelola daftar hadir dan ucapan dari tamu undangan Anda.</p>
            </div>
          </div>

          <GuestTable guests={guests || []} slug={invitation.slug} />
        </div>
      </main>
    </div>
  );
}
