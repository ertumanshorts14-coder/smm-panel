import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'

export default async function ServicesPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>
}) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { category: selectedCategory } = await searchParams

  const { data: services } = await supabase
    .from('services')
    .select('*')
    .eq('active', true)
    .order('category')

  const grouped: Record<string, typeof services> = {}
  services?.forEach((s) => {
    const cat = s.category ?? 'Other'
    if (!grouped[cat]) grouped[cat] = []
    grouped[cat]!.push(s)
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
        {/* WhatsApp Channel Button */}
        <a
          href="https://whatsapp.com/channel/0029VbDOMSuJUM2aIn4SXu3x"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 bg-green-50 border border-green-200 text-green-700 rounded-lg p-3 mb-4 hover:bg-green-100 transition text-xs md:text-sm"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
          </svg>
          <span className="font-medium">
            📢 Naye offers aur updates ke liye WhatsApp Channel join karo
          </span>
          <span className="ml-auto">→</span>
        </a>

        {/* Header */}
        <div className="mb-4 md:mb-6">
          <h1 className="text-xl md:text-2xl font-bold text-slate-900 mb-1">
            Our Services
          </h1>
          <p className="text-xs md:text-sm text-slate-500">
            {services?.length ?? 0} services available • {categories.length} categories
          </p>
        </div>

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
                  href={`/dashboard/services?category=${encodeURIComponent(cat)}`}
                  className={`flex-shrink-0 px-3 md:px-4 py-2 rounded-lg text-xs md:text-sm font-medium transition whitespace-nowrap ${
                    isActive
                      ? 'bg-blue-600 text-white'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  {cat}
                  <span
                    className={`ml-2 text-xs ${
                      isActive ? 'text-blue-200' : 'text-slate-400'
                    }`}
                  >
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
                    {activeServices.map((s) => (
                      <tr
                        key={s.id}
                        className="border-b last:border-0 hover:bg-slate-50"
                      >
                        <td className="py-3 font-medium text-slate-800">
                          {s.name}
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
                {activeServices.map((s) => (
                  <div
                    key={s.id}
                    className="border border-slate-200 rounded-lg p-3"
                  >
                    <p className="font-semibold text-slate-900 text-sm mb-2 leading-snug">
                      {s.name}
                    </p>
                    <div className="flex justify-between items-center text-xs text-slate-600 mb-3">
                      <span className="font-semibold text-slate-900">
                        Rs {s.price_per_1000} / 1000
                      </span>
                      <span>
                        Min: {s.min_qty} • Max: {s.max_qty}
                      </span>
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