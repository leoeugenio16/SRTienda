"use client";

import { useState, useEffect, use } from "react";

// ✅ Mostrar imagen o video sin recortes
function MediaDisplay({ media, isMain = false, onClick, selected }) {
  if (!media || !media.url) return null;
  const isVideo = media.mime?.startsWith("video/");
  
  const commonProps = {
    onClick,
    className: isMain
      ? "w-full h-full object-contain bg-white rounded-xl shadow-lg"
      : `h-20 w-20 object-contain cursor-pointer border rounded-lg hover:scale-105 transition-all duration-200 ${
          selected ? "ring-2 ring-orange-500" : ""
        }`,
  };

  return isVideo ? (
    <video
      src={media.url}
      autoPlay
      loop
      muted
      playsInline
      {...commonProps}
    />
  ) : (
    <img
      src={media.url}
      alt={media.alternativeText || "media"}
      {...commonProps}
    />
  );
}

async function getNoticeBySlug(slug) {
  const base = `${process.env.NEXT_PUBLIC_STRAPI_URL}/api/avisos-comunitarios?filters[slug][$eq]=${slug}&populate=imagenes`;
  const secret = process.env.NEXT_PUBLIC_ENTREGA_SECRET; // 👈 igual que en el otro
  const url = secret ? `${base}&secret=${encodeURIComponent(secret)}` : base;

  const res = await fetch(url, { cache: "no-store" });
  if (!res.ok) {
    console.error("Error fetching notice:", await res.text());
    return null;
  }

  const data = await res.json();
  return data.data?.[0] || null;
}

export default function NoticePage({ params }) {
  const { slug } = use(params);
  const [notice, setNotice] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);

  useEffect(() => {
    async function fetchNotice() {
      const noticeData = await getNoticeBySlug(slug);
      setNotice(noticeData);
      setSelectedImage(noticeData?.imagenes?.[0]);
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
        {/* Imagen o video principal */}
        <div className="flex flex-col gap-4">
          <div className="relative w-full h-[400px]">
            <MediaDisplay media={selectedImage} isMain />
          </div>

          {/* Miniaturas */}
          <div className="flex gap-4 overflow-x-auto">
            {imagenes.map((img, idx) => (
              <MediaDisplay
                key={idx}
                media={img}
                selected={selectedImage?.url === img.url}
                onClick={() => setSelectedImage(img)}
              />
            ))}
          </div>
        </div>

        {/* Info */}
        <div>
          <h1 className="text-4xl font-bold text-orange-600 mb-2">{titulo}</h1>
          <p className="text-2xl text-gray-700 font-semibold mb-4">{estado}</p>
          <p className="text-gray-600 mb-6 leading-relaxed whitespace-pre-line">
            {descripcion}
          </p>

          {link_whatsapp && (
            <a
              href={link_whatsapp}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block w-full bg-green-600 text-white px-6 py-3 rounded-full text-center font-medium hover:bg-green-700 transition mb-4"
            >
              Contactar por WhatsApp
            </a>
          )}

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
