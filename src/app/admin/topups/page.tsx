export const dynamic = 'force-dynamic'
export const revalidate = 0

import { requireAdmin } from '@/lib/admin'
import { revalidatePath } from 'next/cache'

async function approveTopup(formData: FormData) {
  'use server'
  const { supabase } = await requireAdmin()

  const id = Number(formData.get('id'))
  const userId = formData.get('user_id') as string
  const amount = Number(formData.get('amount'))

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
  }

  await supabase
    .from('topup_requests')
    .update({
      status: 'approved',
      reviewed_at: new Date().toISOString(),
    })
    .eq('id', id)

  await supabase.from('transactions').insert({
    user_id: userId,
    amount: amount,
    type: 'topup',
    status: 'completed',
    note: `Top-up #${id} approved`,
  })

  revalidatePath('/admin/topups')
  revalidatePath('/admin')
  revalidatePath('/dashboard')
  revalidatePath('/dashboard/topup')
}

async function rejectTopup(formData: FormData) {
  'use server'
  const { supabase } = await requireAdmin()

  const id = Number(formData.get('id'))

  await supabase
    .from('topup_requests')
    .update({
      status: 'rejected',
      reviewed_at: new Date().toISOString(),
      admin_note: 'Rejected by admin',
    })
    .eq('id', id)

  revalidatePath('/admin/topups')
  revalidatePath('/admin')
  revalidatePath('/dashboard')
}

export default async function AdminTopups() {
  const { supabase } = await requireAdmin()

  const { data: requests } = await supabase
    .from('topup_requests')
    .select('*, profiles(email, username)')
    .order('created_at', { ascending: false })

  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-900 mb-6">
        Top-up Requests
      </h1>

      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-100 text-left text-slate-600">
              <tr>
                <th className="px-4 py-3">#</th>
                <th className="px-4 py-3">User</th>
                <th className="px-4 py-3">Amount</th>
                <th className="px-4 py-3">Method</th>
                <th className="px-4 py-3">Sender</th>
                <th className="px-4 py-3">TID</th>
                <th className="px-4 py-3">Proof</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody>
              {requests && requests.length > 0 ? (
                requests.map((r: any) => (
                  <tr key={r.id} className="border-b last:border-0">
                    <td className="px-4 py-3 text-slate-500">#{r.id}</td>
                    <td className="px-4 py-3 font-medium text-slate-900">
                      {r.profiles?.email ?? 'N/A'}
                    </td>
                    <td className="px-4 py-3 font-semibold text-slate-900">
                      Rs {r.amount}
                    </td>
                    <td className="px-4 py-3 capitalize text-slate-700">
                      {r.method}
                    </td>
                    <td className="px-4 py-3 text-slate-600">
                      <div>{r.sender_name}</div>
                      <div className="text-xs text-slate-400">
                        {r.sender_number}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-slate-600">{r.txn_ref}</td>
                    <td className="px-4 py-3">
                      {r.proof_url ? (
                        <a
                          href={`/api/proof?path=${encodeURIComponent(r.proof_url)}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-700 underline text-xs font-medium"
                        >
                          📷 View
                        </a>
                      ) : (
                        <span className="text-xs text-slate-400">No proof</span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`text-xs px-2 py-1 rounded font-medium ${
                          r.status === 'approved'
                            ? 'bg-green-100 text-green-800'
                            : r.status === 'rejected'
                              ? 'bg-red-100 text-red-800'
                              : 'bg-yellow-100 text-yellow-800'
                        }`}
                      >
                        {r.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      {r.status === 'pending' ? (
                        <div className="flex gap-2 justify-end">
                          <form action={approveTopup}>
                            <input type="hidden" name="id" value={r.id} />
                            <input
                              type="hidden"
                              name="user_id"
                              value={r.user_id}
                            />
                            <input
                              type="hidden"
                              name="amount"
                              value={r.amount}
                            />
                            <button
                              type="submit"
                              className="bg-green-600 hover:bg-green-700 text-white px-3 py-1.5 rounded-lg text-xs font-medium"
                            >
                              Approve
                            </button>
                          </form>
                          <form action={rejectTopup}>
                            <input type="hidden" name="id" value={r.id} />
                            <button
                              type="submit"
                              className="bg-red-600 hover:bg-red-700 text-white px-3 py-1.5 rounded-lg text-xs font-medium"
                            >
                              Reject
                            </button>
                          </form>
                        </div>
                      ) : (
                        <span className="text-xs text-slate-400">—</span>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={9}
                    className="px-4 py-8 text-center text-slate-500"
                  >
                    Abhi koi top-up request nahi hai.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}