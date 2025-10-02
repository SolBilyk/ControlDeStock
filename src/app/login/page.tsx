"use client"
import { signIn } from 'next-auth/react'
import { useState } from 'react'
import Link from 'next/link'

export default function LoginPage() {
  const [email, setEmail] = useState('admin@local.test')
  const [password, setPassword] = useState('Admin123!')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    const res = await signIn('credentials', {
      email,
      password,
      redirect: false,
      callbackUrl: '/dashboard',
    })
    setLoading(false)
    if (res?.error) setError('Credenciales inválidas')
    else if (res?.ok) window.location.href = '/dashboard'
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <form onSubmit={onSubmit} className="w-full max-w-sm bg-white p-6 rounded shadow">
        <h1 className="text-xl font-semibold mb-4">Iniciar sesión</h1>
        <label className="block text-sm mb-1">Email</label>
        <input className="w-full border rounded px-3 py-2 mb-3" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
        <label className="block text-sm mb-1">Contraseña</label>
        <input className="w-full border rounded px-3 py-2 mb-3" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
        {error && <p className="text-red-600 text-sm mb-2">{error}</p>}
        <button disabled={loading} className="w-full bg-indigo-600 text-white py-2 rounded hover:bg-indigo-700 disabled:opacity-50">
          {loading ? 'Ingresando...' : 'Ingresar'}
        </button>
        <p className="text-xs text-gray-500 mt-3">Usuario demo: admin@local.test / Admin123!</p>
        <div className="mt-4 text-center">
          <Link className="text-indigo-600 text-sm" href="/">Volver al inicio</Link>
        </div>
      </form>
    </div>
  )
}
