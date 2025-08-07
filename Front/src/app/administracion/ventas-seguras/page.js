'use client'

import { useEffect, useState } from 'react'
import { nanoid } from 'nanoid'


const API_URL = process.env.NEXT_PUBLIC_STRAPI_URL

export default function VentasSegurasPage() {
  const [ventas, setVentas] = useState([])
  const [loading, setLoading] = useState(true)
  const [fechaInicio, setFechaInicio] = useState('')
  const [fechaFin, setFechaFin] = useState('')
  const [completado, setCompletado] = useState('')
  const [autorizado, setAutorizado] = useState(null) // null: aún no se cargó, false: no tiene acceso

  useEffect(() => {
    const verificarRol = async () => {
      const token = localStorage.getItem('token')
      if (!token) {
        setAutorizado(false)
        return
      }

      try {
        const res = await fetch(`${API_URL}/api/users/me?populate=role`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })

        if (!res.ok) throw new Error('Error al verificar rol')

        const data = await res.json()
        if (data.role?.name?.toLowerCase() === 'super admin') {
          setAutorizado(true)
        } else {
          setAutorizado(false)
        }
      } catch (err) {
        console.error('Error al verificar rol:', err)
        setAutorizado(false)
      }
    }

    verificarRol()
  }, [])

  useEffect(() => {
    const fetchVentas = async () => {
      const token = localStorage.getItem('token')
      if (!token) return

      try {
        let url = `${API_URL}/api/venta-seguras?populate=vendedor&populate=comprador&populate=product.provider&populate=product.images`
        if (fechaInicio && fechaFin) {
          url += `&filters[createdAt][$gte]=${fechaInicio}&filters[createdAt][$lte]=${fechaFin}`
        }
        if (completado) {
          url += `&filters[entrega_confirmada]=${completado}`
        }

        const res = await fetch(url, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          cache: 'no-store',
        })

        if (!res.ok) {
          console.error(`Error ${res.status}: ${res.statusText}`)
          return
        }

        const data = await res.json()
        setVentas(data.data || [])
      } catch (err) {
        console.error('Error al obtener ventas seguras:', err)
      } finally {
        setLoading(false)
      }
    }

    if (autorizado) {
      fetchVentas()
    }
  }, [fechaInicio, fechaFin, completado, autorizado])

  if (autorizado === null) return <div className="p-4">Verificando acceso...</div>
  if (!autorizado) return <div className="p-4 text-red-600">Acceso denegado. Solo para Super Admin.</div>
  if (loading) return <div className="p-4">Cargando ventas seguras...</div>

  return (
    <section className="px-4 py-8 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6 text-orange-600 text-center">Panel de Ventas Seguras</h1>

      <div className="grid sm:grid-cols-2 gap-4 mb-6">
        <input
          type="date"
          value={fechaInicio}
          onChange={(e) => setFechaInicio(e.target.value)}
          className="p-2 border rounded-md"
        />
        <input
          type="date"
          value={fechaFin}
          onChange={(e) => setFechaFin(e.target.value)}
          className="p-2 border rounded-md"
        />
        <select
          value={completado}
          onChange={(e) => setCompletado(e.target.value)}
          className="p-2 border rounded-md col-span-full sm:col-span-1"
        >
          <option value="">Todos</option>
          <option value="true">Completado</option>
          <option value="false">No completado</option>
        </select>
      </div>

      {ventas.length === 0 ? (
        <p className="text-center text-gray-500">No hay ventas registradas.</p>
      ) : (
        <ul className="space-y-4">
          {ventas.map((venta) => {
            // Obtener la URL de la primera imagen (thumbnail) del producto si existe
            const imagenUrl =
              venta.product?.images?.data?.[0]?.formats?.thumbnail?.url ||
              venta.product?.images?.data?.[0]?.url ||
              null

            // Formatear url completa (agrega dominio si es url relativa)
            const imagenCompleta = imagenUrl
              ? imagenUrl.startsWith('http')
                ? imagenUrl
                : `${API_URL}${imagenUrl}`
              : null

            const generarCodigo = () => Math.random().toString(36).substring(2, 7).toUpperCase()
            const actualizarCampo = async (ventaId, campo, valor) => {
              const token = localStorage.getItem('token')
              try {
                const res = await fetch(`${API_URL}/api/venta-seguras/${ventaId}`, {
                  method: 'PUT',
                  headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                  },
                  body: JSON.stringify({
                    data: {
                      [campo]: valor,
                    },
                  }),
                })

                if (res.ok) {
                  // Actualizar ventas localmente para reflejar el cambio sin recargar
                  setVentas((prev) =>
                    prev.map((v) =>
                      v.documentId === ventaId ? { ...v, [campo]: valor } : v
                    )
                  )
                } else {
                  console.error(`Error al actualizar ${campo}:`, await res.text())
                }
              } catch (error) {
                console.error('Error al actualizar campo:', error)
              }
            }

            return (
              <li key={venta.id} className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 flex flex-col sm:flex-row gap-4 items-center">
                <div className="flex-shrink-0">
                  {imagenCompleta ? (
                    <img
                      src={imagenCompleta}
                      alt={venta.product?.title || 'Producto'}
                      className="w-20 h-20 object-cover rounded-md"
                    />
                  ) : (
                    <div className="w-20 h-20 bg-gray-200 dark:bg-gray-700 rounded-md flex items-center justify-center text-gray-400">
                      Sin imagen
                    </div>
                  )}
                </div>

                <div className="flex-1">
                  <div className="flex justify-between items-center mb-2">
                    <h2 className="text-lg font-semibold text-gray-800 dark:text-white">
                      Venta #{venta.codigo_entrega}
                    </h2>
                    <span className="text-sm text-gray-500">
                      {new Date(venta.createdAt).toLocaleDateString()}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm text-gray-700 dark:text-gray-300">
                    <div>
                      <p className="font-medium">Vendedor: {venta.vendedor?.username || '—'}</p>
                    </div>
                    <div>
                      <p className="font-medium">Comprador: {venta.comprador?.username || '—'}</p>
                    </div>
                  </div>

                  <div className="mt-3 space-y-1 text-gray-700 dark:text-gray-300 text-sm">
                    <p>
                      <strong>Entrega confirmada:</strong> {venta.entrega_confirmada ? '✅ Sí' : '❌ No'}
                    </p>
                    <p>
                      <strong>Vendedor confirmó:</strong> {venta.vendedor_confirmo ? '✅ Sí' : '❌ No'}
                    </p>
                    <p>
                      <strong>Comentarios:</strong> {venta.comentarios || '—'}
                    </p>
                    <p>
                      <strong>Token entrega:</strong>{' '}
                      {venta.token_entrega ? (
                        <>
                          <span className="font-mono">{venta.token_entrega}</span>{' '}
                          <a
                            href={`/administracion/ventas-seguras/${venta.token_entrega}`}
                            target="_blank"
                            className="text-blue-600 underline text-sm"
                          >
                            Ver enlace
                          </a>
                        </>
                      ) : (
                        '—'
                      )}
                    </p>
                    {/* NUEVO: botón si no tiene token */}
                    {!venta.token_entrega && (
                      <button
                        className="text-sm text-blue-600 underline"
                        onClick={() => actualizarCampo(venta.documentId, 'token_entrega', nanoid(12))}
                      >
                        Generar token de entrega
                      </button>
                    )}
                    <p>
                      <strong>Código entrega:</strong> {venta.codigo_entrega || '—'}
                    </p>
                    {/* NUEVO: botón si no tiene código */}
                    {!venta.codigo_entrega && (
                      <button
                        className="text-sm text-blue-600 underline"
                        onClick={() => actualizarCampo(venta.id, 'codigo_entrega', generarCodigo())}
                      >
                        Generar código de entrega
                      </button>
                    )}
                  </div>

                  <div className="mt-3 space-y-1 text-gray-700 dark:text-gray-300 text-sm">
                    <p>
                      <strong>Producto asociado:</strong> {venta.product?.title || '—'}
                    </p>
                    <p>
                      <strong>Precio:</strong> {venta.product?.price_sale ? `$${venta.product.price_sale.toFixed(2)}` : '—'}
                    </p>
                    <p>
                      <strong>Proveedor:</strong> {venta.product?.provider?.name || '—'}
                    </p>
                  </div>
                </div>
              </li>
            )
          })}
        </ul>
      )}
    </section>
  )
}
