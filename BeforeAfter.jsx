import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { ChevronLeft, ChevronRight, X } from 'lucide-react'

const STORAGE_KEY = 'mkg_before_after_gallery'

export default function BeforeAfter() {
  const [gallery, setGallery] = useState([])
  const [selected, setSelected] = useState(null)

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved) setGallery(JSON.parse(saved))
  }, [])

  const navigate = (dir) => {
    const idx = gallery.findIndex(e => e.id === selected.id)
    const next = gallery[idx + dir]
    if (next) setSelected(next)
  }

  return (
    <main className="pt-20 overflow-x-hidden">
      {/* HERO */}
      <section className="relative py-20 px-4 overflow-hidden">
        <div className="absolute inset-0 grid-bg" />
        <div className="glow-orb-pink w-80 h-80 top-0 right-0" />
        <div className="absolute inset-0 bg-gradient-to-b from-midnight via-transparent to-midnight" />
        <div className="relative z-10 text-center max-w-3xl mx-auto">
          <p className="font-mono text-neon-cyan text-xs tracking-[0.3em] uppercase mb-4">Proof of Standard</p>
          <h1 className="font-heading font-black text-5xl sm:text-6xl neon-pink mb-6 uppercase">
            Before & After
          </h1>
          <p className="font-body text-light/60 text-lg max-w-xl mx-auto">
            Every knife shown here went through our master sharpening process. The standard doesn't change — commercial or residential.
          </p>
        </div>
      </section>

      {/* GALLERY */}
      <section className="py-12 px-4 pb-24">
        <div className="max-w-7xl mx-auto">
          {gallery.length === 0 ? (
            <div className="text-center py-24">
              <p className="font-body text-muted text-lg mb-4">Gallery coming soon — check back after first service.</p>
              <a href="sms:3059095773?body=SHARP" className="btn-primary inline-flex">
                Text SHARP to Book Your First Service
              </a>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {gallery.map((entry) => (
                <button
                  key={entry.id}
                  onClick={() => setSelected(entry)}
                  className="card-dark rounded-sm overflow-hidden text-left group hover:border-neon-pink/40 transition-all"
                >
                  <div className="grid grid-cols-2 gap-0">
                    <div className="relative">
                      <img src={entry.before} alt="Before" className="w-full h-44 object-cover group-hover:brightness-110 transition-all" />
                      <span className="absolute bottom-2 left-2 font-mono text-xs bg-neon-pink text-midnight px-2 py-0.5 font-bold">BEFORE</span>
                    </div>
                    <div className="relative">
                      <img src={entry.after} alt="After" className="w-full h-44 object-cover group-hover:brightness-110 transition-all" />
                      <span className="absolute bottom-2 right-2 font-mono text-xs bg-neon-cyan text-midnight px-2 py-0.5 font-bold">AFTER</span>
                    </div>
                  </div>
                  <div className="p-4">
                    <p className="font-heading text-sm font-bold text-light">{entry.title}</p>
                    {entry.notes && <p className="font-body text-xs text-muted mt-1">{entry.notes}</p>}
                    <p className="font-mono text-xs text-neon-cyan/40 mt-2">{entry.date}</p>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* LIGHTBOX */}
      {selected && (
        <div className="fixed inset-0 z-50 bg-midnight/95 backdrop-blur-md flex items-center justify-center p-4"
          onClick={() => setSelected(null)}>
          <div className="max-w-4xl w-full" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-heading font-bold text-xl text-light">{selected.title}</h3>
                {selected.notes && <p className="font-body text-sm text-muted">{selected.notes}</p>}
              </div>
              <button onClick={() => setSelected(null)} className="text-muted hover:text-neon-pink transition-colors">
                <X size={24} />
              </button>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="relative">
                <img src={selected.before} alt="Before" className="w-full h-64 md:h-96 object-cover rounded-sm" />
                <span className="absolute bottom-3 left-3 font-mono text-sm bg-neon-pink text-midnight px-3 py-1 font-bold">BEFORE</span>
              </div>
              <div className="relative">
                <img src={selected.after} alt="After" className="w-full h-64 md:h-96 object-cover rounded-sm" />
                <span className="absolute bottom-3 right-3 font-mono text-sm bg-neon-cyan text-midnight px-3 py-1 font-bold">AFTER</span>
              </div>
            </div>
            <div className="flex justify-between mt-4">
              <button
                onClick={() => navigate(-1)}
                disabled={gallery.findIndex(e => e.id === selected.id) === 0}
                className="flex items-center gap-2 font-mono text-xs text-muted hover:text-neon-cyan disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronLeft size={16} /> Previous
              </button>
              <button
                onClick={() => navigate(1)}
                disabled={gallery.findIndex(e => e.id === selected.id) === gallery.length - 1}
                className="flex items-center gap-2 font-mono text-xs text-muted hover:text-neon-cyan disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              >
                Next <ChevronRight size={16} />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* CTA */}
      <section className="py-16 px-4 bg-dark border-t border-neon-cyan/10">
        <div className="max-w-2xl mx-auto text-center">
          <p className="font-body text-light/50 mb-2">Want to see your knives in this gallery?</p>
          <h2 className="font-heading font-bold text-2xl neon-cyan mb-6">Your first knife is on us.</h2>
          <a href="sms:3059095773?body=SHARP" className="btn-primary inline-flex">
            Text SHARP to (305) 909-5773
          </a>
        </div>
      </section>
    </main>
  )
}
