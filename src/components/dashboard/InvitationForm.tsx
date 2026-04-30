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
import Image from "next/image";

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
    turut_mengundang: initialData?.turut_mengundang || "",
    gallery: initialData?.gallery || []
  });

  const updateField = (name: string, value: any) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const [isLocationConfirmed, setIsLocationConfirmed] = useState(false);
  const [showLocationWarning, setShowLocationWarning] = useState(false);

  const validateStep = (currentStep: number) => {
    switch (currentStep) {
      case 1:
        if (!formData.slug) {
          toast.error("Alamat URL (Slug) wajib diisi kawan!");
          return false;
        }
        return true;
      case 2:
        if (!formData.bride_name || !formData.bride_fullname) {
          toast.error("Nama lengkap & panggilan mempelai wanita wajib diisi!");
          return false;
        }
        if (!formData.groom_name || !formData.groom_fullname) {
          toast.error("Nama lengkap & panggilan mempelai pria wajib diisi!");
          return false;
        }
        return true;
      case 3:
        if (!formData.event_date || !formData.event_time) {
          toast.error("Tanggal & waktu acara belum lengkap kawan!");
          return false;
        }
        if (!formData.event_location || !formData.event_address) {
          toast.error("Nama lokasi & alamat lengkap wajib diisi!");
          return false;
        }
        if (!isLocationConfirmed) {
          setShowLocationWarning(true);
          toast.error("Wajib kunci lokasi di peta terlebih dahulu!");
          return false;
        }
        return true;
      default:
        return true;
    }
  };

  const nextStep = () => {
    if (!validateStep(step)) return;
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
    
    // Final Validation
    for (let i = 1; i <= 3; i++) {
      if (!validateStep(i)) {
        setStep(i); // Jump to the problematic step
        return;
      }
    }

    const submitBtn = (e.nativeEvent as SubmitEvent).submitter as HTMLButtonElement;
    if (submitBtn && (submitBtn.type === "submit" || submitBtn.tagName === "BUTTON")) {
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
      fd.append("gallery", JSON.stringify(formData.gallery || []));

      startTransition(async () => {
        try {
          const result = await action(fd);
          if (result?.success) {
            toast.success("Perubahan berhasil disimpan! ✨", { id: "save-toast" });
            // Redirect ke dashboard agar lebih praktis
            if (initialData?.id) {
              router.push(`/dashboard?updated=true`);
            } else {
              router.push(`/dashboard?created=true`);
            }
            router.refresh();
          } else {
            toast.error(result?.error || "Gagal menyimpan perubahan.", { id: "save-toast" });
          }
        } catch (error) {
          console.error("Save error:", error);
          toast.error("Terjadi kesalahan sistem saat menyimpan.", { id: "save-toast" });
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
              {step === 5 && "Kado & Musik"}
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
            className="space-y-12"
          >
            <div className="flex items-center gap-3">
              <span className="w-8 h-8 bg-wedding-gold/10 rounded-lg flex items-center justify-center text-sm font-bold text-wedding-gold">02</span>
              <h2 className="font-serif text-2xl text-wedding-text">Data Mempelai</h2>
            </div>

            <div className="grid gap-12">
              {/* Bride & Groom Container */}
              <div className="grid lg:grid-cols-2 gap-8">
                {/* Mempelai Wanita Card */}
                <div className="bg-wedding-text/[0.02] border border-wedding-gold/10 rounded-3xl p-6 md:p-8 space-y-6 relative overflow-hidden group hover:border-wedding-gold/30 transition-all duration-500">
                  <div className="flex justify-between items-center pb-4 border-b border-wedding-gold/10">
                    <h3 className="font-serif text-xl text-wedding-gold">Mempelai Wanita</h3>
                    <span className="text-[9px] text-wedding-text/30 uppercase tracking-widest font-bold">Lengkap & Detail</span>
                  </div>
                  
                  <div className="grid gap-4">
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-wedding-text/40 uppercase tracking-widest ml-1">Nama Panggilan</label>
                      <input type="text" value={formData.bride_name} onChange={(e) => updateField("bride_name", e.target.value)} required placeholder="Contoh: Meisya" className="w-full p-4 bg-wedding-base border border-wedding-gold/10 rounded-2xl outline-none focus:border-wedding-gold text-wedding-text transition-all shadow-sm" />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-wedding-text/40 uppercase tracking-widest ml-1">Nama Lengkap</label>
                      <input type="text" value={formData.bride_fullname} onChange={(e) => updateField("bride_fullname", e.target.value)} required placeholder="Nama Lengkap Sesuai KTP" className="w-full p-4 bg-wedding-base border border-wedding-gold/10 rounded-2xl outline-none focus:border-wedding-gold text-wedding-text transition-all shadow-sm" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-bold text-wedding-text/40 uppercase tracking-widest ml-1">Nama Ayah</label>
                        <input type="text" value={formData.bride_father} onChange={(e) => updateField("bride_father", e.target.value)} placeholder="Bpk. Nama Ayah" className="w-full p-4 bg-wedding-base border border-wedding-gold/10 rounded-2xl outline-none focus:border-wedding-gold text-wedding-text transition-all shadow-sm" />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-bold text-wedding-text/40 uppercase tracking-widest ml-1">Nama Ibu</label>
                        <input type="text" value={formData.bride_mother} onChange={(e) => updateField("bride_mother", e.target.value)} placeholder="Ibu Nama Ibu" className="w-full p-4 bg-wedding-base border border-wedding-gold/10 rounded-2xl outline-none focus:border-wedding-gold text-wedding-text transition-all shadow-sm" />
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 space-y-3">
                    <div className="flex justify-between items-end">
                      <label className="text-[10px] font-bold text-wedding-gold uppercase tracking-[0.2em]">Foto Profile Wanita</label>
                      <span className="text-[8px] text-wedding-text/30 font-bold">JPG, PNG, HEIC • 10MB</span>
                    </div>
                    <InstantPhotoUpload 
                      label="Foto Mempelai" 
                      name="bride_photo_input" 
                      initialPhotoUrl={formData.bride_photo} 
                      onUpload={(url) => updateField("bride_photo", url)} 
                      accentColor="sage" 
                    />
                  </div>
                </div>

                {/* Mempelai Pria Card */}
                <div className="bg-wedding-text/[0.02] border border-wedding-gold/10 rounded-3xl p-6 md:p-8 space-y-6 relative overflow-hidden group hover:border-wedding-gold/30 transition-all duration-500">
                  <div className="flex justify-between items-center pb-4 border-b border-wedding-gold/10">
                    <h3 className="font-serif text-xl text-wedding-gold">Mempelai Pria</h3>
                    <span className="text-[9px] text-wedding-text/30 uppercase tracking-widest font-bold">Lengkap & Detail</span>
                  </div>
                  
                  <div className="grid gap-4">
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-wedding-text/40 uppercase tracking-widest ml-1">Nama Panggilan</label>
                      <input type="text" value={formData.groom_name} onChange={(e) => updateField("groom_name", e.target.value)} required placeholder="Contoh: Aris" className="w-full p-4 bg-wedding-base border border-wedding-gold/10 rounded-2xl outline-none focus:border-wedding-gold text-wedding-text transition-all shadow-sm" />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-wedding-text/40 uppercase tracking-widest ml-1">Nama Lengkap</label>
                      <input type="text" value={formData.groom_fullname} onChange={(e) => updateField("groom_fullname", e.target.value)} required placeholder="Nama Lengkap Sesuai KTP" className="w-full p-4 bg-wedding-base border border-wedding-gold/10 rounded-2xl outline-none focus:border-wedding-gold text-wedding-text transition-all shadow-sm" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-bold text-wedding-text/40 uppercase tracking-widest ml-1">Nama Ayah</label>
                        <input type="text" value={formData.groom_father} onChange={(e) => updateField("groom_father", e.target.value)} placeholder="Bpk. Nama Ayah" className="w-full p-4 bg-wedding-base border border-wedding-gold/10 rounded-2xl outline-none focus:border-wedding-gold text-wedding-text transition-all shadow-sm" />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-bold text-wedding-text/40 uppercase tracking-widest ml-1">Nama Ibu</label>
                        <input type="text" value={formData.groom_mother} onChange={(e) => updateField("groom_mother", e.target.value)} placeholder="Ibu Nama Ibu" className="w-full p-4 bg-wedding-base border border-wedding-gold/10 rounded-2xl outline-none focus:border-wedding-gold text-wedding-text transition-all shadow-sm" />
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 space-y-3">
                    <div className="flex justify-between items-end">
                      <label className="text-[10px] font-bold text-wedding-gold uppercase tracking-[0.2em]">Foto Profile Pria</label>
                      <span className="text-[8px] text-wedding-text/30 font-bold">JPG, PNG, HEIC • 10MB</span>
                    </div>
                    <InstantPhotoUpload 
                      label="Foto Mempelai" 
                      name="groom_photo_input" 
                      initialPhotoUrl={formData.groom_photo} 
                      onUpload={(url) => updateField("groom_photo", url)} 
                      accentColor="gold" 
                    />
                  </div>
                </div>
              </div>

              <div className="bg-wedding-text/[0.01] border border-dashed border-wedding-gold/20 rounded-3xl p-6 md:p-8 space-y-6">
                <div className="flex justify-between items-center">
                  <div className="space-y-1">
                    <h3 className="font-serif text-lg text-wedding-text">Foto Utama Pasangan</h3>
                    <p className="text-[10px] text-wedding-text/30 font-bold uppercase tracking-widest">Akan Tampil di Cover & Pembuka</p>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] text-wedding-gold/60 font-bold uppercase tracking-tighter">JPG • PNG • HEIC • 10MB</span>
                  </div>
                </div>
                <InstantPhotoUpload 
                  label="Foto Berdua" 
                  name="couple_photo_input" 
                  initialPhotoUrl={formData.couple_photo} 
                  onUpload={(url) => updateField("couple_photo", url)} 
                  isAiEnabled={false} 
                />
              </div>
              
              {/* PREMIUM GALLERY UPLOADER IN STEP 2 */}
              <div className="bg-wedding-text/[0.03] p-6 md:p-8 rounded-3xl border border-wedding-gold/10 relative overflow-hidden">
                {/* Decorative Background Icon */}
                <div className="absolute -right-4 -top-4 opacity-[0.03] pointer-events-none">
                  <svg className="w-32 h-32 text-wedding-gold" fill="currentColor" viewBox="0 0 24 24"><path d="M4 5q-.825 0-1.412.588Q2 6.175 2 7v10q0 .825.588 1.413Q3.175 19 4 19h16q.825 0 1.413-.587Q22 17.825 22 17V7q0-.825-.587-1.412Q20.825 5 20 5Zm0 2h16v10H4V7Zm2 8h12l-3.75-5-3 4L9.5 12Zm-2 2V7v10Z"/></svg>
                </div>

                <div className="flex justify-between items-center mb-8">
                  <div>
                    <label className="block text-[10px] font-bold text-wedding-gold uppercase tracking-[0.3em] mb-1">Visual Showcase</label>
                    <h4 className="font-serif text-xl text-wedding-text">Galeri Foto Sinematik</h4>
                    <p className="text-[10px] text-wedding-text/40 mt-1 uppercase tracking-widest">{formData.gallery.length} / 12 Foto Terunggah</p>
                  </div>
                  <div className="text-right">
                    <span className="text-[9px] text-wedding-text/30 uppercase tracking-widest block font-medium">Format Terdukung</span>
                    <span className="text-[10px] text-wedding-gold/60 font-bold uppercase tracking-tighter">JPG • PNG • HEIC • Maks 10MB</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                  {/* Gallery Items */}
                  {formData.gallery.map((url: string, index: number) => (
                    <motion.div 
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      key={index} 
                      className="relative aspect-[3/4] rounded-2xl overflow-hidden border border-wedding-gold/20 shadow-sm group bg-black/5"
                    >
                      <Image src={url} fill className="object-cover transition-transform duration-700 group-hover:scale-110" alt={`Gallery ${index}`} />
                      
                      {/* Delete Overlay */}
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-[2px]">
                        <button 
                          type="button"
                          onClick={() => {
                            const newGallery = formData.gallery.filter((_: any, i: number) => i !== index);
                            updateField("gallery", newGallery);
                          }}
                          className="w-10 h-10 bg-red-500 text-white rounded-full flex items-center justify-center hover:scale-110 active:scale-95 transition-all shadow-xl"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                        </button>
                      </div>
                      
                      {/* Badge Number */}
                      <div className="absolute top-2 left-2 w-5 h-5 bg-black/60 backdrop-blur-md rounded-md flex items-center justify-center text-[10px] font-bold text-wedding-gold border border-wedding-gold/20">
                        {index + 1}
                      </div>
                    </motion.div>
                  ))}
                  
                  {/* Add Button - Integrated as a card */}
                  {formData.gallery.length < 12 && (
                    <div className="aspect-[3/4] relative group cursor-pointer overflow-hidden rounded-2xl">
                      {/* UI Layer */}
                      <div className="absolute inset-0 border-2 border-dashed border-wedding-gold/20 rounded-2xl group-hover:border-wedding-gold/40 transition-colors flex flex-col items-center justify-center gap-3 bg-wedding-gold/[0.02]">
                        <div className="w-10 h-10 rounded-full bg-wedding-gold/10 flex items-center justify-center text-wedding-gold group-hover:bg-wedding-gold group-hover:text-black transition-all">
                          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path></svg>
                        </div>
                        <span className="text-[9px] font-bold uppercase tracking-widest text-wedding-text/40 group-hover:text-wedding-gold transition-colors">Tambah Foto</span>
                      </div>
                      
                      {/* Interaction Layer (InstantPhotoUpload must fill the box) */}
                      <div className="absolute inset-0 z-20">
                        <InstantPhotoUpload 
                          label="TAMBAH" 
                          variant="minimal"
                          name="gallery_upload" 
                          onUpload={(url) => updateField("gallery", [...formData.gallery, url])} 
                        />
                      </div>
                    </div>
                  )}
                </div>

                {/* Empty State Instruction */}
                {formData.gallery.length === 0 && (
                  <div className="mt-8 py-10 border-t border-wedding-gold/5 text-center">
                    <p className="text-[10px] text-wedding-text/40 italic">Klik tombol "Tambah Foto" di atas untuk menyusun galeri sinematik Anda.</p>
                  </div>
                )}
              </div>
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
            <div className="flex items-center gap-3 relative">
              <span className="w-8 h-8 bg-wedding-gold/10 rounded-lg flex items-center justify-center text-sm font-bold text-wedding-gold">03</span>
              <h2 className="font-serif text-2xl text-wedding-text">Detail Acara</h2>
              
              {/* Floating Pendopo Asset */}
              <motion.div
                animate={{ 
                  y: [0, -15, 0],
                  scale: [1, 1.02, 1]
                }}
                transition={{ 
                  duration: 6,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
                className="absolute -right-4 -top-10 w-24 h-24 pointer-events-none opacity-40 md:opacity-80"
              >
                <Image 
                  src="/assets/branding/final/nusantara_pendopo_gold.webp"
                  alt="Golden Pendopo"
                  width={100}
                  height={100}
                  className="object-contain"
                />
              </motion.div>
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
                loading={isPending}
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
