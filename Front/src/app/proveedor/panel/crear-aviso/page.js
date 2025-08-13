'use client';

import { useEffect, useState } from "react";
import CrearAvisoForm from "./CrearAvisoForm";
import Link from "next/link";

export default function CrearAvisoPage() {
  const baseUrl = process.env.NEXT_PUBLIC_STRAPI_URL;
  const [estado, setEstado] = useState("cargando");
  const [token, setToken] = useState(null);
  const [proveedorId, setProveedorId] = useState(null);
  const [tipoProveedor, setTipoProveedor] = useState(null);

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    if (!storedToken) {
      setEstado("sinSesion");
      return;
    }
    setToken(storedToken);

    (async () => {
      try {
        // 1) Usuario
        const resUser = await fetch(`${baseUrl}/api/users/me`, {
          headers: { Authorization: `Bearer ${storedToken}` },
        });
        if (!resUser.ok) throw new Error("Sesión inválida");
        const user = await resUser.json();

        // 2) Proveedor vinculado
        const resProv = await fetch(
          `${baseUrl}/api/providers?filters[user][documentId][$eq]=${user.documentId}`
        );
        const dataProv = await resProv.json();
        const proveedor = dataProv.data?.[0];

        if (!proveedor) {
          setEstado("sinProveedor");
          return;
        }

        setProveedorId(proveedor.documentId); // seguís usando documentId
        setTipoProveedor(proveedor.tipo || null);

        // 3) Solo Comunidades crean avisos
        if (proveedor.tipo !== "Comunidad") {
          setEstado("noComunidad");
          return;
        }

        setEstado("ok");
      } catch (err) {
        console.error("Error crear-aviso:", err);
        setEstado("error");
      }
    })();
  }, [baseUrl]);

  if (estado === "cargando") return <p className="p-6 text-center">Cargando...</p>;
  if (estado === "sinSesion") return <p className="p-6 text-red-600">Tenés que iniciar sesión.</p>;
  if (estado === "sinProveedor") return <p className="p-6 text-red-600">No tenés un proveedor asignado.</p>;
  if (estado === "error") return <p className="p-6 text-red-600">Ocurrió un error. Intentalo de nuevo.</p>;

  if (estado === "noComunidad") {
    return (
      <section className="pt-24 text-center">
        <h2 className="text-2xl font-bold mb-2 text-orange-600">Este proveedor no es Comunidad</h2>
        <p className="text-gray-700 mb-6">
          Los avisos comunitarios solo están habilitados para proveedores de tipo <b>Comunidad</b>.
        </p>
        <Link
          href="/proveedor/panel"
          className="inline-block bg-orange-500 text-white px-6 py-2 rounded-full font-medium hover:bg-orange-600 transition"
        >
          Volver al panel
        </Link>
      </section>
    );
  }

  // Estado OK → renderizar formulario
  return (
    <CrearAvisoForm
      baseUrl={baseUrl}
      token={token}
      proveedorId={proveedorId}
    />
  );
}
