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
