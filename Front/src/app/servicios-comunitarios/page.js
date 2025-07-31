import Link from "next/link";
import Image from "next/image";
import { getImageUrl } from "../../utils/getImageUrl";

async function getAvisos() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_STRAPI_URL}/api/avisos-comunitarios?populate=imagenes&sort=createdAt:desc`, {
    cache: "no-store",
  });
  const data = await res.json();
  return data.data;
}

export default async function ComunidadPage() {
  const avisos = await getAvisos();

  if (!avisos || avisos.length === 0) {
    return <p className="text-center mt-10">No hay avisos comunitarios por el momento.</p>;
  }

  // Agrupar avisos por estado
  const avisosPorEstado = avisos.reduce((acc, aviso) => {
    if (!acc[aviso.estado]) {
      acc[aviso.estado] = [];
    }
    acc[aviso.estado].push(aviso);
    return acc;
  }, {});

  return (
    <section className="px-4 py-8 max-w-5xl mx-auto">
      <h1 className="text-3xl font-bold text-center mb-6 text-orange-600">Servicio a la Comunidad</h1>

      {Object.keys(avisosPorEstado).map((estado) => (
        <div key={estado} className="mb-8">
          <h2 className="text-2xl font-semibold mb-4 text-orange-600">{estado}</h2>
          <div className="flex gap-6 overflow-x-auto snap-x snap-mandatory justify-start px-4">
            {avisosPorEstado[estado].map((item) => {
              const { titulo, descripcion, imagenes, slug } = item;
              const imageUrl = imagenes?.[0] ? getImageUrl(imagenes[0]) : "/placeholder.jpg";

              return (
                <Link key={item.id} href={`/servicios-comunitarios/${slug}`} className="block bg-white dark:bg-gray-900 rounded-xl shadow hover:shadow-lg transition flex-shrink-0 w-64 snap-start">
                  <img
                    src={imageUrl}
                    alt={titulo}
                    width={400}
                    height={300}
                    className="rounded-t-xl object-contain bg-gray-100 w-full h-48"
                  />
                  <div className="p-4">
                    <h2 className="text-lg font-semibold">{titulo}</h2>
                    <p className="text-sm text-gray-500">{descripcion}</p>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      ))}
    </section>
  );
}