# Panduan Integrasi Midtrans untuk Undangin

Ikuti langkah-langkah di bawah ini untuk mengaktifkan sistem pembayaran otomatis di aplikasi Undangin Anda.

## 1. Registrasi Akun Midtrans
1.  Buka [Midtrans.com](https://midtrans.com) dan klik **Daftar Sekarang**.
2.  Pilih tipe akun **Individual** (untuk perorangan menggunakan KTP) atau **Business** (jika sudah punya CV/PT).
3.  Lengkapi formulir pendaftaran dan verifikasi email Anda.

## 2. Proses Verifikasi (KYC)
1.  Masuk ke **Midtrans Dashboard**.
2.  Lengkapi data identitas (KTP & NPWP jika ada).
3.  **Penting:** Daftarkan nomor rekening bank Anda di menu **Settings > Payouts**. Ini adalah rekening tujuan Midtrans mengirimkan uang dari pembeli Anda.

## 3. Mendapatkan API Keys
1.  Di sidebar Dashboard, pastikan Anda berada di mode **Production** (atau **Sandbox** untuk uji coba).
2.  Klik menu **Settings > Access Keys**.
3.  Anda akan melihat:
    *   **Client Key**: Digunakan di sisi frontend (aman untuk publik).
    *   **Server Key**: Digunakan di sisi backend (**Rahasia!** Jangan pernah bagikan).

## 4. Konfigurasi di Vercel / .env
Tambahkan variabel berikut ke dalam file `.env.local` atau di dashboard **Environment Variables** Vercel Anda:

```env
# Ambil dari Dashboard Midtrans > Access Keys
NEXT_PUBLIC_MIDTRANS_CLIENT_KEY=your_client_key_here
MIDTRANS_SERVER_KEY=your_server_key_here

# Mode: 'production' atau 'sandbox'
MIDTRANS_IS_PRODUCTION=false
```

## 5. Cara Kerja Pembayaran
1.  **User Membayar**: Tamu memilih paket dan membayar melalui Gopay/QRIS/Virtual Account.
2.  **Midtrans Menampung**: Uang masuk ke saldo Midtrans Anda secara aman.
3.  **Settlement (Pencairan)**: Midtrans akan mentransfer otomatis saldo tersebut ke rekening bank terdaftar Anda setiap hari (atau sesuai jadwal yang Anda pilih di dashboard).

> [!IMPORTANT]
> Selalu simpan **Server Key** dengan aman. Midtrans sangat aman karena sudah berlisensi Bank Indonesia dan menggunakan standar enkripsi perbankan internasional.
