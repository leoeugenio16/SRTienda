"use client";

import Link from "next/link";
import { useEffect, useState, useRef } from "react";
import { ShoppingCart } from "lucide-react";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [usuario, setUsuario] = useState(null);
  const [banners, setBanners] = useState([]);
  const [bannerIndex, setBannerIndex] = useState(0);
  const intervalRef = useRef(null);
  const [isMobile, setIsMobile] = useState(false);

  // Detectar si es móvil
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth <= 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Obtener usuario
  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData) {
      setUsuario(JSON.parse(userData));
    }
  }, []);

  // Obtener banners
  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_STRAPI_URL}/api/banners?filters[active][$eq]=true&sort=order:asc&populate[desktopImage][fields][0]=url&populate[mobileImage][fields][0]=url`)
      .then((res) => res.json())
      .then((data) => {
        console.log("Respuesta de la API de banners:", JSON.stringify(data, null, 2));
        if (data.data && Array.isArray(data.data)) {
          const parsed = data.data.map((item) => {
            console.log("Procesando banner:", item);
            const desktop = item.desktopImage?.url
              ? `${process.env.NEXT_PUBLIC_STRAPI_URL}${item.desktopImage.url}`
              : null;
            const mobile = item.mobileImage?.[0]?.url
              ? `${process.env.NEXT_PUBLIC_STRAPI_URL}${item.mobileImage[0].url}`
              : null;

            console.log("URLs generadas:", { desktop, mobile });

            return {
              id: item.id || null,
              name: item.name || "Banner sin nombre",
              link: item.link || "#",
              desktopImage: desktop,
              mobileImage: mobile,
            };
          }).filter((banner) => banner.desktopImage || banner.mobileImage);

          console.log("Banners procesados:", parsed);
          setBanners(parsed);
        } else {
          console.warn("No se encontraron datos válidos en la respuesta de la API de banners");
          setBanners([]);
        }
      })
      .catch((error) => {
        console.error("Error al obtener banners:", error);
        setBanners([]);
      });
  }, []);

  // Carrusel automático
  useEffect(() => {
    if (banners.length === 0) return;
    intervalRef.current = setInterval(() => {
      setBannerIndex((prev) => (prev + 1) % banners.length);
    }, 5000);
    return () => clearInterval(intervalRef.current);
  }, [banners]);

  const cerrarSesion = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    localStorage.removeItem("carrito");
    setUsuario(null);
  };

  return (
    <>
      <header className="bg-white shadow-md fixed w-full z-50 top-0 left-0" style={{ height: 64 }}>
        <div className="max-w-7xl mx-auto px-4 flex justify-between items-center" style={{ height: 64 }}>
          <Link href="/" className="text-lg font-bold text-black">SRTienda</Link>
  
          <nav className="hidden md:flex gap-6 items-center text-sm font-medium text-black">
            <Link href="/" className="text-black">Inicio</Link>
            <Link href="/productos" className="text-black">Productos</Link>
            <Link href="/categorias" className="text-black">Categorías</Link>
            <Link href="/vendedores" className="text-black">Vendedores</Link>
            <Link href="/carrito" className="flex items-center gap-1 text-black">
              <ShoppingCart className="w-4 h-4" />
              Carrito
            </Link>
            {/* {usuario ? (
              <>
                <span className="text-black">Hola, {usuario.username}</span>
                <button onClick={cerrarSesion} className="text-red-500 text-sm hover:underline">
                  Cerrar sesión
                </button>
              </>
            ) : (
              <>
                <Link href="/login" className="text-black hover:underline">Iniciar sesión</Link>
                <Link href="/registro" className="text-black hover:underline">Registrarse</Link>
              </>
            )} */}
          </nav>
  
          <button className="md:hidden focus:outline-none" onClick={() => setMenuOpen(!menuOpen)}>
            <div className="space-y-1">
              <span className="block w-5 h-0.5 bg-black" />
              <span className="block w-5 h-0.5 bg-black" />
              <span className="block w-5 h-0.5 bg-black" />
            </div>
          </button>
        </div>
  
        {menuOpen && (
          <div className="md:hidden bg-white px-4 pb-4 shadow-md">
            <Link href="/" className="block py-2 text-black">Inicio</Link>
            <Link href="/productos" className="block py-2 text-black">Productos</Link>
            <Link href="/categorias" className="block py-2 text-black">Categorías</Link>
            <Link href="/vendedores" className="block py-2 text-black">Vendedores</Link>
            <Link href="/carrito" className="block py-2 flex items-center gap-1 text-black">
              <ShoppingCart className="w-4 h-4" />
              Carrito
            </Link>
            {/* {usuario ? (
              <>
                <p className="py-2 text-black">Hola, {usuario.username}</p>
                <button onClick={cerrarSesion} className="text-red-500 py-2 text-sm hover:underline">
                  Cerrar sesión
                </button>
              </>
            ) : (
              <>
                <Link href="/login" className="block py-2 text-black hover:underline">Iniciar sesión</Link>
                <Link href="/registro" className="block py-2 text-black hover:underline">Registrarse</Link>
              </>
            )} */}
          </div>
        )}
      </header>
  
      {/* Banner debajo del navbar */}
      <div className="w-full z-40 overflow-hidden" style={{ marginTop: 64, height: 192 }}>
        {banners.length > 0 && (
          <a
            href={banners[bannerIndex].link || "#"}
            target="_blank"
            rel="noopener noreferrer"
            className="block w-full h-full"
          >
            {(isMobile ? banners[bannerIndex].mobileImage : banners[bannerIndex].desktopImage) && (
              <img
                src={isMobile ? banners[bannerIndex].mobileImage : banners[bannerIndex].desktopImage}
                alt={banners[bannerIndex].name || "Banner"}
                className="w-full h-full object-cover transition-opacity duration-1000"
                key={banners[bannerIndex].id}
                loading="lazy"
              />
            )}
          </a>
        )}
      </div>
    </>
  );
  
  
}