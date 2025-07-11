"use client";

import { useCart } from "../app/context/CartContext";

export default function AgregarAlCarritoButton({ producto }) {
  const { agregarProducto } = useCart();

  const handleAgregar = () => {
    if (!producto) return;

    const baseUrl = process.env.NEXT_PUBLIC_STRAPI_URL;
    const imagen = producto.images?.[0]?.url
      ? `${baseUrl}${producto.images[0].url}`
      : "/placeholder.jpg";

    const nuevoProducto = {
      documentId: producto.documentId || producto.id || null,
      nombre: producto.title,
      precio: producto.price_sale || 0,
      slug: producto.slug,
      imagen,
      cantidad: 1,
      proveedorDocumentId:
        producto.provider?.documentId || producto.proveedorDocumentId || null,
      proveedorNombre: producto.provider?.name || "Desconocido",
      proveedorWhatsapp: producto.provider?.whatsapp || "sin-numero",
    };

    agregarProducto(nuevoProducto);
    alert("Producto agregado al carrito ✅");
  };

  return (
    <button
      onClick={handleAgregar}
      className="mt-4 bg-black text-white py-2 px-4 rounded hover:bg-gray-800 transition"
    >
      Agregar al carrito
    </button>
  );
}
