"use client";
import { useState } from "react";

export default function ProductDetail({ product }) {
  const { id, title, slug, price_sale, description, images } = product;

  const imageList = images || [];
  const baseUrl = process.env.NEXT_PUBLIC_STRAPI_URL;
  const initialImage = imageList[0]?.url ? `${baseUrl}${imageList[0].url}` : "/placeholder.jpg";

  const [selectedImage, setSelectedImage] = useState(initialImage);

  const agregarAlCarrito = async () => {
    const token = localStorage.getItem("token");
    const carritoId = localStorage.getItem("carritoId");

    const imagen = imageList[0]?.url ? `${baseUrl}${imageList[0].url}` : "/placeholder.jpg";

    const nuevoProducto = {
      id,
      nombre: title,
      slug,
      precio: price_sale,
      imagen,
      cantidad: 1,
    };

    // 1. Actualizar localStorage
    const carritoActual = JSON.parse(localStorage.getItem("carrito")) || [];
    const yaExiste = carritoActual.find((p) => p.id === id);

    let nuevoCarrito;
    if (yaExiste) {
      nuevoCarrito = carritoActual.map((p) =>
        p.id === id ? { ...p, cantidad: p.cantidad + 1 } : p
      );
    } else {
      nuevoCarrito = [...carritoActual, nuevoProducto];
    }

    localStorage.setItem("carrito", JSON.stringify(nuevoCarrito));
    alert("Producto agregado al carrito ✅");

    // 2. Guardar o actualizar carrito en Strapi si usuario está logueado
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

        if (res.ok) {
          // Si se creó un carrito nuevo, guardar su ID
          if (!carritoId) {
            localStorage.setItem("carritoId", data.data.id);
          }
          console.log("🟢 Carrito guardado en Strapi:", data);
        } else {
          console.warn("⚠️ Error al guardar carrito en Strapi:", data);
        }
      } catch (error) {
        console.error("🔴 Error al conectar con Strapi:", error);
      }
    }
  };

  return (
    <section className="pt-20 p-6 max-w-5xl mx-auto">
      <div className="grid md:grid-cols-2 gap-6">
        {/* Bloque de imagen + miniaturas */}
        <div className="flex flex-col gap-4">
          {/* Imagen principal */}
          <img
            src={selectedImage}
            alt={title}
            className="w-full h-[400px] object-cover rounded-lg shadow"
          />

          {/* Miniaturas debajo */}
          <div className="flex gap-4 overflow-x-auto">
            {imageList.map((img, idx) => {
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
            href={`https://wa.me/5492625500165?text=Hola! Quiero comprar el producto: ${title}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block bg-green-600 text-white px-6 py-3 rounded hover:bg-green-700 transition mb-3"
          >
            Comprar por WhatsApp
          </a>

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
