import { Eye, Zap, Users, Crown, Star, Gem } from 'lucide-react'

const tiers = [
  {
    name: 'Scope the Scene',
    icon: Eye,
    price: 'FREE',
    sub: 'with honest review',
    color: 'neon-cyan',
    borderColor: 'rgba(0,245,212,0.3)',
    glowColor: 'rgba(0,245,212,0.1)',
    benefits: ['1 knife any size', 'One-time, no commitment', 'Let the edge sell itself'],
    cta: 'Claim Your Free Knife',
    ctaHref: 'sms:3059095773?body=SHARP',
    featured: false,
  },
  {
    name: 'Limited Access',
    icon: Zap,
    price: '$30',
    sub: 'per service',
    color: 'neon-purple',
    borderColor: 'rgba(155,93,229,0.3)',
    glowColor: 'rgba(155,93,229,0.1)',
    benefits: ['1 Large OR', '1 Medium + 2 Small'],
    cta: 'Get Started',
    ctaHref: 'sms:3059095773?body=SHARP',
    featured: false,
  },
  {
    name: 'Club Regular',
    icon: Users,
    price: '$60',
    sub: 'per service',
    color: 'neon-cyan',
    borderColor: 'rgba(0,245,212,0.5)',
    glowColor: 'rgba(0,245,212,0.08)',
    benefits: ['1 Large + 1 Medium + 3 Small', 'OR 3 Medium + 4 Small', '3 raffle tickets'],
    cta: 'Join the Club',
    ctaHref: 'sms:3059095773?body=SHARP',
    featured: true,
  },
  {
    name: 'VIP',
    icon: Crown,
    price: '$105',
    sub: 'per service',
    color: 'neon-pink',
    borderColor: 'rgba(255,45,120,0.3)',
    glowColor: 'rgba(255,45,120,0.08)',
    benefits: ['4 Large + 2 Medium + 2 Small', 'OR 6 Medium + 6 Small', '4 raffle tickets', 'Priority scheduling'],
    cta: 'Go VIP',
    ctaHref: 'sms:3059095773?body=SHARP',
    featured: false,
  },
  {
    name: 'All Access',
    icon: Star,
    price: '$200',
    sub: 'per service',
    color: 'neon-pink',
    borderColor: 'rgba(255,45,120,0.4)',
    glowColor: 'rgba(255,45,120,0.1)',
    benefits: ['Up to 20 knives any size', 'OR 30 small knives', '6 raffle tickets', 'Free pickup & delivery'],
    cta: 'Go All Access',
    ctaHref: 'sms:3059095773?body=SHARP',
    featured: false,
  },
  {
    name: 'Benefactor',
    icon: Gem,
    price: '$5,000',
    sub: 'by inquiry only',
    color: 'neon-purple',
    borderColor: 'rgba(155,93,229,0.5)',
    glowColor: 'rgba(155,93,229,0.1)',
    benefits: ['Unlimited priority service', 'White-glove logistics', '1-on-1 masterclasses', 'Curated collection access', '1 automatic raffle win/year'],
    cta: 'Inquire',
    ctaHref: 'mailto:SMaffit@MiamiKnifeGuy.com?subject=Benefactor Inquiry',
    featured: false,
  },
]

export default function MiamiKnifeClub() {
  return (
    <main className="pt-20 overflow-x-hidden">
      {/* HERO */}
      <section className="relative py-24 px-4 overflow-hidden">
        <div className="absolute inset-0 grid-bg" />
        <div className="glow-orb-cyan w-96 h-96 top-0 right-0" />
        <div className="glow-orb-pink w-96 h-96 bottom-0 left-0" />
        <div className="absolute inset-0 bg-gradient-to-b from-midnight via-transparent to-midnight" />
        <div className="relative z-10 text-center max-w-3xl mx-auto">
          <p className="font-mono text-neon-pink text-xs tracking-[0.3em] uppercase mb-4">Residential Membership</p>
          <h1 className="font-heading font-black text-5xl sm:text-6xl md:text-7xl neon-cyan mb-6 uppercase">
            Miami Knife Club
          </h1>
          <p className="font-body text-xl text-light/70 leading-relaxed mb-4">
            Recurring sharpening on your schedule. Never fight your food again.
          </p>
          <p className="font-mono text-sm text-light/40">
            Small = up to 5" · Medium = 5–9" · Large = 9+"
          </p>
        </div>
      </section>

      {/* FREE OFFER CALLOUT */}
      <section className="px-4 pb-8">
        <div className="max-w-3xl mx-auto">
          <div className="neon-border-pink rounded-sm p-6 bg-dark/80 text-center">
            <p className="font-heading font-bold text-2xl neon-pink mb-2">Start Free. No commitment.</p>
            <p className="font-body text-light/70 mb-4">
              One knife sharpened free in exchange for your honest review. Let the edge sell itself. If you don't feel the difference, you owe us nothing.
            </p>
            <a href="sms:3059095773?body=SHARP" className="btn-primary inline-flex">
              Text SHARP to (305) 909-5773
            </a>
          </div>
        </div>
      </section>

      {/* TIERS */}
      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {tiers.map((tier) => {
              const Icon = tier.icon
              return (
                <div
                  key={tier.name}
                  className={`rounded-sm p-6 relative transition-all duration-300 hover:-translate-y-1 ${tier.featured ? 'ring-1 ring-neon-cyan' : ''}`}
                  style={{
                    background: `linear-gradient(135deg, ${tier.glowColor}, rgba(10,10,18,0.9))`,
                    border: `1px solid ${tier.borderColor}`,
                  }}
                >
                  {tier.featured && (
                    <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                      <span className="font-mono text-xs bg-neon-cyan text-midnight px-3 py-1 uppercase tracking-wider font-bold">Most Popular</span>
                    </div>
                  )}
                  <Icon size={24} className={`text-${tier.color} mb-4`} style={{ color: tier.borderColor.replace('0.3', '1').replace('0.4', '1').replace('0.5', '1') }} />
                  <h3 className="font-heading font-bold text-lg text-light mb-1">{tier.name}</h3>
                  <div className="mb-4">
                    <span className="font-heading font-black text-3xl" style={{ color: tier.borderColor.replace('0.3', '1').replace('0.4', '1').replace('0.5', '1') }}>
                      {tier.price}
                    </span>
                    <span className="font-mono text-xs text-muted ml-2">{tier.sub}</span>
                  </div>
                  <ul className="space-y-2 mb-6">
                    {tier.benefits.map((b, i) => (
                      <li key={i} className="flex items-start gap-2 font-body text-sm text-light/60">
                        <span className="text-neon-cyan mt-1 flex-shrink-0">·</span>
                        {b}
                      </li>
                    ))}
                  </ul>
                  <a
                    href={tier.ctaHref}
                    className="block text-center font-heading font-bold text-xs uppercase tracking-wider py-3 px-4 rounded-sm border transition-all hover:scale-105"
                    style={{ borderColor: tier.borderColor, color: tier.borderColor.replace('0.3', '1').replace('0.4', '1').replace('0.5', '1') }}
                  >
                    {tier.cta}
                  </a>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* DIFFERENTIATORS */}
      <section className="py-16 px-4 bg-dark">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="section-title text-light mb-10">WHY MKG</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {[
              { title: 'Kosher & Halal', body: 'Dedicated equipment, zero cross-contamination. For clients who need it, this isn\'t a detail — it\'s the whole decision.' },
              { title: 'Free Pickup', body: 'Free pickup and delivery on 10+ knives. We come to you. You keep living your life.' },
              { title: 'Master Standard', body: '17 years. Gary Danko. The French Laundry. Every knife leaves to the same standard, residential or commercial.' },
            ].map((item, i) => (
              <div key={i} className="card-dark rounded-sm p-6">
                <h4 className="font-heading font-bold text-sm neon-cyan tracking-wider uppercase mb-3">{item.title}</h4>
                <p className="font-body text-light/60 text-sm leading-relaxed">{item.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  )
}
