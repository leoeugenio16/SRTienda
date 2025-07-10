import Link from "next/link";

async function getDestacados() {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_STRAPI_URL}/api/products?filters[highlight][$eq]=true&populate=images`,
    { cache: "no-store" }
  );
  const data = await res.json();
  return data.data;
}

export default async function Home() {
  const productosDestacados = await getDestacados();

  return (
  <main className="bg-white text-gray-900">
    {/* HERO */}
    <section className="w-full h-[60vh] bg-[url('/banner.jpg')] bg-cover bg-center flex items-center justify-center">
      <div className="bg-black/50 p-6 rounded-xl text-center text-white">
        <h1 className="text-4xl md:text-5xl font-bold">TIENDA OFICIAL</h1>
        <p className="mt-2 text-lg">Ropa y accesorios exclusivos</p>
        <Link href="/productos">
          <button className="mt-4 bg-orange-500 text-white px-6 py-2 rounded-full font-medium hover:bg-orange-600 transition">
            Ver catálogo
          </button>
        </Link>
      </div>
    </section>

    {/* CATEGORÍAS */}
    <section className="p-4 text-center">
      <h2 className="text-2xl font-semibold mb-4">Categorías</h2>
      <div className="flex gap-4 justify-center flex-wrap">
        {["Remeras", "Buzos", "Accesorios", "Infantil"].map((cat) => (
          <Link
            key={cat}
            href={`/categorias/${cat.toLowerCase()}`}
            className="bg-orange-100 hover:bg-orange-200 text-orange-800 px-4 py-2 rounded-full text-sm font-medium transition"
          >
            {cat}
          </Link>
        ))}
      </div>
    </section>

    {/* DESTACADOS */}
    <section className="p-4">
      <h2 className="text-2xl font-semibold mb-4 text-center">Productos Destacados</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {productosDestacados.map((prod) => {
          const { id, title, slug, price_sale, images } = prod;
          const imageUrl = images?.[0]?.url
            ? `${process.env.NEXT_PUBLIC_STRAPI_URL}${images[0].url}`
            : "/placeholder.jpg";

          return (
            <Link href={`/productos/${slug}`} key={id}>
              <div className="border rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition">
                <img src={imageUrl} alt={title} className="w-full h-60 object-cover" />
                <div className="p-4">
                  <h3 className="text-lg font-semibold">{title}</h3>
                  <p className="text-sm text-gray-600">${price_sale.toLocaleString()}</p>
                  <button className="mt-2 w-full bg-orange-500 text-white py-2 rounded hover:bg-orange-600 transition">
                    Ver más
                  </button>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  </main>
);

}

