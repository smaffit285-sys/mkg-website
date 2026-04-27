import { Routes, Route } from 'react-router-dom'
import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import Header from './components/Header'
import Footer from './components/Footer'
import Home from './pages/Home'
import SharpAfterDark from './pages/SharpAfterDark'
import MiamiKnifeClub from './pages/MiamiKnifeClub'
import BeforeAfter from './pages/BeforeAfter'
import SharpeningServices from './pages/SharpeningServices'
import BrandStory from './pages/BrandStory'
import Admin from './pages/Admin'

function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => { window.scrollTo(0, 0) }, [pathname])
  return null
}

export default function App() {
  return (
    <>
      <ScrollToTop />
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/sharp-after-dark" element={<SharpAfterDark />} />
        <Route path="/miami-knife-club" element={<MiamiKnifeClub />} />
        <Route path="/before-after" element={<BeforeAfter />} />
        <Route path="/sharpening-services" element={<SharpeningServices />} />
        <Route path="/brand-story" element={<BrandStory />} />
        <Route path="/admin" element={<Admin />} />
      </Routes>
      <Footer />
    </>
  )
}
