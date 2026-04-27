export default function SharpeningServices() {
  const services = [
    { name: 'Commercial Sharpening', desc: 'High-volume knife sharpening for professional kitchens. Every blade to master standard. Sharp After Dark model — pickup at close, back at open.', tags: ['BOH', 'FOH', 'High Volume'] },
    { name: 'Residential Service', desc: 'Premium home sharpening via Miami Knife Club membership. We come to you. Start free — one knife, honest review, no commitment.', tags: ['Home Cook', 'Recurring', 'Free First Knife'] },
    { name: 'Japanese Steel', desc: 'Single-bevel blades including Yanagiba and Deba. Torsional grind maintenance, urasuki preservation, shinogi line restoration. Stone-Sharp Heritage available.', tags: ['Single-Bevel', 'Yanagiba', 'Deba'] },
    { name: 'Blade Restoration', desc: 'Chip removal, broken tip restoration, distal taper correction on thickened blades. Thinning, reprofiling, reshaping. If there\'s steel left, there\'s an edge left.', tags: ['Chips', 'Repairs', 'Reprofile'] },
    { name: 'Kitchen Equipment', desc: 'Robot Coupe R2+, MC450 immersion blenders, meat slicers, grinder blades and plates (matched), buffalo choppers, mandolines, scissors. Everything Cozinni doesn\'t touch.', tags: ['Robot Coupe', 'Slicers', 'Grinders'] },
    { name: 'Stone-Sharp Heritage', desc: 'Hand-finished on Naniwa, NanoHone, and GrindKnife ceramics. For high-carbon Japanese steel, collector pieces, and executive blades. By appointment. $100/hr.', tags: ['Premium', 'Japanese Steel', 'By Appointment'] },
  ]

  return (
    <main className="pt-20 overflow-x-hidden">
      <section className="relative py-20 px-4 overflow-hidden">
        <div className="absolute inset-0 grid-bg" />
        <div className="glow-orb-cyan w-80 h-80 top-0 left-0" />
        <div className="absolute inset-0 bg-gradient-to-b from-midnight via-transparent to-midnight" />
        <div className="relative z-10 text-center max-w-3xl mx-auto">
          <p className="font-mono text-neon-pink text-xs tracking-[0.3em] uppercase mb-4">Full Capability</p>
          <h1 className="font-heading font-black text-5xl sm:text-6xl neon-cyan mb-6 uppercase">
            Sharpening Services
          </h1>
          <p className="font-body text-light/60 text-lg max-w-xl mx-auto">
            Professional sharpening solutions for commercial kitchens and serious home cooks. From daily maintenance to full restoration.
          </p>
        </div>
      </section>

      <section className="py-16 px-4 pb-24">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {services.map((service, i) => (
              <div key={i} className="card-dark rounded-sm p-6 hover:border-neon-cyan/30 transition-all">
                <h3 className="font-heading font-bold text-lg neon-cyan mb-3">{service.name}</h3>
                <p className="font-body text-light/60 text-sm leading-relaxed mb-4">{service.desc}</p>
                <div className="flex flex-wrap gap-2">
                  {service.tags.map(tag => (
                    <span key={tag} className="font-mono text-xs border border-neon-pink/20 text-neon-pink/70 px-2 py-0.5 rounded-sm">{tag}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
          <div className="mt-12 text-center">
            <p className="font-body text-muted mb-4">Not sure what you need? Text us. We'll figure it out together.</p>
            <a href="sms:3059095773?body=SHARP" className="btn-primary inline-flex">
              Text SHARP to (305) 909-5773
            </a>
          </div>
        </div>
      </section>
    </main>
  )
}
