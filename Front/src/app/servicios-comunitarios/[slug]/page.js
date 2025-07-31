"use client";

import { useState, useEffect } from "react";

async function getNoticeBySlug(slug) {
  const url = `${process.env.NEXT_PUBLIC_STRAPI_URL}/api/avisos-comunitarios?filters[slug][$eq]=${slug}&populate[imagenes][fields][0]=url`;
  
  const res = await fetch(url, { cache: "no-store" });
  if (!res.ok) {
    console.error("Error fetching notice:", await res.text());
    return null;
  }

  const data = await res.json();
  return data.data?.[0] || null;
}

export default function NoticePage({ params }) {
  const { slug } = params;
  const [notice, setNotice] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);

  useEffect(() => {
    async function fetchNotice() {
      const noticeData = await getNoticeBySlug(slug);
      setNotice(noticeData);
      setSelectedImage(noticeData?.imagenes?.[0]?.url);
    }
    fetchNotice();
  }, [slug]);

  if (!notice) {
    return <div className="p-6 text-center">Notice not found</div>;
  }

  const {
    titulo,
    descripcion,
    link_whatsapp,
    link_pagina,
    estado,
    imagenes = [],
  } = notice;

  return (
    <section className="pt-20 p-6 max-w-6xl mx-auto bg-white text-gray-900">
      <div className="grid md:grid-cols-2 gap-8">
        {/* Images */}
        <div className="flex flex-col gap-4">
          <div className="relative w-full h-[400px]">
            <img
              src={selectedImage}
              alt={titulo}
              className="w-full h-full object-contain bg-white rounded-xl shadow-lg"
            />
          </div>

          <div className="flex gap-4 overflow-x-auto">
            {imagenes.map((img, idx) => (
              <img
                key={idx}
                src={img.url}
                alt={`Miniatura ${idx + 1}`}
                onClick={() => setSelectedImage(img.url)}
                className={`h-20 w-20 object-cover cursor-pointer border rounded-lg hover:scale-105 transition-all duration-200 ${
                  selectedImage === img.url ? "ring-2 ring-orange-500" : ""
                }`}
              />
            ))}
          </div>
        </div>

        {/* Notice Info */}
        <div>
          <h1 className="text-4xl font-bold text-orange-600 mb-2">{titulo}</h1>
          <p className="text-2xl text-gray-700 font-semibold mb-4">{estado}</p>
          <p className="text-gray-600 mb-6 leading-relaxed whitespace-pre-line">
            {descripcion}
          </p>

          {/* WhatsApp Link */}
          <a
            href={link_whatsapp}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block w-full bg-green-600 text-white px-6 py-3 rounded-full text-center font-medium hover:bg-green-700 transition mb-4"
          >
            Contactar por WhatsApp
          </a>

          {/* Page Link */}
          {link_pagina && (
            <a
              href={link_pagina}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block w-full bg-blue-600 text-white px-6 py-3 rounded-full text-center font-medium hover:bg-blue-700 transition"
            >
              Ver más en nuestra página
            </a>
          )}
        </div>
      </div>
    </section>
  );
}