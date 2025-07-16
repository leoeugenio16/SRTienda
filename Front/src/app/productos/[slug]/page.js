"use client";

import { use, useState, useEffect } from "react";
import { useCart } from "../../context/CartContext";
import { getImageUrl } from "../../../utils/getImageUrl";

async function getProductBySlug(slug) {
  const url = `${process.env.NEXT_PUBLIC_STRAPI_URL}/api/products?filters[slug][$eq]=${slug}&populate[images][fields][0]=url&populate[provider][fields][0]=name&populate[provider][fields][1]=whatsapp&populate[provider][fields][2]=documentId`;

  const res = await fetch(url, { cache: "no-store" });
  if (!res.ok) {
    console.error("Error en la consulta producto:", await res.text());
    return null;
  }
  const data = await res.json();
  return data.data?.[0] || null;
}

export default function ProductPage({ params }) {
  const { slug } = use(params);
  const [producto, setProducto] = useState(null);
  const { agregarProducto } = useCart();

  // Precio sugerido para el input
  const [precioSugerido, setPrecioSugerido] = useState("");

  // Imagen seleccionada para mostrar
  const [selectedImage, setSelectedImage] = useState(null);

  useEffect(() => {
    async function fetchProducto() {
      const prod = await getProductBySlug(slug);
      setProducto(prod);

      // Seteo imagen inicial si hay imágenes
      setSelectedImage(getImageUrl(prod?.images?.[0]));
    }
    fetchProducto();
  }, [slug]);

  if (!producto) {
    return <div className="p-6 text-center">Producto no encontrado</div>;
  }

  const {
    id,
    documentId,
    title,
    slug: prodSlug,
    price_sale,
    description,
    images = [],
    provider,
    permitirSugerirPrecio,
  } = producto;

  const baseUrl = process.env.NEXT_PUBLIC_STRAPI_URL;

  const agregarAlCarrito = async () => {
    const imagen = selectedImage || getImageUrl(images?.[0]);

    const nuevoProducto = {
      documentId: documentId || id,
      nombre: title,
      slug: prodSlug,
      precio: price_sale,
      imagen,
      cantidad: 1,
      proveedorDocumentId: provider?.documentId || null,
      proveedorNombre: provider?.name || "Desconocido",
      proveedorWhatsapp: provider?.whatsapp || "sin-numero",
    };

    // Actualizo carrito local
    const carritoActual = JSON.parse(localStorage.getItem("carrito")) || [];
    const yaExiste = carritoActual.find((p) => p.documentId === nuevoProducto.documentId);

    let nuevoCarrito;
    if (yaExiste) {
      nuevoCarrito = carritoActual.map((p) =>
        p.documentId === nuevoProducto.documentId
          ? { ...p, cantidad: p.cantidad + 1 }
          : p
      );
    } else {
      nuevoCarrito = [...carritoActual, nuevoProducto];
    }

    localStorage.setItem("carrito", JSON.stringify(nuevoCarrito));
    alert("Producto agregado al carrito ✅");

    // Guardar en Strapi si está logueado
    const token = localStorage.getItem("token");
    const carritoId = localStorage.getItem("carritoId");

    if (token) {
      try {
        const payload = {
          data: {
            items_json: JSON.stringify(nuevoCarrito),
          },
        };

        const url = carritoId
          ? `${baseUrl}/api/carts/${carritoId}`
          : `${baseUrl}/api/carts`;

        const method = carritoId ? "PUT" : "POST";

        const res = await fetch(url, {
          method,
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(payload),
        });

        const data = await res.json();

        if (!carritoId && res.ok) {
          localStorage.setItem("carritoId", data.data.id);
        }
      } catch (error) {
        console.error("🔴 Error al conectar con Strapi:", error);
      }
    }
  };

  const handleEnviarSugerencia = () => {
    if (!precioSugerido) return alert("Por favor, ingresá un precio");

    const mensaje = `Hola! Quiero sugerir un precio para el producto *${title}*. Mi sugerencia es $${precioSugerido}.`;
    const numero = provider?.whatsapp || "5492625500165"; // Si no tiene whatsapp, usá número default
    const url = `https://wa.me/${numero}?text=${encodeURIComponent(mensaje)}`;
    window.open(url, "_blank");
  };

  return (
    <section className="pt-20 p-6 max-w-6xl mx-auto bg-white text-gray-900">
      <div className="grid md:grid-cols-2 gap-8">
        {/* Imagen + miniaturas */}
        <div className="flex flex-col gap-4">
          <img
            src={selectedImage}
            alt={title}
            className="w-full h-[400px] object-contain bg-white rounded-xl shadow-lg"
          />

          <div className="flex gap-4 overflow-x-auto">
            {images.map((img, idx) => {
              const url = getImageUrl(img);
              return (
                <img
                  key={idx}
                  src={url}
                  alt={`Miniatura ${idx + 1}`}
                  onClick={() => setSelectedImage(url)}
                  className={`h-20 w-20 object-cover cursor-pointer border rounded-lg hover:scale-105 transition-all duration-200 ${selectedImage === url ? "ring-2 ring-orange-500" : ""
                    }`}
                />
              );
            })}
          </div>
        </div>

        {/* Info */}
        <div>
          <h1 className="text-4xl font-bold text-orange-600 mb-2">{title}</h1>
          <p className="text-2xl text-gray-700 font-semibold mb-4">
            ${price_sale.toLocaleString()}
          </p>
          <p className="text-gray-600 mb-6 leading-relaxed">{description}</p>

          {/* Botón WhatsApp */}
          <a
            href={`https://wa.me/${provider?.whatsapp || "5492625500165"}?text=${encodeURIComponent(
              `Hola! Quiero comprar el producto: ${title}`
            )}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block w-full bg-green-600 text-white px-6 py-3 rounded-full text-center font-medium hover:bg-green-700 transition mb-4"
          >
            Comprar por WhatsApp
          </a>

          {/* Sugerir precio (si está habilitado) */}
          {permitirSugerirPrecio && (
            <div className="mt-6">
              <h2 className="font-semibold text-gray-800 mb-2">
                ¿Querés sugerir un precio?
              </h2>
              <input
                type="number"
                placeholder="Escribí tu sugerencia"
                value={precioSugerido}
                onChange={(e) => setPrecioSugerido(e.target.value)}
                className="w-full border border-gray-300 px-3 py-2 rounded mb-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
              <button
                onClick={handleEnviarSugerencia}
                className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600 transition w-full"
              >
                Enviar sugerencia por WhatsApp
              </button>
            </div>
          )}

          {/* Botón Agregar al Carrito */}
          <button
            onClick={agregarAlCarrito}
            className="block w-full mt-4 bg-orange-500 text-white px-6 py-3 rounded-full hover:bg-orange-600 transition"
          >
            Agregar al carrito
          </button>
        </div>
      </div>
    </section>
  );

}
