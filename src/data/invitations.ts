export interface InvitationData {
  id: string; // Added for DB reference
  slug: string;
  theme: "premium" | "cinematic" | "cinematic-dark" | "ultra-luxury" | "majestic-eternity" | "renaissance-garden" | "celestial-harmony" | "sage" | "modern-blue" | "royal-elegance";
  bride: {
    name: string;
    nickname?: string;
    fullName: string;
    parents: string;
    photo: string;
  };
  groom: {
    name: string;
    nickname?: string;
    fullName: string;
    parents: string;
    photo: string;
  };
  couplePhoto?: string;
  gallery?: string[];
  event: {
    date: string;
    dateFormatted: {
      day: string;
      date: string;
      monthYear: string;
    };
    time: string;
    locationName: string;
    locationAddress: string;
    mapsLink: string;
    latitude?: number;
    longitude?: number;
  };
  events?: Array<{
    title: string;
    date: string;
    time: string;
    location: string;
    address: string;
    maps_link: string;
    latitude: number;
    longitude: number;
  }>;
  loveStory: any[];
  quote: string;
  gift: {
    bankName: string;
    accountNumber: string;
    accountName: string;
    qrUrl?: string;
  };
  musicUrl: string;
  guestbook: Array<{
    id: string;
    name: string;
    attendance: string;
    message: string;
    created_at: string;
  }>;
  turut_mengundang?: string;
  bride_father?: string;
  bride_mother?: string;
  groom_father?: string;
  groom_mother?: string;
  closing_statement?: string;
  guestName?: string;
  dresscode?: {
    show: boolean;
    description: string;
    colors: Array<{ name: string; hex: string }>;
  };
}

export const dummyDatabase: InvitationData[] = [];

export const dummyData: InvitationData = {
  id: "demo",
  slug: "demo",
  theme: "royal-elegance",
  bride: {
    name: "Ayu",
    nickname: "Ayu",
    fullName: "Ayu Saraswati, S.E.",
    parents: "Bapak Budi & Ibu Siti",
    photo: "/assets/demo/bride.webp",
  },
  groom: {
    name: "Bima",
    nickname: "Bima",
    fullName: "Bima Aryasena, S.T.",
    parents: "Bapak Joko & Ibu Sri",
    photo: "/assets/demo/groom.webp",
  },
  couplePhoto: "/assets/demo/couple.webp",
  gallery: [
    "/assets/demo/prewed_1.webp",
    "/assets/demo/prewed_2.webp",
    "/assets/demo/prewed_3.webp",
    "/assets/demo/prewed_4.webp",
    "/assets/demo/prewed_5.webp",
    "/assets/demo/prewed_6.webp",
    "/assets/demo/prewed_7.webp",
    "/assets/demo/prewed_8.webp",
    "/assets/demo/prewed_9.webp"
  ],
  event: {
    date: "14 Februari 2027",
    dateFormatted: {
      day: "Minggu",
      date: "14",
      monthYear: "Februari 2027"
    },
    time: "08:00 - Selesai",
    locationName: "Grand Ballroom Hotel Kempinski",
    locationAddress: "Jl. M.H. Thamrin No.1, Jakarta Pusat",
    mapsLink: "https://maps.google.com"
  },
  events: [
    {
      title: "Akad Nikah",
      date: "Minggu, 14 Februari 2027",
      time: "08:00 - 10:00 WIB",
      location: "Masjid Agung Al-Hikmah",
      address: "Jl. M.H. Thamrin No.1, Jakarta Pusat",
      maps_link: "https://maps.google.com",
      latitude: -6.2088,
      longitude: 106.8456
    },
    {
      title: "Resepsi Pernikahan",
      date: "Minggu, 14 Februari 2027",
      time: "11:00 - Selesai",
      location: "Grand Ballroom Hotel Kempinski",
      address: "Jl. M.H. Thamrin No.1, Jakarta Pusat",
      maps_link: "https://maps.google.com",
      latitude: -6.2088,
      longitude: 106.8456
    }
  ],
  loveStory: [
    "Pertama kali bertemu di sebuah cafe kecil di sudut kota. Tidak ada yang spesial hari itu, namun takdir punya rencananya sendiri.",
    "Setelah bertahun-tahun saling mengenal, kami memutuskan untuk melangkah ke jenjang yang lebih serius."
  ],
  quote: "Dan di antara tanda-tanda kekuasaan-Nya ialah Dia menciptakan untukmu isteri-isteri dari jenismu sendiri...",
  gift: {
    bankName: "BCA",
    accountNumber: "1234567890",
    accountName: "Ayu Saraswati"
  },
  musicUrl: "/music/A Thousand Years – Piano.mp3",
  guestbook: [],
  turut_mengundang: "Keluarga Besar Bapak Budi, Keluarga Besar Bapak Joko, Kerabat & Sahabat",
  closing_statement: "Kehadiran serta doa restu Anda adalah kado terindah yang melengkapi perjalanan cinta kami. Terima kasih telah menjadi bagian dari cerita ini. Sampai jumpa di hari bahagia kami."
};
