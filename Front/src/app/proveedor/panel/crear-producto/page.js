'use client';

import { useEffect, useState } from "react";
import CrearProductoForm from "./CrearForm";

export default function CrearProductoPage() {
  const baseUrl = process.env.NEXT_PUBLIC_STRAPI_URL;
  const [estado, setEstado] = useState("cargando");
  const [usuario, setUsuario] = useState(null);
  const [token, setToken] = useState(null);
  const [proveedorId, setProveedorId] = useState(null);
  const [creditosDisponibles, setCreditosDisponibles] = useState(0);

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    if (!storedToken) {
      setEstado("sinSesion");
      return;
    }

    setToken(storedToken);
    let userTemp = null;

    // Paso 1: Obtener usuario actual desde Strapi
    fetch(`${baseUrl}/api/users/me`, {
      headers: {
        Authorization: `Bearer ${storedToken}`,
      },
    })
      .then(res => {
        if (!res.ok) throw new Error("Sesión inválida");
        return res.json();
      })
      .then(user => {
        setUsuario(user);
        userTemp = user;
        return fetch(`${baseUrl}/api/providers?filters[user][documentId][$eq]=${user.documentId}`);
      })
      .then(res => res.json())
      .then(dataProv => {
        const proveedor = dataProv.data?.[0];
        if (!proveedor) {
          setEstado("sinProveedor");
          return;
        }

        const proveedorId = proveedor.id;
        setProveedorId(proveedorId);

        return fetch(
          `${baseUrl}/api/products?filters[provider][id][$eq]=${proveedorId}`,
          {
            headers: {
              Authorization: `Bearer ${storedToken}`,
            },
          }
        );
      })
      .then(res => res.json())
      .then(dataProd => {
        const cantidadProductos = dataProd.data?.length || 0;
        const creditosDisponibles = (userTemp?.credits ?? 0) - cantidadProductos;
        setCreditosDisponibles(creditosDisponibles);

        if (creditosDisponibles <= 0) {
          setEstado("sinCreditos");
        } else {
          setEstado("ok");
        }
      })
      .catch(error => {
        console.error("Error al cargar datos:", error);
        setEstado("error");
      });
  }, []);

  // Distintas vistas según el estado
  if (estado === "cargando")
    return <p className="p-6 text-center">Cargando...</p>;

  if (estado === "sinSesion")
    return <p className="p-6 text-red-600">Tenés que iniciar sesión.</p>;

  if (estado === "sinProveedor")
    return <p className="p-6 text-red-600">No tenés un proveedor asignado.</p>;

  if (estado === "sinCreditos")
    return (
      <section className="pt-24 text-center">
        <h2 className="text-2xl font-bold mb-4 text-orange-600">
          Sin créditos disponibles
        </h2>
        <p className="text-gray-700">
          Ya publicaste todos los productos posibles. Contactanos para adquirir más créditos.
        </p>
      </section>
    );

  if (estado === "error")
    return <p className="p-6 text-red-600">Ocurrió un error. Intentalo de nuevo.</p>;

  // Estado OK
  return (
    <CrearProductoForm
      baseUrl={baseUrl}
      token={token}
      usuario={usuario}
      proveedorId={proveedorId}
      creditosDisponibles={creditosDisponibles}
    />
  );
}
