"use client";

import { useState } from "react";
import { toast } from "sonner";
import { deleteGuestbookEntry } from "@/app/api/guestbook/delete/actions";
import ConfirmModal from "@/components/ui/ConfirmModal";

export default function GuestTable({ guests, slug }: { guests: any[], slug: string }) {
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const downloadCSV = () => {
    const headers = ["Nama", "Kehadiran", "Pesan", "Tanggal"];
    const rows = guests.map(g => [
      `"${(g.name || "").replace(/"/g, '""')}"`,
      `"${(g.attendance || "").replace(/"/g, '""')}"`,
      `"${(g.message || "").replace(/"/g, '""')}"`,
      `"${new Date(g.created_at).toLocaleDateString("id-ID")}"`
    ].map(val => {
      const v = val.replace(/^"/, '').replace(/"$/, '');
      if (v.startsWith('=') || v.startsWith('+') || v.startsWith('-') || v.startsWith('@')) {
        return `"'${v}"`;
      }
      return val;
    }));

    const csvContent = [headers, ...rows].map(e => e.join(",")).join("\n");
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `Data_Tamu_${slug}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("File CSV berhasil diunduh");
  };

  const handleDelete = async () => {
    if (!deletingId) return;
    const res = await deleteGuestbookEntry(deletingId, slug);
    if (res.success) {
      toast.success("Data tamu berhasil dihapus");
      setDeletingId(null);
      setTimeout(() => window.location.reload(), 1000);
    } else {
      toast.error("Gagal menghapus data");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-end">
        <button 
          onClick={downloadCSV}
          className="flex items-center gap-2 bg-wedding-sage text-white px-6 py-3 rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-gray-800 transition-all shadow-lg shadow-wedding-sage/20"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path></svg>
          Download CSV
        </button>
      </div>

      <div className="overflow-x-auto rounded-2xl border border-gray-100">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-100">
              <th className="p-4 text-[10px] font-bold uppercase tracking-widest text-gray-400">Nama Tamu</th>
              <th className="p-4 text-[10px] font-bold uppercase tracking-widest text-gray-400">Status</th>
              <th className="p-4 text-[10px] font-bold uppercase tracking-widest text-gray-400">Ucapan</th>
              <th className="p-4 text-[10px] font-bold uppercase tracking-widest text-gray-400">Tanggal</th>
              <th className="p-4 text-[10px] font-bold uppercase tracking-widest text-gray-400 text-center">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {guests.length > 0 ? guests.map((guest) => (
              <tr key={guest.id} className="hover:bg-gray-50/50 transition-colors">
                <td className="p-4">
                  <p className="font-bold text-gray-800">{guest.name}</p>
                </td>
                <td className="p-4">
                  <span className={`text-[10px] font-bold uppercase tracking-widest px-2 py-1 rounded-md ${
                    guest.attendance === 'Hadir' ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-500'
                  }`}>
                    {guest.attendance}
                  </span>
                </td>
                <td className="p-4 max-w-xs">
                  <p className="text-sm text-gray-600 line-clamp-2 italic">"{guest.message}"</p>
                </td>
                <td className="p-4">
                  <p className="text-xs text-gray-400">
                    {new Date(guest.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </p>
                </td>
                <td className="p-4 text-center">
                  <button 
                    onClick={() => setDeletingId(guest.id)}
                    className="p-2 text-red-400 hover:text-red-600 transition-colors"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                  </button>
                </td>
              </tr>
            )) : (
              <tr>
                <td colSpan={5} className="p-12 text-center text-gray-400 italic">Belum ada data tamu.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <ConfirmModal 
        isOpen={!!deletingId}
        title="Hapus Data Tamu?"
        message="Data yang dihapus tidak dapat dipulihkan. Lanjutkan?"
        onConfirm={handleDelete}
        onCancel={() => setDeletingId(null)}
        confirmLabel="Hapus"
        isDanger
      />
    </div>
  );
}
