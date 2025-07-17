"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [form, setForm] = useState({ identifier: "", password: "" });
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    const res = await fetch(`${process.env.NEXT_PUBLIC_STRAPI_URL}/api/auth/local`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    const data = await res.json();

    if (data.jwt) {
      localStorage.setItem("token", data.jwt);
      localStorage.setItem("user", JSON.stringify(data.user));
      router.push("/proveedor/panel");
    } else {
      setError(data.error?.message || "Credenciales inválidas");
    }
  };

  return (
    <section className="pt-20 p-6 max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-4 text-center text-orange-600">
        Iniciar Sesión
      </h1>
      {error && <p className="text-red-600 mb-3">{error}</p>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="email"
          placeholder="Email"
          value={form.identifier}
          onChange={(e) => setForm({ ...form, identifier: e.target.value })}
          required
          className="
          w-full p-3 rounded-full border border-gray-300 
          bg-white text-gray-900 placeholder-gray-400
          dark:bg-gray-800 dark:border-gray-600 dark:text-white dark:placeholder-gray-500
          focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500
          transition
        "
        />
        <input
          type="password"
          placeholder="Contraseña"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
          required
          className="
          w-full p-3 rounded-full border border-gray-300 
          bg-white text-gray-900 placeholder-gray-400
          dark:bg-gray-800 dark:border-gray-600 dark:text-white dark:placeholder-gray-500
          focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500
          transition
        "
        />
        <button
          type="submit"
          className="
          w-full bg-orange-500 text-white py-3 rounded-full font-semibold
          hover:bg-orange-600 transition
        "
        >
          Ingresar
        </button>
      </form>
    </section>
  );

}
