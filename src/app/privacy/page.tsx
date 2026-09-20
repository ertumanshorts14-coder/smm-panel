import Link from 'next/link'

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-slate-100 py-12 px-4">
      <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-sm p-8">
        <Link href="/" className="text-sm text-blue-600 hover:underline">
          ← Back to Home
        </Link>

        <h1 className="text-3xl font-bold text-slate-900 mt-4 mb-2">
          Privacy Policy
        </h1>
        <p className="text-sm text-slate-500 mb-6">
          Last updated: {new Date().toLocaleDateString()}
        </p>

        <div className="prose prose-slate max-w-none space-y-4 text-slate-700 text-sm leading-relaxed">
          <section>
            <h2 className="text-lg font-bold text-slate-900 mt-6 mb-2">1. Information We Collect</h2>
            <ul className="list-disc pl-6 space-y-1">
              <li><b>Account data:</b> Email address and password (encrypted)</li>
              <li><b>Profile data:</b> Username and settings</li>
              <li><b>Transaction data:</b> Top-ups, orders, wallet balance</li>
              <li><b>Payment proofs:</b> Screenshots you upload for manual verification</li>
              <li><b>Usage data:</b> IP address, browser type, pages visited</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-bold text-slate-900 mt-6 mb-2">2. How We Use Your Data</h2>
            <ul className="list-disc pl-6 space-y-1">
              <li>To provide and improve the Service</li>
              <li>To process payments and orders</li>
              <li>To communicate about your account and orders</li>
              <li>To detect and prevent fraud or abuse</li>
              <li>To comply with legal obligations</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-bold text-slate-900 mt-6 mb-2">3. Data Sharing</h2>
            <p>
              We do not sell your personal data. We share data only with:
            </p>
            <ul className="list-disc pl-6 mt-2 space-y-1">
              <li>Service providers we use (Supabase for database, Vercel for hosting)</li>
              <li>Authorities when required by law</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-bold text-slate-900 mt-6 mb-2">4. Data Security</h2>
            <p>
              We use industry-standard security measures including encrypted connections
              (SSL/TLS) and secure password storage. However, no method is 100% secure.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-slate-900 mt-6 mb-2">5. Your Rights</h2>
            <p>
              You may request access to, correction of, or deletion of your personal
              data by contacting us.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-slate-900 mt-6 mb-2">6. Cookies</h2>
            <p>
              We use essential cookies for authentication and session management.
              No third-party tracking cookies are used.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-slate-900 mt-6 mb-2">7. Children's Privacy</h2>
            <p>
              Our Service is not intended for users under 18. We do not knowingly
              collect data from minors.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-slate-900 mt-6 mb-2">8. Changes</h2>
            <p>
              We may update this Privacy Policy. Changes will be posted on this page.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-slate-900 mt-6 mb-2">9. Contact</h2>
            <p>
              For privacy-related questions, contact <b>ertumanshorts14@gmail.com</b>.
            </p>
          </section>
        </div>
      </div>
    </div>
  )
}