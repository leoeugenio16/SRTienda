"use client";
import { useState } from "react";

export default function SeccionContacto() {
  const [form, setForm] = useState({
    nombre: "",
    email: "",
    mensaje: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const generarMensajeWhatsApp = () => {
    const texto = `Hola! Soy ${form.nombre} (${form.email}) y quería consultar lo siguiente:\n\n${form.mensaje}`;
    const url = `https://wa.me/2604121329?text=${encodeURIComponent(texto)}`;
    window.open(url, "_blank");
  };

  return (
    <section className="py-12 px-4 bg-gray-100 dark:bg-gray-900 text-center">
      <div className="max-w-xl mx-auto">
        <h2 className="text-4xl font-bold text-orange-600 mb-4">
          ¿Querés ser parte?
        </h2>
        <p className="text-gray-700 dark:text-gray-300 mb-6">
          Si querés publicar tus productos o promocionar tu evento en SRtienda,
          completá este formulario y te contactamos por WhatsApp.
        </p>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            generarMensajeWhatsApp();
          }}
          className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow"
        >
          <input
            type="text"
            name="nombre"
            placeholder="Tu nombre"
            required
            onChange={handleChange}
            className="w-full p-3 mb-4 rounded border dark:bg-gray-700"
          />
          <input
            type="email"
            name="email"
            placeholder="Tu email"
            required
            onChange={handleChange}
            className="w-full p-3 mb-4 rounded border dark:bg-gray-700"
          />
          <textarea
            name="mensaje"
            placeholder="Contanos tu idea o consulta"
            required
            onChange={handleChange}
            rows="4"
            className="w-full p-3 mb-4 rounded border dark:bg-gray-700"
          />
          <button
            type="submit"
            className="bg-green-500 hover:bg-green-600 text-white py-2 px-6 rounded-full font-semibold"
          >
            Enviar por WhatsApp
          </button>
        </form>
      </div>
    </section>
  );
}
