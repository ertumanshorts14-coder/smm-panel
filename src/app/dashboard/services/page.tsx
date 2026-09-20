import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'

export default async function ServicesPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: services } = await supabase
    .from('services')
    .select('*')
    .eq('active', true)
    .order('category')

  // Group by category
  const grouped: Record<string, typeof services> = {}
  services?.forEach((s) => {
    const cat = s.category ?? 'Other'
    if (!grouped[cat]) grouped[cat] = []
    grouped[cat]!.push(s)
  })

  return (
    <div className="min-h-screen bg-slate-100">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <Link href="/dashboard" className="text-xl font-bold text-slate-900">
            SMUQ SMM Panel
          </Link>
          <Link href="/dashboard" className="text-sm text-blue-600 hover:underline">
            ← Back to Dashboard
          </Link>
        </div>
      </header>

      <div className="max-w-7xl mx-auto p-6">
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h1 className="text-2xl font-bold text-slate-900 mb-1">Our Services</h1>
          <p className="text-slate-500 text-sm mb-6">
            Har service ki price 1000 quantity ke hisaab se hai
          </p>

          {Object.entries(grouped).map(([category, items]) => (
            <div key={category} className="mb-8">
              <h2 className="text-lg font-bold text-slate-800 mb-3 pb-2 border-b">
                {category}
              </h2>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="text-left text-slate-500 border-b">
                    <tr>
                      <th className="pb-2">Service</th>
                      <th className="pb-2">Price / 1000</th>
                      <th className="pb-2">Min</th>
                      <th className="pb-2">Max</th>
                      <th className="pb-2"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {items?.map((s) => (
                      <tr key={s.id} className="border-b last:border-0 hover:bg-slate-50">
                        <td className="py-3 font-medium text-slate-800">{s.name}</td>
                        <td className="py-3 text-slate-700">Rs {s.price_per_1000}</td>
                        <td className="py-3 text-slate-500">{s.min_qty}</td>
                        <td className="py-3 text-slate-500">{s.max_qty}</td>
                        <td className="py-3 text-right">
                          <Link
                            href={`/dashboard/new-order?service=${s.id}`}
                            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-1.5 rounded-lg text-xs font-medium"
                          >
                            Order Now
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ))}

          {(!services || services.length === 0) && (
            <p className="text-slate-500 text-sm">Abhi koi service available nahi hai.</p>
          )}
        </div>
      </div>
    </div>
  )
}