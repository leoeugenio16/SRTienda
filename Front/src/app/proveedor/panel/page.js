"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { getImageUrl } from "../../../utils/getImageUrl";

export default function PanelProveedor() {
  const [usuario, setUsuario] = useState(null);
  const [productos, setProductos] = useState([]);
  const [avisos, setAvisos] = useState([]);
  const [creditosDisponibles, setCreditosDisponibles] = useState(0);
  const [cargando, setCargando] = useState(true);
  const [esComunidad, setEsComunidad] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
      return;
    }

    (async () => {
      try {
        // 1) Usuario actual
        const resUser = await fetch(
          `${process.env.NEXT_PUBLIC_STRAPI_URL}/api/users/me`,
          { headers: { Authorization: `Bearer ${token}` }, cache: "no-store" }
        );
        if (!resUser.ok) throw new Error("Usuario no autorizado");
        const user = await resUser.json();
        setUsuario(user);

        // 2) Proveedor vinculado al usuario (por documentId del user)
        const resProv = await fetch(
          `${process.env.NEXT_PUBLIC_STRAPI_URL}/api/providers?filters[user][documentId][$eq]=${user.documentId}`,
          { cache: "no-store" }
        );
        const dataProv = await resProv.json();
        const proveedor = dataProv.data?.[0];
        if (!proveedor) throw new Error("Proveedor no encontrado");

        const tipo = (proveedor.tipo || "").trim();
        const esComercioOServicio = tipo === "Comercio" || tipo === "Servicio";

        // 3) Comunidad → traer AVISOS por publicado_por.documentId y terminar
        if (!esComercioOServicio) {
          setEsComunidad(true);

          const urlAvisos =
            `${process.env.NEXT_PUBLIC_STRAPI_URL}/api/avisos-comunitarios` +
            `?filters[publicado_por][documentId][$eq]=${proveedor.documentId}` +
            `&populate[imagenes]=true`;

          const resAvisos = await fetch(urlAvisos, {
            headers: { Authorization: `Bearer ${token}` },
            cache: "no-store",
          });

          if (!resAvisos.ok) {
            console.error("Avisos error:", resAvisos.status, await resAvisos.text());
            setAvisos([]);
          } else {
            const dataAvisos = await resAvisos.json();
            setAvisos(dataAvisos.data || []);
          }
          return; // no seguimos con productos/créditos
        }

        // 4) Comercio/Servicio → traer PRODUCTOS por provider.documentId
        const urlProductos =
          `${process.env.NEXT_PUBLIC_STRAPI_URL}/api/products` +
          `?filters[provider][documentId][$eq]=${proveedor.documentId}` +
          `&populate[images]=true` +
          `&populate[provider][populate][image]=true`;

        const resProd = await fetch(urlProductos, {
          headers: { Authorization: `Bearer ${token}` },
          cache: "no-store",
        });

        if (!resProd.ok) {
          console.error("[Panel] Error productos:", resProd.status, await resProd.text());
          setProductos([]);
        } else {
          const dataProd = await resProd.json();
          const lista = dataProd.data || [];
          setProductos(lista);

          const usados = lista.length;
          const disponibles = (user.credits ?? 0) - usados;
          setCreditosDisponibles(disponibles);
        }
      } catch (err) {
        console.error("Error en panel proveedor:", err);
      } finally {
        setCargando(false);
      }
    })();
  }, [router]);

  if (cargando) return <p className="p-6 text-center">Cargando panel...</p>;
  if (!usuario) return null;

  return (
    <section className="pt-20 p-6 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold text-orange-600 mb-4 text-center">
        Panel de Control - {usuario.name || usuario.username}
      </h1>

      {esComunidad ? (
        <>
          <div className="text-center mb-6">
            <p className="text-gray-700 mb-4">
              Este proveedor es de tipo <b>Comunidad</b>. Gestioná tus avisos.
            </p>
            <Link
              href="/proveedor/panel/crear-aviso"
              className="inline-block bg-orange-500 text-white px-6 py-2 rounded-full font-medium hover:bg-orange-600 transition"
            >
              + Crear nuevo aviso comunitario
            </Link>
          </div>

          <h2 className="text-xl font-semibold mb-4">Tus avisos comunitarios</h2>
          {avisos.length > 0 ? (
            <div className="grid grid-cols-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {avisos.map((av) => {
                const imgUrl = getImageUrl(av.imagenes?.[0]);
                const docId = av.documentId || av.id;

                return (
                  <div
                    key={av.id}
                    className="border rounded-lg overflow-hidden shadow hover:shadow-lg transition bg-white dark:bg-gray-800 flex flex-col max-h-[360px]"
                  >
                    <Link href={`/comunidad/${av.slug}`}>
                      <div className="w-full h-28 sm:h-36 md:h-40 bg-white rounded-t-lg overflow-hidden">
                        {imgUrl ? (
                          <img src={imgUrl} alt={av.titulo} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-xs text-gray-400">
                            Sin imagen
                          </div>
                        )}
                      </div>
                    </Link>

                    <div className="p-3 flex flex-col flex-grow">
                      <Link href={`/comunidad/${av.slug}`}>
                        <h3 className="text-sm font-normal line-clamp-2 text-gray-900 dark:text-white">
                          {av.titulo}
                        </h3>
                      </Link>

                      <span className="mt-1 inline-block text-[11px] px-2 py-0.5 rounded-full bg-gray-100 dark:bg-gray-700">
                        {av.estado}
                      </span>

                      {av.link_whatsapp && (
                        <a
                          href={av.link_whatsapp}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="mt-2 text-xs text-green-600 hover:underline"
                        >
                          WhatsApp
                        </a>
                      )}
                    </div>

                    <div className="flex justify-center gap-2 mt-2 mb-3">
                      <Link
                        href={`/comunidad/${av.slug}`}
                        className="px-3 py-1 text-xs bg-orange-500 text-white rounded-full hover:bg-orange-600 transition"
                      >
                        Ver
                      </Link>
                      <Link
                        href={`/proveedor/panel/editarAviso/${docId}?slug=${av.slug}`}
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
            <p className="text-gray-500">Aún no tenés avisos cargados.</p>
          )}
        </>
      ) : (
        <>
          <div className="text-center mb-6">
            <p className="text-lg">
              Créditos disponibles:{" "}
              <span className="font-semibold text-orange-500">{creditosDisponibles}</span>
            </p>

            <Link
              href="/proveedor/panel/crear-producto"
              className="inline-block mt-4 bg-orange-500 text-white px-6 py-2 rounded-full font-medium hover:bg-orange-600 transition"
            >
              + Crear nuevo producto
            </Link>
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

                    <div className="flex justify-center gap-2 mt-4">
                      <Link
                        href={`/productos/${prod.slug}`}
                        className="px-3 py-1 text-xs bg-orange-500 text-white rounded-full hover:bg-orange-600 transition"
                      >
                        Ver
                      </Link>
                      <Link
                        href={`/proveedor/panel/editarProducto/${prod.documentId}?slug=${prod.slug}`}
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
        </>
      )}
    </section>
  );
}
