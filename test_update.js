const fs = require('fs');
const env = fs.readFileSync('.env.local', 'utf8').split('\n');
env.forEach(line => {
  const match = line.match(/^([^=]+)=(.*)$/);
  if (match) process.env[match[1]] = match[2].trim().replace(/^"|"$/g, '');
});

const { createClient } = require('@supabase/supabase-js');
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

async function testUpdate() {
  // Ambil ID sembarang dari undangan yang ada
  const { data: inv, error: fetchErr } = await supabase.from("invitations").select("id, latitude").limit(1).single();
  if (fetchErr) {
    console.error("Fetch Error:", fetchErr);
    return;
  }
  
  console.log("Data sebelum diupdate:", inv);

  // Coba update koordinat ke -0.414412 (Kutai Kartanegara)
  const { data, error } = await supabase.from("invitations")
    .update({ latitude: -0.414412, longitude: 116.994352 })
    .eq("id", inv.id)
    .select("id, latitude, longitude");
    
  if (error) {
    console.error("Update Error:", error);
  } else {
    console.log("Data sesudah diupdate:", data);
  }
}

testUpdate();
