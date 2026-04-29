import { useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { ChevronDown, Zap, Shield, Clock, Star, ArrowRight } from 'lucide-react'

const tickerItems = [
    '17 YEARS AS A MASTER SHARPENER',
    'GARY DANKO · THE FRENCH LAUNDRY · HOTEL NIKKO',
    'PICKUP AT LAST CALL · BACK BEFORE FIRST PREP',
    'KOSHER & HALAL SHARPENING AVAILABLE',
    'SERVING MIAMI-DADE & BROWARD',
    'FREE FIRST KNIFE · LET THE EDGE SELL ITSELF',
    'NO CHEAP PULL-THROUGHS · NO RUINED BLADES',
  ]

const painPoints = [
    'Prep cooks fighting over the one knife that still cuts',
    'Crushing food instead of slicing — more waste, more frustration',
    'Dull blades slip off food and onto fingers',
    'Expensive Japanese steel in a drawer because nobody trusts the sharpener',
  ]

const lies = [
  { myth: 'Pull-throughs are fine', truth: 'They shred metal geometry. We restore the original edge angle every time.' },
  { myth: 'A knife is just a knife', truth: 'Every steel is different. German, Japanese, single-bevel — each needs a custom angle and abrasive sequence.' },
  { myth: 'Sharpening takes too long', truth: 'Pickup at last call, back before first prep. Zero downtime. Or we come to you.' },
  { myth: "I'm not a chef — it doesn't matter", truth: 'A dull knife is the most dangerous tool in your house. And your food tastes better when cut, not crushed.' },
  { myth: "It's chipped — trash it", truth: "We save chips, broken tips, and damaged blades. If there's steel left, there's an edge left." },
  ]

export default function Home() {
    return (
          <main className="overflow-x-hidden">
            {/* HERO */}
                <section className="relative min-h-screen flex items-center justify-center pt-20 pb-12 px-4 overflow-hidden">
                  {/* Background */}
                        <div className="absolute inset-0 grid-bg opacity-100" />
                        <div className="glow-orb-pink w-96 h-96 top-10 left-0" />
                        <div className="glow-orb-cyan w-96 h-96 bottom-10 right-0" />
                        <div className="absolute inset-0 bg-gradient-to-b from-midnight/50 via-transparent to-midnight" />
                
                        <div className="relative z-10 max-w-5xl mx-auto text-center">
                          {/* Logo */}
                                  <div className="mb-8 flex justify-center">
                                              <div className="relative w-64 h-64 md:w-80 md:h-80">
                                                            <img
                                                                              src="/MKG_LOGO-7fe6ca44cb71193b.jpg"
                                                                              alt="Miami Knife Guy"
                                                                              className="w-full h-full object-contain relative z-10"
                                                                              style={{ filter: 'drop-shadow(0 0 20px rgba(255,45,120,0.7)) drop-shadow(0 0 40px rgba(0,245,212,0.4))' }}
                                                                            />
                                              </div>div>
                                  </div>div>
                        
                          {/* Eyebrow */}
                                  <p className="font-mono text-neon-cyan text-xs tracking-[0.3em] uppercase mb-4 animate-glow">
                                              Miami's Master Sharpener · Est. 2026
                                  </p>p>
                        
                          {/* Headline */}
                                  <h1 className="font-heading font-black text-4xl sm:text-5xl md:text-6xl lg:text-7xl leading-tight mb-4 neon-flicker">
                                              <span className="neon-pink">Dull Knives Are</span>span><br />
                                              <span className="neon-cyan">Slowing Your Kitchen Down.</span>span><br />
                                              <span className="neon-pink">We Fix That Overnight.</span>span>
                                  </h1>h1>
                        
                          {/* Credibility */}
                                  <p className="font-mono text-xs sm:text-sm text-light/60 tracking-wider mb-4 uppercase">
                                              17 Years · Gary Danko · The French Laundry · Hotel Nikko · Acquerello · Now in Miami
                                  </p>p>
                        
                          {/* Sub */}
                                  <p className="font-body text-lg sm:text-xl text-light/80 max-w-2xl mx-auto leading-relaxed mb-2">
                                              Industrial-grade sharpening for Miami's top kitchens and serious home cooks.
                                              Pickup at last call. Back before first prep. No cheap pull-throughs. No ruined blades.
                                  </p>p>
                                  <p className="font-body text-sm text-neon-cyan/70 mb-10">
                                              Free pickup &amp; delivery · Kosher &amp; halal sharpening available · Serving Miami-Dade &amp; Broward
                                  </p>p>
                        
                          {/* CTAs */}
                                  <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
                                              <a href="sms:3059095773?body=SHARP" className="btn-primary w-full sm:w-auto">
                                                            Text 'SHARP' to (305) 909-5773
                                              </a>a>
                                              <Link to="/miami-knife-club" className="btn-secondary w-full sm:w-auto text-center">
                                                            Get Your First Knife Free
                                              </Link>Link>
                                  </div>div>
                        
                                  <ChevronDown className="mx-auto text-neon-cyan/50 animate-bounce" size={24} />
                        </div>div>
                </section>section>
          
            {/* TICKER */}
                <div className="bg-dark border-y border-neon-pink/20 py-4 overflow-hidden">
                        <div className="ticker-wrap">
                                  <div className="ticker-content">
                                    {[...tickerItems, ...tickerItems].map((item, i) => (
                          <span key={i} className="inline-flex items-center gap-6 px-6">
                                          <span className="font-heading text-sm font-bold neon-pink tracking-wider">{item}</span>span>
                                          <span className="text-neon-cyan text-xl">◆</span>span>
                          </span>span>
                        ))}
                                  </div>div>
                        </div>div>
                </div>div>
          
            {/* PAIN SECTION */}
                <section className="py-20 px-4 relative overflow-hidden">
                        <div className="glow-orb-pink w-80 h-80 top-0 right-0 opacity-50" />
                        <div className="max-w-6xl mx-auto">
                                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                                              <div>
                                                            <p className="font-mono text-neon-pink text-xs tracking-[0.2em] uppercase mb-3">The Problem</p>p>
                                                            <h2 className="section-title neon-pink mb-6">DULL IS<br />DANGEROUS.</h2>h2>
                                                            <p className="font-body text-light/70 text-lg leading-relaxed mb-8">
                                                                            Dull blades slip off food and onto fingers. They crush instead of cut — more waste, more frustration, more risk. A sharp knife is faster, safer, and makes everything you cook taste better.
                                                            </p>p>
                                                            <div className="space-y-4">
                                                              {painPoints.map((point, i) => (
                              <div key={i} className="flex items-start gap-3">
                                                  <div className="w-2 h-2 bg-neon-cyan rounded-full mt-2 flex-shrink-0" />
                                                  <p className="font-body text-light/70">{point}</p>p>
                              </div>div>
                            ))}
                                                            </div>div>
                                              </div>div>
                                              <div className="relative">
                                                            <div className="neon-border-cyan rounded-sm overflow-hidden bg-dark p-6">
                                                                            <div className="grid grid-cols-2 gap-4">
                                                                                              <div className="text-center">
                                                                                                                  <img
                                                                                                                                          src="https://static.wixstatic.com/media/37d64c_fbeb3c16558c461b9d5d2420732b6ffc~mv2.jpg"
                                                                                                                                          alt="Dull knife before"
                                                                                                                                          className="w-full h-48 object-cover rounded-sm mb-2"
                                                                                                                                        />
                                                                                                                  <span className="font-heading text-xs text-neon-pink tracking-wider">DULL</span>span>
                                                                                                </div>div>
                                                                                              <div className="text-center">
                                                                                                                  <img
                                                                                                                                          src="https://static.wixstatic.com/media/37d64c_fcc4f79373ec4607abda79e2198826e7~mv2.jpg"
                                                                                                                                          alt="Sharp knife after"
                                                                                                                                          className="w-full h-48 object-cover rounded-sm mb-2"
                                                                                                                                        />
                                                                                                                  <span className="font-heading text-xs text-neon-cyan tracking-wider">SHARP</span>span>
                                                                                                </div>div>
                                                                            </div>div>
                                                                            <div className="mt-4 pt-4 border-t border-neon-cyan/20 text-center">
                                                                                              <p className="font-mono text-xs text-neon-cyan/60">Every knife. Master standard. Every time.</p>p>
                                                                            </div>div>
                                                            </div>div>
                                              </div>div>
                                  </div>div>
                        </div>div>
                </section>section>
          
            {/* TWO PATHS */}
                <section className="py-20 px-4 bg-dark relative overflow-hidden">
                        <div className="glow-orb-cyan w-80 h-80 top-0 left-0 opacity-40" />
                        <div className="max-w-6xl mx-auto">
                                  <div className="text-center mb-12">
                                              <p className="font-mono text-neon-cyan text-xs tracking-[0.2em] uppercase mb-3">Two Ways In</p>p>
                                              <h2 className="section-title text-light mb-4">WHO ARE YOU?</h2>h2>
                                  </div>div>
                                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {/* Commercial */}
                                              <Link to="/sharp-after-dark" className="group">
                                                            <div className="card-dark rounded-sm p-8 h-full transition-all duration-300 group-hover:border-neon-pink/50"
                                                                              style={{ borderColor: 'rgba(255,45,120,0.2)' }}>
                                                                            <div className="mb-6">
                                                                                              <Clock className="text-neon-pink mb-3" size={32} />
                                                                                              <p className="font-mono text-neon-pink text-xs tracking-[0.2em] uppercase mb-2">For Restaurants &amp; Hotels</p>p>
                                                                                              <h3 className="font-heading font-bold text-2xl text-light mb-3">Sharp After Dark</h3>h3>
                                                                                              <p className="font-body text-light/60 leading-relaxed">
                                                                                                                  We pick up at the end of service. Sharpen overnight at the hub to industrial-grade standard. Back before your first prep cook clocks in. Zero downtime. Ever.
                                                                                                </p>p>
                                                                            </div>div>
                                                                            <div className="flex items-center gap-2 text-neon-pink font-heading text-sm font-bold group-hover:gap-4 transition-all">
                                                                                              Learn the model <ArrowRight size={16} />
                                                                            </div>div>
                                                            </div>div>
                                              </Link>Link>
                                  
                                    {/* Residential */}
                                              <Link to="/miami-knife-club" className="group">
                                                            <div className="card-dark rounded-sm p-8 h-full transition-all duration-300 group-hover:border-neon-cyan/50"
                                                                              style={{ borderColor: 'rgba(0,245,212,0.2)' }}>
                                                                            <div className="mb-6">
                                                                                              <Star className="text-neon-cyan mb-3" size={32} />
                                                                                              <p className="font-mono text-neon-cyan text-xs tracking-[0.2em] uppercase mb-2">For Home Cooks</p>p>
                                                                                              <h3 className="font-heading font-bold text-2xl text-light mb-3">Miami Knife Club</h3>h3>
                                                                                              <p className="font-body text-light/60 leading-relaxed">
                                                                                                                  Membership sharpening on your schedule. Start free — one knife, no commitment, in exchange for your honest review. Let the edge sell itself.
                                                                                                </p>p>
                                                                            </div>div>
                                                                            <div className="flex items-center gap-2 text-neon-cyan font-heading text-sm font-bold group-hover:gap-4 transition-all">
                                                                                              See membership tiers <ArrowRight size={16} />
                                                                            </div>div>
                                                            </div>div>
                                              </Link>Link>
                                  </div>div>
                        </div>div>
                </section>section>
          
            {/* 5 LIES */}
                <section className="py-20 px-4 relative overflow-hidden">
                        <div className="glow-orb-pink w-80 h-80 bottom-0 right-0 opacity-40" />
                        <div className="max-w-7xl mx-auto">
                                  <div className="text-center mb-12">
                                              <p className="font-mono text-neon-pink text-xs tracking-[0.2em] uppercase mb-3">Common Myths</p>p>
                                              <h2 className="section-title neon-cyan mb-4">THE 5 LIES<br />OF SHARPENING</h2>h2>
                                              <p className="font-body text-light/50 max-w-xl mx-auto">
                                                            Debunking the myths that are keeping your knives dull
                                              </p>p>
                                  </div>div>
                                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-10">
                                    {lies.map((lie, i) => (
                          <div key={i} className="card-dark rounded-sm p-5 group hover:border-neon-pink/40 transition-all">
                                          <div className="w-8 h-8 rounded-full border border-neon-cyan/30 flex items-center justify-center mb-4 font-heading text-neon-cyan text-sm font-bold">
                                            {i + 1}
                                          </div>div>
                                          <h4 className="font-heading text-sm font-bold text-neon-pink mb-2">{lie.myth}</h4>h4>
                                          <div className="h-px bg-neon-cyan/20 mb-3" />
                                          <p className="font-body text-light/60 text-sm leading-relaxed">{lie.truth}</p>p>
                          </div>div>
                        ))}
                                  </div>div>
                                  <div className="text-center">
                                              <p className="font-body text-light/50 mb-4">Ready to feel the difference? Your first knife is on us.</p>p>
                                              <a href="sms:3059095773?body=SHARP" className="btn-primary inline-flex">
                                                            Text 'SHARP' to (305) 909-5773
                                              </a>a>
                                  </div>div>
                        </div>div>
                </section>section>
          
            {/* PROOF */}
                <section className="py-16 px-4 bg-dark border-y border-neon-cyan/10">
                        <div className="max-w-4xl mx-auto text-center">
                                  <p className="font-mono text-neon-cyan text-xs tracking-[0.2em] uppercase mb-6">What Miami Kitchens Are Saying</p>p>
                                  <blockquote className="font-body text-xl text-light/80 italic leading-relaxed mb-4">
                                              "I handed him the knife my exec chef had retired — said it was done. He handed it back and I wanted to sing. That's the standard."
                                  </blockquote>blockquote>
                                  <p className="font-mono text-xs text-muted/50">— Kitchen Manager, North Miami Beach · First service</p>p>
                        </div>div>
                </section>section>
          
            {/* FINAL CTA */}
                <section className="py-24 px-4 relative overflow-hidden">
                        <div className="glow-orb-cyan w-96 h-96 top-0 left-1/4 opacity-30" />
                        <div className="glow-orb-pink w-96 h-96 bottom-0 right-1/4 opacity-30" />
                        <div className="relative z-10 max-w-3xl mx-auto text-center">
                                  <h2 className="section-title neon-pink mb-4">LET THE EDGE<br />SELL ITSELF.</h2>h2>
                                  <p className="font-body text-light/60 text-lg leading-relaxed mb-10 max-w-xl mx-auto">
                                              One knife. Sharpened free. In exchange for your honest review. No strings, no pressure, no pitch. Just feel what a real edge feels like — and then decide.
                                  </p>p>
                                  <div className="flex flex-col sm:flex-row gap-4 justify-center mb-10">
                                              <a href="sms:3059095773?body=SHARP" className="btn-primary">
                                                            Text 'SHARP' to (305) 909-5773
                                              </a>a>
                                              <a href="tel:3059095773" className="btn-secondary">
                                                            Call (305) 909-5773
                                              </a>a>
                                  </div>div>
                                  <div className="flex flex-wrap justify-center gap-4">
                                    {['5★ Google Rated', 'Kosher & Halal', 'Free First Knife', '17 Years Experience'].map(badge => (
                          <div key={badge} className="px-4 py-2 border border-neon-cyan/20 rounded-sm">
                                          <p className="font-mono text-xs text-neon-cyan/60 tracking-wider">{badge}</p>p>
                          </div>div>
                        ))}
                                  </div>div>
                        </div>div>
                </section>section>
          </main>main>
        )
}</main>
