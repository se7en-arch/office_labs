'use client';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { useState, useEffect, useRef } from 'react';

type Series   = { id: number; name: string; slug: string };
type Category = { id: number; name: string; slug: string };

type Props = {
  series: Series[];
  categories: Category[];
};

export default function CategoryDropdown({ series, categories }: Props) {
  const router       = useRouter();
  const pathname     = usePathname();
  const searchParams = useSearchParams();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const activeCategory = searchParams.get('category') ?? '';
  const activeSeries   = searchParams.get('series')   ?? '';

  const label =
    categories.find(c => c.slug === activeCategory)?.name ??
    series.find(s => s.slug === activeSeries)?.name ??
    'Всички продукти';

  function navigate(key: string, value: string) {
    const params = new URLSearchParams(searchParams.toString());
    params.delete('page');
    if (key === 'category') { params.delete('series');   }
    if (key === 'series')   { params.delete('category'); }
    if (value) params.set(key, value); else { params.delete('category'); params.delete('series'); }
    router.push(`${pathname}?${params.toString()}`, { scroll: false });
    setOpen(false);
  }

  // Close on outside click
  useEffect(() => {
    function onClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener('mousedown', onClickOutside);
    return () => document.removeEventListener('mousedown', onClickOutside);
  }, []);

  return (
    <div className="cat-dropdown" ref={ref}>
      <button className="cat-dropdown__btn" onClick={() => setOpen(o => !o)}>
        <span>{label}</span>
        <svg
          width="14" height="14" viewBox="0 0 16 16" fill="none"
          stroke="currentColor" strokeWidth="2"
          style={{ transform: open ? 'rotate(180deg)' : 'none', transition: 'transform .2s' }}
        >
          <path d="M4 6l4 4 4-4" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      {open && (
        <div className="cat-dropdown__panel">
          {/* All */}
          <div
            className={`cat-dropdown__item${!activeCategory && !activeSeries ? ' active' : ''}`}
            onClick={() => navigate('', '')}
          >
            Всички продукти
          </div>

          {/* Categories */}
          <div className="cat-dropdown__section">Категория</div>
          {categories.map(c => (
            <div
              key={c.id}
              className={`cat-dropdown__item${activeCategory === c.slug ? ' active' : ''}`}
              onClick={() => navigate('category', c.slug)}
            >
              {c.name}
            </div>
          ))}

          {/* Series */}
          <div className="cat-dropdown__section">Колекции</div>
          {series.map(s => (
            <div
              key={s.id}
              className={`cat-dropdown__item${activeSeries === s.slug ? ' active' : ''}`}
              onClick={() => navigate('series', s.slug)}
            >
              {s.name}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
