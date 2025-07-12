import Link from "next/link";

async function getServicios() {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_STRAPI_URL}/api/servicios`,
    {
      cache: "no-store",
    }
  );
  const data = await res.json();
  return data.data;
}

export default async function ServiciosPage() {
  const servicios = await getServicios();

  return (
    <section className="pt-20 p-6 max-w-5xl mx-auto bg-white text-gray-900 dark:bg-gray-900 dark:text-white">
      <h1 className="text-2xl font-bold mb-6 text-center">
        Servicios disponibles
      </h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {servicios.map((servicio) => {
          const {
            id,
            documentId,
            title,
            slug,
            descripcion,
            precio_aproximado,
          } = servicio;

          return (
            <Link
              key={documentId}
              href={`/servicios/${slug}`}
              className="block bg-white dark:bg-gray-800 rounded-lg shadow hover:shadow-lg overflow-hidden transition p-4"
            >
              <h2 className="text-lg font-bold mb-1">{title}</h2>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                {descripcion?.slice(0, 80)}...
              </p>
              <p className="text-sm text-orange-500 font-semibold">
                Precio Aproximado: {precio_aproximado}
              </p>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
