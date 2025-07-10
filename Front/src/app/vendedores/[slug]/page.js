"use client";

import { useParams } from "next/navigation";
import { useState, useEffect } from "react";
import ProductCard from "../../../components/ProductCard";

const PAGE_SIZE = 10;

export default function VendedorPage() {
  const params = useParams();
  const slug = params.slug;

  const [productos, setProductos] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    setLoading(true);

    let url = `${process.env.NEXT_PUBLIC_STRAPI_URL}/api/products?populate=images&pagination[page]=${page}&pagination[pageSize]=${PAGE_SIZE}&filters[providers][slug][$eq]=${slug}`;

    fetch(url)
      .then(res => res.json())
      .then(data => {
        if (page === 1) setProductos(data.data);
        else setProductos(prev => [...prev, ...data.data]);

        setHasMore(data.data.length === PAGE_SIZE);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [page, slug]);

  const handleLoadMore = () => {
    if (!loading && hasMore) setPage(p => p + 1);
  };

  return (
    <section className="pt-20 p-6 max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold mb-6 text-center capitalize">
         {slug?.replace(/-/g, " ")}
      </h1>

      {productos.length === 0 && !loading && (
        <p className="text-center text-gray-500">Este vendedor aún no tiene productos.</p>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {productos.map((prod) => (
          <ProductCard key={prod.id} product={prod} />
        ))}
      </div>

      <div className="flex justify-center mt-6">
        {loading ? (
          <div className="loader" />
        ) : hasMore ? (
          <button
            onClick={handleLoadMore}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
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
          border-top: 4px solid #3498db;
          border-radius: 50%;
          width: 30px;
          height: 30px;
          animation: spin 1s linear infinite;
        }
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </section>
  );
}
