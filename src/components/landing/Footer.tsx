import Image from "next/image";

export default function Footer() {
  return (
    <footer className="py-24 px-4 bg-white dark:bg-wedding-base border-t border-wedding-gold/20 transition-colors duration-500 relative overflow-hidden">
      {/* Repeating Luxury Batik Pattern Base */}
      <div 
        className="absolute inset-0 opacity-[0.05] dark:opacity-[0.08] pointer-events-none z-0"
        style={{ 
          backgroundImage: 'url(/assets/branding/batik_pattern.webp)',
          backgroundSize: '300px',
          backgroundRepeat: 'repeat',
          WebkitMaskImage: 'linear-gradient(to bottom, transparent 0%, black 50%, transparent 100%)',
          maskImage: 'linear-gradient(to bottom, transparent 0%, black 50%, transparent 100%)'
        }}
      />

      <div className="max-w-7xl mx-auto grid md:grid-cols-4 gap-16 relative z-10">
        <div className="col-span-2">
          <div className="flex items-center gap-3 mb-8">
            <Image src="/logo.png" alt="Undangin Logo" width={40} height={40} className="w-10 h-10 object-contain" />
            <span className="font-serif text-2xl font-bold tracking-widest text-wedding-text uppercase">Undangin</span>
          </div>
          <p className="text-wedding-text/60 max-w-sm font-light leading-relaxed text-sm">
            Mewujudkan kemegahan tradisi melalui kecanggihan digital. Undangin adalah platform mahakarya untuk merancang memori abadi hari istimewa Anda.
          </p>
        </div>
        
        <div>
          <h4 className="font-serif text-lg mb-8 text-wedding-gold font-bold italic">Navigasi</h4>
          <ul className="space-y-4 text-xs text-wedding-text/50 font-bold uppercase tracking-widest">
            <li><a href="#" className="hover:text-wedding-gold transition-all">Beranda</a></li>
            <li><a href="#fitur" className="hover:text-wedding-gold transition-all">Fitur Utama</a></li>
            <li><a href="#template" className="hover:text-wedding-gold transition-all">Katalog Tema</a></li>
            <li><a href="#harga" className="hover:text-wedding-gold transition-all">Investasi</a></li>
          </ul>
        </div>

        <div>
          <h4 className="font-serif text-lg mb-8 text-wedding-gold font-bold italic">Layanan</h4>
          <ul className="space-y-4 text-xs text-wedding-text/50 font-bold uppercase tracking-widest">
            <li><a href="/login" className="hover:text-wedding-gold transition-all">Akses Akun</a></li>
            <li><a href="/dashboard" className="hover:text-wedding-gold transition-all">Dasbor Editor</a></li>
            <li><a href="#" className="hover:text-wedding-gold transition-all">Pusat Bantuan</a></li>
            <li><a href="#" className="hover:text-wedding-gold transition-all">Hubungi Kami</a></li>
          </ul>
        </div>
      </div>
      
      <div className="max-w-7xl mx-auto mt-24 pt-12 border-t border-wedding-gold/10 text-center flex flex-col items-center">
        <div className="mb-12">
          <Image 
            src="/assets/branding/final/nusantara_keris_solid_white_bg_1777349884812.webp" 
            alt="Keris Divider"
            width={100}
            height={100}
            className="object-contain drop-shadow-[0_10px_20px_rgba(184,134,11,0.2)]"
          />
        </div>
        <p className="text-[10px] text-wedding-text/40 uppercase tracking-[0.4em] font-bold">
          © 2026 Undangin — Mahakarya Undangan Nusantara Digital.
        </p>
      </div>
    </footer>
  );
}
