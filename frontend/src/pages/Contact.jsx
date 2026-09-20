import React from 'react';
import { PhoneIcon, MailIcon } from '../components/Icons';
import '../styles/style-contact.css';

export default function Contact() {
  return (
    <div className="container contact-page-container">
      <div className="contact-dark-card">
        <div className="contact-split-grid">
          {/* Left Column: Retro Telephone Illustration with 'HELLO!' */}
          <div className="contact-phone-col">
            <div className="contact-phone-frame">
              <img
                src="/assets/contact-phone.jpg"
                alt="Retro Hello Phone"
              />
            </div>
          </div>

          {/* Right Column: 'GET IN TOUCH!' with Our Phone & Email Pills */}
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
    </div>
  );
}
