"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [form, setForm] = useState({ identifier: "", password: "" });
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      // 1. Login
      const res = await fetch(`${process.env.NEXT_PUBLIC_STRAPI_URL}/api/auth/local`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!data.jwt) {
        setError(data.error?.message || "Credenciales inválidas");
        return;
      }

      // 2. Guardar token y usuario
      localStorage.setItem("token", data.jwt);
      localStorage.setItem("user", JSON.stringify(data.user));

      // 3. Obtener el rol desde /users/me
      const meRes = await fetch(`${process.env.NEXT_PUBLIC_STRAPI_URL}/api/users/me?populate=role`, {
        headers: {
          Authorization: `Bearer ${data.jwt}`,
        },
      });

      if (!meRes.ok) {
        throw new Error("No se pudo obtener el rol del usuario.");
      }

      const userData = await meRes.json();
      const rolNombre = userData.role?.name?.toLowerCase().trim();
      console.log("Rol detectado:", rolNombre);

      // 4. Redirigir según el rol
      if (rolNombre === "super admin") {
        router.push("/administracion");
      } else if (rolNombre === "authenticated") {
        router.push("/proveedor/panel");
      } else {
        setError("Rol no autorizado.");
      }

    } catch (err) {
      console.error(err);
      setError("Ocurrió un error al iniciar sesión.");
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
          className="w-full p-3 rounded-full border bg-white dark:bg-gray-800"
        />
        <input
          type="password"
          placeholder="Contraseña"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
          required
          className="w-full p-3 rounded-full border bg-white dark:bg-gray-800"
        />
        <button
          type="submit"
          className="w-full bg-orange-500 text-white py-3 rounded-full font-semibold hover:bg-orange-600 transition"
        >
          Ingresar
        </button>
      </form>
    </section>
  );
}
