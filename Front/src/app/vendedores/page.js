"use client";

import { useEffect, useState } from "react";
import ProviderCard from "../../components/ProviderCard";

export default function VendedoresPage() {
  const [vendedores, setVendedores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const fetchVendedores = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_STRAPI_URL}/api/providers?populate=image&sort=name:asc`
        );
        const data = await res.json();
        setVendedores(data.data || []);
      } catch (err) {
        console.error("Error al cargar vendedores", err);
      } finally {
        setLoading(false);
      }
    };

    fetchVendedores();
  }, []);

  const vendedoresFiltrados = vendedores.filter((v) =>
    v.name?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <section className="pt-20 px-6 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-center">Nuestros Vendedores</h1>

      <div className="flex justify-center mb-6">
        <input
          type="text"
          placeholder="Buscar vendedor..."
          className="border px-4 py-2 rounded w-full max-w-md"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {loading ? (
        <p className="text-center">Cargando...</p>
      ) : vendedoresFiltrados.length === 0 ? (
        <p className="text-center">No se encontraron vendedores.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {vendedoresFiltrados.map((v) => (
            <ProviderCard key={v.id} provider={v} />
          ))}
        </div>
      )}
    </section>
  );
}
