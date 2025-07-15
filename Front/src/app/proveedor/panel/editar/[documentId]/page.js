import EditarProductoForm from "./EditarProductoForm";

export default async function EditarProductoPage({ params }) {
  const { documentId } = params;
  console.log("Params recibidos:", documentId);

  if (!documentId) {
    return <p className="p-6 text-red-600">Falta el documentId en la URL.</p>;
  }
  const baseUrl = process.env.NEXT_PUBLIC_STRAPI_URL;
  const url = `${baseUrl}/api/products?filters[documentId][$eq]=${documentId}&populate[provider]=true&populate[images]=true`;
  console.log("Fetch URL:", url);

  const res = await fetch(url, { cache: "no-store" });
  const data = await res.json();

  console.log("Data recibida:", data);

  const producto = data.data?.[0];

  if (!producto) {
    return <p className="p-6 text-red-600">Producto no encontrado.</p>;
  }

  // Validamos proveedor
  const proveedor = producto.provider;
  if (!proveedor) {
    return <p className="p-6 text-red-600">Proveedor no encontrado.</p>;
  }

  const { title, description, price_sale, permitirSugerirPrecio } = producto;

  
    return <EditarProductoForm producto={producto} baseUrl={baseUrl} />;

}
