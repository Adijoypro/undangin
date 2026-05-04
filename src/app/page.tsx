import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import LandingNavbar from "@/components/landing/LandingNavbar";
import HeroSection from "@/components/landing/HeroSection";
import ExperienceShowcase from "@/components/landing/ExperienceShowcase";
import ExclusiveProcess from "@/components/landing/ExclusiveProcess";
import Features from "@/components/landing/Features";
import AITeaser from "@/components/landing/AITeaser";
import Testimonials from "@/components/landing/Testimonials";
import FAQ from "@/components/landing/FAQ";
import PricingSection from "@/components/landing/PricingSection";
import Footer from "@/components/landing/Footer";

export default async function LandingPage() {
  const supabase = await createClient();
  let user = null;
  
  try {
    const { data } = await supabase.auth.getUser();
    user = data?.user || null;
  } catch (error) {
    user = null;
  }

  return (
    <div className="min-h-screen bg-wedding-base text-wedding-text font-sans selection:bg-[#D4AF37] selection:text-black overflow-x-hidden transition-colors duration-500">
      <LandingNavbar user={user} />
      
      <main>
        <HeroSection user={user} />
        
        <ExperienceShowcase />
        
        <ExclusiveProcess />
        
        <Features />
        
        <AITeaser />

        <Testimonials />

        <FAQ />
        
        <PricingSection user={user} />
        
        {/* Call to Action */}
        <section className="py-32 px-4 relative overflow-hidden text-center border-t border-wedding-gold/10">
          <div className="absolute inset-0 bg-wedding-gold opacity-5"></div>
          <div className="max-w-4xl mx-auto relative z-10">
            <h2 className="font-serif text-5xl md:text-7xl mb-8">Siap Mengukir Sejarah?</h2>
            <p className="text-xl text-wedding-text/70 mb-12 font-light">
              Buat mahakarya undangan digital Anda hari ini.
            </p>
            <Link href={user ? "/dashboard" : "/login"}>
              <button className="px-16 py-6 bg-wedding-gold text-white rounded-xl font-black uppercase tracking-[0.3em] text-xs shadow-2xl shadow-wedding-gold/30 hover:scale-[1.05] active:scale-95 transition-all">
                Mulai Sekarang Gratis
              </button>
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
