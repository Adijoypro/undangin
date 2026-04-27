import { createClient } from "@/lib/supabase/server";
import LandingNavbar from "@/components/landing/LandingNavbar";
import HeroSection from "@/components/landing/HeroSection";
import Features from "@/components/landing/Features";
import ThemeShowcase from "@/components/landing/ThemeShowcase";
import PricingSection from "@/components/landing/PricingSection";
import Footer from "@/components/landing/Footer";

export default async function LandingPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  // We'll use a fixed dark theme for the main container on the server to avoid flash
  const isDark = true; 

  return (
    <div className={`min-h-screen bg-slate-950 text-white font-sans selection:bg-[#D4AF37] selection:text-black overflow-x-hidden`}>
      <LandingNavbar user={user} isDark={isDark} />
      
      <main>
        <HeroSection user={user} isDark={isDark} />
        
        <Features isDark={isDark} />
        
        <ThemeShowcase isDark={isDark} />
        
        <PricingSection isDark={isDark} user={user} />
        
        {/* Call to Action - Static version for speed */}
        <section className="py-32 px-4 relative overflow-hidden text-center">
          <div className="absolute inset-0 bg-[#D4AF37] opacity-5"></div>
          <div className="max-w-4xl mx-auto relative z-10">
            <h2 className="font-serif text-5xl md:text-7xl mb-8">Siap Mengukir Sejarah?</h2>
            <p className="text-xl text-gray-300 mb-12 font-light">
              Buat mahakarya undangan digital Anda hari ini.
            </p>
            <a href={user ? "/dashboard" : "/login"}>
              <button className="px-12 py-5 bg-gradient-to-r from-[#D4AF37] to-[#B8962E] text-white rounded-full font-bold text-xl shadow-2xl hover:scale-105 transition-all">
                Mulai Sekarang
              </button>
            </a>
          </div>
        </section>
      </main>

      <Footer isDark={isDark} />
    </div>
  );
}
