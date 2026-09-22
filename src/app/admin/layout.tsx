export const dynamic = 'force-dynamic'
export const revalidate = 0

import Link from 'next/link'
import { requireAdmin } from '@/lib/admin'

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  await requireAdmin()

  return (
    <div className="min-h-screen bg-slate-100">
      {/* Top Header */}
      <div className="bg-slate-900 text-white px-4 py-3 flex justify-between items-center">
        <div className="text-lg font-bold">Admin Panel</div>
        <Link
          href="/dashboard"
          className="text-xs text-slate-300 hover:text-white"
        >
          ← User Dashboard
        </Link>
      </div>

      {/* Nav Tabs — horizontal scroll on mobile */}
      <div className="bg-slate-800 text-white overflow-x-auto">
        <div className="flex gap-1 px-2 py-2 min-w-max">
          <AdminTab href="/admin">Dashboard</AdminTab>
          <AdminTab href="/admin/topups">Top-ups</AdminTab>
          <AdminTab href="/admin/orders">Orders</AdminTab>
          <AdminTab href="/admin/services">Services</AdminTab>
          <AdminTab href="/admin/users">Users</AdminTab>
          <AdminTab href="/admin/tickets">Tickets</AdminTab>
        </div>
      </div>

      {/* Main Content */}
      <main className="p-4 md:p-6">{children}</main>
    </div>
  )
}

function AdminTab({
  href,
  children,
}: {
  href: string
  children: React.ReactNode
}) {
  return (
    <Link
      href={href}
      className="px-3 py-1.5 rounded-lg text-xs md:text-sm font-medium text-slate-300 hover:bg-slate-700 hover:text-white whitespace-nowrap transition"
    >
      {children}
    </Link>
  )
}