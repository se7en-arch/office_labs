'use client';
import { useState } from 'react';
import { Link } from '@/i18n/navigation';
import Image from 'next/image';
import { useCart } from '@/lib/cart-store';
import { useTranslations } from 'next-intl';
import BuyNowPayLater from '@/components/BuyNowPayLater';

const CARRIERS = [
  { id: 'speedy', label: 'Speedy' },
  { id: 'econt',  label: 'Econt' },
  { id: 'dpd',    label: 'DPD' },
  { id: 'dhl',    label: 'DHL' },
];

export default function CheckoutPage() {
  const t = useTranslations('checkout');
  const { items, total, clear } = useCart();
  const rawTotal = total();

  const STEPS = [t('stepData'), t('stepDelivery'), t('stepPayment')];

  const [step, setStep] = useState(0);
  const [done, setDone] = useState(false);

  const [firstName, setFirstName]   = useState('');
  const [lastName, setLastName]     = useState('');
  const [phone, setPhone]           = useState('');
  const [email, setEmail]           = useState('');
  const [custType, setCustType]     = useState<'person' | 'company'>('person');
  const [company, setCompany]       = useState('');
  const [eik, setEik]               = useState('');
  const [vat, setVat]               = useState('');
  const [mol, setMol]               = useState('');

  const [carrier, setCarrier]       = useState('speedy');
  const [delivType, setDelivType]   = useState<'address' | 'office'>('address');
  const [city, setCity]             = useState('');
  const [address, setAddress]       = useState('');
  const [postcode, setPostcode]     = useState('');

  const [payment, setPayment]       = useState<'card' | 'cod'>('card');
  const [errors, setErrors]         = useState<Record<string, string>>({});

  function validate0() {
    const e: Record<string, string> = {};
    const req = t('required');
    if (!firstName.trim()) e.firstName = req;
    if (!lastName.trim())  e.lastName  = req;
    if (!phone.trim())     e.phone     = req;
    if (!email.trim())     e.email     = req;
    if (custType === 'company') {
      if (!company.trim()) e.company = req;
      if (!eik.trim())     e.eik     = req;
      if (!mol.trim())     e.mol     = req;
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  function validate1() {
    const e: Record<string, string> = {};
    const req = t('required');
    if (delivType === 'address') {
      if (!city.trim())     e.city    = req;
      if (!address.trim())  e.address = req;
      if (!postcode.trim()) e.postcode = req;
    } else {
      if (!city.trim()) e.city = req;
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  function next() {
    if (step === 0 && !validate0()) return;
    if (step === 1 && !validate1()) return;
    setStep((s) => s + 1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  async function submit() {
    try {
      await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          firstName, lastName, email, phone,
          company: company || null, eik: eik || null, vat: vat || null, mol: mol || null,
          carrier, delivType, city,
          address: delivType === 'address' ? address : null,
          postcode: delivType === 'address' ? postcode : null,
          payment,
          total: rawTotal,
          items: items.map(i => ({
            id: i.id, name: i.name, slug: i.slug,
            price: i.price, quantity: i.quantity, image: i.image,
          })),
        }),
      });
    } catch {}
    clear();
    setDone(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  const carrierLabel = CARRIERS.find(c => c.id === carrier)?.label ?? carrier;

  if (items.length === 0 && !done) {
    return (
      <div className="page-wrap">
        <div className="empty-state" style={{ paddingTop: 120 }}>
          <div className="empty-state__title">{t('cartEmpty')}</div>
          <div className="empty-state__sub">{t('cartEmptyDesc')}</div>
          <Link href="/shop" className="btn-primary">{t('toShop')}</Link>
        </div>
      </div>
    );
  }

  if (done) {
    return (
      <div className="page-wrap">
        <div className="checkout-success">
          <div className="checkout-success__icon">✓</div>
          <h1 className="checkout-success__title">{t('successTitle')}</h1>
          <p className="checkout-success__sub">
            {t('successEmail', { email })}<br />
            {t('successCall', { carrier: carrierLabel })}
          </p>
          <Link href="/shop" className="btn-primary" style={{ marginTop: 24 }}>{t('continueShopping')}</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="page-wrap">
      <nav className="breadcrumb">
        <Link href="/">{t('breadHome')}</Link>
        <span className="breadcrumb__sep">/</span>
        <Link href="/cart">{t('breadCart')}</Link>
        <span className="breadcrumb__sep">/</span>
        <span style={{ color: 'var(--text)' }}>{t('breadOrder')}</span>
      </nav>

      {/* Progress */}
      <div className="co-steps">
        {STEPS.map((s, i) => (
          <div key={s} className={`co-step${i === step ? ' active' : ''}${i < step ? ' done' : ''}`}>
            <span className="co-step__num">{i < step ? '✓' : i + 1}</span>
            <span className="co-step__label">{s}</span>
            {i < STEPS.length - 1 && <span className="co-step__line" />}
          </div>
        ))}
      </div>

      <div className="co-layout">
        {/* ── FORM ── */}
        <div className="co-form">

          {/* STEP 0 — Personal */}
          {step === 0 && (
            <div className="co-section">
              <h2 className="co-section__title">{t('personalTitle')}</h2>

              <div className="co-row">
                <div className="co-field">
                  <label className="co-label">{t('firstName')} <span>*</span></label>
                  <input className={`co-input${errors.firstName ? ' error' : ''}`} value={firstName} onChange={e => setFirstName(e.target.value)} placeholder="Иван" />
                  {errors.firstName && <span className="co-err">{errors.firstName}</span>}
                </div>
                <div className="co-field">
                  <label className="co-label">{t('lastName')} <span>*</span></label>
                  <input className={`co-input${errors.lastName ? ' error' : ''}`} value={lastName} onChange={e => setLastName(e.target.value)} placeholder="Иванов" />
                  {errors.lastName && <span className="co-err">{errors.lastName}</span>}
                </div>
              </div>

              <div className="co-row">
                <div className="co-field">
                  <label className="co-label">{t('phone')} <span>*</span></label>
                  <input className={`co-input${errors.phone ? ' error' : ''}`} value={phone} onChange={e => setPhone(e.target.value)} placeholder="+359 88 888 8888" type="tel" />
                  {errors.phone && <span className="co-err">{errors.phone}</span>}
                </div>
                <div className="co-field">
                  <label className="co-label">{t('email')} <span>*</span></label>
                  <input className={`co-input${errors.email ? ' error' : ''}`} value={email} onChange={e => setEmail(e.target.value)} placeholder="ivan@example.com" type="email" />
                  {errors.email && <span className="co-err">{errors.email}</span>}
                </div>
              </div>

              <div className="co-toggle-wrap">
                <button className={`co-toggle${custType === 'person' ? ' active' : ''}`} onClick={() => setCustType('person')}>{t('person')}</button>
                <button className={`co-toggle${custType === 'company' ? ' active' : ''}`} onClick={() => setCustType('company')}>{t('companyInvoice')}</button>
              </div>

              {custType === 'company' && (
                <div className="co-company-fields">
                  <div className="co-field">
                    <label className="co-label">{t('company')} <span>*</span></label>
                    <input className={`co-input${errors.company ? ' error' : ''}`} value={company} onChange={e => setCompany(e.target.value)} placeholder="ООД / ЕООД / АД" />
                    {errors.company && <span className="co-err">{errors.company}</span>}
                  </div>
                  <div className="co-row">
                    <div className="co-field">
                      <label className="co-label">{t('eik')} <span>*</span></label>
                      <input className={`co-input${errors.eik ? ' error' : ''}`} value={eik} onChange={e => setEik(e.target.value)} placeholder="123456789" />
                      {errors.eik && <span className="co-err">{errors.eik}</span>}
                    </div>
                    <div className="co-field">
                      <label className="co-label">{t('vat')} <small>({t('vatOptional')})</small></label>
                      <input className="co-input" value={vat} onChange={e => setVat(e.target.value)} placeholder="BG123456789" />
                    </div>
                  </div>
                  <div className="co-field">
                    <label className="co-label">{t('mol')} <span>*</span></label>
                    <input className={`co-input${errors.mol ? ' error' : ''}`} value={mol} onChange={e => setMol(e.target.value)} placeholder="Три имена на представляващия" />
                    {errors.mol && <span className="co-err">{errors.mol}</span>}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* STEP 1 — Delivery */}
          {step === 1 && (
            <div className="co-section">
              <h2 className="co-section__title">{t('deliveryTitle')}</h2>

              <div className="co-field" style={{ marginBottom: 24 }}>
                <label className="co-label">{t('courier')}</label>
                <div className="co-carriers">
                  {CARRIERS.map((c) => (
                    <button
                      key={c.id}
                      className={`co-carrier${carrier === c.id ? ' active' : ''}`}
                      onClick={() => setCarrier(c.id)}
                    >
                      <span className="co-carrier__name">{c.label}</span>
                      <span className="co-carrier__price">{t('deliveryFree')}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="co-toggle-wrap" style={{ marginBottom: 24 }}>
                <button className={`co-toggle${delivType === 'address' ? ' active' : ''}`} onClick={() => setDelivType('address')}>{t('toAddress')}</button>
                <button className={`co-toggle${delivType === 'office' ? ' active' : ''}`} onClick={() => setDelivType('office')}>{t('toOffice')}</button>
              </div>

              <div className="co-row">
                <div className="co-field">
                  <label className="co-label">{t('city')} <span>*</span></label>
                  <input className={`co-input${errors.city ? ' error' : ''}`} value={city} onChange={e => setCity(e.target.value)} placeholder="София" />
                  {errors.city && <span className="co-err">{errors.city}</span>}
                </div>
                {delivType === 'address' && (
                  <div className="co-field">
                    <label className="co-label">{t('postcode')} <span>*</span></label>
                    <input className={`co-input${errors.postcode ? ' error' : ''}`} value={postcode} onChange={e => setPostcode(e.target.value)} placeholder="1000" />
                    {errors.postcode && <span className="co-err">{errors.postcode}</span>}
                  </div>
                )}
              </div>

              {delivType === 'address' && (
                <div className="co-field">
                  <label className="co-label">{t('address')} <span>*</span></label>
                  <input className={`co-input${errors.address ? ' error' : ''}`} value={address} onChange={e => setAddress(e.target.value)} placeholder="ул. Примерна 1, ет. 2, ап. 3" />
                  {errors.address && <span className="co-err">{errors.address}</span>}
                </div>
              )}

              {delivType === 'office' && (
                <p className="co-hint">{t('officeHint', { carrier: carrierLabel })}</p>
              )}
            </div>
          )}

          {/* STEP 2 — Payment */}
          {step === 2 && (
            <div className="co-section">
              <h2 className="co-section__title">{t('paymentTitle')}</h2>
              <div className="co-payments">
                <button
                  className={`co-payment${payment === 'card' ? ' active' : ''}`}
                  onClick={() => setPayment('card')}
                >
                  <span className="co-payment__icon">💳</span>
                  <div>
                    <div className="co-payment__label">{t('cardLabel')}</div>
                    <div className="co-payment__sub">{t('cardSub')}</div>
                  </div>
                </button>
                <button
                  className={`co-payment${payment === 'cod' ? ' active' : ''}`}
                  onClick={() => setPayment('cod')}
                >
                  <span className="co-payment__icon">💵</span>
                  <div>
                    <div className="co-payment__label">{t('codLabel')}</div>
                    <div className="co-payment__sub">{t('codSub')}</div>
                  </div>
                </button>
              </div>

              <BuyNowPayLater price={rawTotal} />

              {payment === 'card' && (
                <div className="co-card-info">
                  <p>{t('cardHint')}</p>
                </div>
              )}
              {payment === 'cod' && (
                <div className="co-card-info">
                  <p>{t('codHint')}</p>
                </div>
              )}

              <div className="co-review">
                <h3 className="co-review__title">{t('reviewTitle')}</h3>
                <div className="co-review__row"><span>{t('reviewClient')}</span><span>{firstName} {lastName}</span></div>
                <div className="co-review__row"><span>{t('reviewPhone')}</span><span>{phone}</span></div>
                <div className="co-review__row"><span>{t('reviewEmail')}</span><span>{email}</span></div>
                {custType === 'company' && (
                  <>
                    <div className="co-review__row"><span>{t('reviewCompany')}</span><span>{company}</span></div>
                    <div className="co-review__row"><span>{t('reviewEik')}</span><span>{eik}</span></div>
                    {vat && <div className="co-review__row"><span>{t('reviewVat')}</span><span>{vat}</span></div>}
                  </>
                )}
                <div className="co-review__row"><span>{t('reviewCourier')}</span><span>{carrierLabel}</span></div>
                <div className="co-review__row">
                  <span>{t('reviewDelivery')}</span>
                  <span>{delivType === 'address' ? `${city}, ${address}` : t('toOfficeCity', { city })}</span>
                </div>
              </div>
            </div>
          )}

          {/* Navigation */}
          <div className="co-nav">
            {step > 0 && (
              <button className="co-nav__back" onClick={() => setStep(s => s - 1)}>{t('back')}</button>
            )}
            {step < 2 ? (
              <button className="co-nav__next" onClick={next}>{t('next')}</button>
            ) : (
              <button className="co-nav__submit" onClick={submit}>
                {payment === 'card' ? t('confirmPay') : t('confirmOrder')}
              </button>
            )}
          </div>
        </div>

        {/* ── ORDER SUMMARY ── */}
        <div className="co-summary" style={{ display: 'none' }}>
          <div className="co-summary__title">{t('summaryTitle')}</div>
          {items.map((item) => (
            <div key={item.id} className="co-summary__item">
              <div className="co-summary__img">
                <Image src={item.image} alt={item.name} width={52} height={52} style={{ objectFit: 'contain', padding: 4 }} />
              </div>
              <div className="co-summary__info">
                <span className="co-summary__name">{item.name}</span>
                <span className="co-summary__qty">× {item.quantity}</span>
              </div>
              <span className="co-summary__price">{(item.price * item.quantity).toFixed(2)} €</span>
            </div>
          ))}
          <div className="co-summary__divider" />
          <div className="co-summary__row">
            <span>{t('summaryDelivery')}</span><span>{t('summaryDeliveryFree')}</span>
          </div>
          <div className="co-summary__row co-summary__row--total">
            <span>{t('summaryTotal')}</span><strong>{rawTotal.toFixed(2)} €</strong>
          </div>
          {step < 2 && <BuyNowPayLater key={step} price={rawTotal} />}
        </div>
      </div>
    </div>
  );
}
