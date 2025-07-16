"use client";

import { useState, useEffect, use } from "react";
import { getImageUrl } from "../../../utils/getImageUrl"; // Ajustá esta ruta

export default function EventoSlugPage({ params }) {
  const { slug } = use(params);

  const [evento, setEvento] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(null);

  useEffect(() => {
    async function fetchEvento() {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_STRAPI_URL}/api/eventos?filters[slug][$eq]=${slug}&populate=images`
        );
        if (!res.ok) throw new Error("Error fetching evento");
        const data = await res.json();
        if (!data.data || data.data.length === 0)
          throw new Error("Evento no encontrado");

        const item = data.data[0];
        const images = item.images || [];

        setEvento({
          ...item,
          images,
        });

        if (images.length > 0) {
          setSelectedImage(images[0]);
        }

        setLoading(false);
      } catch (error) {
        console.error(error);
        setLoading(false);
      }
    }
    fetchEvento();
  }, [slug]);

  if (loading) return <p>Cargando...</p>;
  if (!evento) return <p>Evento no encontrado.</p>;

  const { title, description, price_sale, images } = evento;

  return (
    <section className="pt-20 p-6 max-w-6xl mx-auto bg-white dark:bg-gray-900 text-gray-900 dark:text-white">
      <div className="grid md:grid-cols-2 gap-8">
        {/* Imagen principal + miniaturas */}
        <div className="flex flex-col gap-4">
          <img
            src={getImageUrl(selectedImage) || "/placeholder.jpg"}
            alt={title}
            className="w-full h-[300px] md:h-[400px] object-cover rounded-xl shadow-lg"
          />
          {images.length > 1 && (
            <div className="flex gap-4 overflow-x-auto">
              {images.map((img, idx) => {
                const url = getImageUrl(img);
                return (
                  <img
                    key={idx}
                    src={url}
                    alt={`Miniatura ${idx + 1}`}
                    onClick={() => setSelectedImage(img)}
                    className={`h-20 w-20 object-cover cursor-pointer border rounded-lg hover:scale-105 transition-transform duration-200 ${
                      getImageUrl(selectedImage) === url
                        ? "ring-2 ring-orange-500"
                        : ""
                    }`}
                  />
                );
              })}
            </div>
          )}
        </div>

        {/* Información y botones */}
        <div className="flex flex-col">
          <h1 className="text-4xl font-bold text-orange-600 mb-2">{title}</h1>

          <p className="text-2xl text-gray-700 dark:text-gray-200 font-semibold mb-4">
            ${price_sale.toLocaleString()}
          </p>

          <p className="text-gray-600 dark:text-gray-300 mb-6 leading-relaxed">
            {description}
          </p>

          {/* Botón Comprar por WhatsApp */}
          <a
            href={`https://wa.me/${
              evento.provider?.whatsapp || "5492625500165"
            }?text=${encodeURIComponent(
              `Hola! Quiero comprar el producto: ${title}`
            )}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block w-full bg-green-600 text-white px-6 py-3 rounded-full text-center font-medium hover:bg-green-700 transition mb-4"
          >
            Comprar por WhatsApp
          </a>
        </div>
      </div>
    </section>
  );
}
