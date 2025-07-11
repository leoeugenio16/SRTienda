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
    <section className="pt-20 p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6 text-center">Tu Carrito</h1>

      {Object.entries(proveedoresMap).map(([provId, provData]) => {
        const totalProveedor = provData.productos.reduce(
          (sum, item) => sum + item.precio * item.cantidad,
          0
        );

        return (
          <div
            key={provId}
            className="mb-8 border p-4 rounded-md shadow-md"
          >
            <h2 className="text-xl font-semibold mb-4">
              Proveedor: {provData.proveedorNombre}
            </h2>

            <div className="space-y-4">
              {provData.productos.map((item, index) => (
                <div
                  key={item.documentId || item.id || index}
                  className="relative flex items-center justify-between border p-4 rounded-md shadow-sm"
                >
                  {/* Botón eliminar en esquina superior derecha */}
                  <button
                    onClick={() => eliminarProducto(item.documentId || item.id)}
                    className="absolute top-2 right-2 text-red-500 hover:text-red-700"
                    title="Eliminar producto"
                  >
                    <Trash2 size={18} />
                  </button>

                  <Link
                    href={`/productos/${item.slug}`}
                    className="flex items-center gap-4 flex-1"
                  >
                    <img
                      src={item.imagen || "/placeholder.jpg"}
                      alt={item.nombre}
                      className="w-16 h-16 object-cover rounded"
                    />
                    <div>
                      <h3 className="font-semibold hover:underline text-left">
                        {item.nombre}
                      </h3>
                      <p className="text-sm text-gray-600">${item.precio}</p>
                    </div>
                  </Link>

                  {/* Botones para modificar cantidad */}
                  <div className="flex items-center gap-2 ml-4">
                    <button
                      onClick={() => disminuirCantidad(item.documentId || item.id)}
                      className="p-1 border rounded hover:bg-gray-200"
                      aria-label="Disminuir cantidad"
                    >
                      <Minus size={16} />
                    </button>
                    <span className="w-6 text-center">{item.cantidad}</span>
                    <button
                      onClick={() => aumentarCantidad(item.documentId || item.id)}
                      className="p-1 border rounded hover:bg-gray-200"
                      aria-label="Aumentar cantidad"
                    >
                      <Plus size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-4 font-semibold text-right text-lg">
              Total proveedor: ${totalProveedor.toLocaleString()}
            </div>

            <div className="mt-4 text-center">
              <a
                href={generarLinkWhatsApp(
                  provData.proveedorWhatsapp,
                  provData.productos
                )}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-green-600 text-white px-6 py-3 rounded hover:bg-green-700 transition"
              >
                Finalizar compra por WhatsApp
              </a>
            </div>
          </div>
        );
      })}

      <div className="mt-6 text-right font-bold text-xl">
        Total general: ${totalGeneral.toLocaleString()}
      </div>
    </section>
  );
}
