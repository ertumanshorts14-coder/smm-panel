import { getProviderServices } from '@/lib/tajammal-api'
import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

export const runtime = 'nodejs'
export const maxDuration = 60

export async function GET() {
  const providerServices = await getProviderServices()

  if (!Array.isArray(providerServices)) {
    return NextResponse.json(
      { error: 'Failed to fetch from Tajammal', raw: providerServices },
      { status: 500 }
    )
  }

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )

  let updated = 0
  let notFound = 0
  const errors: string[] = []

  for (const s of providerServices) {
    const providerId = String(s.service)
    const originalName = s.name  // ← Tajammal ka ORIGINAL naam

    // Find by provider_service_id
    const { data: existing } = await supabase
      .from('services')
      .select('id')
      .eq('provider_name', 'tajammal')
      .eq('provider_service_id', providerId)
      .maybeSingle()

    if (!existing) {
      notFound++
      continue
    }

    // Update ONLY the name (baaki sab same rahega)
    const { error } = await supabase
      .from('services')
      .update({ name: originalName })
      .eq('id', existing.id)

    if (error) {
      errors.push(`#${providerId}: ${error.message}`)
    } else {
      updated++
    }
  }

  return NextResponse.json({
    totalFromProvider: providerServices.length,
    updated,
    notFound,
    errorsCount: errors.length,
    errorsSample: errors.slice(0, 5),
  })
}