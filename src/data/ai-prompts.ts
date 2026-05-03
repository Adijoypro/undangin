export interface AIPrompt {
  id: string;
  category: "quote" | "love-story" | "closing";
  style: "religious-islam" | "religious-kristen" | "poetic" | "modern" | "traditional";
  title: string;
  content: string;
}

export const aiPrompts: AIPrompt[] = [
  // QUOTES - ISLAMI
  {
    id: "q-isl-1",
    category: "quote",
    style: "religious-islam",
    title: "Ar-Rum: 21",
    content: "Dan di antara tanda-tanda kekuasaan-Nya ialah Dia menciptakan untukmu isteri-isteri dari jenismu sendiri, supaya kamu cenderung dan merasa tenteram kepadanya, dan dijadikan-Nya diantaramu rasa kasih dan sayang."
  },
  {
    id: "q-isl-2",
    category: "quote",
    style: "religious-islam",
    title: "An-Nahl: 72",
    content: "Allah menjadikan bagi kamu isteri-isteri dari jenis kamu sendiri dan menjadikan bagimu dari isteri-isteri kamu itu, anak-anak dan cucu-cucu, dan memberimu rezeki dari yang baik-baik."
  },

  // QUOTES - KRISTEN
  {
    id: "q-kris-1",
    category: "quote",
    style: "religious-kristen",
    title: "1 Korintus 13:4-7",
    content: "Kasih itu sabar; kasih itu murah hati; ia tidak cemburu. Ia tidak memegahkan diri dan tidak sombong. Ia tidak melakukan yang tidak sopan dan tidak mencari keuntungan diri sendiri. Ia tidak pemarah dan tidak menyimpan kesalahan orang lain."
  },

  // QUOTES - POETIC
  {
    id: "q-poet-1",
    category: "quote",
    style: "poetic",
    title: "Janji Semesta",
    content: "Dua jiwa, satu detak jantung. Di bawah langit yang sama, kami berjanji untuk saling menjaga, mengasihi, dan menua bersama dalam pelukan takdir yang indah."
  },

  // CLOSING - MODERN
  {
    id: "c-mod-1",
    category: "closing",
    style: "modern",
    title: "Modern Minimalist",
    content: "Kehadiran Anda adalah kado terindah bagi kami. Terima kasih telah menjadi bagian dari awal perjalanan baru kami. Sampai jumpa di hari bahagia!"
  },

  // CLOSING - TRADITIONAL
  {
    id: "c-trad-1",
    category: "closing",
    style: "traditional",
    title: "Kromo Inggil (Jawa)",
    content: "Mewanti-wanti dumateng rawuh panjenengan sedaya. Pandonga pangestu panjenengan dadosaken berkah kagem keluarga enggal kulo lan pasangan. Matur nuwun."
  }
];
