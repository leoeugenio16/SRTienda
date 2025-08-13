"use client";

import EditarAvisoForm from "./EditarAvisoForm";
import { use, useEffect, useState } from "react";

export default function EditarAvisoPage({ params }) {
  const { documentId } = use(params);
  const baseUrl = process.env.NEXT_PUBLIC_STRAPI_URL;

  const [aviso, setAviso] = useState(null);
  const [error, setError] = useState(null);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    async function fetchAviso() {
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

        const url = `${baseUrl}/api/avisos-comunitarios?filters[documentId][$eq]=${documentId}&populate[publicado_por]=true&populate[imagenes]=true`;

        const res = await fetch(url, {
          headers: { Authorization: `Bearer ${token}` },
          cache: "no-store",
        });

        if (!res.ok) throw new Error("Error al obtener aviso");

        const data = await res.json();
        const av = data.data?.[0];

        if (!av) {
          setError("Aviso no encontrado.");
          setCargando(false);
          return;
        }

        setAviso(av);
      } catch (err) {
        setError(err.message);
      } finally {
        setCargando(false);
      }
    }

    fetchAviso();
  }, [documentId, baseUrl]);

  if (cargando) return <p className="p-6 text-center">Cargando aviso...</p>;
  if (error) return <p className="p-6 text-red-600">{error}</p>;
  if (!aviso) return null;

  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;

  return <EditarAvisoForm aviso={aviso} baseUrl={baseUrl} token={token} />;
}
