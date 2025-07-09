"use client";

import Link from "next/link";
import { useCart } from "../context/CartContext";

export default function CarritoPage() {
  const { carrito, eliminarProducto } = useCart();

  const total = carrito.reduce((sum, item) => sum + item.precio * item.cantidad, 0);

  const generarLinkWhatsApp = () => {
    const mensaje = carrito
      .map((item) => `- ${item.nombre} x${item.cantidad} ($${item.precio})`)
      .join("%0A");
    return `https://wa.me/5492625500165?text=Hola! Quiero comprar:%0A${mensaje}%0ATotal: $${total}`;
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

      <div className="space-y-4">
        {carrito.map((item, index) => (
  <div
    key={item.documentId || item.id || index}
    className="flex items-center justify-between border p-4 rounded-md shadow-sm"
  >
    <Link href={`/productos/${item.slug}`} className="flex items-center gap-4 flex-1">
      <img
        src={item.imagen || "/placeholder.jpg"}
        alt={item.nombre}
        className="w-16 h-16 object-cover rounded"
      />
      <div>
        <h3 className="font-semibold hover:underline text-left">{item.nombre}</h3>
        <p className="text-sm text-gray-600">
          ${item.precio} x {item.cantidad}
        </p>
      </div>
    </Link>

    <button
      onClick={() => eliminarProducto(item.documentId || item.id)}
      className="text-red-500 text-sm hover:underline"
    >
      Quitar
    </button>
  </div>
))}
      </div>

      <div className="mt-6 text-right font-semibold text-xl">
        Total: ${total.toLocaleString()}
      </div>

      <div className="mt-6 text-center">
        <a
          href={generarLinkWhatsApp()}
          target="_blank"
          rel="noopener noreferrer"
          className="bg-green-600 text-white px-6 py-3 rounded hover:bg-green-700 transition"
        >
          Finalizar compra por WhatsApp
        </a>
      </div>
    </section>
  );
}
