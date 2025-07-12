import Link from "next/link";

export default function ProductCard({ product }) {
  const { title, price_sale, slug, images } = product;
  const imageUrl = `${process.env.NEXT_PUBLIC_STRAPI_URL}${images?.[0]?.url}` || "/placeholder.jpg";

  return (
    <Link href={`/productos/${slug}`}>
      <div className="border rounded-lg overflow-hidden shadow hover:shadow-lg transition">
        <img
          src={imageUrl}
          alt={title}
          className="w-full h-60 object-cover"
        />
        <div className="p-4">
          <h3 className="text-lg font-semibold truncate">{title}</h3>
          <p className="text-gray-600">${price_sale.toLocaleString()}</p>
        </div>
      </div>
    </Link>
  );
}
