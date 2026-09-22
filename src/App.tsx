import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ScrollToTop from './components/ScrollToTop';
import HomePage from './pages/HomePage';
import WorkPage from './pages/WorkPage';
import GalleryPage from './pages/GalleryPage';
import ProjectDetailPage from './pages/ProjectDetailPage';
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';
import ShopPage from './pages/ShopPage';
import ShopProductDetailPage from './pages/ShopProductDetailPage';
import ShopEnquiryPage from './pages/ShopEnquiryPage';
import './styles/global.css';

export default function App() {
  return (
    <Router>
      <ScrollToTop />
      <Navbar />
      <main className="main-content">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/work" element={<WorkPage />} />
          <Route path="/gallery" element={<GalleryPage />} />
          <Route path="/project/:slug" element={<ProjectDetailPage />} />
          <Route path="/work/:slug" element={<ProjectDetailPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/shop" element={<ShopPage />} />
          <Route path="/shop/enquiry/:productSlug" element={<ShopEnquiryPage />} />
          <Route path="/shop/:productSlug" element={<ShopProductDetailPage />} />
        </Routes>
      </main>
      <Footer />
    </Router>
  );
}
