// src/app/page.js
import Link from "next/link";

const productosDestacados = [
  {
    id: 1,
    nombre: "Camiseta Oficial",
    imagen: "/camiseta.jpg",
    precio: 29900,
    slug: "camiseta-oficial",
  },
  {
    id: 2,
    nombre: "Buzo Urbano",
    imagen: "/buzo.jpg",
    precio: 34900,
    slug: "buzo-urbano",
  },
  // Agregá más desde el CMS después
];

export default function Home() {
  return (
    <main className="bg-white text-gray-900">
      {/* HERO */}
      <section className="w-full h-[60vh] bg-[url('/banner.jpg')] bg-cover bg-center flex items-center justify-center">
        <div className="bg-black/50 p-6 rounded-xl text-center text-white">
          <h1 className="text-4xl md:text-5xl font-bold">TIENDA OFICIAL</h1>
          <p className="mt-2 text-lg">Ropa y accesorios exclusivos</p>
          <Link href="/productos">
            <button className="mt-4 bg-white text-black px-6 py-2 rounded-full font-medium hover:bg-gray-200 transition">
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
              className="bg-gray-200 hover:bg-gray-300 px-4 py-2 rounded-full text-sm font-medium"
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
          {productosDestacados.map((prod) => (
            <Link href={`/productos/${prod.slug}`} key={prod.id}>
              <div className="border rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition">
                <img src={prod.imagen} alt={prod.nombre} className="w-full h-60 object-cover" />
                <div className="p-4">
                  <h3 className="text-lg font-semibold">{prod.nombre}</h3>
                  <p className="text-sm text-gray-600">${prod.precio.toLocaleString()}</p>
                  <button className="mt-2 w-full bg-black text-white py-2 rounded hover:bg-gray-800">
                    Ver más
                  </button>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}
