import React, { useState, useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { BrowseRentIcon, EyeIcon, ArrowRightIcon, StarIcon, CloseIcon, SparkleIcon, ShieldCheckIcon, ChevronLeftIcon, ChevronRightIcon, LinkedInIcon, GitHubIcon, MailIcon, PhoneIcon } from '../components/Icons';
import RentalModal from '../components/RentalModal';
import '../styles/style-home.css';
import '../styles/style-about.css';
import '../styles/style-contact.css';

const heroImg = '/assets/1.png';

/* ── Caption carousel data ── */
const CAPTIONS = [
  "Rent the Chaniya, spend the rest on tuck shop.",
  "Rent the best Chaniya before your roommate does.",
  "MIT gives you deadlines. We give you the best Chaniyas",
];

/* ── 20 outfit cards data ── */
const OUTFITS = [
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
    desc: 'Authentic Gujarati craftsmanship featuring intricate Gamthi embroidery and real mirror accents that sparkle under garba night lights.'
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
    desc: 'Traditional Rabari tribal design adorned with hand-stitched motifs and cowrie shell hangings designed for effortless 360-degree spins.'
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
    desc: 'Vibrant Bandhani tie-dye artistry paired with golden Gota Patti lace work, offering lightweight comfort for energetic garba rounds.'
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
    desc: 'Heritage Kutchi artisanal masterpiece weaving together hand-woven patches, thread tassels, and mirror work for a standout festive look.'
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
    desc: 'Rich emerald green hand-embroidered ghagra paired with an ornate mirror blouse and contrasting dupatta.'
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
    desc: 'Warm sunset amber palette highlighted with luminous abhala mirror discs and handcrafted tassels.'
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
    desc: 'Deep navy midnight ensemble glittering with cosmic mirror reflections, crafted for graceful garba steps.'
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
    desc: 'Festive red traditional silhouette rich with auspicious golden borders, cowrie hangings, and celebratory flair.'
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
    desc: 'Ethereal pastel blue silhouette embellished with intricate constellation mirror work and silver sequin borders.'
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
    desc: 'Festive fusion of saffron warmth and fuchsia vibrancy with handcrafted kundan embroidery and traditional tie-dye.'
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
    desc: 'Iconic jet black Gujarati lehenga covered in kaleidoscope embroidery, authentic glass abhala mirrors, and playful pom-poms.'
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
    desc: 'Bright sunny palette paired with contrast teal dori work and real mirror accents, crafted for breezy fast-paced garba steps.'
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
    desc: 'Striking jewel-toned peacock blue ensemble highlighted with golden gota ribbons, cowrie tassels, and mirror medallions.'
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
    desc: 'Modern pastel elegance meets classical festive tradition with shimmering champagne border laces and mirror floral sprays.'
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
    desc: 'Cool mint canvas beautifully contrasted with coral borders and glistening gold gota ribbons engineered for wide dramatic spins.'
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
    desc: 'Traditional tribal Ahir needlecraft loaded with hand-sewn glass pieces, ochre yarn tassels, and heavy perimeter borders.'
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
    desc: 'Luminous brocade weave reflecting festive radiance under garba arena lighting, paired with a vibrant royal blue koti blouse.'
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
    desc: 'Contemporary youth garba style combining sleek charcoal with electric neon accents and concentrated abhala clusters.'
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
    desc: 'A royal bridal-grade Navratri masterpiece with dense antique zari weaving, mirror kalis, and luxurious double-tier borders.'
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
    desc: 'Effortlessly lightweight turquoise tie-dye drape with electric lime accents, crafted for non-stop dandiya rounds without fatigue.'
  }
];

/* ── Outfit Card Component: Image Carousel with GSAP Slide, Price tag + two buttons below ── */
const OutfitCardItem = React.forwardRef(({ outfit, onRent, onView }, ref) => {
  const images = outfit.images && outfit.images.length > 0 ? outfit.images : [outfit.image];
  const [currentIdx, setCurrentIdx] = useState(0);
  const trackRef = useRef(null);

  useEffect(() => {
    if (trackRef.current) {
      gsap.to(trackRef.current, {
        xPercent: -(currentIdx * (100 / images.length)),
        duration: 0.55,
        ease: 'power2.out'
      });
    }
  }, [currentIdx, images.length]);

  const handlePrev = (e) => {
    e.stopPropagation();
    setCurrentIdx((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const handleNext = (e) => {
    e.stopPropagation();
    setCurrentIdx((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  const handleDotClick = (e, idx) => {
    e.stopPropagation();
    setCurrentIdx(idx);
  };

  return (
    <div className="hero-outfit-card" ref={ref}>
      <div className="card-media-wrap">
        <div
          className="card-slider-track"
          ref={trackRef}
          style={{ width: `${images.length * 100}%` }}
        >
          {images.map((imgSrc, idx) => (
            <div
              key={idx}
              className="card-slider-slide"
              style={{ width: `${100 / images.length}%` }}
            >
              <img
                src={imgSrc}
                alt={`${outfit.name} - view ${idx + 1}`}
                loading={idx === 0 ? "eager" : "lazy"}
                onError={(e) => {
                  e.currentTarget.src = outfit.image || '/assets/outfits/p1a.png';
                }}
              />
            </div>
          ))}
        </div>

        {/* Translucent Price tag on top left of image */}
        <span className="card-price-tag">
          ₹ {outfit.pricePerNight || 700} / Night
        </span>

        {/* Carousel Prev/Next Arrows */}
        {images.length > 1 && (
          <>
            <button
              type="button"
              className="card-arrow-btn card-arrow-prev"
              onClick={handlePrev}
              aria-label="Previous image preview"
              title="Previous preview"
            >
              <ChevronLeftIcon size={16} />
            </button>
            <button
              type="button"
              className="card-arrow-btn card-arrow-next"
              onClick={handleNext}
              aria-label="Next image preview"
              title="Next preview"
            >
              <ChevronRightIcon size={16} />
            </button>
            {/* Dots Indicator */}
            <div className="card-dots-container">
              {images.map((_, idx) => (
                <button
                  key={idx}
                  type="button"
                  className={`card-dot ${idx === currentIdx ? 'active' : ''}`}
                  onClick={(e) => handleDotClick(e, idx)}
                  aria-label={`View image ${idx + 1}`}
                />
              ))}
            </div>
          </>
        )}
      </div>

      {/* Two buttons below with equidistant gap and margin */}
      <div className="card-minimal-footer">
        <button
          type="button"
          className="btn-card-view"
          onClick={() => onView(outfit)}
          title="View outfit details"
        >
          <EyeIcon size={16} />
          <span>View</span>
        </button>
        <button
          type="button"
          className="btn-card-rent"
          onClick={() => onRent(outfit)}
          title="Rent this outfit"
        >
          <span>Rent</span>
          <ArrowRightIcon size={16} />
        </button>
      </div>
    </div>
  );
});

OutfitCardItem.displayName = 'OutfitCardItem';

export default function Home({
  activeTab = 'home',
  onActiveTabChange = () => { },
  requestedNav = null
}) {
  const [captionIndex, setCaptionIndex] = useState(0);
  const [visible, setVisible] = useState(true);

  /* ── Modal states ── */
  const [outfitsList, setOutfitsList] = useState(OUTFITS);
  const [selectedOutfit, setSelectedOutfit] = useState(null);
  const [viewModalOutfit, setViewModalOutfit] = useState(null);
  const [modalImgIndex, setModalImgIndex] = useState(0);
  const modalSliderTrackRef = useRef(null);

  // Fetch live outfits from backend with instant fallback
  useEffect(() => {
    const fetchCatalog = async () => {
      try {
        const res = await fetch('/api/outfits');
        if (res.ok) {
          const json = await res.json();
          if (json && json.success && Array.isArray(json.data) && json.data.length > 0) {
            setOutfitsList(json.data);
          }
        }
      } catch (err) {
        console.warn('Using local fallback outfits catalog (backend offline/starting):', err);
      }
    };
    fetchCatalog();
  }, []);

  useEffect(() => {
    if (modalSliderTrackRef.current && viewModalOutfit) {
      const count = viewModalOutfit.images?.length || 1;
      gsap.to(modalSliderTrackRef.current, {
        xPercent: -(modalImgIndex * (100 / count)),
        duration: 0.55,
        ease: 'power2.out'
      });
    }
  }, [modalImgIndex, viewModalOutfit]);

  /* ── Refs: hero intro elements ── */
  const circleRef = useRef(null);
  const imageRef = useRef(null);
  const headlineRef = useRef(null);
  const subtitleRef = useRef(null);
  const actionsRef = useRef(null);
  const introBoxRef = useRef(null);
  const graphicBoxRef = useRef(null);

  /* ── Refs: outfit card elements ── */
  const cardRefs = useRef([]);
  const cardsTrackRef = useRef(null);

  const getLeftCards = () => cardRefs.current.filter((_, idx) => (idx % 4) < 2).filter(Boolean);
  const getRightCards = () => cardRefs.current.filter((_, idx) => (idx % 4) >= 2).filter(Boolean);
  const getAllCards = () => cardRefs.current.filter(Boolean);

  /* ── Refs: About view panels ── */
  const aboutTrackRef = useRef(null);
  const aboutLeftRef = useRef(null);
  const aboutRightRef = useRef(null);

  /* ── Refs: Contact view panels ── */
  const contactTrackRef = useRef(null);
  const contactLeftRef = useRef(null);
  const contactRightRef = useRef(null);

  /* ── Contact form state & handler ── */
  const [contactSubmitted, setContactSubmitted] = useState(false);
  const [contactForm, setContactForm] = useState({ name: '', phone: '', email: '', message: '' });

  const handleContactSubmit = async (e) => {
    e.preventDefault();
    try {
      await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(contactForm)
      });
    } catch (err) {
      console.warn('Backend offline, inquiry processed locally:', err);
    }
    setContactSubmitted(true);
  };

  /* ── Animation & queue state machines ── */
  const currentTimelineRef = useRef(null);
  const isAnimatingRef = useRef(false);
  const currentViewRef = useRef(activeTab || 'home');
  const pendingTabRef = useRef(null);

  /* ── Caption carousel ── */
  useEffect(() => {
    const interval = setInterval(() => {
      setVisible(false);
      setTimeout(() => {
        setCaptionIndex(prev => (prev + 1) % CAPTIONS.length);
        setVisible(true);
      }, 500);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  /* ── Universal View Slide-Out Animation ── */
  const buildSlideOut = (fromView, tl) => {
    if (fromView === 'home') {
      tl.to(actionsRef.current, { opacity: 0, duration: 0.25, ease: 'power2.out' }, 0)
        .to([headlineRef.current, subtitleRef.current], { x: '-140vw', opacity: 0, duration: 0.55, ease: 'power3.in' }, 0.05)
        .to([circleRef.current, imageRef.current], { x: '140vw', opacity: 0, duration: 0.55, ease: 'power3.in' }, 0.05)
        .add(() => {
          gsap.set([introBoxRef.current, graphicBoxRef.current], { pointerEvents: 'none' });
        });
    } else if (fromView === 'rent') {
      const leftCards = getLeftCards();
      const rightCards = getRightCards();
      tl.to(leftCards, { x: '-140vw', opacity: 0, duration: 0.5, stagger: 0.04, ease: 'power3.in' }, 0)
        .to(rightCards, { x: '140vw', opacity: 0, duration: 0.5, stagger: 0.04, ease: 'power3.in' }, '<')
        .add(() => {
          gsap.set(cardsTrackRef.current, { visibility: 'hidden', pointerEvents: 'none' });
        });
    } else if (fromView === 'about') {
      tl.to(aboutLeftRef.current, { x: '-140vw', opacity: 0, duration: 0.5, ease: 'power3.in' }, 0)
        .to(aboutRightRef.current, { x: '140vw', opacity: 0, duration: 0.5, ease: 'power3.in' }, '<')
        .add(() => {
          gsap.set(aboutTrackRef.current, { visibility: 'hidden', pointerEvents: 'none' });
        });
    } else if (fromView === 'contact') {
      tl.to(contactLeftRef.current, { x: '-140vw', opacity: 0, duration: 0.5, ease: 'power3.in' }, 0)
        .to(contactRightRef.current, { x: '140vw', opacity: 0, duration: 0.5, ease: 'power3.in' }, '<')
        .add(() => {
          gsap.set(contactTrackRef.current, { visibility: 'hidden', pointerEvents: 'none' });
        });
    }
  };

  /* ── Universal View Slide-In Preparation ── */
  const prepareSlideIn = (toView) => {
    if (toView === 'home') {
      gsap.set([introBoxRef.current, graphicBoxRef.current], { pointerEvents: 'auto', opacity: 1 });
      gsap.set(headlineRef.current, { x: '-140vw', opacity: 0 });
      gsap.set(circleRef.current, { x: '140vw', opacity: 0 });
      gsap.set(subtitleRef.current, { x: '-140vw', opacity: 0 });
      gsap.set(imageRef.current, { x: '140vw', opacity: 0 });
      gsap.set(actionsRef.current, { opacity: 0 });
    } else if (toView === 'rent') {
      const leftCards = getLeftCards();
      const rightCards = getRightCards();
      gsap.set(cardsTrackRef.current, { visibility: 'visible', pointerEvents: 'auto' });
      gsap.set(leftCards, { x: '-140vw', opacity: 0 });
      gsap.set(rightCards, { x: '140vw', opacity: 0 });
    } else if (toView === 'about') {
      gsap.set(aboutTrackRef.current, { visibility: 'visible', pointerEvents: 'auto' });
      gsap.set(aboutLeftRef.current, { x: '-140vw', opacity: 0 });
      gsap.set(aboutRightRef.current, { x: '140vw', opacity: 0 });
    } else if (toView === 'contact') {
      gsap.set(contactTrackRef.current, { visibility: 'visible', pointerEvents: 'auto' });
      gsap.set(contactLeftRef.current, { x: '-140vw', opacity: 0 });
      gsap.set(contactRightRef.current, { x: '140vw', opacity: 0 });
    }
  };

  /* ── Universal View Slide-In Tweens Attachment ── */
  const attachSlideIn = (toView, tl) => {
    if (toView === 'home') {
      // 1. First slide svg semi circle bg and head text together
      tl.to(headlineRef.current, { x: '0%', opacity: 1, duration: 0.75, ease: 'power3.out' }, '+=0.02')
        .to(circleRef.current, { x: '0%', opacity: 1, duration: 0.75, ease: 'power3.out' }, '<')
        // 2. Then svg and subhead text together
        .to(subtitleRef.current, { x: '0%', opacity: 1, duration: 0.75, ease: 'power3.out' }, '-=0.35')
        .to(imageRef.current, { x: '0%', opacity: 1, duration: 0.75, ease: 'power3.out' }, '<')
        // 3. And then fade in the button
        .to(actionsRef.current, { opacity: 1, duration: 0.5, ease: 'power2.out' }, '-=0.2');
    } else if (toView === 'rent') {
      const leftCards = getLeftCards();
      const rightCards = getRightCards();
      tl.to(leftCards, { x: '0%', opacity: 1, duration: 0.65, stagger: 0.06, ease: 'power3.out' }, '+=0.02')
        .to(rightCards, { x: '0%', opacity: 1, duration: 0.65, stagger: 0.06, ease: 'power3.out' }, '<');
    } else if (toView === 'about') {
      tl.to(aboutLeftRef.current, { x: '0%', opacity: 1, duration: 0.65, ease: 'power3.out' }, '+=0.02')
        .to(aboutRightRef.current, { x: '0%', opacity: 1, duration: 0.65, ease: 'power3.out' }, '<');
    } else if (toView === 'contact') {
      tl.to(contactLeftRef.current, { x: '0%', opacity: 1, duration: 0.65, ease: 'power3.out' }, '+=0.02')
        .to(contactRightRef.current, { x: '0%', opacity: 1, duration: 0.65, ease: 'power3.out' }, '<');
    }
  };

  /* ── Unified Transition Request Handler with Queue ── */
  const requestTransition = (targetTab) => {
    if (targetTab === currentViewRef.current && !isAnimatingRef.current) {
      return;
    }

    if (isAnimatingRef.current) {
      pendingTabRef.current = targetTab;
      if (currentTimelineRef.current) {
        currentTimelineRef.current.timeScale(1.5);
      }
      return;
    }

    const fromView = currentViewRef.current;
    isAnimatingRef.current = true;
    pendingTabRef.current = null;
    onActiveTabChange(targetTab);

    prepareSlideIn(targetTab);

    const tl = gsap.timeline({
      onComplete: () => {
        currentViewRef.current = targetTab;
        isAnimatingRef.current = false;

        if (targetTab === 'home') {
          gsap.set([headlineRef.current, subtitleRef.current, circleRef.current, imageRef.current, actionsRef.current], { x: '0%', opacity: 1, clearProps: 'transform' });
        } else if (targetTab === 'rent') {
          gsap.set(getAllCards(), { x: '0%', opacity: 1, visibility: 'visible', clearProps: 'transform' });
        } else if (targetTab === 'about') {
          gsap.set([aboutLeftRef.current, aboutRightRef.current], { x: '0%', opacity: 1, clearProps: 'transform' });
        } else if (targetTab === 'contact') {
          gsap.set([contactLeftRef.current, contactRightRef.current], { x: '0%', opacity: 1, clearProps: 'transform' });
        }

        if (pendingTabRef.current && pendingTabRef.current !== targetTab) {
          const next = pendingTabRef.current;
          pendingTabRef.current = null;
          requestTransition(next);
        }
      }
    });

    currentTimelineRef.current = tl;
    buildSlideOut(fromView, tl);
    attachSlideIn(targetTab, tl);
  };

  /* ── React to navbar click events passed via requestedNav ── */
  useEffect(() => {
    if (!requestedNav) return;
    requestTransition(requestedNav.tab);
  }, [requestedNav]);

  /* ── Initial mount entrance ── */
  useEffect(() => {
    const leftCards = getLeftCards();
    const rightCards = getRightCards();
    const allCards = getAllCards();

    // Reset non-active views off-screen
    gsap.set(leftCards, { x: '-140vw', opacity: 0 });
    gsap.set(rightCards, { x: '140vw', opacity: 0 });
    gsap.set(cardsTrackRef.current, { visibility: 'hidden', pointerEvents: 'none' });

    gsap.set(aboutLeftRef.current, { x: '-140vw', opacity: 0 });
    gsap.set(aboutRightRef.current, { x: '140vw', opacity: 0 });
    gsap.set(aboutTrackRef.current, { visibility: 'hidden', pointerEvents: 'none' });

    gsap.set(contactLeftRef.current, { x: '-140vw', opacity: 0 });
    gsap.set(contactRightRef.current, { x: '140vw', opacity: 0 });
    gsap.set(contactTrackRef.current, { visibility: 'hidden', pointerEvents: 'none' });

    if (activeTab === 'rent') {
      currentViewRef.current = 'rent';
      gsap.set([introBoxRef.current, graphicBoxRef.current], { pointerEvents: 'none', opacity: 0 });
      gsap.set(cardsTrackRef.current, { visibility: 'visible', pointerEvents: 'auto' });
      gsap.set(allCards, { x: '0%', opacity: 1 });
    } else if (activeTab === 'about') {
      currentViewRef.current = 'about';
      gsap.set([introBoxRef.current, graphicBoxRef.current], { pointerEvents: 'none', opacity: 0 });
      gsap.set(aboutTrackRef.current, { visibility: 'visible', pointerEvents: 'auto' });
      gsap.set([aboutLeftRef.current, aboutRightRef.current], { x: '0%', opacity: 1 });
    } else if (activeTab === 'contact') {
      currentViewRef.current = 'contact';
      gsap.set([introBoxRef.current, graphicBoxRef.current], { pointerEvents: 'none', opacity: 0 });
      gsap.set(contactTrackRef.current, { visibility: 'visible', pointerEvents: 'auto' });
      gsap.set([contactLeftRef.current, contactRightRef.current], { x: '0%', opacity: 1 });
    } else {
      currentViewRef.current = 'home';
      gsap.set([introBoxRef.current, graphicBoxRef.current], { pointerEvents: 'auto', opacity: 1 });

      // Initial off-screen positions for entrance
      gsap.set(headlineRef.current, { x: '-140vw', opacity: 0 });
      gsap.set(circleRef.current, { x: '140vw', opacity: 0 });
      gsap.set(subtitleRef.current, { x: '-140vw', opacity: 0 });
      gsap.set(imageRef.current, { x: '140vw', opacity: 0 });
      gsap.set(actionsRef.current, { opacity: 0 });

      // Initial mount entrance animation sequence:
      // 1. Slide svg semi circle bg and head text together
      // 2. Then slide svg and subhead text together
      // 3. Then fade in the button
      isAnimatingRef.current = true;
      const tl = gsap.timeline({
        delay: 0.15,
        onComplete: () => {
          isAnimatingRef.current = false;
          gsap.set([headlineRef.current, subtitleRef.current, circleRef.current, imageRef.current, actionsRef.current], {
            x: '0%',
            opacity: 1,
            clearProps: 'transform'
          });
        }
      });
      currentTimelineRef.current = tl;

      tl.to(headlineRef.current, { x: '0%', opacity: 1, duration: 0.8, ease: 'power3.out' }, 0)
        .to(circleRef.current, { x: '0%', opacity: 1, duration: 0.8, ease: 'power3.out' }, 0)
        .to(subtitleRef.current, { x: '0%', opacity: 1, duration: 0.75, ease: 'power3.out' }, '-=0.35')
        .to(imageRef.current, { x: '0%', opacity: 1, duration: 0.75, ease: 'power3.out' }, '<')
        .to(actionsRef.current, { opacity: 1, duration: 0.5, ease: 'power2.out' }, '-=0.2');
    }

    return () => {
      if (currentTimelineRef.current) currentTimelineRef.current.kill();
    };
  }, []);

  return (
    <div className="home-page">
      <section className="hero-section">
        <div className="container hero-container">
          <div className="hero-grid">

            {/* ════════════ LEFT COLUMN: Intro text ════════════ */}
            <div className="hero-content">
              <div className="hero-intro-wrapper" ref={introBoxRef}>
                <h1 className="hero-headline" ref={headlineRef}>
                  <span className="headline-word text-rose">Wear</span>{' '}
                  <span className="headline-word text-charcoal">it,</span>{' '}
                  <span className="hero-pill-frame">
                    <img src="/assets/hero-pill.jpg" alt="Celebratory Garba dancers" />
                  </span>
                  <br />
                  <span className="headline-word text-charcoal">Then</span>{' '}
                  <span className="headline-word text-rose">share</span>{' '}
                  <span className="headline-word text-charcoal">it.</span>
                </h1>

                <p ref={subtitleRef} className="hero-subtitle caption-carousel"
                  style={{ opacity: visible ? 1 : 0 }}>
                  {CAPTIONS[captionIndex]}
                </p>

                {/* Primary "Rent Now" button */}
                <div className="hero-actions" ref={actionsRef}>
                  <button
                    className="btn-primary"
                    id="hero-action-btn"
                    onClick={() => requestTransition('rent')}
                  >
                    <BrowseRentIcon size={18} />
                    <span>Rent Now</span>
                  </button>
                </div>
              </div>
            </div>

            {/* ════════════ RIGHT COLUMN: Semicircle/SVG ════════════ */}
            <div className="hero-visual">
              <div className="hero-visual-wrapper" ref={graphicBoxRef}>
                <div className="hero-circle-backdrop" ref={circleRef} />
                <div className="hero-image-wrapper" ref={imageRef}>
                  <img src={heroImg} alt="GarbaFits Illustration Preview" />
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* ════════════ OUTFIT CARDS (RENT VIEW): Equidistant track ════════════ */}
        <div className="cards-equidistant-container" ref={cardsTrackRef}>
          {outfitsList.map((outfit, index) => (
            <OutfitCardItem
              key={outfit.id}
              outfit={outfit}
              ref={(el) => (cardRefs.current[index] = el)}
              onRent={(item) => setSelectedOutfit(item)}
              onView={(item) => {
                setModalImgIndex(0);
                setViewModalOutfit(item);
              }}
            />
          ))}
        </div>

        {/* ════════════ ABOUT VIEW: In-page slide panels ════════════ */}
        <div className="about-slide-container" ref={aboutTrackRef}>
          {/* Left panel: Vector Style Text & Story */}
          <div className="about-panel-left" ref={aboutLeftRef}>
            <div className="about-vector-left">
              <h2 className="about-big-heading">ABOUT US</h2>
              <div className="about-heading-bar"></div>
              
              <p className="about-vector-desc">
                We are 3rd year B.Tech CSE students from MIT ADT University developing <strong>GarbaFits</strong>, a platform to rent authentic designer Chaniya Cholis and festive fits for Garba, Dandiya, and cultural celebrations.
              </p>

              <p className="about-vector-subtext">
                We noticed how difficult and expensive it is to buy a brand new ₹10,000+ outfit every single year for just a few festive nights. Through GarbaFits, we make 9-meter full-flair, authentic Gamthi and real mirror-work outfits accessible, steam-sanitized, and affordable starting at just ₹700/night with fast campus delivery!
              </p>

              <button
                onClick={() => requestTransition('rent')}
                className="btn-primary about-vector-btn"
              >
                <BrowseRentIcon size={18} />
                <span>Explore Fits</span>
              </button>
            </div>
          </div>

          {/* Right panel: Organic Blob Backdrop & 2 Staggered Business Owners */}
          <div className="about-panel-right" ref={aboutRightRef}>
            <div className="about-vector-right">
              {/* Organic Blob Backdrop */}
              <div className="about-blob-backdrop"></div>

              {/* 2 Owners Cards (Side-by-Side with One Staggered Up and One Down) */}
              <div className="about-owners-duo">
                {/* Owner 1: Krishna (Staggered Up) */}
                <div className="owner-profile-card stagger-up">
                  <div className="owner-avatar-frame">
                    <img
                      src="/assets/owner1.png"
                      alt="Krishna"
                    />
                    <div className="owner-floating-name">Krishna</div>
                  </div>

                  <div className="owner-social-row">
                    <a
                      href="https://www.linkedin.com/in/krishnagorde/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="owner-social-btn linkedin"
                      title="LinkedIn"
                      aria-label="LinkedIn"
                    >
                      <LinkedInIcon size={18} />
                    </a>
                    <a
                      href="https://github.com/Necromacker"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="owner-social-btn github"
                      title="GitHub"
                      aria-label="GitHub"
                    >
                      <GitHubIcon size={18} />
                    </a>
                    <a
                      href="mailto:krishnagorde04@gmail.com?subject=GarbaFits%20Inquiry"
                      className="owner-social-btn email"
                      title="Email"
                      aria-label="Email"
                    >
                      <MailIcon size={18} />
                    </a>
                  </div>
                </div>

                {/* Owner 2: Vruti Moradiya (Staggered Down) */}
                <div className="owner-profile-card stagger-down">
                  <div className="owner-avatar-frame">
                    <img
                      src="/assets/owner2.png"
                      alt="Vruti Moradiya"
                    />
                    <div className="owner-floating-name">Vruti Moradiya</div>
                  </div>

                  <div className="owner-social-row">
                    <a
                      href="https://www.linkedin.com/in/vruti-moradiya-241559321/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="owner-social-btn linkedin"
                      title="LinkedIn"
                      aria-label="LinkedIn"
                    >
                      <LinkedInIcon size={18} />
                    </a>
                    <a
                      href="https://github.com/VruttiMoradiya999"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="owner-social-btn github"
                      title="GitHub"
                      aria-label="GitHub"
                    >
                      <GitHubIcon size={18} />
                    </a>
                    <a
                      href="mailto:vrutimoradiya999@gmail.com?subject=GarbaFits%20Inquiry"
                      className="owner-social-btn email"
                      title="Email"
                      aria-label="Email"
                    >
                      <MailIcon size={18} />
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ════════════ CONTACT VIEW: In-page sliding layout ════════════ */}
        <div className="contact-slide-container" ref={contactTrackRef}>
          {/* Left panel: Retro Phone */}
          <div className="contact-panel-left" ref={contactLeftRef}>
            <div className="contact-phone-col">
              <div className="contact-phone-frame">
                <img
                  src="/assets/contact-phone.jpg"
                  alt="Retro Hello Phone"
                />
              </div>
            </div>
          </div>

          {/* Right panel: Direct Phone Number and Email Pills */}
          <div className="contact-panel-right" ref={contactRightRef}>
            <div className="contact-form-col">
              <h2 className="contact-heading-display">GET IN TOUCH!</h2>

              <div className="contact-info-list">
                {/* Contact 1: Vruti */}
                <a href="tel:+916354793852" className="contact-pill-item">
                  <div className="contact-pill-icon">
                    <PhoneIcon size={20} />
                  </div>
                  <div className="contact-pill-details">
                    <span className="contact-pill-label">Vruti · Phone / WhatsApp</span>
                    <span className="contact-pill-value">+91 6354 793 852</span>
                  </div>
                </a>

                <a href="mailto:vrutimoradiya999@gmail.com" className="contact-pill-item">
                  <div className="contact-pill-icon">
                    <MailIcon size={20} />
                  </div>
                  <div className="contact-pill-details">
                    <span className="contact-pill-label">Vruti · Email</span>
                    <span className="contact-pill-value">vrutimoradiya999@gmail.com</span>
                  </div>
                </a>

                {/* Contact 2: Krishna */}
                <a href="tel:+919404527706" className="contact-pill-item">
                  <div className="contact-pill-icon">
                    <PhoneIcon size={20} />
                  </div>
                  <div className="contact-pill-details">
                    <span className="contact-pill-label">Krishna · Phone / WhatsApp</span>
                    <span className="contact-pill-value">+91 94045 27706</span>
                  </div>
                </a>

                <a href="mailto:krishnagorde04@gmail.com" className="contact-pill-item">
                  <div className="contact-pill-icon">
                    <MailIcon size={20} />
                  </div>
                  <div className="contact-pill-details">
                    <span className="contact-pill-label">Krishna · Email</span>
                    <span className="contact-pill-value">krishnagorde04@gmail.com</span>
                  </div>
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Quick View Modal ── */}
      {viewModalOutfit && (
        <div className="view-modal-overlay" onClick={() => setViewModalOutfit(null)}>
          <div className="view-modal-card view-modal-top-images-layout" onClick={(e) => e.stopPropagation()}>
            <button className="view-modal-close" onClick={() => setViewModalOutfit(null)} aria-label="Close modal">
              <CloseIcon size={20} />
            </button>

            {/* Top: Both preview images side by side in separate divs */}
            <div className="preview-modal-images-top">
              {(viewModalOutfit.images && viewModalOutfit.images.length > 0 ? viewModalOutfit.images : [viewModalOutfit.image]).map((imgSrc, idx) => (
                <div key={idx} className="preview-modal-single-img-card">
                  <img
                    src={imgSrc}
                    alt={`${viewModalOutfit.name} view ${idx + 1}`}
                    onError={(e) => { e.currentTarget.src = viewModalOutfit.image || '/assets/outfits/p1a.png'; }}
                  />
                </div>
              ))}
            </div>

            {/* Bottom: Contact Us and Rent It buttons */}
            <div className="preview-modal-actions-row">
              <button
                type="button"
                className="btn-secondary preview-btn-contact"
                onClick={() => {
                  setViewModalOutfit(null);
                  requestTransition('contact');
                }}
              >
                <span>Contact Us</span>
              </button>

              <button
                type="button"
                className="btn-primary preview-btn-rent"
                onClick={() => {
                  const target = viewModalOutfit;
                  setViewModalOutfit(null);
                  setSelectedOutfit(target);
                }}
              >
                <span>Rent It</span>
                <ArrowRightIcon size={16} />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Rental Booking Modal ── */}
      {selectedOutfit && (
        <RentalModal
          outfit={selectedOutfit}
          onClose={() => setSelectedOutfit(null)}
          onNavigateTab={requestTransition}
        />
      )}
    </div>
  );
}
