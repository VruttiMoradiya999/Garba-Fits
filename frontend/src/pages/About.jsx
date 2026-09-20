import React from 'react';
import { BrowseRentIcon, ArrowRightIcon, SparkleIcon, ShieldCheckIcon, CheckIcon, LinkedInIcon, GitHubIcon, MailIcon } from '../components/Icons';
import { Link } from 'react-router-dom';
import '../styles/style-about.css';

export default function About() {
  return (
    <div className="container about-page-container">
      {/* ── HERO BANNER: Vector Illustrated Layout (Matches Reference Design) ── */}
      <div className="about-hero-box">
        <div className="about-vector-layout">
          {/* Left Column: Heading, Bar, Story Paragraph, Button */}
          <div className="about-vector-left">
            <h1 className="about-big-heading">ABOUT US</h1>
            <div className="about-heading-bar"></div>

            <p className="about-vector-desc">
              We are 3rd year B.Tech CSE students from MIT ADT University developing <strong>GarbaFits</strong>, a platform to rent authentic designer Chaniya Cholis and festive fits for Garba, Dandiya, and cultural celebrations.
            </p>

            <p className="about-vector-subtext">
              We noticed how difficult and expensive it is to buy a brand new ₹10,000+ outfit every single year for just a few festive nights. Through GarbaFits, we make 9-meter full-flair, authentic Gamthi and real mirror-work outfits accessible, steam-sanitized, and affordable starting at just ₹700/night with fast campus delivery!
            </p>

            <Link to="/rent" className="btn-primary about-vector-btn">
              <BrowseRentIcon size={18} />
              <span>Explore Fits</span>
            </Link>
          </div>

          {/* Right Column: Organic Blob Backdrop & 2 Staggered Business Owners */}
          <div className="about-vector-right">
            {/* Organic Pink/Coral Blob */}
            <div className="about-blob-backdrop"></div>

            {/* 2 Owners Cards (Staggered Side-by-Side) */}
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

      {/* ── Key Highlights & Perks ── */}
      <div className="about-features-grid">
        <div className="about-perk-card">
          <div className="about-perk-icon-wrap">
            <SparkleIcon size={22} />
          </div>
          <h3 className="about-perk-title">Authentic Gujarati Flair</h3>
          <p className="about-perk-desc">
            Handcrafted Gamthi embroidery, real mirror work, Kutchi patches, and 9-meter full twirl flair curated specially for festive college nights.
          </p>
        </div>

        <div className="about-perk-card">
          <div className="about-perk-icon-wrap">
            <ShieldCheckIcon size={22} />
          </div>
          <h3 className="about-perk-title">Hassle-Free & Sanitized</h3>
          <p className="about-perk-desc">
            Every outfit is professionally dry-cleaned, steam-sanitized, and inspected before each rental period. Zero stress, 100% sparkle.
          </p>
        </div>

        <div className="about-perk-card">
          <div className="about-perk-icon-wrap">
            <CheckIcon size={22} />
          </div>
          <h3 className="about-perk-title">Sustainable & Affordable</h3>
          <p className="about-perk-desc">
            Rent designer styles starting from ₹700/night, share with fellow students, and eliminate festive fashion waste.
          </p>
        </div>
      </div>
    </div>
  );
}
