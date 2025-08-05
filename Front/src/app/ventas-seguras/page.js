'use client'

import { useEffect, useState } from 'react'

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
                let url = `${API_URL}/api/venta-seguras?populate=vendedor&populate=comprador`
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
        <section className="p-4">
            <h1 className="text-2xl font-bold mb-6">Ventas Seguras</h1>
            <div className="flex gap-4 mb-4">
                <input type="date" value={fechaInicio} onChange={(e) => setFechaInicio(e.target.value)} />
                <input type="date" value={fechaFin} onChange={(e) => setFechaFin(e.target.value)} />
                <select value={completado} onChange={(e) => setCompletado(e.target.value)}>
                    <option value="">Todos</option>
                    <option value="true">Completado</option>
                    <option value="false">No completado</option>
                </select>
            </div>
            {ventas.length === 0 ? (
                <p>No hay ventas registradas.</p>
            ) : (
                <div className="grid gap-4">
                    {ventas.map((venta) => (
                        <div key={venta.id} className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
                            <div className="flex gap-4 items-center">
                                <div className="flex-1">
                                    <h2 className="text-lg font-semibold">Venta Segura</h2>
                                    <p className="text-sm text-gray-500">
                                        Fecha: {new Date(venta.createdAt).toLocaleDateString()}
                                    </p>
                                    <p className="text-sm text-gray-500">Código: {venta.codigo_entrega}</p>
                                </div>
                            </div>

                            <div className="mt-3 grid grid-cols-2 gap-4 text-sm">
                                <div>
                                    <p className="font-medium">Vendedor:</p>
                                    <p>{venta.vendedor?.username || '—'}</p>
                                </div>
                                <div>
                                    <p className="font-medium">Comprador:</p>
                                    <p>{venta.comprador?.username || '—'}</p>
                                </div>
                            </div>

                            <div className="mt-3 text-sm">
                                <p><strong>Entrega confirmada:</strong> {venta.entrega_confirmada ? 'Sí' : 'No'}</p>
                                <p><strong>Vendedor confirmó:</strong> {venta.vendedor_confirmo ? 'Sí' : 'No'}</p>
                                <p><strong>Comentarios:</strong> {venta.comentarios || '—'}</p>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </section>
    )
}
