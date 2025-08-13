// src/app/proveedor/panel/crear-aviso/CrearAvisoForm.jsx
"use client";
import { useState } from "react";
import { getImageUrl } from "../../../../utils/getImageUrl";

const ESTADOS = ["Perdido", "Encontrado", "Anuncio"];

export default function CrearAvisoForm({ baseUrl, token, proveedorId }) {
  /* ----- Estados del formulario ----- */
  const [titulo, setTitulo] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [estado, setEstado] = useState("Anuncio");
  const [linkWhatsapp, setLinkWhatsapp] = useState("");
  const [linkPagina, setLinkPagina] = useState("");

  const [imagenes, setImagenes] = useState([]);
  const [subiendo, setSubiendo] = useState(false);

  /* ---------- helpers imágenes ---------- */
  async function subirArchivos(files) {
    const fd = new FormData();
    [...files].forEach((f) => fd.append("files", f));

    const res = await fetch(`${baseUrl}/api/upload`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
      body: fd,
    });
    if (!res.ok) throw new Error("Error al subir archivos");
    return res.json(); // array de medias
  }

  const handleAddImages = async (e) => {
    const files = e.target.files;
    if (!files?.length) return;
    setSubiendo(true);
    try {
      const uploaded = await subirArchivos(files);
      setImagenes((prev) => [
        ...prev,
        ...(Array.isArray(uploaded) ? uploaded : [uploaded]),
      ]);
    } catch (e) {
      console.error(e);
      alert("No se pudieron subir las imágenes");
    } finally {
      setSubiendo(false);
    }
  };

  const handleRemove = async (id) => {
    try {
      await fetch(`${baseUrl}/api/upload/files/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      setImagenes((prev) => prev.filter((img) => img.id !== id));
    } catch (e) {
      console.error(e);
      alert("No se pudo eliminar la imagen");
    }
  };

  /* ---------- submit ---------- */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubiendo(true);

    // El slug es UID con targetField "titulo": Strapi lo genera solo
    const payload = {
      data: {
        titulo,
        descripcion,
        estado,
        link_whatsapp: linkWhatsapp || null,
        link_pagina: linkPagina || null,
        publicado_por: proveedorId,            // relación con provider (usás documentId)
        imagenes: imagenes.map((i) => i.id),   // IDs de media
      },
    };

    try {
      const res = await fetch(`${baseUrl}/api/avisos-comunitarios`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        console.error("crear aviso error:", res.status, await res.text());
        alert("Error al crear aviso comunitario");
        setSubiendo(false);
        return;
      }

      alert("¡Aviso comunitario creado!");
      window.location.href = "/proveedor/panel";
    } catch (err) {
      console.error(err);
      alert("Error inesperado al crear el aviso");
    } finally {
      setSubiendo(false);
    }
  };

  /* ---------- UI ---------- */
  return (
    <form
      onSubmit={handleSubmit}
      className="pt-10 px-6 pb-12 max-w-4xl mx-auto bg-white dark:bg-gray-900 text-gray-900 dark:text-white rounded-xl shadow-lg mt-20"
    >
      <h2 className="text-3xl font-bold mb-6 text-orange-600 dark:text-orange-400">
        Crear Aviso Comunitario
      </h2>

      <input
        className="border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 rounded-lg p-3 w-full mb-6 focus:outline-none focus:ring-2 focus:ring-orange-500"
        placeholder="Título"
        value={titulo}
        required
        onChange={(e) => setTitulo(e.target.value)}
      />

      <textarea
        className="border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 rounded-lg p-3 w-full mb-6 resize-none focus:outline-none focus:ring-2 focus:ring-orange-500"
        rows={4}
        placeholder="Descripción"
        value={descripcion}
        onChange={(e) => setDescripcion(e.target.value)}
      />

      <label className="block font-semibold mb-2 text-gray-800 dark:text-gray-200">
        Estado
      </label>
      <select
        className="border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-lg p-3 w-full mb-6 focus:outline-none focus:ring-2 focus:ring-orange-500"
        value={estado}
        onChange={(e) => setEstado(e.target.value)}
      >
        {ESTADOS.map((opt) => (
          <option key={opt} value={opt}>
            {opt}
          </option>
        ))}
      </select>

      <input
        className="border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 rounded-lg p-3 w-full mb-4 focus:outline-none focus:ring-2 focus:ring-orange-500"
        placeholder="Link de WhatsApp (opcional)"
        value={linkWhatsapp}
        onChange={(e) => setLinkWhatsapp(e.target.value)}
      />

      <input
        className="border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 rounded-lg p-3 w-full mb-6 focus:outline-none focus:ring-2 focus:ring-orange-500"
        placeholder="Link a página externa (opcional)"
        value={linkPagina}
        onChange={(e) => setLinkPagina(e.target.value)}
      />

      <div className="mb-8">
        <label className="block font-semibold mb-3 text-gray-800 dark:text-gray-200">
          Imágenes
        </label>
        <div className="flex gap-4 overflow-x-auto">
          {imagenes.map((img, idx) => {
            const url = getImageUrl(img);
            return (
              <div key={img.id || idx} className="relative flex flex-col items-center">
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
          accept="image/*"
          onChange={handleAddImages}
          disabled={subiendo}
          className="mt-4 text-sm text-gray-800 dark:text-gray-200"
        />
      </div>

      <button
        type="submit"
        disabled={subiendo}
        className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 rounded-lg transition"
      >
        {subiendo ? "Publicando..." : "Publicar aviso"}
      </button>
    </form>
  );
}
