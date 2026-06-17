'use client';
import { useState } from 'react';
import { useCart, CartItem } from '@/lib/cart-store';
import { useTranslations } from 'next-intl';

type Props = {
  product: Omit<CartItem, 'quantity'>;
};

export default function AddToCartButton({ product }: Props) {
  const t = useTranslations('product');
  const addItem = useCart((s) => s.addItem);
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);

  function handleAdd() {
    for (let i = 0; i < qty; i++) addItem(product);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  }

  return (
    <div>
      <div className="qty-row">
        <div className="qty">
          <button
            className="qty__btn"
            onClick={() => setQty((q) => Math.max(1, q - 1))}
          >
            −
          </button>
          <span className="qty__val">{qty}</span>
          <button
            className="qty__btn"
            onClick={() => setQty((q) => q + 1)}
          >
            +
          </button>
        </div>
        <button className="btn-add-cart" onClick={handleAdd}>
          {added ? t('added') : t('addToCart')}
        </button>
      </div>
    </div>
  );
}
