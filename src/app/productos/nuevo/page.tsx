"use client"
import { useRouter } from 'next/navigation'
import { useState } from 'react'

export default function NuevoProductoPage() {
  const router = useRouter()
  const [form, setForm] = useState({
    code: '',
    name: '',
    barcode: '',
    category: '',
    unit: '',
    costBase: 0,
    priceBase: 0,
    vatRate: 21,
    stockMin: 0,
    active: true,
  })
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setError(null)
    const res = await fetch('/api/productos', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...form,
        costBase: Number(form.costBase),
        priceBase: Number(form.priceBase),
        vatRate: Number(form.vatRate),
        stockMin: Number(form.stockMin),
        barcode: form.barcode || null,
        category: form.category || null,
        unit: form.unit || null,
      }),
    })
    setSaving(false)
    if (!res.ok) {
      setError('No se pudo crear el producto')
      return
    }
    router.push('/productos')
  }

  return (
    <main className="p-6 max-w-2xl">
      <h1 className="text-2xl font-semibold mb-4">Nuevo producto</h1>
      <form onSubmit={submit} className="grid gap-3">
        <div>
          <label className="block text-sm">Código</label>
          <input className="border rounded px-3 py-2 w-full" value={form.code} onChange={(e) => setForm({ ...form, code: e.target.value })} required />
        </div>
        <div>
          <label className="block text-sm">Nombre</label>
          <input className="border rounded px-3 py-2 w-full" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div>
            <label className="block text-sm">Precio base</label>
            <input type="number" step="0.01" className="border rounded px-3 py-2 w-full" value={form.priceBase} onChange={(e) => setForm({ ...form, priceBase: Number(e.target.value) })} required />
          </div>
          <div>
            <label className="block text-sm">Costo base</label>
            <input type="number" step="0.01" className="border rounded px-3 py-2 w-full" value={form.costBase} onChange={(e) => setForm({ ...form, costBase: Number(e.target.value) })} required />
          </div>
          <div>
            <label className="block text-sm">IVA %</label>
            <input type="number" step="0.01" className="border rounded px-3 py-2 w-full" value={form.vatRate} onChange={(e) => setForm({ ...form, vatRate: Number(e.target.value) })} />
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div>
            <label className="block text-sm">Código barras</label>
            <input className="border rounded px-3 py-2 w-full" value={form.barcode} onChange={(e) => setForm({ ...form, barcode: e.target.value })} />
          </div>
          <div>
            <label className="block text-sm">Categoría</label>
            <input className="border rounded px-3 py-2 w-full" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} />
          </div>
          <div>
            <label className="block text-sm">Unidad</label>
            <input className="border rounded px-3 py-2 w-full" value={form.unit} onChange={(e) => setForm({ ...form, unit: e.target.value })} />
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-sm">Stock mínimo</label>
            <input type="number" step="0.01" className="border rounded px-3 py-2 w-full" value={form.stockMin} onChange={(e) => setForm({ ...form, stockMin: Number(e.target.value) })} />
          </div>
          <div className="flex items-center gap-2 mt-6">
            <input id="activo" type="checkbox" checked={form.active} onChange={(e) => setForm({ ...form, active: e.target.checked })} />
            <label htmlFor="activo" className="text-sm">Activo</label>
          </div>
        </div>
        {error && <p className="text-sm text-red-600">{error}</p>}
        <div className="flex gap-2 mt-2">
          <button disabled={saving} className="bg-indigo-600 text-white px-4 py-2 rounded disabled:opacity-50">Guardar</button>
          <button type="button" className="border px-4 py-2 rounded" onClick={() => history.back()}>Cancelar</button>
        </div>
      </form>
    </main>
  )
}
