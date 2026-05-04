import Link from 'next/link';
import Image from 'next/image';

interface PoweredByUndanginProps {
  theme?: string;
}

export default function PoweredByUndangin({ theme }: PoweredByUndanginProps) {
  const isLight = theme === 'renaissance-garden';

  return (
    <div className="w-full py-6 flex flex-col items-center justify-center relative z-[10001] pointer-events-auto bg-transparent">
      <Link 
        href="/"
        target="_blank"
        className="group flex flex-col items-center gap-3 hover:opacity-100 transition-all duration-700 cursor-pointer"
      >
        <div className="flex flex-col items-center gap-0.5 opacity-20 group-hover:opacity-80 transition-opacity">
          <p className={`text-[5px] uppercase tracking-[0.4em] font-bold ${isLight ? 'text-[#3D3229]' : 'text-white'}`}>
            Powered by Undangin Platform
          </p>
          <p className={`text-[7px] italic font-serif tracking-widest ${isLight ? 'text-[#8B7355]' : 'text-[#D4AF37]/40'}`}>
            "Where Elegance Meets Technology"
          </p>
        </div>

        <div className="flex flex-col items-center gap-2">
          <div className="relative w-6 h-6 grayscale opacity-30 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-700">
            <Image src="/favicon.ico" alt="Undangin" fill className="object-contain" />
          </div>
          <div className={`flex items-center gap-2 transition-colors ${isLight ? 'text-[#8B7355]' : 'text-[#D4AF37]/50 group-hover:text-[#D4AF37]'}`}>
            <span className="font-serif text-[8px] tracking-[0.4em] uppercase">Create Yours</span>
          </div>
        </div>
      </Link>
    </div>
  );
}
