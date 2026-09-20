import Link from 'next/link'
import { requireAdmin } from '@/lib/admin'

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  await requireAdmin()

  return (
    <div className="min-h-screen flex bg-slate-100">
      <aside className="w-56 bg-slate-900 text-white p-4 min-h-screen">
        <div className="text-xl font-bold mb-6 px-3">Admin Panel</div>
        <nav className="space-y-1">
          <AdminLink href="/admin">Dashboard</AdminLink>
          <AdminLink href="/admin/topups">Top-ups</AdminLink>
          <AdminLink href="/admin/orders">Orders</AdminLink>
          <AdminLink href="/admin/services">Services</AdminLink>
          <AdminLink href="/admin/users">Users</AdminLink>
        </nav>
        <div className="mt-8 pt-4 border-t border-slate-700">
          <Link
            href="/dashboard"
            className="block px-3 py-2 rounded-lg text-sm text-slate-300 hover:bg-slate-800"
          >
            ← User Dashboard
          </Link>
        </div>
      </aside>

      <main className="flex-1 p-6">{children}</main>
    </div>
  )
}

function AdminLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      className="block px-3 py-2 rounded-lg text-sm font-medium text-slate-300 hover:bg-slate-800 hover:text-white transition"
    >
      {children}
    </Link>
  )
}