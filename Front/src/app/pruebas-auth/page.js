"use client";

import { useEffect, useState } from "react";
import { useUser } from "../context/UserContext";

export default function TestAuthPage() {
  const { usuario, token } = useUser();
  const [rol, setRol] = useState("Cargando...");

  useEffect(() => {
    const fetchUserRole = async () => {
      if (!token) {
        setRol("No autenticado");
        return;
      }

      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_STRAPI_URL}/api/users/me?populate=role`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!res.ok) {
          throw new Error("Token inválido o expirado");
        }

        const data = await res.json();
        setRol(data.role?.name || "Sin rol");
      } catch (err) {
        console.error(err);
        setRol("Error al obtener rol");
      }
    };

    fetchUserRole();
  }, [token]);

  return (
    <section className="p-6 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">🧪 Prueba de Usuario y Rol</h1>

      {usuario ? (
        <div className="space-y-2">
          <p><strong>Nombre:</strong> {usuario.username}</p>
          <p><strong>Email:</strong> {usuario.email}</p>
          <p><strong>Rol:</strong> {rol}</p>
        </div>
      ) : (
        <p className="text-gray-600">Usuario no autenticado.</p>
      )}
    </section>
  );
}
