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
import { QRCodeSVG } from "qrcode.react";
import { Plus, Search, Check, Calendar, Clock, MapPin, ExternalLink, Sparkles } from "lucide-react";

import LoveStorySection from "./LoveStorySection";
import MapPicker from "./MapPicker";
import Image from "next/image";

interface InvitationFormProps {
  action: any;
  deductCreditAction?: any;
  initialData?: any;
  credits?: number;
}

export default function InvitationForm({ action, deductCreditAction, initialData, credits = 0 }: InvitationFormProps) {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const totalSteps = 5;

  const [names, setNames] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [pendingGuest, setPendingGuest] = useState<{name: string, link: string, type: 'copy' | 'wa'} | null>(null);
  const isPublished = initialData?.status === 'published';

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
    closing_statement: initialData?.closing_statement || "",
    gift_qr_url: initialData?.gift_qr_url || "",
    gallery: initialData?.gallery || [],
    // Multi-event support
    events: initialData?.events || [
      {
        title: "Akad Nikah / Pemberkatan",
        date: initialData?.event_date || "",
        time: initialData?.event_time || "",
        location: initialData?.event_location || "",
        address: initialData?.event_address || "",
        maps_link: initialData?.maps_link || "",
        latitude: initialData?.latitude || -6.2088,
        longitude: initialData?.longitude || 106.8456,
        is_location_confirmed: !!initialData?.latitude
      }
    ]
  });

  const updateField = (name: string, value: any) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const updateEventField = (index: number, name: string, value: any) => {
    setFormData(prev => {
      const newEvents = [...prev.events];
      newEvents[index] = { ...newEvents[index], [name]: value };
      return { ...prev, events: newEvents };
    });
  };

  const addEvent = () => {
    setFormData(prev => ({
      ...prev,
      events: [
        ...prev.events,
        {
          title: "Resepsi Nikah",
          date: prev.events[0]?.date || "",
          time: "",
          location: "",
          address: "",
          maps_link: "",
          latitude: -6.2088,
          longitude: 106.8456,
          is_location_confirmed: false
        }
      ]
    }));
    toast.success("Acara baru ditambahkan!");
  };

  const removeEvent = (index: number) => {
    if (formData.events.length <= 1) {
      toast.error("Minimal harus ada satu acara kawan!");
      return;
    }
    setFormData(prev => ({
      ...prev,
      events: prev.events.filter((_: any, i: number) => i !== index)
    }));
    toast.info("Acara dihapus.");
  };

  const [isLocationConfirmed, setIsLocationConfirmed] = useState(false);
  const [showLocationWarning, setShowLocationWarning] = useState(false);
  const [searchQueries, setSearchQueries] = useState<Record<number, string>>({});

  const handleSearchLocation = async (index: number) => {
    const query = searchQueries[index];
    if (!query) {
      toast.error("Ketik dulu lokasinya bro!");
      return;
    }

    const toastId = toast.loading("Mencari lokasi...");

    try {
      // Use Nominatim with a descriptive User-Agent
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=1`,
        {
          headers: {
            'User-Agent': 'UndanginWeddingPlatform/1.0'
          }
        }
      );
      const data = await response.json();

      if (data && data.length > 0) {
        const { lat, lon, display_name } = data[0];
        const newEvents = [...formData.events];
        newEvents[index] = {
          ...newEvents[index],
          latitude: parseFloat(lat),
          longitude: parseFloat(lon),
          location: query,
          address: display_name,
          is_location_confirmed: true
        };
        
        setFormData(prev => ({ ...prev, events: newEvents }));
        toast.success(`Ditemukan: ${display_name.split(',')[0]}`, { id: toastId });
      } else {
        toast.error("Lokasi tidak ditemukan. Coba lebih spesifik.", { id: toastId });
      }
    } catch (error) {
      console.error("Search error:", error);
      toast.error("Gagal nyari lokasi. Cek koneksi internet lu bro.", { id: toastId });
    }
  };

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
        for (let i = 0; i < formData.events.length; i++) {
          const ev = formData.events[i];
          const eventLabel = `Acara ${i + 1} (${ev.title})`;
          if (!ev.date || !ev.time) {
            toast.error(`${eventLabel}: Tanggal & waktu belum lengkap!`);
            return false;
          }
          if (!ev.location || !ev.address) {
            toast.error(`${eventLabel}: Nama lokasi & alamat wajib diisi!`);
            return false;
          }
          if (!ev.is_location_confirmed) {
            toast.error(`${eventLabel}: Wajib kunci lokasi di peta!`);
            return false;
          }
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

  const [isPending, startTransition] = useTransition();

  const handleMapsLinkPaste = (index: number, url: string) => {
    try {
      const coordRegex = /@(-?\d+\.\d+),(-?\d+\.\d+)|q=(-?\d+\.\d+),(-?\d+\.\d+)/;
      const match = url.match(coordRegex);

      const newEvents = [...formData.events];
      
      if (match) {
        const lat = parseFloat(match[1] || match[3]);
        const lng = parseFloat(match[2] || match[4]);

        if (!isNaN(lat) && !isNaN(lng)) {
          newEvents[index] = {
            ...newEvents[index],
            latitude: lat,
            longitude: lng,
            maps_link: url,
            is_location_confirmed: true
          };
          setFormData(prev => ({ ...prev, events: newEvents }));
          toast.success("Koordinat berhasil ditarik dari link Google Maps!");
          return;
        }
      }
      
      newEvents[index] = { ...newEvents[index], maps_link: url };
      setFormData(prev => ({ ...prev, events: newEvents }));
      toast.info("Link disimpan. Pastikan titik di peta sudah sesuai.");
    } catch (e) {
      console.error("Link parse error:", e);
    }
  };



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
      
      fd.append("gift_qr_url", formData.gift_qr_url || "");
      
      fd.append("love_story", JSON.stringify(formData.love_story || []));
      fd.append("quote", formData.quote || "");
      
      fd.append("bank_name", formData.bank_name || "");
      fd.append("account_number", formData.account_number || "");
      fd.append("account_name", formData.account_name || "");
      
      fd.append("selected_music_url", formData.music_url || "");
      fd.append("turut_mengundang", formData.turut_mengundang || "");
      fd.append("closing_statement", formData.closing_statement || "");
      fd.append("gallery", JSON.stringify(formData.gallery || []));
      fd.append("events", JSON.stringify(formData.events || []));
      
      if (initialData?.id) {
        fd.append("id", initialData.id);
      }

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

  // --- GUEST MANAGEMENT LOGIC ---
  const baseUrl = typeof window !== "undefined" ? window.location.origin : "";
  const invitationUrl = `${baseUrl}/${formData.slug}`;

  const guestList = names
    .split(/[\n,]+/)
    .map(n => n.trim())
    .filter(n => n !== "")
    .map((name, index) => {
      const code = `INV-${formData.slug.slice(0, 3).toUpperCase()}-${(index + 1).toString().padStart(3, '0')}`;
      return {
        name,
        code,
        link: `${invitationUrl}?to=${encodeURIComponent(name)}&code=${code}`
      };
    });

  const handleCopyLink = async (link: string) => {
    if (!isPublished) {
      if (credits < 1) {
        toast.error("Kredit tidak cukup untuk membagikan link draft.");
        return;
      }
      setPendingGuest({ name: "Tamu", link, type: 'copy' });
      setShowConfirm(true);
    } else {
      navigator.clipboard.writeText(link);
      toast.success("Link berhasil disalin!");
    }
  };

  const handleShareWA = async (name: string, link: string) => {
    if (!isPublished) {
      if (credits < 1) {
        toast.error("Kredit tidak cukup untuk membagikan link draft.");
        return;
      }
      setPendingGuest({ name, link, type: 'wa' });
      setShowConfirm(true);
    } else {
      const message = encodeURIComponent(`Halo ${name},\nKami mengundang Anda ke acara pernikahan kami.\nBuka undangan di sini: ${link}`);
      window.open(`https://wa.me/?text=${message}`, "_blank");
    }
  };

  const confirmDeduction = async () => {
    if (!pendingGuest) return;
    
    setIsProcessing(true);
    setShowConfirm(false);
    
    try {
      const res = await deductCreditAction(1);
      if (res.success) {
        if (pendingGuest.type === 'copy') {
          navigator.clipboard.writeText(pendingGuest.link);
          toast.success("Link berhasil disalin! (1 Kredit Terpakai)");
        } else {
          const message = encodeURIComponent(`Halo ${pendingGuest.name},\nKami mengundang Anda ke acara pernikahan kami.\nBuka undangan di sini: ${pendingGuest.link}`);
          window.open(`https://wa.me/?text=${message}`, "_blank");
          toast.success("Berhasil membagikan! (1 Kredit Terpakai)");
        }
        router.refresh();
      } else {
        toast.error(res.error || "Gagal memproses kredit.");
      }
    } catch (err) {
      toast.error("Terjadi kesalahan sistem.");
    } finally {
      setIsProcessing(false);
      setPendingGuest(null);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8 relative">
      <AnimatePresence>
        {showConfirm && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/90 lg:backdrop-blur-md z-[100] flex items-center justify-center p-4 transform-gpu"
          >
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="bg-zinc-950 border border-wedding-gold/30 rounded-[2.5rem] p-8 md:p-10 max-w-sm w-full shadow-[0_0_50px_rgba(212,175,55,0.15)] text-center space-y-8"
            >
              <div className="w-16 h-16 bg-wedding-gold/10 rounded-full flex items-center justify-center mx-auto border border-wedding-gold/20">
                <Plus className="w-8 h-8 text-wedding-gold rotate-45" />
              </div>
              
              <div className="space-y-3">
                <h3 className="text-xl font-serif text-white">Konfirmasi Akses VIP</h3>
                <p className="text-zinc-500 text-xs leading-relaxed">
                  Undangan ini masih dalam status <span className="text-wedding-gold font-bold italic">Draft</span>. Silakan gunakan 1 kredit untuk membagikan link personal ini agar tamu bisa membukanya.
                </p>
              </div>

              <div className="flex flex-col gap-3">
                <button 
                  type="button"
                  onClick={confirmDeduction}
                  className="w-full py-4 bg-wedding-gold text-black text-[10px] font-black uppercase tracking-[0.2em] rounded-2xl hover:scale-[1.02] active:scale-[0.98] transition-all"
                >
                  Gunakan 1 Kredit
                </button>
                <button 
                  type="button"
                  onClick={() => setShowConfirm(false)}
                  className="w-full py-4 bg-zinc-900 text-zinc-400 text-[10px] font-bold uppercase tracking-[0.2em] rounded-2xl hover:bg-zinc-800 transition-all"
                >
                  Nanti Saja
                </button>
              </div>
              
              <p className="text-[9px] text-zinc-600 italic">
                *Atau publish undangan ini secara penuh untuk akses tanpa batas.
              </p>
            </motion.div>
          </motion.div>
        )}

        {isPending && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-wedding-base/95 lg:backdrop-blur-sm z-50 flex items-center justify-center rounded-2xl transform-gpu"
          >
            <div className="flex flex-col items-center gap-4">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-wedding-gold"></div>
              <p className="text-[10px] font-bold text-wedding-gold uppercase tracking-widest">Sedang Menyimpan...</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Progress Indicator & Quick Save */}
      <div className="bg-wedding-base p-4 md:p-6 rounded-2xl shadow-xl border border-wedding-gold/10 mb-6 md:mb-8 sticky top-2 z-40 lg:backdrop-blur-md bg-wedding-base/95 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 transition-all duration-500 transform-gpu">
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
        {step === 1 && (
          <motion.section
            key="step1"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-10"
          >
            <div className="flex items-center gap-3">
              <span className="w-8 h-8 bg-wedding-gold/10 rounded-lg flex items-center justify-center text-sm font-bold text-wedding-gold">01</span>
              <h2 className="font-serif text-2xl text-wedding-text">Pengaturan Dasar</h2>
            </div>
            
            <div className="grid gap-10">
              <div className="bg-wedding-text/[0.02] border border-wedding-gold/10 rounded-3xl p-6 md:p-8 space-y-8">
                <SlugInput defaultValue={formData.slug} onChange={(val) => updateField("slug", val)} />
                <ThemeSelector defaultValue={formData.theme} onChange={(val) => updateField("theme", val)} />
              </div>

              {/* INTEGRATED GUEST GENERATOR */}
              <div className="bg-zinc-950 border border-wedding-gold/20 rounded-3xl overflow-hidden shadow-2xl">
                <div className="p-6 md:p-8 bg-gradient-to-br from-zinc-900 to-black border-b border-zinc-800">
                  <div className="flex flex-col md:flex-row gap-6 justify-between items-start">
                    <div className="space-y-2">
                      <div className="inline-flex items-center gap-2 px-2 py-1 bg-wedding-gold/10 border border-wedding-gold/20 rounded-full">
                        <div className="w-1.5 h-1.5 bg-wedding-gold rounded-full animate-pulse"></div>
                        <span className="text-[8px] font-black text-wedding-gold uppercase tracking-[0.2em]">Jalur VIP & Orang Penting</span>
                      </div>
                      <h3 className="text-xl font-serif text-white">Tamu Spesial</h3>
                      <p className="text-zinc-500 text-[10px] leading-relaxed max-w-xs">
                        Nama tamu spesial akan muncul eksklusif di halaman pembuka undangan.
                      </p>
                    </div>
                    <div className="flex-1 w-full">
                      <textarea 
                        value={names}
                        onChange={(e) => setNames(e.target.value)}
                        placeholder="Ketik Nama (Pisahkan dengan koma atau enter)..."
                        className="w-full p-4 bg-black/60 border border-zinc-800 rounded-2xl focus:border-wedding-gold outline-none text-xs text-white transition-all resize-none h-24"
                      />
                    </div>
                  </div>
                </div>

                <div className="p-6 md:p-8 max-h-[300px] overflow-y-auto bg-zinc-950/50">
                  {guestList.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {guestList.map((guest, i) => (
                        <div key={i} className="bg-zinc-900 border border-zinc-800 rounded-2xl p-4 flex flex-col justify-between gap-4 group hover:border-wedding-gold/30 transition-all">
                          <div className="flex justify-between items-start gap-2">
                            <div className="min-w-0">
                              <span className="text-[7px] font-bold text-wedding-gold/50 uppercase tracking-widest block mb-1">{guest.code}</span>
                              <h4 className="text-xs font-bold text-white truncate">{guest.name}</h4>
                            </div>
                            <div className="p-1 bg-white rounded-md scale-75 origin-top-right">
                              <QRCodeSVG value={guest.link} size={32} />
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <button 
                              type="button"
                              onClick={() => handleCopyLink(guest.link)}
                              disabled={isProcessing}
                              className="flex-1 py-2 bg-zinc-800 hover:bg-zinc-700 text-white text-[9px] font-bold rounded-lg transition-all"
                            >
                              Copy
                            </button>
                            <button 
                              type="button"
                              onClick={() => handleShareWA(guest.name, guest.link)}
                              className="flex-1 py-2 bg-green-600/20 text-green-500 text-[9px] font-bold rounded-lg border border-green-600/20 hover:bg-green-600 hover:text-white transition-all"
                            >
                              WA
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="py-10 text-center space-y-3">
                      <div className="w-12 h-12 bg-zinc-900 rounded-full flex items-center justify-center text-zinc-800 mx-auto border border-zinc-800">
                        <Plus className="w-6 h-6" />
                      </div>
                      <p className="text-zinc-600 text-[10px] uppercase tracking-widest font-bold">Daftar tamu akan muncul di sini</p>
                    </div>
                  )}
                </div>
              </div>
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
                      <Image src={url} fill className="object-cover transition-transform duration-700 lg:group-hover:scale-110" alt={`Gallery ${index}`} />
                      
                      {/* Delete Overlay */}
                      <div className="absolute inset-0 bg-black/40 opacity-0 lg:group-hover:opacity-100 transition-opacity flex items-center justify-center lg:backdrop-blur-[2px]">
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
                      <div className="absolute top-2 left-2 w-5 h-5 bg-black/80 lg:backdrop-blur-md rounded-md flex items-center justify-center text-[10px] font-bold text-wedding-gold border border-wedding-gold/20">
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

        {/* STEP 3: DETAIL ACARA (MULTI-EVENT) */}
        {step === 3 && (
          <motion.section
            key="step3"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-8"
          >
            <div className="flex justify-between items-end relative">
              <div className="flex items-center gap-3">
                <span className="w-8 h-8 bg-wedding-gold/10 rounded-lg flex items-center justify-center text-sm font-bold text-wedding-gold">03</span>
                <div>
                  <h2 className="font-serif text-2xl text-wedding-text">Detail Acara</h2>
                  <p className="text-[10px] text-wedding-text/40 uppercase tracking-widest mt-1">Atur Jadwal & Lokasi Tiap Sesi</p>
                </div>
              </div>

              {/* Floating Pendopo Asset - Repositioned to not block buttons */}
              <motion.div
                animate={{ 
                  y: [0, -15, 0],
                  rotate: [0, 3, 0],
                  scale: [1, 1.02, 1]
                }}
                transition={{ 
                  duration: 10,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
                className="absolute -right-12 -top-24 w-40 h-40 pointer-events-none z-[70] drop-shadow-[0_15px_30px_rgba(212,175,55,0.4)] opacity-90"
              >
                <Image 
                  src="/assets/branding/final/nusantara_pendopo_gold.webp"
                  alt="Golden Pendopo"
                  width={128}
                  height={128}
                  className="object-contain"
                />
              </motion.div>

              <button 
                type="button"
                onClick={addEvent}
                className="px-5 py-2.5 bg-wedding-gold text-black rounded-full text-[9px] font-black uppercase tracking-[0.2em] hover:scale-105 active:scale-95 transition-all shadow-lg flex items-center gap-2"
              >
                <Plus className="w-3.5 h-3.5" />
                Tambah Sesi
              </button>
            </div>

            <div className="space-y-12 pb-10">
              {formData.events.map((event: any, index: number) => (
                <div key={index} className="relative bg-wedding-text/[0.02] border border-wedding-gold/10 rounded-[2.5rem] p-6 md:p-10 space-y-10 group hover:border-wedding-gold/30 transition-all duration-500 shadow-sm">
                  
                  {/* Event Title Header */}
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div className="flex items-center gap-4 flex-1 w-full">
                      <div className="w-12 h-12 rounded-2xl bg-wedding-gold text-black flex items-center justify-center font-serif text-xl font-bold shadow-xl">
                        {index + 1}
                      </div>
                      <div className="flex-1">
                        <input 
                          type="text"
                          value={event.title}
                          onChange={(e) => updateEventField(index, "title", e.target.value)}
                          placeholder="Nama Acara (Contoh: Akad Nikah)"
                          className="bg-transparent border-none text-2xl font-serif text-wedding-text outline-none focus:ring-0 p-0 w-full placeholder:text-wedding-text/20"
                        />
                        <div className="h-px w-full bg-gradient-to-r from-wedding-gold/30 to-transparent mt-1"></div>
                      </div>
                    </div>
                    {formData.events.length > 1 && (
                      <button 
                        type="button"
                        onClick={() => removeEvent(index)}
                        className="px-4 py-2 bg-red-500/10 text-red-500 rounded-xl text-[8px] font-black uppercase tracking-widest hover:bg-red-500 hover:text-white transition-all shadow-sm"
                      >
                        Hapus Acara
                      </button>
                    )}
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16">
                    {/* Left Column: Form Fields */}
                    <div className="space-y-8">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <label className="block text-[9px] font-black text-wedding-gold uppercase tracking-[0.2em]">Tanggal Acara</label>
                          <input 
                            type="date"
                            value={event.date}
                            onChange={(e) => updateEventField(index, "date", e.target.value)}
                            className="w-full p-4 bg-wedding-base border border-wedding-gold/10 rounded-2xl outline-none focus:border-wedding-gold text-wedding-text transition-all text-sm shadow-inner"
                          />
                        </div>
                        <div className="space-y-2 group/time">
                          <label className="block text-[9px] font-black text-wedding-gold uppercase tracking-[0.2em] group-focus-within/time:text-wedding-text transition-colors">Waktu Acara</label>
                          <div className="relative">
                            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-wedding-gold/40 group-focus-within/time:text-wedding-gold transition-colors">
                              <Clock className="w-4 h-4" />
                            </div>
                            <input 
                              type="text"
                              value={event.time}
                              onChange={(e) => {
                                let val = e.target.value.replace(/[^0-9:\-\s]/g, ''); // Allow numbers, colon, dash, space
                                
                                // Auto-format HH:mm (e.g., typing '09' becomes '09:')
                                if (val.length === 2 && !val.includes(':') && (e.nativeEvent as any).inputType !== 'deleteContentBackward') {
                                  val = val + ':';
                                }
                                
                                // Max length validation
                                if (val.length > 25) return; 
                                
                                updateEventField(index, "time", val);
                              }}
                              placeholder="Contoh: 09:00 - Selesai"
                              className="w-full pl-12 pr-24 py-5 bg-wedding-base border border-wedding-gold/10 rounded-2xl outline-none focus:border-wedding-gold text-wedding-text transition-all text-sm shadow-inner font-medium"
                            />
                            
                            {/* Quick Suffix Buttons */}
                            <div className="absolute right-2 top-1/2 -translate-y-1/2 flex gap-1">
                              <button
                                type="button"
                                onClick={() => {
                                  const base = event.time.split(' - ')[0] || "09:00";
                                  updateEventField(index, "time", `${base} - Selesai`);
                                }}
                                className="px-3 py-2 bg-wedding-gold/10 text-wedding-gold text-[8px] font-black uppercase rounded-xl hover:bg-wedding-gold hover:text-black transition-all border border-wedding-gold/20"
                              >
                                + Selesai
                              </button>
                            </div>
                          </div>
                          <p className="text-[8px] text-wedding-text/30 italic ml-1 group-focus-within/time:opacity-100 opacity-0 transition-opacity">Format bebas, contoh: "09:00 - 12:00" atau "09:00 - Selesai"</p>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <label className="block text-[9px] font-black text-wedding-gold uppercase tracking-[0.2em]">Nama Lokasi / Gedung</label>
                        <input 
                          type="text"
                          value={event.location}
                          onChange={(e) => updateEventField(index, "location", e.target.value)}
                          placeholder="Misal: Hotel Mulia Senayan"
                          className="w-full p-4 bg-wedding-base border border-wedding-gold/10 rounded-2xl outline-none focus:border-wedding-gold text-wedding-text transition-all text-sm shadow-inner"
                        />
                      </div>

                      <div className="space-y-2">
                        <label className="block text-[9px] font-black text-wedding-gold uppercase tracking-[0.2em]">Alamat Lengkap</label>
                        <textarea 
                          value={event.address}
                          onChange={(e) => updateEventField(index, "address", e.target.value)}
                          rows={3}
                          placeholder="Tuliskan alamat lengkap lokasi acara..."
                          className="w-full p-4 bg-wedding-base border border-wedding-gold/10 rounded-2xl outline-none focus:border-wedding-gold text-wedding-text transition-all text-sm shadow-inner resize-none"
                        ></textarea>
                      </div>
                    </div>

                    {/* Right Column: Maps Integration */}
                    <div className="space-y-6">
                      <div className="bg-wedding-gold/5 p-6 rounded-[2rem] border border-wedding-gold/10 space-y-6">
                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                          <label className="text-[9px] font-black text-wedding-gold uppercase tracking-[0.3em]">📍 Titik Lokasi Peta</label>
                          <div className="flex items-center gap-2 w-full md:w-auto">
                            <input 
                              type="text" 
                              value={searchQueries[index] || ""}
                              onChange={(e) => setSearchQueries(prev => ({ ...prev, [index]: e.target.value }))}
                              placeholder="Cari lokasi..." 
                              className="flex-1 md:flex-none text-[10px] bg-wedding-base border border-wedding-gold/10 px-4 py-2 rounded-xl outline-none focus:border-wedding-gold text-wedding-text md:w-48 shadow-sm"
                              onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                  e.preventDefault();
                                  handleSearchLocation(index);
                                }
                              }}
                            />
                            <button 
                              type="button"
                              onClick={() => handleSearchLocation(index)}
                              className="p-2.5 bg-wedding-gold text-black rounded-xl hover:scale-105 active:scale-95 transition-all shadow-md flex items-center justify-center"
                            >
                              <Search className="w-4 h-4" />
                            </button>
                          </div>
                        </div>

                        {/* Paste Link Option */}
                        <div className="relative group/input">
                          <input 
                            type="text"
                            value={event.maps_link}
                            onChange={(e) => updateEventField(index, "maps_link", e.target.value)}
                            onPaste={(e) => {
                              const pastedText = e.clipboardData.getData('text');
                              handleMapsLinkPaste(index, pastedText);
                            }}
                            placeholder="Atau tempel link Google Maps di sini..."
                            className="w-full p-4 bg-wedding-base border border-wedding-gold/10 rounded-2xl outline-none focus:border-wedding-gold text-wedding-text transition-all text-[10px] pr-20 shadow-inner"
                          />
                          <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-2 pointer-events-none opacity-40">
                            <span className="text-[7px] font-bold uppercase tracking-widest bg-wedding-gold/20 text-wedding-gold px-2 py-1 rounded">Auto Detect</span>
                          </div>
                        </div>

                        <div className="h-[280px] rounded-[1.5rem] overflow-hidden border border-wedding-gold/20 relative shadow-2xl">
                          <MapPicker 
                            initialLat={event.latitude} 
                            initialLng={event.longitude} 
                            onLocationChange={(lat, lng) => {
                              const newEvents = [...formData.events];
                              newEvents[index] = { 
                                ...newEvents[index], 
                                latitude: lat, 
                                longitude: lng, 
                                is_location_confirmed: true,
                                maps_link: `https://www.google.com/maps?q=${lat},${lng}` 
                              };
                              setFormData(prev => ({ ...prev, events: newEvents }));
                            }}
                          />
                          
                          {/* Map Overlay Status */}
                          <div className="absolute bottom-4 left-4 z-20">
                            <button
                              type="button"
                              onClick={() => {
                                const newEvents = [...formData.events];
                                newEvents[index] = { ...newEvents[index], is_location_confirmed: true };
                                setFormData(prev => ({ ...prev, events: newEvents }));
                                toast.success(`Lokasi ${event.title} dikunci!`);
                              }}
                              className={`px-4 py-2 rounded-xl text-[9px] font-bold uppercase tracking-widest transition-all flex items-center gap-2 shadow-2xl backdrop-blur-md border ${
                                event.is_location_confirmed 
                                  ? "bg-green-500/90 text-white border-white/20" 
                                  : "bg-red-500/90 text-white border-white/20 animate-pulse pointer-events-auto cursor-pointer"
                              }`}
                            >
                              <div className={`w-2 h-2 rounded-full ${event.is_location_confirmed ? 'bg-white' : 'bg-white animate-ping'}`}></div>
                              {event.is_location_confirmed ? 'Lokasi Dikunci' : 'Klik Untuk Kunci Titik'}
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
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

              <div className="grid md:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <label className="block text-xs font-bold text-wedding-text/40 uppercase tracking-widest">Nomor Rekening</label>
                  <input type="text" value={formData.account_number} onChange={(e) => updateField("account_number", e.target.value)} placeholder="Contoh: 12345678" className="w-full p-4 bg-wedding-base border border-wedding-gold/10 rounded-xl outline-none focus:border-wedding-gold text-wedding-text transition-all" />
                </div>
                <div className="space-y-4">
                  <label className="block text-xs font-bold text-wedding-gold uppercase tracking-widest">Upload QRIS (Opsional)</label>
                  <div className="relative group">
                    <input 
                      type="file" 
                      accept="image/*"
                      onChange={async (e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          const reader = new FileReader();
                          reader.onloadend = () => updateField("gift_qr_url", reader.result);
                          reader.readAsDataURL(file);
                        }
                      }}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" 
                    />
                    <div className="p-4 bg-wedding-gold/5 border-2 border-dashed border-wedding-gold/20 rounded-xl flex flex-col items-center justify-center gap-2 group-hover:border-wedding-gold/40 transition-all">
                      {formData.gift_qr_url ? (
                        <div className="relative w-full aspect-square max-w-[100px]">
                           <img src={formData.gift_qr_url} className="w-full h-full object-contain rounded-lg" alt="QRIS" />
                           <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity rounded-lg">
                              <span className="text-[10px] text-white font-bold">Ganti</span>
                           </div>
                        </div>
                      ) : (
                        <>
                          <svg className="w-6 h-6 text-wedding-gold/40" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path></svg>
                          <span className="text-[10px] font-bold text-wedding-gold/60 uppercase tracking-widest">Upload QRIS</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <label className="block text-xs font-bold text-wedding-text/40 uppercase tracking-widest">Turut Mengundang</label>
                <textarea value={formData.turut_mengundang} onChange={(e) => updateField("turut_mengundang", e.target.value)} rows={4} placeholder="Kel. Besar Bpk. Ahmad, Sahabat SMP 1..." className="w-full p-4 bg-wedding-base border border-wedding-gold/10 rounded-xl outline-none focus:border-wedding-gold text-wedding-text transition-all"></textarea>
              </div>

              <div className="bg-wedding-gold/[0.03] p-6 rounded-3xl border border-wedding-gold/10 relative overflow-hidden group">
                {/* Decorative AI Sparkle */}
                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                  <svg className="w-12 h-12 text-wedding-gold" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2l2.4 7.2L22 12l-7.6 2.4L12 22l-2.4-7.2L2 12l7.6-2.4L12 2z"/></svg>
                </div>

                <div className="relative z-10 space-y-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <label className="block text-[10px] font-bold text-wedding-gold uppercase tracking-[0.3em] mb-1">Final Touch</label>
                      <h4 className="font-serif text-lg text-wedding-text">Kata-kata Penutup</h4>
                    </div>
                    <button 
                      type="button"
                      onClick={() => {
                        const messages = [
                          "Kehadiran serta doa restu Anda adalah kado terindah yang melengkapi perjalanan cinta kami. Terima kasih telah menjadi bagian dari cerita ini. Sampai jumpa di hari bahagia kami.",
                          "Satu kehormatan bagi kami jika Anda hadir menyaksikan ikrar suci kami. Terima kasih atas cinta dan dukungan yang tak terhingga. Sampai jumpa di pelaminan!",
                          "Cinta membawa kita bertemu, dan doa Anda mengiringi langkah kami menuju masa depan. Terima kasih atas segala cinta yang telah Anda berikan kepada kami.",
                          "Terima kasih telah menemani perjalanan kami hingga titik ini. Doa Anda adalah restu terbaik bagi masa depan kami. Sampai jumpa di hari bahagia kami!"
                        ];
                        const randomMsg = messages[Math.floor(Math.random() * messages.length)];
                        updateField("closing_statement", randomMsg);
                        toast.success("Magic Closing Generated! ✨");
                      }}
                      className="px-4 py-2 bg-wedding-gold text-black rounded-full text-[9px] font-black uppercase tracking-widest hover:scale-105 active:scale-95 transition-all shadow-lg flex items-center gap-2"
                    >
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
                      Generate AI
                    </button>
                  </div>

                  <div className="relative">
                    <textarea 
                      name="closing_statement"
                      value={formData.closing_statement} 
                      onChange={(e) => updateField("closing_statement", e.target.value)} 
                      rows={3} 
                      placeholder="Klik 'Generate AI' untuk kata-kata manis otomatis..." 
                      className="w-full p-5 bg-wedding-base/50 border border-wedding-gold/10 rounded-2xl outline-none focus:border-wedding-gold text-wedding-text transition-all text-sm italic leading-relaxed placeholder:text-wedding-text/20"
                    ></textarea>
                    {formData.closing_statement && (
                      <div className="absolute bottom-3 right-3">
                        <span className="text-[8px] bg-wedding-gold/10 text-wedding-gold px-2 py-1 rounded-md font-bold uppercase tracking-widest border border-wedding-gold/20">AI Enhanced</span>
                      </div>
                    )}
                  </div>
                </div>
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
