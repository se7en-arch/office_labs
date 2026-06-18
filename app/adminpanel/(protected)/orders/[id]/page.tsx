import { notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { prisma } from '@/lib/prisma';
import OrderStatusForm from '@/components/admin/OrderStatusForm';

const STATUS_LABELS: Record<string, string> = {
  pending: 'Нова',
  processing: 'В обработка',
  shipped: 'Изпратена',
  delivered: 'Доставена',
  cancelled: 'Отказана',
};

export default async function OrderDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const order = await prisma.order.findUnique({
    where: { id: parseInt(id) },
    include: { items: true },
  });

  if (!order) notFound();

  return (
    <>
      <div className="admin-page-header">
        <div>
          <h1>Поръчка #{String(order.id).padStart(4, '0')}</h1>
          <p>{new Date(order.createdAt).toLocaleString('bg-BG')}</p>
        </div>
        <Link href="/adminpanel/orders" className="admin-cancel-btn">← Назад</Link>
      </div>

      <div className="admin-order-grid">

        {/* Left column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

          {/* Items */}
          <div className="admin-card">
            <div className="admin-card__header"><h2>Продукти</h2></div>
            <div className="admin-card__body">
              {order.items.map((item) => (
                <div key={item.id} className="admin-order-item">
                  <div className="admin-order-item__img">
                    <Image src={item.image} alt={item.name} width={48} height={48} style={{ objectFit: 'contain' }} />
                  </div>
                  <div className="admin-order-item__info">
                    <div className="admin-order-item__name">{item.name}</div>
                    <div className="admin-order-item__meta">× {item.quantity} · {item.price.toFixed(2)} €/бр.</div>
                  </div>
                  <div className="admin-order-item__total">{(item.price * item.quantity).toFixed(2)} €</div>
                </div>
              ))}
              <div className="admin-order-total">
                <span>Общо</span>
                <strong>{order.total.toFixed(2)} €</strong>
              </div>
            </div>
          </div>

          {/* Status */}
          <div className="admin-card">
            <div className="admin-card__header"><h2>Статус на поръчката</h2></div>
            <div className="admin-card__body">
              <OrderStatusForm orderId={order.id} currentStatus={order.status} statusLabels={STATUS_LABELS} />
            </div>
          </div>
        </div>

        {/* Right column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

          {/* Customer */}
          <div className="admin-card">
            <div className="admin-card__header"><h2>Клиент</h2></div>
            <div className="admin-card__body">
              <div className="admin-detail-grid">
                <span>Имена</span><span>{order.firstName} {order.lastName}</span>
                <span>Email</span><span>{order.email}</span>
                <span>Телефон</span><span>{order.phone}</span>
                {order.company && <><span>Фирма</span><span>{order.company}</span></>}
                {order.eik && <><span>ЕИК</span><span>{order.eik}</span></>}
                {order.vat && <><span>ДДС №</span><span>{order.vat}</span></>}
                {order.mol && <><span>МОЛ</span><span>{order.mol}</span></>}
              </div>
            </div>
          </div>

          {/* Delivery */}
          <div className="admin-card">
            <div className="admin-card__header"><h2>Доставка</h2></div>
            <div className="admin-card__body">
              <div className="admin-detail-grid">
                <span>Куриер</span><span>{order.carrier}</span>
                <span>Тип</span><span>{order.delivType === 'address' ? 'До адрес' : 'До офис'}</span>
                <span>Град</span><span>{order.city}</span>
                {order.address && <><span>Адрес</span><span>{order.address}</span></>}
                {order.postcode && <><span>Пощенски код</span><span>{order.postcode}</span></>}
                <span>Плащане</span><span>{order.payment === 'card' ? 'Карта' : 'Наложен платеж'}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
