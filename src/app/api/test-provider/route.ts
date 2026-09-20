import { getProviderBalance, getProviderServices } from '@/lib/tajammal-api'
import { NextResponse } from 'next/server'

export async function GET() {
  const balance = await getProviderBalance()
  const services = await getProviderServices()

  const servicesArray = Array.isArray(services) ? services : []
  const firstFew = servicesArray.slice(0, 5)

  return NextResponse.json({
    balance,
    servicesCount: servicesArray.length,
    firstFewServices: firstFew,
    servicesIsArray: Array.isArray(services),
  })
}