"use client";

import { logout } from "@/app/login/actions";

export default function LogoutButton() {
  return (
    <button
      onClick={() => logout()}
      className="text-gray-400 hover:text-red-500 transition-colors p-2 rounded-full hover:bg-red-50"
      title="Keluar"
    >
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path>
      </svg>
    </button>
  );
}
