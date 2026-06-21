'use client';

import { useState } from "react";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <>
      <nav className="sticky top-0 z-50 w-full flex items-center justify-between px-6 py-4 text-white bg-transparent backdrop-blur-xl border-b border-white/10">

        {/* LEFT */}
        <a 
          href="/alerts"
          className="hidden md:block px-5 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 hover:scale-105 hover:shadow-lg hover:shadow-blue-500/30 transition-all duration-300 animate-pulseSlow"
        >
          Criar Alerta
        </a>

        {/* DESKTOP */}
        <div className="hidden md:flex items-center gap-6 text-sm">
          <a href="/home" className="hover:text-blue-400 transition">Home</a>
          <a href="/profile" className="hover:text-blue-400 transition">Perfil</a>
          <a href="/aboutus" className="hover:text-blue-400 transition">Sobre nós</a>
          <a href="/settings" className="bg-white/10 backdrop-blur-md px-4 py-2 rounded-xl border border-white/10 hover:bg-white/20 transition">
            Definições
          </a>
        </div>

        {/* MOBILE BUTTON */}
        <button 
          onClick={() => setMenuOpen(!menuOpen)}
          className="md:hidden text-3xl"
        >
          ☰
        </button>

        <h1 className="text-2xl gradient">
          Neigh Safe
        </h1>

      </nav>

      {/* MOBILE MENU */}
      {menuOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xl z-40 flex flex-col items-center justify-center gap-6 text-white text-xl">
          <a href="/home" onClick={() => setMenuOpen(false)}>Home</a>
          <a href="/profile" onClick={() => setMenuOpen(false)}>Perfil</a>
          <a href="/aboutus" onClick={() => setMenuOpen(false)}>Sobre nós</a>
          <a href="/settings" onClick={() => setMenuOpen(false)}>Definições</a>
        </div>
      )}
    </>
  );
}