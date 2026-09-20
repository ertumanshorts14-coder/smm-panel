import { requireAdmin } from '@/lib/admin'

export default async function AdminUsers() {
  const { supabase } = await requireAdmin()

  const { data: users } = await supabase
    .from('profiles')
    .select('*, wallets(balance)')
    .order('created_at', { ascending: false })

  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-900 mb-6">Users</h1>

      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-slate-100 text-left text-slate-600">
            <tr>
              <th className="px-4 py-3">Email</th>
              <th className="px-4 py-3">Username</th>
              <th className="px-4 py-3">Role</th>
              <th className="px-4 py-3">Balance</th>
              <th className="px-4 py-3">Joined</th>
            </tr>
          </thead>
          <tbody>
            {users?.map((u: any) => (
              <tr key={u.id} className="border-b last:border-0">
                <td className="px-4 py-3 font-medium text-slate-900">
                  {u.email}
                </td>
                <td className="px-4 py-3 text-slate-700">{u.username}</td>
                <td className="px-4 py-3">
                  <span
                    className={`text-xs px-2 py-1 rounded font-medium ${
                      u.role === 'admin'
                        ? 'bg-purple-100 text-purple-800'
                        : 'bg-slate-100 text-slate-700'
                    }`}
                  >
                    {u.role}
                  </span>
                </td>
                <td className="px-4 py-3 text-slate-700">
                  Rs {u.wallets?.balance ?? 0}
                </td>
                <td className="px-4 py-3 text-slate-500 text-xs">
                  {new Date(u.created_at).toLocaleDateString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}