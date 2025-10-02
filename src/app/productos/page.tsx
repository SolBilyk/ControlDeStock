"use client"
import useSWR from 'swr'
import Link from 'next/link'
import { useState } from 'react'

const fetcher = (url: string) => fetch(url).then((r) => r.json())

export default function ProductosPage() {
  const [q, setQ] = useState('')
  const { data, isLoading, mutate } = useSWR(`/api/productos?q=${encodeURIComponent(q)}`, fetcher)
  const items = data?.items ?? []

  return (
    <main className="p-6">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-semibold">Productos</h1>
        <Link href="/productos/nuevo" className="bg-indigo-600 text-white px-3 py-2 rounded">Nuevo</Link>
      </div>

      <div className="mb-4 flex gap-2">
        <input
          className="border px-3 py-2 rounded w-full max-w-sm"
          placeholder="Buscar por nombre, código o barras"
          value={q}
          onChange={(e) => setQ(e.target.value)}
        />
        <button className="border px-3 py-2 rounded" onClick={() => mutate()}>Buscar</button>
      </div>

      {isLoading ? (
        <p>Cargando...</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full border">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left p-2 border">Código</th>
                <th className="text-left p-2 border">Nombre</th>
                <th className="text-left p-2 border">Precio (base)</th>
                <th className="text-left p-2 border">Activo</th>
                <th className="text-left p-2 border">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {items.map((p: any) => (
                <tr key={p.id} className="hover:bg-gray-50">
                  <td className="p-2 border">{p.code}</td>
                  <td className="p-2 border">{p.name}</td>
                  <td className="p-2 border">{p.priceBase}</td>
                  <td className="p-2 border">{p.active ? 'Sí' : 'No'}</td>
                  <td className="p-2 border">
                    <Link className="text-indigo-600" href={`/productos/${p.id}`}>Editar</Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </main>
  )
}
