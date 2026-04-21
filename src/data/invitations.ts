export interface InvitationData {
  id: string; // Added for DB reference
  slug: string;
  theme: "premium" | "cinematic" | "ultra-luxury" | "majestic-eternity" | "renaissance-garden";
  bride: {
    name: string;
    fullName: string;
    parents: string;
    photo: string;
  };
  groom: {
    name: string;
    fullName: string;
    parents: string;
    photo: string;
  };
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
  };
  loveStory: string[];
  quote: string;
  gift: {
    bankName: string;
    accountNumber: string;
    accountName: string;
  };
  musicUrl: string;
  guestbook: Array<{
    name: string;
    attendance: string;
    message: string;
    created_at: string;
  }>;
}

export const dummyDatabase: InvitationData[] = [];

export const dummyData: InvitationData = {
  id: "demo",
  slug: "demo",
  theme: "ultra-luxury",
  bride: {
    name: "Ayu",
    fullName: "Ayu Saraswati, S.E.",
    parents: "Bapak Budi & Ibu Siti",
    photo: "https://images.unsplash.com/photo-1546804784-81647414ee00?q=80&w=800&auto=format&fit=crop",
  },
  groom: {
    name: "Bima",
    fullName: "Bima Aryasena, S.T.",
    parents: "Bapak Joko & Ibu Sri",
    photo: "https://images.unsplash.com/photo-1550005809-91ad75fb315f?q=80&w=800&auto=format&fit=crop",
  },
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
  musicUrl: "/music/wedding-song.mp3",
  guestbook: []
};
