import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import Link from 'next/link'

export default async function DashboardPage() {
  const session = await getServerSession(authOptions)
  const user = session?.user as any

  return (
    <main className="p-6">
      <h1 className="text-2xl font-semibold mb-2">Dashboard</h1>
      <p className="text-sm text-gray-600 mb-6">Bienvenido{user?.name ? `, ${user.name}` : ''}. Rol: {user?.role ?? '—'}</p>

      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        <Link href="/productos" className="border rounded p-4 hover:bg-gray-50">
          <h2 className="font-medium">Productos</h2>
          <p className="text-sm text-gray-600">Listado y gestión de productos</p>
        </Link>
      </div>

      <div className="mt-6">
        <form action="/api/auth/signout" method="post">
          <input type="hidden" name="callbackUrl" value="/login" />
          <button className="text-sm text-gray-600 underline">Cerrar sesión</button>
        </form>
      </div>
    </main>
  )
}
