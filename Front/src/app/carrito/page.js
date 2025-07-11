"use client";

import Link from "next/link";
import { Trash2, Plus, Minus } from "lucide-react";
import { useCart } from "../context/CartContext";

export default function CarritoPage() {
  const {
    carrito,
    eliminarProducto,
    aumentarCantidad,
    disminuirCantidad,
  } = useCart();

  // Agrupamos los productos por proveedorDocumentId
  const proveedoresMap = carrito.reduce((acc, item) => {
    const proveedorId = item.proveedorDocumentId || "sin-proveedor";
    const proveedorNombre = item.proveedorNombre || "Desconocido";
    const proveedorWhatsapp = item.proveedorWhatsapp || "sin-numero";

    if (!acc[proveedorId]) {
      acc[proveedorId] = {
        proveedorNombre,
        proveedorWhatsapp,
        productos: [],
      };
    }
    acc[proveedorId].productos.push(item);
    return acc;
  }, {});

  // Total general de todo el carrito
  const totalGeneral = carrito.reduce(
    (sum, item) => sum + item.precio * item.cantidad,
    0
  );

  // Generar link WhatsApp para cada proveedor (usa su whatsapp y productos)
  const generarLinkWhatsApp = (proveedorWhatsapp, productos) => {
    const mensaje = productos
      .map((item) => `- ${item.nombre} x${item.cantidad} ($${item.precio})`)
      .join("%0A");
    return `https://wa.me/${proveedorWhatsapp}?text=Hola! Quiero comprar:%0A${mensaje}`;
  };

  if (carrito.length === 0) {
    return (
      <section className="pt-20 p-6 text-center text-gray-500">
        Tu carrito está vacío.
        <div className="mt-4">
          <Link href="/productos" className="text-blue-600 hover:underline">
            Ir al catálogo
          </Link>
        </div>
      </section>
    );
  }

  return (
  <main className="bg-white text-gray-900 min-h-screen">
    {/* Título */}
    <section className="pt-20 p-6 max-w-4xl mx-auto text-center">
      <h1 className="text-4xl font-bold mb-6">Tu Carrito</h1>
    </section>

    {/* Carrito por proveedor */}
    <section className="max-w-4xl mx-auto p-4 sm:p-6">
      {Object.entries(proveedoresMap).map(([provId, provData]) => {
        const totalProveedor = provData.productos.reduce(
          (sum, item) => sum + item.precio * item.cantidad,
          0
        );

        return (
          <div
            key={provId}
            className="mb-10 border rounded-xl shadow-md p-4 sm:p-6"
          >
            <h2 className="text-xl sm:text-2xl font-semibold mb-4 sm:mb-6 text-center text-orange-600">
              Proveedor: {provData.proveedorNombre}
            </h2>

            <div className="space-y-4 sm:space-y-6">
              {provData.productos.map((item, index) => (
                <div
                  key={item.documentId || item.id || index}
                  className="relative flex flex-col sm:flex-row items-center sm:items-start justify-between gap-4 border rounded-lg shadow-sm p-4 hover:shadow-lg transition"
                >
                  {/* Botón eliminar en esquina superior derecha */}
                  <button
                    onClick={() => eliminarProducto(item.documentId || item.id)}
                    className="absolute top-3 right-3 text-red-600 hover:text-red-800"
                    title="Eliminar producto"
                  >
                    <Trash2 size={20} />
                  </button>

                  <Link
                    href={`/productos/${item.slug}`}
                    className="flex items-center gap-4 flex-1 hover:underline"
                  >
                    <img
                      src={item.imagen || "/placeholder.jpg"}
                      alt={item.nombre}
                      className="w-20 h-20 object-cover rounded-lg"
                    />
                    <div className="text-left">
                      <h3 className="font-semibold text-base sm:text-lg">
                        {item.nombre}
                      </h3>
                      <p className="text-sm text-gray-600">
                        ${item.precio.toLocaleString()}
                      </p>
                    </div>
                  </Link>

                  {/* Botones para modificar cantidad */}
                  <div className="flex items-center gap-3 sm:ml-6">
                    <button
                      onClick={() => disminuirCantidad(item.documentId || item.id)}
                      className="p-2 border border-orange-500 rounded-full hover:bg-orange-100 transition"
                      aria-label="Disminuir cantidad"
                    >
                      <Minus size={18} className="text-orange-600" />
                    </button>
                    <span className="w-8 text-center font-medium text-lg">
                      {item.cantidad}
                    </span>
                    <button
                      onClick={() => aumentarCantidad(item.documentId || item.id)}
                      className="p-2 border border-orange-500 rounded-full hover:bg-orange-100 transition"
                      aria-label="Aumentar cantidad"
                    >
                      <Plus size={18} className="text-orange-600" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 font-semibold text-right text-lg sm:text-xl text-gray-700">
              Total proveedor: ${totalProveedor.toLocaleString()}
            </div>

            <div className="mt-6 text-center">
              <a
                href={generarLinkWhatsApp(
                  provData.proveedorWhatsapp,
                  provData.productos
                )}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-green-600 text-white px-6 sm:px-8 py-2 sm:py-3 rounded-full hover:bg-green-700 transition font-semibold"
              >
                Finalizar compra por WhatsApp
              </a>
            </div>
          </div>
        );
      })}

      <div className="max-w-4xl mx-auto mt-10 p-4 sm:p-6 bg-orange-100 rounded-xl text-right font-bold text-xl sm:text-2xl text-orange-700 shadow-md">
        Total general: ${totalGeneral.toLocaleString()}
      </div>
    </section>
  </main>
);


}
