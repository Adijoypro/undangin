/**
 * Utility functions for formatting data across the application
 */

export interface FormattedWeddingDate {
  day: string;
  date: string;
  monthYear: string;
}

/**
 * Converts a date string (YYYY-MM-DD) into a nice Indonesian wedding date format
 */
export function formatWeddingDate(dateString: string | null | undefined): FormattedWeddingDate {
  const defaultDate = { day: "Minggu", date: "14", monthYear: "Februari 2027" };
  
  if (!dateString) return defaultDate;

  try {
    const d = new Date(dateString);
    if (isNaN(d.getTime())) return defaultDate;

    const days = ["Minggu", "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"];
    const months = [
      "Januari", "Februari", "Maret", "April", "Mei", "Juni", 
      "Juli", "Agustus", "September", "Oktober", "November", "Desember"
    ];

    return {
      day: days[d.getDay()] || "Minggu",
      date: d.getDate().toString() || "14",
      monthYear: `${months[d.getMonth()]} ${d.getFullYear()}` || "Februari 2027"
    };
  } catch (e) {
    return defaultDate;
  }
}
