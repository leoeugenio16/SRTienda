"use client";

import { useState, useEffect } from "react";
import ProductCard from "../../components/ProductCard";

const PAGE_SIZE = 10;

export default function ProductosPage() {
  const [productos, setProductos] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [page, setPage] = useState(1);
  const [sort, setSort] = useState("createdAt:desc");
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  // Obtener categorías
  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_STRAPI_URL}/api/categories`)
      .then((res) => res.json())
      .then((data) => setCategorias(data.data || []));
  }, []);

  // Obtener productos
  useEffect(() => {
    setLoading(true);

    let url = `${process.env.NEXT_PUBLIC_STRAPI_URL}/api/products?populate=images&sort=${encodeURIComponent(
      sort
    )}&pagination[page]=${page}&pagination[pageSize]=${PAGE_SIZE}`;

    if (selectedCategory) {
      url += `&filters[category][slug][$eq]=${selectedCategory}`;
    }

    if (search) {
      url += `&filters[$or][0][title][$containsi]=${search}&filters[$or][1][description][$containsi]=${search}`;
    }

    fetch(url)
      .then((res) => res.json())
      .then((data) => {
        if (page === 1) {
          setProductos(data.data);
        } else {
          setProductos((prev) => [...prev, ...data.data]);
        }

        setHasMore(data.data.length === PAGE_SIZE);
        setLoading(false);
      });
  }, [page, sort, selectedCategory, search]);

  const handleSortChange = (e) => {
    setSort(e.target.value);
    setPage(1);
  };

  const handleCategoryChange = (e) => {
    setSelectedCategory(e.target.value);
    setPage(1);
  };

  const handleSearchChange = (e) => {
    setSearch(e.target.value);
    setPage(1);
  };

  const handleLoadMore = () => {
    if (!loading && hasMore) {
      setPage((prev) => prev + 1);
    }
  };

  return (
  <section className="pt-20 p-6 max-w-7xl mx-auto">
    <div className="mb-8 flex flex-wrap gap-4 justify-center">
      <input
        type="text"
        value={search}
        onChange={handleSearchChange}
        placeholder="Buscar productos..."
        className="border border-gray-300 rounded-full px-4 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
      />

      <select
        value={selectedCategory}
        onChange={handleCategoryChange}
        className="border border-gray-300 rounded-full px-4 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
      >
        <option value="">Todas las categorías</option>
        {categorias.map((cat) => (
          <option key={cat.id} value={cat.slug}>
            {cat.name}
          </option>
        ))}
      </select>

      <select
        value={sort}
        onChange={handleSortChange}
        className="border border-gray-300 rounded-full px-4 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
      >
        <option value="createdAt:desc">Más nuevos</option>
        <option value="price_sale:asc">Precio menor</option>
        <option value="price_sale:desc">Precio mayor</option>
        <option value="title:asc">Nombre A-Z</option>
        <option value="title:desc">Nombre Z-A</option>
      </select>
    </div>

    <h1 className="text-3xl font-bold mb-6 text-center">Todos los productos</h1>

    {productos.length === 0 && !loading && (
      <p className="text-center text-gray-500">No se encontraron productos.</p>
    )}

    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
      {productos.map((product) => (
        <ProductCard key={product.documentId} product={product} />
      ))}
    </div>

    <div className="flex justify-center mt-6">
      {loading ? (
        <div className="loader" />
      ) : hasMore ? (
        <button
          onClick={handleLoadMore}
          className="bg-orange-500 text-white px-6 py-2 rounded-full hover:bg-orange-600 transition"
        >
          Ver más
        </button>
      ) : (
        <p className="text-gray-500">No hay más productos</p>
      )}
    </div>

    <style jsx>{`
      .loader {
        border: 4px solid #f3f3f3;
        border-top: 4px solid #fb923c;
        border-radius: 50%;
        width: 30px;
        height: 30px;
        animation: spin 1s linear infinite;
      }

      @keyframes spin {
        0% {
          transform: rotate(0deg);
        }
        100% {
          transform: rotate(360deg);
        }
      }
    `}</style>
  </section>
);

}
