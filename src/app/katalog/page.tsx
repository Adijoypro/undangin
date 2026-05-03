import { createClient } from "@/lib/supabase/server";
import KatalogClient from "@/components/katalog/KatalogClient";

export default async function KatalogPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  return <KatalogClient user={user} />;
}
