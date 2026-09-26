export const dynamic = 'force-dynamic'
export const revalidate = 0

import { requireAdmin } from '@/lib/admin'
import { revalidatePath } from 'next/cache'
import { notFound } from 'next/navigation'
import Link from 'next/link'

async function adjustBalance(formData: FormData) {
  'use server'
  const { supabase } = await requireAdmin()
  const userId = formData.get('user_id') as string
  const amount = Number(formData.get('amount'))
  const note = (formData.get('note') as string) || 'Admin adjustment'

  if (!amount || amount === 0) return

  const { data: wallet } = await supabase
    .from('wallets')
    .select('balance')
    .eq('user_id', userId)
    .single()

  if (wallet) {
    await supabase
      .from('wallets')
      .update({ balance: Number(wallet.balance) + amount })
      .eq('user_id', userId)

    await supabase.from('transactions').insert({
      user_id: userId,
      amount,
      type: 'admin_adjustment',
      status: 'completed',
      note,
    })
  }

  revalidatePath(`/admin/users/${userId}`)
  revalidatePath('/admin/users')
}

export default async function UserDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const { supabase } = await requireAdmin()

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', id)
    .single()

  if (!profile) notFound()

  const { data: wallet } = await supabase
    .from('wallets')
    .select('*')
    .eq('user_id', id)
    .single()

  const { data: orders } = await supabase
    .from('orders')
    .select('*, services(name)')
    .eq('user_id', id)
    .order('created_at', { ascending: false })
    .limit(20)

  const { data: transactions } = await supabase
    .from('transactions')
    .select('*')
    .eq('user_id', id)
    .order('created_at', { ascending: false })
    .limit(30)

  const { data: topups } = await supabase
    .from('topup_requests')
    .select('*')
    .eq('user_id', id)
    .order('created_at', { ascending: false })
    .limit(10)

  const totalSpent = transactions
    ?.filter((t: any) => t.type === 'order')
    .reduce((a: number, b: any) => a + Math.abs(Number(b.amount)), 0) ?? 0

  return (
    <div className="space-y-6">
      <Link
        href="/admin/users"
        className="text-sm text-blue-600 hover:underline inline-block"
      >
        ← Back to Users
      </Link>

      {/* Profile Card */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-xl md:text-2xl font-bold text-slate-900">
              {profile.username || 'User'}
            </h1>
            <p className="text-sm text-slate-500 mt-1">{profile.email}</p>
            <div className="flex gap-2 mt-2">
              <span
                className={`text-xs px-2 py-1 rounded ${
                  profile.role === 'admin'
                    ? 'bg-purple-100 text-purple-700'
                    : 'bg-slate-100 text-slate-700'
                }`}
              >
                {profile.role}
              </span>
              {profile.whatsapp && (
                <a
                  href={`https://wa.me/${profile.whatsapp.replace(/[^0-9]/g, '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs px-2 py-1 rounded bg-green-100 text-green-700 hover:bg-green-200"
                >
                  💬 {profile.whatsapp}
                </a>
              )}
            </div>
          </div>

          {/* Wallet Balance */}
          <div className="bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl p-4 text-white min-w-[200px]">
            <p className="text-xs opacity-90">Wallet Balance</p>
            <p className="text-3xl font-bold mt-1">
              Rs {Number(wallet?.balance ?? 0).toFixed(2)}
            </p>
            <p className="text-xs opacity-80 mt-2">
              Total Spent: Rs {totalSpent.toFixed(2)}
            </p>
          </div>
        </div>
      </div>

      {/* Adjust Balance */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h2 className="text-lg font-bold text-slate-900 mb-4">
          Adjust Wallet Balance
        </h2>
        <form action={adjustBalance} className="space-y-3">
          <input type="hidden" name="user_id" value={id} />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="md:col-span-1">
              <label className="block text-xs font-semibold text-slate-600 mb-1">
                Amount (+/-)
              </label>
              <input
                type="number"
                name="amount"
                step="0.01"
                placeholder="e.g. 100 or -50"
                required
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-xs font-semibold text-slate-600 mb-1">
                Note
              </label>
              <input
                type="text"
                name="note"
                placeholder="Reason for adjustment"
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm"
              />
            </div>
          </div>
          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg text-sm font-medium"
          >
            Apply Adjustment
          </button>
          <p className="text-xs text-slate-500">
            Positive number = Add funds, Negative = Deduct funds
          </p>
        </form>
      </div>

      {/* Top-up Requests */}
      {topups && topups.length > 0 && (
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-lg font-bold text-slate-900 mb-4">
            Top-up Requests ({topups.length})
          </h2>
          <div className="space-y-2">
            {topups.map((t: any) => (
              <div
                key={t.id}
                className="flex justify-between items-center border border-slate-200 rounded-lg p-3 text-sm"
              >
                <div>
                  <p className="font-medium text-slate-900">
                    Rs {t.amount} via {t.method}
                  </p>
                  <p className="text-xs text-slate-500">
                    TID: {t.txn_ref} • {new Date(t.created_at).toLocaleString()}
                  </p>
                </div>
                <span
                  className={`text-xs px-2 py-1 rounded ${
                    t.status === 'approved'
                      ? 'bg-green-100 text-green-700'
                      : t.status === 'rejected'
                        ? 'bg-red-100 text-red-700'
                        : 'bg-yellow-100 text-yellow-700'
                  }`}
                >
                  {t.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Orders */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h2 className="text-lg font-bold text-slate-900 mb-4">
          Recent Orders ({orders?.length ?? 0})
        </h2>
        {orders && orders.length > 0 ? (
          <div className="space-y-2">
            {orders.map((o: any) => (
              <div
                key={o.id}
                className="border border-slate-200 rounded-lg p-3 text-sm"
              >
                <div className="flex justify-between">
                  <p className="font-medium text-slate-900">
                    #{o.id} — {o.services?.name ?? 'Service'}
                  </p>
                  <span
                    className={`text-xs px-2 py-1 rounded ${
                      o.status === 'completed'
                        ? 'bg-green-100 text-green-700'
                        : o.status === 'canceled'
                          ? 'bg-red-100 text-red-700'
                          : o.status === 'processing'
                            ? 'bg-blue-100 text-blue-700'
                            : 'bg-yellow-100 text-yellow-700'
                    }`}
                  >
                    {o.status}
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-1 truncate">
                  {o.link}
                </p>
                <p className="text-xs text-slate-600 mt-1">
                  Qty: {o.quantity} • Rs {Number(o.charge).toFixed(2)} •{' '}
                  {new Date(o.created_at).toLocaleDateString()}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-slate-500 text-sm">Koi order nahi hai.</p>
        )}
      </div>

      {/* Transactions */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h2 className="text-lg font-bold text-slate-900 mb-4">
          Transactions ({transactions?.length ?? 0})
        </h2>
        {transactions && transactions.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="text-left text-slate-500 border-b">
                <tr>
                  <th className="pb-2">Amount</th>
                  <th className="pb-2">Type</th>
                  <th className="pb-2">Note</th>
                  <th className="pb-2">Date</th>
                </tr>
              </thead>
              <tbody>
                {transactions.map((t: any) => (
                  <tr key={t.id} className="border-b last:border-0">
                    <td
                      className={`py-2 font-medium ${
                        Number(t.amount) >= 0
                          ? 'text-green-600'
                          : 'text-red-600'
                      }`}
                    >
                      {Number(t.amount) >= 0 ? '+' : ''}
                      Rs {Number(t.amount).toFixed(2)}
                    </td>
                    <td className="py-2 text-slate-700 capitalize">
                      {t.type}
                    </td>
                    <td className="py-2 text-slate-500 text-xs">
                      {t.note}
                    </td>
                    <td className="py-2 text-slate-500 text-xs">
                      {new Date(t.created_at).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-slate-500 text-sm">Koi transaction nahi hai.</p>
        )}
      </div>
    </div>
  )
}