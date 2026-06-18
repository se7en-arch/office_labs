import Link from 'next/link';
import { prisma } from '@/lib/prisma';

const STATUS_LABELS: Record<string, string> = {
  pending: 'Нова',
  processing: 'В обработка',
  shipped: 'Изпратена',
  delivered: 'Доставена',
  cancelled: 'Отказана',
};

const STATUS_COLORS: Record<string, string> = {
  pending: '#ca8a04',
  processing: '#2563eb',
  shipped: '#7c3aed',
  delivered: '#16a34a',
  cancelled: '#dc2626',
};

export default async function OrdersPage() {
  const [orders, counts] = await Promise.all([
    prisma.order.findMany({
      orderBy: { createdAt: 'desc' },
      include: { items: true },
      take: 100,
    }),
    prisma.order.groupBy({ by: ['status'], _count: { _all: true } }),
  ]);

  const countMap: Record<string, number> = {};
  for (const c of counts) countMap[c.status] = c._count._all;

  return (
    <>
      <div className="admin-page-header">
        <div>
          <h1>Поръчки</h1>
          <p>{orders.length} поръчки общо</p>
        </div>
        <a href="/api/admin/orders/export" className="admin-action-btn admin-action-btn--secondary">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
            <polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/>
          </svg>
          Изнеси CSV
        </a>
      </div>

      {/* Status summary */}
      <div className="admin-stats" style={{ marginBottom: 24 }}>
        {Object.entries(STATUS_LABELS).map(([key, label]) => (
          <div key={key} className="admin-stat-card">
            <div className="admin-stat-card__value" style={{ color: STATUS_COLORS[key] }}>
              {countMap[key] ?? 0}
            </div>
            <div className="admin-stat-card__label">{label}</div>
          </div>
        ))}
      </div>

      <div className="admin-card">
        <div className="admin-card__body">
          {orders.length === 0 ? (
            <div className="admin-empty">Все още няма поръчки</div>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Клиент</th>
                    <th>Email</th>
                    <th>Продукти</th>
                    <th>Общо</th>
                    <th>Статус</th>
                    <th>Дата</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((o) => (
                    <tr key={o.id}>
                      <td style={{ fontWeight: 700, color: 'var(--muted)', fontSize: 13 }}>
                        #{String(o.id).padStart(4, '0')}
                      </td>
                      <td>
                        <div style={{ fontWeight: 600 }}>{o.firstName} {o.lastName}</div>
                        {o.company && <div style={{ fontSize: 12, color: 'var(--muted)' }}>{o.company}</div>}
                      </td>
                      <td style={{ fontSize: 13 }}>{o.email}</td>
                      <td style={{ fontSize: 13, color: 'var(--muted)' }}>
                        {o.items.length} бр.
                      </td>
                      <td style={{ fontWeight: 700 }}>{o.total.toFixed(2)} €</td>
                      <td>
                        <span className="admin-order-status" style={{ color: STATUS_COLORS[o.status] ?? '#999', background: `${STATUS_COLORS[o.status]}18` }}>
                          {STATUS_LABELS[o.status] ?? o.status}
                        </span>
                      </td>
                      <td style={{ fontSize: 12, color: 'var(--muted)' }}>
                        {new Date(o.createdAt).toLocaleDateString('bg-BG')}
                      </td>
                      <td>
                        <Link href={`/adminpanel/orders/${o.id}`} className="admin-row-btn admin-row-btn--view" title="Детайли">
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
                          </svg>
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
