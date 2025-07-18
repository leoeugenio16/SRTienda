import Link from "next/link";
import { getImageUrl } from "../utils/getImageUrl";

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

export default async function Home() {
  const [categorias, productosDestacados, eventosDestacados, proveedores] = await Promise.all([
    getCategorias(),
    getDestacados(),
    getEventosDestacados(),
    getProviders(),
  ]);
  console.log("provedoores:", proveedores);
  return (
    <main className="bg-white text-gray-900 dark:bg-gray-900 dark:text-white">
      {/* CATEGORÍAS EN CÍRCULOS */}
      <section className="p-6 text-center">
        <h2 className="text-2xl font-semibold mb-4">Categorías</h2>
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

      {/* PRODUCTOS DESTACADOS */}
      <section className="p-4">
        <h2 className="text-2xl font-semibold mb-4 text-center">Productos Destacados</h2>
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
      </section>

      {/* EVENTOS DESTACADOS */}
      {eventosDestacados.length > 0 && (
        <section className="p-4">
          <h2 className="text-2xl font-semibold mb-4 text-center">Eventos Destacados</h2>
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
        </section>
      )}

      {/* PROVEEDORES */}
      <section className="p-6">
        <h2 className="text-2xl font-semibold mb-4 text-center">Nuestros Proveedores</h2>
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
            <p className="text-center text-gray-500 dark:text-gray-400">No hay proveedores para mostrar.</p>
          )}
        </div>
      </section>
    </main>
  );
}
