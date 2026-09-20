import { createClient } from '@/lib/supabase/server'
import { redirect, notFound } from 'next/navigation'
import { revalidatePath } from 'next/cache'
import Link from 'next/link'

async function replyTicket(formData: FormData) {
  'use server'
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const ticket_id = Number(formData.get('ticket_id'))
  const message = formData.get('message') as string

  // Verify ownership
  const { data: ticket } = await supabase
    .from('tickets')
    .select('id, status')
    .eq('id', ticket_id)
    .eq('user_id', user.id)
    .single()

  if (!ticket || ticket.status === 'closed') return

  await supabase.from('ticket_messages').insert({
    ticket_id,
    sender_id: user.id,
    is_admin: false,
    message,
  })

  await supabase
    .from('tickets')
    .update({ status: 'open', updated_at: new Date().toISOString() })
    .eq('id', ticket_id)

  revalidatePath(`/dashboard/tickets/${ticket_id}`)
}

export default async function TicketThread({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: ticket } = await supabase
    .from('tickets')
    .select('*')
    .eq('id', Number(id))
    .eq('user_id', user.id)
    .single()

  if (!ticket) notFound()

  const { data: messages } = await supabase
    .from('ticket_messages')
    .select('*')
    .eq('ticket_id', ticket.id)
    .order('created_at', { ascending: true })

  const isClosed = ticket.status === 'closed'

  return (
    <div className="min-h-screen bg-slate-100">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-6 py-4 flex justify-between items-center">
          <Link href="/dashboard" className="text-xl font-bold text-slate-900">
            SMUQ SMM Panel
          </Link>
          <Link
            href="/dashboard/tickets"
            className="text-sm text-blue-600 hover:underline"
          >
            ← All Tickets
          </Link>
        </div>
      </header>

      <div className="max-w-4xl mx-auto p-6">
        {/* Ticket header */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
          <div className="flex justify-between items-start mb-2">
            <h1 className="text-2xl font-bold text-slate-900">
              #{ticket.id} — {ticket.subject}
            </h1>
            <StatusBadge status={ticket.status} />
          </div>
          <p className="text-sm text-slate-500">
            Created: {new Date(ticket.created_at).toLocaleString()}
          </p>
        </div>

        {/* Messages */}
        <div className="space-y-4 mb-6">
          {messages?.map((m: any) => (
            <div
              key={m.id}
              className={`rounded-xl p-4 ${
                m.is_admin
                  ? 'bg-blue-50 border border-blue-200 ml-8'
                  : 'bg-white border border-slate-200 mr-8'
              }`}
            >
              <div className="flex justify-between items-center mb-2">
                <p className="text-sm font-semibold text-slate-900">
                  {m.is_admin ? '🛡️ Support Team' : '👤 You'}
                </p>
                <p className="text-xs text-slate-500">
                  {new Date(m.created_at).toLocaleString()}
                </p>
              </div>
              <p className="text-slate-700 whitespace-pre-wrap text-sm">
                {m.message}
              </p>
            </div>
          ))}
        </div>

        {/* Reply form */}
        {!isClosed ? (
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="font-bold text-slate-900 mb-3">Reply</h2>
            <form action={replyTicket} className="space-y-4">
              <input type="hidden" name="ticket_id" value={ticket.id} />
              <textarea
                name="message"
                required
                rows={4}
                placeholder="Type your reply..."
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900"
              />
              <button
                type="submit"
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-lg font-medium"
              >
                Send Reply
              </button>
            </form>
          </div>
        ) : (
          <div className="bg-slate-200 rounded-xl p-4 text-center text-slate-600 text-sm">
            🔒 This ticket is closed. Contact support if you need further help.
          </div>
        )}
      </div>
    </div>
  )
}

function StatusBadge({ status }: { status: string }) {
  const styles = {
    open: 'bg-yellow-100 text-yellow-800',
    answered: 'bg-blue-100 text-blue-800',
    closed: 'bg-slate-200 text-slate-700',
  }
  return (
    <span
      className={`text-xs px-3 py-1 rounded-full font-medium ${
        styles[status as keyof typeof styles] ?? styles.open
      }`}
    >
      {status}
    </span>
  )
}