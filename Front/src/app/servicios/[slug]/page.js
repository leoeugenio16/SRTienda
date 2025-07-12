"use client";

import { useState, useEffect, use } from "react";
import { useCart } from "../../context/CartContext";

async function getServicioBySlug(slug) {
  const url = `${process.env.NEXT_PUBLIC_STRAPI_URL}/api/servicios?filters[slug][$eq]=${slug}&populate=images&populate=provider`;
  const res = await fetch(url, { cache: "no-store" });
  const data = await res.json();
  return data.data?.[0] || null;
}

export default function ServicioPage({ params }) {
  const { slug } = use(params);
  const [servicio, setServicio] = useState(null);
  const { agregarProducto } = useCart();

  useEffect(() => {
    async function fetchServicio() {
      const data = await getServicioBySlug(slug);
      setServicio(data);
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

  const imagenPrincipal = images?.[0]?.url
    ? `${process.env.NEXT_PUBLIC_STRAPI_URL}${images[0].url}`
    : "/placeholder.jpg";

  const handleAgregarAlCarrito = () => {
    const nuevoItem = {
      documentId,
      nombre: title,
      slug,
      precio: precio_aproximado || "Consultar",
      imagen: imagenPrincipal,
      cantidad: 1,
      proveedorDocumentId: provider?.documentId || null,
      proveedorNombre: provider?.name || "Desconocido",
      proveedorWhatsapp: provider?.whatsapp || "",
    };

    agregarProducto(nuevoItem);
    alert("Servicio agregado al carrito ✅");
  };

  return (
    <section className="pt-20 px-4 bg-white text-gray-900 dark:bg-gray-900 dark:text-white">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-orange-600 mb-6 text-center">
          {title}
        </h1>

        {/* Contenedor principal con imagen y detalles */}
        <div className="flex flex-col md:flex-row items-center md:items-start gap-6 mb-8">
          {/* Imagen principal */}
          {images.length > 0 && (
            <img
              src={`${process.env.NEXT_PUBLIC_STRAPI_URL}${images[0].url}`}
              alt="Imagen principal"
              className="w-60 h-60 object-cover rounded shadow"
            />
          )}

          {/* Info a la derecha */}
          <div className="flex-1">
            <p className="mb-4 text-lg leading-relaxed break-words">
              {descripcion}
            </p>

            <p className="text-gray-700 dark:text-gray-300 mb-2">
              <strong>Precio aproximado:</strong>{" "}
              {precio_aproximado || "Consultar"}
            </p>

            {provider?.name && (
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                Proveedor: {provider.name}
              </p>
            )}
          </div>
        </div>

        {/* Botón centrado */}
        {provider?.whatsapp && (
          <div className="text-center">
            <a
              href={`https://wa.me/${
                provider.whatsapp
              }?text=${encodeURIComponent(
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
      </div>
    </section>
  );
}
