import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import TopUpClient from "./TopUpClient";

export default async function TopUpPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect("/login");
  }

  // Define our packages
  const packages = [
    {
      id: "pkg_1",
      name: "Starter Pack",
      credits: 1,
      price: 150000,
      description: "Cocok untuk pasangan yang hanya butuh 1 undangan."
    },
    {
      id: "pkg_5",
      name: "Wedding Organizer Pro",
      credits: 5,
      price: 500000,
      description: "Lebih hemat! Cocok untuk WO atau Agency."
    },
    {
      id: "pkg_20",
      name: "Enterprise Unlimited",
      credits: 20,
      price: 1500000,
      description: "Harga termurah per undangan untuk bisnis Anda."
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 font-sans pb-24">
      <nav className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center gap-4">
              <a href="/dashboard" className="text-sm font-bold text-gray-500 hover:text-wedding-gold">← Kembali ke Dasbor</a>
              <span className="font-serif text-xl font-bold text-wedding-text">Top Up Kredit Undangan</span>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-5xl mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-serif font-bold text-wedding-text mb-4">Pilih Paket Kredit Anda</h1>
          <p className="text-gray-500 max-w-2xl mx-auto">
            Satu kredit berlaku untuk pembuatan satu undangan digital (aktif selamanya). Pembayaran diverifikasi otomatis via Midtrans.
          </p>
        </div>

        <TopUpClient packages={packages} user={{ id: user.id, email: user.email || "" }} />
      </main>
    </div>
  );
}
