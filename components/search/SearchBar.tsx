import Link from 'next/link';
import CityDropdown from './CityDropdown';
import TypeDropdown from './TypeDropdown';
import PriceDropdown from './PriceDropdown';
import { SearchIcon } from '@/components/icons';

interface Props {
  className?: string;
}

export default function SearchBar({ className = '' }: Props) {
  return (
    <div className={`srch ${className}`.trim()}>
      <CityDropdown />
      <TypeDropdown />
      <PriceDropdown />
      <Link href="/search" className="srch__go" aria-label="Търси">
        <SearchIcon />
      </Link>
    </div>
  );
}
