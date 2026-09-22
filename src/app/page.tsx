import Link from 'next/link'
import Footer from './Footer'

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-[#0A0E27] text-white">
      {/* Navbar */}
      <nav className="border-b border-white/5 bg-[#0A0E27]/80 backdrop-blur-lg sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-4 flex justify-between items-center">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center font-bold text-sm">
              S
            </div>
            <span className="text-lg md:text-xl font-bold">SMUQ</span>
          </Link>
          <div className="hidden md:flex items-center gap-8 text-sm text-slate-300">
            <Link href="/" className="text-white font-medium">Home</Link>
            <Link href="/services" className="hover:text-white transition">Services</Link>
            <Link href="/dashboard/topup" className="hover:text-white transition">Add Funds</Link>
            <Link href="/dashboard/tickets" className="hover:text-white transition">Support</Link>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href="/login"
              className="text-sm text-slate-300 hover:text-white transition hidden md:block"
            >
              Login
            </Link>
            <Link
              href="/register"
              className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white text-xs md:text-sm px-4 md:px-5 py-2 rounded-lg font-medium transition shadow-lg shadow-purple-500/30"
            >
              Sign Up Free
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        {/* Background glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-purple-600/20 rounded-full blur-[120px] pointer-events-none"></div>
        <div className="absolute top-1/3 right-0 w-[600px] h-[600px] bg-blue-600/20 rounded-full blur-[120px] pointer-events-none"></div>

        <div className="relative max-w-7xl mx-auto px-4 md:px-6 py-16 md:py-24 grid md:grid-cols-2 gap-12 items-center">
          {/* Left — Text */}
          <div>
            <div className="inline-flex items-center gap-2 bg-purple-500/10 border border-purple-500/30 text-purple-300 text-xs font-medium px-4 py-1.5 rounded-full mb-6">
              <span>🚀</span>
              <span>Trusted by thousands of customers across Pakistan</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
              Pakistan's #1
              <br />
              <span className="bg-gradient-to-r from-purple-400 via-violet-400 to-blue-400 bg-clip-text text-transparent">
                SMM Panel
              </span>
            </h1>
            <p className="text-base md:text-lg text-slate-400 mb-8 max-w-lg">
              Boost your social media presence with Pakistan's most reliable and
              fastest SMM panel. Quality services, instant delivery, and 24/7
              support.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 mb-6">
              <Link
                href="/register"
                className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-6 md:px-8 py-3 md:py-4 rounded-lg font-semibold text-sm md:text-base transition shadow-lg shadow-purple-500/30 text-center"
              >
                Get Started Free →
              </Link>
              <Link
                href="/services"
                className="bg-white/5 hover:bg-white/10 backdrop-blur border border-white/10 text-white px-6 md:px-8 py-3 md:py-4 rounded-lg font-semibold text-sm md:text-base transition text-center"
              >
                View Services
              </Link>
            </div>

            {/* WhatsApp */}
            <a
              href="https://whatsapp.com/channel/0029VbDOMSuJUM2aIn4SXu3x"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-green-500/10 hover:bg-green-500/20 border border-green-500/30 text-green-300 px-5 py-2.5 rounded-lg font-medium transition text-sm"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
              </svg>
              Chat on WhatsApp
            </a>
          </div>

          {/* Right — Dashboard Preview */}
          <div className="relative hidden md:block">
            {/* Floating social icons */}
            <div className="absolute -top-8 -left-8 w-14 h-14 bg-white rounded-2xl shadow-2xl flex items-center justify-center text-2xl rotate-[-10deg] z-10">
              🎵
            </div>
            <div className="absolute -top-12 right-8 w-12 h-12 bg-gradient-to-br from-pink-500 to-purple-500 rounded-2xl shadow-2xl flex items-center justify-center text-white font-bold rotate-[15deg] z-10">
              📷
            </div>
            <div className="absolute -bottom-6 -left-6 w-12 h-12 bg-blue-500 rounded-2xl shadow-2xl flex items-center justify-center text-white font-bold -rotate-[15deg] z-10">
              f
            </div>
            <div className="absolute -bottom-4 right-0 w-12 h-12 bg-black rounded-2xl shadow-2xl flex items-center justify-center text-white font-bold rotate-[10deg] z-10">
              𝕏
            </div>

            {/* Dashboard mockup */}
            <div className="relative bg-gradient-to-br from-slate-900 to-slate-950 border border-white/10 rounded-2xl p-4 shadow-2xl">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-3 h-3 rounded-full bg-red-500/70"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-500/70"></div>
                <div className="w-3 h-3 rounded-full bg-green-500/70"></div>
                <div className="ml-auto text-xs text-slate-500">smuq.vercel.app</div>
              </div>
              <div className="bg-[#0A0E27] rounded-lg p-4 space-y-3">
                <div className="grid grid-cols-3 gap-2">
                  <div className="bg-purple-500/10 border border-purple-500/20 rounded-lg p-3">
                    <p className="text-[10px] text-slate-500">Balance</p>
                    <p className="text-sm font-bold text-white">Rs 500</p>
                  </div>
                  <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-3">
                    <p className="text-[10px] text-slate-500">Orders</p>
                    <p className="text-sm font-bold text-white">24</p>
                  </div>
                  <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-3">
                    <p className="text-[10px] text-slate-500">Active</p>
                    <p className="text-sm font-bold text-white">8</p>
                  </div>
                </div>
                <div className="bg-white/5 rounded-lg p-3 h-24 flex items-end justify-between gap-1">
                  {[40, 65, 30, 80, 45, 70, 55, 90, 60, 75].map((h, i) => (
                    <div
                      key={i}
                      className="flex-1 bg-gradient-to-t from-purple-500 to-blue-500 rounded-t"
                      style={{ height: `${h}%` }}
                    ></div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="border-y border-white/5 bg-white/[0.02] backdrop-blur">
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-10 md:py-12 grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          <StatCard icon="👥" value="1000+" label="Happy Users" />
          <StatCard icon="📦" value="5000+" label="Orders Completed" />
          <StatCard icon="🎧" value="24/7" label="Customer Support" />
          <StatCard icon="🛡️" value="100%" label="Real & Safe" />
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <div className="text-center mb-12 md:mb-16">
            <div className="inline-block bg-purple-500/10 border border-purple-500/30 text-purple-300 text-xs font-medium px-4 py-1.5 rounded-full mb-4">
              WHY CHOOSE SMUQ
            </div>
            <h2 className="text-2xl md:text-4xl font-bold mb-3">
              Powerful Features for Your Success
            </h2>
            <p className="text-slate-400 max-w-2xl mx-auto text-sm md:text-base">
              We provide everything you need to grow your social media presence
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
            <FeatureCard
              icon="⚡"
              title="Instant Delivery"
              description="Lightning fast delivery for all services. Get results in minutes, not hours."
            />
            <FeatureCard
              icon="💎"
              title="High Quality Services"
              description="Premium quality services from trusted providers. 100% real and safe."
            />
            <FeatureCard
              icon="💰"
              title="Affordable Prices"
              description="Competitive prices with the best value for money. Save more, grow faster."
            />
            <FeatureCard
              icon="📊"
              title="Real Results"
              description="Real engagement from real accounts. No bots, no fake data, just results."
            />
            <FeatureCard
              icon="🛡️"
              title="Secure & Safe"
              description="Your account security is our top priority. 100% safe and secure."
            />
            <FeatureCard
              icon="🎧"
              title="24/7 Support"
              description="Round the clock support via WhatsApp, live chat, and email."
            />
          </div>
        </div>
      </section>

      {/* WhatsApp CTA */}
      <section className="pb-16 md:pb-24">
        <div className="max-w-4xl mx-auto px-4 md:px-6">
          <a
            href="https://whatsapp.com/channel/0029VbDOMSuJUM2aIn4SXu3x"
            target="_blank"
            rel="noopener noreferrer"
            className="block bg-gradient-to-r from-green-500/10 to-green-600/10 hover:from-green-500/20 hover:to-green-600/20 border border-green-500/30 rounded-2xl p-6 md:p-8 text-center transition"
          >
            <div className="text-3xl md:text-4xl mb-3">💬</div>
            <h3 className="text-xl md:text-2xl font-bold text-white mb-2">
              Join Our WhatsApp Channel
            </h3>
            <p className="text-sm md:text-base text-green-300">
              Get instant updates, offers, and support →
            </p>
          </a>
        </div>
      </section>

      {/* CTA Section */}
      <section className="pb-16 md:pb-24">
        <div className="max-w-4xl mx-auto px-4 md:px-6">
          <div className="relative bg-gradient-to-br from-purple-600 to-blue-600 rounded-2xl p-8 md:p-12 text-center overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.2),transparent_50%)]"></div>
            <div className="relative">
              <h2 className="text-2xl md:text-4xl font-bold mb-4">
                Ready to grow your business?
              </h2>
              <p className="text-sm md:text-base text-purple-100 mb-6">
                Join thousands of satisfied customers across Pakistan
              </p>
              <Link
                href="/register"
                className="inline-block bg-white text-purple-700 hover:bg-purple-50 px-8 py-3 md:py-4 rounded-lg font-bold text-sm md:text-base transition shadow-2xl"
              >
                Sign Up Now — It's Free
              </Link>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}

function StatCard({
  icon,
  value,
  label,
}: {
  icon: string
  value: string
  label: string
}) {
  return (
    <div className="bg-white/5 backdrop-blur border border-white/10 rounded-xl p-4 md:p-5 text-center hover:bg-white/10 transition">
      <div className="text-2xl md:text-3xl mb-2">{icon}</div>
      <p className="text-xl md:text-2xl font-bold text-white">{value}</p>
      <p className="text-xs md:text-sm text-slate-400 mt-1">{label}</p>
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
    <div className="bg-white/[0.03] backdrop-blur border border-white/10 rounded-2xl p-5 md:p-6 hover:bg-white/[0.06] hover:border-purple-500/30 transition group">
      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500/20 to-blue-500/20 border border-purple-500/30 flex items-center justify-center text-2xl mb-4 group-hover:scale-110 transition">
        {icon}
      </div>
      <h3 className="font-bold text-white mb-2 text-base md:text-lg">{title}</h3>
      <p className="text-sm text-slate-400 leading-relaxed">{description}</p>
    </div>
  )
}