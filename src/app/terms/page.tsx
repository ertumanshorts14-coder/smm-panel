import Link from 'next/link'

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-slate-100 py-12 px-4">
      <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-sm p-8">
        <Link href="/" className="text-sm text-blue-600 hover:underline">
          ← Back to Home
        </Link>

        <h1 className="text-3xl font-bold text-slate-900 mt-4 mb-2">
          Terms of Service
        </h1>
        <p className="text-sm text-slate-500 mb-6">
          Last updated: {new Date().toLocaleDateString()}
        </p>

        <div className="prose prose-slate max-w-none space-y-4 text-slate-700 text-sm leading-relaxed">
          <section>
            <h2 className="text-lg font-bold text-slate-900 mt-6 mb-2">1. Acceptance of Terms</h2>
            <p>
              By accessing and using SMUQ SMM Panel ("the Service"), you accept and agree
              to be bound by these Terms. If you do not agree, please do not use the Service.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-slate-900 mt-6 mb-2">2. Eligibility</h2>
            <p>
              You must be at least 18 years old to use this Service. By using the Service,
              you represent that you meet this requirement.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-slate-900 mt-6 mb-2">3. Account Responsibility</h2>
            <p>
              You are responsible for maintaining the confidentiality of your account
              credentials. All activities under your account are your responsibility.
              Notify us immediately of any unauthorized use.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-slate-900 mt-6 mb-2">4. Services</h2>
            <p>
              We provide legitimate digital marketing and social media management services.
              We do not provide, promote, or allow:
            </p>
            <ul className="list-disc pl-6 mt-2 space-y-1">
              <li>Fake followers, likes, or engagement that violates platform terms</li>
              <li>Any illegal activity, spam, or fraudulent behavior</li>
              <li>Services involving hacking, phishing, or unauthorized access</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-bold text-slate-900 mt-6 mb-2">5. Payments</h2>
            <p>
              All payments must be made through approved methods. Wallet balances are
              non-transferable. We reserve the right to refund or adjust transactions
              in case of errors or fraudulent activity.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-slate-900 mt-6 mb-2">6. Refunds</h2>
            <p>
              Refunds are provided at our discretion for undelivered services. Please
              see our <Link href="/refund" className="text-blue-600 hover:underline">Refund Policy</Link> for details.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-slate-900 mt-6 mb-2">7. Account Suspension</h2>
            <p>
              We reserve the right to suspend or terminate accounts that violate these
              Terms, engage in fraud, or abuse the Service.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-slate-900 mt-6 mb-2">8. Limitation of Liability</h2>
            <p>
              The Service is provided "as is" without warranties. We are not liable for
              any indirect, incidental, or consequential damages arising from use of
              the Service.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-slate-900 mt-6 mb-2">9. Changes to Terms</h2>
            <p>
              We may update these Terms at any time. Continued use of the Service after
              changes constitutes acceptance of the new Terms.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-slate-900 mt-6 mb-2">10. Contact</h2>
            <p>
              For questions, contact us at <b>ertumanshorts14@gmail.com</b>.
            </p>
          </section>
        </div>
      </div>
    </div>
  )
}