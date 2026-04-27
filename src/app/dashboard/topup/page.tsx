import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import TopUpClient from "./TopUpClient";
import Link from "next/link";
import DashboardShell from "@/components/dashboard/DashboardShell";

export default async function TopUpPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect("/login");
  }

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
      name: "Enterprise Pack",
      credits: 10,
      price: 649000,
      originalPrice: 890000,
      description: "Harga Terbaik! 10 Kredit untuk bisnis undangan massal Anda."
    }
  ];

  return (
    <DashboardShell>
      <header className="bg-wedding-base/80 border-b border-wedding-gold/10 backdrop-blur-md sticky top-0 z-50 transition-colors duration-500">
        <div className="max-w-7xl mx-auto px-4 h-16 flex justify-between items-center">
          <div className="flex items-center gap-6">
            <Link href="/dashboard" className="w-8 h-8 rounded-full bg-wedding-text/5 flex items-center justify-center text-wedding-text/40 hover:bg-wedding-gold hover:text-black transition-all">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
            </Link>
            <h1 className="font-serif text-lg font-bold text-wedding-text">Top Up Kredit</h1>
          </div>
        </div>
      </header>

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
