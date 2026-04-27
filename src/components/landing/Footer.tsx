import Image from "next/image";

export default function Footer() {
  return (
    <footer className="py-20 px-4 bg-black/[0.02] dark:bg-black border-t border-black/10 dark:border-white/10 transition-colors duration-500">
      <div className="max-w-7xl mx-auto grid md:grid-cols-4 gap-12">
        <div className="col-span-2">
          <div className="flex items-center gap-3 mb-6">
            <Image src="/logo.png" alt="Undangin Logo" width={32} height={32} className="w-8 h-8 object-contain" />
            <span className="font-serif text-xl font-bold tracking-widest">Undangin</span>
          </div>
          <p className="text-gray-600 dark:text-gray-400 max-w-sm font-light leading-relaxed">
            Platform mahakarya undangan digital untuk momen terindah dalam hidup Anda. Menghadirkan kemewahan melalui teknologi.
          </p>
        </div>
        
        <div>
          <h4 className="font-serif text-lg mb-6">Navigasi</h4>
          <ul className="space-y-4 text-sm text-gray-600 dark:text-gray-400">
            <li><a href="#" className="hover:text-[#D4AF37] transition-colors">Beranda</a></li>
            <li><a href="#fitur" className="hover:text-[#D4AF37] transition-colors">Fitur</a></li>
            <li><a href="#template" className="hover:text-[#D4AF37] transition-colors">Tema</a></li>
            <li><a href="#harga" className="hover:text-[#D4AF37] transition-colors">Harga</a></li>
          </ul>
        </div>

        <div>
          <h4 className="font-serif text-lg mb-6">Layanan</h4>
          <ul className="space-y-4 text-sm text-gray-600 dark:text-gray-400">
            <li><a href="/login" className="hover:text-[#D4AF37] transition-colors">Daftar Akun</a></li>
            <li><a href="/dashboard" className="hover:text-[#D4AF37] transition-colors">Dasbor</a></li>
            <li><a href="#" className="hover:text-[#D4AF37] transition-colors">Bantuan</a></li>
            <li><a href="#" className="hover:text-[#D4AF37] transition-colors">Kontak</a></li>
          </ul>
        </div>
      </div>
      
      <div className="max-w-7xl mx-auto mt-20 pt-8 border-t border-black/5 dark:border-white/5 text-center text-xs text-gray-500 uppercase tracking-widest">
        © 2026 Undangin. Seluruh Hak Cipta Dilindungi.
      </div>
    </footer>
  );
}
