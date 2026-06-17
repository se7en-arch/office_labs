'use client';
import { useState } from 'react';

type Props = {
  description: string | null;
  seriesName: string;
  categoryName: string;
};

const REVIEWS = [
  {
    name: 'Мария Иванова',
    company: null,
    date: '14.03.2025, 10:22',
    rating: 5,
    text: 'Много съм доволна от покупката! Качеството е отлично, монтажът беше лесен и бърз. Мебелите изглеждат точно като на снимките. Горещо препоръчвам!',
  },
  {
    name: 'Технолинк ООД',
    company: 'Технолинк ООД',
    date: '02.02.2025, 14:45',
    rating: 5,
    text: 'Оборудвахме целия офис с тези мебели. Изключително качество за цената, прецизна изработка и бърза доставка. Определено ще се върнем за следващата поръчка.',
  },
];

function Stars({ rating }: { rating: number }) {
  return (
    <div className="ptabs__stars">
      {Array.from({ length: 5 }, (_, i) => (
        <svg
          key={i}
          width="14" height="14" viewBox="0 0 16 16"
          fill={i < rating ? '#252525' : 'none'}
          stroke={i < rating ? '#252525' : '#ccc'}
          strokeWidth="1.5"
        >
          <path d="M8 1.5l1.8 3.6 4 .6-2.9 2.8.7 4-3.6-1.9-3.6 1.9.7-4L2.2 5.7l4-.6z" />
        </svg>
      ))}
    </div>
  );
}

export default function ProductTabs({ description, seriesName, categoryName }: Props) {
  const [tab, setTab] = useState(0);

  const tabs = [
    { label: 'Описание' },
    { label: 'Ревюта', badge: REVIEWS.length },
    { label: 'Доставка и връщане' },
  ];

  return (
    <div className="ptabs">
      {/* Nav */}
      <nav className="ptabs__nav">
        {tabs.map((t, i) => (
          <button
            key={i}
            className={`ptabs__tab${tab === i ? ' active' : ''}`}
            onClick={() => setTab(i)}
          >
            {t.label}
            {t.badge != null && <span className="ptabs__badge">{t.badge}</span>}
          </button>
        ))}
      </nav>

      {/* Описание */}
      {tab === 0 && (
        <div className="ptabs__body">
          {description && <p className="ptabs__intro">{description}</p>}
          <table className="ptabs__specs-table">
            <tbody>
              <tr>
                <th>Серия</th>
                <td>{seriesName}</td>
              </tr>
              <tr>
                <th>Категория</th>
                <td>{categoryName}</td>
              </tr>
              <tr>
                <th>Размери</th>
                <td>120 × 60 × 75 cm</td>
              </tr>
              <tr>
                <th>Тегло</th>
                <td>18 kg</td>
              </tr>
              <tr>
                <th>Цветове</th>
                <td>Черно, Бяло, Дъб натурал</td>
              </tr>
              <tr>
                <th>Материал</th>
                <td>MDF, метал</td>
              </tr>
            </tbody>
          </table>
        </div>
      )}

      {/* Ревюта */}
      {tab === 1 && (
        <div className="ptabs__body">
          <div className="ptabs__reviews">
            {REVIEWS.map((r, i) => (
              <div key={i} className="ptabs__review">
                <div className="ptabs__review-avatar">
                  {r.name.charAt(0)}
                </div>
                <div className="ptabs__review-content">
                  <Stars rating={r.rating} />
                  <div className="ptabs__review-name">{r.name}</div>
                  <div className="ptabs__review-date">{r.date}</div>
                  <p className="ptabs__review-text">{r.text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Доставка и връщане */}
      {tab === 2 && (
        <div className="ptabs__body ptabs__shipping">
          <div className="ptabs__shipping-col">
            <h3 className="ptabs__shipping-heading">Доставка</h3>
            <p>Предлагаме доставка на следващия работен ден за поръчки, направени преди 14:00 ч. от понеделник до петък. Поръчки след това ще бъдат доставени в рамките на два работни дни. Събота, неделя и официални празници се изключват.</p>
            <table className="ptabs__delivery-table">
              <tbody>
                <tr><th>Дестинация</th><th>Срок</th><th>Цена</th></tr>
                <tr><td>София</td><td>1 – 2 дни</td><td>Безплатно</td></tr>
                <tr><td>Страната</td><td>2 – 4 дни</td><td>Безплатно</td></tr>
                <tr><td>ЕС</td><td>3 – 7 дни</td><td>По договаряне</td></tr>
              </tbody>
            </table>
          </div>
          <div className="ptabs__shipping-col">
            <h3 className="ptabs__shipping-heading">Връщане</h3>
            <p>Приемаме връщания до 14 дни от получаването на стоката при непокътнат вид. Задължително ни уведомете на имейл преди да изпратите продукта обратно.</p>
            <p>Основания за връщане:</p>
            <ul className="ptabs__return-list">
              <li>Получена грешна стока</li>
              <li>Стоката не отговаря на описанието</li>
              <li>Повредена опаковка или дефект</li>
            </ul>
            <p>Продуктът трябва да е в оригиналната опаковка, добре защитен за транспорт.</p>
          </div>
        </div>
      )}
    </div>
  );
}
