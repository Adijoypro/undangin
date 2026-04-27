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
      <header className="bg-white/40 dark:bg-wedding-base/40 border-b border-white/50 dark:border-wedding-gold/20 backdrop-blur-2xl sticky top-0 z-50 transition-colors duration-500 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 h-16 flex justify-between items-center">
          <div className="flex items-center gap-6">
            <Link href="/dashboard" className="w-10 h-10 rounded-full bg-white/40 dark:bg-wedding-text/10 backdrop-blur-md hover:bg-wedding-gold text-wedding-text hover:text-white transition-all flex items-center justify-center active:scale-90 border border-wedding-gold/20">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
            </Link>
            <h1 className="font-serif text-xl font-bold text-wedding-text">Isi Saldo Kredit</h1>
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
