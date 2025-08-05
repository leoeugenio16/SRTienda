"use client";

import { getImageUrl } from "../../utils/getImageUrl";
import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import {
  ShoppingCart,
  Home,
  Boxes,
  FolderOpen,
  CalendarDays,
  User,
  Clock1,
  Wrench,
  Phone,
  PersonStanding,
} from "lucide-react";
import Image from "next/image";

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
    fetch(
      `${process.env.NEXT_PUBLIC_STRAPI_URL}/api/banners?filters[active][$eq]=true&sort=order:asc&populate[desktopImage][fields][0]=url&populate[mobileImage][fields][0]=url`
    )
      .then((res) => res.json())
      .then((data) => {
        if (data.data && Array.isArray(data.data)) {
          const parsed = data.data
            .map((item) => {
              const desktop = getImageUrl(item.desktopImage);
              const mobile = Array.isArray(item.mobileImage)
                ? getImageUrl(item.mobileImage[0])
                : getImageUrl(item.mobileImage);

              return {
                id: item.id || null,
                name: item.name || "Banner sin nombre",
                link: item.link || "#",
                desktopImage: desktop,
                mobileImage: mobile,
              };
            })
            .filter((banner) => banner.desktopImage || banner.mobileImage);
          setBanners(parsed);
        } else {
          console.warn(
            "No se encontraron datos válidos en la respuesta de la API de banners"
          );
          setBanners([]);
        }
      })
      .catch((error) => {
        console.error("Error al obtener banners:", error);
        setBanners([]);
      });
  }, []);

  // Carrusel automático
  // Carrusel automático
  useEffect(() => {
    if (banners.length === 0) return;

    intervalRef.current = setInterval(() => {
      setBannerIndex((prev) => (prev + 1) % banners.length);
    }, 5000);

    return () => clearInterval(intervalRef.current);
  }, [banners]);

  const goToPrevious = () => {
    setBannerIndex((prev) =>
      prev === 0 ? banners.length - 1 : prev - 1
    );
  };
  const goToNext = () => {
    setBannerIndex((prev) => (prev + 1) % banners.length);
  };

  const currentBanner = banners[bannerIndex];

  const cerrarSesion = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    localStorage.removeItem("carrito");
    setUsuario(null);
  };

  return (
    <>
      <header
        className="bg-white shadow-md fixed w-full z-50 top-0 left-0"
        style={{ height: 64 }}
      >
        <div
          className="max-w-7xl mx-auto px-6 flex justify-between items-center"
          style={{ height: 64 }}
        >
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 ml-[-12px]">
            <Image
              src="/logo.png"
              alt="Logo SRTienda"
              height={100}
              width={100}
              priority
            />
          </Link>

          {/* Menú escritorio */}
          <nav className="hidden md:flex gap-8 items-center text-sm font-semibold text-orange-600">
            <Link
              href="/categorias"
              className="flex items-center gap-1 hover:text-orange-700 transition"
            >
              <FolderOpen className="w-5 h-5" />
              Categorías
            </Link>
            {/* <Link
              href="/productos"
              className="flex items-center gap-1 hover:text-orange-700 transition"
            >
              <Boxes className="w-5 h-5" />
              Productos
            </Link> */}
            <Link
              href="/servicios"
              className="flex items-center gap-1 hover:text-orange-700 transition"
            >
              <Wrench className="w-5 h-5" />
              Servicios
            </Link>

            {/* <Link
              href="/particulares"
              className="flex items-center gap-1 hover:text-orange-700 transition"
            >
              <Clock1 className="w-5 h-5" />
              Ventas Unicas
            </Link> */}
            <Link
              href="/vendedores"
              className="flex items-center gap-1 hover:text-orange-700 transition"
            >
              <User className="w-5 h-5" />
              Vendedores
            </Link>
            <Link
              href="/eventos"
              className="flex items-center gap-1 hover:text-orange-700 transition"
            >
              <CalendarDays className="w-5 h-5" />
              Eventos
            </Link>
            <Link
              href="servicios-comunitarios"
              className="flex items-center gap-1 hover:text-orange-700 transition"
            >
              <PersonStanding className="w-5 h-5" />
              Comunidad
            </Link>
            <Link
              href="/contacto"
              className="flex items-center gap-1 hover:text-orange-700 transition"
            >
              <Phone className="w-5 h-5" />
              Contactanos
            </Link>

            <Link
              href="/carrito"
              className="flex items-center gap-1 hover:text-orange-700 transition"
            >
              <ShoppingCart className="w-5 h-5" />
            </Link>

            {usuario ? (
              <>
                <div className="flex flex-col items-start text-orange-700 font-medium">
                  <span>
                    Hola, {usuario.username}
                  </span>
                  <Link
                    href={`/proveedor/panel`}
                    className="text-sm text-blue-600 hover:underline"
                  >
                    Ver panel
                  </Link>
                </div>
                <button
                  onClick={cerrarSesion}
                  className="text-red-600 text-sm hover:underline ml-2"
                  aria-label="Cerrar sesión"
                >
                  Cerrar sesión
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className="hover:text-orange-700 transition"
                >
                  Iniciar sesión
                </Link>
                {/* <Link
                  href="/registro"
                  className="hover:text-orange-700 transition"
                >
                  Registrarse
                </Link> */}
              </>
            )}
          </nav>

          {/* Botón hamburguesa para móvil */}
          <button
            className="md:hidden focus:outline-none"
            aria-label="Toggle menu"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            <div className="space-y-1">
              <span
                className={`block w-6 h-0.5 rounded bg-orange-600 transition-transform ${menuOpen ? "rotate-45 translate-y-1.5" : ""
                  }`}
              />
              <span
                className={`block w-6 h-0.5 rounded bg-orange-600 transition-opacity ${menuOpen ? "opacity-0" : "opacity-100"
                  }`}
              />
              <span
                className={`block w-6 h-0.5 rounded bg-orange-600 transition-transform ${menuOpen ? "-rotate-45 -translate-y-1.5" : ""
                  }`}
              />
            </div>
          </button>
        </div>

        {/* Menú móvil */}

        {menuOpen && (

          <div className="md:hidden bg-white px-6 pb-6 shadow-md border-t border-orange-200">
            {usuario ? (
              <>
                <div className="flex flex-col items-start text-orange-700 font-medium">
                  <span>
                    Hola, {usuario.username}
                  </span>
                  <Link
                    href={`/proveedor/panel`}
                    className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition"
                    onClick={() => setMenuOpen(false)}
                  >
                    Ver panel
                  </Link>
                </div>
                <button
                  onClick={() => {
                    cerrarSesion();
                    setMenuOpen(false);
                  }}
                  className="bg-red-600 text-white py-2 px-4 rounded hover:bg-red-700 transition"
                >
                  Cerrar sesión
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className="block py-3 text-orange-600 hover:text-orange-700 transition font-medium"
                  onClick={() => setMenuOpen(false)}
                >
                  Iniciar sesión
                </Link>
                {/* <Link
                  href="/registro"
                  className="block py-3 text-orange-600 hover:text-orange-700 transition font-medium"
                  onClick={() => setMenuOpen(false)}
                >
                  Registrarse
                </Link> */}
              </>
            )}
            <Link
              href="/"
              className="block py-3 flex items-center gap-2 text-orange-600 hover:text-orange-700 transition font-medium"
              onClick={() => setMenuOpen(false)}
            >
              <Home className="w-5 h-5" />
              Inicio
            </Link>
            <Link
              href="/productos"
              className="block py-3 flex items-center gap-2 text-orange-600 hover:text-orange-700 transition font-medium"
              onClick={() => setMenuOpen(false)}
            >
              <Boxes className="w-5 h-5" />
              Productos
            </Link>
            <Link
              href="/servicios"
              className="block py-3 flex items-center gap-2 text-orange-600 hover:text-orange-700 transition font-medium"
              onClick={() => setMenuOpen(false)}
            >
              <Wrench className="w-5 h-5" />
              Servicios
            </Link>
            <Link
              href="/categorias"
              className="block py-3 flex items-center gap-2 text-orange-600 hover:text-orange-700 transition font-medium"
              onClick={() => setMenuOpen(false)}
            >
              <FolderOpen className="w-5 h-5" />
              Categorías
            </Link>
            <Link
              href="/particulares"
              className="block py-3 flex items-center gap-2 text-orange-600 hover:text-orange-700 transition font-medium"
            >
              <Clock1 className="w-5 h-5" />
              Ventas Unicas
            </Link>
            <Link
              href="/vendedores"
              className="block py-3 flex items-center gap-2 text-orange-600 hover:text-orange-700 transition font-medium"
            >
              <User className="w-5 h-5" />
              Vendedores
            </Link>

            <Link
              href="/eventos"
              className="block py-3 flex items-center gap-2 text-orange-600 hover:text-orange-700 transition font-medium"
            >
              <CalendarDays className="w-5 h-5" />
              Eventos
            </Link>
            <Link
              href="servicios-comunitarios"
              className="block py-3 flex items-center gap-2 text-orange-600 hover:text-orange-700 transition font-medium"
            >
              <PersonStanding className="w-5 h-5" />
              Comunidad 
            </Link>
            <Link
              href="/contacto"
              className="block py-3 flex items-center gap-2 text-orange-600 hover:text-orange-700 transition font-medium"
            >
              <Phone className="w-5 h-5" />
              Contactanos
            </Link>
            <Link
              href="/carrito"
              className="block py-3 flex items-center gap-2 text-orange-600 hover:text-orange-700 transition font-medium"
              onClick={() => setMenuOpen(false)}
            >
              <ShoppingCart className="w-5 h-5" />
              Carrito
            </Link>


          </div>
        )}
      </header>
      <div className="h-16" />

      {/* Banner debajo del navbar */}
      
    </>
  );
}
