'use client'

import { use, useEffect, useState } from 'react'


const API_URL = process.env.NEXT_PUBLIC_STRAPI_URL

export default function ValidarEntregaPage({ params }) {
  const { token } = use(params);
  const [venta, setVenta] = useState(null)
  const [email, setEmail] = useState('')
  const [codigo, setCodigo] = useState('')
  const [estado, setEstado] = useState('verificando') // 'verificando' | 'listo' | 'usado' | 'error' | 'ok'
  const [mensaje, setMensaje] = useState('')

  useEffect(() => {
    const fetchVenta = async () => {
      try {
        const res = await fetch(`${API_URL}/api/venta-seguras?filters[token_entrega][$eq]=${token}&populate=vendedor&secret=${process.env.NEXT_PUBLIC_ENTREGA_SECRET}`)
        const data = await res.json()
        const resultado = data.data?.[0]

        if (!resultado) {
          setEstado('error')
          setMensaje('Enlace no válido.')
          return
        }

        if (resultado.token_usado) {
          setEstado('usado')
          setMensaje('Este enlace ya fue utilizado.')
          return
        }

        setVenta({ documentId: resultado.documentId, ...resultado })
        setEstado('listo')
      } catch (error) {
        console.error(error)
        setEstado('error')
        setMensaje('Error al verificar el enlace.')
      }
    }

    fetchVenta()
  }, [token])

  const handleConfirmar = async () => {
    if (!venta) return

    const emailCorrecto = email.trim().toLowerCase() === venta.vendedor?.email?.toLowerCase()
    console.log("vendedor" + venta.vendedor?.email)
    const codigoCorrecto = codigo.trim().toUpperCase() === venta.codigo_entrega?.toUpperCase()

    if (!emailCorrecto) {
      setMensaje('El correo del vendedor no coincide.')
      return
    }

    if (!codigoCorrecto) {
      setMensaje('Código de entrega incorrecto.')
      return
    }

    try {
      const res = await fetch(`${API_URL}/api/venta-seguras/${venta.documentId}?secret=${process.env.NEXT_PUBLIC_ENTREGA_SECRET}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          data: {
            token_usado: true,
            entrega_confirmada: true,
          },
        }),
      })

      if (!res.ok) throw new Error('Error al confirmar entrega.')

      setEstado('ok')
      setMensaje('✅ ¡Compra confirmada con éxito! Muchas gracias.')
    } catch (error) {
      console.error(error)
      setEstado('error')
      setMensaje('Error al registrar la entrega.')
    }
  }

  return (
    <section className="max-w-md mx-auto py-10 px-4">
      <h1 className="text-2xl font-bold text-center text-orange-600 mb-6">Confirmación de entrega</h1>

      {estado === 'verificando' && <p className="text-center">Verificando enlace...</p>}

      {estado === 'usado' || estado === 'error' ? (
        <div className="text-center text-red-600 font-medium">{mensaje}</div>
      ) : null}

      {estado === 'ok' && (
        <div className="text-center text-green-600 font-semibold text-lg">{mensaje}</div>
      )}

      {estado === 'listo' && venta && (
        <div className="space-y-4">
          <p className="text-center text-gray-700 dark:text-gray-300">
            Para confirmar la entrega, ingresá el <strong>correo del vendedor</strong> y el <strong>código de entrega</strong>.
          </p>

          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Correo del vendedor"
            className="w-full p-2 border rounded-md"
          />

          <input
            type="text"
            value={codigo}
            onChange={(e) => setCodigo(e.target.value)}
            placeholder="Código de entrega"
            className="w-full p-2 border rounded-md"
          />

          <button
            onClick={handleConfirmar}
            className="w-full bg-orange-600 text-white py-2 rounded-md hover:bg-orange-700"
          >
            Confirmar entrega
          </button>

          {mensaje && <p className="text-center text-red-500">{mensaje}</p>}
        </div>
      )}
    </section>
  )
}
