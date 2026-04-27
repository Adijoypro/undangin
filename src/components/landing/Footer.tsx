import Image from "next/image";
import Link from "next/link";

export default function Footer({ isDark }: { isDark: boolean }) {
  const textMuted = isDark ? "text-gray-400" : "text-gray-600";
  const border = isDark ? "border-white/10" : "border-black/10";
  const footerBg = isDark ? "bg-black" : "bg-[#F5F4EE]";

  return (
    <footer className={`${footerBg} pt-24 pb-12 px-4 border-t ${border} relative overflow-hidden`}>
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="grid md:grid-cols-4 gap-12 mb-20">
          <div className="col-span-2">
            <div className="flex items-center gap-3 mb-6">
              <Image src="/logo.png" alt="Undangin Logo" width={48} height={48} className="w-12 h-12 object-contain" />
              <span className={`font-serif text-3xl font-bold tracking-widest ${isDark ? 'text-white' : 'text-black'}`}>Undangin</span>
            </div>
            <p className={`${textMuted} max-w-sm font-light leading-relaxed mb-8`}>
              Setiap kisah cinta layak diceritakan dengan cara yang paling elegan.
            </p>
          </div>

          <div>
            <h4 className={`text-xs font-bold uppercase tracking-widest ${isDark ? 'text-white' : 'text-black'} mb-6`}>Platform</h4>
            <ul className={`space-y-4 text-sm ${textMuted}`}>
              <li><a href="#fitur" className="hover:text-[#D4AF37] transition-colors">Fitur</a></li>
              <li><a href="#template" className="hover:text-[#D4AF37] transition-colors">Tema</a></li>
              <li><a href="#harga" className="hover:text-[#D4AF37] transition-colors">Harga</a></li>
            </ul>
          </div>

          <div>
            <h4 className={`text-xs font-bold uppercase tracking-widest ${isDark ? 'text-white' : 'text-black'} mb-6`}>Eksklusif</h4>
            <ul className={`space-y-4 text-sm ${textMuted}`}>
              <li><a href="#" className="hover:text-[#D4AF37] transition-colors">Partner WO</a></li>
              <li><a href="#" className="hover:text-[#D4AF37] transition-colors">Custom VIP</a></li>
            </ul>
          </div>
        </div>

        <div className={`flex flex-col md:flex-row justify-between items-center pt-12 border-t ${border} gap-6 text-[10px] uppercase tracking-widest font-bold ${textMuted}`}>
          <p>© 2026 Undangin. Crafted for Elegance.</p>
          <div className="flex gap-8">
            <a href="#" className="hover:text-[#D4AF37] transition-colors">Instagram</a>
            <a href="#" className="hover:text-[#D4AF37] transition-colors">WhatsApp</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
