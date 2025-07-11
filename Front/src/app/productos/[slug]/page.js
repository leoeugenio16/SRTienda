"use client";

import { use, useState, useEffect } from "react";
import { useCart } from "../../context/CartContext";

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
      const firstImageUrl =
        prod?.images?.[0]?.url
          ? `${process.env.NEXT_PUBLIC_STRAPI_URL}${prod.images[0].url}`
          : "/placeholder.jpg";

      setSelectedImage(firstImageUrl);
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
    const imagen = selectedImage || "/placeholder.jpg";

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
    <section className="pt-20 p-6 max-w-5xl mx-auto">
      <div className="grid md:grid-cols-2 gap-6">
        {/* Imagen + miniaturas */}
        <div className="flex flex-col gap-4">
          <img
            src={selectedImage}
            alt={title}
            className="w-full h-[400px] object-cover rounded-lg shadow"
          />

          <div className="flex gap-4 overflow-x-auto">
            {images.map((img, idx) => {
              const url = `${baseUrl}${img.url}`;
              return (
                <img
                  key={idx}
                  src={url}
                  alt={`Miniatura ${idx + 1}`}
                  onClick={() => setSelectedImage(url)}
                  className={`h-20 w-20 object-cover cursor-pointer border rounded hover:scale-105 transition ${
                    selectedImage === url ? "ring-2 ring-black" : ""
                  }`}
                />
              );
            })}
          </div>
        </div>

        {/* Info */}
        <div>
          <h1 className="text-3xl font-bold mb-2">{title}</h1>
          <p className="text-xl text-gray-700 mb-4">${price_sale.toLocaleString()}</p>
          <p className="text-gray-600 mb-6">{description}</p>

          {/* Botón WhatsApp */}
          <a
            href={`https://wa.me/${provider?.whatsapp || "5492625500165"}?text=${encodeURIComponent(
              `Hola! Quiero comprar el producto: ${title}`
            )}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block bg-green-600 text-white px-6 py-3 rounded hover:bg-green-700 transition mb-3"
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
                className="w-full border px-3 py-2 rounded mb-2"
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
            className="block w-full mt-2 bg-black text-white px-6 py-3 rounded hover:bg-gray-800 transition"
          >
            Agregar al carrito
          </button>
        </div>
      </div>
    </section>
  );
}
