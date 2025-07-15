"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function PanelProveedor() {
  const [usuario, setUsuario] = useState(null);
  const [productos, setProductos] = useState([]);
  const [creditosDisponibles, setCreditosDisponibles] = useState(0);
  const [cargando, setCargando] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
      return;
    }

    async function cargarDatos() {
      try {
        // 1. Obtener usuario actual
        const resUser = await fetch(`${process.env.NEXT_PUBLIC_STRAPI_URL}/api/users/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!resUser.ok) throw new Error("Usuario no autorizado");

        const user = await resUser.json();
        setUsuario(user);

        // 2. Buscar proveedor vinculado al usuario
        const resProv = await fetch(
          `${process.env.NEXT_PUBLIC_STRAPI_URL}/api/providers?filters[user][documentId][$eq]=${user.documentId}`
        );
        const dataProv = await resProv.json();
        const proveedor = dataProv.data?.[0];

        if (!proveedor) throw new Error("Proveedor no encontrado");

        // 3. Buscar productos de ese proveedor
        const resProd = await fetch(
          `${process.env.NEXT_PUBLIC_STRAPI_URL}/api/products?filters[provider][id][$eq]=${proveedor.id}&populate=images`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const dataProd = await resProd.json();
        const productosPublicados = dataProd.data || [];

        setProductos(productosPublicados);

        // 4. Calcular créditos restantes
        const usados = productosPublicados.length;
        const disponibles = (user.credits ?? 0) - usados;
        setCreditosDisponibles(disponibles);

      } catch (err) {
        console.error("Error en panel proveedor:", err);
      } finally {
        setCargando(false);
      }
    }

    cargarDatos();
  }, []);

  if (cargando) return <p className="p-6 text-center">Cargando panel...</p>;
  if (!usuario) return null;

  return (
    <section className="pt-20 p-6 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold text-orange-600 mb-4 text-center">
        Panel de Control - {usuario.name || usuario.username}
      </h1>

      <div className="text-center mb-6">
        <p className="text-lg">
          Créditos disponibles:{" "}
          <span className="font-semibold text-orange-500">{creditosDisponibles}</span>
        </p>

        {creditosDisponibles > 0 ? (
          <Link
            href="/proveedor/panel/crear-producto"
            className="inline-block mt-4 bg-orange-500 text-white px-6 py-2 rounded-full font-medium hover:bg-orange-600 transition"
          >
            + Crear nuevo producto
          </Link>
        ) : (
          <p className="mt-4 text-red-600 font-semibold">
            No tenés créditos disponibles. Contactanos para obtener más.
          </p>
        )}
      </div>

      <h2 className="text-xl font-semibold mb-4">Tus productos publicados</h2>

      {productos.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {productos.map((prod) => {
            const imageUrl = prod.images?.[0]?.url
              ? `${process.env.NEXT_PUBLIC_STRAPI_URL}${prod.images[0].url}`
              : "/placeholder.jpg";

            return (
              <div key={prod.id} className="border rounded shadow p-4 flex flex-col">
                <img
                  src={imageUrl}
                  alt={prod.title}
                  className="h-40 w-full object-cover rounded mb-2"
                />
                <h3 className="text-lg font-bold">{prod.title}</h3>
                <p className="text-sm text-gray-600 mb-2">
                  ${prod.price_sale?.toLocaleString()}
                </p>
                <div className="mt-auto flex gap-2">
                  <Link
                    href={`/productos/${prod.slug}`}
                    className="text-blue-600 text-sm hover:underline"
                  >
                    Ver
                  </Link>
                  <Link
                    href={`/proveedor/panel/editar/${prod.documentId}`}
                    className="text-orange-600 text-sm hover:underline"
                  >
                    Editar
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <p className="text-gray-500">Aún no tenés productos cargados.</p>
      )}
    </section>
  );
}
