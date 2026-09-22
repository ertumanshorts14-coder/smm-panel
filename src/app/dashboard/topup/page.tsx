export const dynamic = 'force-dynamic'
export const revalidate = 0

import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'
import Link from 'next/link'
import SubmitButton from '@/app/components/SubmitButton'

async function submitTopup(formData: FormData) {
  'use server'
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const amount = Number(formData.get('amount'))
  const method = formData.get('method') as string
  const sender_name = formData.get('sender_name') as string
  const sender_number = formData.get('sender_number') as string
  const txn_ref = formData.get('txn_ref') as string
  const file = formData.get('proof') as File | null

  if (!amount || amount < 50) {
    redirect(
      `/dashboard/topup?error=${encodeURIComponent('Minimum top-up Rs 50 hai')}`
    )
  }

  let proof_url: string | null = null

  if (file && file.size > 0) {
    const ext = file.name.split('.').pop()
    const path = `${user.id}/${Date.now()}.${ext}`
    const { error: upErr } = await supabase.storage
      .from('proofs')
      .upload(path, file)
    if (!upErr) proof_url = path
  }

  await supabase.from('topup_requests').insert({
    user_id: user.id,
    amount,
    method,
    sender_name,
    sender_number,
    txn_ref,
    proof_url,
    status: 'pending',
  })

  revalidatePath('/dashboard/topup')
  revalidatePath('/dashboard')
  redirect('/dashboard/topup?ok=1')
}

export default async function TopupPage({
  searchParams,
}: {
  searchParams: Promise<{ ok?: string; error?: string }>
}) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { ok, error } = await searchParams

  const { data: requests } = await supabase
    .from('topup_requests')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  const { data: wallet } = await supabase
    .from('wallets')
    .select('*')
    .eq('user_id', user.id)
    .single()

  return (
    <div className="min-h-screen bg-slate-100">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-4 flex justify-between items-center">
          <Link href="/dashboard" className="text-base md:text-xl font-bold text-slate-900">
            SMUQ SMM
          </Link>
          <div className="flex items-center gap-4">
            <div className="bg-green-50 text-green-700 px-3 md:px-4 py-2 rounded-lg font-semibold text-xs md:text-sm">
              Rs {wallet?.balance ?? 0}
            </div>
            <Link href="/dashboard" className="text-xs md:text-sm text-blue-600 hover:underline">
              ← Back
            </Link>
          </div>
        </div>
      </header>

      {ok === '1' && (
        <div className="max-w-4xl mx-auto px-4 md:px-6 pt-4">
          <div className="bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded-lg text-sm">
            ✅ Top-up request submit ho gayi! Admin 5-30 minute mein approve karega.
          </div>
        </div>
      )}

      {error && (
        <div className="max-w-4xl mx-auto px-4 md:px-6 pt-4">
          <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg text-sm">
            ❌ {decodeURIComponent(error)}
          </div>
        </div>
      )}

      <div className="max-w-4xl mx-auto p-4 md:p-6 space-y-6">
        {/* Payment Methods */}
        <div className="bg-white rounded-xl shadow-sm p-4 md:p-6">
          <h2 className="text-base md:text-lg font-bold text-slate-900 mb-4">Payment Methods</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* SadaPay */}
            <div className="border border-green-200 rounded-lg p-4 bg-green-50/30">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-2 h-2 rounded-full bg-green-500"></div>
                <p className="font-bold text-green-700">SadaPay</p>
              </div>
              <div className="space-y-2 text-sm">
                <div>
                  <p className="text-slate-500 text-xs">Account Title</p>
                  <p className="font-semibold text-slate-900">Muhammed Umar</p>
                </div>
                <div>
                  <p className="text-slate-500 text-xs">Account Number</p>
                  <p className="font-semibold text-slate-900">0319-7399588</p>
                </div>
                <div>
                  <p className="text-slate-500 text-xs">IBAN</p>
                  <p className="font-mono text-xs text-slate-900 break-all">
                    PK91SADA0000003197399588
                  </p>
                </div>
              </div>
            </div>

            {/* NayaPay */}
            <div className="border border-blue-200 rounded-lg p-4 bg-blue-50/30">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                <p className="font-bold text-blue-700">NayaPay</p>
              </div>
              <div className="space-y-2 text-sm">
                <div>
                  <p className="text-slate-500 text-xs">Account Title</p>
                  <p className="font-semibold text-slate-900">Muhammed Umar</p>
                </div>
                <div>
                  <p className="text-slate-500 text-xs">Account Number</p>
                  <p className="font-semibold text-slate-900">0319-7399588</p>
                </div>
                <div>
                  <p className="text-slate-500 text-xs">IBAN</p>
                  <p className="font-mono text-xs text-slate-900 break-all">
                    PK30NAYA1234503197399588
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="text-xs text-blue-700 bg-blue-50 border border-blue-200 rounded-lg p-3 mt-4">
            ℹ️ Payment ke baad neeche form mein <b>TID (Transaction ID)</b> aur{" "}
            <b>screenshot</b> zaroor bhejein. Admin 5-30 minute mein verify karega.
          </div>
        </div>

        {/* Form */}
        <div className="bg-white rounded-xl shadow-sm p-4 md:p-6">
          <h2 className="text-base md:text-lg font-bold text-slate-900 mb-4">
            Submit Top-up Request
          </h2>

          <form action={submitTopup} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Amount (PKR)
                </label>
                <input
                  type="number"
                  name="amount"
                  required
                  min={50}
                  placeholder="100"
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900 text-sm"
                />
                <p className="text-xs text-slate-500 mt-1">Minimum Rs 50</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Method
                </label>
                <select
                  name="method"
                  required
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900 text-sm"
                >
                  <option value="">-- Select --</option>
                  <option value="sadapay">SadaPay</option>
                  <option value="nayapay">NayaPay</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Sender Name
                </label>
                <input
                  type="text"
                  name="sender_name"
                  required
                  placeholder="Your Name"
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900 text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Sender Number
                </label>
                <input
                  type="text"
                  name="sender_number"
                  required
                  placeholder="03XX-XXXXXXX"
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900 text-sm"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Transaction ID / TID
              </label>
              <input
                type="text"
                name="txn_ref"
                required
                placeholder="e.g., 1234567890"
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900 text-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Payment Screenshot (recommended)
              </label>
              <input
                type="file"
                name="proof"
                accept="image/*"
                className="w-full px-4 py-2 border border-slate-300 rounded-lg text-slate-900 text-sm"
              />
            </div>

            <SubmitButton
              loadingText="Submitting..."
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-medium transition"
            >
              Submit Request
            </SubmitButton>
          </form>
        </div>

        {/* Past requests */}
        <div className="bg-white rounded-xl shadow-sm p-4 md:p-6">
          <h2 className="text-base md:text-lg font-bold text-slate-900 mb-4">
            My Requests
          </h2>
          {requests && requests.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="text-left text-slate-500 border-b">
                  <tr>
                    <th className="pb-2">Amount</th>
                    <th className="pb-2">Method</th>
                    <th className="pb-2">TID</th>
                    <th className="pb-2">Status</th>
                    <th className="pb-2">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {requests.map((r: any) => (
                    <tr key={r.id} className="border-b last:border-0 text-slate-900">
                      <td className="py-2">Rs {r.amount}</td>
                      <td className="py-2 capitalize">{r.method}</td>
                      <td className="py-2">{r.txn_ref}</td>
                      <td className="py-2">
                        <span
                          className={`text-xs px-2 py-1 rounded ${
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
                      <td className="py-2 text-slate-500 text-xs">
                        {new Date(r.created_at).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-slate-500 text-sm">Abhi koi request nahi hai.</p>
          )}
        </div>
      </div>
    </div>
  )
}