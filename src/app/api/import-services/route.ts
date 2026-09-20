import { getProviderServices } from '@/lib/tajammal-api'
import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

export const runtime = 'nodejs'
export const maxDuration = 60

export async function GET(req: Request) {
  const url = new URL(req.url)
  const category = url.searchParams.get('category')
  const markup = Number(url.searchParams.get('markup') ?? '3')
  const limit = Number(url.searchParams.get('limit') ?? '20')

  const providerServices = await getProviderServices()

  if (!Array.isArray(providerServices)) {
    return NextResponse.json(
      { error: 'Failed to fetch services from Tajammal', raw: providerServices },
      { status: 500 }
    )
  }

  let filtered = providerServices
  if (category) {
    filtered = filtered.filter((s: any) =>
      s.category?.toLowerCase().includes(category.toLowerCase())
    )
  }

  filtered = filtered.slice(0, limit)

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )

  let inserted = 0
  let skipped = 0
  const errors: string[] = []
  const insertedNames: string[] = []

  for (const s of filtered) {
    const providerId = String(s.service)
    const cost = Number(s.rate)
    const sellPrice = Number((cost * markup).toFixed(2))

    const { data: existing } = await supabase
      .from('services')
      .select('id')
      .eq('provider_name', 'tajammal')
      .eq('provider_service_id', providerId)
      .maybeSingle()

    if (existing) {
      skipped++
      continue
    }

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
      insertedNames.push(`#${providerId} ${s.name}`)
    }
  }

  return NextResponse.json({
    total: providerServices.length,
    filtered: filtered.length,
    inserted,
    skipped,
    errors: errors.slice(0, 10),
    markup,
    insertedServices: insertedNames,
  })
}