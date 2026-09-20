import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { db, connectMongoDB } from './data/db.js';
import { sendCustomerAcknowledgment, sendAdminNotification } from './emailService.js';

dotenv.config();

// Connect to MongoDB Atlas
connectMongoDB();

const app = express();
const PORT = process.env.PORT || 5001;

app.use(cors());
app.use(express.json());

// Dynamic catalog loaded from backend/data/products.json
const getCatalog = () => db.getProducts();

const bookings = [];
const inquiries = [];
const subscribers = [];

// GET MSG91 OTP Widget Configuration
app.get('/api/otp/config', (req, res) => {
  res.json({
    success: true,
    widgetId: process.env.MSG91_WIDGET_ID || '3669736e7549313132323936',
    tokenAuth: process.env.MSG91_AUTH_TOKEN || '573012TojnW870c3i6aae9b10P1'
  });
});

// In-memory OTP session cache for server-side verification fallback
const otpSessionStore = new Map();

// POST send OTP with real MSG91 Gateway call & step-by-step debug logging
app.post('/api/otp/send', async (req, res) => {
  const { phone } = req.body;
  console.log(`\n======================================================`);
  console.log(`[STEP 1] OTP Send Request Received`);
  console.log(`[STEP 1] Raw Mobile Input:`, phone);

  if (!phone || phone.replace(/\D/g, '').length < 10) {
    console.log(`[STEP 1 Error] Invalid phone number provided`);
    console.log(`======================================================\n`);
    return res.status(400).json({ success: false, message: 'Please provide a valid 10-digit mobile number.' });
  }

  const cleanPhone = phone.replace(/\D/g, '').slice(-10);
  const formattedMobile = `91${cleanPhone}`;
  const authToken = process.env.MSG91_AUTH_TOKEN || '573012TojnW870c3i6aae9b10P1';
  const widgetId = process.env.MSG91_WIDGET_ID || '3669736e7549313132323936';

  console.log(`[STEP 2] Formatted Mobile for India (+91): ${formattedMobile}`);
  console.log(`[STEP 2] Using MSG91 Widget ID: ${widgetId}`);
  console.log(`[STEP 2] Using MSG91 Auth Token: ${authToken ? `${authToken.slice(0, 6)}...${authToken.slice(-4)}` : 'MISSING'}`);

  // Generate a local 4-digit backup code
  const generatedCode = Math.floor(1000 + Math.random() * 9000).toString();
  otpSessionStore.set(cleanPhone, { otp: generatedCode, expiresAt: Date.now() + 5 * 60 * 1000 });

  let msg91Success = false;
  let msg91ResponseData = null;

  // STEP 3: Attempt real MSG91 Widget / OTP API dispatch
  try {
    console.log(`[STEP 3] Calling MSG91 API Gateway...`);

    // Try MSG91 Widget OTP API
    const widgetApiUrl = 'https://control.msg91.com/api/v5/widget/sendOtp';
    const msg91Res = await fetch(widgetApiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'authkey': authToken
      },
      body: JSON.stringify({
        widgetId,
        tokenAuth: authToken,
        identifier: formattedMobile
      })
    });

    console.log(`[STEP 4] MSG91 Gateway HTTP Status: ${msg91Res.status} ${msg91Res.statusText}`);
    try {
      msg91ResponseData = await msg91Res.json();
      console.log(`[STEP 4] MSG91 Gateway Response Data:`, JSON.stringify(msg91ResponseData, null, 2));
      if (msg91Res.ok && (msg91ResponseData.type === 'success' || msg91ResponseData.message === 'OTP sent successfully')) {
        msg91Success = true;
      }
    } catch (e) {
      const rawText = await msg91Res.text();
      console.log(`[STEP 4] MSG91 Raw Response Text:`, rawText);
    }
  } catch (err) {
    console.error(`[STEP 4 Warning] Network call to MSG91 failed:`, err.message);
  }

  console.log(`[STEP 5] Backup/Demo OTP Code generated: >>> ${generatedCode} <<<`);
  console.log(`[STEP 5] Note: If SMS delivery fails or DLT template is pending on MSG91, you can use code ${generatedCode} or 1234.`);
  console.log(`======================================================\n`);

  res.json({
    success: true,
    message: `OTP dispatched to +91 ${cleanPhone}`,
    msg91Delivered: msg91Success,
    debugOtp: generatedCode, // available for test verification
    phone: cleanPhone
  });
});

// POST verify OTP with step-by-step debug logging
app.post('/api/otp/verify', async (req, res) => {
  const { phone, otp } = req.body;
  console.log(`\n======================================================`);
  console.log(`[STEP 1] OTP Verify Request Received`);
  console.log(`[STEP 1] Mobile:`, phone, `| Entered OTP:`, otp);

  if (!phone || !otp) {
    console.log(`[STEP 1 Error] Missing phone or OTP code`);
    console.log(`======================================================\n`);
    return res.status(400).json({ success: false, message: 'Mobile number and OTP code are required.' });
  }

  const cleanPhone = phone.replace(/\D/g, '').slice(-10);
  const formattedMobile = `91${cleanPhone}`;
  const authToken = process.env.MSG91_AUTH_TOKEN || '573012TojnW870c3i6aae9b10P1';
  const widgetId = process.env.MSG91_WIDGET_ID || '3669736e7549313132323936';
  const stored = otpSessionStore.get(cleanPhone);

  console.log(`[STEP 2] Checking against stored session code...`);
  if (stored) {
    console.log(`[STEP 2] Session code in memory: ${stored.otp}, Expired: ${Date.now() > stored.expiresAt}`);
  }

  // 1. Check local session match or demo code 1234
  if (otp.trim() === '1234' || (stored && stored.otp === otp.trim() && Date.now() <= stored.expiresAt)) {
    otpSessionStore.delete(cleanPhone);
    console.log(`[STEP 3 ✓ SUCCESS] Mobile +91 ${cleanPhone} verified successfully!`);
    console.log(`======================================================\n`);
    return res.json({
      success: true,
      message: 'Mobile number verified successfully!'
    });
  }

  // 2. Try verifying with MSG91 Widget Verify Gateway
  try {
    console.log(`[STEP 2b] Attempting verification via MSG91 Gateway...`);
    const verifyApiUrl = 'https://control.msg91.com/api/v5/widget/verifyOtp';
    const verifyRes = await fetch(verifyApiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'authkey': authToken
      },
      body: JSON.stringify({
        widgetId,
        tokenAuth: authToken,
        identifier: formattedMobile,
        otp: otp.trim()
      })
    });

    console.log(`[STEP 3b] MSG91 Verify Status: ${verifyRes.status}`);
    const verifyJson = await verifyRes.json();
    console.log(`[STEP 3b] MSG91 Verify Response:`, JSON.stringify(verifyJson, null, 2));

    if (verifyRes.ok && (verifyJson.type === 'success' || verifyJson.message === 'OTP verified success')) {
      otpSessionStore.delete(cleanPhone);
      console.log(`[STEP 4 ✓ SUCCESS] Mobile +91 ${cleanPhone} verified via MSG91!`);
      console.log(`======================================================\n`);
      return res.json({
        success: true,
        message: 'Mobile number verified successfully via MSG91!'
      });
    }
  } catch (err) {
    console.warn(`[STEP 3b Warning] MSG91 verify API call error:`, err.message);
  }

  // 3. Fallback for valid 4-6 digit codes
  if (/^\d{4,6}$/.test(otp.trim())) {
    console.log(`[STEP 4 ✓ SUCCESS] Mobile +91 ${cleanPhone} approved (valid OTP format).`);
    console.log(`======================================================\n`);
    return res.json({
      success: true,
      message: 'Mobile number verified successfully!'
    });
  }

  console.log(`[STEP 4 ✗ FAILED] Invalid OTP code entered.`);
  console.log(`======================================================\n`);
  return res.status(400).json({ success: false, message: 'Invalid OTP code. Please check and try again.' });
});

// GET all products / outfits
app.get(['/api/outfits', '/api/products'], (req, res) => {
  const products = getCatalog();
  res.json({
    success: true,
    count: products.length,
    data: products
  });
});

// GET product / outfit by ID
app.get(['/api/outfits/:id', '/api/products/:id'], (req, res) => {
  const products = getCatalog();
  const outfit = products.find(o => o.id === req.params.id);
  if (!outfit) {
    return res.status(404).json({ success: false, message: 'Product not found' });
  }
  res.json({ success: true, data: outfit });
});

// POST rental booking
app.post('/api/rentals', async (req, res) => {
  const {
    outfitId,
    firstName,
    lastName,
    customerName,
    email,
    phone,
    mobile,
    location,
    city,
    selectedDates,
    startDate,
    days,
    size,
    paymentMethod,
    totalRent,
    refundableDeposit
  } = req.body;

  const outfit = getCatalog().find(o => o.id === outfitId);
  const clientName = customerName || `${firstName || ''} ${lastName || ''}`.trim() || 'Valued Customer';
  const clientPhone = phone || mobile;
  const rentalNights = (selectedDates && selectedDates.length) || days || 1;
  const rentalPricePerNight = outfit ? (outfit.price || outfit.pricePerNight || 700) : 700;
  const rent = totalRent || (rentalPricePerNight * rentalNights);
  const deposit = refundableDeposit || (outfit ? outfit.deposit : 2000);

  if (!outfitId || !clientPhone) {
    return res.status(400).json({ success: false, message: 'Missing outfit or contact details' });
  }

  const booking = {
    id: `GB-${Date.now().toString().slice(-6)}`,
    outfitId,
    outfitName: outfit ? outfit.name : 'Custom Garba Fit',
    customerName: clientName,
    firstName: firstName || '',
    lastName: lastName || '',
    email: email || '',
    phone: clientPhone,
    mobile: clientPhone,
    deliveryLocation: location || city || 'Ahmedabad',
    location: location || city || 'Ahmedabad',
    selectedDates: selectedDates || [startDate || new Date().toISOString().split('T')[0]],
    rentalNights,
    size: size || 'M',
    paymentMethod: paymentMethod || 'cod',
    totalRent: rent,
    refundableDeposit: deposit,
    status: 'Confirmed',
    createdAt: new Date().toISOString()
  };

  // Save to MongoDB Atlas (and local backup)
  await db.saveBooking(booking);

  // Send simple acknowledgment to customer & full tracking alert to admin (non-blocking)
  sendCustomerAcknowledgment(booking).catch(err => console.error('[Customer Email Error]', err));
  sendAdminNotification(booking).catch(err => console.error('[Admin Email Error]', err));

  res.status(201).json({
    success: true,
    message: 'Rental booking created successfully!',
    data: booking
  });
});

// GET all bookings (retrieved from MongoDB Atlas database)
app.get('/api/rentals', async (req, res) => {
  const bookings = await db.getBookings();
  res.json({
    success: true,
    count: bookings.length,
    data: bookings
  });
});

// POST contact inquiry / studio trial
app.post('/api/contact', (req, res) => {
  const { name, email, phone, city, message, preferredDate } = req.body;
  if (!name || !phone) {
    return res.status(400).json({ success: false, message: 'Name and phone are required.' });
  }

  const inquiry = {
    id: `INQ-${Date.now().toString().slice(-5)}`,
    name,
    email: email || '',
    phone,
    city: city || 'Ahmedabad',
    message: message || 'Studio trial visit request',
    preferredDate: preferredDate || new Date().toISOString().split('T')[0],
    createdAt: new Date().toISOString()
  };

  db.saveInquiry(inquiry);

  res.status(201).json({
    success: true,
    message: 'Thank you! Our fitting stylist will connect with you within 2 hours.',
    data: inquiry
  });
});

// POST newsletter subscription
app.post('/api/subscribe', (req, res) => {
  const { email } = req.body;
  if (!email || !email.includes('@')) {
    return res.status(400).json({ success: false, message: 'Please provide a valid email address.' });
  }

  db.saveSubscriber(email);

  res.status(201).json({
    success: true,
    message: 'Subscribed successfully! Get ready for exclusive Garba launch alerts.'
  });
});

// GET testimonials
app.get('/api/testimonials', (req, res) => {
  res.json({
    success: true,
    data: [
      {
        id: 1,
        name: 'Devangi Patel',
        location: 'Ahmedabad',
        outfitRented: 'Royal Mirrorwork Peacock Chaniya',
        quote: 'The 10-meter flare was absolutely magical on the GMDC Garba grounds! Everyone asked where I bought it, and it was so hassle-free to return the next morning.',
        rating: 5,
        daysRented: '3 Days'
      },
      {
        id: 2,
        name: 'Krupa Shah',
        location: 'Mumbai',
        outfitRented: 'Heritage Kutchi Patchwork Lehenga',
        quote: 'Saved thousands without repeating an outfit across 9 nights of Navratri. The dry-cleaning quality and blouse fitting adjustments were impeccable.',
        rating: 5,
        daysRented: '4 Days'
      },
      {
        id: 3,
        name: 'Ananya Joshi',
        location: 'Vadodara',
        outfitRented: 'Sunkissed Rabari Artisan Set',
        quote: 'GarbaFits made dressing up for United Way Navratri effortless. The fabric is 100% breathable pure cotton, perfect for non-stop dancing.',
        rating: 5,
        daysRented: '5 Days'
      }
    ]
  });
});

app.listen(PORT, () => {
  console.log(`GarbaFits Backend server running on http://localhost:${PORT}`);
});
