import Link from "next/link";
import { login, signup } from "./actions";

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-md w-full bg-white p-8 rounded-2xl shadow-xl border border-gray-100">
        <div className="text-center mb-10">
          <div className="w-12 h-12 bg-wedding-gold rounded-full flex items-center justify-center text-white font-bold font-serif mx-auto mb-4 text-xl">U</div>
          <h1 className="font-serif text-3xl text-wedding-text mb-2">Masuk ke Dasbor</h1>
          <p className="text-gray-500 text-sm">Kelola undangan digital Anda dari satu tempat.</p>
        </div>

        <form className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
            <input 
              name="email"
              type="email" 
              placeholder="nama@email.com" 
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-wedding-gold focus:ring-2 focus:ring-wedding-gold/20 outline-none transition-all"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
            <input 
              name="password"
              type="password" 
              placeholder="••••••••" 
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-wedding-gold focus:ring-2 focus:ring-wedding-gold/20 outline-none transition-all"
              required
            />
          </div>
          
          <div className="flex flex-col gap-3">
            <button formAction={login} className="w-full py-4 bg-wedding-text text-white rounded-xl font-bold hover:bg-wedding-gold transition-colors uppercase tracking-widest text-sm shadow-lg hover:shadow-wedding-gold/30">
              Masuk
            </button>
            <button formAction={signup} className="w-full py-4 border border-wedding-gold text-wedding-gold rounded-xl font-bold hover:bg-wedding-gold/10 transition-colors uppercase tracking-widest text-sm">
              Daftar Baru
            </button>
          </div>
        </form>

      </div>
    </div>
  );
}
