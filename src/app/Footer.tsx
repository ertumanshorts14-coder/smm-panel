import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="bg-white border-t mt-auto">
      <div className="max-w-7xl mx-auto px-6 py-6 flex flex-col md:flex-row justify-between items-center gap-4">
        <p className="text-sm text-slate-500">
          © {new Date().getFullYear()} SMUQ SMM Panel. All rights reserved.
        </p>
        <div className="flex gap-6 text-sm">
          <Link href="/terms" className="text-slate-600 hover:text-blue-600">
            Terms
          </Link>
          <Link href="/privacy" className="text-slate-600 hover:text-blue-600">
            Privacy
          </Link>
          <Link href="/refund" className="text-slate-600 hover:text-blue-600">
            Refund
          </Link>
        </div>
      </div>
    </footer>
  )
}