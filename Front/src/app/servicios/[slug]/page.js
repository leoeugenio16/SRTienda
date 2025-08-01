"use client";

import { useState, useEffect, use } from "react";
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

  return (
    <section className="pt-20 px-4 bg-white text-gray-900 dark:bg-gray-900 dark:text-white">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-orange-600 mb-6 text-center">
          {title}
        </h1>

        <div className="flex flex-col md:flex-row items-center md:items-start gap-6 mb-8">
          {/* Imagen o video principal */}
          {selectedImage && (
            <div className="w-60 h-60 rounded shadow overflow-hidden">
              <MediaDisplay media={selectedImage} />
            </div>
          )}

          {/* Info a la derecha */}
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

        {/* Miniaturas de imágenes */}
        {images.length > 1 && (
          <div className="flex gap-4 overflow-x-auto mb-8">
            {images.map((img, idx) => (
              <div
                key={idx}
                className={`w-20 h-20 rounded shadow overflow-hidden ${
                  selectedImage === img ? "ring-2 ring-orange-500" : ""
                }`}
                onClick={() => setSelectedImage(img)}
              >
                <MediaDisplay media={img} />
              </div>
            ))}
          </div>
        )}

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
        <button
          onClick={handleAgregarAlCarrito}
          className="block w-full mt-4 bg-orange-500 text-white px-6 py-3 rounded-full hover:bg-orange-600 transition"
        >
          Agregar al carrito
        </button>
      </div>
    </section>
  );
}