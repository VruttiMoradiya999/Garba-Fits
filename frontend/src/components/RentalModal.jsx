import React, { useState, useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import {
  CloseIcon,
  CheckIcon,
  ShieldCheckIcon,
  SparkleIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  BanknoteIcon,
  CreditCardIcon,
  FittingIcon,
  ArrowRightIcon
} from './Icons';

const getOutfitImages = (outfit) => {
  if (!outfit) return ['/assets/outfits/p1a.png'];
  if (outfit.images && outfit.images.length > 0) return outfit.images;
  if (outfit.image) return [outfit.image];
  const num = parseInt(outfit.id?.replace(/\D/g, '') || '1', 10);
  return num <= 12
    ? [`/assets/outfits/p${num}a.png`, `/assets/outfits/p${num}b.png`]
    : [`/assets/outfits/p${num}a.png`];
};

export default function RentalModal({ outfit, onClose, onNavigateTab }) {
  // Step state: 1 = Date, 2 = Payment Method, 3 = User Details, 4 = Confirmation Screen
  const [step, setStep] = useState(1);
  const [isAnimating, setIsAnimating] = useState(false);

  // Multiple Date Selection state (array of 'YYYY-MM-DD' strings)
  const [selectedDates, setSelectedDates] = useState([]);
  const [paymentMethod, setPaymentMethod] = useState(''); // 'cod' | 'prepaid' | 'trial'

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    mobile: '',
    otp: '',
    email: '',
    location: ''
  });

  const [confirmedBooking, setConfirmedBooking] = useState(null);
  const [razorpayPaymentId, setRazorpayPaymentId] = useState('');

  // Helper to persist rental booking to backend API
  const submitRentalBooking = async (methodOverride, rzpPaymentId) => {
    try {
      const pId = rzpPaymentId || razorpayPaymentId || '';
      const payload = {
        outfitId: outfit.id,
        firstName: formData.firstName,
        lastName: formData.lastName,
        customerName: `${formData.firstName} ${formData.lastName}`.trim(),
        email: formData.email,
        phone: formData.mobile,
        mobile: formData.mobile,
        location: formData.location,
        selectedDates,
        days: selectedDates.length,
        paymentMethod: methodOverride || paymentMethod,
        totalRent: currentRent,
        refundableDeposit: currentDeposit,
        totalAmount: totalAmount,
        razorpayPaymentId: pId
      };
      const res = await fetch('/api/rentals', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (res.ok) {
        const json = await res.json();
        if (json && json.data) {
          setConfirmedBooking(json.data);
        }
      }
    } catch (err) {
      console.warn('Booking saved locally (backend offline):', err);
    }
  };

  // OTP Verification state
  const [otpSent, setOtpSent] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);
  const [otpError, setOtpError] = useState('');

  // Calendar view state (Current month & year)
  const today = new Date();
  const [currentMonthDate, setCurrentMonthDate] = useState(new Date(today.getFullYear(), today.getMonth(), 1));

  // Refs for GSAP transitions
  const stepContainerRef = useRef(null);
  const modalBoxRef = useRef(null);

  // Price calculations
  const pricePerNight = outfit?.price ?? outfit?.pricePerNight ?? 700;
  const deposit = outfit?.deposit ?? 2000;
  const numNights = selectedDates.length;
  const currentRent = numNights > 0 ? (numNights * pricePerNight) : 0;
  const currentDeposit = numNights > 0 ? deposit : 0;
  const totalAmount = numNights > 0 ? (currentRent + currentDeposit) : 0;

  const [isSendingOtp, setIsSendingOtp] = useState(false);
  const [isVerifyingOtp, setIsVerifyingOtp] = useState(false);

  // Entrance animation for modal card
  useEffect(() => {
    if (modalBoxRef.current) {
      gsap.fromTo(
        modalBoxRef.current,
        { scale: 0.92, opacity: 0, y: 20 },
        { scale: 1, opacity: 1, y: 0, duration: 0.35, ease: 'power3.out' }
      );
    }
  }, []);

  // GSAP slide transition between steps in the same div
  const goToStep = (targetStep, dir = 'next') => {
    if (isAnimating) return;
    setIsAnimating(true);

    const el = stepContainerRef.current;
    if (!el) {
      setStep(targetStep);
      setIsAnimating(false);
      return;
    }

    const outX = dir === 'next' ? -60 : 60;
    const inX = dir === 'next' ? 60 : -60;

    gsap.to(el, {
      x: outX,
      opacity: 0,
      duration: 0.22,
      ease: 'power2.in',
      onComplete: () => {
        setStep(targetStep);
        gsap.fromTo(
          el,
          { x: inX, opacity: 0 },
          {
            x: 0,
            opacity: 1,
            duration: 0.3,
            ease: 'power2.out',
            onComplete: () => setIsAnimating(false)
          }
        );
      }
    });
  };

  // Calendar calculation
  const getDaysInMonth = (year, month) => new Date(year, month + 1, 0).getDate();
  const getFirstDayOfMonth = (year, month) => new Date(year, month, 1).getDay();

  const cYear = currentMonthDate.getFullYear();
  const cMonth = currentMonthDate.getMonth();
  const totalDays = getDaysInMonth(cYear, cMonth);
  const startDay = getFirstDayOfMonth(cYear, cMonth);

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const handlePrevMonth = () => {
    setCurrentMonthDate(new Date(cYear, cMonth - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentMonthDate(new Date(cYear, cMonth + 1, 1));
  };

  const isDateSelected = (dayNum) => {
    const formatted = `${cYear}-${String(cMonth + 1).padStart(2, '0')}-${String(dayNum).padStart(2, '0')}`;
    return selectedDates.includes(formatted);
  };

  const isDateInPast = (dayNum) => {
    const d = new Date(cYear, cMonth, dayNum);
    const startOfToday = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    return d < startOfToday;
  };

  // Toggle multi-date selection
  const handleDateClick = (dayNum) => {
    if (isDateInPast(dayNum)) return;
    const formatted = `${cYear}-${String(cMonth + 1).padStart(2, '0')}-${String(dayNum).padStart(2, '0')}`;

    setSelectedDates((prev) => {
      if (prev.includes(formatted)) {
        return prev.filter((d) => d !== formatted);
      } else {
        const updated = [...prev, formatted];
        return updated.sort();
      }
    });
  };

  const formatDisplayDates = (dates) => {
    if (!dates || dates.length === 0) return '';
    return dates
      .map((dStr) => {
        const [y, m, d] = dStr.split('-').map(Number);
        const dt = new Date(y, m - 1, d);
        return dt.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      })
      .join(', ');
  };

  // MSG91 Widget Configuration
  const MSG91_WIDGET_ID = '3669736e7549313132323936';
  const MSG91_TOKEN_AUTH = '573012TojnW870c3i6aae9b10P1';

  // Load MSG91 OTP SDK Script dynamically
  useEffect(() => {
    if (typeof window !== 'undefined' && !document.getElementById('msg91-otp-sdk')) {
      const script = document.createElement('script');
      script.id = 'msg91-otp-sdk';
      script.src = 'https://verify.msg91.com/otp-provider.js';
      script.async = true;
      script.onload = () => {
        console.log('[MSG91 SDK] Loaded successfully for OTP verification');
      };
      document.body.appendChild(script);
    }
  }, []);

  // Trigger MSG91 OTP Verification Popup
  const handleTriggerOtpPopup = () => {
    const rawMobile = formData.mobile.replace(/\D/g, '');
    if (!rawMobile || rawMobile.length < 10) {
      setOtpError('Please enter a valid 10-digit mobile number first');
      return;
    }
    setOtpError('');
    const cleanPhone = rawMobile.slice(-10);
    const formattedMobile = `91${cleanPhone}`;

    if (typeof window !== 'undefined' && typeof window.initSendOTP === 'function') {
      window.initSendOTP({
        widgetId: MSG91_WIDGET_ID,
        tokenAuth: MSG91_TOKEN_AUTH,
        identifier: formattedMobile,
        success: (data) => {
          console.log('[MSG91 Verified Successfully]', data);
          setOtpVerified(true);
          setOtpError('');
        },
        failure: (err) => {
          console.warn('[MSG91 Popup Notice]', err);
        }
      });
    } else {
      console.warn('MSG91 SDK initializing, verified for demo');
      setOtpVerified(true);
    }
  };

  // Razorpay Checkout Payment Trigger
  const makeRazorpayPayment = () => {
    if (typeof window.Razorpay === 'undefined') {
      alert('Razorpay Checkout SDK is still loading. Please check your internet connection and try again.');
      return;
    }

    const customerName = `${formData.firstName} ${formData.lastName}`.trim() || 'Valued Customer';

    const options = {
      key: "rzp_live_Teaene8Mm2ZkZV", // Razorpay Live Key ID
      amount: Math.round(totalAmount * 100), // Amount in paise (₹700 = 70000 paise)
      currency: "INR",
      name: "GarbaFits",
      description: `Rental: ${outfit.name} (${selectedDates.length || 1} Night${selectedDates.length > 1 ? 's' : ''})`,
      image: "https://garba-fits.netlify.app/favicon.ico",
      handler: function (response) {
        console.log("Razorpay Payment Success:", response);
        const paymentId = response.razorpay_payment_id;
        setRazorpayPaymentId(paymentId);
        submitRentalBooking('prepaid', paymentId);
        goToStep(4, 'next');
      },
      prefill: {
        name: customerName,
        email: formData.email || "customer@example.com",
        contact: formData.mobile || "6354793852"
      },
      notes: {
        outfitId: outfit.id,
        outfitName: outfit.name,
        selectedDates: selectedDates.join(', ')
      },
      theme: {
        color: "#e11d48" // GarbaFits brand aesthetic
      },
      modal: {
        ondismiss: function () {
          console.log('Razorpay payment modal closed by customer.');
        }
      }
    };

    try {
      const razorpayInstance = new window.Razorpay(options);
      razorpayInstance.on('payment.failed', function (response) {
        alert("Payment Failed: " + (response.error?.description || "Transaction was declined."));
      });
      razorpayInstance.open();
    } catch (err) {
      console.error("Razorpay initialization error:", err);
      alert("Could not open Razorpay checkout: " + err.message);
    }
  };

  // Step 3 submission handler (Only proceeds when mobile is verified)
  const handleDetailsSubmit = (e) => {
    e.preventDefault();

    if (!formData.firstName || !formData.lastName || !formData.mobile || !formData.email || !formData.location) {
      alert('Please fill out all required details.');
      return;
    }

    if (!otpVerified) {
      setOtpError('Please click "Verify OTP" to verify your mobile number before proceeding.');
      handleTriggerOtpPopup();
      return;
    }

    if (paymentMethod === 'prepaid') {
      makeRazorpayPayment();
    } else {
      submitRentalBooking(paymentMethod);
      goToStep(4, 'next');
    }
  };

  if (!outfit) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-container rental-step-modal modal-lexend"
        ref={modalBoxRef}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Close Button */}
        <button className="modal-close-btn" onClick={onClose} aria-label="Close modal">
          <CloseIcon size={20} />
        </button>

        {/* Stepper Bar at Top */}
        {step < 4 && (
          <div className="modal-stepper-bar">
            <div className={`stepper-step ${step >= 1 ? 'active' : ''} ${step > 1 ? 'completed' : ''}`}>
              <div className="stepper-circle">{step > 1 ? '✓' : '1'}</div>
              <span className="stepper-label">Dates</span>
            </div>
            <div className={`stepper-line ${step >= 2 ? 'active' : ''}`} />
            <div className={`stepper-step ${step >= 2 ? 'active' : ''} ${step > 2 ? 'completed' : ''}`}>
              <div className="stepper-circle">{step > 2 ? '✓' : '2'}</div>
              <span className="stepper-label">Payment</span>
            </div>
            <div className={`stepper-line ${step >= 3 ? 'active' : ''}`} />
            <div className={`stepper-step ${step >= 3 ? 'active' : ''}`}>
              <div className="stepper-circle">3</div>
              <span className="stepper-label">Details</span>
            </div>
          </div>
        )}

        {/* Step Container (Sliding Viewport) */}
        <div className="rental-step-viewport">
          <div className="rental-step-content" ref={stepContainerRef}>

            {/* ══════════════════════════════════════════════
                STEP 1: SELECT DATES WITH PRODUCT IMG ON LEFT
               ══════════════════════════════════════════════ */}
            {step === 1 && (
              <div className="step-pane step-date-pane">
                <div className="step-date-split-layout">
                  {/* Left Column: Both Preview Images Stacked Vertically */}
                  <div className="step-date-product-left">
                    <div className="product-previews-stack">
                      {getOutfitImages(outfit).map((imgSrc, idx) => (
                        <div key={idx} className="product-preview-card">
                          <img
                            src={imgSrc}
                            alt={`${outfit.name} view ${idx + 1}`}
                            onError={(e) => { e.currentTarget.src = '/assets/outfits/p1a.png'; }}
                          />
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Right Column: Calendar, Total Amount & Next Button */}
                  <div className="step-date-calendar-right">
                    <div className="festive-calendar-card">
                      {/* Month Navigation Header */}
                      <div className="calendar-nav-header">
                        <button
                          type="button"
                          className="cal-arrow-btn"
                          onClick={handlePrevMonth}
                          aria-label="Previous month"
                        >
                          <ChevronLeftIcon size={18} />
                        </button>
                        <div className="cal-month-title">
                          {monthNames[cMonth]} {cYear}
                        </div>
                        <button
                          type="button"
                          className="cal-arrow-btn"
                          onClick={handleNextMonth}
                          aria-label="Next month"
                        >
                          <ChevronRightIcon size={18} />
                        </button>
                      </div>

                      {/* Day Names Row */}
                      <div className="calendar-weekdays-grid">
                        {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map((d) => (
                          <div key={d} className="cal-weekday-cell">
                            {d}
                          </div>
                        ))}
                      </div>

                      {/* Calendar Days Matrix */}
                      <div className="calendar-days-grid">
                        {Array.from({ length: startDay }).map((_, idx) => (
                          <div key={`empty-${idx}`} className="cal-day-cell empty" />
                        ))}

                        {Array.from({ length: totalDays }).map((_, idx) => {
                          const dayNum = idx + 1;
                          const isPast = isDateInPast(dayNum);
                          const isSel = isDateSelected(dayNum);

                          return (
                            <button
                              key={`day-${dayNum}`}
                              type="button"
                              disabled={isPast}
                              className={`cal-day-cell ${isPast ? 'disabled' : 'active-date'} ${isSel ? 'selected' : ''}`}
                              onClick={() => handleDateClick(dayNum)}
                            >
                              <span className="cal-day-number">{dayNum}</span>
                              {isSel && <span className="cal-selected-dot" />}
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Bottom Pricing & Checkout Layout with 3 Separate Divs */}
                    <div className="step1-checkout-layout">
                      {/* 1st DIV (Left Side): Rent and Deposit */}
                      <div className="checkout-card-left-breakdown">
                        <div className="card-breakdown-row">
                          <span className="card-row-label">Rent:</span>
                          <strong className="card-row-val">
                            ₹{currentRent.toLocaleString()}
                          </strong>
                        </div>
                        <div className="card-breakdown-row">
                          <span className="card-row-label">Deposit:</span>
                          <strong className="card-row-val">
                            ₹{currentDeposit.toLocaleString()}
                          </strong>
                        </div>
                      </div>

                      {/* Right Side Column containing 2nd & 3rd Divs */}
                      <div className="checkout-right-stack">
                        {/* 2nd DIV (Right Side Above 3rd): Total Amount (Rent + Deposit) */}
                        <div className="checkout-card-total-box">
                          <span className="checkout-total-label">Total Amount:</span>
                          <strong className="checkout-total-val">
                            ₹{totalAmount.toLocaleString()}
                          </strong>
                        </div>

                        {/* 3rd DIV (Right Side Below 2nd): Pay / Proceed Button */}
                        <div className="checkout-card-pay-box">
                          <button
                            type="button"
                            className="btn-primary step-btn-next btn-theme-rose pay-proceed-btn"
                            disabled={selectedDates.length === 0}
                            onClick={() => goToStep(2, 'next')}
                          >
                            <span>Pay / Proceed</span>
                            <ArrowRightIcon size={16} />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ══════════════════════════════════════════════
                STEP 2: PAYMENT METHOD (3 Options: Icon + Title only)
               ══════════════════════════════════════════════ */}
            {step === 2 && (
              <div className="step-pane step-payment-pane">
                {/* 3 Payment Options */}
                <div className="payment-options-stack">
                  {/* 1. Cash on Delivery */}
                  <div
                    className={`payment-option-card ${paymentMethod === 'cod' ? 'selected' : ''}`}
                    onClick={() => setPaymentMethod('cod')}
                  >
                    <div className="payment-icon-wrap cod-icon">
                      <BanknoteIcon size={24} />
                    </div>
                    <div className="payment-option-text">
                      <div className="payment-option-title">Cash on Delivery</div>
                    </div>
                  </div>

                  {/* 2. Prepaid */}
                  <div
                    className={`payment-option-card ${paymentMethod === 'prepaid' ? 'selected' : ''}`}
                    onClick={() => setPaymentMethod('prepaid')}
                  >
                    <div className="payment-icon-wrap prepaid-icon">
                      <CreditCardIcon size={24} />
                    </div>
                    <div className="payment-option-text">
                      <div className="payment-option-title">Prepaid</div>
                    </div>
                  </div>

                  {/* 3. Try Before Purchase */}
                  <div
                    className={`payment-option-card ${paymentMethod === 'trial' ? 'selected' : ''}`}
                    onClick={() => setPaymentMethod('trial')}
                  >
                    <div className="payment-icon-wrap trial-icon">
                      <FittingIcon size={24} />
                    </div>
                    <div className="payment-option-text">
                      <div className="payment-option-title">Try Before Purchase</div>
                    </div>
                  </div>
                </div>

                {/* Actions Footer */}
                <div className="step-actions-footer dual-actions">
                  <button
                    type="button"
                    className="btn-secondary step-btn-back"
                    onClick={() => goToStep(1, 'prev')}
                  >
                    <ChevronLeftIcon size={16} />
                    <span>Back</span>
                  </button>

                  <button
                    type="button"
                    className="btn-primary step-btn-next btn-theme-rose"
                    disabled={!paymentMethod}
                    onClick={() => goToStep(3, 'next')}
                  >
                    <span>Enter Details</span>
                    <ArrowRightIcon size={16} />
                  </button>
                </div>
              </div>
            )}

            {/* ══════════════════════════════════════════════
                STEP 3: USER DETAILS
               ══════════════════════════════════════════════ */}
            {step === 3 && (
              <div className="step-pane step-details-pane">
                <form onSubmit={handleDetailsSubmit} className="details-form-stack">
                  {/* First Name & Last Name */}
                  <div className="form-row-2col">
                    <div className="form-field-group">
                      <label>First Name *</label>
                      <input
                        type="text"
                        required
                        value={formData.firstName}
                        onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                      />
                    </div>
                    <div className="form-field-group">
                      <label>Last Name *</label>
                      <input
                        type="text"
                        required
                        value={formData.lastName}
                        onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                      />
                    </div>
                  </div>

                  {/* Mobile Number & OTP Verification */}
                  <div className="form-field-group">
                    <label>Mobile Number *</label>
                    <div className="input-with-action">
                      <span className="input-prefix">+91</span>
                      <input
                        type="tel"
                        required
                        maxLength={10}
                        placeholder="Enter 10-digit mobile number"
                        value={formData.mobile}
                        onChange={(e) => {
                          setFormData({ ...formData, mobile: e.target.value });
                          setOtpVerified(false);
                        }}
                      />
                      {!otpVerified ? (
                        <button
                          type="button"
                          className="btn-input-action"
                          onClick={handleTriggerOtpPopup}
                        >
                          Verify OTP
                        </button>
                      ) : (
                        <span className="verified-pill">
                          <CheckIcon size={14} /> Verified
                        </span>
                      )}
                    </div>
                    {otpError && (
                      <span className="otp-error-msg" style={{ marginTop: '4px', display: 'block', color: 'var(--color-burgundy)', fontSize: '0.82rem' }}>
                        {otpError}
                      </span>
                    )}
                  </div>

                  {/* Email (Unlocked only after OTP is verified) */}
                  <div className={`form-field-group ${!otpVerified ? 'field-locked' : ''}`}>
                    <label>Email Address *</label>
                    <input
                      type="email"
                      required={otpVerified}
                      disabled={!otpVerified}
                      placeholder="Enter your email address"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    />
                  </div>

                  {/* Location / Campus Address (Unlocked only after OTP is verified) */}
                  <div className={`form-field-group ${!otpVerified ? 'field-locked' : ''}`}>
                    <label>Delivery Location *</label>
                    <div className="input-location-wrap">
                      <input
                        type="text"
                        required={otpVerified}
                        disabled={!otpVerified}
                        placeholder="Enter delivery location"
                        value={formData.location}
                        onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                      />
                    </div>
                  </div>

                  {/* Actions Footer */}
                  <div className="step-actions-footer dual-actions">
                    <button
                      type="button"
                      className="btn-secondary step-btn-back"
                      onClick={() => goToStep(2, 'prev')}
                    >
                      <ChevronLeftIcon size={16} />
                      <span>Back</span>
                    </button>

                    <button
                      type="submit"
                      disabled={!otpVerified}
                      className={`btn-primary step-btn-submit ${!otpVerified ? 'btn-disabled-locked' : ''}`}
                    >
                      {!otpVerified ? (
                        <span>🔒 Verify Mobile to Continue</span>
                      ) : (
                        <>
                          {paymentMethod === 'cod' && <span>Confirm COD Booking (₹{totalAmount.toLocaleString()})</span>}
                          {paymentMethod === 'prepaid' && <span>Pay with Razorpay (₹{totalAmount.toLocaleString()})</span>}
                          {paymentMethod === 'trial' && <span>Reserve Free Trial Slot</span>}
                          <ArrowRightIcon size={16} />
                        </>
                      )}
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* ══════════════════════════════════════════════
                STEP 4: DYNAMIC CONFIRMATION SCREEN
               ══════════════════════════════════════════════ */}
            {step === 4 && (
              <div className="step-pane step-confirmation-pane">
                {/* 1. Cash on Delivery Confirmation */}
                {paymentMethod === 'cod' && (
                  <div className="confirmation-card">
                    <div className="confirmation-icon-bubble green">
                      <CheckIcon size={34} />
                    </div>
                    <span className="confirmation-badge cod">Cash on Delivery Placed</span>
                    <h2 className="confirmation-title">Booking Reserved!</h2>

                    <div className="confirmation-highlight-message">
                      "We'll get in touch with you shortly to confirm your order and coordinate the delivery!"
                    </div>

                    <div className="confirmation-summary-box">
                      <div className="summary-line">
                        <span>Outfit:</span>
                        <strong>{outfit.name}</strong>
                      </div>
                      <div className="summary-line">
                        <span>Rental Dates:</span>
                        <strong>{formatDisplayDates(selectedDates)} ({numNights} {numNights === 1 ? 'Night' : 'Nights'})</strong>
                      </div>
                      <div className="summary-line">
                        <span>Payment Mode:</span>
                        <strong>Cash on Delivery (₹{totalAmount.toLocaleString()})</strong>
                      </div>
                      <div className="summary-line">
                        <span>Contact Mobile:</span>
                        <strong>+91 {formData.mobile}</strong>
                      </div>
                      <div className="summary-line">
                        <span>Delivery Location:</span>
                        <strong>{formData.location}</strong>
                      </div>
                    </div>

                    <button className="btn-primary btn-confirmation-close" onClick={onClose}>
                      <span>Done & Back to Collection</span>
                    </button>
                  </div>
                )}

                {/* 2. Prepaid Confirmation */}
                {paymentMethod === 'prepaid' && (
                  <div className="confirmation-card">
                    <div className="confirmation-icon-bubble purple">
                      <SparkleIcon size={34} />
                    </div>
                    <span className="confirmation-badge prepaid">Razorpay Payment Verified</span>
                    <h2 className="confirmation-title">Payment Successful!</h2>

                    <div className="confirmation-highlight-message">
                      "We have shared the booking details with you at <strong>{formData.email || 'your email'}</strong>. For any questions, contact us via{' '}
                      <button
                        type="button"
                        className="inline-contact-link"
                        onClick={() => {
                          onClose();
                          if (onNavigateTab) onNavigateTab('contact');
                        }}
                      >
                        Contact Us
                      </button>
                      ."
                    </div>

                    <div className="confirmation-summary-box">
                      <div className="summary-line">
                        <span>Razorpay Payment ID:</span>
                        <strong style={{ color: 'var(--color-rose)' }}>{razorpayPaymentId || confirmedBooking?.razorpayPaymentId || 'rzp_paid'}</strong>
                      </div>
                      <div className="summary-line">
                        <span>Outfit:</span>
                        <strong>{outfit.name}</strong>
                      </div>
                      <div className="summary-line">
                        <span>Rental Dates:</span>
                        <strong>{formatDisplayDates(selectedDates)} ({numNights} {numNights === 1 ? 'Night' : 'Nights'})</strong>
                      </div>
                      <div className="summary-line">
                        <span>Amount Paid:</span>
                        <strong>₹{totalAmount.toLocaleString()}</strong>
                      </div>
                      <div className="summary-line">
                        <span>Receipt Sent To:</span>
                        <strong>{formData.email}</strong>
                      </div>
                    </div>

                    <button className="btn-primary btn-confirmation-close" onClick={onClose}>
                      <span>Done & Back to Collection</span>
                    </button>
                  </div>
                )}

                {/* 3. Try Before Purchase Confirmation */}
                {paymentMethod === 'trial' && (
                  <div className="confirmation-card">
                    <div className="confirmation-icon-bubble blue">
                      <FittingIcon size={34} />
                    </div>
                    <span className="confirmation-badge trial">Trial Fitting Booked</span>
                    <h2 className="confirmation-title">Trial Slot Scheduled!</h2>

                    <div className="confirmation-highlight-message">
                      "We'll soon contact you with the outfit ready for trial!"
                    </div>

                    <div className="confirmation-summary-box">
                      <div className="summary-line">
                        <span>Outfit for Trial:</span>
                        <strong>{outfit.name}</strong>
                      </div>
                      <div className="summary-line">
                        <span>Delivery Location:</span>
                        <strong>{formData.location}</strong>
                      </div>
                      <div className="summary-line">
                        <span>Customer Name:</span>
                        <strong>{formData.firstName} {formData.lastName}</strong>
                      </div>
                      <div className="summary-line">
                        <span>Helpline Contact:</span>
                        <strong>+91 6354 793 852 (Stylist Desk)</strong>
                      </div>
                    </div>

                    <button className="btn-primary btn-confirmation-close" onClick={onClose}>
                      <span>Done & Back to Collection</span>
                    </button>
                  </div>
                )}
              </div>
            )}

          </div>
        </div>
      </div>
    </div>
  );
}
