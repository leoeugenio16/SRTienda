"use client";

import { use, useState, useEffect } from "react";
import { useCart } from "../../context/CartContext"; // ✅ Importar useCart

async function getProductsByCategory(slug) {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_STRAPI_URL}/api/products?filters[category][slug][$eq]=${slug}&populate=images`,
    { cache: "no-store" }
  );
  const data = await res.json();
  return data.data;
}

export default function CategoriaPage({ params }) {
  const { slug } = use(params);
  const [productos, setProductos] = useState([]);
  const { agregarProducto } = useCart(); // ✅ Tomar función del contexto

  useEffect(() => {
    async function fetchData() {
      const productosFiltrados = await getProductsByCategory(slug);
      setProductos(productosFiltrados);
    }
    fetchData();
  }, [slug]);

  const agregarAlCarrito = (producto) => {
    const baseUrl = process.env.NEXT_PUBLIC_STRAPI_URL;

    const nuevoProducto = {
      documentId: producto.documentId,
      nombre: producto.title,
      precio: producto.price_sale,
      slug: producto.slug,
      imagen: producto.images?.[0]?.url
        ? `${baseUrl}${producto.images[0].url}`
        : "/placeholder.jpg",
      cantidad: 1,
    };

    agregarProducto(nuevoProducto); // ✅ usar el contexto
    alert("Producto agregado al carrito ✅");
  };

  return (
    <section className="pt-20 p-6 max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold mb-6 text-center capitalize">
        Categoría: {slug}
      </h1>

      {productos.length === 0 ? (
        <p className="text-center text-gray-500">
          No hay productos en esta categoría.
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {productos.map((prod) => {
            const { id, title, slug, price_sale, images } = prod;
            const imageUrl = images?.[0]?.url
              ? `${process.env.NEXT_PUBLIC_STRAPI_URL}${images[0].url}`
              : "/placeholder.jpg";

            return (
              <div
                key={id}
                className="border rounded-lg overflow-hidden shadow hover:shadow-lg transition flex flex-col"
              >
                <a href={`/productos/${slug}`}>
                  <img
                    src={imageUrl}
                    alt={title}
                    className="w-full h-60 object-cover"
                  />
                </a>

                <div className="p-4 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="text-lg font-semibold">{title}</h3>
                    <p className="text-sm text-gray-600">
                      ${price_sale.toLocaleString()}
                    </p>
                  </div>

                  <button
                    onClick={() => agregarAlCarrito(prod)}
                    className="mt-4 bg-black text-white py-2 rounded hover:bg-gray-800 transition"
                  >
                    Agregar al carrito
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}
