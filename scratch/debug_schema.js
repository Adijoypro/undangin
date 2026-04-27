
const { createClient } = require('@supabase/supabase-js');
// Mencoba membaca env dari .env.local secara manual
const fs = require('fs');
const path = require('path');

const envPath = path.join(__dirname, '..', '.env.local');
const envContent = fs.readFileSync(envPath, 'utf8');

const getEnv = (key) => {
  const match = envContent.match(new RegExp(`${key}=(.*)`));
  return match ? match[1].trim().replace(/^"|"$/g, '') : null;
};

const supabaseUrl = getEnv('NEXT_PUBLIC_SUPABASE_URL');
const supabaseKey = getEnv('SUPABASE_SERVICE_ROLE_KEY');

if (!supabaseUrl || !supabaseKey) {
  console.error("Missing Supabase env vars");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkSchema() {
  // Ambil 1 data aja buat liat strukturnya
  const { data, error } = await supabase
    .from('invitations')
    .select('*')
    .limit(1)
    .single();

  if (error) {
    console.error("Error fetching schema:", error);
  } else {
    console.log("Columns found in 'invitations' table:");
    console.log(Object.keys(data).join(', '));
    
    const target = await supabase
      .from('invitations')
      .select('slug, latitude, longitude, maps_link')
      .eq('slug', 'cewek-pria')
      .single();
    
    console.log("\nData for 'cewek-pria':", JSON.stringify(target.data, null, 2));
  }
}

checkSchema();
