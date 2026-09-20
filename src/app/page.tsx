import Link from 'next/link'
import Footer from './Footer'

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      {/* Navbar */}
      <nav className="border-b bg-white sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <Link href="/" className="text-xl font-bold text-slate-900">
            SMUQ SMM Panel
          </Link>
          <div className="flex items-center gap-4">
            <Link
              href="/login"
              className="text-sm font-medium text-slate-700 hover:text-blue-600"
            >
              Login
            </Link>
            <Link
              href="/register"
              className="bg-blue-600 hover:bg-blue-700 text-white text-sm px-5 py-2 rounded-lg font-medium transition"
            >
              Sign Up Free
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
        <div className="max-w-7xl mx-auto px-6 py-24 text-center">
          <div className="inline-block bg-blue-500/20 border border-blue-500/40 text-blue-300 text-xs font-medium px-4 py-1.5 rounded-full mb-6">
            🚀 Trusted by growing businesses in Pakistan
          </div>
          <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
            Pakistan's #1 <span className="text-blue-400">SMM Panel</span>
          </h1>
          <p className="text-xl text-slate-300 mb-10 max-w-2xl mx-auto">
            Grow your social media presence with real, reliable, and affordable
            digital marketing services. Trusted by hundreds of businesses.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/register"
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-lg font-semibold text-lg transition"
            >
              Get Started Free →
            </Link>
            <Link
              href="/services"
              className="bg-white/10 hover:bg-white/20 backdrop-blur border border-white/20 text-white px-8 py-4 rounded-lg font-semibold text-lg transition"
            >
              View Services
            </Link>
          </div>
          <p className="text-sm text-slate-400 mt-6">
            No credit card required • Instant setup
          </p>
        </div>
      </section>

      {/* Stats */}
      <section className="border-b bg-slate-50">
        <div className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          <div>
            <p className="text-3xl font-bold text-slate-900">1000+</p>
            <p className="text-sm text-slate-500 mt-1">Happy Users</p>
          </div>
          <div>
            <p className="text-3xl font-bold text-slate-900">5000+</p>
            <p className="text-sm text-slate-500 mt-1">Orders Completed</p>
          </div>
          <div>
            <p className="text-3xl font-bold text-slate-900">24/7</p>
            <p className="text-sm text-slate-500 mt-1">Support</p>
          </div>
          <div>
            <p className="text-3xl font-bold text-slate-900">100%</p>
            <p className="text-sm text-slate-500 mt-1">Real Services</p>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-14">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-3">
              Why Choose SMUQ?
            </h2>
            <p className="text-slate-500">
              Everything you need to grow your online presence
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <FeatureCard
              icon="⚡"
              title="Instant Delivery"
              description="Orders processed within minutes. No long waits."
            />
            <FeatureCard
              icon="🔒"
              title="100% Secure"
              description="Your data and payments are fully protected."
            />
            <FeatureCard
              icon="💰"
              title="Best Prices"
              description="Most competitive rates in Pakistan market."
            />
            <FeatureCard
              icon="🚀"
              title="Easy to Use"
              description="Simple interface. No technical knowledge needed."
            />
          </div>
        </div>
      </section>

      {/* Services Preview */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-14">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-3">
              Our Services
            </h2>
            <p className="text-slate-500">
              Professional digital marketing services for all platforms
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <ServiceCard name="Instagram" emoji="📸" />
            <ServiceCard name="Facebook" emoji="👍" />
            <ServiceCard name="YouTube" emoji="▶️" />
            <ServiceCard name="TikTok" emoji="🎵" />
            <ServiceCard name="Twitter" emoji="🐦" />
            <ServiceCard name="SEO" emoji="🔍" />
            <ServiceCard name="Google Ads" emoji="📊" />
            <ServiceCard name="Content" emoji="✍️" />
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-14">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-3">
              How It Works
            </h2>
            <p className="text-slate-500">Get started in 3 easy steps</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <StepCard
              number="1"
              title="Sign Up Free"
              description="Create your account in less than 30 seconds."
            />
            <StepCard
              number="2"
              title="Add Funds"
              description="Top-up via SadaPay, NayaPay, or bank transfer."
            />
            <StepCard
              number="3"
              title="Place Order"
              description="Choose service, paste link, and place order."
            />
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-3xl mx-auto px-6">
          <div className="text-center mb-14">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-3">
              Frequently Asked Questions
            </h2>
          </div>

          <div className="space-y-4">
            <FAQItem
              question="Is SMUQ SMM Panel safe to use?"
              answer="Yes. We use industry-standard security and only offer legitimate digital marketing services."
            />
            <FAQItem
              question="How do I add funds to my wallet?"
              answer="You can top-up via SadaPay, NayaPay, or bank transfer. Send payment and submit the TID + screenshot, admin verifies within minutes."
            />
            <FAQItem
              question="How long does order delivery take?"
              answer="Most orders start processing within minutes. Delivery time depends on the service and quantity."
            />
            <FAQItem
              question="What if my order doesn't complete?"
              answer="If an order fails to deliver, you can request a refund via our support. Wallet balance will be credited."
            />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-blue-600 to-blue-800 text-white">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to grow your business?
          </h2>
          <p className="text-lg text-blue-100 mb-8">
            Join hundreds of satisfied customers today
          </p>
          <Link
            href="/register"
            className="inline-block bg-white text-blue-700 hover:bg-blue-50 px-10 py-4 rounded-lg font-bold text-lg transition"
          >
            Sign Up Now — It's Free
          </Link>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  )
}

function FeatureCard({
  icon,
  title,
  description,
}: {
  icon: string
  title: string
  description: string
}) {
  return (
    <div className="bg-white border border-slate-200 rounded-xl p-6 hover:shadow-lg transition">
      <div className="text-4xl mb-4">{icon}</div>
      <h3 className="font-bold text-slate-900 mb-2">{title}</h3>
      <p className="text-sm text-slate-500">{description}</p>
    </div>
  )
}

function ServiceCard({ name, emoji }: { name: string; emoji: string }) {
  return (
    <div className="bg-white border border-slate-200 rounded-xl p-6 text-center hover:shadow-lg hover:border-blue-300 transition cursor-pointer">
      <div className="text-4xl mb-3">{emoji}</div>
      <p className="font-medium text-slate-900">{name}</p>
    </div>
  )
}

function StepCard({
  number,
  title,
  description,
}: {
  number: string
  title: string
  description: string
}) {
  return (
    <div className="text-center">
      <div className="w-16 h-16 bg-blue-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
        {number}
      </div>
      <h3 className="font-bold text-slate-900 text-lg mb-2">{title}</h3>
      <p className="text-slate-500 text-sm">{description}</p>
    </div>
  )
}

function FAQItem({ question, answer }: { question: string; answer: string }) {
  return (
    <details className="bg-white border border-slate-200 rounded-xl p-5 group">
      <summary className="font-semibold text-slate-900 cursor-pointer flex justify-between items-center">
        <span>{question}</span>
        <span className="text-slate-400 group-open:rotate-180 transition-transform">
          ▼
        </span>
      </summary>
      <p className="text-slate-600 mt-3 text-sm">{answer}</p>
    </details>
  )
}