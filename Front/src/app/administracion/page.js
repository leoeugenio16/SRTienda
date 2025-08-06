"use client";
import { useRouter } from "next/navigation";

export default function AdministracionPage() {
  const router = useRouter();

  const secciones = [
    { nombre: "Ventas Seguras", ruta: "administracion/ventas-seguras" },
    // Agregá más secciones acá a futuro
    // { nombre: "Créditos de productos", ruta: "/admin/creditos" },
    // { nombre: "Proveedores", ruta: "/admin/proveedores" },
  ];

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-orange-600">Panel de Administración</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {secciones.map((sec) => (
          <button
            key={sec.ruta}
            onClick={() => router.push(sec.ruta)}
            className="bg-orange-500 text-white py-3 px-6 rounded-lg shadow hover:bg-orange-600 transition"
          >
            {sec.nombre}
          </button>
        ))}
      </div>
    </div>
  );
}
