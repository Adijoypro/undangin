
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("Missing Supabase env vars");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkData() {
  const { data, error } = await supabase
    .from('invitations')
    .select('id, slug, latitude, longitude, event_location, event_address')
    .eq('slug', 'cewek-pria')
    .single();

  if (error) {
    console.error("Error fetching data:", error);
  } else {
    console.log("Database Results:", JSON.stringify(data, null, 2));
  }
}

checkData();
