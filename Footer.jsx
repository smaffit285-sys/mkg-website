import { Link } from 'react-router-dom'
import { Phone, Mail, MapPin, Instagram } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="bg-darker border-t border-neon-cyan/10 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
          {/* Brand */}
          <div>
            <h3 className="font-heading font-bold text-xl neon-pink mb-4">MIAMI KNIFE GUY</h3>
            <p className="font-body text-muted text-sm leading-relaxed mb-4">
              Master knife sharpening for Miami's top kitchens and serious home cooks. 17 years. Gary Danko. The French Laundry. Now in Miami.
            </p>
            <div className="flex gap-3">
              <a href="https://www.instagram.com/miamiknifeguy/" target="_blank" rel="noreferrer"
                className="w-9 h-9 border border-neon-pink/30 flex items-center justify-center hover:border-neon-pink hover:text-neon-pink transition-colors text-muted">
                <Instagram size={16} />
              </a>
            </div>
          </div>

          {/* Links */}
          <div>
            <h4 className="font-heading font-bold text-sm tracking-wider text-neon-cyan mb-4 uppercase">Quick Links</h4>
            <nav className="flex flex-col gap-2">
              {[
                { label: 'Sharp After Dark', href: '/sharp-after-dark' },
                { label: 'Miami Knife Club', href: '/miami-knife-club' },
                { label: 'Before & After', href: '/before-after' },
                { label: 'Sharpening Services', href: '/sharpening-services' },
                { label: 'Our Story', href: '/brand-story' },
              ].map(link => (
                <Link key={link.href} to={link.href}
                  className="font-body text-sm text-muted hover:text-neon-cyan transition-colors">
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-heading font-bold text-sm tracking-wider text-neon-cyan mb-4 uppercase">Contact</h4>
            <div className="flex flex-col gap-3">
              <a href="sms:3059095773?body=SHARP"
                className="flex items-center gap-3 font-body text-sm text-muted hover:text-neon-cyan transition-colors">
                <Phone size={14} className="text-neon-pink flex-shrink-0" />
                Text SHARP to (305) 909-5773
              </a>
              <a href="tel:3059095773"
                className="flex items-center gap-3 font-body text-sm text-muted hover:text-neon-cyan transition-colors">
                <Phone size={14} className="text-neon-pink flex-shrink-0" />
                (305) 909-5773
              </a>
              <a href="mailto:SMaffit@MiamiKnifeGuy.com"
                className="flex items-center gap-3 font-body text-sm text-muted hover:text-neon-cyan transition-colors">
                <Mail size={14} className="text-neon-pink flex-shrink-0" />
                SMaffit@MiamiKnifeGuy.com
              </a>
              <div className="flex items-center gap-3 font-body text-sm text-muted">
                <MapPin size={14} className="text-neon-pink flex-shrink-0" />
                North Miami Beach, FL
              </div>
            </div>
            <div className="mt-4 pt-4 border-t border-white/5">
              <p className="font-mono text-xs text-muted/50">
                Serving Miami-Dade & Broward<br />
                Kosher & Halal sharpening available
              </p>
            </div>
          </div>
        </div>

        <div className="border-t border-white/5 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="font-mono text-xs text-muted/40">
            © 2026 Miami Knife Guy · Knife King Inc. · All rights reserved.
          </p>
          <p className="font-mono text-xs text-neon-pink/40">
            Sharp After Dark — Pickup at last call. Back before first prep.
          </p>
        </div>
      </div>
    </footer>
  )
}
