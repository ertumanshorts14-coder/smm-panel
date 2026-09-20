import Link from 'next/link'

export default function RefundPage() {
  return (
    <div className="min-h-screen bg-slate-100 py-12 px-4">
      <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-sm p-8">
        <Link href="/" className="text-sm text-blue-600 hover:underline">
          ← Back to Home
        </Link>

        <h1 className="text-3xl font-bold text-slate-900 mt-4 mb-2">
          Refund Policy
        </h1>
        <p className="text-sm text-slate-500 mb-6">
          Last updated: {new Date().toLocaleDateString()}
        </p>

        <div className="prose prose-slate max-w-none space-y-4 text-slate-700 text-sm leading-relaxed">
          <section>
            <h2 className="text-lg font-bold text-slate-900 mt-6 mb-2">1. General Policy</h2>
            <p>
              We strive to deliver all services as promised. If a service fails to
              deliver as described, you may be eligible for a refund or partial refund.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-slate-900 mt-6 mb-2">2. Refund Eligibility</h2>
            <p>Refunds are considered in the following cases:</p>
            <ul className="list-disc pl-6 mt-2 space-y-1">
              <li>Order is not delivered within the estimated time</li>
              <li>Service is partially delivered (proportional refund)</li>
              <li>Order was cancelled before processing started</li>
              <li>Technical error caused duplicate charges</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-bold text-slate-900 mt-6 mb-2">3. Non-Refundable Cases</h2>
            <ul className="list-disc pl-6 space-y-1">
              <li>Order already completed successfully</li>
              <li>Delay caused by user (wrong link, private profile, etc.)</li>
              <li>Service degradation caused by platform policy changes</li>
              <li>Orders made more than 30 days ago</li>
              <li>Wallet balance used for other orders</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-bold text-slate-900 mt-6 mb-2">4. How to Request a Refund</h2>
            <p>
              Contact us at <b>ertumanshorts14@gmail.com</b> with your order ID and a
              description of the issue. We will review and respond within 3 business days.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-slate-900 mt-6 mb-2">5. Refund Method</h2>
            <p>
              Approved refunds are credited to your wallet balance within the panel.
              Wallet balance can be used for future orders.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-slate-900 mt-6 mb-2">6. Processing Time</h2>
            <p>
              Refund reviews typically take 1-3 business days. Wallet credits are
              processed within 24 hours of approval.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-slate-900 mt-6 mb-2">7. Disputes</h2>
            <p>
              Any disputes will be handled in good faith. We reserve the right to make
              final decisions on refund requests.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-slate-900 mt-6 mb-2">8. Contact</h2>
            <p>
              For refund requests, contact <b>ertumanshorts14@gmail.com</b>.
            </p>
          </section>
        </div>
      </div>
    </div>
  )
}