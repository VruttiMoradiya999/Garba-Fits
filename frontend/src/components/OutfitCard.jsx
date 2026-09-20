import React, { useState } from 'react';
import { SparkleIcon, StarIcon, ArrowRightIcon, ChevronLeftIcon, ChevronRightIcon } from './Icons';

export default function OutfitCard({ outfit, onRentClick }) {
  const images = outfit.images && outfit.images.length > 0 ? outfit.images : [outfit.image];
  const [currentIdx, setCurrentIdx] = useState(0);

  const handlePrev = (e) => {
    e.stopPropagation();
    setCurrentIdx((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const handleNext = (e) => {
    e.stopPropagation();
    setCurrentIdx((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  return (
    <div className="outfit-card">
      <div className="card-image-wrap" style={{ position: 'relative' }}>
        <img
          src={images[currentIdx]}
          alt={`${outfit.name} - view ${currentIdx + 1}`}
          loading="lazy"
          onError={(e) => {
            e.currentTarget.src = outfit.image || '/assets/2.png';
          }}
        />
        {images.length > 1 && (
          <>
            <button
              type="button"
              className="card-arrow-btn card-arrow-prev"
              onClick={handlePrev}
              aria-label="Previous preview"
            >
              <ChevronLeftIcon size={14} />
            </button>
            <button
              type="button"
              className="card-arrow-btn card-arrow-next"
              onClick={handleNext}
              aria-label="Next preview"
            >
              <ChevronRightIcon size={14} />
            </button>
            <div className="card-dots-container">
              {images.map((_, idx) => (
                <button
                  key={idx}
                  type="button"
                  className={`card-dot ${idx === currentIdx ? 'active' : ''}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    setCurrentIdx(idx);
                  }}
                  aria-label={`View image ${idx + 1}`}
                />
              ))}
            </div>
          </>
        )}
        <span className="day-pill-badge">
          Day {outfit.navratriDay} • {outfit.colorTheme.split('&')[0]}
        </span>
        <span className="flair-pill-badge">
          {outfit.flair}
        </span>
      </div>

      <div className="card-details">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#E2A03F', fontSize: '0.82rem', fontWeight: '700' }}>
            <StarIcon size={14} />
            <span>{outfit.rating}</span>
            <span style={{ color: 'var(--color-charcoal-muted)', fontWeight: '400' }}>({outfit.reviewsCount})</span>
          </div>
          <span style={{ fontSize: '0.78rem', color: 'var(--color-rose)', fontWeight: '700' }}>
            Worth ₹{outfit.retailValue.toLocaleString()}
          </span>
        </div>

        <h3 className="card-title">{outfit.name}</h3>
        <p className="card-fabric">{outfit.fabric}</p>

        <div className="size-pills">
          <span style={{ fontSize: '0.75rem', color: 'var(--color-charcoal-muted)', marginRight: '4px', alignSelf: 'center' }}>Sizes:</span>
          {outfit.sizes.map((s) => (
            <span key={s} className="size-pill">{s}</span>
          ))}
        </div>

        <div className="card-pricing-footer">
          <div>
            <div className="price-label">Rental / 3 Days</div>
            <div className="price-amount">
              ₹{outfit.rentPrice.toLocaleString()} <span>+ ₹{outfit.deposit} dep</span>
            </div>
          </div>

          <button
            className="btn-primary"
            style={{ padding: '10px 20px', fontSize: '0.88rem' }}
            onClick={() => onRentClick(outfit)}
          >
            <span>Rent Now</span>
            <ArrowRightIcon size={14} />
          </button>
        </div>
      </div>
    </div>
  );
}
