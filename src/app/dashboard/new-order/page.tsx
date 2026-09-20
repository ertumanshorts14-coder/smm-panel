import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'

async function placeOrder(formData: FormData) {
  'use server'
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const service_id = Number(formData.get('service_id'))
  const link = formData.get('link') as string
  const quantity = Number(formData.get('quantity'))

  // Service fetch karo
  const { data: service } = await supabase
    .from('services')
    .select('*')
    .eq('id', service_id)
    .single()

  if (!service) throw new Error('Service not found')

  if (quantity < service.min_qty || quantity > service.max_qty) {
    throw new Error(`Quantity must be between ${service.min_qty} and ${service.max_qty}`)
  }

  const charge = (quantity / 1000) * service.price_per_1000

  // Wallet check karo
  const { data: wallet } = await supabase
    .from('wallets')
    .select('*')
    .eq('user_id', user.id)
    .single()

  if (!wallet || wallet.balance < charge) {
    throw new Error('Insufficient balance. Please top-up first.')
  }

  // Wallet se deduct karo
  await supabase
    .from('wallets')
    .update({ balance: wallet.balance - charge })
    .eq('user_id', user.id)

  // Order create karo
  const { data: order } = await supabase
    .from('orders')
    .insert({
      user_id: user.id,
      service_id,
      link,
      quantity,
      charge,
      status: 'pending',
    })
    .select()
    .single()

  // Transaction record
  await supabase.from('transactions').insert({
    user_id: user.id,
    amount: -charge,
    type: 'order',
    status: 'completed',
    note: `Order #${order?.id} — ${service.name}`,
  })

  redirect('/dashboard?order=success')
}

export default async function NewOrderPage({
  searchParams,
}: {
  searchParams: Promise<{ service?: string }>
}) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { service: preselectedServiceId } = await searchParams

  const { data: services } = await supabase
    .from('services')
    .select('*')
    .eq('active', true)
    .order('category')

  const { data: wallet } = await supabase
    .from('wallets')
    .select('*')
    .eq('user_id', user.id)
    .single()

  return (
    <div className="min-h-screen bg-slate-100">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <Link href="/dashboard" className="text-xl font-bold text-slate-900">
            SMUQ SMM Panel
          </Link>
          <div className="flex items-center gap-4">
            <div className="bg-green-50 text-green-700 px-4 py-2 rounded-lg font-semibold">
              Rs {wallet?.balance ?? 0}
            </div>
            <Link href="/dashboard" className="text-sm text-blue-600 hover:underline">
              ← Back
            </Link>
          </div>
        </div>
      </header>

      <div className="max-w-3xl mx-auto p-6">
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h1 className="text-2xl font-bold text-slate-900 mb-1">New Order</h1>
          <p className="text-slate-500 text-sm mb-6">
            Service select karo, link aur quantity daalo
          </p>

          <form action={placeOrder} className="space-y-5">
            {/* Service */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Service
              </label>
              <select
                name="service_id"
                required
                defaultValue={preselectedServiceId ?? ''}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900"
              >
                <option value="">-- Select a service --</option>
                {services?.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name} — Rs {s.price_per_1000}/1000 ({s.min_qty}–{s.max_qty})
                  </option>
                ))}
              </select>
            </div>

            {/* Link */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Link
              </label>
              <input
                type="url"
                name="link"
                required
                placeholder="https://instagram.com/yourprofile"
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900"
              />
              <p className="text-xs text-slate-500 mt-1">
                Jis page/profile pe service chahiye uska URL
              </p>
            </div>

            {/* Quantity */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Quantity
              </label>
              <input
                type="number"
                name="quantity"
                required
                placeholder="1000"
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900"
              />
              <p className="text-xs text-slate-500 mt-1">
                Service ke min/max range ke andar
              </p>
            </div>

            {/* Info box */}
            <div className="bg-blue-50 border border-blue-200 text-blue-800 px-4 py-3 rounded-lg text-sm">
              <b>Note:</b> Charge = (Quantity / 1000) × Price. Wallet se automatically
              deduct ho jayega. Balance kam ho to pehle top-up karo.
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-medium transition"
            >
              Place Order
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}