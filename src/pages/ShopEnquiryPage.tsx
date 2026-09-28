import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getShopProductBySlug } from '../api/shopApi';
import { adaptApiShopProduct } from '../utils/shopAdapter';
import { submitShopEnquiry } from '../api/enquiryApi';
import type { ShopProduct } from '../types/shop';
import { ArrowLeft, CheckCircle2 } from 'lucide-react';
import './ShopEnquiryPage.css';

export default function ShopEnquiryPage() {
  const { productSlug } = useParams<{ productSlug: string }>();
  const navigate = useNavigate();
  
  const [product, setProduct] = useState<ShopProduct | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  });

  useEffect(() => {
    if (!productSlug) return;
    let isMounted = true;
    setLoading(true);

    getShopProductBySlug(productSlug)
      .then((apiProd) => {
        if (!isMounted) return;
        setProduct(adaptApiShopProduct(apiProd));
        setLoading(false);
      })
      .catch((err) => {
        console.warn('Failed to load product for enquiry:', err);
        if (isMounted) setLoading(false);
      });

    window.scrollTo(0, 0);
    return () => { isMounted = false; };
  }, [productSlug]);

  if (loading) {
    return (
      <main className="shop-enquiry-page shop-not-found animate-fade-in">
        <div className="container" style={{ padding: '6rem 0', textAlign: 'center', opacity: 0.6 }}>
          <p>Loading enquiry details...</p>
        </div>
      </main>
    );
  }

  if (!product) {
    return (
      <main className="shop-enquiry-page shop-not-found animate-fade-in">
        <div className="container" style={{ padding: '6rem 0', textAlign: 'center' }}>
          <h1 className="heading-1">Product Not Found</h1>
          <button className="btn-shop-secondary" onClick={() => navigate('/shop')} style={{ marginTop: '1.5rem' }}>
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (submitting) return;
    if (!formData.name.trim() || !formData.email.trim()) return;

    try {
      setSubmitting(true);
      setErrorMessage('');
      await submitShopEnquiry({
        name: formData.name.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim(),
        message: formData.message.trim(),
        productName: product.name,
        productSlug: product.slug,
        productId: product.id,
      });

      // Successful submission transitions to success confirmation
      setIsSubmitted(true);
    } catch (err: any) {
      setErrorMessage(err.message || 'Error submitting enquiry. Please check your connection.');
    } finally {
      setSubmitting(false);
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
                  Thank you, {formData.name}. Your enquiry regarding <strong>{product.name}</strong> has been received. 
                </p>
                <button className="btn-shop-secondary mt-4" onClick={() => navigate('/shop')}>
                  Continue Browsing
                </button>
              </div>
            ) : (
              <form className="shop-enquiry-form" onSubmit={handleSubmit}>
                {errorMessage && (
                  <div
                    style={{
                      padding: '0.75rem 1rem',
                      background: '#FFEBEE',
                      border: '1px solid #FFCDD2',
                      borderRadius: '6px',
                      color: '#C62828',
                      fontSize: '13px',
                      marginBottom: '1rem',
                    }}
                  >
                    {errorMessage}
                  </div>
                )}

                <div className="form-row">
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
                </div>

                <div className="form-row">
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
                    rows={3}
                  ></textarea>
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="btn-shop-primary btn-submit-enquiry"
                >
                  {submitting ? 'Sending Enquiry...' : 'Send Enquiry'}
                </button>
              </form>
            )}
          </div>

        </div>
      </div>
    </main>
  );
}
