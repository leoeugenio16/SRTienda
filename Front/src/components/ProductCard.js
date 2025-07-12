import Link from "next/link";

export default function ProductCard({ product }) {
  const { title, price_sale, slug, images, provider } = product;
  const baseUrl = process.env.NEXT_PUBLIC_STRAPI_URL;

  const imageUrl = images?.[0]?.url
    ? `${baseUrl}${images[0].url}`
    : "/placeholder.jpg";

  // 🔍 Verificar provider.image y su formato
  console.log("🟡 Imagen del proveedor:", provider?.image);

  let providerImageUrl = "/placeholder.jpg";
  if (
    provider?.image &&
    Array.isArray(provider.image) &&
    provider.image.length > 0 &&
    provider.image[0]?.url
  ) {
    providerImageUrl = `${baseUrl}${provider.image[0].url}`;
  }

  return (
    <div className="border rounded-lg overflow-hidden shadow hover:shadow-lg transition bg-white dark:bg-gray-800">
      <Link href={`/productos/${slug}`}>
        <img src={imageUrl} alt={title} className="w-full h-60 object-cover" />
      </Link>

      <div className="p-4">
        <Link href={`/productos/${slug}`}>
          <h3 className="text-lg font-semibold truncate text-gray-900 dark:text-white">
            {title}
          </h3>
        </Link>
        <p className="text-gray-600 dark:text-gray-300">
          ${(price_sale ?? 0).toLocaleString()}
        </p>

        {/* Proveedor */}
        {provider && (
          <Link
            href={`/vendedores/${provider.slug}`}
            className="flex items-center gap-2 mt-4 hover:opacity-90"
          >
            <img
              src={providerImageUrl}
              alt={provider.name}
              className="w-8 h-8 rounded-full object-cover border"
            />
            <span className="text-sm text-gray-700 dark:text-gray-200 font-medium">
              {provider.name}
            </span>
          </Link>
        )}
      </div>
    </div>
  );
}
