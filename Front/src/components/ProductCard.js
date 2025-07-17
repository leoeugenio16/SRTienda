import { getImageUrl } from "../utils/getImageUrl";
import Link from "next/link";

export default function ProductCard({ product }) {
  const { title, price_sale, slug, images, provider } = product;

  const imageUrl = getImageUrl(images?.[0]);
  const providerImageUrl = getImageUrl(provider?.image?.[0]);

  return (
    <div className="border rounded-lg overflow-hidden shadow hover:shadow-lg transition bg-white dark:bg-gray-800 flex flex-col max-h-[360px]">
      <Link href={`/productos/${slug}`}>
        <img
          src={imageUrl}
          alt={title}
          className="w-full h-28 sm:h-36 md:h-40 object-cover bg-white rounded-t-lg"
        />
      </Link>

      <div className="p-3 flex flex-col flex-grow">
        <Link href={`/productos/${slug}`}>
          <h3 className="text-sm font-normal line-clamp-2 text-gray-900 dark:text-white">
            {title}
          </h3>
        </Link>
        <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 mt-1">
          ${(price_sale ?? 0).toLocaleString()}
        </p>

        {provider && (
          <Link
            href={`/vendedores/${provider.slug}`}
            className="flex items-center gap-2 mt-auto hover:opacity-90"
          >
            <img
              src={providerImageUrl}
              alt={provider.name}
              className="w-6 h-6 rounded-full object-cover border"
            />
            <span className="text-xs sm:text-sm text-gray-700 dark:text-gray-200 font-medium truncate max-w-[100px]">
              {provider.name}
            </span>
          </Link>
        )}
      </div>
    </div>
  );
}
