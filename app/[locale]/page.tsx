import HomeSlider from '@/components/HomeSlider';
import { getTranslations } from 'next-intl/server';

export default async function HomePage() {
  const t = await getTranslations('slides');

  const SLIDES = [
    {
      title: 'Astra',
      subtitle: t('astraSubtitle'),
      bgImage: '/images/hero ASTRA.png',
      href: '/shop?series=astra',
      btnText: t('exploreBtn'),
    },
    {
      title: 'Loft',
      subtitle: t('loftSubtitle'),
      bgImage: '/images/hero LOFT.png',
      href: '/shop?series=loft',
      btnText: t('exploreBtn'),
    },
    {
      title: 'Terra',
      subtitle: t('terraSubtitle'),
      bgImage: '/images/hero TERRA.png',
      href: '/shop?series=terra',
      btnText: t('exploreBtn'),
    },
    {
      title: 'Nova',
      subtitle: t('novaSubtitle'),
      bgImage: '/images/hero NOVA.png',
      href: '/shop?series=nova',
      btnText: t('exploreBtn'),
    },
  ];

  return <HomeSlider slides={SLIDES} />;
}
