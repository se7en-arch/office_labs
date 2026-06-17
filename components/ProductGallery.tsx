'use client';
import Image from 'next/image';
import { useState, useEffect, useRef } from 'react';

const SLIDE_COUNT = 4;
const AUTO_MS = 3000;
const SWIPE_MIN = 40;

export default function ProductGallery({ image, productName }: { image: string; productName: string }) {
  const [current, setCurrent] = useState(0);
  const [paused, setPaused] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const touchStartX = useRef<number | null>(null);

  // Auto-scroll
  useEffect(() => {
    if (paused) return;
    const id = setInterval(() => setCurrent(c => (c + 1) % SLIDE_COUNT), AUTO_MS);
    return () => clearInterval(id);
  }, [paused]);

  // Native touch listeners so we can use passive:false on touchmove
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const onStart = (e: TouchEvent) => {
      touchStartX.current = e.touches[0].clientX;
      setPaused(true);
    };

    const onMove = (e: TouchEvent) => {
      if (touchStartX.current === null) return;
      const dx = Math.abs(touchStartX.current - e.touches[0].clientX);
      if (dx > 8) e.preventDefault(); // block page scroll only on horizontal swipe
    };

    const onEnd = (e: TouchEvent) => {
      if (touchStartX.current === null) return;
      const delta = touchStartX.current - e.changedTouches[0].clientX;
      if (delta > SWIPE_MIN) setCurrent(c => (c + 1) % SLIDE_COUNT);
      else if (delta < -SWIPE_MIN) setCurrent(c => (c - 1 + SLIDE_COUNT) % SLIDE_COUNT);
      touchStartX.current = null;
      setPaused(false);
    };

    el.addEventListener('touchstart', onStart, { passive: true });
    el.addEventListener('touchmove', onMove, { passive: false });
    el.addEventListener('touchend', onEnd, { passive: true });
    return () => {
      el.removeEventListener('touchstart', onStart);
      el.removeEventListener('touchmove', onMove);
      el.removeEventListener('touchend', onEnd);
    };
  }, []);

  function prev() { setCurrent(c => (c - 1 + SLIDE_COUNT) % SLIDE_COUNT); setPaused(true); }
  function next() { setCurrent(c => (c + 1) % SLIDE_COUNT); setPaused(true); }

  return (
    <div
      ref={containerRef}
      className="gallery"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div
        className="gallery__track"
        style={{ transform: `translateX(-${current * 100}%)` }}
      >
        {Array.from({ length: SLIDE_COUNT }, (_, i) => (
          <div key={i} className="gallery__slide">
            <Image
              src={image}
              alt={`${productName} — снимка ${i + 1}`}
              fill
              style={{ objectFit: 'contain', padding: '24px' }}
              sizes="(max-width: 900px) 100vw, 50vw"
              priority={i === 0}
            />
            <span className="gallery__num">{i + 1} / {SLIDE_COUNT}</span>
          </div>
        ))}
      </div>

      <button className="gallery__arrow gallery__arrow--prev" onClick={prev} aria-label="Предишна снимка">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M15 18l-6-6 6-6" />
        </svg>
      </button>
      <button className="gallery__arrow gallery__arrow--next" onClick={next} aria-label="Следваща снимка">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M9 18l6-6-6-6" />
        </svg>
      </button>

      <div className="gallery__dots">
        {Array.from({ length: SLIDE_COUNT }, (_, i) => (
          <button
            key={i}
            className={`gallery__dot${i === current ? ' active' : ''}`}
            onClick={() => { setCurrent(i); setPaused(true); }}
            aria-label={`Снимка ${i + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
