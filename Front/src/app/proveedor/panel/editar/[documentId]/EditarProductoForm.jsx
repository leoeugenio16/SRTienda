'use client';
import { useState, useRef } from 'react';
const originalWarn = console.warn;

console.warn = (...args) => {
    if (typeof args[0] === 'string' && args[0].includes('unique "key"')) {
        console.trace(...args); // muestra el stack trace del warning
    }
    originalWarn(...args); // sigue mostrando el warning normal
};

export default function EditarProductoForm({ producto, baseUrl }) {
    const [title, setTitle] = useState(producto.title);
    const [description, setDescription] = useState(producto.description);
    const [priceSale, setPriceSale] = useState(producto.price_sale || '');
    const [permitirSugerirPrecio, setPermitirSugerirPrecio] = useState(!!producto.permitirSugerirPrecio);

    const initialImages = producto.images || [];
    const [images, setImages] = useState(initialImages);

    const [uploading, setUploading] = useState(false);

    const [selectedImage, setSelectedImage] = useState(null);
    const fileInputRefs = useRef({});

    console.log('Imágenes iniciales:', initialImages);

    async function handleReplaceImage(id, e) {
        const file = e.target.files[0];
        console.log('Archivo para reemplazar:', file);
        if (!file) return;

        setUploading(true);

        const formData = new FormData();
        formData.append('files', file);

        try {
            const res = await fetch(`${baseUrl}/api/upload`, {
                method: 'POST',
                body: formData,
            });
            const uploadedImages = await res.json();
            console.log('Respuesta upload reemplazo:', uploadedImages);

            const newImage = Array.isArray(uploadedImages) ? uploadedImages[0] : uploadedImages;

            setImages(prev => prev.map(img => (img.id === id ? newImage : img)));
            console.log('Imágenes actualizadas tras reemplazo:', images);
        } catch (error) {
            console.error('Error al reemplazar imagen:', error);
            alert('Error al reemplazar imagen');
        } finally {
            setUploading(false);
        }
    }

    function triggerFileInput(id) {
        console.log('Trigger input file para imagen id:', id);
        if (fileInputRefs.current[id]) {
            fileInputRefs.current[id].click();
        }
    }

    async function handleFileChange(e) {
        const files = e.target.files;
        console.log('Archivos nuevos para subir:', files);
        if (!files.length) return;

        setUploading(true);

        const formData = new FormData();
        for (let i = 0; i < files.length; i++) {
            formData.append('files', files[i]);
        }

        try {
            const res = await fetch(`${baseUrl}/api/upload`, {
                method: 'POST',
                body: formData,
            });
            const uploadedImages = await res.json();
            console.log('Respuesta upload nuevas imágenes:', uploadedImages);

            const newImages = Array.isArray(uploadedImages) ? uploadedImages : [uploadedImages];
            setImages(prev => [...prev, ...newImages]);
            console.log('Imágenes tras agregar nuevas:', images);
        } catch (error) {
            console.error('Error al subir imágenes:', error);
            alert('Error al subir imágenes');
        } finally {
            setUploading(false);
        }
    }

    async function handleRemoveImage(id) {
        console.log('Eliminar imagen id:', id);
        try {
            await fetch(`${baseUrl}/api/upload/files/${id}`, {
                method: 'DELETE',
            });
            setImages(prev => prev.filter(img => img.id !== id));
            console.log('Imágenes tras eliminar:', images);
        } catch (error) {
            console.error('Error al eliminar imagen:', error);
            alert('Error al eliminar imagen');
        }
    }

    async function handleSubmit(e) {
        e.preventDefault();

        const payload = {
            data: {
                title,
                description,
                price_sale: Number(priceSale),
                permitirSugerirPrecio,
                images: images.map(img => img.id),
            }
        };

        console.log('Payload para actualizar producto:', payload);

        try {
            const res = await fetch(`${baseUrl}/api/products/${producto.documentId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });

            if (!res.ok) throw new Error('Error al actualizar producto');

            alert('Producto actualizado!');
        } catch (error) {
            console.error('Error al actualizar producto:', error);
            alert(error.message);
        }
    }

    return (
        <form
            onSubmit={handleSubmit}
            className="pt-10 px-6 pb-12 max-w-4xl mx-auto bg-white rounded-xl shadow-lg text-gray-900 mt-20"
        >
            <h2 className="text-3xl font-bold mb-6 text-orange-600">
                Editar Producto {producto.title}
            </h2>

            <input
                type="text"
                name="title"
                value={title}
                onChange={e => setTitle(e.target.value)}
                placeholder="Título"
                required
                className="border border-gray-300 rounded-lg p-3 w-full mb-6 focus:outline-none focus:ring-2 focus:ring-orange-500 transition"
            />

            <textarea
                name="description"
                value={description}
                onChange={e => setDescription(e.target.value)}
                placeholder="Descripción"
                rows={4}
                className="border border-gray-300 rounded-lg p-3 w-full mb-6 resize-none focus:outline-none focus:ring-2 focus:ring-orange-500 transition"
            />

            <input
                type="number"
                name="price_sale"
                value={priceSale}
                onChange={e => setPriceSale(e.target.value)}
                placeholder="Precio de venta"
                className="border border-gray-300 rounded-lg p-3 w-full mb-6 focus:outline-none focus:ring-2 focus:ring-orange-500 transition"
            />

            <label className="flex items-center mb-6 gap-3 text-gray-700 font-medium">
                <input
                    type="checkbox"
                    name="permitirSugerirPrecio"
                    checked={permitirSugerirPrecio}
                    onChange={e => setPermitirSugerirPrecio(e.target.checked)}
                    className="w-5 h-5 rounded border-gray-300 focus:ring-2 focus:ring-orange-500"
                />
                Permitir sugerir precio
            </label>

            <div>
                <label className="block mb-3 font-semibold text-gray-800">Imágenes actuales:</label>
                <div className="flex gap-4 overflow-x-auto mb-8">
                    {images.length === 0 && (
                        <p className="text-gray-500 italic">No hay imágenes cargadas.</p>
                    )}
                    {images.map((img, idx) => {
                        const key = img.documentId || img.id || `temp-${idx}`; // fallback seguro

                        const fullUrl = getImageUrl(img);

                        return (
                            <div
                                key={img.id}
                                className="relative flex flex-col items-center"
                            >
                                <img
                                    src={fullUrl}
                                    alt={`Miniatura ${idx + 1}`}
                                    onClick={() => {
                                        setSelectedImage(fullUrl);
                                    }}
                                    className={`h-24 w-24 object-cover cursor-pointer border rounded-lg shadow-md hover:scale-105 transition-transform duration-200 ${selectedImage === fullUrl ? "ring-4 ring-orange-500" : ""
                                        }`}
                                />
                                <div className="flex justify-center gap-3 mt-2">
                                    <button
                                        type="button"
                                        onClick={() => handleRemoveImage(img.id)}
                                        className="bg-red-600 text-white rounded-full px-4 py-1.5 shadow-md hover:bg-red-700 transition-colors font-semibold text-sm"
                                    >
                                        Eliminar
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => triggerFileInput(img.id)}
                                        className="bg-blue-600 text-white rounded-full px-4 py-1.5 shadow-md hover:bg-blue-700 transition-colors font-semibold text-sm"
                                    >
                                        Cambiar
                                    </button>
                                </div>
                                <input
                                    type="file"
                                    accept="image/*"
                                    style={{ display: "none" }}
                                    ref={(el) => (fileInputRefs.current[img.id] = el)}
                                    onChange={(e) => handleReplaceImage(img.id, e)}
                                    disabled={uploading}
                                />
                            </div>
                        );
                    })}
                </div>
            </div>

            <div className="mb-8">
                <label className="block mb-3 font-semibold text-gray-800">
                    Agregar nuevas imágenes:
                </label>
                <input
                    type="file"
                    multiple
                    onChange={handleFileChange}
                    disabled={uploading}
                    className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-orange-500 transition"
                />
            </div>

            <button
                type="submit"
                disabled={uploading}
                className="w-full bg-orange-500 text-white font-semibold py-3 rounded-lg hover:bg-orange-600 transition"
            >
                {uploading ? "Subiendo..." : "Guardar cambios"}
            </button>
        </form>
    );

}

