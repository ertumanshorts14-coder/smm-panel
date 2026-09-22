export const dynamic = 'force-dynamic'
export const revalidate = 0

import { requireAdmin } from '@/lib/admin'
import Link from 'next/link'

export default async function AdminTickets() {
  const { supabase } = await requireAdmin()

  const { data: tickets } = await supabase
    .from('tickets')
    .select('*, profiles(email, username)')
    .order('updated_at', { ascending: false })

  return (
    <div>
      <h1 className="text-xl md:text-2xl font-bold text-slate-900 mb-6">
        Support Tickets
      </h1>

      {tickets && tickets.length > 0 ? (
        <div className="space-y-2">
          {tickets.map((t: any) => (
            <Link
              key={t.id}
              href={`/admin/tickets/${t.id}`}
              className="block bg-white border border-slate-200 rounded-xl p-4 hover:border-blue-300 transition"
            >
              <div className="flex justify-between items-start gap-2">
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-slate-900 text-sm truncate">
                    #{t.id} — {t.subject}
                  </p>
                  <p className="text-xs text-slate-500 mt-1 truncate">
                    From: {t.profiles?.email ?? 'N/A'} ·{' '}
                    {new Date(t.created_at).toLocaleString()}
                  </p>
                </div>
                <StatusBadge status={t.status} />
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-xl p-8 text-center text-slate-500 text-sm">
          Abhi koi ticket nahi hai.
        </div>
      )}
    </div>
  )
}

function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    open: 'bg-yellow-100 text-yellow-800',
    answered: 'bg-blue-100 text-blue-800',
    closed: 'bg-slate-200 text-slate-700',
  }
  return (
    <span
      className={`text-xs px-3 py-1 rounded-full font-medium whitespace-nowrap ${
        styles[status] ?? styles.open
      }`}
    >
      {status}
    </span>
  )
}