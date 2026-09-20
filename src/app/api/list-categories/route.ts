import { getProviderServices } from '@/lib/tajammal-api'
import { NextResponse } from 'next/server'

export async function GET() {
  const services = await getProviderServices()

  if (!Array.isArray(services)) {
    return NextResponse.json({ error: 'Failed', raw: services })
  }

  // Unique categories
  const categories = new Map<string, number>()
  for (const s of services) {
    const cat = s.category ?? 'Other'
    categories.set(cat, (categories.get(cat) ?? 0) + 1)
  }

  const sorted = Array.from(categories.entries())
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count)

  // WhatsApp search (category + name)
  const whatsapp = services.filter((s: any) => {
    const cat = (s.category ?? '').toLowerCase()
    const name = (s.name ?? '').toLowerCase()
    return (
      cat.includes('whatsapp') ||
      cat.includes('wa ') ||
      cat.includes('wa-') ||
      name.includes('whatsapp')
    )
  })

  return NextResponse.json({
    totalCategories: sorted.length,
    categories: sorted,
    whatsappCount: whatsapp.length,
    whatsappSample: whatsapp.slice(0, 10),
  })
}