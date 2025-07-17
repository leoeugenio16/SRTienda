"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { getImageUrl } from "../../../utils/getImageUrl";

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
        <div className="grid grid-cols-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {productos.map((prod) => {
            const imageUrl = getImageUrl(prod.images?.[0]);
            const providerImageUrl = getImageUrl(prod.provider?.image?.[0]);

            return (
              <div
                key={prod.id}
                className="border rounded-lg overflow-hidden shadow hover:shadow-lg transition bg-white dark:bg-gray-800 flex flex-col max-h-[360px]"
              >
                <Link href={`/productos/${prod.slug}`}>
                  <img
                    src={imageUrl}
                    alt={prod.title}
                    className="w-full h-28 sm:h-36 md:h-40 object-contain bg-white rounded-t-lg"
                  />
                </Link>

                <div className="p-3 flex flex-col flex-grow">
                  <Link href={`/productos/${prod.slug}`}>
                    <h3 className="text-sm font-normal line-clamp-2 text-gray-900 dark:text-white">
                      {prod.title}
                    </h3>
                  </Link>

                  <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 mt-1">
                    ${prod.price_sale?.toLocaleString()}
                  </p>

                  {prod.provider && (
                    <Link
                      href={`/vendedores/${prod.provider.slug}`}
                      className="flex items-center gap-2 mt-auto hover:opacity-90"
                    >
                      <img
                        src={providerImageUrl}
                        alt={prod.provider.name}
                        className="w-6 h-6 rounded-full object-cover border"
                      />
                      <span className="text-xs sm:text-sm text-gray-700 dark:text-gray-200 font-medium truncate max-w-[100px]">
                        {prod.provider.name}
                      </span>
                    </Link>

                  )}
                </div>
                {/* Botones Ver y Editar */}
                <div className="flex justify-center gap-2 mt-4">
                  <Link
                    href={`/productos/${prod.slug}`}
                    className="px-3 py-1 text-xs bg-orange-500 text-white rounded-full hover:bg-orange-600 transition"
                  >
                    Ver
                  </Link>
                  <Link
                    href={`/proveedor/panel/editar/${prod.documentId}?slug=${prod.slug}`}
                    className="px-3 py-1 text-xs bg-blue-600 text-white rounded-full hover:bg-blue-700 transition"
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
