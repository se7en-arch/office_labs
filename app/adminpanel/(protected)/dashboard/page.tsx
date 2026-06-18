import Link from 'next/link';
import Image from 'next/image';
import { prisma } from '@/lib/prisma';

const ORDER_STATUS_LABELS: Record<string, string> = {
  pending: 'Нови',
  processing: 'В обработка',
  shipped: 'Изпратени',
  delivered: 'Доставени',
  cancelled: 'Отказани',
};

export default async function DashboardPage() {
  const [
    totalProducts,
    activeProducts,
    archivedProducts,
    lowStock,
    outOfStock,
    featuredProducts,
    saleProducts,
    totalCategories,
    totalSeries,
    totalOrders,
    pendingOrders,
    seriesWithCounts,
    recentProducts,
  ] = await Promise.all([
    prisma.product.count(),
    prisma.product.count({ where: { archived: false } }),
    prisma.product.count({ where: { archived: true } }),
    prisma.product.count({ where: { stock: { lte: 3, gt: 0 }, archived: false } }),
    prisma.product.count({ where: { stock: 0, archived: false } }),
    prisma.product.count({ where: { featured: true, archived: false } }),
    prisma.product.count({ where: { originalPrice: { not: null }, archived: false } }),
    prisma.category.count(),
    prisma.series.count(),
    prisma.order.count(),
    prisma.order.count({ where: { status: 'pending' } }),
    prisma.series.findMany({
      include: { _count: { select: { products: true } } },
      orderBy: { name: 'asc' },
    }),
    prisma.product.findMany({
      orderBy: { createdAt: 'desc' },
      take: 5,
      include: { series: { select: { name: true } }, category: { select: { name: true } } },
    }),
  ]);

  return (
    <>
      <div className="admin-page-header">
        <h1>Dashboard</h1>
        <p>Преглед на магазина</p>
      </div>

      {/* Main stats */}
      <div className="admin-stats">
        <div className="admin-stat-card">
          <div className="admin-stat-card__icon admin-stat-card__icon--blue">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/></svg>
          </div>
          <div className="admin-stat-card__value">{activeProducts}</div>
          <div className="admin-stat-card__label">Активни продукти</div>
          {archivedProducts > 0 && <div className="admin-stat-card__sub">{archivedProducts} архивирани</div>}
        </div>

        <div className="admin-stat-card">
          <div className="admin-stat-card__icon admin-stat-card__icon--orange">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>
          </div>
          <div className="admin-stat-card__value">{totalOrders}</div>
          <div className="admin-stat-card__label">Поръчки общо</div>
          {pendingOrders > 0 && <div className="admin-stat-card__sub" style={{ color: 'var(--warning)' }}>{pendingOrders} нови</div>}
        </div>

        <div className="admin-stat-card">
          <div className="admin-stat-card__icon admin-stat-card__icon--purple">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>
          </div>
          <div className="admin-stat-card__value">{totalCategories}</div>
          <div className="admin-stat-card__label">Категории</div>
          <div className="admin-stat-card__sub">{totalSeries} серии</div>
        </div>

        <div className="admin-stat-card">
          <div className="admin-stat-card__icon admin-stat-card__icon--green">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
          </div>
          <div className="admin-stat-card__value">{featuredProducts}</div>
          <div className="admin-stat-card__label">Препоръчани</div>
          <div className="admin-stat-card__sub">{saleProducts} на промоция</div>
        </div>

        <div className="admin-stat-card">
          <div className="admin-stat-card__icon admin-stat-card__icon--yellow">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
          </div>
          <div className="admin-stat-card__value">{lowStock}</div>
          <div className="admin-stat-card__label">Ниска наличност</div>
        </div>

        <div className="admin-stat-card">
          <div className="admin-stat-card__icon admin-stat-card__icon--red">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>
          </div>
          <div className="admin-stat-card__value">{outOfStock}</div>
          <div className="admin-stat-card__label">Изчерпани</div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 20 }}>

        {/* Series overview */}
        <div className="admin-card">
          <div className="admin-card__header">
            <h2>Серии</h2>
            <Link href="/adminpanel/series" className="admin-card__link">Управление →</Link>
          </div>
          <div className="admin-series-grid">
            {seriesWithCounts.map((s) => (
              <div key={s.id} className="admin-series-card">
                <div className="admin-series-card__dot" style={{ background: s.color }} />
                <div className="admin-series-card__name">{s.name}</div>
                <div className="admin-series-card__count">{s._count.products} продукта</div>
              </div>
            ))}
          </div>
        </div>

        {/* Recently added */}
        <div className="admin-card">
          <div className="admin-card__header">
            <h2>Последно добавени</h2>
            <Link href="/adminpanel/products" className="admin-card__link">Всички →</Link>
          </div>
          <div className="admin-card__body" style={{ padding: 0 }}>
            {recentProducts.map(p => (
              <div key={p.id} className="admin-recent-item">
                <div className="admin-recent-item__img">
                  <Image src={p.image} alt={p.name} width={36} height={36} style={{ objectFit: 'contain' }} />
                </div>
                <div className="admin-recent-item__info">
                  <div className="admin-recent-item__name">{p.name}</div>
                  <div className="admin-recent-item__meta">{p.series.name} · {p.category.name}</div>
                </div>
                <div className="admin-recent-item__price">{p.price} €</div>
                <Link href={`/adminpanel/products/${p.id}/edit`} className="admin-row-btn admin-row-btn--view" title="Редактирай">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick links */}
      <div className="admin-quicklinks">
        <Link href="/adminpanel/products/new" className="admin-quicklink">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
          Нов продукт
        </Link>
        <Link href="/adminpanel/orders" className="admin-quicklink">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>
          Поръчки {pendingOrders > 0 && <span className="admin-quicklink__badge">{pendingOrders}</span>}
        </Link>
        <Link href="/adminpanel/series" className="admin-quicklink">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="2"/><path d="M16.24 7.76a6 6 0 0 1 0 8.49m-8.48-.01a6 6 0 0 1 0-8.49m11.31-2.82a10 10 0 0 1 0 14.14m-14.14 0a10 10 0 0 1 0-14.14"/></svg>
          Серии
        </Link>
        <Link href="/adminpanel/media" className="admin-quicklink">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
          Медии
        </Link>
        <Link href="/adminpanel/settings" className="admin-quicklink">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>
          Настройки
        </Link>
      </div>
    </>
  );
}
