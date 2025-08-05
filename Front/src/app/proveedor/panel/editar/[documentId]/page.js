"use client";

import EditarProductoForm from "./EditarProductoForm";
import { use, useEffect, useState } from "react";

export default function EditarProductoPage({ params }) {
  const { documentId } = use(params);
  const baseUrl = process.env.NEXT_PUBLIC_STRAPI_URL;

  const [producto, setProducto] = useState(null);
  const [error, setError] = useState(null);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    async function fetchProducto() {
      if (!documentId) {
        setError("Falta el documentId en la URL.");
        setCargando(false);
        return;
      }
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setError("No autorizado. Debe iniciar sesión.");
          setCargando(false);
          return;
        }

        const url = `${baseUrl}/api/products?filters[documentId][$eq]=${documentId}&populate[provider]=true&populate[images]=true`;

        const res = await fetch(url, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          cache: "no-store",
        });

        if (!res.ok) throw new Error("Error al obtener producto");

        const data = await res.json();
        const prod = data.data?.[0];

        if (!prod) {
          setError("Producto no encontrado.");
          setCargando(false);
          return;
        }

        setProducto(prod);
      } catch (err) {
        setError(err.message);
      } finally {
        setCargando(false);
      }
    }

    fetchProducto();
  }, [documentId, baseUrl]);

  if (cargando) return <p className="p-6 text-center">Cargando producto...</p>;
  if (error) return <p className="p-6 text-red-600">{error}</p>;
  if (!producto) return null;

  return <EditarProductoForm producto={producto} baseUrl={baseUrl} />;
}
