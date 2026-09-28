export const dynamic = 'force-dynamic'
export const revalidate = 0

import { getProviderOrderStatus } from '@/lib/tajammal-api'
import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

export const runtime = 'nodejs'
export const maxDuration = 60

export async function GET() {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )

  if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
    return NextResponse.json(
      { error: 'SUPABASE_SERVICE_ROLE_KEY not set in .env.local' },
      {
        headers: {
          'Cache-Control': 'no-store, no-cache, must-revalidate, max-age=0',
        },
      }
    )
  }

  // Pending/Processing orders fetch karo
  const { data: orders, error } = await supabase
    .from('orders')
    .select('id, status, provider_order_id')
    .in('status', ['pending', 'processing'])
    .not('provider_order_id', 'is', null)
    .limit(100)

  if (error) {
    return NextResponse.json(
      {
        error: 'Database query failed',
        details: error.message,
        hint: error.hint,
      },
      {
        headers: {
          'Cache-Control': 'no-store, no-cache, must-revalidate, max-age=0',
        },
      }
    )
  }

  if (!orders || orders.length === 0) {
    return NextResponse.json(
      {
        message: 'No orders to sync',
        synced: 0,
      },
      {
        headers: {
          'Cache-Control': 'no-store, no-cache, must-revalidate, max-age=0',
        },
      }
    )
  }

  // Deduplicate by ID — agar duplicate aaye to latest rakho
  const uniqueOrders = Array.from(
    new Map(orders.map((o) => [o.id, o])).values()
  )

  let synced = 0
  let completed = 0
  let canceled = 0
  const results: any[] = []
  const errors: string[] = []

  for (const order of uniqueOrders) {
    try {
      const response = await getProviderOrderStatus(order.provider_order_id!)

      if (response.error) {
        errors.push(`#${order.id}: ${response.error}`)
        continue
      }

      let newStatus = order.status
      const providerStatus = (response.status || '').toLowerCase()

      if (providerStatus.includes('complete')) {
        newStatus = 'completed'
        completed++
      } else if (providerStatus.includes('partial')) {
        newStatus = 'partial'
      } else if (providerStatus.includes('cancel')) {
        newStatus = 'canceled'
        canceled++
      } else if (
        providerStatus.includes('progress') ||
        providerStatus.includes('processing')
      ) {
        newStatus = 'processing'
      } else if (providerStatus.includes('pending')) {
        newStatus = 'pending'
      }

      await supabase
        .from('orders')
        .update({
          status: newStatus,
          start_count: response.start_count
            ? Number(response.start_count)
            : null,
          remains: response.remains ? Number(response.remains) : null,
        })
        .eq('id', order.id)

      synced++
      results.push({
        orderId: order.id,
        oldStatus: order.status,
        newStatus,
        providerStatus: response.status,
        startCount: response.start_count,
        remains: response.remains,
      })
    } catch (err: any) {
      errors.push(`#${order.id}: ${err.message}`)
    }
  }

  return NextResponse.json(
    {
      totalChecked: uniqueOrders.length,
      synced,
      completed,
      canceled,
      errorsCount: errors.length,
      errorsSample: errors.slice(0, 5),
      results,
    },
    {
      headers: {
        'Cache-Control': 'no-store, no-cache, must-revalidate, max-age=0',
        'Pragma': 'no-cache',
        'Expires': '0',
      },
    }
  )
}