import type { Metadata } from 'next';
import Header from '@/components/Header';
import SearchPage from '@/components/search/SearchPage';
import FeaturesSection from '@/components/FeaturesSection';
import Footer from '@/components/Footer';

export const metadata: Metadata = {
  title: 'Търсене на имоти – FairSpace',
};

export default function SearchRoute() {
  return (
    <>
      <Header />
      <SearchPage />
      <FeaturesSection />
      <Footer />
    </>
  );
}
