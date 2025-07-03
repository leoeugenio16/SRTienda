import ProductCard from "../../components/ProductCard";

async function getProducts() {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_STRAPI_URL}/api/products?populate=images`,
    { cache: "no-store" }
  );
  const data = await res.json();
  return data.data; // Ya es un array de productos directos
}

export default async function ProductosPage() {
  const productos = await getProducts();

  return (
    <section className="p-6">
      <h1 className="text-2xl font-bold mb-4 text-center">Todos los productos</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {productos.map((product) => (
          <ProductCard key={product.documentId} product={product} />
        ))}
      </div>
    </section>
  );
}
