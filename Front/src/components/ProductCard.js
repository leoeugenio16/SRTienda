import { getImageUrl } from "../utils/getImageUrl";
import Link from "next/link";

export default function ProductCard({ product }) {
  const { title, price_sale, slug, images, provider } = product;
  const baseUrl = process.env.NEXT_PUBLIC_STRAPI_URL;

  const imageUrl = getImageUrl(images?.[0]);

  // 🔍 Verificar provider.image y su formato
  console.log("🟡 Imagen del proveedor:", provider?.image);

  let providerImageUrl = getImageUrl(provider?.image?.[0]);;
  

  return (
    <div className="border rounded-lg overflow-hidden shadow hover:shadow-lg transition bg-white dark:bg-gray-800">
      <Link href={`/productos/${slug}`}>
        <img src={imageUrl} alt={title} className="w-full h-[400px] object-contain bg-white rounded-xl shadow-lg" />
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
