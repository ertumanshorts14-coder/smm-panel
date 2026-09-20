import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import LogoutButton from './LogoutButton'

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ order?: string }>
}) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { order: orderParam } = await searchParams

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  const { data: wallet } = await supabase
    .from('wallets')
    .select('*')
    .eq('user_id', user.id)
    .single()

  const { data: orders } = await supabase
    .from('orders')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })
    .limit(5)

  const { data: servicesList } = await supabase
    .from('services')
    .select('id, name')
    .limit(20)

  // Services map
  const serviceMap: Record<number, string> = {}
  servicesList?.forEach((s) => {
    serviceMap[s.id] = s.name
  })

  return (
    <div className="min-h-screen bg-slate-100">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <Link href="/" className="text-xl font-bold text-slate-900">
            SMUQ SMM Panel
          </Link>
          <div className="flex items-center gap-4">
            <div className="bg-green-50 text-green-700 px-4 py-2 rounded-lg font-semibold">
              Rs {wallet?.balance ?? 0}
            </div>
            <span className="text-sm text-slate-600">{user.email}</span>
            <LogoutButton />
          </div>
        </div>
      </header>

      {orderParam === 'success' && (
        <div className="max-w-7xl mx-auto px-6 pt-4">
          <div className="bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded-lg text-sm">
            ✅ Order successfully place ho gaya!
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto p-6 flex gap-6">
        <aside className="w-64 bg-white rounded-xl shadow-sm p-4 h-fit">
          <nav className="space-y-1">
            <SidebarLink href="/dashboard" active>Dashboard</SidebarLink>
            <SidebarLink href="/dashboard/new-order">New Order</SidebarLink>
            <SidebarLink href="/dashboard/services">Services</SidebarLink>
            <SidebarLink href="/dashboard/topup">Add Funds</SidebarLink>
          </nav>
        </aside>

        <main className="flex-1 space-y-6">
          <div className="grid grid-cols-3 gap-4">
            <StatCard label="Wallet Balance" value={`Rs ${wallet?.balance ?? 0}`} />
            <StatCard label="Total Orders" value={orders?.length ?? 0} />
            <StatCard
              label="Username"
              value={profile?.username ?? user.email?.split('@')[0] ?? '-'}
            />
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-lg font-bold text-slate-900 mb-4">Recent Orders</h2>
            {orders && orders.length > 0 ? (
              <table className="w-full text-sm">
                <thead className="text-left text-slate-500 border-b">
                  <tr>
                    <th className="pb-2">Service</th>
                    <th className="pb-2">Link</th>
                    <th className="pb-2">Qty</th>
                    <th className="pb-2">Charge</th>
                    <th className="pb-2">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((o: any) => (
                    <tr key={o.id} className="border-b last:border-0 text-slate-900">
                      <td className="py-2">{serviceMap[o.service_id] ?? '-'}</td>
                      <td className="py-2 truncate max-w-xs">{o.link}</td>
                      <td className="py-2">{o.quantity}</td>
                      <td className="py-2">Rs {o.charge}</td>
                      <td className="py-2">
                        <span className="text-xs px-2 py-1 rounded bg-slate-100">
                          {o.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p className="text-slate-500 text-sm">Abhi koi order nahi hai.</p>
            )}
          </div>
        </main>
      </div>
    </div>
  )
}

function SidebarLink({ href, active, children }: { href: string; active?: boolean; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      className={`block px-4 py-2 rounded-lg text-sm font-medium transition ${
        active
          ? 'bg-blue-600 text-white'
          : 'text-slate-700 hover:bg-slate-100'
      }`}
    >
      {children}
    </Link>
  )
}

function StatCard({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="bg-white rounded-xl shadow-sm p-5">
      <p className="text-sm text-slate-500 mb-1">{label}</p>
      <p className="text-2xl font-bold text-slate-900">{value}</p>
    </div>
  )
}