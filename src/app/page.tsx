import { createClient } from "@/lib/supabase/server";
import LandingNavbar from "@/components/landing/LandingNavbar";
import HeroSection from "@/components/landing/HeroSection";
import ExclusiveProcess from "@/components/landing/ExclusiveProcess";
import Features from "@/components/landing/Features";
import ThemeShowcase from "@/components/landing/ThemeShowcase";
import Testimonials from "@/components/landing/Testimonials";
import FAQ from "@/components/landing/FAQ";
import PricingSection from "@/components/landing/PricingSection";
import Footer from "@/components/landing/Footer";

export default async function LandingPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  return (
    <div className="min-h-screen bg-wedding-base text-wedding-text font-sans selection:bg-[#D4AF37] selection:text-black overflow-x-hidden transition-colors duration-500">
      <LandingNavbar user={user} />
      
      <main>
        <HeroSection user={user} />
        
        <ExclusiveProcess />
        
        <Features />
        
        <ThemeShowcase />

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
            <a href={user ? "/dashboard" : "/login"}>
              <button className="px-12 py-5 bg-gradient-to-r from-wedding-gold to-[#B8962E] text-white rounded-full font-bold text-xl shadow-2xl hover:scale-105 transition-all">
                Mulai Sekarang
              </button>
            </a>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
