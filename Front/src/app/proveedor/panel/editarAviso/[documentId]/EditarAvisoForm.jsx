'use client';
import { getImageUrl } from '../../../../../utils/getImageUrl';
import { useState, useRef } from 'react';

export default function EditarAvisoForm({ aviso, baseUrl, token }) {
  const [titulo, setTitulo] = useState(aviso.titulo || '');
  const [descripcion, setDescripcion] = useState(aviso.descripcion || '');
  const [estado, setEstado] = useState(aviso.estado || 'Anuncio');
  const [linkWhatsapp, setLinkWhatsapp] = useState(aviso.link_whatsapp || '');
  const [linkPagina, setLinkPagina] = useState(aviso.link_pagina || '');

  const initialImages = aviso.imagenes || [];
  const [imagenes, setImagenes] = useState(initialImages);
  const [subiendo, setSubiendo] = useState(false);

  const fileInputRefs = useRef({});

  async function handleReplaceImage(id, e) {
    const file = e.target.files?.[0];
    if (!file) return;

    setSubiendo(true);
    const formData = new FormData();
    formData.append('files', file);

    try {
      const res = await fetch(`${baseUrl}/api/upload`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });
      const uploaded = await res.json();
      const newImage = Array.isArray(uploaded) ? uploaded[0] : uploaded;

      setImagenes(prev => prev.map(img => (img.id === id ? newImage : img)));
    } catch (error) {
      console.error('Error al reemplazar imagen:', error);
      alert('Error al reemplazar imagen');
    } finally {
      setSubiendo(false);
    }
  }

  function triggerFileInput(id) {
    if (fileInputRefs.current[id]) fileInputRefs.current[id].click();
  }

  async function handleFileChange(e) {
    const files = e.target.files;
    if (!files?.length) return;

    setSubiendo(true);
    const formData = new FormData();
    [...files].forEach(f => formData.append('files', f));

    try {
      const res = await fetch(`${baseUrl}/api/upload`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });
      const uploaded = await res.json();
      const newImages = Array.isArray(uploaded) ? uploaded : [uploaded];
      setImagenes(prev => [...prev, ...newImages]);
    } catch (error) {
      console.error('Error al subir imágenes:', error);
      alert('Error al subir imágenes');
    } finally {
      setSubiendo(false);
    }
  }

  async function handleRemoveImage(id) {
    try {
      await fetch(`${baseUrl}/api/upload/files/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      setImagenes(prev => prev.filter(img => img.id !== id));
    } catch (error) {
      console.error('Error al eliminar imagen:', error);
      alert('Error al eliminar imagen');
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();

    const payload = {
      data: {
        titulo,
        descripcion,
        estado,
        link_whatsapp: linkWhatsapp || null,
        link_pagina: linkPagina || null,
        imagenes: imagenes.map(img => img.id),
      },
    };

    try {
      const res = await fetch(`${baseUrl}/api/avisos-comunitarios/${aviso.documentId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error('Error al actualizar aviso');

      alert('¡Aviso actualizado!');
    } catch (error) {
      console.error('Error al actualizar aviso:', error);
      alert(error.message);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="pt-10 px-6 pb-12 max-w-4xl mx-auto bg-white dark:bg-gray-900 text-gray-900 dark:text-white rounded-xl shadow-lg mt-20"
    >
      <h2 className="text-3xl font-bold mb-6 text-orange-600 dark:text-orange-400">
        Editar Aviso {aviso.titulo}
      </h2>

      <input
        type="text"
        value={titulo}
        onChange={e => setTitulo(e.target.value)}
        placeholder="Título"
        required
        className="border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 rounded-lg p-3 w-full mb-6 focus:outline-none focus:ring-2 focus:ring-orange-500"
      />

      <textarea
        value={descripcion}
        onChange={e => setDescripcion(e.target.value)}
        placeholder="Descripción"
        rows={4}
        className="border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 rounded-lg p-3 w-full mb-6 resize-none focus:outline-none focus:ring-2 focus:ring-orange-500"
      />

      <label className="block mb-2 font-semibold">Estado</label>
      <select
        value={estado}
        onChange={e => setEstado(e.target.value)}
        className="border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 rounded-lg p-3 w-full mb-6 focus:outline-none focus:ring-2 focus:ring-orange-500"
      >
        {['Perdido', 'Encontrado', 'Anuncio'].map(opt => (
          <option key={opt} value={opt}>{opt}</option>
        ))}
      </select>

      <input
        value={linkWhatsapp}
        onChange={e => setLinkWhatsapp(e.target.value)}
        placeholder="Link de WhatsApp (opcional)"
        className="border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 rounded-lg p-3 w-full mb-4 focus:outline-none focus:ring-2 focus:ring-orange-500"
      />

      <input
        value={linkPagina}
        onChange={e => setLinkPagina(e.target.value)}
        placeholder="Link a página externa (opcional)"
        className="border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 rounded-lg p-3 w-full mb-6 focus:outline-none focus:ring-2 focus:ring-orange-500"
      />

      <div className="mb-8">
        <label className="block mb-3 font-semibold">Imágenes actuales</label>
        <div className="flex gap-4 overflow-x-auto mb-4">
          {imagenes.length === 0 && (
            <p className="text-gray-500 italic">No hay imágenes cargadas.</p>
          )}
          {imagenes.map((img, idx) => {
            const key = img.id || img.documentId || `temp-${idx}`;
            const fullUrl = getImageUrl(img);
            return (
              <div key={key} className="relative flex flex-col items-center">
                <img
                  src={fullUrl}
                  alt={`Miniatura ${idx + 1}`}
                  className="h-24 w-24 object-cover border rounded-lg shadow-md"
                />
                <div className="flex justify-center gap-3 mt-2">
                  <button
                    type="button"
                    onClick={() => handleRemoveImage(img.id)}
                    className="bg-red-600 text-white rounded-full px-4 py-1.5 shadow-md hover:bg-red-700 text-sm font-semibold"
                  >
                    Eliminar
                  </button>
                  <button
                    type="button"
                    onClick={() => triggerFileInput(img.id)}
                    className="bg-blue-600 text-white rounded-full px-4 py-1.5 shadow-md hover:bg-blue-700 text-sm font-semibold"
                  >
                    Cambiar
                  </button>
                </div>
                <input
                  type="file"
                  accept="image/*"
                  style={{ display: 'none' }}
                  ref={el => (fileInputRefs.current[img.id] = el)}
                  onChange={e => handleReplaceImage(img.id, e)}
                  disabled={subiendo}
                />
              </div>
            );
          })}
        </div>

        <label className="block mb-2 font-semibold">Agregar nuevas imágenes</label>
        <input
          type="file"
          multiple
          onChange={handleFileChange}
          disabled={subiendo}
          className="w-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-orange-500"
        />
      </div>

      <button
        type="submit"
        disabled={subiendo}
        className="w-full bg-orange-500 text-white font-semibold py-3 rounded-lg hover:bg-orange-600 transition"
      >
        {subiendo ? 'Subiendo...' : 'Guardar cambios'}
      </button>
    </form>
  );
}
