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
  return Array.isArray(data.data) ? data.data : [];
}

async function getProductsByCategory(slug) {
  const url = `${process.env.NEXT_PUBLIC_STRAPI_URL}/api/products?filters[category][slug][$eq]=${slug}&populate[images][fields][0]=url&populate[provider][fields][0]=name&populate[provider][fields][1]=whatsapp&populate[provider][fields][2]=documentId&populate[subcategory][fields][0]=name`;
  const res = await fetch(url, { cache: "no-store" });
  if (!res.ok) {
    console.error("Error en la consulta:", await res.text());
    return [];
  }
  const data = await res.json();
  return Array.isArray(data.data) ? data.data : [];
}

export default function CategoriaPage({ params }) {
  const { slug } = use(params);
  const [subcategorias, setSubcategorias] = useState([]);
  const [selectedSubcategory, setSelectedSubcategory] = useState("");
  const [productos, setProductos] = useState([]);
  const { agregarProducto } = useCart();

  useEffect(() => {
    async function fetchData() {
      const [subs, prods] = await Promise.all([
        getSubcategoriesByCategory(slug),
        getProductsByCategory(slug),
      ]);
      setSubcategorias(subs || []);
      setProductos(prods || []);
    }
    fetchData();
  }, [slug]);

  const agregarAlCarrito = (producto) => {
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

  const productosFiltrados = selectedSubcategory
    ? productos.filter(
        (p) => p.subcategory?.id === parseInt(selectedSubcategory)
      )
    : productos;

  return (
    <main className="bg-white text-gray-900 dark:bg-gray-900 dark:text-white min-h-screen">
      <section className="pt-20 p-6 max-w-6xl mx-auto text-center">
        <h1 className="text-4xl font-bold mb-6 capitalize text-orange-600">
          {categoriaFormateada}
        </h1>

        {/* FILTRO DE SUBCATEGORÍA */}
        {subcategorias.length > 0 && (
          <div className="mb-6">
            <select
              value={selectedSubcategory}
              onChange={(e) => setSelectedSubcategory(e.target.value)}
              className="bg-white text-gray-900 dark:bg-gray-800 dark:text-white border border-gray-300 dark:border-gray-600 rounded-full px-4 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
            >
              <option value="">Todas las subcategorías</option>
              {subcategorias.map((sub) => (
                <option key={sub.id} value={sub.id}>
                  {sub.name}
                </option>
              ))}
            </select>
          </div>
        )}


        {/* LISTADO DE PRODUCTOS */}
        {productosFiltrados.length === 0 ? (
          <p className="text-gray-500 dark:text-gray-400 text-lg">
            No hay productos en esta subcategoría.
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {productosFiltrados
              .filter((product) => product && !product.vendido)
              .map((prod) => {
                const { id, title, slug, price_sale, images } = prod;
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