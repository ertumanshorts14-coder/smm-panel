'use client'

import { useState } from 'react'

type Service = {
  id: number
  name: string
  category: string
  price_per_1000: number
  min_qty: number
  max_qty: number
}

export default function ServiceSelector({
  services,
  preselected,
}: {
  services: Service[]
  preselected?: string
}) {
  const categories = Array.from(
    new Set(services.map((s) => s.category))
  ).sort()

  const initial = services.find((s) => String(s.id) === preselected)
  const initialCategory = initial?.category ?? categories[0]

  const [selectedCategory, setSelectedCategory] = useState(initialCategory)
  const [selectedService, setSelectedService] = useState<Service | null>(
    initial ?? null
  )

  const filtered = services.filter((s) => s.category === selectedCategory)

  return (
    <div className="space-y-3">
      <input
        type="hidden"
        name="service_id"
        value={selectedService?.id ?? ''}
        required
      />

      {/* Category Tabs */}
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

      {/* Service List */}
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

      {/* Selected Service Info */}
      {selectedService && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
          <p className="text-xs text-blue-700 font-semibold mb-1">
            ✅ Selected Service
          </p>
          <p className="text-sm text-blue-900 font-medium">
            {selectedService.name}
          </p>
          <div className="flex justify-between text-xs text-blue-700 mt-2">
            <span>Rs {selectedService.price_per_1000} per 1000</span>
            <span>
              Min: {selectedService.min_qty} • Max: {selectedService.max_qty}
            </span>
          </div>
        </div>
      )}
    </div>
  )
}