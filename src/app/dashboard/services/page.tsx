export const dynamic = 'force-dynamic'
export const revalidate = 0

import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'

export default async function ServicesPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string; search?: string }>
}) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { category: selectedCategory, search } = await searchParams

  const { data: services } = await supabase
    .from('services')
    .select('*')
    .eq('active', true)
    .order('popular', { ascending: false })
    .order('category')

  // Filter by search
  let filtered = services ?? []
  if (search) {
    const q = search.toLowerCase()
    filtered = filtered.filter((s: any) =>
      s.name.toLowerCase().includes(q) || s.category.toLowerCase().includes(q)
    )
  }

  // Group by category
  const grouped: Record<string, any[]> = {}
  filtered.forEach((s: any) => {
    const cat = s.category ?? 'Other'
    if (!grouped[cat]) grouped[cat] = []
    grouped[cat].push(s)
  })

  const categories = Object.keys(grouped).sort()

  const activeCategory =
    selectedCategory && grouped[selectedCategory]
      ? selectedCategory
      : categories[0]

  const activeServices = activeCategory ? grouped[activeCategory] : []

  return (
    <div className="min-h-screen bg-slate-100">
      <header className="bg-white shadow-sm border-b sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-3 md:py-4 flex justify-between items-center">
          <Link href="/dashboard" className="text-base md:text-xl font-bold text-slate-900">
            SMUQ SMM
          </Link>
          <Link href="/dashboard" className="text-xs md:text-sm text-blue-600 hover:underline">
            ← Back
          </Link>
        </div>
      </header>

      <div className="max-w-7xl mx-auto p-4 md:p-6">
        <div className="mb-4 md:mb-6">
          <h1 className="text-xl md:text-2xl font-bold text-slate-900 mb-1">
            All Services
          </h1>
          <p className="text-xs md:text-sm text-slate-500">
            {services?.length ?? 0} services • {categories.length} categories
          </p>
        </div>

        {/* Search Bar */}
        <form className="mb-4">
          <input
            type="text"
            name="search"
            defaultValue={search ?? ''}
            placeholder="🔍 Search services (e.g. Instagram Followers)"
            className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900 text-sm"
          />
        </form>

        {/* Category Tabs */}
        <div className="bg-white rounded-xl shadow-sm p-3 md:p-4 mb-4 md:mb-6">
          <p className="text-xs font-semibold text-slate-500 uppercase mb-3 px-1">
            Select Category
          </p>
          <div className="flex gap-2 overflow-x-auto pb-2 -mx-1 px-1 md:flex-wrap md:overflow-visible">
            {categories.map((cat) => {
              const isActive = cat === activeCategory
              const count = grouped[cat]?.length ?? 0
              return (
                <Link
                  key={cat}
                  href={`/dashboard/services?category=${encodeURIComponent(cat)}${search ? `&search=${encodeURIComponent(search)}` : ''}`}
                  className={`flex-shrink-0 px-3 md:px-4 py-2 rounded-lg text-xs md:text-sm font-medium transition whitespace-nowrap ${
                    isActive
                      ? 'bg-blue-600 text-white'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  {cat}
                  <span className={`ml-2 text-xs ${isActive ? 'text-blue-200' : 'text-slate-400'}`}>
                    {count}
                  </span>
                </Link>
              )
            })}
          </div>
        </div>

        {/* Services List */}
        <div className="bg-white rounded-xl shadow-sm p-4 md:p-6">
          <div className="flex items-center justify-between mb-4 pb-3 border-b">
            <h2 className="text-base md:text-lg font-bold text-slate-900">
              {activeCategory}
            </h2>
            <span className="text-xs text-slate-500">
              {activeServices?.length ?? 0} services
            </span>
          </div>

          {activeServices && activeServices.length > 0 ? (
            <>
              {/* Desktop table */}
              <div className="hidden md:block overflow-x-auto">
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
                    {activeServices.map((s: any) => (
                      <tr key={s.id} className="border-b last:border-0 hover:bg-slate-50">
                        <td className="py-3 font-medium text-slate-800">
                          {s.name}
                          {s.popular && (
                            <span className="ml-2 text-xs bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full">
                              ⭐ Popular
                            </span>
                          )}
                        </td>
                        <td className="py-3 text-slate-700 font-semibold">
                          Rs {s.price_per_1000}
                        </td>
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

              {/* Mobile cards */}
              <div className="md:hidden space-y-2">
                {activeServices.map((s: any) => (
                  <div key={s.id} className="border border-slate-200 rounded-lg p-3">
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <p className="font-semibold text-slate-900 text-sm leading-snug flex-1">
                        {s.name}
                      </p>
                      {s.popular && (
                        <span className="text-xs bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full whitespace-nowrap">
                          ⭐
                        </span>
                      )}
                    </div>
                    <div className="flex justify-between items-center text-xs text-slate-600 mb-3">
                      <span className="font-semibold text-slate-900">
                        Rs {s.price_per_1000} / 1000
                      </span>
                      <span>Min: {s.min_qty} • Max: {s.max_qty}</span>
                    </div>
                    <Link
                      href={`/dashboard/new-order?service=${s.id}`}
                      className="block text-center bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg text-xs font-medium"
                    >
                      Order Now
                    </Link>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <p className="text-slate-500 text-sm py-8 text-center">
              Is category mein abhi koi service nahi hai.
            </p>
          )}
        </div>
      </div>
    </div>
  )
}