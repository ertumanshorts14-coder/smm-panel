'use client'

import { useState } from 'react'
import SubmitButton from '@/app/components/SubmitButton'

type Service = {
  id: number
  name: string
  category: string
  price_per_1000: number
  min_qty: number
  max_qty: number
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
  const initialCategory = initial?.category ?? categories[0]

  const [selectedCategory, setSelectedCategory] = useState(initialCategory)
  const [selectedService, setSelectedService] = useState<Service | null>(
    initial ?? null
  )
  const [quantity, setQuantity] = useState('')

  const filtered = services.filter((s) => s.category === selectedCategory)

  // Live charge calculation
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
      quantityError = `Minimum quantity ${selectedService.min_qty} hai`
    } else if (qty > selectedService.max_qty) {
      quantityError = `Maximum quantity ${selectedService.max_qty} hai`
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

      {/* STEP 1: Category */}
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-2">
          1. Category Select Karo
        </label>
        <div className="flex gap-2 overflow-x-auto pb-2 -mx-1 px-1 md:flex-wrap md:overflow-visible">
          {categories.map((cat) => {
            const isActive = cat === selectedCategory
            const count = services.filter((s) => s.category === cat).length
            return (
              <button
                type="button"
                key={cat}
                onClick={() => {
                  setSelectedCategory(cat)
                  setSelectedService(null)
                }}
                className={`flex-shrink-0 px-3 py-2 rounded-lg text-xs md:text-sm font-medium transition whitespace-nowrap ${
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
              </button>
            )
          })}
        </div>
      </div>

      {/* STEP 2: Service */}
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-2">
          2. Service Select Karo
        </label>
        <div className="max-h-72 overflow-y-auto border border-slate-200 rounded-lg">
          {filtered.length > 0 ? (
            filtered.map((s) => {
              const isSelected = selectedService?.id === s.id
              return (
                <button
                  type="button"
                  key={s.id}
                  onClick={() => setSelectedService(s)}
                  className={`w-full text-left px-3 md:px-4 py-3 border-b last:border-0 transition ${
                    isSelected
                      ? 'bg-blue-50 border-l-4 border-l-blue-600'
                      : 'hover:bg-slate-50'
                  }`}
                >
                  <div className="flex justify-between items-start gap-3">
                    <div className="flex-1 min-w-0">
                      <p
                        className={`text-xs md:text-sm font-medium truncate ${
                          isSelected ? 'text-blue-900' : 'text-slate-900'
                        }`}
                      >
                        {s.name}
                      </p>
                      <p className="text-xs text-slate-500 mt-0.5">
                        Min: {s.min_qty} • Max: {s.max_qty}
                      </p>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <p
                        className={`text-xs md:text-sm font-semibold ${
                          isSelected ? 'text-blue-700' : 'text-slate-900'
                        }`}
                      >
                        Rs {s.price_per_1000}
                      </p>
                      <p className="text-xs text-slate-400">per 1000</p>
                    </div>
                  </div>
                </button>
              )
            })
          ) : (
            <p className="text-slate-500 text-sm py-6 text-center">
              Is category mein koi service nahi hai.
            </p>
          )}
        </div>
      </div>

      {/* STEP 3: Link */}
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">
          3. Link Daalo
        </label>
        <input
          type="url"
          name="link"
          required
          placeholder="https://instagram.com/yourprofile"
          className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900 text-sm"
        />
        <p className="text-xs text-slate-500 mt-1">
          Jis page/profile pe service chahiye uska URL
        </p>
      </div>

      {/* STEP 4: Quantity + Live Charge */}
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">
          4. Quantity Daalo
        </label>
        <input
          type="number"
          name="quantity"
          required
          value={quantity}
          onChange={(e) => setQuantity(e.target.value)}
          placeholder={
            selectedService ? String(selectedService.min_qty) : '1000'
          }
          className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900 text-sm"
        />
        {selectedService && (
          <p className="text-xs text-slate-500 mt-1">
            Range: {selectedService.min_qty} – {selectedService.max_qty}
          </p>
        )}

        {/* LIVE CHARGE DISPLAY */}
        {selectedService && qty > 0 && (
          <div className="mt-3 bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-300 rounded-lg p-4">
            <div className="flex justify-between items-center mb-2">
              <span className="text-xs text-slate-600">Calculation:</span>
              <span className="text-xs text-slate-500">
                ({qty} ÷ 1000) × Rs {selectedService.price_per_1000}
              </span>
            </div>
            <div className="flex justify-between items-center pt-2 border-t border-blue-200">
              <span className="text-sm md:text-base font-semibold text-slate-900">
                💰 Total Payment:
              </span>
              <span className="text-2xl font-bold text-blue-700">
                Rs {charge}
              </span>
            </div>

            {chargeIsMinimum && (
              <p className="text-xs text-amber-600 mt-2">
                ⚠️ Minimum charge Rs 10 lagaya gaya hai
              </p>
            )}

            {quantityError && (
              <p className="text-xs text-red-600 mt-2">❌ {quantityError}</p>
            )}

            {insufficientBalance && (
              <p className="text-xs text-red-600 mt-2">
                ❌ Insufficient balance. Aap ke paas Rs {walletBalance} hain.
              </p>
            )}
          </div>
        )}
      </div>

      <SubmitButton
        loadingText="Placing order..."
        className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-medium transition"
      >
        {qty > 0 && charge > 0
          ? `Place Order — Pay Rs ${charge}`
          : 'Place Order'}
      </SubmitButton>
    </form>
  )
}