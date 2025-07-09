import ProductDetail from "./ProductDetail";

async function getProduct(slug) {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_STRAPI_URL}/api/products?filters[slug][$eq]=${slug}&populate=images`,
    { cache: "no-store" }
  );
  const data = await res.json();
  return data.data?.[0] || null;
}

export default async function ProductPage({ params }) {
  const product = await getProduct(params.slug);
  if (!product) return <div className="p-6 text-center">Producto no encontrado</div>;

  return <ProductDetail product={product} />;
}
