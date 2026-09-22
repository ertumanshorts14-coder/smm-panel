import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import LogoutButton from './LogoutButton'
import MobileNav from './MobileNav'

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

  const serviceMap: Record<number, string> = {}
  servicesList?.forEach((s) => {
    serviceMap[s.id] = s.name
  })

  return (
    <div className="min-h-screen bg-slate-100">
      {/* WhatsApp Channel Banner */}
      <div className="bg-gradient-to-r from-green-500 to-green-600 text-white text-xs md:text-sm">
        <a
          href="https://whatsapp.com/channel/0029VbDOMSuJUM2aIn4SXu3x"
          target="_blank"
          rel="noopener noreferrer"
          className="max-w-7xl mx-auto px-4 md:px-6 py-2 flex items-center justify-center gap-2 hover:bg-black/10 transition"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
          </svg>
          <span className="font-medium">Join WhatsApp Channel for updates →</span>
        </a>
      </div>

      <header className="bg-white shadow-sm border-b sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-3 flex justify-between items-center gap-2">
          <div className="flex items-center gap-1 min-w-0">
            <MobileNav />
            <Link
              href="/"
              className="text-sm md:text-xl font-bold text-slate-900 truncate"
            >
              SMUQ SMM
            </Link>
          </div>
          <div className="flex items-center gap-2 md:gap-4 flex-shrink-0">
            <div className="bg-green-50 text-green-700 px-2 md:px-4 py-1 rounded-lg font-semibold text-xs md:text-sm">
              Rs {wallet?.balance ?? 0}
            </div>
            <div className="hidden md:block">
              <LogoutButton />
            </div>
          </div>
        </div>
      </header>

      {orderParam === 'success' && (
        <div className="max-w-7xl mx-auto px-4 md:px-6 pt-4">
          <div className="bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded-lg text-sm">
            ✅ Order successfully place ho gaya!
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto p-4 md:p-6 flex flex-col md:flex-row gap-4 md:gap-6">
        <aside className="hidden md:block w-64 bg-white rounded-xl shadow-sm p-4 h-fit">
          <nav className="space-y-1">
            <SidebarLink href="/dashboard" active>Dashboard</SidebarLink>
            <SidebarLink href="/dashboard/new-order">New Order</SidebarLink>
            <SidebarLink href="/dashboard/services">Services</SidebarLink>
            <SidebarLink href="/dashboard/topup">Add Funds</SidebarLink>
            <SidebarLink href="/dashboard/tickets">Support</SidebarLink>
          </nav>
        </aside>

        <main className="flex-1 space-y-4 md:space-y-6 min-w-0">
          <div className="grid grid-cols-3 gap-2 md:gap-4">
            <StatCard label="Wallet" value={`Rs ${wallet?.balance ?? 0}`} />
            <StatCard label="Orders" value={orders?.length ?? 0} />
            <StatCard
              label="User"
              value={profile?.username ?? user.email?.split('@')[0]?.slice(0, 8) ?? '-'}
            />
          </div>

          <div className="bg-white rounded-xl shadow-sm p-4 md:p-6">
            <h2 className="text-base md:text-lg font-bold text-slate-900 mb-4">
              Recent Orders
            </h2>
            {orders && orders.length > 0 ? (
              <>
                <div className="hidden md:block overflow-x-auto">
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
                          <td className="py-2">
                            {serviceMap[o.service_id] ?? `Service #${o.service_id}`}
                          </td>
                          <td className="py-2 truncate max-w-xs">{o.link}</td>
                          <td className="py-2">{o.quantity}</td>
                          <td className="py-2">Rs {Number(o.charge).toFixed(2)}</td>
                          <td className="py-2">
                            <StatusBadge status={o.status} />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="md:hidden space-y-3">
                  {orders.map((o: any) => (
                    <div key={o.id} className="border rounded-lg p-3 text-sm">
                      <div className="flex justify-between items-start gap-2 mb-2">
                        <span className="font-semibold text-slate-900 text-xs flex-1 truncate">
                          {serviceMap[o.service_id] ?? `Service #${o.service_id}`}
                        </span>
                        <StatusBadge status={o.status} />
                      </div>
                      <p className="text-slate-500 text-xs truncate mb-2">{o.link}</p>
                      <div className="flex justify-between text-xs text-slate-600">
                        <span>Qty: {o.quantity}</span>
                        <span>Rs {Number(o.charge).toFixed(2)}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <p className="text-slate-500 text-sm">Abhi koi order nahi hai.</p>
            )}
          </div>

          <div className="md:hidden pt-4">
            <LogoutButton />
          </div>
        </main>
      </div>
    </div>
  )
}

function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    completed: 'bg-green-100 text-green-800',
    canceled: 'bg-red-100 text-red-800',
    processing: 'bg-blue-100 text-blue-800',
    pending: 'bg-yellow-100 text-yellow-800',
  }
  return (
    <span className={`text-xs px-2 py-1 rounded whitespace-nowrap ${styles[status] ?? 'bg-slate-100 text-slate-700'}`}>
      {status}
    </span>
  )
}

function SidebarLink({ href, active, children }: { href: string; active?: boolean; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      className={`block px-4 py-2 rounded-lg text-sm font-medium transition ${
        active ? 'bg-blue-600 text-white' : 'text-slate-700 hover:bg-slate-100'
      }`}
    >
      {children}
    </Link>
  )
}

function StatCard({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="bg-white rounded-xl shadow-sm p-3 md:p-5 min-w-0">
      <p className="text-xs md:text-sm text-slate-500 mb-1 truncate">{label}</p>
      <p className="text-base md:text-2xl font-bold text-slate-900 truncate">{value}</p>
    </div>
  )
}