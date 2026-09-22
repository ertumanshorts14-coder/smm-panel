import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import Footer from '../Footer'

export default async function PublicServicesPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>
}) {
  const supabase = await createClient()
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
    <div className="min-h-screen flex flex-col bg-slate-50">
      <nav className="border-b bg-white sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-4 flex justify-between items-center">
          <Link href="/" className="text-lg md:text-xl font-bold text-slate-900">
            SMUQ SMM Panel
          </Link>
          <div className="flex items-center gap-3 md:gap-4">
            <Link href="/login" className="text-sm font-medium text-slate-700 hover:text-blue-600">
              Login
            </Link>
            <Link
              href="/register"
              className="bg-blue-600 hover:bg-blue-700 text-white text-xs md:text-sm px-3 md:px-5 py-2 rounded-lg font-medium transition"
            >
              Sign Up Free
            </Link>
          </div>
        </div>
      </nav>

      <main className="flex-1 max-w-7xl mx-auto w-full p-4 md:p-6">
        <div className="text-center mb-6 md:mb-8 mt-4">
          <h1 className="text-2xl md:text-4xl font-bold text-slate-900 mb-2">
            Our Services
          </h1>
          <p className="text-sm md:text-base text-slate-500">
            {services?.length ?? 0} services across {categories.length} categories
          </p>
        </div>

        <a
          href="https://whatsapp.com/channel/0029VbDOMSuJUM2aIn4SXu3x"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 bg-green-50 border border-green-200 text-green-700 rounded-lg p-3 mb-4 hover:bg-green-100 transition text-xs md:text-sm"
        >
          <span className="font-medium">
            📢 Naye offers aur updates ke liye WhatsApp Channel join karo
          </span>
          <span className="ml-auto">→</span>
        </a>

        <div className="bg-white rounded-xl shadow-sm p-3 md:p-4 mb-4 md:mb-6">
          <div className="flex gap-2 overflow-x-auto pb-2 -mx-1 px-1 md:flex-wrap md:overflow-visible md:justify-center">
            {categories.map((cat) => {
              const isActive = cat === activeCategory
              const count = grouped[cat]?.length ?? 0
              return (
                <Link
                  key={cat}
                  href={`/services?category=${encodeURIComponent(cat)}`}
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

        <div className="bg-white rounded-xl shadow-sm p-4 md:p-6 mb-6">
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
              <div className="hidden md:block overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="text-left text-slate-500 border-b">
                    <tr>
                      <th className="pb-2">Service</th>
                      <th className="pb-2">Price / 1000</th>
                      <th className="pb-2">Min</th>
                      <th className="pb-2">Max</th>
                    </tr>
                  </thead>
                  <tbody>
                    {activeServices.map((s) => (
                      <tr key={s.id} className="border-b last:border-0 hover:bg-slate-50">
                        <td className="py-3 font-medium text-slate-800">{s.name}</td>
                        <td className="py-3 text-slate-700 font-semibold">Rs {s.price_per_1000}</td>
                        <td className="py-3 text-slate-500">{s.min_qty}</td>
                        <td className="py-3 text-slate-500">{s.max_qty}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="md:hidden space-y-2">
                {activeServices.map((s) => (
                  <div key={s.id} className="border border-slate-200 rounded-lg p-3">
                    <p className="font-semibold text-slate-900 text-sm mb-2 leading-snug">
                      {s.name}
                    </p>
                    <div className="flex justify-between items-center text-xs text-slate-600">
                      <span className="font-semibold text-slate-900">Rs {s.price_per_1000} / 1000</span>
                      <span>Min: {s.min_qty} • Max: {s.max_qty}</span>
                    </div>
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

        <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl p-6 md:p-8 text-center text-white mb-6">
          <h3 className="text-xl md:text-2xl font-bold mb-2">
            Order karne ke liye sign up karo
          </h3>
          <p className="text-sm md:text-base text-blue-100 mb-5">
            Free account banao, wallet mein funds add karo, aur order place karo
          </p>
          <Link
            href="/register"
            className="inline-block bg-white text-blue-700 hover:bg-blue-50 px-6 md:px-8 py-3 rounded-lg font-semibold transition"
          >
            Sign Up Free →
          </Link>
        </div>
      </main>

      <Footer />
    </div>
  )
}