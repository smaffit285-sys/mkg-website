import React from 'react'
import { Routes, Route } from 'react-router-dom'
import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import Header from './Header'
import Footer from './Footer'
import Home from './Home'
import SharpAfterDark from './SharpAfterDark'
import MiamiKnifeClub from './MiamiKnifeClub'
import BeforeAfter from './BeforeAfter'
import SharpeningServices from './SharpeningServices'
import BrandStory from './BrandStory'
import Admin from './Admin'

function ScrollToTop() {
    const { pathname } = useLocation()
    useEffect(() => { window.scrollTo(0, 0) }, [pathname])
    return null
}

export default function App() {
    return (
        <React.Fragment>
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
        </React.Fragment>
    )
}
