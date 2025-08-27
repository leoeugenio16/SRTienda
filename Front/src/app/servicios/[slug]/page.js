"use client";

import { useState, useEffect, use, useRef } from "react";
import { useCart } from "../../context/CartContext";
import { getImageUrl } from "../../../utils/getImageUrl";

async function getServicioBySlug(slug) {
  const url = `${process.env.NEXT_PUBLIC_STRAPI_URL}/api/servicios?filters[slug][$eq]=${slug}&populate=images&populate=provider`;
  const res = await fetch(url, { cache: "no-store" });
  const data = await res.json();
  return data.data?.[0] || null;
}

// Componente para mostrar imagen o video
function MediaDisplay({ media }) {
  if (!media || !media.url) return null;
  const isVideo = media.mime?.startsWith("video/");
  return (
    <div className="w-full h-full">
      {isVideo ? (
        <video
          src={media.url}
          className="w-full h-full object-cover"
          autoPlay
          loop
          muted
          playsInline
        />
      ) : (
        <img
          src={media.url}
          alt={media.alternativeText || "media"}
          className="w-full h-full object-cover"
        />
      )}
    </div>
  );
}

export default function ServicioPage({ params }) {
  const { slug } = use(params);
  const [servicio, setServicio] = useState(null);
  const { agregarProducto } = useCart();
  const [selectedImage, setSelectedImage] = useState(null);
  const thumbRef = useRef(null);

  useEffect(() => {
    async function fetchServicio() {
      const data = await getServicioBySlug(slug);
      setServicio(data);
      setSelectedImage(data?.images?.[0]);
    }
    fetchServicio();
  }, [slug]);

  if (!servicio)
    return <div className="p-6 text-center">Cargando servicio...</div>;

  const {
    documentId,
    title,
    descripcion,
    precio_aproximado,
    images = [],
    provider,
  } = servicio;

  const handleAgregarAlCarrito = () => {
    const nuevoItem = {
      documentId,
      nombre: title,
      slug,
      precio: precio_aproximado || "Consultar",
      imagen: getImageUrl(selectedImage),
      cantidad: 1,
      proveedorDocumentId: provider?.documentId || null,
      proveedorNombre: provider?.name || "Desconocido",
      proveedorWhatsapp: provider?.whatsapp || "",
    };

    agregarProducto(nuevoItem);
    alert("Servicio agregado al carrito ");
  };

  // helper para scroll de miniaturas
  const scrollThumbs = (delta) => {
    if (thumbRef.current) {
      thumbRef.current.scrollBy({ left: delta, behavior: "smooth" });
    }
  };

  return (
    <section className="pt-20 px-4 bg-white text-gray-900 dark:bg-gray-900 dark:text-white">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-orange-600 mb-6 text-center">
          {title}
        </h1>

        {/* Contenedor principal: imagen+thumbnails a la izquierda, info a la derecha */}
        <div className="flex flex-col md:flex-row items-start gap-6 mb-8">
          {/* Columna izquierda */}
          <div className="w-full md:w-72">
            {/* Imagen/video principal */}
            {selectedImage && (
              <div className="w-full aspect-square rounded shadow overflow-hidden">
                <MediaDisplay media={selectedImage} />
              </div>
            )}

            {/* Miniaturas scrolleables debajo de la imagen */}
            {images.length > 1 && (
              <div className="mt-4 relative">
                {/* Botón Izquierda (solo desktop) */}
                <button
                  type="button"
                  aria-label="Desplazar miniaturas a la izquierda"
                  onClick={() => scrollThumbs(-240)}
                  className="hidden md:flex absolute left-0 top-1/2 -translate-y-1/2 z-10 px-2 py-1 rounded-full bg-white/80 dark:bg-black/40 shadow hover:scale-105"
                >
                  ‹
                </button>

                {/* Tira scrolleable */}
                <div
                  ref={thumbRef}
                  className="flex gap-3 overflow-x-auto scroll-smooth snap-x snap-mandatory py-1 px-1"
                >
                  {images.map((img, idx) => {
                    const isSelected = selectedImage === img;
                    return (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setSelectedImage(img)}
                        className={`flex-shrink-0 w-20 h-20 md:w-20 md:h-20 rounded shadow overflow-hidden snap-start focus:outline-none ${isSelected ? "ring-2 ring-orange-500" : ""
                          }`}
                        aria-label={`Miniatura ${idx + 1}`}
                      >
                        <MediaDisplay media={img} />
                      </button>
                    );
                  })}
                </div>

                {/* Botón Derecha (solo desktop) */}
                <button
                  type="button"
                  aria-label="Desplazar miniaturas a la derecha"
                  onClick={() => scrollThumbs(240)}
                  className="hidden md:flex absolute right-0 top-1/2 -translate-y-1/2 z-10 px-2 py-1 rounded-full bg-white/80 dark:bg-black/40 shadow hover:scale-105"
                >
                  ›
                </button>

                {/* Gradientes laterales como pista visual */}
                <div className="pointer-events-none absolute inset-y-0 left-0 w-8 bg-gradient-to-r from-white dark:from-gray-900 to-transparent"></div>
                <div className="pointer-events-none absolute inset-y-0 right-0 w-8 bg-gradient-to-l from-white dark:from-gray-900 to-transparent"></div>
              </div>
            )}
          </div>

          {/* Columna derecha: info */}
          <div className="flex-1">
            <p className="mb-4 text-lg leading-relaxed break-words whitespace-pre-line">
              {descripcion}
            </p>

            <p className="text-gray-700 dark:text-gray-300 mb-2">
              <strong>Precio aproximado:</strong>{" "}
              {precio_aproximado || "Consultar"}
            </p>

            {provider?.name && (
              <div className="flex items-center gap-3 mb-4">
                {provider?.image && (
                  <a
                    href={`/proveedor/${provider.slug || ""}`}
                    className="flex-shrink-0"
                  >
                    <img
                      src={getImageUrl(provider.image)}
                      alt={provider.name}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                  </a>
                )}

                <a
                  href={`/vendedores/${provider.slug || ""}`}
                  className="text-sm font-medium text-orange-600 hover:underline"
                >
                  {provider.name}
                </a>
              </div>
            )}
          </div>
        </div>

        {/* Botón de WhatsApp */}
        {provider?.whatsapp && (
          <div className="text-center">
            <a
              href={`https://wa.me/${provider.whatsapp}?text=${encodeURIComponent(
                `Hola! Quiero consultar por el servicio: ${title}`
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block bg-green-600 text-white px-6 py-3 rounded-full font-medium hover:bg-green-700 transition mb-4"
            >
              Consultar por WhatsApp
            </a>
          </div>
        )}

        {/* Botón Agregar al Carrito */}
        {/*  <button
          onClick={handleAgregarAlCarrito}
          className="block w-full mt-4 bg-orange-500 text-white px-6 py-3 rounded-full hover:bg-orange-600 transition"
        >
          Agregar al carrito
        </button> */}
      </div>
    </section>
  );
}
