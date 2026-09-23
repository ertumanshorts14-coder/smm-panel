export const dynamic = 'force-dynamic'
export const revalidate = 0

import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { placeProviderOrder } from '@/lib/tajammal-api'
import OrderForm from './OrderForm'

async function placeOrder(formData: FormData) {
  'use server'
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const service_id = Number(formData.get('service_id'))
  const link = (formData.get('link') as string).trim()
  const quantity = Number(formData.get('quantity'))

  if (!service_id) {
    redirect(
      `/dashboard/new-order?error=${encodeURIComponent('Please select a service')}`
    )
  }

  if (!link || !link.startsWith('http')) {
    redirect(
      `/dashboard/new-order?error=${encodeURIComponent('Link must start with http:// or https://')}`
    )
  }

  if (!quantity || quantity <= 0) {
    redirect(
      `/dashboard/new-order?error=${encodeURIComponent('Quantity must be greater than 0')}`
    )
  }

  const { data: service } = await supabase
    .from('services')
    .select('*')
    .eq('id', service_id)
    .single()

  if (!service) {
    redirect(
      `/dashboard/new-order?error=${encodeURIComponent('Service not found')}`
    )
  }

  if (quantity < service.min_qty || quantity > service.max_qty) {
    redirect(
      `/dashboard/new-order?error=${encodeURIComponent(
        `Quantity must be between ${service.min_qty} and ${service.max_qty}`
      )}`
    )
  }

  let charge = Number(((quantity / 1000) * service.price_per_1000).toFixed(2))
  if (charge < 10) charge = 10

  // DUPLICATE PROTECTION
  const thirtySecondsAgo = new Date(Date.now() - 30 * 1000).toISOString()
  const { data: recentOrder } = await supabase
    .from('orders')
    .select('id')
    .eq('user_id', user.id)
    .eq('service_id', service_id)
    .eq('link', link)
    .gte('created_at', thirtySecondsAgo)
    .maybeSingle()

  if (recentOrder) {
    redirect(
      `/dashboard/new-order?error=${encodeURIComponent(
        'Aap ne 30 second pehle yehi order place kiya tha. Please wait karein.'
      )}`
    )
  }

  const { data: wallet } = await supabase
    .from('wallets')
    .select('*')
    .eq('user_id', user.id)
    .single()

  if (!wallet || wallet.balance < charge) {
    redirect(
      `/dashboard/new-order?error=${encodeURIComponent(
        `Insufficient balance. Need Rs ${charge}, have Rs ${wallet?.balance ?? 0}`
      )}`
    )
  }

  await supabase
    .from('wallets')
    .update({ balance: Number(wallet.balance) - charge })
    .eq('user_id', user.id)

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

  if (!order) {
    redirect(
      `/dashboard/new-order?error=${encodeURIComponent('Failed to create order')}`
    )
  }

  await supabase.from('transactions').insert({
    user_id: user.id,
    amount: -charge,
    type: 'order',
    status: 'completed',
    note: `Order #${order.id} — ${service.name}`,
  })

  if (service.provider_name === 'tajammal' && service.provider_service_id) {
    try {
      const providerResponse = await placeProviderOrder(
        service.provider_service_id,
        link,
        quantity
      )

      if (providerResponse.order) {
        await supabase
          .from('orders')
          .update({
            status: 'processing',
            provider_order_id: String(providerResponse.order),
          })
          .eq('id', order.id)
      } else {
        await supabase
          .from('wallets')
          .update({ balance: Number(wallet.balance) })
          .eq('user_id', user.id)

        await supabase
          .from('orders')
          .update({
            status: 'canceled',
            provider_order_id: null,
          })
          .eq('id', order.id)

        await supabase.from('transactions').insert({
          user_id: user.id,
          amount: charge,
          type: 'refund',
          status: 'completed',
          note: `Auto-refund for Order #${order.id} (provider error)`,
        })

        redirect(
          `/dashboard/new-order?error=${encodeURIComponent(
            providerResponse.error ||
              'Provider rejected order. Check link or quantity.'
          )}`
        )
      }
    } catch (err: any) {
      console.error('Provider error:', err.message)
    }
  }

  redirect('/dashboard?order=success')
}

export default async function NewOrderPage({
  searchParams,
}: {
  searchParams: Promise<{ service?: string; error?: string }>
}) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { service: preselectedServiceId, error } = await searchParams

  const { data: services } = await supabase
    .from('services')
    .select('id, name, category, price_per_1000, min_qty, max_qty')
    .eq('active', true)
    .order('category')

  const { data: wallet } = await supabase
    .from('wallets')
    .select('*')
    .eq('user_id', user.id)
    .single()

  return (
    <div className="min-h-screen bg-slate-100">
      <header className="bg-white shadow-sm border-b sticky top-0 z-30">
        <div className="max-w-3xl mx-auto px-4 md:px-6 py-3 md:py-4 flex justify-between items-center">
          <Link
            href="/dashboard"
            className="text-base md:text-xl font-bold text-slate-900"
          >
            SMUQ SMM
          </Link>
          <div className="flex items-center gap-2 md:gap-4">
            <div className="bg-green-50 text-green-700 px-2 md:px-4 py-1.5 md:py-2 rounded-lg font-semibold text-xs md:text-sm">
              Rs {wallet?.balance ?? 0}
            </div>
            <Link
              href="/dashboard"
              className="text-xs md:text-sm text-blue-600 hover:underline"
            >
              ← Back
            </Link>
          </div>
        </div>
      </header>

      {error && (
        <div className="max-w-3xl mx-auto px-4 md:px-6 pt-4">
          <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg text-sm">
            ❌ <b>Order failed:</b> {decodeURIComponent(error)}
            <p className="text-xs mt-1 text-red-700">
              Aap ka balance refund kar diya gaya hai.
            </p>
          </div>
        </div>
      )}

      <div className="max-w-3xl mx-auto p-4 md:p-6">
        <div className="bg-white rounded-xl shadow-sm p-4 md:p-6">
          <h1 className="text-xl md:text-2xl font-bold text-slate-900 mb-1">
            New Order
          </h1>
          <p className="text-slate-500 text-xs md:text-sm mb-6">
            Category select karo → service chuno → link aur quantity daalo
          </p>

          <OrderForm
            services={services ?? []}
            preselected={preselectedServiceId}
            placeOrder={placeOrder}
            walletBalance={Number(wallet?.balance ?? 0)}
          />
        </div>
      </div>
    </div>
  )
}