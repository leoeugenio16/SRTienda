// src/app/proveedor/panel/crear-producto/CrearForm.jsx
"use client";
import { getImageUrl } from "../../../../utils/getImageUrl";
import { useState, useRef } from "react";
import { v4 as uuidv4 } from "uuid";

export default function CrearProductoForm({
  baseUrl,
  token,
  proveedorId,
  usuario,
  creditosDisponibles,
}) {
  /* ----- Estados del formulario ----- */
  const [title, setTitle] = useState("");
  const [description, setDesc] = useState("");
  const [priceSale, setPrice] = useState("");
  const [permitPrice, setPermit] = useState(true);
  const [images, setImages] = useState([]);
  const [uploading, setUploading] = useState(false);

  const fileInputRefs = useRef({});

  /* ---------- helpers imágenes ---------- */
  async function subirArchivos(files) {
    const fd = new FormData();
    [...files].forEach((f) => fd.append("files", f));

    const res = await fetch(`${baseUrl}/api/upload`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
      body: fd,
    });
    return res.json(); // array de medias
  }
  function slugify(text) {
    return text
      .toString()
      .toLowerCase()
      .normalize("NFD") // elimina tildes
      .replace(/[\u0300-\u036f]/g, "") // elimina acentos
      .replace(/\s+/g, "-") // espacios a guiones
      .replace(/[^\w\-]+/g, "") // elimina caracteres especiales
      .replace(/\-\-+/g, "-") // elimina guiones dobles
      .replace(/^-+/, "") // elimina guión inicial
      .replace(/-+$/, ""); // elimina guión final
  }
  async function generarSlugUnico(titulo) {
    const baseSlug = slugify(titulo);
    let slug = baseSlug;
    let i = 1;

    while (true) {
      const res = await fetch(
        `${baseUrl}/api/products?filters[slug][$eq]=${slug}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const data = await res.json();
      if (data?.data?.length === 0) break; // slug disponible
      slug = `${baseSlug}-${i++}`;
    }

    return slug;
  }

  const handleAddImages = async (e) => {
    const files = e.target.files;
    if (!files.length) return;
    setUploading(true);
    try {
      const uploaded = await subirArchivos(files);
      setImages((prev) => [
        ...prev,
        ...(Array.isArray(uploaded) ? uploaded : [uploaded]),
      ]);
    } finally {
      setUploading(false);
    }
  };

  const handleRemove = async (id) => {
    await fetch(`${baseUrl}/api/upload/files/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
    setImages((prev) => prev.filter((img) => img.id !== id));
  };

  /* ---------- submit ---------- */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setUploading(true);

    /* 1. Crear documentoId para el nuevo producto */
    const documentId = uuidv4();

    /* 2. Publicar producto */
    const slug = await generarSlugUnico(title);
    const payload = {
      data: {
        title,
        slug,
        description,
        price_sale: Number(priceSale),
        permitirSugerirPrecio: permitPrice,
        provider: proveedorId,
        images: images.map((i) => i.id),
      },
    };

    const resProd = await fetch(`${baseUrl}/api/products`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    });

    if (!resProd.ok) {
      alert("Error al crear producto");
      setUploading(false);
      return;
    }

    /* 3. Descontar 1 crédito */
    await fetch(`${baseUrl}/api/users/${usuario.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        credits: (usuario.credits || 1) - 1,
      }),
    });

    /* 4. Actualizar localStorage para que el panel muestre el nuevo saldo */
    const userLS = { ...usuario, credits: (usuario.credits || 1) - 1 };
    localStorage.setItem("user", JSON.stringify(userLS));

    /* 5. Redirigir o limpiar formulario */
    alert("Producto creado!");
    window.location.href = "/proveedor/panel"; // vuelve al panel
  };

  /* ---------- UI ---------- */
  return (
    <form
      onSubmit={handleSubmit}
      className="pt-10 px-6 pb-12 max-w-4xl mx-auto bg-white dark:bg-gray-900 text-gray-900 dark:text-white rounded-xl shadow-lg mt-20"
    >
      {/* Créditos disponibles */}
      <div className="text-center mb-4">
        <p className="text-lg font-medium text-gray-800 dark:text-gray-200">
          Créditos disponibles:{" "}
          <span className="text-orange-600 dark:text-orange-400 font-bold">
            {creditosDisponibles}
          </span>
        </p>
      </div>
      <h2 className="text-3xl font-bold mb-6 text-orange-600 dark:text-orange-400">
        Crear Nuevo Producto
      </h2>

      <input
        className="border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 rounded-lg p-3 w-full mb-6 focus:outline-none focus:ring-2 focus:ring-orange-500"
        placeholder="Título"
        value={title}
        required
        onChange={(e) => setTitle(e.target.value)}
      />

      <textarea
        className="border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 rounded-lg p-3 w-full mb-6 resize-none focus:outline-none focus:ring-2 focus:ring-orange-500"
        rows={4}
        placeholder="Descripción"
        value={description}
        onChange={(e) => setDesc(e.target.value)}
      />
      <p className="text-sm text-red-600 font-medium mb-2">
        ⚠️ Ingresá el número completo sin puntos ni comas. <br />
        Ejemplo: <strong>1000</strong> en lugar de <strong>1.000</strong> o <strong>1,000</strong>
      </p>
      <input
        type="number"
        className="border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 rounded-lg p-3 w-full mb-6 focus:outline-none focus:ring-2 focus:ring-orange-500"
        placeholder="Precio de venta"
        value={priceSale}
        onChange={(e) => setPrice(e.target.value)}
      />

      <label className="flex items-center gap-3 mb-6 text-gray-800 dark:text-gray-200 font-medium">
        <input
          type="checkbox"
          checked={permitPrice}
          onChange={(e) => setPermit(e.target.checked)}
        />
        Permitir sugerir precio
      </label>

      <div className="mb-8">
        <label className="block font-semibold mb-3 text-gray-800 dark:text-gray-200">
          Imágenes
        </label>
        <div className="flex gap-4 overflow-x-auto">
          {images.map((img, idx) => {
            const url = getImageUrl(img);
            return (
              <div
                key={img.id || idx}
                className="relative flex flex-col items-center"
              >
                <img
                  src={url}
                  alt={`img-${idx}`}
                  className="h-24 w-24 object-cover rounded-lg border shadow"
                />
                <button
                  type="button"
                  onClick={() => handleRemove(img.id)}
                  className="mt-1 text-xs bg-red-600 text-white px-2 rounded-full hover:bg-red-700"
                >
                  Eliminar
                </button>
              </div>
            );
          })}
        </div>
        <input
          type="file"
          multiple
          onChange={handleAddImages}
          disabled={uploading}
          className="mt-4 text-sm text-gray-800 dark:text-gray-200"
        />
      </div>

      <button
        type="submit"
        disabled={uploading}
        className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 rounded-lg transition"
      >
        {uploading ? "Publicando..." : "Publicar producto"}
      </button>
    </form>
  );
}
