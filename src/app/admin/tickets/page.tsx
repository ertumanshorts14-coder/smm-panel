export const dynamic = 'force-dynamic'
export const revalidate = 0

import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'
import Link from 'next/link'
import SubmitButton from '@/app/components/SubmitButton'

async function createTicket(formData: FormData) {
  'use server'
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const subject = formData.get('subject') as string
  const message = formData.get('message') as string

  const { data: ticket } = await supabase
    .from('tickets')
    .insert({ user_id: user.id, subject, status: 'open' })
    .select()
    .single()

  if (ticket) {
    await supabase.from('ticket_messages').insert({
      ticket_id: ticket.id,
      sender_id: user.id,
      is_admin: false,
      message,
    })
  }

  revalidatePath('/dashboard/tickets')
  redirect(`/dashboard/tickets/${ticket?.id}`)
}

export default async function TicketsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: tickets } = await supabase
    .from('tickets')
    .select('*')
    .eq('user_id', user.id)
    .order('updated_at', { ascending: false })

  return (
    <div className="min-h-screen bg-slate-100">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-4 flex justify-between items-center">
          <Link href="/dashboard" className="text-base md:text-xl font-bold text-slate-900">
            SMUQ SMM
          </Link>
          <Link href="/dashboard" className="text-xs md:text-sm text-blue-600 hover:underline">
            ← Back to Dashboard
          </Link>
        </div>
      </header>

      <div className="max-w-4xl mx-auto p-4 md:p-6 space-y-6">
        {/* Create new ticket */}
        <div className="bg-white rounded-xl shadow-sm p-4 md:p-6">
          <h2 className="text-base md:text-lg font-bold text-slate-900 mb-4">
            Create New Ticket
          </h2>
          <form action={createTicket} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Subject
              </label>
              <input
                type="text"
                name="subject"
                required
                placeholder="e.g., Order #123 not delivered"
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900 text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Message
              </label>
              <textarea
                name="message"
                required
                rows={4}
                placeholder="Describe your issue in detail..."
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900 text-sm"
              />
            </div>
            <SubmitButton
              loadingText="Opening..."
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-lg font-medium"
            >
              Open Ticket
            </SubmitButton>
          </form>
        </div>

        {/* Tickets list */}
        <div className="bg-white rounded-xl shadow-sm p-4 md:p-6">
          <h2 className="text-base md:text-lg font-bold text-slate-900 mb-4">
            My Tickets
          </h2>

          {tickets && tickets.length > 0 ? (
            <div className="space-y-2">
              {tickets.map((t: any) => (
                <Link
                  key={t.id}
                  href={`/dashboard/tickets/${t.id}`}
                  className="block border border-slate-200 rounded-lg p-4 hover:border-blue-300 hover:bg-blue-50/30 transition"
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <p className="font-medium text-slate-900 text-sm">
                        #{t.id} — {t.subject}
                      </p>
                      <p className="text-xs text-slate-500 mt-1">
                        {new Date(t.created_at).toLocaleString()}
                      </p>
                    </div>
                    <StatusBadge status={t.status} />
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <p className="text-slate-500 text-sm">
              Abhi koi ticket nahi hai. Upar se naya banao.
            </p>
          )}
        </div>
      </div>
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
      className={`text-xs px-3 py-1 rounded-full font-medium ${
        styles[status] ?? styles.open
      }`}
    >
      {status}
    </span>
  )
}