import { requireAdmin } from '@/lib/admin'
import { revalidatePath } from 'next/cache'

async function updateOrderStatus(formData: FormData) {
  'use server'
  const { supabase } = await requireAdmin()
  const id = Number(formData.get('id'))
  const status = formData.get('status') as string

  await supabase
    .from('orders')
    .update({ status })
    .eq('id', id)

  revalidatePath('/admin/orders')
}

export default async function AdminOrders() {
  const { supabase } = await requireAdmin()

  const { data: orders } = await supabase
    .from('orders')
    .select('*, services(name), profiles(email)')
    .order('created_at', { ascending: false })

  const statuses = ['pending', 'processing', 'completed', 'partial', 'canceled']

  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-900 mb-6">All Orders</h1>

      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-slate-100 text-left text-slate-600">
            <tr>
              <th className="px-4 py-3">#</th>
              <th className="px-4 py-3">User</th>
              <th className="px-4 py-3">Service</th>
              <th className="px-4 py-3">Link</th>
              <th className="px-4 py-3">Qty</th>
              <th className="px-4 py-3">Charge</th>
              <th className="px-4 py-3">Status</th>
            </tr>
          </thead>
          <tbody>
            {orders && orders.length > 0 ? (
              orders.map((o: any) => (
                <tr key={o.id} className="border-b last:border-0">
                  <td className="px-4 py-3 text-slate-500">#{o.id}</td>
                  <td className="px-4 py-3 text-slate-700">
                    {o.profiles?.email ?? 'N/A'}
                  </td>
                  <td className="px-4 py-3 font-medium text-slate-900">
                    {o.services?.name ?? '-'}
                  </td>
                  <td className="px-4 py-3 text-slate-600 max-w-xs truncate">
                    {o.link}
                  </td>
                  <td className="px-4 py-3 text-slate-700">{o.quantity}</td>
                  <td className="px-4 py-3 text-slate-700">Rs {o.charge}</td>
                  <td className="px-4 py-3">
                    <form action={updateOrderStatus} className="flex gap-2">
                      <input type="hidden" name="id" value={o.id} />
                      <select
                        name="status"
                        defaultValue={o.status}
                        className="border border-slate-300 rounded-lg px-2 py-1 text-xs"
                      >
                        {statuses.map((s) => (
                          <option key={s} value={s}>
                            {s}
                          </option>
                        ))}
                      </select>
                      <button
                        type="submit"
                        className="bg-slate-900 hover:bg-slate-700 text-white px-2 py-1 rounded-lg text-xs"
                      >
                        Save
                      </button>
                    </form>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={7}
                  className="px-4 py-8 text-center text-slate-500"
                >
                  Abhi koi order nahi hai.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}