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
          <button
            type="button"
            className="btn-enquiry-continue"
            onClick={() => navigate('/shop')}
            style={{ marginTop: '1.5rem' }}
          >
            Return to Shop
          </button>
        </div>
      </main>
    );
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    let cleanValue = value;

    // Strict input filtering:
    // 1. Full Name: Reject all numbers as typed/pasted
    if (name === 'name') {
      cleanValue = value.replace(/[0-9]/g, '');
    }
    // 2. Phone / WhatsApp: Reject all alphabetical letters and words as typed/pasted
    else if (name === 'phone') {
      cleanValue = value.replace(/[^\d+\s\-()]/g, '');
    }

    setFormData(prev => ({ ...prev, [name]: cleanValue }));
    if (errorMessage) {
      setErrorMessage('');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (submitting) return;

    const trimmedName = formData.name.trim();
    const trimmedEmail = formData.email.trim();
    const trimmedPhone = formData.phone.trim();
    const trimmedMessage = formData.message.trim();

    // 1. Required fields check
    if (!trimmedName || !trimmedEmail || !trimmedMessage) {
      setErrorMessage('Please fill in your name, email, and message before sending.');
      return;
    }

    // 2. Name validation: strictly no numbers and minimum length
    if (/\d/.test(trimmedName)) {
      setErrorMessage('Full name cannot contain numbers. Please enter letters only.');
      return;
    }
    if (trimmedName.length < 2) {
      setErrorMessage('Full name must be at least 2 characters.');
      return;
    }

    // 3. Email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(trimmedEmail)) {
      setErrorMessage('Please provide a valid email address (e.g., name@example.com).');
      return;
    }

    // 4. Phone validation: strictly no words/letters, 7-15 digits if provided
    if (trimmedPhone) {
      if (/[a-zA-Z]/.test(trimmedPhone)) {
        setErrorMessage('Phone number cannot contain words or letters.');
        return;
      }
      const digitsOnly = trimmedPhone.replace(/\D/g, '');
      if (digitsOnly.length < 7 || digitsOnly.length > 15) {
        setErrorMessage('Please enter a valid phone number (7 to 15 digits).');
        return;
      }
    }

    // 5. Message validation
    if (trimmedMessage.length < 5) {
      setErrorMessage('Message must be at least 5 characters long.');
      return;
    }

    try {
      setSubmitting(true);
      setErrorMessage('');
      await submitShopEnquiry({
        name: trimmedName,
        email: trimmedEmail,
        phone: trimmedPhone,
        message: trimmedMessage,
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
                <button
                  type="button"
                  className="btn-enquiry-continue"
                  onClick={() => navigate('/shop')}
                >
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
                      autoComplete="name"
                      maxLength={80}
                      pattern="^[A-Za-z\s'\.\-]+$"
                      title="Full name cannot contain numbers. Only letters, spaces, hyphens, and apostrophes are allowed."
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
                      autoComplete="email"
                      maxLength={120}
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
                      inputMode="tel"
                      autoComplete="tel"
                      maxLength={25}
                      value={formData.phone}
                      onChange={handleInputChange}
                      pattern="^[\d\s+\-()]*$"
                      title="Phone number can only contain numbers and dialing symbols (+, -, space). No letters."
                      className="form-input"
                      placeholder="+1 234 567 8900"
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="message">Message *</label>
                  <textarea 
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    required
                    minLength={5}
                    maxLength={2000}
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
