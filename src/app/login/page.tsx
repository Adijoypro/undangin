import Link from "next/link";
import { login, signup } from "./actions";
import LoginButtons from "./LoginButtons";

export default async function LoginPage({ searchParams }: { searchParams: Promise<{ message?: string }> }) {
  const { message } = await searchParams;
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-md w-full bg-white p-8 rounded-2xl shadow-xl border border-gray-100">
        <div className="text-center mb-10">
          <div className="w-12 h-12 bg-wedding-gold rounded-full flex items-center justify-center text-white font-bold font-serif mx-auto mb-4 text-xl">U</div>
          <h1 className="font-serif text-3xl text-wedding-text mb-2">Masuk ke Dasbor</h1>
          <p className="text-gray-500 text-sm">Kelola undangan digital Anda dari satu tempat.</p>
        </div>

        {message && (
          <div className="mb-6 p-4 bg-red-50 border border-red-100 text-red-600 text-xs rounded-xl text-center font-bold">
            {message === "Could not authenticate user" ? "Email atau password salah." : message}
          </div>
        )}

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
          
          <LoginButtons />
        </form>

      </div>
    </div>
  );
}
