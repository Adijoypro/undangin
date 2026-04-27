import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY! || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

async function checkColumns() {
  // Ambil 1 baris sembarang buat ngecek nama kolomnya
  const { data, error } = await supabase.from("invitations").select("*").limit(1);
  if (error) {
    console.error("Error:", error);
  } else {
    console.log("Kolom yang ada di database:");
    if (data && data.length > 0) {
      console.log(Object.keys(data[0]));
    } else {
      console.log("Tabel kosong, tapi coba fetch via RPC atau schema if possible.");
    }
  }
}

checkColumns();
