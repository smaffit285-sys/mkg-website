import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Menu, X, Phone } from 'lucide-react'

const navLinks = [
  { label: 'Sharp After Dark', href: '/sharp-after-dark' },
  { label: 'Knife Club', href: '/miami-knife-club' },
  { label: 'Before & After', href: '/before-after' },
  { label: 'Services', href: '/sharpening-services' },
  { label: 'Our Story', href: '/brand-story' },
]

export default function Header() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const location = useLocation()

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => setMenuOpen(false), [location])

  return (
    <>
      <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? 'bg-midnight/95 backdrop-blur-md border-b border-neon-cyan/20' : 'bg-transparent'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <img
              src="https://static.wixstatic.com/media/37d64c_c26d92e0c01a495caeb57ac548ba7b8f~mv2.jpg"
              alt="Miami Knife Guy"
              className="w-10 h-10 rounded-full border border-neon-pink/50 group-hover:border-neon-cyan transition-colors"
            />
            <span className="font-heading font-bold text-sm sm:text-base hidden xs:block"
              style={{ background: 'linear-gradient(90deg, #ff2d78, #00f5d4)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              MIAMI KNIFE GUY
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-6">
            {navLinks.map(link => (
              <Link
                key={link.href}
                to={link.href}
                className={`font-body text-sm tracking-wider uppercase transition-colors hover:text-neon-cyan ${
                  location.pathname === link.href ? 'text-neon-cyan' : 'text-light/70'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* CTA */}
          <div className="hidden md:flex items-center gap-3">
            <a
              href="tel:3059095773"
              className="flex items-center gap-2 text-light/60 hover:text-neon-cyan transition-colors font-mono text-xs"
            >
              <Phone size={12} />
              (305) 909-5773
            </a>
            <a
              href="sms:3059095773?body=SHARP"
              className="btn-primary text-xs py-2 px-4"
            >
              Text SHARP
            </a>
          </div>

          {/* Mobile Menu Toggle */}
          <button
            className="lg:hidden text-light/70 hover:text-neon-cyan transition-colors"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {menuOpen && (
          <div className="lg:hidden bg-midnight/98 backdrop-blur-md border-t border-neon-cyan/20 px-4 py-6">
            <nav className="flex flex-col gap-4 mb-6">
              {navLinks.map(link => (
                <Link
                  key={link.href}
                  to={link.href}
                  className="font-heading text-sm tracking-wider uppercase text-light/70 hover:text-neon-cyan transition-colors py-2 border-b border-white/5"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
            <div className="flex flex-col gap-3">
              <a href="sms:3059095773?body=SHARP" className="btn-primary text-center text-xs py-3">
                Text 'SHARP' to (305) 909-5773
              </a>
              <a href="tel:3059095773" className="btn-secondary text-center text-xs py-3">
                Call (305) 909-5773
              </a>
            </div>
          </div>
        )}
      </header>

      {/* Mobile sticky CTA */}
      <a
        href="sms:3059095773?body=SHARP"
        className="fixed bottom-4 right-4 z-40 md:hidden bg-neon-cyan text-midnight font-heading font-bold text-xs px-4 py-3 rounded-sm uppercase tracking-wider shadow-xl"
        style={{ boxShadow: '0 0 20px rgba(0,245,212,0.5)' }}
      >
        Text SHARP
      </a>
    </>
  )
}
