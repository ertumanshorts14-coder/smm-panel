'use client'

import { useState } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [sent, setSent] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const supabase = createClient()

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    })

    if (error) {
      setError(error.message)
      setLoading(false)
      return
    }

    setSent(true)
    setLoading(false)
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-[#0A0E27] relative overflow-hidden px-4">
      <div className="absolute -top-40 -left-40 w-[500px] h-[500px] bg-purple-600 rounded-full blur-[128px] opacity-20"></div>
      <div className="absolute -bottom-40 -right-40 w-[500px] h-[500px] bg-blue-600 rounded-full blur-[128px] opacity-20"></div>

      <div className="relative w-full max-w-md">
        <Link href="/" className="flex items-center justify-center gap-2 mb-8">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center font-bold text-white">
            S
          </div>
          <span className="text-2xl font-bold text-white">SMUQ SMM</span>
        </Link>

        <div className="bg-white/[0.03] backdrop-blur-lg border border-white/10 rounded-2xl p-6 md:p-8 shadow-2xl">
          {sent ? (
            <div className="text-center">
              <div className="text-5xl mb-4">📧</div>
              <h1 className="text-2xl font-bold text-white mb-2">Email Sent!</h1>
              <p className="text-slate-400 text-sm mb-6">
                <b className="text-white">{email}</b> pe reset link bheji gayi hai. Inbox check karein (Spam bhi).
              </p>
              <Link
                href="/login"
                className="block w-full text-center bg-gradient-to-r from-purple-600 to-blue-600 text-white py-3 rounded-lg font-medium"
              >
                Back to Login
              </Link>
            </div>
          ) : (
            <>
              <h1 className="text-2xl font-bold text-white mb-2">Forgot Password?</h1>
              <p className="text-slate-400 text-sm mb-6">
                Email daalein, hum reset link bhejenge
              </p>

              {error && (
                <div className="bg-red-500/10 border border-red-500/30 text-red-300 px-4 py-3 rounded-lg mb-4 text-sm">
                  {error}
                </div>
              )}

              <form onSubmit={handleReset} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1">Email</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-white placeholder-slate-500"
                    placeholder="you@example.com"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white py-3 rounded-lg font-medium disabled:opacity-50 transition"
                >
                  {loading ? 'Sending...' : 'Send Reset Link'}
                </button>
              </form>

              <p className="text-center text-slate-400 text-sm mt-6">
                Remember password?{' '}
                <Link href="/login" className="text-purple-400 hover:text-purple-300 font-medium">
                  Login
                </Link>
              </p>
            </>
          )}
        </div>
      </div>
    </main>
  )
}