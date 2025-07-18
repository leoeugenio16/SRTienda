"use client";

import { use, useState, useEffect } from "react";
import { useCart } from "../../context/CartContext";
import { getImageUrl } from "../../../utils/getImageUrl";

async function getSubcategoriesByCategory(slug) {
  const url = `${process.env.NEXT_PUBLIC_STRAPI_URL}/api/subcategories?filters[category][slug][$eq]=${slug}&populate=image`;
  const res = await fetch(url, { cache: "no-store" });
  if (!res.ok) {
    console.error("Error fetching subcategories:", await res.text());
    return [];
  }
  const data = await res.json();
  console.log("Subcategorías recibidas:", data);
  return Array.isArray(data.data) ? data.data : [];
}

async function getProductsByCategory(slug) {
  const url = `${process.env.NEXT_PUBLIC_STRAPI_URL}/api/products?filters[category][slug][$eq]=${slug}&populate[images][fields][0]=url&populate[provider][fields][0]=name&populate[provider][fields][1]=whatsapp&populate[provider][fields][2]=documentId`;
  const res = await fetch(url, { cache: "no-store" });
  if (!res.ok) {
    console.error("Error en la consulta:", await res.text());
    return [];
  }
  const data = await res.json();
  console.log("Productos recibidos:", data);
  return Array.isArray(data.data) ? data.data : [];
}

export default function CategoriaPage({ params }) {
  const { slug } = use(params)
  const [subcategorias, setSubcategorias] = useState([]);
  const [productos, setProductos] = useState([]);
  const { agregarProducto } = useCart();

  useEffect(() => {
    async function fetchData() {
      const [subs, prods] = await Promise.all([
        getSubcategoriesByCategory(slug),
        getProductsByCategory(slug),
      ]);
      console.log("Subcategorías guardadas en estado:", subs);
      console.log("Productos guardados en estado:", prods);
      setSubcategorias(subs || []);
      setProductos(prods || []);
    }
    fetchData();
  }, [slug]);

  const agregarAlCarrito = (producto) => {
    console.log("Producto a agregar:", producto);
    const nuevoProducto = {
      documentId: producto.documentId || producto.id,
      nombre: producto.title,
      precio: producto.price_sale,
      slug: producto.slug,
      imagen: getImageUrl(producto.images?.[0]),
      cantidad: 1,
      proveedorDocumentId: producto.provider?.documentId || null,
      proveedorNombre: producto.provider?.name || "Desconocido",
      proveedorWhatsapp: producto.provider?.whatsapp || "sin-numero",
    };
    agregarProducto(nuevoProducto);
    alert("Producto agregado al carrito ✅");
  };

  const categoriaFormateada = slug
    .replace(/-/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());

  return (
    <main className="bg-white text-gray-900 dark:bg-gray-900 dark:text-white min-h-screen">
      <section className="pt-20 p-6 max-w-6xl mx-auto text-center">
        <h1 className="text-4xl font-bold mb-6 capitalize text-orange-600">
          Categoría: {categoriaFormateada}
        </h1>

        {/* Mostrar subcategorías en círculos */}
        {subcategorias.length > 0 && (
          <div className="flex gap-4 justify-center mb-8 overflow-x-auto px-4">
            {subcategorias.map((sub) => {
              const { id, image, name } = sub;
              const imageUrl = getImageUrl(image);
              return (
                <div
                  key={id}
                  className="flex flex-col items-center flex-shrink-0 w-24 cursor-pointer"
                >
                  <div className="bg-white dark:bg-gray-800 rounded-full shadow p-3 w-20 h-20 flex items-center justify-center">
                    {imageUrl ? (
                      <img
                        src={imageUrl}
                        alt={name}
                        className="w-10 h-10 object-contain"
                      />
                    ) : (
                      <div className="w-10 h-10 bg-gray-200 dark:bg-gray-700 rounded-full" />
                    )}
                  </div>
                  <span className="mt-1 text-xs text-gray-800 dark:text-white text-center leading-tight break-words max-w-[5rem]">
                    {name}
                  </span>
                </div>
              );
            })}
          </div>
        )}

        {/* Productos */}
        {productos.length === 0 ? (
          <p className="text-gray-500 dark:text-gray-400 text-lg">
            No hay productos en esta categoría.
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {productos
              .filter((product) => product && !product.vendido)
              .map((prod) => {
                const { id, title, slug, price_sale, images, provider } = prod;
                const imageUrl = getImageUrl(images?.[0]);

                return (
                  <div
                    key={id}
                    className="border rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition flex flex-col bg-white dark:bg-gray-800"
                  >
                    <a href={`/productos/${slug}`}>
                      {imageUrl ? (
                        <img
                          src={imageUrl}
                          alt={title}
                          className="w-full h-60 object-cover"
                        />
                      ) : (
                        <div className="w-full h-60 bg-gray-200 dark:bg-gray-700" />
                      )}
                    </a>

                    <div className="p-4 flex-1 flex flex-col justify-between">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100">
                          {title}
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          ${price_sale.toLocaleString()}
                        </p>
                      </div>

                      <button
                        onClick={() => agregarAlCarrito(prod)}
                        className="mt-4 bg-orange-500 text-white py-2 rounded-full hover:bg-orange-600 transition font-semibold"
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
    </main>
  );
}
