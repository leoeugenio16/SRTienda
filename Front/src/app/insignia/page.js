export default function InsigniaPage() {
  return (
    <div className="max-w-3xl mx-auto p-6 text-gray-800 dark:text-gray-200">
      <h1 className="text-3xl font-bold mb-6 text-center">🔒 Venta Segura</h1>

      <p className="mb-4">
        <strong>Venta Segura</strong> es un servicio de gestión de pagos pensado para ofrecer más tranquilidad en las
        compras entre personas. Su objetivo es evitar el uso de efectivo y proteger tanto a compradores como vendedores
        mediante una intermediación simple.
      </p>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-2">✅ ¿Qué hace el sistema?</h2>
        <ul className="list-disc list-inside space-y-2">
          <li><strong>1.</strong> El comprador transfiere el dinero a la cuenta de la plataforma.</li>
          <li><strong>2.</strong> El vendedor coordina la entrega del producto o servicio.</li>
          <li><strong>3.</strong> Ambas partes confirman que la operación se completó correctamente.</li>
          <li>Una vez confirmada, la plataforma libera el pago al vendedor.</li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-2">🧾 ¿Qué NO hace este sistema?</h2>
        <ul className="list-disc list-inside space-y-2">
          <li>No valida productos ni servicios ofrecidos por los vendedores.</li>
          <li>No actúa como mediador ante conflictos o desacuerdos.</li>
          <li>No garantiza devoluciones automáticas.</li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-2">💡 ¿Por qué usar Venta Segura?</h2>
        <ul className="list-disc list-inside space-y-2">
          <li>🔐 Más confianza para el comprador.</li>
          <li>🛡️ Más profesionalismo y seguridad para el vendedor.</li>
          <li>📱 Evita intercambios de dinero en efectivo o transferencias directas.</li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-2">🕑 ¿Qué pasa si una parte no responde?</h2>
        <p className="mb-2">
          Si después del encuentro no hay confirmación de ambas partes:
        </p>
        <ul className="list-disc list-inside space-y-2">
          <li>Se intenta contactar a ambas personas.</li>
          <li>Si el comprador responde negativamente, no se libera el pago.</li>
          <li>Si nadie responde en 5 días, el pago se libera automáticamente al vendedor.</li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-2">📌 Importante</h2>
        <p>
          <strong>Venta Segura no es un seguro.</strong> Es un sistema de confianza que ayuda a gestionar el dinero de
          forma segura. La plataforma no garantiza los productos ni servicios, solo administra el proceso de pago para
          reducir riesgos. Siempre recomendás entregar en lugares públicos y acordar claramente los términos.
        </p>
      </section>

      <section className="mb-8 text-center">
        <p className="font-medium">
          Si sos proveedor y querés que tus productos incluyan Venta Segura, escribinos desde tu panel o por WhatsApp 📲.
        </p>
      </section>
    </div>
  );
}
