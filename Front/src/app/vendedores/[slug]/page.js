"use client";

import { use, useEffect, useState } from "react";
import Link from "next/link";
import { Instagram, Phone, Facebook } from "lucide-react";
import { getImageUrl } from "../../../utils/getImageUrl";

const baseUrl = process.env.NEXT_PUBLIC_STRAPI_URL;

async function getProveedorYProductosYServicios(slug) {
  const urlProveedor = `${baseUrl}/api/providers?filters[slug][$eq]=${slug}&populate=image`;
  const resProv = await fetch(urlProveedor);
  const dataProv = await resProv.json();
  const proveedor = dataProv.data?.[0];
  if (!proveedor) return null;

  const proveedorId = proveedor.id;

  // Productos
  const urlProductos = `${baseUrl}/api/products?filters[provider][id][$eq]=${proveedorId}&filters[visible][$eq]=true&populate=images`;
  const resProds = await fetch(urlProductos);
  const dataProds = await resProds.json();

  // Servicios
  const urlServicios = `${baseUrl}/api/servicios?filters[provider][id][$eq]=${proveedorId}&populate=images`;
  const resServ = await fetch(urlServicios);
  const dataServ = await resServ.json();

  return {
    proveedor,
    productos: dataProds.data || [],
    servicios: dataServ.data || [],
  };
}

export default function ProveedorPage({ params }) {
  const { slug } = use(params);
  const [proveedor, setProveedor] = useState(null);
  const [productos, setProductos] = useState([]);
  const [servicios, setServicios] = useState([]);

  useEffect(() => {
    async function fetchData() {
      const data = await getProveedorYProductosYServicios(slug);
      if (data) {
        setProveedor(data.proveedor);
        setProductos(data.productos);
        setServicios(data.servicios); // 👈 nuevo
      }
    }
    fetchData();
  }, [slug]);

  if (!proveedor)
    return <div className="p-6 text-center">Proveedor no encontrado</div>;

  const { name, image, sobreNosotros, instagram, facebook, whatsapp } =
    proveedor.attributes || proveedor;

  const imageUrl = getImageUrl(
    image?.[0] || image?.data?.[0]?.attributes || null
  );

  return (
    <section className="pt-20 p-6 max-w-6xl mx-auto bg-white text-gray-900 dark:bg-gray-900 dark:text-white">
      <div className="flex flex-col items-center text-center mb-10">
        <img
          src={imageUrl}
          alt={name}
          className="w-36 h-36 rounded-full object-cover border mb-4 transition-transform duration-300 ease-in-out hover:scale-125"
        />
        <h1 className="text-3xl font-bold text-orange-600">{name}</h1>
        {sobreNosotros && (
          <p className="mb-4 text-lg leading-relaxed break-words whitespace-pre-line">
            {sobreNosotros}
          </p>
        )}
        <div className="flex gap-4 mt-4">
          <div className="flex gap-4 mt-4">
            {instagram && (
              <a
                href={`https://instagram.com/${instagram.replace("@", "")}`}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-pink-100 dark:bg-pink-800 text-pink-600 dark:text-pink-200 p-3 rounded-full shadow-lg hover:scale-110 transition-all"
                title="Instagram"
              >
                <Instagram className="w-6 h-6" />
              </a>
            )}
            {facebook && (
              <a
                href={facebook.startsWith("http") ? facebook : `https://facebook.com/${facebook}`}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-blue-100 dark:bg-blue-800 text-blue-600 dark:text-blue-200 p-3 rounded-full shadow-lg hover:scale-110 transition-all"
                title="Facebook"
              >
                <Facebook className="w-6 h-6" />
              </a>
            )}
            {whatsapp && (
              <a
                href={`https://wa.me/${whatsapp}`}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-green-100 dark:bg-green-800 text-green-600 dark:text-green-200 p-3 rounded-full shadow-lg hover:scale-110 transition-all"
                title="WhatsApp"
              >
                <Phone className="w-6 h-6" />
              </a>
            )}
          </div>
        </div>
      </div>

      {productos.length > 0 ? (
        <>
          <h2 className="text-2xl font-semibold mb-6">Productos publicados</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {productos.map((prod) => {
              const imageUrl = getImageUrl(prod.images?.[0]);
              return (
                <Link
                  href={`/productos/${prod.slug}`}
                  key={prod.id}
                  className="border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition bg-white dark:bg-gray-800"
                >
                  <img
                    src={imageUrl}
                    alt={prod.title}
                    className="w-full h-[400px] object-contain bg-white rounded-xl shadow-lg"
                  />
                  <div className="p-4">
                    <h3 className="text-lg font-semibold text-orange-600">
                      {prod.title}
                    </h3>
                    <p className="text-gray-700 dark:text-gray-300 text-sm mb-1">
                      ${prod.price_sale?.toLocaleString() || "Consultar"}
                    </p>
                    {prod.vendido && (
                      <p className="text-sm font-semibold text-red-600">Vendido</p>
                    )}
                  </div>
                </Link>
              );
            })}
          </div>
        </>
      ) : servicios.length > 0 ? (
        <>
          <h2 className="text-2xl font-semibold mb-6">Servicios ofrecidos</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {servicios.map((serv) => {
              const imageUrl = getImageUrl(serv.images?.[0]);
              return (
                <Link
                  href={`/servicios/${serv.slug}`}
                  key={serv.id}
                  className="border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition bg-white dark:bg-gray-800"
                >
                  <img
                    src={imageUrl}
                    alt={serv.title}
                    className="w-full h-[300px] object-cover"
                  />
                  <div className="p-4">
                    <h3 className="text-lg font-semibold text-orange-600">
                      {serv.title}
                    </h3>
                    <p className="text-gray-700 dark:text-gray-300 text-sm mb-1">
                      Precio aprox.: {serv.precio_aproximado || "Consultar"}
                    </p>
                  </div>
                </Link>
              );
            })}
          </div>
        </>
      ) : (
        <p className="text-gray-500 text-center">
          Este proveedor aún no tiene productos ni servicios publicados.
        </p>
      )}
    </section>
  );
}
