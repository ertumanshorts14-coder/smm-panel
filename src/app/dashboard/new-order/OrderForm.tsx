'use client'

import { useState } from 'react'
import SubmitButton from '@/app/components/SubmitButton'
import CategoryIcon from '@/app/components/CategoryIcon'

type Service = {
  id: number
  name: string
  category: string
  price_per_1000: number
  min_qty: number
  max_qty: number
  description?: string
}

export default function OrderForm({
  services,
  preselected,
  placeOrder,
  walletBalance,
}: {
  services: Service[]
  preselected?: string
  placeOrder: (formData: FormData) => void
  walletBalance: number
}) {
  const categories = Array.from(new Set(services.map((s) => s.category))).sort()
  const initial = services.find((s) => String(s.id) === preselected)

  const [selectedCategory, setSelectedCategory] = useState<string>(
    initial?.category ?? ''
  )
  const [selectedService, setSelectedService] = useState<Service | null>(
    initial ?? null
  )
  const [quantity, setQuantity] = useState('')
  const [search, setSearch] = useState('')

  // Filter services
  let filtered = selectedCategory
    ? services.filter((s) => s.category === selectedCategory)
    : []
  
  if (search) {
    const q = search.toLowerCase()
    filtered = filtered.filter((s) => s.name.toLowerCase().includes(q))
  }

  const qty = Number(quantity) || 0
  let charge = 0
  let chargeIsMinimum = false
  let quantityError = ''

  if (selectedService && qty > 0) {
    charge = (qty / 1000) * selectedService.price_per_1000
    if (charge < 10) {
      charge = 10
      chargeIsMinimum = true
    }
    charge = Number(charge.toFixed(2))

    if (qty < selectedService.min_qty) {
      quantityError = `Minimum quantity ${selectedService.min_qty}`
    } else if (qty > selectedService.max_qty) {
      quantityError = `Maximum quantity ${selectedService.max_qty}`
    }
  }

  const insufficientBalance = charge > walletBalance

  return (
    <form action={placeOrder} className="space-y-5">
      <input
        type="hidden"
        name="service_id"
        value={selectedService?.id ?? ''}
        required
      />

      {/* ═══ SEARCH ═══ */}
      <div>
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search for a service..."
          className="w-full px-4 py-3 border-b-2 border-slate-300 focus:border-orange-500 focus:outline-none bg-transparent text-slate-900 text-sm"
        />
      </div>

      {/* ═══ CATEGORY ═══ */}
      <div>
        <label className="block text-sm font-bold text-slate-900 mb-2">
          Category
        </label>
        <div className="relative">
          <div className="absolute left-3 top-1/2 -translate-y-1/2 z-10">
            {selectedCategory ? (
              <CategoryIcon category={selectedCategory} />
            ) : (
              <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center text-sm">🏷️</div>
            )}
          </div>
          <select
            value={selectedCategory}
            onChange={(e) => {
              setSelectedCategory(e.target.value)
              setSelectedService(null)
              setQuantity('')
            }}
            className="w-full pl-14 pr-10 py-4 border-2 border-slate-300 rounded-lg focus:outline-none focus:border-orange-500 text-slate-900 text-sm font-bold bg-white appearance-none cursor-pointer"
          >
            <option value="">-- Select Category --</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
          <div className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-600 pointer-events-none font-bold">
            ▼
          </div>
        </div>
      </div>

      {/* ═══ SERVICE ═══ */}
      {selectedCategory && (
        <div>
          <label className="block text-sm font-bold text-slate-900 mb-2">
            Service
          </label>
          <div className="relative">
            <div className="absolute left-3 top-1/2 -translate-y-1/2 z-10">
              <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center text-white text-xs font-bold">
                {selectedService?.id ?? '?'}
              </div>
            </div>
            <select
              value={selectedService?.id ?? ''}
              onChange={(e) => {
                const svc = filtered.find((s) => String(s.id) === e.target.value)
                setSelectedService(svc ?? null)
                setQuantity('')
              }}
              className="w-full pl-14 pr-10 py-4 border-2 border-slate-300 rounded-lg focus:outline-none focus:border-orange-500 text-slate-900 text-sm font-medium bg-white appearance-none cursor-pointer"
            >
              <option value="">-- Select Service --</option>
              {filtered.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name} [Rs {s.price_per_1000}]
                </option>
              ))}
            </select>
            <div className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-600 pointer-events-none font-bold">
              ▼
            </div>
          </div>
        </div>
      )}

      {/* ═══ SERVICE LIST — Tajammal Style ═══ */}
      {selectedCategory && filtered.length > 0 && !selectedService && (
        <div className="border border-slate-200 rounded-lg overflow-hidden max-h-[500px] overflow-y-auto">
          {filtered.map((s) => (
            <button
              type="button"
              key={s.id}
              onClick={() => setSelectedService(s)}
              className="w-full text-left border-b border-slate-200 last:border-0 hover:bg-orange-50 transition"
            >
              {/* Header Row */}
              <div className="flex items-start gap-3 p-4">
                <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                  {s.id}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-slate-900 leading-snug">
                    {s.name}
                  </p>
                </div>
              </div>

              {/* Details Row */}
              <div className="px-4 pb-3 -mt-1">
                <div className="ml-11 text-xs text-slate-700 bg-slate-50 rounded p-2 border border-slate-200">
                  <span className="text-slate-600">{s.category}</span>
                  <span className="text-slate-400"> | </span>
                  <span className="text-slate-600">
                    Min: {s.min_qty} – Max: {s.max_qty}
                  </span>
                  <span className="text-slate-400"> | </span>
                  <span className="font-bold text-orange-600">
                    [Price Per 1000 » ≈ Rs {s.price_per_1000}]
                  </span>
                </div>
              </div>
            </button>
          ))}
        </div>
      )}

      {/* ═══ SELECTED SERVICE — Tajammal Style Orange Card ═══ */}
      {selectedService && (
        <div className="border border-slate-200 rounded-lg overflow-hidden">
          {/* Orange Header */}
          <div className="bg-orange-500 p-4">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                {selectedService.id}
              </div>
              <p className="text-white text-sm font-bold leading-snug flex-1">
                {selectedService.name}
              </p>
            </div>
          </div>

          {/* White Details */}
          <div className="bg-white p-4">
            <div className="flex flex-wrap gap-x-4 gap-y-2 text-xs mb-3">
              <div className="bg-slate-100 rounded px-2 py-1">
                <span className="text-slate-600">Min: </span>
                <span className="font-bold text-slate-900">{selectedService.min_qty}</span>
              </div>
              <div className="bg-slate-100 rounded px-2 py-1">
                <span className="text-slate-600">Max: </span>
                <span className="font-bold text-slate-900">{selectedService.max_qty}</span>
              </div>
              <div className="bg-orange-100 rounded px-2 py-1">
                <span className="text-orange-700">Price: </span>
                <span className="font-bold text-orange-700">Rs {selectedService.price_per_1000}/1000</span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setSelectedService(null)}
              className="text-xs text-blue-600 hover:underline font-medium"
            >
              ✏️ Change Service
            </button>
          </div>

          {/* Description */}
          {selectedService.description && (
            <div className="bg-slate-50 border-t border-slate-200 p-4">
              <p className="text-xs font-bold text-slate-800 mb-2 flex items-center gap-1">
                ⚠️ Please Read the Description
              </p>
              <div className="text-xs text-slate-700 whitespace-pre-wrap max-h-48 overflow-y-auto leading-relaxed">
                {selectedService.description
                  .replace(/<br>/g, '\n')
                  .replace(/<[^>]*>/g, '')
                  .trim()}
              </div>
            </div>
          )}
        </div>
      )}

      {/* ═══ LINK + QUANTITY + CHARGE ═══ */}
      {selectedService && (
        <>
          {/* Link */}
          <div>
            <label className="block text-sm font-bold text-slate-900 mb-2">
              Link
            </label>
            <input
              type="url"
              name="link"
              required
              placeholder="https://instagram.com/yourprofile"
              className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 text-slate-900 text-sm"
            />
          </div>

          {/* Quantity */}
          <div>
            <label className="block text-sm font-bold text-slate-900 mb-2">
              Quantity
            </label>
            <input
              type="number"
              name="quantity"
              required
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              placeholder={String(selectedService.min_qty)}
              className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 text-slate-900 text-sm"
            />
            <div className="flex justify-between text-xs text-slate-500 mt-1">
              <span>Min: {selectedService.min_qty}</span>
              <span>Max: {selectedService.max_qty}</span>
            </div>
          </div>

          {/* Charge */}
          {qty > 0 && (
            <div className="bg-slate-50 border border-slate-200 rounded-lg p-4">
              <p className="text-sm font-bold text-slate-900 mb-2">Charge</p>
              <p className="text-2xl font-bold text-slate-900">
                ≈ Rs {charge}
              </p>

              {chargeIsMinimum && (
                <p className="text-xs text-amber-600 mt-1">
                  ⚠️ Minimum charge Rs 10
                </p>
              )}
              {quantityError && (
                <p className="text-xs text-red-600 mt-1">❌ {quantityError}</p>
              )}
              {insufficientBalance && (
                <p className="text-xs text-red-600 mt-1">
                  ❌ Balance kam hai (Aap ke paas Rs {walletBalance})
                </p>
              )}
            </div>
          )}

          <SubmitButton
            loadingText="Submitting..."
            className="w-full bg-orange-500 hover:bg-orange-600 text-white py-4 rounded-lg font-bold transition text-base"
          >
            Submit
          </SubmitButton>
        </>
      )}
    </form>
  )
}