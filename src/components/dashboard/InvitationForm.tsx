"use client";

import React, { useState, useTransition } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import ThemeSelector from "@/app/dashboard/create/ThemeSelector";
import MusicSelector from "@/components/dashboard/MusicSelector";
import QuoteSection from "@/components/dashboard/QuoteSection";
import InstantPhotoUpload from "@/components/dashboard/InstantPhotoUpload";
import SlugInput from "@/components/dashboard/SlugInput";
import SubmitButton from "@/components/dashboard/SubmitButton";
import { toast } from "sonner";

import LoveStorySection from "./LoveStorySection";
import MapPicker from "./MapPicker";

interface InvitationFormProps {
  action: any;
  initialData?: any;
}

export default function InvitationForm({ action, initialData }: InvitationFormProps) {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const totalSteps = 5;

  // Form State to keep data across steps
  const [formData, setFormData] = useState({
    slug: initialData?.slug || "",
    theme: initialData?.theme || "premium",
    bride_name: initialData?.bride_name || "",
    bride_fullname: initialData?.bride_fullname || "",
    bride_father: initialData?.bride_father || "",
    bride_mother: initialData?.bride_mother || "",
    bride_photo: initialData?.bride_photo || "",
    groom_name: initialData?.groom_name || "",
    groom_fullname: initialData?.groom_fullname || "",
    groom_father: initialData?.groom_father || "",
    groom_mother: initialData?.groom_mother || "",
    groom_photo: initialData?.groom_photo || "",
    couple_photo: initialData?.couple_photo || "",
    event_date: initialData?.event_date || "",
    event_time: initialData?.event_time || "",
    event_location: initialData?.event_location || "",
    event_address: initialData?.event_address || "",
    maps_link: initialData?.maps_link || "",
    latitude: initialData?.latitude || -6.2088,
    longitude: initialData?.longitude || 106.8456,
    love_story: initialData?.love_story || [],
    quote: initialData?.quote || "",
    bank_name: initialData?.bank_name || "",
    account_number: initialData?.account_number || "",
    account_name: initialData?.account_name || "",
    music_url: initialData?.music_url || "",
    turut_mengundang: initialData?.turut_mengundang || ""
  });

  const updateField = (name: string, value: any) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const [isLocationConfirmed, setIsLocationConfirmed] = useState(false);
  const [showLocationWarning, setShowLocationWarning] = useState(false);

  const nextStep = () => {
    if (step === 3 && !isLocationConfirmed) {
      setShowLocationWarning(true);
      toast.error("Wajib kunci lokasi terlebih dahulu!");
      return;
    }
    setShowLocationWarning(false);
    setStep((s) => Math.min(s + 1, totalSteps));
  };
  const prevStep = () => setStep((s) => Math.max(s - 1, 1));

  // State for Map Search
  const [locationSearch, setLocationSearch] = useState("");
  const [isSearching, setIsSearching] = useState(false);

  const searchLocation = async () => {
    if (!locationSearch) return;
    setIsSearching(true);
    try {
      const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(locationSearch)}`);
      const data = await res.json();
      if (data && data.length > 0) {
        const place = data[0];
        const lat = parseFloat(place.lat);
        const lon = parseFloat(place.lon);
        updateField("event_address", place.display_name);
        updateField("event_location", locationSearch);
        updateField("maps_link", `https://www.google.com/maps?q=${lat},${lon}`);
        setIsLocationConfirmed(false);
        updateField("latitude", lat);
        updateField("longitude", lon);
        toast.success("Lokasi ditemukan dan titik peta diperbarui!");
      } else {
        toast.error("Lokasi tidak ditemukan. Coba ketik lebih spesifik.");
      }
    } catch (err) {
      toast.error("Gagal mencari lokasi.");
    } finally {
      setIsSearching(false);
    }
  };

  const handleMapsLinkPaste = (url: string) => {
    try {
      // Regex untuk menarik koordinat dari link Google Maps (@lat,lng atau q=lat,lng)
      const coordRegex = /@(-?\d+\.\d+),(-?\d+\.\d+)|q=(-?\d+\.\d+),(-?\d+\.\d+)/;
      const match = url.match(coordRegex);

      if (match) {
        const lat = parseFloat(match[1] || match[3]);
        const lng = parseFloat(match[2] || match[4]);

        if (!isNaN(lat) && !isNaN(lng)) {
          updateField("latitude", lat);
          updateField("longitude", lng);
          updateField("maps_link", url);
          setIsLocationConfirmed(true);
          toast.success("Koordinat berhasil ditarik dari link Google Maps!");
          return;
        }
      }
      
      updateField("maps_link", url);
      toast.info("Link disimpan. Pastikan titik di peta sudah sesuai.");
    } catch (e) {
      console.error("Link parse error:", e);
    }
  };

  const [isPending, startTransition] = useTransition();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault(); // Prevent native form submission
    
    const submitBtn = (e.nativeEvent as SubmitEvent).submitter as HTMLButtonElement;
    if (submitBtn && submitBtn.type === "submit") {
      toast.loading(`Menyimpan data dengan tema: ${formData.theme}...`, { id: "save-toast" });
      
      const fd = new FormData();
      
      // Explicitly append all values from state to avoid DOM hidden input mismatch
      fd.append("id", initialData?.id || "");
      fd.append("slug", formData.slug || "");
      fd.append("theme", formData.theme || "premium");
      
      fd.append("bride_name", formData.bride_name || "");
      fd.append("bride_fullname", formData.bride_fullname || "");
      fd.append("bride_father", formData.bride_father || "");
      fd.append("bride_mother", formData.bride_mother || "");
      fd.append("bride_photo", formData.bride_photo || "");
      
      fd.append("groom_name", formData.groom_name || "");
      fd.append("groom_fullname", formData.groom_fullname || "");
      fd.append("groom_father", formData.groom_father || "");
      fd.append("groom_mother", formData.groom_mother || "");
      fd.append("groom_photo", formData.groom_photo || "");
      
      fd.append("couple_photo", formData.couple_photo || "");
      
      fd.append("event_date", formData.event_date || "");
      fd.append("event_time", formData.event_time || "");
      fd.append("event_location", formData.event_location || "");
      fd.append("event_address", formData.event_address || "");
      fd.append("maps_link", formData.maps_link || "");
      fd.append("latitude", formData.latitude?.toString() || "-6.2088");
      fd.append("longitude", formData.longitude?.toString() || "106.8456");
      
      fd.append("love_story", JSON.stringify(formData.love_story || []));
      fd.append("quote", formData.quote || "");
      
      fd.append("bank_name", formData.bank_name || "");
      fd.append("account_number", formData.account_number || "");
      fd.append("account_name", formData.account_name || "");
      
      fd.append("selected_music_url", formData.music_url || "");
      fd.append("turut_mengundang", formData.turut_mengundang || "");

      startTransition(async () => {
        const result = await action(fd);
        if (result?.success) {
          toast.success("Perubahan berhasil disimpan! ✨", { id: "save-toast" });
          // Redirect di sisi client agar lebih mulus
          router.push(`/dashboard/edit/${initialData.id}?updated=true`);
          router.refresh();
        } else {
          toast.error(result?.error || "Gagal menyimpan perubahan.", { id: "save-toast" });
        }
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8 relative">
      <AnimatePresence>
        {isPending && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-wedding-base/80 backdrop-blur-sm z-50 flex items-center justify-center rounded-2xl"
          >
            <div className="flex flex-col items-center gap-4">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-wedding-gold"></div>
              <p className="text-[10px] font-bold text-wedding-gold uppercase tracking-widest">Sedang Menyimpan...</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Progress Indicator & Quick Save */}
      <div className="bg-wedding-base p-4 md:p-6 rounded-2xl shadow-xl border border-wedding-gold/10 mb-6 md:mb-8 sticky top-2 z-40 backdrop-blur-md bg-wedding-base/90 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 transition-all duration-500">
        <div className="w-full md:w-auto">
          <div className="flex justify-between items-center mb-2">
            <span className="text-[10px] md:text-xs font-bold text-wedding-text/40 uppercase tracking-widest">Langkah {step} / {totalSteps}</span>
            <span className="text-[10px] md:text-xs font-bold text-wedding-gold uppercase tracking-widest truncate ml-2">
              {step === 1 && "Pengaturan"}
              {step === 2 && "Mempelai"}
              {step === 3 && "Acara"}
              {step === 4 && "Story"}
              {step === 5 && "Kado"}
            </span>
          </div>
          <div className="h-1.5 md:h-2 bg-wedding-text/5 rounded-full overflow-hidden w-full md:w-64">
            <motion.div 
              className="h-full bg-wedding-gold"
              initial={{ width: "20%" }}
              animate={{ width: `${(step / totalSteps) * 100}%` }}
              transition={{ duration: 0.5, ease: "circOut" }}
            />
          </div>
        </div>
        
        <button 
          type="submit"
          className="w-full md:w-auto px-6 py-2.5 bg-wedding-text text-wedding-base text-xs font-bold rounded-xl hover:opacity-80 transition-all flex items-center justify-center gap-2 shadow-lg"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4"></path></svg>
          Simpan Perubahan
        </button>
      </div>

      <AnimatePresence mode="wait">
        {/* STEP 1: PENGATURAN DASAR */}
        {step === 1 && (
          <motion.section
            key="step1"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-8"
          >
            <div className="flex items-center gap-3">
              <span className="w-8 h-8 bg-wedding-gold/10 rounded-lg flex items-center justify-center text-sm font-bold text-wedding-gold">01</span>
              <h2 className="font-serif text-2xl text-wedding-text">Pengaturan Dasar</h2>
            </div>
            <div className="grid gap-8">
              <SlugInput defaultValue={formData.slug} onChange={(val) => updateField("slug", val)} />
              <ThemeSelector defaultValue={formData.theme} onChange={(val) => updateField("theme", val)} />
            </div>
          </motion.section>
        )}

        {/* STEP 2: DATA MEMPELAI */}
        {step === 2 && (
          <motion.section
            key="step2"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-8"
          >
            <div className="flex items-center gap-3">
              <span className="w-8 h-8 bg-wedding-gold/10 rounded-lg flex items-center justify-center text-sm font-bold text-wedding-gold">02</span>
              <h2 className="font-serif text-2xl text-wedding-text">Data Mempelai</h2>
            </div>
            <div className="grid md:grid-cols-2 gap-6 md:gap-10">
              {/* Bride */}
              <div className="space-y-4">
                <h3 className="font-bold text-sm uppercase tracking-widest text-wedding-gold">Mempelai Wanita</h3>
                <input type="text" value={formData.bride_name} onChange={(e) => updateField("bride_name", e.target.value)} required placeholder="Nama Panggilan" className="w-full p-4 bg-wedding-text/[0.03] border border-wedding-gold/10 rounded-xl outline-none focus:border-wedding-gold text-wedding-text transition-all" />
                <input type="text" value={formData.bride_fullname} onChange={(e) => updateField("bride_fullname", e.target.value)} required placeholder="Nama Lengkap" className="w-full p-4 bg-wedding-text/[0.03] border border-wedding-gold/10 rounded-xl outline-none focus:border-wedding-gold text-wedding-text transition-all" />
                <input type="text" value={formData.bride_father} onChange={(e) => updateField("bride_father", e.target.value)} placeholder="Nama Ayah" className="w-full p-4 bg-wedding-text/[0.03] border border-wedding-gold/10 rounded-xl outline-none focus:border-wedding-gold text-wedding-text transition-all" />
                <input type="text" value={formData.bride_mother} onChange={(e) => updateField("bride_mother", e.target.value)} placeholder="Nama Ibu" className="w-full p-4 bg-wedding-text/[0.03] border border-wedding-gold/10 rounded-xl outline-none focus:border-wedding-gold text-wedding-text transition-all" />
                <InstantPhotoUpload label="Foto Mempelai Wanita" name="bride_photo_input" initialPhotoUrl={formData.bride_photo} onUpload={(url) => updateField("bride_photo", url)} accentColor="sage" />
              </div>

              {/* Groom */}
              <div className="space-y-4">
                <h3 className="font-bold text-sm uppercase tracking-widest text-wedding-gold">Mempelai Pria</h3>
                <input type="text" value={formData.groom_name} onChange={(e) => updateField("groom_name", e.target.value)} required placeholder="Nama Panggilan" className="w-full p-4 bg-wedding-text/[0.03] border border-wedding-gold/10 rounded-xl outline-none focus:border-wedding-gold text-wedding-text transition-all" />
                <input type="text" value={formData.groom_fullname} onChange={(e) => updateField("groom_fullname", e.target.value)} required placeholder="Nama Lengkap" className="w-full p-4 bg-wedding-text/[0.03] border border-wedding-gold/10 rounded-xl outline-none focus:border-wedding-gold text-wedding-text transition-all" />
                <input type="text" value={formData.groom_father} onChange={(e) => updateField("groom_father", e.target.value)} placeholder="Nama Ayah" className="w-full p-4 bg-wedding-text/[0.03] border border-wedding-gold/10 rounded-xl outline-none focus:border-wedding-gold text-wedding-text transition-all" />
                <input type="text" value={formData.groom_mother} onChange={(e) => updateField("groom_mother", e.target.value)} placeholder="Nama Ibu" className="w-full p-4 bg-wedding-text/[0.03] border border-wedding-gold/10 rounded-xl outline-none focus:border-wedding-gold text-wedding-text transition-all" />
                <InstantPhotoUpload label="Foto Mempelai Pria" name="groom_photo_input" initialPhotoUrl={formData.groom_photo} onUpload={(url) => updateField("groom_photo", url)} accentColor="gold" />
              </div>
            </div>
            <div className="mt-8">
              <InstantPhotoUpload label="Foto Berdua (Halaman Utama)" name="couple_photo_input" initialPhotoUrl={formData.couple_photo} onUpload={(url) => updateField("couple_photo", url)} isAiEnabled={false} />
            </div>
          </motion.section>
        )}

        {/* STEP 3: DETAIL ACARA */}
        {step === 3 && (
          <motion.section
            key="step3"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-8"
          >
            <div className="flex items-center gap-3">
              <span className="w-8 h-8 bg-wedding-gold/10 rounded-lg flex items-center justify-center text-sm font-bold text-wedding-gold">03</span>
              <h2 className="font-serif text-2xl text-wedding-text">Detail Acara</h2>
            </div>
            
            <div className="grid md:grid-cols-2 gap-6 md:gap-10">
              <div className="space-y-6">
                  {/* ALTERNATIF PALING AKURAT */}
                  <div className="bg-blue-500/10 p-4 rounded-2xl border border-blue-500/20 mb-6">
                    <label className="block text-[10px] font-bold text-blue-500 uppercase tracking-widest mb-2 flex items-center gap-2">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"></path></svg>
                      Cara Paling Akurat (Opsional)
                    </label>
                    <p className="text-[10px] text-blue-500/60 mb-3 leading-relaxed font-medium">
                      Buka Google Maps &gt; Share &gt; Copy Link, lalu tempel di sini:
                    </p>
                    <input 
                      type="url"
                      placeholder="Tempel link Google Maps di sini..."
                      className="w-full px-4 py-3 bg-wedding-base border border-blue-500/20 rounded-xl text-xs focus:ring-2 focus:ring-blue-500 outline-none transition-all shadow-sm text-wedding-text"
                      onChange={(e) => handleMapsLinkPaste(e.target.value)}
                    />
                  </div>

                  <div className="p-4 md:p-6 bg-wedding-gold/5 border border-wedding-gold/10 rounded-2xl">
                    <label className="block text-xs font-bold text-wedding-gold uppercase tracking-widest mb-3">📍 Cari & Tandai Lokasi</label>
                    <div className="flex flex-col sm:flex-row gap-2 mb-4">
                      <input 
                        type="text" 
                        value={locationSearch}
                        onChange={(e) => setLocationSearch(e.target.value)}
                        placeholder="Nama gedung/lokasi..." 
                        className="flex-1 p-3 border border-wedding-gold/20 rounded-xl outline-none focus:border-wedding-gold bg-wedding-base text-wedding-text text-sm"
                        onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), searchLocation())}
                      />
                      <button 
                        type="button"
                        onClick={searchLocation}
                        disabled={isSearching}
                        className="w-full sm:w-auto px-6 py-3 bg-wedding-gold text-black rounded-xl font-bold hover:opacity-80 transition-all disabled:opacity-50 text-xs"
                      >
                        {isSearching ? "..." : "Cari"}
                      </button>
                    </div>
                  
                  <MapPicker 
                    initialLat={formData.latitude} 
                    initialLng={formData.longitude} 
                    onLocationChange={(lat, lng) => {
                      setIsLocationConfirmed(false); // Reset confirmation if map is moved
                      updateField("latitude", lat);
                      updateField("longitude", lng);
                      updateField("maps_link", `https://www.google.com/maps?q=${lat},${lng}`);
                    }} 
                  />

                  <div className="mt-4">
                    <button
                      type="button"
                      onClick={() => {
                        setIsLocationConfirmed(true);
                        setShowLocationWarning(false);
                        toast.success("Titik lokasi dikunci!");
                      }}
                      className={`w-full py-3 rounded-xl font-bold transition-all flex items-center justify-center gap-2 ${
                        isLocationConfirmed 
                          ? "bg-green-500 text-white shadow-lg" 
                          : "bg-wedding-text text-wedding-base hover:opacity-80"
                      }`}
                    >
                      {isLocationConfirmed ? (
                        <>
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                          Lokasi Sudah Dikunci
                        </>
                      ) : (
                        <>
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002-2zm10-10V7a4 4 0 00-8 0v4h8z"></path></svg>
                          Kunci Titik Lokasi Ini
                        </>
                      )}
                    </button>
                    {showLocationWarning && (
                      <p className="text-red-500 text-[10px] mt-2 font-bold animate-pulse text-center uppercase tracking-widest">
                        ⚠️ Klik tombol di atas untuk melanjutkan
                      </p>
                    )}
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-wedding-text/40 mb-1">Tanggal Acara</label>
                      <input type="date" value={formData.event_date} onChange={(e) => updateField("event_date", e.target.value)} required className="w-full p-4 bg-wedding-text/[0.03] border border-wedding-gold/10 rounded-xl outline-none focus:border-wedding-gold text-wedding-text text-sm transition-all" />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-wedding-text/40 mb-1">Waktu Mulai</label>
                      <input type="time" value={formData.event_time} onChange={(e) => updateField("event_time", e.target.value)} required className="w-full p-4 bg-wedding-text/[0.03] border border-wedding-gold/10 rounded-xl outline-none focus:border-wedding-gold text-wedding-text text-sm transition-all" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-wedding-text/40 mb-1">Nama Gedung/Lokasi</label>
                    <input type="text" value={formData.event_location} onChange={(e) => updateField("event_location", e.target.value)} required placeholder="Hotel Mulia Senayan" className="w-full p-4 bg-wedding-text/[0.03] border border-wedding-gold/10 rounded-xl outline-none focus:border-wedding-gold text-wedding-text text-sm transition-all" />
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="block text-xs font-bold text-wedding-text/40 mb-1">Alamat Lengkap</label>
                  <textarea value={formData.event_address} onChange={(e) => updateField("event_address", e.target.value)} rows={4} required placeholder="Jl. Asia Afrika Senayan..." className="w-full p-4 bg-wedding-text/[0.03] border border-wedding-gold/10 rounded-xl outline-none focus:border-wedding-gold text-wedding-text text-sm transition-all"></textarea>
                </div>
                <div>
                  <label className="block text-xs font-bold text-wedding-text/40 mb-1">Link Google Maps (Terisi Otomatis)</label>
                  <input type="url" value={formData.maps_link} onChange={(e) => updateField("maps_link", e.target.value)} required placeholder="https://maps.google.com/..." className="w-full p-4 bg-wedding-text/[0.05] border border-wedding-gold/10 rounded-xl outline-none text-wedding-text/40 text-sm cursor-not-allowed" readOnly />
                </div>
                <div className="p-4 bg-blue-500/10 rounded-xl border border-blue-500/20">
                  <p className="text-[10px] text-blue-500 leading-relaxed italic">
                    <strong>Tip:</strong> Gunakan peta di samping untuk menentukan titik koordinat yang lebih akurat jika pencarian alamat tidak tepat sasaran.
                  </p>
                </div>
              </div>
            </div>
          </motion.section>
        )}

        {/* STEP 4: LOVE STORY */}
        {step === 4 && (
          <motion.section
            key="step4"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-8"
          >
            <div className="flex items-center gap-3">
              <span className="w-8 h-8 bg-wedding-gold/10 rounded-lg flex items-center justify-center text-sm font-bold text-wedding-gold">04</span>
              <h2 className="font-serif text-2xl text-wedding-text">Love Story</h2>
            </div>
            <LoveStorySection 
              initialStories={formData.love_story} 
              onChange={(val) => updateField("love_story", val)} 
            />
          </motion.section>
        )}

        {/* STEP 5: KADO & MUSIK */}
        {step === 5 && (
          <motion.section
            key="step5"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-8"
          >
            <div className="flex items-center gap-3">
              <span className="w-8 h-8 bg-wedding-gold/10 rounded-lg flex items-center justify-center text-sm font-bold text-wedding-gold">05</span>
              <h2 className="font-serif text-2xl text-wedding-text">Quote & Digital Gift</h2>
            </div>
            <div className="space-y-8">
              <QuoteSection 
                initialQuote={formData.quote || "Dan di antara tanda-tanda kebesaran-Nya..."} 
                initialBrideName={formData.bride_name} 
                initialGroomName={formData.groom_name} 
                isAiEnabled={initialData?.is_ai_enabled}
                onChange={(val) => updateField("quote", val)}
              />
              
              <div className="space-y-4">
                <label className="block text-xs font-bold text-wedding-text/40 uppercase tracking-widest">Lagu Latar Belakang</label>
                <MusicSelector currentMusicUrl={formData.music_url} onChange={(val) => updateField("music_url", val)} />
              </div>

              <div className="bg-wedding-text/[0.03] p-6 rounded-2xl border border-wedding-gold/10">
                <label className="block text-xs font-bold text-wedding-text/40 uppercase tracking-widest mb-4">Informasi Hadiah Digital</label>
                <div className="grid md:grid-cols-3 gap-4">
                  <input type="text" value={formData.bank_name} onChange={(e) => updateField("bank_name", e.target.value)} placeholder="BCA" className="p-4 bg-wedding-base border border-wedding-gold/10 rounded-xl outline-none focus:border-wedding-gold text-wedding-text" />
                  <input type="text" value={formData.account_number} onChange={(e) => updateField("account_number", e.target.value)} placeholder="No. Rekening" className="p-4 bg-wedding-base border border-wedding-gold/10 rounded-xl outline-none focus:border-wedding-gold text-wedding-text" />
                  <input type="text" value={formData.account_name} onChange={(e) => updateField("account_name", e.target.value)} placeholder="Atas Nama" className="p-4 bg-wedding-base border border-wedding-gold/10 rounded-xl outline-none focus:border-wedding-gold text-wedding-text" />
                </div>
              </div>

              <div className="space-y-4">
                <label className="block text-xs font-bold text-wedding-text/40 uppercase tracking-widest">Turut Mengundang</label>
                <textarea value={formData.turut_mengundang} onChange={(e) => updateField("turut_mengundang", e.target.value)} rows={4} placeholder="Kel. Besar Bpk. Ahmad, Sahabat SMP 1..." className="w-full p-4 bg-wedding-base border border-wedding-gold/10 rounded-xl outline-none focus:border-wedding-gold text-wedding-text transition-all"></textarea>
              </div>

              <SubmitButton 
                label={initialData?.id ? "Simpan Perubahan" : "Simpan & Buat Undangan"} 
                loadingLabel="Sedang Menyimpan..." 
              />
            </div>
          </motion.section>
        )}
      </AnimatePresence>

      {/* Navigation Buttons */}
      <div className="flex justify-between items-center pt-6 pb-20 md:pb-0">
        <button
          type="button"
          onClick={prevStep}
          disabled={step === 1}
          className="px-6 md:px-8 py-3 md:py-4 bg-wedding-base border border-wedding-gold/10 text-wedding-text/60 rounded-xl font-bold hover:bg-wedding-text hover:text-wedding-base transition-all disabled:opacity-0 text-sm"
        >
          Kembali
        </button>
        {step < totalSteps && (
          <button
            type="button"
            onClick={nextStep}
            className="px-8 md:px-12 py-3 md:py-4 bg-wedding-gold text-black rounded-xl font-bold shadow-lg hover:opacity-80 active:scale-95 transition-all text-sm"
          >
            Lanjut
          </button>
        )}
      </div>
    </form>
  );
}
