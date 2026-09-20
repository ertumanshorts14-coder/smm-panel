const TAJAMMAL_API_URL = 'https://tajammalsmmpanel.com/api/v2'

async function callTajammalAPI(params: Record<string, string>) {
  const apiKey = process.env.TAJAMMAL_API_KEY
  if (!apiKey) {
    return { error: 'TAJAMMAL_API_KEY not set in .env.local' }
  }

  try {
    const body = new URLSearchParams({ key: apiKey, ...params })

    const response = await fetch(TAJAMMAL_API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: body.toString(),
      cache: 'no-store',
    })

    const text = await response.text()
    try {
      return JSON.parse(text)
    } catch {
      return { error: text }
    }
  } catch (err: any) {
    return { error: err.message }
  }
}

export async function getProviderBalance() {
  return callTajammalAPI({ action: 'balance' })
}

export async function getProviderServices() {
  return callTajammalAPI({ action: 'services' })
}

export async function placeProviderOrder(
  serviceId: string,
  link: string,
  quantity: number
) {
  return callTajammalAPI({
    action: 'add',
    service: serviceId,
    link: link,
    quantity: String(quantity),
  })
}

export async function getProviderOrderStatus(orderId: string) {
  return callTajammalAPI({
    action: 'status',
    order: orderId,
  })
}