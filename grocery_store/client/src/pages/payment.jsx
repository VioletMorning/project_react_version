import { useState, useEffect } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { api, money, LOGIN_URL } from '../api';
import { useShop } from '../ShopContext.jsx';
import OrderSummary from '../components/ordersummary.jsx';

export default function Payment() {
  const { cartId, checkoutInfo } = useShop();
  const navigate = useNavigate();

  const [method, setMethod] = useState('later');
  const [summary, setSummary] = useState(null);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const type = checkoutInfo?.type;

  useEffect(() => {
    if (!type) return;
    api(`/api/cart/${cartId}/summary?type=${type}`)
      .then(setSummary)
      .catch(err => setError(err.message));
  }, [cartId, type]);

  // Opened this page directly without going through checkout
  if (!checkoutInfo) return <Navigate to="/checkout" replace />;

  async function pay() {
    setError('');
    setBusy(true);
    try {
      const result = await api(`/api/cart/${cartId}/checkout`, 'POST', {
        fulfillmentType: checkoutInfo.type,
        deliveryAddress: checkoutInfo.address,
        pickupTime: checkoutInfo.pickupTime,
        vehicleInfo: checkoutInfo.vehicle,
        paymentMethod: method
      });
      navigate(`/receipt/${result.orderId}`, { replace: true });
    } catch (err) {
      if (err.status === 401) { window.location.href = LOGIN_URL; return; }
      setError(err.message);
      setBusy(false);
    }
  }

  const isDelivery = type === 'delivery';
  const buttonLabel = method === 'online' && summary
    ? `Pay ${money(summary.total)}`
    : 'Place Order';

  return (
    <main id="view-checkout">
      <section className="panel">
        <h2>Payment</h2>

        <h3>{isDelivery ? 'Delivery' : 'Curbside pickup'}</h3>
        <p>
          {isDelivery
            ? checkoutInfo.address
            : `${checkoutInfo.pickupTime}${checkoutInfo.vehicle ? ` \u00b7 Vehicle: ${checkoutInfo.vehicle}` : ''}`}
        </p>
        <button className="secondary" onClick={() => navigate('/checkout')}>Change</button>

        <h3>Payment method</h3>
        <label>
          <input type="radio" name="pay" checked={method === 'later'}
                 onChange={() => setMethod('later')} />
          {' '}{isDelivery ? 'Pay on delivery' : 'Pay at pickup'}
        </label>
        <label>
          <input type="radio" name="pay" checked={method === 'online'}
                 onChange={() => setMethod('online')} />
          {' '}Pay online with card (demo)
        </label>
        {method === 'online' && (
          <p className="note">
            Demo only: no card is charged and no card details are collected.
            To accept real card payments, connect a payment provider such as Stripe.
          </p>
        )}

        {error && <p className="error">{error}</p>}
        <button onClick={pay} disabled={busy || !summary || summary.items.length === 0}>
          {buttonLabel}
        </button>
        <button className="secondary" onClick={() => navigate('/checkout')}>Back</button>
      </section>

      <OrderSummary summary={summary} />
    </main>
  );
}