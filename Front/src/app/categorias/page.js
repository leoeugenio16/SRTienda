import Link from "next/link";

async function getCategorias() {
    const res = await fetch(
        `${process.env.NEXT_PUBLIC_STRAPI_URL}/api/categories?populate=image`,
        { cache: "no-store" }
    );
    const data = await res.json();
    return data.data;
}

export default async function CategoriasPage() {
    const categorias = await getCategorias();

    return (
        <section className="pt-20 p-6 max-w-5xl mx-auto">
            <h1 className="text-2xl font-bold mb-6 text-center">Categorías</h1>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {categorias.map((cat) => {
                    const { id, name, slug, image } = cat;
                    const imageUrl = image?.url
                        ? `${process.env.NEXT_PUBLIC_STRAPI_URL}${image.url}`
                        : "/placeholder.jpg";

                    return (
                        <Link
                            key={id}
                            href={`/categorias/${slug}`}
                            className="block bg-white rounded-lg shadow hover:shadow-lg overflow-hidden transition"
                        >
                            <img
                                src={imageUrl}
                                alt={name}
                                className="w-full aspect-square object-contain p-4"
                            />
                            <div className="p-3 text-center font-medium">{name}</div>
                        </Link>
                    );
                })}
            </div>
        </section>
    );
}
