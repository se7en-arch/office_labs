import Header from '@/components/Header';
import HeroSection from '@/components/hero/HeroSection';
import CitySection from '@/components/CitySection';
import FeaturesSection from '@/components/FeaturesSection';
import Footer from '@/components/Footer';
import { CITIES } from '@/lib/data';

export default function HomePage() {
  return (
    <>
      <Header />
      <HeroSection />
      <main className="main">
        {CITIES.map(city => (
          <CitySection key={city.name} city={city} />
        ))}
      </main>
      <FeaturesSection />
      <Footer />
    </>
  );
}
