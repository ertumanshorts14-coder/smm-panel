export const dynamic = 'force-dynamic'
export const revalidate = 0

import { requireAdmin } from '@/lib/admin'
import { revalidatePath } from 'next/cache'

async function addService(formData: FormData) {
  'use server'
  const { supabase } = await requireAdmin()

  await supabase.from('services').insert({
    name: formData.get('name') as string,
    category: formData.get('category') as string,
    price_per_1000: Number(formData.get('price')),
    min_qty: Number(formData.get('min')),
    max_qty: Number(formData.get('max')),
    active: true,
  })

  revalidatePath('/admin/services')
  revalidatePath('/dashboard/services')
}

async function toggleService(formData: FormData) {
  'use server'
  const { supabase } = await requireAdmin()
  const id = Number(formData.get('id'))
  const active = formData.get('active') === 'true'

  await supabase
    .from('services')
    .update({ active: !active })
    .eq('id', id)

  revalidatePath('/admin/services')
  revalidatePath('/dashboard/services')
}

export default async function AdminServices() {
  const { supabase } = await requireAdmin()

  const { data: services } = await supabase
    .from('services')
    .select('*')
    .order('id', { ascending: false })

  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-900 mb-6">Services</h1>

      {/* Add form */}
      <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
        <h2 className="text-lg font-bold text-slate-900 mb-4">
          Add New Service
        </h2>
        <form action={addService} className="grid grid-cols-1 md:grid-cols-5 gap-3">
          <input
            name="name"
            placeholder="Service name"
            required
            className="col-span-2 border border-slate-300 rounded-lg px-3 py-2 text-sm text-slate-900"
          />
          <input
            name="category"
            placeholder="Category"
            required
            className="border border-slate-300 rounded-lg px-3 py-2 text-sm text-slate-900"
          />
          <input
            name="price"
            type="number"
            step="0.01"
            placeholder="Rs/1000"
            required
            className="border border-slate-300 rounded-lg px-3 py-2 text-sm text-slate-900"
          />
          <div className="flex gap-2">
            <input
              name="min"
              type="number"
              placeholder="Min"
              defaultValue={100}
              className="w-20 border border-slate-300 rounded-lg px-2 py-2 text-sm text-slate-900"
            />
            <input
              name="max"
              type="number"
              placeholder="Max"
              defaultValue={100000}
              className="w-24 border border-slate-300 rounded-lg px-2 py-2 text-sm text-slate-900"
            />
          </div>
          <button
            type="submit"
            className="col-span-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg font-medium"
          >
            Add Service
          </button>
        </form>
      </div>

      {/* List */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-100 text-left text-slate-600">
              <tr>
                <th className="px-4 py-3">#</th>
                <th className="px-4 py-3">Name</th>
                <th className="px-4 py-3">Category</th>
                <th className="px-4 py-3">Rs/1000</th>
                <th className="px-4 py-3">Min/Max</th>
                <th className="px-4 py-3">Provider</th>
                <th className="px-4 py-3">Active</th>
              </tr>
            </thead>
            <tbody>
              {services?.map((s: any) => (
                <tr key={s.id} className="border-b last:border-0">
                  <td className="px-4 py-3 text-slate-500">#{s.id}</td>
                  <td className="px-4 py-3 font-medium text-slate-900 max-w-xs truncate">
                    {s.name}
                  </td>
                  <td className="px-4 py-3 text-slate-700">{s.category}</td>
                  <td className="px-4 py-3 text-slate-700">
                    Rs {s.price_per_1000}
                  </td>
                  <td className="px-4 py-3 text-slate-500 text-xs">
                    {s.min_qty} / {s.max_qty}
                  </td>
                  <td className="px-4 py-3 text-slate-500 text-xs">
                    {s.provider_name ?? 'manual'}
                  </td>
                  <td className="px-4 py-3">
                    <form action={toggleService}>
                      <input type="hidden" name="id" value={s.id} />
                      <input
                        type="hidden"
                        name="active"
                        value={String(s.active)}
                      />
                      <button
                        type="submit"
                        className={`text-xs px-3 py-1 rounded-lg font-medium ${
                          s.active
                            ? 'bg-green-100 text-green-800 hover:bg-green-200'
                            : 'bg-slate-200 text-slate-700 hover:bg-slate-300'
                        }`}
                      >
                        {s.active ? 'Active' : 'Inactive'}
                      </button>
                    </form>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}