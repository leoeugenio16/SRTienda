"use client";

import Link from "next/link";
import { Instagram, MessageCircle } from "lucide-react";

export default function ProviderCard({ provider }) {
  const {
    name,
    slug,
    sobreNosotros,
    image,
    whatsapp,
    instagram,
  } = provider;

  const imageUrl =
  provider.image && provider.image.length > 0
    ? `${process.env.NEXT_PUBLIC_STRAPI_URL}${provider.image[0].url}`
    : "/placeholder.jpg";

  return (
    <div className="bg-white rounded-xl shadow hover:shadow-lg overflow-hidden transition">
      <Link href={`/vendedores/${slug}`}>
        <img
          src={imageUrl}
          alt={name}
          className="w-full h-48 object-contain bg-gray-100 p-4"
        />
      </Link>

      <div className="p-4">
        <h2 className="text-lg font-semibold mb-2 text-center">{name}</h2>

        {sobreNosotros && (
          <p className="text-sm text-gray-700 text-center mb-3">
            {sobreNosotros.length > 100
              ? sobreNosotros.slice(0, 100) + "..."
              : sobreNosotros}
          </p>
        )}

        <div className="flex justify-center gap-3 mt-2">
          {whatsapp && (
            <a
              href={`https://wa.me/${whatsapp.replace(/\D/g, "")}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 px-3 py-1 text-sm bg-green-500 text-white rounded hover:bg-green-600 transition"
            >
              <MessageCircle size={16} />
              WhatsApp
            </a>
          )}
          {instagram && (
            <a
              href={`https://instagram.com/${instagram.replace("@", "")}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 px-3 py-1 text-sm bg-pink-500 text-white rounded hover:bg-pink-600 transition"
            >
              <Instagram size={16} />
              Instagram
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
