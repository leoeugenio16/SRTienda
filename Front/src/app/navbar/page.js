"use client";

import Link from "next/link";
import { useState } from "react";
import { ShoppingCart } from "lucide-react";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="bg-white shadow-md fixed w-full z-50 top-0 left-0">
      <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
        {/* Logo */}
        <Link href="/" className="text-xl font-bold text-black">
          SRTienda
        </Link>

        {/* Menú escritorio */}
        <nav className="hidden md:flex gap-6 text-sm font-medium text-gray-800">
          <Link href="/">Inicio</Link>
          <Link href="/productos">Productos</Link>
          <Link href="/categorias/general">Categorías</Link>
          <Link href="/carrito" className="flex items-center gap-1">
            <ShoppingCart className="w-4 h-4" />
            Carrito
          </Link>
        </nav>

        {/* Botón menú móvil */}
        <button
          className="md:hidden focus:outline-none"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          <div className="space-y-1">
            <span className="block w-5 h-0.5 bg-black"></span>
            <span className="block w-5 h-0.5 bg-black"></span>
            <span className="block w-5 h-0.5 bg-black"></span>
          </div>
        </button>
      </div>

      {/* Menú móvil */}
      {menuOpen && (
        <div className="md:hidden bg-white px-4 pb-4 shadow-md">
          <Link href="/" className="block py-2">Inicio</Link>
          <Link href="../productos" className="block py-2">Productos</Link>
          <Link href="/categorias/general" className="block py-2">Categorías</Link>
          <Link href="/carrito" className="block py-2 flex items-center gap-1">
            <ShoppingCart className="w-4 h-4" />
            Carrito
          </Link>
        </div>
      )}
    </header>
  );
}
