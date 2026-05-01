import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import TopUpClient from "./TopUpClient";
import DashboardNavbar from "@/components/dashboard/DashboardNavbar";
import DashboardShell from "@/components/dashboard/DashboardShell";

export default async function TopUpPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect("/login");
  }

  // Fetch credits for navbar
  const { data: profile } = await supabase
    .from("profiles")
    .select("credits")
    .eq("id", user.id)
    .single();

  const userCredits = profile?.credits || 0;

  const packages = [
    {
      id: "pkg_1",
      name: "Basic Pack",
      credits: 1,
      price: 89000,
      originalPrice: 150000,
      description: "1 Kredit Undangan Digital. Fitur premium lengkap, aktif selamanya."
    },
    {
      id: "pkg_5",
      name: "Agensi Pack",
      credits: 5,
      price: 349000,
      originalPrice: 445000,
      description: "Hemat Gede! 5 Kredit Undangan. Cocok untuk Wedding Organizer."
    },
    {
      id: "pkg_10",
      name: "Royal Pack",
      credits: 10,
      price: 649000,
      originalPrice: 890000,
      description: "Kasta Tertinggi! 10 Kredit Undangan. Pilihan utama untuk para profesional."
    }
  ];

  return (
    <DashboardShell>
      <DashboardNavbar user={user} credits={userCredits} />

      <main className="max-w-5xl mx-auto px-4 py-12">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-serif font-bold text-wedding-text mb-4 transition-colors duration-500">Pilih Paket Kredit</h2>
          <p className="text-[10px] text-wedding-text/40 font-bold uppercase tracking-[0.3em] max-w-2xl mx-auto">
            PEMBAYARAN OTOMATIS & VERIFIKASI INSTAN VIA MIDTRANS
          </p>
        </div>

        <TopUpClient packages={packages} user={{ id: user.id, email: user.email || "" }} />
      </main>
    </DashboardShell>
  );
}
