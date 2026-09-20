import Link from 'next/link'
import Footer from './Footer'

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-1 flex items-center justify-center bg-gradient-to-br from-slate-900 to-slate-800">
        <div className="text-center px-4">
          <h1 className="text-5xl font-bold text-white mb-4">
            SMUQ SMM Panel
          </h1>
          <p className="text-gray-300 text-lg mb-8">
            Pakistan ka behtareen SMM panel
          </p>

          <div className="flex gap-4 justify-center">
            <Link
              href="/login"
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition"
            >
              Login
            </Link>
            <Link
              href="/register"
              className="bg-white hover:bg-gray-100 text-slate-900 px-6 py-3 rounded-lg font-medium transition"
            >
              Sign Up
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}