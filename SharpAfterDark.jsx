import { Link } from 'react-router-dom'
import { Clock, CheckCircle, ArrowRight, Phone } from 'lucide-react'

const steps = [
  { time: 'End of Service', action: 'We pick up your knives after last ticket is called. You keep cooking.' },
  { time: 'Overnight', action: 'Every blade is sharpened to industrial-grade standard at our hub. No shortcuts.' },
  { time: 'Before First Prep', action: 'Every knife is back on the rail before your first cook clocks in. Zero downtime.' },
]

const capabilities = [
  'All chef knife types — German, French, Japanese',
  'Single-bevel blades (Yanagiba, Deba) including torsional grind',
  'Distal taper restoration on thickened blades',
  'Chip removal and broken tip restoration',
  'Robot Coupe R2+ and larger food processors',
  'Meat slicers — all types',
  'Grinder blades and plates (matched pairs)',
  'MC450 immersion blenders',
  'Scissors, cleavers, spatulas, mandolines',
  'Any bladed equipment not serviced by Cozinni',
]

const pricing = [
  { item: 'Up to 10 knives', price: '$70', note: '$7/blade' },
  { item: '11–20 knives', price: '$70 + $3/blade', note: 'Smart Slider' },
  { item: '20+ knives', price: '$100 base + $5/blade', note: 'Volume rate' },
  { item: 'Minor repairs', price: '$4', note: 'Per blade' },
  { item: 'Major repairs', price: '$8', note: 'Per blade' },
  { item: 'Robot Coupe blade', price: '$16', note: '' },
  { item: 'Immersion blender', price: '$30', note: '' },
  { item: 'Meat slicer blade', price: 'Call', note: 'By size' },
]

export default function SharpAfterDark() {
  return (
    <main className="pt-20 overflow-x-hidden">
      {/* HERO */}
      <section className="relative min-h-[60vh] flex items-center justify-center py-20 px-4 overflow-hidden">
        <div className="absolute inset-0 grid-bg opacity-100" />
        <div className="glow-orb-pink w-96 h-96 top-0 left-0" />
        <div className="glow-orb-cyan w-96 h-96 bottom-0 right-0" />
        <div className="absolute inset-0 bg-gradient-to-b from-midnight via-transparent to-midnight" />
        <div className="relative z-10 text-center max-w-4xl mx-auto">
          <p className="font-mono text-neon-cyan text-xs tracking-[0.3em] uppercase mb-4">Commercial Kitchen Service</p>
          <h1 className="font-heading font-black text-5xl sm:text-6xl md:text-7xl neon-pink mb-6 uppercase">
            Sharp After Dark
          </h1>
          <p className="font-body text-xl text-light/70 leading-relaxed max-w-2xl mx-auto mb-4">
            Your kitchen doesn't sleep. Neither do your blades.
          </p>
          <p className="font-heading text-neon-cyan text-lg font-bold mb-10">
            Pickup at last call. Back before first prep. Zero downtime — ever.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="sms:3059095773?body=SHARP" className="btn-primary">
              Text SHARP to (305) 909-5773
            </a>
            <a href="tel:3059095773" className="btn-secondary">
              <Phone size={16} className="inline mr-2" />
              Call Directly
            </a>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="py-20 px-4 bg-dark">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <p className="font-mono text-neon-pink text-xs tracking-[0.2em] uppercase mb-3">The Model</p>
            <h2 className="section-title text-light mb-4">HOW IT WORKS</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {steps.map((step, i) => (
              <div key={i} className="card-dark rounded-sm p-8 text-center relative">
                <div className="w-12 h-12 rounded-full border-2 border-neon-cyan flex items-center justify-center mx-auto mb-4 font-heading font-bold text-neon-cyan text-lg">
                  {i + 1}
                </div>
                <p className="font-mono text-neon-cyan text-xs tracking-wider uppercase mb-2">{step.time}</p>
                <p className="font-body text-light/70 leading-relaxed">{step.action}</p>
                {i < 2 && (
                  <ArrowRight className="hidden md:block absolute -right-3 top-1/2 transform -translate-y-1/2 text-neon-pink z-10" size={20} />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* THE PITCH */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="neon-border-pink rounded-sm p-8 md:p-12 bg-dark/50">
            <p className="font-mono text-neon-pink text-xs tracking-[0.2em] uppercase mb-4">The Standard</p>
            <h2 className="font-heading font-bold text-3xl md:text-4xl text-light mb-6">
              17 Years. Gary Danko.<br />The French Laundry.<br />
              <span className="neon-cyan">Now in Your Kitchen.</span>
            </h2>
            <p className="font-body text-light/70 text-lg leading-relaxed mb-6">
              Every knife I sharpen leaves the hub to the same standard I held at Michelin-starred kitchens in San Francisco. Not a "good enough for a restaurant" standard — the standard. The one where the chef picks up the knife and goes quiet for a second.
            </p>
            <p className="font-body text-light/70 text-lg leading-relaxed mb-6">
              The first service restores your blades to proper geometry — that first pass takes more work because I'm rebuilding, not maintaining. After that, recurring service is faster and priced accordingly. We run it on your schedule: all at once, in rotation, half this month and half next based on what's seen the most use.
            </p>
            <p className="font-body text-neon-cyan font-semibold">
              Demo offer: Let me sharpen 2-3 of your steak knives at no charge. You'll know within one table turn whether I'm worth talking to further.
            </p>
          </div>
        </div>
      </section>

      {/* WHAT WE SERVICE */}
      <section className="py-20 px-4 bg-dark">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <p className="font-mono text-neon-cyan text-xs tracking-[0.2em] uppercase mb-3">Full Capability</p>
            <h2 className="section-title text-light mb-4">WHAT WE SERVICE</h2>
            <p className="font-body text-light/50 max-w-xl mx-auto">
              Knives and beyond. If it has a blade and it's slowing your kitchen down, we can fix it.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-3xl mx-auto">
            {capabilities.map((item, i) => (
              <div key={i} className="flex items-start gap-3 p-4 card-dark rounded-sm">
                <CheckCircle size={16} className="text-neon-cyan flex-shrink-0 mt-0.5" />
                <p className="font-body text-light/70 text-sm">{item}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PRICING */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <p className="font-mono text-neon-pink text-xs tracking-[0.2em] uppercase mb-3">Commercial Rates</p>
            <h2 className="section-title text-light mb-4">PRICING</h2>
            <p className="font-body text-light/50 max-w-xl mx-auto">
              The $70 base is the maintenance floor. First-service restoration typically runs higher — that's honest accounting, not upselling.
            </p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b border-neon-cyan/20">
                  <th className="font-mono text-xs text-neon-cyan tracking-wider text-left py-3 px-4">Service</th>
                  <th className="font-mono text-xs text-neon-cyan tracking-wider text-right py-3 px-4">Rate</th>
                  <th className="font-mono text-xs text-neon-cyan tracking-wider text-right py-3 px-4">Note</th>
                </tr>
              </thead>
              <tbody>
                {pricing.map((row, i) => (
                  <tr key={i} className="border-b border-white/5 hover:bg-neon-cyan/5 transition-colors">
                    <td className="font-body text-light/70 py-3 px-4">{row.item}</td>
                    <td className="font-heading text-neon-pink font-bold text-right py-3 px-4">{row.price}</td>
                    <td className="font-mono text-xs text-muted text-right py-3 px-4">{row.note}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="font-mono text-xs text-muted/50 mt-4 text-center">
            48-hour cancellation policy applies · Service agreements available for recurring accounts
          </p>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4 bg-dark border-t border-neon-pink/20">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="font-heading font-bold text-3xl neon-pink mb-4">Ready to talk?</h2>
          <p className="font-body text-light/60 mb-8">
            Text or call. I'll pick up. We sort the logistics in five minutes.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="sms:3059095773?body=SHARP" className="btn-primary">
              Text SHARP to (305) 909-5773
            </a>
            <a href="tel:3059095773" className="btn-secondary">
              Call (305) 909-5773
            </a>
          </div>
        </div>
      </section>
    </main>
  )
}
