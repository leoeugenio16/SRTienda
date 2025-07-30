export const metadata = {
  title: "Política de Privacidad - SRTienda",
  description: "Política de privacidad de la tienda local SRTienda",
};

export default function PoliticaPrivacidadPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-10 text-sm text-gray-800 dark:text-gray-200">
      <h1 className="text-3xl font-bold mb-6">Política de Privacidad</h1>

      <p className="mb-4">
        En <strong>SRTienda</strong>, valoramos tu privacidad. Esta política
        describe cómo recopilamos, usamos y protegemos tu información personal al usar nuestro sitio web.
      </p>

      <h2 className="text-xl font-semibold mt-8 mb-2">1. Información que recopilamos</h2>
      <p className="mb-4">
        Podemos recopilar la siguiente información:
        <ul className="list-disc list-inside ml-4 mt-2">
          <li>Nombre y datos de contacto al registrarte</li>
          <li>Dirección de email</li>
          <li>Productos agregados al carrito</li>
          <li>Mensajes que nos envíes</li>
        </ul>
      </p>

      <h2 className="text-xl font-semibold mt-8 mb-2">2. Cómo usamos tu información</h2>
      <p className="mb-4">
        Usamos tus datos para:
        <ul className="list-disc list-inside ml-4 mt-2">
          <li>Mostrarte productos relevantes</li>
          <li>Contactarte ante una consulta o publicación</li>
          <li>Mejorar la experiencia del sitio</li>
        </ul>
      </p>

      <h2 className="text-xl font-semibold mt-8 mb-2">3. Cookies</h2>
      <p className="mb-4">
        Utilizamos cookies propias y de terceros para analizar el uso del sitio
        y ofrecerte una mejor experiencia. Podés desactivar las cookies desde tu navegador si lo deseás.
      </p>

      <h2 className="text-xl font-semibold mt-8 mb-2">4. Seguridad</h2>
      <p className="mb-4">
        Tus datos se almacenan en servicios seguros. No vendemos, alquilamos ni compartimos tu información con terceros, salvo que sea requerido por ley.
      </p>

      <h2 className="text-xl font-semibold mt-8 mb-2">5. Derechos del usuario</h2>
      <p className="mb-4">
        Podés acceder, rectificar o eliminar tus datos personales escribiéndonos a <a href="mailto:sanrafaeltienda@gmail.com" className="underline">sanrafaeltienda@gmail.com</a>.
      </p>

      <h2 className="text-xl font-semibold mt-8 mb-2">6. Cambios</h2>
      <p className="mb-4">
        Esta política puede actualizarse. Te recomendamos revisarla periódicamente.
      </p>

      <p className="mt-8 text-xs text-gray-500 dark:text-gray-400">
        Última actualización: {new Date().toLocaleDateString("es-AR")}
      </p>
    </div>
  );
}
