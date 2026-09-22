import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { SHOP_PRODUCTS } from '../data/shop';
import { ArrowLeft, CheckCircle2 } from 'lucide-react';
import './ShopEnquiryPage.css';

export default function ShopEnquiryPage() {
  const { productSlug } = useParams<{ productSlug: string }>();
  const navigate = useNavigate();
  
  const [product, setProduct] = useState(SHOP_PRODUCTS.find(p => p.slug === productSlug));
  
  // Frontend-only form state
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  });

  useEffect(() => {
    const found = SHOP_PRODUCTS.find(p => p.slug === productSlug);
    setProduct(found);
    window.scrollTo(0, 0);
  }, [productSlug]);

  if (!product) {
    return (
      <main className="shop-enquiry-page shop-not-found animate-fade-in">
        <div className="container">
          <h1 className="heading-1">Product Not Found</h1>
          <button className="btn-shop-secondary" onClick={() => navigate('/shop')}>
            Return to Shop
          </button>
        </div>
      </main>
    );
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate frontend validation & success state only. No backend submission.
    if (formData.name && formData.email) {
      setIsSubmitted(true);
    }
  };

  return (
    <main className="shop-enquiry-page animate-fade-in">
      <div className="container shop-enquiry-container">
        
        <button className="shop-back-btn" onClick={() => navigate(`/shop/${product.slug}`)}>
          <ArrowLeft size={20} /> Back to Product
        </button>

        <div className="shop-enquiry-header-block">
          <h1 className="shop-enquiry-heading">Product Enquiry</h1>
          <p className="shop-enquiry-subheading">
            Please fill out the form below to enquire about availability, shipping, or commissions.
          </p>
        </div>

        <div className="shop-enquiry-layout">
          
          {/* LEFT: Product Context */}
          <div className="shop-enquiry-context">

            <div className="shop-enquiry-product-card">
              <div className="enquiry-product-image-wrap">
                <img src={product.mainImage} alt={product.name} />
              </div>
              <div className="enquiry-product-details">
                <span className="enquiry-product-category">{product.category}</span>
                <h3 className="enquiry-product-name">{product.name}</h3>
                <p className="enquiry-product-desc">{product.shortDescription}</p>
              </div>
            </div>
          </div>

          {/* RIGHT: Form */}
          <div className="shop-enquiry-form-section">
            {isSubmitted ? (
              <div className="shop-enquiry-success animate-fade-in">
                <CheckCircle2 size={48} className="success-icon" />
                <h3>Enquiry Sent</h3>
                <p>
                  Thank you, {formData.name}. Your enquiry regarding <strong>{product.name}</strong> has been received locally. 
                  <br/><br/>
                  <em>(Note: This is a frontend demonstration. No email was actually sent to Ronika.)</em>
                </p>
                <button className="btn-shop-secondary mt-4" onClick={() => navigate('/shop')}>
                  Continue Browsing
                </button>
              </div>
            ) : (
              <form className="shop-enquiry-form" onSubmit={handleSubmit}>
                <div className="form-group">
                  <label htmlFor="productRef">Product Reference</label>
                  <input 
                    type="text" 
                    id="productRef"
                    value={product.name}
                    disabled
                    className="form-input disabled-input"
                  />
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="name">Full Name *</label>
                    <input 
                      type="text" 
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                      className="form-input"
                      placeholder="Jane Doe"
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="email">Email Address *</label>
                    <input 
                      type="email" 
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      className="form-input"
                      placeholder="jane@example.com"
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="phone">Phone / WhatsApp (Optional)</label>
                  <input 
                    type="tel" 
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="form-input"
                    placeholder="+1 234 567 8900"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="message">Message</label>
                  <textarea 
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    required
                    className="form-input form-textarea"
                    placeholder="I am interested in purchasing this piece..."
                    rows={5}
                  ></textarea>
                </div>

                <button type="submit" className="btn-shop-primary btn-submit-enquiry">
                  Send Enquiry
                </button>
              </form>
            )}
          </div>

        </div>
      </div>
    </main>
  );
}
