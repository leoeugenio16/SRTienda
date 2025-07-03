// src/app/productos/[slug]/page.js

async function getProduct(slug) {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_STRAPI_URL}/api/products?filters[slug][$eq]=${slug}&populate=images,category,provider`,
    { cache: "no-store" }
  );
  const data = await res.json();
  return data.data[0]; // El producto único
}

export default async function ProductPage({ params }) {
  const product = await getProduct(params.slug);

  if (!product) {
    return <div className="p-6 text-center">Producto no encontrado</div>;
  }

  const { title, description, price_sale, images, category } = product.attributes;
  const imageUrl = images?.data?.[0]?.attributes?.url || "/placeholder.jpg";

  return (
    <section className="p-6 max-w-4xl mx-auto">
      <div className="grid md:grid-cols-2 gap-6">
        <img
          src={imageUrl}
          alt={title}
          className="w-full h-[400px] object-cover rounded-lg"
        />
        <div>
          <h1 className="text-3xl font-bold mb-2">{title}</h1>
          <p className="text-xl text-gray-700 mb-4">${price_sale.toLocaleString()}</p>
          <p className="mb-6 text-gray-600">{description}</p>

          <a
            href={`https://wa.me/2625500165?text=Hola! Quiero comprar: ${title}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block bg-green-600 text-white px-6 py-3 rounded hover:bg-green-700 transition"
          >
            Comprar por WhatsApp
          </a>
        </div>
      </div>
    </section>
  );
}
