"use client";

import UnsplashPicker from "./UnsplashPicker";

interface UnsplashWrapperProps {
  label: string;
  inputId: string;
}

export default function UnsplashWrapper({ label, inputId }: UnsplashWrapperProps) {
  return (
    <>
      <UnsplashPicker 
        label={label} 
        onSelect={(url) => {
          const input = document.getElementById(inputId) as HTMLInputElement;
          if (input) {
            input.value = url;
            // Opsional: Kamu bisa tambah alert atau toast di sini kalau mau
            console.log(`Foto ${label} dipilih:`, url);
          }
        }} 
      />
      <input type="hidden" name={inputId} id={inputId} />
    </>
  );
}
