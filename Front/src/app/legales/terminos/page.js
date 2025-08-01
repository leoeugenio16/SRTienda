"use client";

export default function TerminosPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8 text-sm leading-relaxed">
      <h1 className="text-3xl font-bold mb-6">Términos y Condiciones de Uso</h1>
      <p className="text-gray-500 mb-2">Última actualización: julio de 2025</p>

      <p className="mb-4">
        Bienvenido a <strong>SRTienda</strong>. Al acceder, registrarte o utilizar esta plataforma, aceptás los presentes
        Términos y Condiciones de uso, que regulan la relación entre vos (usuario o proveedor) y el Administrador de esta
        plataforma (Leandro Eugenio y Gerardo Reinoso).
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-2">1. Objeto de la plataforma</h2>
      <p>
        SRTienda es un marketplace local que permite a emprendedores y pequeños negocios de San Rafael (Mendoza, Argentina)
        publicar productos o servicios para ser visualizados por potenciales compradores. No se realiza la compraventa
        directamente desde la plataforma, sino que los interesados se comunican con el proveedor por WhatsApp u otros medios externos.
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-2">2. Registro de usuarios y proveedores</h2>
      <ul className="list-disc pl-5">
        <li>Los usuarios pueden navegar libremente, pero para publicar productos o servicios es obligatorio registrarse.</li>
        <li>Los proveedores deben brindar datos verídicos y mantenerlos actualizados.</li>
        <li>El Administrador puede suspender o limitar cuentas por incumplimientos o usos indebidos.</li>
      </ul>

      <h2 className="text-xl font-semibold mt-6 mb-2">3. Publicación de productos y/o servicios</h2>
      <ul className="list-disc pl-5">
        <li>Cada proveedor tiene una cantidad limitada de publicaciones según sus créditos.</li>
        <li>No se permite contenido ilegal, ofensivo o engañoso.</li>
        <li>El Administrador puede editar o eliminar publicaciones que no cumplan con las reglas.</li>
      </ul>

      <h2 className="text-xl font-semibold mt-6 mb-2">4. Expiración automática</h2>
      <p>
        Las publicaciones duran 31 días. Luego de ese período se ocultan automáticamente. El proveedor puede renovarlas previo aviso.
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-2">5. Relación entre comprador y proveedor</h2>
      <p>
        SRTienda no participa en la transacción comercial. Toda operación, entrega o reclamo es entre proveedor y cliente.
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-2">6. Cancelaciones y devoluciones</h2>
      <p>
        Cada proveedor define su política. El cliente debe contactarse directamente con él para cualquier reclamo.
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-2">7. Propiedad intelectual</h2>
      <p>
        Los contenidos de SRTienda son propiedad del Administrador o los proveedores. No se pueden reutilizar sin autorización.
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-2">8. Seguridad y privacidad</h2>
      <p>
        Se protegen los datos personales conforme a la Ley 25.326. No se ceden datos sin consentimiento. Se pueden usar herramientas
        como Google Analytics para análisis anónimos.
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-2">9. Funcionamiento y disponibilidad</h2>
      <p>
        Se realizan backups automáticos (actualmente en Neon). No se garantiza disponibilidad permanente del servicio.
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-2">10. Cambios en los términos</h2>
      <p>
        SRTienda puede modificar estos Términos con una antelación de 7 días desde su publicación.
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-2">11. Jurisdicción</h2>
      <p>
        Toda disputa será resuelta en los tribunales ordinarios de San Rafael, Mendoza, Argentina.
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-2">12. Contacto</h2>
      <p>
        📧 leandroeugenio1998@gmail.com <br />
        📍 San Rafael, Mendoza, Argentina
      </p>
    </div>
  );
}
