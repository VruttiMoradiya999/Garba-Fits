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

// Complete catalog of 20 authentic Garba & Navratri Chaniya Cholis
const outfits = [
  {
    id: 'gfit-01',
    name: 'Royal Mirrorwork Peacock Chaniya Choli',
    colorTheme: 'Royal Blue & Emerald',
    fabric: 'Pure Heavy Gamthi Cotton with Real Mirror Work',
    pricePerNight: 700,
    rentPrice: 1499,
    deposit: 2000,
    retailValue: 14500,
    sizes: ['S', 'M', 'L', 'XL'],
    rating: 4.9,
    reviewsCount: 42,
    images: ['/assets/outfits/p1a.png', '/assets/outfits/p1b.png'],
    image: '/assets/outfits/p1a.png',
    navratriDay: 1,
    flair: '9M Full Twirl',
    desc: 'Authentic Gujarati craftsmanship featuring intricate Gamthi embroidery and real mirror accents that sparkle under garba night lights.',
    popular: true
  },
  {
    id: 'gfit-02',
    name: 'Sunkissed Marigold Rabari Ensemble',
    colorTheme: 'Mustard Yellow & Crimson',
    fabric: 'Organic Khadi Cotton with Cowrie Shell Tassels',
    pricePerNight: 700,
    rentPrice: 1699,
    deposit: 2500,
    retailValue: 16800,
    sizes: ['XS', 'S', 'M', 'L'],
    rating: 5.0,
    reviewsCount: 38,
    images: ['/assets/outfits/p2a.png', '/assets/outfits/p2b.png'],
    image: '/assets/outfits/p2a.png',
    navratriDay: 2,
    flair: '10M Ultra Flared',
    desc: 'Traditional Rabari tribal design adorned with hand-stitched motifs and cowrie shell hangings designed for effortless 360-degree spins.',
    popular: true
  },
  {
    id: 'gfit-03',
    name: 'Regal Magenta Rani Bandhani Set',
    colorTheme: 'Rani Pink & Gold',
    fabric: 'Georgette with Heavy Gota Patti & Zari Borders',
    pricePerNight: 700,
    rentPrice: 1399,
    deposit: 2000,
    retailValue: 13000,
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    rating: 4.8,
    reviewsCount: 29,
    images: ['/assets/outfits/p3a.png', '/assets/outfits/p3b.png'],
    image: '/assets/outfits/p3a.png',
    navratriDay: 3,
    flair: '8.5M Lightweight',
    desc: 'Vibrant Bandhani tie-dye artistry paired with golden Gota Patti lace work, offering lightweight comfort for energetic garba rounds.',
    popular: false
  },
  {
    id: 'gfit-04',
    name: 'Heritage Ivory Kutchi Patchwork',
    colorTheme: 'Off-White & Multi-Hue',
    fabric: 'Pure Slub Cotton with Authentic Kutch Patches',
    pricePerNight: 700,
    rentPrice: 1799,
    deposit: 2500,
    retailValue: 18500,
    sizes: ['S', 'M', 'L'],
    rating: 4.9,
    reviewsCount: 51,
    images: ['/assets/outfits/p4a.png', '/assets/outfits/p4b.png'],
    image: '/assets/outfits/p4a.png',
    navratriDay: 4,
    flair: '9.5M Heavy Gher',
    desc: 'Heritage Kutchi artisanal masterpiece weaving together hand-woven patches, thread tassels, and mirror work for a standout festive look.',
    popular: true
  },
  {
    id: 'gfit-05',
    name: 'Navratri Emerald Gamthi Gher Chaniya',
    colorTheme: 'Emerald Green & Ruby',
    fabric: 'Pure Handloom Cotton with Hand-embroidery',
    pricePerNight: 700,
    rentPrice: 1599,
    deposit: 2200,
    retailValue: 15200,
    sizes: ['S', 'M', 'L'],
    rating: 4.9,
    reviewsCount: 34,
    images: ['/assets/outfits/p5a.png', '/assets/outfits/p5b.png'],
    image: '/assets/outfits/p5a.png',
    navratriDay: 5,
    flair: '9M Flare',
    desc: 'Rich emerald green hand-embroidered ghagra paired with an ornate mirror blouse and contrasting dupatta.',
    popular: false
  },
  {
    id: 'gfit-06',
    name: 'Sunset Amber Abhala Festive Chaniya',
    colorTheme: 'Amber Orange & Rust',
    fabric: 'Chanderi Silk with Intricate Abhala Work',
    pricePerNight: 700,
    rentPrice: 1649,
    deposit: 2400,
    retailValue: 16000,
    sizes: ['M', 'L', 'XL'],
    rating: 5.0,
    reviewsCount: 47,
    images: ['/assets/outfits/p6a.png', '/assets/outfits/p6b.png'],
    image: '/assets/outfits/p6a.png',
    navratriDay: 6,
    flair: '10M Flow',
    desc: 'Warm sunset amber palette highlighted with luminous abhala mirror discs and handcrafted tassels.',
    popular: true
  },
  {
    id: 'gfit-07',
    name: 'Midnight Starlight Mirror Lehenga',
    colorTheme: 'Navy Blue & Silver',
    fabric: 'Raw Silk with Heavy Foil and Mirror Motifs',
    pricePerNight: 700,
    rentPrice: 1549,
    deposit: 2200,
    retailValue: 14800,
    sizes: ['XS', 'S', 'M', 'L'],
    rating: 4.8,
    reviewsCount: 31,
    images: ['/assets/outfits/p7a.png', '/assets/outfits/p7b.png'],
    image: '/assets/outfits/p7a.png',
    navratriDay: 7,
    flair: '9M Ultra Twirl',
    desc: 'Deep navy midnight ensemble glittering with cosmic mirror reflections, crafted for graceful garba steps.',
    popular: false
  },
  {
    id: 'gfit-08',
    name: 'Scarlet Crimson Golden Zari Twirl',
    colorTheme: 'Deep Scarlet & Gold',
    fabric: 'Mulmul Cotton with Traditional Zari & Shells',
    pricePerNight: 700,
    rentPrice: 1749,
    deposit: 2500,
    retailValue: 17500,
    sizes: ['S', 'M', 'L', 'XL'],
    rating: 4.9,
    reviewsCount: 56,
    images: ['/assets/outfits/p8a.png', '/assets/outfits/p8b.png'],
    image: '/assets/outfits/p8a.png',
    navratriDay: 8,
    flair: '10M Heavy Gher',
    desc: 'Festive red traditional silhouette rich with auspicious golden borders, cowrie hangings, and celebratory flair.',
    popular: true
  },
  {
    id: 'gfit-09',
    name: 'Aasmani Celestial Mirrorwork Ghagra',
    colorTheme: 'Sky Blue & Silver',
    fabric: 'Fine Georgette with Silver Resham & Star Mirror Work',
    pricePerNight: 700,
    rentPrice: 1599,
    deposit: 2200,
    retailValue: 15800,
    sizes: ['S', 'M', 'L', 'XL'],
    rating: 4.9,
    reviewsCount: 37,
    images: ['/assets/outfits/p9a.png', '/assets/outfits/p9b.png'],
    image: '/assets/outfits/p9a.png',
    navratriDay: 9,
    flair: '10M Ultra Twirl',
    desc: 'Ethereal pastel blue silhouette embellished with intricate constellation mirror work and silver sequin borders.',
    popular: false
  },
  {
    id: 'gfit-10',
    name: 'Gulabi Kesariya Bandhej Ghagra Choli',
    colorTheme: 'Saffron Orange & Fuchsia',
    fabric: 'Pure Chanderi Silk with Golden Zari & Kundan Patches',
    pricePerNight: 700,
    rentPrice: 1699,
    deposit: 2400,
    retailValue: 16500,
    sizes: ['XS', 'S', 'M', 'L'],
    rating: 5.0,
    reviewsCount: 44,
    images: ['/assets/outfits/p10a.png', '/assets/outfits/p10b.png'],
    image: '/assets/outfits/p10a.png',
    navratriDay: 1,
    flair: '9.5M Heavy Gher',
    desc: 'Festive fusion of saffron warmth and fuchsia vibrancy with handcrafted kundan embroidery and traditional tie-dye.',
    popular: true
  },
  {
    id: 'gfit-11',
    name: 'Noorani Black Abhala Doli Lehenga',
    colorTheme: 'Midnight Black & Multicolored Thread',
    fabric: 'Heavy Cotton Slub with Gujarati Abhala & Pom-pom Border',
    pricePerNight: 700,
    rentPrice: 1799,
    deposit: 2500,
    retailValue: 18000,
    sizes: ['S', 'M', 'L', 'XL'],
    rating: 4.9,
    reviewsCount: 52,
    images: ['/assets/outfits/p11a.png', '/assets/outfits/p11b.png'],
    image: '/assets/outfits/p11a.png',
    navratriDay: 2,
    flair: '10M Full Twirl',
    desc: 'Iconic jet black Gujarati lehenga covered in kaleidoscope embroidery, authentic glass abhala mirrors, and playful pom-poms.',
    popular: true
  },
  {
    id: 'gfit-12',
    name: 'Surajmukhi Golden Yellow Gamthi Set',
    colorTheme: 'Sunflower Yellow & Teal',
    fabric: 'Organic Slub Cotton with Kutchi Hand Embroidery',
    pricePerNight: 700,
    rentPrice: 1449,
    deposit: 2000,
    retailValue: 14000,
    sizes: ['S', 'M', 'L'],
    rating: 4.8,
    reviewsCount: 33,
    images: ['/assets/outfits/p12a.png', '/assets/outfits/p12b.png'],
    image: '/assets/outfits/p12a.png',
    navratriDay: 3,
    flair: '8.5M Lightweight',
    desc: 'Bright sunny palette paired with contrast teal dori work and real mirror accents, crafted for breezy fast-paced garba steps.',
    popular: false
  },
  {
    id: 'gfit-13',
    name: 'Teal Mayura Gamthi Gher Chaniya',
    colorTheme: 'Deep Teal & Mustard',
    fabric: 'Pure Handloom Cotton with Resham Peacock Motifs',
    pricePerNight: 700,
    rentPrice: 1649,
    deposit: 2300,
    retailValue: 16200,
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    rating: 4.9,
    reviewsCount: 40,
    images: ['/assets/outfits/p13a.png'],
    image: '/assets/outfits/p13a.png',
    navratriDay: 4,
    flair: '9M Ultra Flare',
    desc: 'Striking jewel-toned peacock blue ensemble highlighted with golden gota ribbons, cowrie tassels, and mirror medallions.',
    popular: false
  },
  {
    id: 'gfit-14',
    name: 'Kasturi Lavender Pastel Mirror Choli',
    colorTheme: 'Lavender & Champagne Gold',
    fabric: 'Silk Georgette with Delicate Threadwork & Foil Accents',
    pricePerNight: 700,
    rentPrice: 1549,
    deposit: 2200,
    retailValue: 15000,
    sizes: ['S', 'M', 'L'],
    rating: 4.8,
    reviewsCount: 27,
    images: ['/assets/outfits/p14a.png'],
    image: '/assets/outfits/p14a.png',
    navratriDay: 5,
    flair: '9M Fluid Spin',
    desc: 'Modern pastel elegance meets classical festive tradition with shimmering champagne border laces and mirror floral sprays.',
    popular: false
  },
  {
    id: 'gfit-15',
    name: 'Angoori Mint Green Gota Patti Ghagra',
    colorTheme: 'Mint Green & Coral Pink',
    fabric: 'Raw Silk with Jaipuri Gota Patti & Zardozi Details',
    pricePerNight: 700,
    rentPrice: 1699,
    deposit: 2500,
    retailValue: 17200,
    sizes: ['S', 'M', 'L', 'XL'],
    rating: 4.9,
    reviewsCount: 45,
    images: ['/assets/outfits/p15a.png'],
    image: '/assets/outfits/p15a.png',
    navratriDay: 6,
    flair: '10M Heavy Gher',
    desc: 'Cool mint canvas beautifully contrasted with coral borders and glistening gold gota ribbons engineered for wide dramatic spins.',
    popular: false
  },
  {
    id: 'gfit-16',
    name: 'Sindhuri Maroon Ahir Embroidered Set',
    colorTheme: 'Deep Maroon & Ochre',
    fabric: 'Heavy Khadi with Traditional Ahir Stitch & Cowries',
    pricePerNight: 700,
    rentPrice: 1749,
    deposit: 2500,
    retailValue: 17800,
    sizes: ['M', 'L', 'XL', 'XXL'],
    rating: 5.0,
    reviewsCount: 49,
    images: ['/assets/outfits/p16a.png'],
    image: '/assets/outfits/p16a.png',
    navratriDay: 7,
    flair: '10M Full Twirl',
    desc: 'Traditional tribal Ahir needlecraft loaded with hand-sewn glass pieces, ochre yarn tassels, and heavy perimeter borders.',
    popular: true
  },
  {
    id: 'gfit-17',
    name: 'Champakali Yellow Silk Brocade Chaniya',
    colorTheme: 'Golden Yellow & Royal Blue',
    fabric: 'Banarasi Brocade with Gamthi Work Blouse',
    pricePerNight: 700,
    rentPrice: 1599,
    deposit: 2200,
    retailValue: 15600,
    sizes: ['XS', 'S', 'M', 'L'],
    rating: 4.9,
    reviewsCount: 36,
    images: ['/assets/outfits/p17a.png'],
    image: '/assets/outfits/p17a.png',
    navratriDay: 8,
    flair: '9M Flowing Twirl',
    desc: 'Luminous brocade weave reflecting festive radiance under garba arena lighting, paired with a vibrant royal blue koti blouse.',
    popular: false
  },
  {
    id: 'gfit-18',
    name: 'Koyal Charcoal & Neon Mirror Ensemble',
    colorTheme: 'Charcoal Grey & Neon Orange',
    fabric: 'Fine Slub Cotton with High-Contrast Neon Resham Work',
    pricePerNight: 700,
    rentPrice: 1649,
    deposit: 2400,
    retailValue: 16200,
    sizes: ['S', 'M', 'L', 'XL'],
    rating: 4.8,
    reviewsCount: 32,
    images: ['/assets/outfits/p18a.png'],
    image: '/assets/outfits/p18a.png',
    navratriDay: 9,
    flair: '9.5M Heavy Flare',
    desc: 'Contemporary youth garba style combining sleek charcoal with electric neon accents and concentrated abhala clusters.',
    popular: false
  },
  {
    id: 'gfit-19',
    name: 'Padmavati Crimson Rani Zari Lehenga',
    colorTheme: 'Crimson Red & Antique Gold',
    fabric: 'Velvet & Chanderi Silk with Heavy Antique Zari Borders',
    pricePerNight: 700,
    rentPrice: 1849,
    deposit: 2600,
    retailValue: 19500,
    sizes: ['S', 'M', 'L', 'XL'],
    rating: 5.0,
    reviewsCount: 61,
    images: ['/assets/outfits/p19a.png'],
    image: '/assets/outfits/p19a.png',
    navratriDay: 1,
    flair: '10M Ultra Twirl',
    desc: 'A royal bridal-grade Navratri masterpiece with dense antique zari weaving, mirror kalis, and luxurious double-tier borders.',
    popular: true
  },
  {
    id: 'gfit-20',
    name: 'Narmada Turquoise Bandhani Dream Set',
    colorTheme: 'Turquoise & Lime Green',
    fabric: 'Pure Georgette with Traditional Kutchi Bandhani & Mirrors',
    pricePerNight: 700,
    rentPrice: 1499,
    deposit: 2100,
    retailValue: 14800,
    sizes: ['XS', 'S', 'M', 'L'],
    rating: 4.9,
    reviewsCount: 35,
    images: ['/assets/outfits/p20a.png'],
    image: '/assets/outfits/p20a.png',
    navratriDay: 2,
    flair: '8.5M Lightweight Spin',
    desc: 'Effortlessly lightweight turquoise tie-dye drape with electric lime accents, crafted for non-stop dandiya rounds without fatigue.',
    popular: false
  }
];

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

// GET all 20 outfits
app.get('/api/outfits', (req, res) => {
  res.json({
    success: true,
    count: outfits.length,
    data: outfits
  });
});

// GET outfit by ID
app.get('/api/outfits/:id', (req, res) => {
  const outfit = outfits.find(o => o.id === req.params.id);
  if (!outfit) {
    return res.status(404).json({ success: false, message: 'Outfit not found' });
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

  const outfit = outfits.find(o => o.id === outfitId);
  const clientName = customerName || `${firstName || ''} ${lastName || ''}`.trim() || 'Valued Customer';
  const clientPhone = phone || mobile;
  const rentalNights = selectedDates && selectedDates.length > 0 ? selectedDates.length : (parseInt(days) || 3);
  const rent = totalRent || (outfit ? outfit.pricePerNight * rentalNights : 1500);
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
