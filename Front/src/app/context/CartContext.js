"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

const CartContext = createContext();

export const CartProvider = ({ children, usuario }) => {
  const [carrito, setCarrito] = useState([]);
  const [carritoId, setCarritoId] = useState(null);
  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
  const baseUrl = process.env.NEXT_PUBLIC_STRAPI_URL;

  useEffect(() => {
    async function cargarCarrito() {
      if (token && usuario?.id) {
        try {
          const res = await fetch(
            `${baseUrl}/api/carts?filters[users_permissions_user][id][$eq]=${usuario.id}`,
            {
              headers: { Authorization: `Bearer ${token}` },
              cache: "no-store",
            }
          );
          const data = await res.json();

          if (data.data.length > 0) {
            const cartData = data.data[0];
            const items = JSON.parse(cartData.attributes.items_json);
            setCarrito(items);
            setCarritoId(cartData.id);
            localStorage.setItem("carrito", JSON.stringify(items));
            localStorage.setItem("carritoId", cartData.id);
          } else {
            const local = localStorage.getItem("carrito");
            setCarrito(local ? JSON.parse(local) : []);
            setCarritoId(null);
          }
        } catch (error) {
          console.error("Error cargando carrito Strapi:", error);
          const local = localStorage.getItem("carrito");
          setCarrito(local ? JSON.parse(local) : []);
          setCarritoId(null);
        }
      } else {
        const local = localStorage.getItem("carrito");
        setCarrito(local ? JSON.parse(local) : []);
        setCarritoId(localStorage.getItem("carritoId") || null);
      }
    }
    cargarCarrito();
  }, [token, usuario]);

  async function crearCarrito(payload) {
    const res = await fetch(`${baseUrl}/api/carts`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    });
    const data = await res.json();
    if (res.ok) {
      setCarritoId(data.data.id);
      localStorage.setItem("carritoId", data.data.id);
    } else {
      console.warn("Error creando carrito:", data);
    }
  }

  async function guardarCarritoEnStrapi(nuevoCarrito) {
    if (!token) return;
    const payload = {
      data: {
        items_json: JSON.stringify(nuevoCarrito),
        users_permissions_user: usuario.id,
      },
    };

    try {
      let res;
      if (carritoId) {
        res = await fetch(`${baseUrl}/api/carts/${carritoId}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(payload),
        });

        if (res.status === 404) {
          localStorage.removeItem("carritoId");
          setCarritoId(null);
          await crearCarrito(payload);
        } else if (!res.ok) {
          const data = await res.json();
          console.warn("Error actualizando carrito:", data);
        }
      } else {
        await crearCarrito(payload);
      }
    } catch (error) {
      console.error("Error guardando carrito en Strapi:", error);
    }
  }

  const agregarProducto = async (producto) => {
    const existe = carrito.find((p) => p.documentId === producto.documentId);
    let nuevoCarrito;
    if (existe) {
      nuevoCarrito = carrito.map((p) =>
        p.documentId === producto.documentId
          ? { ...p, cantidad: p.cantidad + 1 }
          : p
      );
    } else {
      nuevoCarrito = [...carrito, { ...producto, cantidad: 1 }];
    }

    setCarrito(nuevoCarrito);
    localStorage.setItem("carrito", JSON.stringify(nuevoCarrito));
    await guardarCarritoEnStrapi(nuevoCarrito);
  };

  const eliminarProducto = (documentId) => {
    const nuevoCarrito = carrito.filter(p => {
      const idProducto = p.documentId || p.id;
      return idProducto.toString() !== documentId.toString();
    });
    setCarrito(nuevoCarrito);
    localStorage.setItem("carrito", JSON.stringify(nuevoCarrito));
  };
  return (
    <CartContext.Provider
      value={{ carrito, agregarProducto, eliminarProducto, carritoId }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
