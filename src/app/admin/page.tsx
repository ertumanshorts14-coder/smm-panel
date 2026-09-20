import { requireAdmin } from '@/lib/admin'

export default async function AdminHome() {
  const { supabase } = await requireAdmin()

  const [
    { count: userCount },
    { count: orderCount },
    { count: pendingTopups },
    { data: wallets },
  ] = await Promise.all([
    supabase.from('profiles').select('*', { count: 'exact', head: true }),
    supabase.from('orders').select('*', { count: 'exact', head: true }),
    supabase
      .from('topup_requests')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'pending'),
    supabase.from('wallets').select('balance'),
  ])

  const totalBalance =
    wallets?.reduce((a, b) => a + Number(b.balance), 0) ?? 0

  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-900 mb-6">
        Admin Overview
      </h1>

      <div className="grid grid-cols-4 gap-4">
        <StatCard label="Total Users" value={userCount ?? 0} />
        <StatCard label="Total Orders" value={orderCount ?? 0} />
        <StatCard
          label="Pending Top-ups"
          value={pendingTopups ?? 0}
          highlight
        />
        <StatCard
          label="Total Wallet Rs"
          value={`Rs ${totalBalance.toFixed(0)}`}
        />
      </div>
    </div>
  )
}

function StatCard({
  label,
  value,
  highlight,
}: {
  label: string
  value: string | number
  highlight?: boolean
}) {
  return (
    <div className="bg-white rounded-xl shadow-sm p-5">
      <p className="text-sm text-slate-500 mb-1">{label}</p>
      <p
        className={`text-2xl font-bold ${
          highlight ? 'text-amber-600' : 'text-slate-900'
        }`}
      >
        {value}
      </p>
    </div>
  )
}