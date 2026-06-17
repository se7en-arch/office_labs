'use client';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';

export default function SortSelect({ currentSort }: { currentSort?: string }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  function handleChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const params = new URLSearchParams(searchParams.toString());
    params.set('sort', e.target.value);
    router.push(`${pathname}?${params.toString()}`);
  }

  return (
    <select
      className="sort-select"
      value={currentSort ?? 'newest'}
      onChange={handleChange}
    >
      <option value="newest">Най-нови</option>
      <option value="price-asc">Цена: ниска → висока</option>
      <option value="price-desc">Цена: висока → ниска</option>
    </select>
  );
}
