import Link from "next/link";
import { getImageUrl } from "../utils/getImageUrl";
import CarruselPublicidad from "../components/CarruselPublicidad";

async function getCategorias() {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_STRAPI_URL}/api/categories?populate=image`,
    { cache: "no-store" }
  );
  const data = await res.json();
  return data.data;
}

async function getDestacados() {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_STRAPI_URL}/api/products?filters[highlight][$eq]=true&populate=images`,
    { cache: "no-store" }
  );
  const data = await res.json();
  return data.data;
}

async function getEventosDestacados() {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_STRAPI_URL}/api/eventos?populate=images&filters[estado][$eq]=activo&filters[destacar][$eq]=true&sort=start_date:asc`,
    { cache: "no-store" }
  );
  const data = await res.json();
  return data.data;
}
async function getProviders() {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_STRAPI_URL}/api/providers?populate=image`,
    { cache: "no-store" }
  );
  const data = await res.json();
  return data.data;
}
async function getServiciosDestacados() {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_STRAPI_URL}/api/servicios?filters[destacado][$eq]=true&populate=images`,
    { cache: "no-store" }
  );
  const data = await res.json();
  return data.data;
}

//seccion de publicidad
async function getBanners(position) {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_STRAPI_URL}/api/banners?filters[active][$eq]=true&filters[position][$eq]=${position}&sort=order:asc&populate[desktopImage][fields]=url&populate[mobileImage][fields]=url`,
      { cache: "no-store" }
    );

    const data = await res.json();
    console.log(`getBanners(${position}) status:`, res.status);
    console.log("getBanners response:", data);

    if (!data?.data || !Array.isArray(data.data)) {
      console.warn(`getBanners: data.data no es un array para position=${position}`, data.data);
      return [];
    }

    return data.data;
  } catch (error) {
    console.error("Error en getBanners:", error);
    return [];
  }
}




export default async function Home() {
  const [
    categorias,
    productosDestacados,
    eventosDestacados,
    serviciosDestacados,
    proveedores,
    bannersTop,
    bannersCategorias,
    bannersProductos,
    bannersEventos,
    bannersServicios,
    bannersProveedores,
  ] = await Promise.all([
    getCategorias(),
    getDestacados(),
    getEventosDestacados(),
    getServiciosDestacados(),
    getProviders(),
    getBanners("top"),
    getBanners("categorias"),
    getBanners("productos"),
    getBanners("eventos"),
    getBanners("servicios"),
    getBanners("proveedores"),
  ]);
  return (
    <main className="bg-white text-gray-900 dark:bg-gray-900 dark:text-white">
      <section className="p-6 text-center bg-gray-100 dark:bg-gray-900">

      {/* Banner Top */}
      {bannersTop.length > 0 && (
        <CarruselPublicidad banners={bannersTop} height={180} />
      )}
      </section>

      {/* CATEGORÍAS EN CÍRCULOS */}
      <section className="p-6 text-center bg-gray-100 dark:bg-gray-900">
        <h2 className="text-2xl font-semibold mb-4 text-orange-600">Categorías</h2>
        <div className="flex gap-6 overflow-x-auto px-4 justify-center">
          {categorias.map((cat) => {
            const { id, name, slug, image } = cat;
            const imageUrl = getImageUrl(image);

            return (
              <Link
                key={id}
                href={`/categorias/${slug}`}
                className="flex flex-col items-center flex-shrink-0 w-24"
              >
                <div className="bg-white dark:bg-gray-800 rounded-full shadow p-3 w-20 h-20 flex items-center justify-center">
                  <img
                    src={imageUrl}
                    alt={name}
                    className="w-10 h-10 object-contain"
                  />
                </div>
                <span className="mt-1 text-xs text-gray-800 dark:text-white text-center leading-tight break-words max-w-[5rem]">
                  {name}
                </span>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Banner Categorías */}
      {bannersCategorias.length > 0 && (
        <CarruselPublicidad banners={bannersCategorias} height={100} />
      )}

      {/* PRODUCTOS DESTACADOS */}
      <section className="p-4 bg-gray-200 dark:bg-gray-900">
        <h2 className="text-2xl font-semibold mb-4 text-center text-orange-600">
          Productos Destacados
        </h2>
        <div className="flex gap-6 overflow-x-auto px-4 justify-center">
          {productosDestacados.map((prod) => {
            const { id, title, slug, price_sale, images } = prod;
            const imageUrl = getImageUrl(images?.[0]);

            return (
              <Link
                href={`/productos/${slug}`}
                key={id}
                className="min-w-[200px] w-48 bg-white dark:bg-gray-800 rounded-xl shadow-sm hover:shadow-lg transition flex-shrink-0"
              >
                <img
                  src={imageUrl}
                  alt={title}
                  className="w-full h-40 object-cover rounded-t-xl"
                />
                <div className="p-3">
                  <h3 className="text-sm font-semibold">{title}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    ${price_sale.toLocaleString()}
                  </p>
                </div>
              </Link>
            );
          })}
        </div>
        <div className="mt-6 text-center">
          <Link
            href="/productos"
            className="inline-block bg-white dark:bg-gray-800 text-gray-800 dark:text-white border border-gray-300 dark:border-gray-600 px-6 py-2 rounded-xl shadow-sm hover:shadow-md transition"
          >
            Ver todos
          </Link>
        </div>
      </section>

      {/* 📢 Banner Productos */}
      {bannersProductos.length > 0 && (
        <CarruselPublicidad banners={bannersProductos} height={100} />
      )}

      {/* EVENTOS DESTACADOS */}
      {eventosDestacados.length > 0 && (
        <>

          <section className="p-4 bg-gray-100 dark:bg-gray-900">
            <h2 className="text-2xl font-semibold mb-4 text-center text-orange-600">
              Eventos Destacados
            </h2>
            <div className="flex gap-6 overflow-x-auto px-4 justify-center">
              {eventosDestacados.map((evento) => {
                const { id, title, slug, price_sale, start_date, images } = evento;
                const imageUrl = getImageUrl(images?.[0]);

                return (
                  <Link
                    href={`/eventos/${slug}`}
                    key={id}
                    className="min-w-[200px] w-48 bg-white dark:bg-gray-800 rounded-xl shadow-sm hover:shadow-lg transition flex-shrink-0"
                  >
                    <img
                      src={imageUrl}
                      alt={title}
                      className="w-full h-40 object-cover rounded-t-xl"
                    />
                    <div className="p-3">
                      <h3 className="text-sm font-semibold">{title}</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-300">
                        ${price_sale.toLocaleString()}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {new Date(start_date).toLocaleDateString()}
                      </p>
                    </div>
                  </Link>
                );
              })}
            </div>
            <div className="mt-6 text-center">
              <Link
                href="/eventos"
                className="inline-block bg-white dark:bg-gray-800 text-gray-800 dark:text-white border border-gray-300 dark:border-gray-600 px-6 py-2 rounded-xl shadow-sm hover:shadow-md transition"
              >
                Ver todos
              </Link>
            </div>
          </section>
        </>
      )}
      {/* 📢 Banner Eventos */}
      {bannersEventos.length > 0 && (
        <CarruselPublicidad banners={bannersEventos} height={100} />
      )}


      {/* SERVICIOS DESTACADOS */}
      {serviciosDestacados.length > 0 && (
        <>
          <section className="p-4 bg-gray-200 dark:bg-gray-900">
            <h2 className="text-2xl font-semibold mb-4 text-center text-orange-600">
              Servicios Destacados
            </h2>
            <div className="flex gap-6 overflow-x-auto px-4 justify-center">
              {serviciosDestacados.map((servicio) => {
                const { id, title, slug, precio_aproximado, images } = servicio;
                const imageUrl = getImageUrl(images?.[0]);

                return (
                  <Link
                    href={`/servicios/${slug}`}
                    key={id}
                    className="min-w-[200px] w-48 bg-white dark:bg-gray-800 rounded-xl shadow-sm hover:shadow-lg transition flex-shrink-0"
                  >
                    <img
                      src={imageUrl}
                      alt={title}
                      className="w-full h-40 object-cover rounded-t-xl"
                    />
                    <div className="p-3">
                      <h3 className="text-sm font-semibold">{title}</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-300">
                        Precio aprox.: {precio_aproximado || "Consultar"}
                      </p>
                    </div>
                  </Link>
                );
              })}
            </div>
            <div className="mt-6 text-center">
              <Link
                href="/servicios"
                className="inline-block bg-white dark:bg-gray-800 text-gray-800 dark:text-white border border-gray-300 dark:border-gray-600 px-6 py-2 rounded-xl shadow-sm hover:shadow-md transition"
              >
                Ver todos
              </Link>
            </div>
          </section>
        </>
      )}
      {/* 📢 Banner Servicios */}
      {bannersServicios.length > 0 && (
        <CarruselPublicidad banners={bannersServicios} height={100} />
      )}

      {/* PROVEEDORES */}
      <section className="p-6 bg-gray-100 dark:bg-gray-900">
        <h2 className="text-2xl font-semibold mb-4 text-center text-orange-600">
          Nuestros Proveedores
        </h2>
        <div className="flex gap-6 overflow-x-auto px-4 justify-center">
          {proveedores.map(({ id, name, slug, image }) => {
            const imageUrl = getImageUrl(image?.[0]);

            return (
              <Link
                key={id}
                href={`/vendedores/${slug}`}
                className="flex flex-col items-center flex-shrink-0 w-24"
              >
                <div className="bg-white dark:bg-gray-800 rounded-full shadow p-3 w-20 h-20 flex items-center justify-center overflow-hidden">
                  {imageUrl ? (
                    <img
                      src={imageUrl}
                      alt={name}
                      className="w-full h-full object-cover rounded-full"
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-300 rounded-full flex items-center justify-center text-gray-600">
                      <span>{name?.charAt(0)}</span>
                    </div>
                  )}
                </div>
                <span className="mt-2 text-xs text-gray-800 dark:text-white text-center leading-tight break-words max-w-[5rem]">
                  {name}
                </span>
              </Link>
            );
          })}
          {proveedores.length === 0 && (
            <p className="text-center text-gray-500 dark:text-gray-400">
              No hay proveedores para mostrar.
            </p>
          )}
        </div>
      </section>

      {/* Banner Proveedores */}
      {bannersProveedores.length > 0 && (
        <CarruselPublicidad banners={bannersProveedores} height={100} />
      )}

    </main>
  );

}
