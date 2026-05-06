'use client';

import { useEffect, useRef, useState } from 'react';
import { fmtPrice } from '@/lib/utils';
import MobileSheet from './MobileSheet';
import { useIsMobile } from '@/hooks/useIsMobile';

export default function PriceDropdown() {
  const [open, setOpen] = useState(false);
  const [minVal, setMinVal] = useState('');
  const [maxVal, setMaxVal] = useState('');
  const [displayText, setDisplayText] = useState('');
  const wrapRef = useRef<HTMLDivElement>(null);
  const isMobile = useIsMobile();

  useEffect(() => {
    function handleOutside(e: MouseEvent) {
      if (!wrapRef.current?.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener('click', handleOutside);
    return () => document.removeEventListener('click', handleOutside);
  }, []);

  function apply() {
    const min = parseInt(minVal) || 0;
    const max = parseInt(maxVal) || 0;
    setDisplayText(
      !minVal && !maxVal ? '' :
      minVal && !maxVal  ? `От ${fmtPrice(min)} лв` :
      !minVal && maxVal  ? `До ${fmtPrice(max)} лв` :
      `${fmtPrice(min)} — ${fmtPrice(max)} лв`,
    );
    setOpen(false);
  }

  const priceInputs = (
    <>
      <div className="price-inputs" style={{ marginBottom: 12 }}>
        <input type="number" placeholder="От" min={0} step={5000} value={minVal} onChange={e => setMinVal(e.target.value)} style={{ fontSize: 16 }} />
        <span>—</span>
        <input type="number" placeholder="До" min={0} step={5000} value={maxVal} onChange={e => setMaxVal(e.target.value)} style={{ fontSize: 16 }} />
      </div>
      <button className="price-dd__apply" onClick={apply}>Приложи</button>
    </>
  );

  return (
    <div className="price-dd-wrap" ref={wrapRef}>
      <div className="srch__f">
        <input
          type="text"
          placeholder="За колко?"
          readOnly
          value={displayText}
          onClick={() => setOpen(prev => !prev)}
        />
      </div>

      {/* Desktop dropdown */}
      {!isMobile && (
        <div className={`price-dd${open ? ' open' : ''}`}>
          <div className="price-dd__title">Цена (лв)</div>
          {priceInputs}
        </div>
      )}

      {/* Mobile full-screen sheet */}
      <MobileSheet open={isMobile && open} title="Цена (лв)" onClose={() => setOpen(false)}>
        <div style={{ padding: '20px 20px 0' }}>
          {priceInputs}
        </div>
      </MobileSheet>
    </div>
  );
}
