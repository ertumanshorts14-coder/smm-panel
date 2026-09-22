import { getProviderServices } from '@/lib/tajammal-api'
import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

export const runtime = 'nodejs'
export const maxDuration = 60

export async function GET(req: Request) {
  const url = new URL(req.url)
  const markup = Number(url.searchParams.get('markup') ?? '15')

  const providerServices = await getProviderServices()

  if (!Array.isArray(providerServices)) {
    return NextResponse.json(
      { error: 'Failed to fetch services', raw: providerServices },
      { status: 500 }
    )
  }

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )

  let inserted = 0
  let skipped = 0
  let updated = 0
  const errors: string[] = []

  for (const s of providerServices) {
    const providerId = String(s.service)
    const cost = Number(s.rate)
    let sellPrice = Number((cost * markup).toFixed(2))
    if (sellPrice < 10) sellPrice = 10

    // Check if already exists
    const { data: existing } = await supabase
      .from('services')
      .select('id')
      .eq('provider_name', 'tajammal')
      .eq('provider_service_id', providerId)
      .maybeSingle()

    if (existing) {
      // Update existing — price update karo (markup change ho sakta hai)
      await supabase
        .from('services')
        .update({
          name: s.name,
          category: s.category ?? 'Other',
          price_per_1000: sellPrice,
          cost_per_1000: cost,
          min_qty: Number(s.min),
          max_qty: Number(s.max),
          active: true,
        })
        .eq('id', existing.id)
      updated++
      continue
    }

    // Insert new
    const { error } = await supabase.from('services').insert({
      name: s.name,
      category: s.category ?? 'Other',
      price_per_1000: sellPrice,
      cost_per_1000: cost,
      min_qty: Number(s.min),
      max_qty: Number(s.max),
      active: true,
      provider_name: 'tajammal',
      provider_service_id: providerId,
      description: s.desc?.slice(0, 500) ?? null,
    })

    if (error) {
      errors.push(`#${providerId}: ${error.message}`)
    } else {
      inserted++
    }
  }

  return NextResponse.json({
    totalFromProvider: providerServices.length,
    inserted,
    updated,
    skipped,
    errorsCount: errors.length,
    errorsSample: errors.slice(0, 5),
  })
}