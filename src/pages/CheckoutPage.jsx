// src/pages/CheckoutPage.jsx
// Checkout form — submits an order via useMutation (TanStack Query)
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CreditCard, MapPin, User, CheckCircle, Loader } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useOrders } from '../context/OrdersContext';
import { useOrderMutation } from '../hooks/useOrderMutation';
import toast from 'react-hot-toast';
import styles from './CheckoutPage.module.css';

// UI state only — form fields live here, not in the query cache
const initialForm = {
  firstName: '',
  lastName: '',
  email: '',
  address: '',
  city: '',
  zip: '',
  cardNumber: '',
  expiry: '',
  cvv: '',
};

export default function CheckoutPage() {
  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState({});
  const { items, subtotal, clearCart } = useCart();
  const { addOrder } = useOrders();
  const navigate = useNavigate();

  // TanStack Query mutation — server state interaction
  const { mutate: placeOrder, isPending } = useOrderMutation();

  const shipping = subtotal >= 50 ? 0 : 5;
  const tax = subtotal * 0.08;
  const total = subtotal + shipping + tax;

  const validate = () => {
    const e = {};
    if (!form.firstName.trim()) e.firstName = 'Required';
    if (!form.lastName.trim()) e.lastName = 'Required';
    if (!form.email.trim() || !/\S+@\S+\.\S+/.test(form.email)) e.email = 'Valid email required';
    if (!form.address.trim()) e.address = 'Required';
    if (!form.city.trim()) e.city = 'Required';
    if (!form.zip.trim()) e.zip = 'Required';
    if (!form.cardNumber.trim() || form.cardNumber.replace(/\s/g, '').length < 16)
      e.cardNumber = '16-digit card number required';
    if (!form.expiry.trim()) e.expiry = 'Required';
    if (!form.cvv.trim() || form.cvv.length < 3) e.cvv = '3-digit CVV required';
    return e;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      toast.error('Please fix the errors in the form');
      return;
    }

    const orderPayload = {
      userId: 1,
      date: new Date().toISOString(),
      products: items.map((item) => ({ productId: item.id, quantity: item.quantity })),
    };

    placeOrder(orderPayload, {
      onSuccess: (data) => {
        // Save order locally for order-history page
        addOrder({
          id: data.id || Date.now(),
          date: new Date().toISOString(),
          items: [...items],
          total,
          status: 'Confirmed',
          customer: `${form.firstName} ${form.lastName}`,
        });
        clearCart();
        toast.success('Order placed successfully! 🎉');
        navigate('/order-confirmation', { state: { orderId: data.id || Date.now() } });
      },
      onError: (err) => {
        toast.error(err.userMessage || 'Checkout failed, please try again.');
      },
    });
  };

  const Field = ({ label, name, type = 'text', placeholder, half }) => (
    <div className={`${styles.field} ${half ? styles.half : ''}`}>
      <label className={styles.label} htmlFor={`checkout-${name}`}>{label}</label>
      <input
        id={`checkout-${name}`}
        type={type}
        name={name}
        value={form[name]}
        onChange={handleChange}
        placeholder={placeholder}
        className={`${styles.input} ${errors[name] ? styles.inputError : ''}`}
        aria-invalid={!!errors[name]}
        aria-describedby={errors[name] ? `${name}-err` : undefined}
      />
      {errors[name] && (
        <span id={`${name}-err`} className={styles.error}>{errors[name]}</span>
      )}
    </div>
  );

  if (items.length === 0) {
    navigate('/cart');
    return null;
  }

  return (
    <div className={styles.page}>
      <div className="container">
        <h1 className={styles.title}>Checkout</h1>

        <form onSubmit={handleSubmit} noValidate className={styles.layout}>
          {/* ── Left: form ──────────────────────────── */}
          <div className={styles.formSections}>
            {/* Contact */}
            <div className={styles.section}>
              <div className={styles.sectionTitle}>
                <User size={20} />
                Contact Information
              </div>
              <div className={styles.grid}>
                <Field label="First Name" name="firstName" placeholder="Claire" half />
                <Field label="Last Name" name="lastName" placeholder="Niyigena" half />
                <Field label="Email Address" name="email" type="email" placeholder="claire@example.com" />
              </div>
            </div>

            {/* Shipping */}
            <div className={styles.section}>
              <div className={styles.sectionTitle}>
                <MapPin size={20} />
                Shipping Address
              </div>
              <div className={styles.grid}>
                <Field label="Street Address" name="address" placeholder="123 Main St" />
                <Field label="City" name="city" placeholder="Kigali" half />
                <Field label="ZIP Code" name="zip" placeholder="00100" half />
              </div>
            </div>

            {/* Payment */}
            <div className={styles.section}>
              <div className={styles.sectionTitle}>
                <CreditCard size={20} />
                Payment Details
              </div>
              <div className={styles.grid}>
                <Field label="Card Number" name="cardNumber" placeholder="1234 5678 9012 3456" />
                <Field label="Expiry Date" name="expiry" placeholder="MM/YY" half />
                <Field label="CVV" name="cvv" placeholder="123" half />
              </div>
            </div>
          </div>

          {/* ── Right: summary ──────────────────────── */}
          <div className={styles.summary}>
            <h2 className={styles.summaryTitle}>Order Summary</h2>
            <div className={styles.itemsList}>
              {items.map((item) => (
                <div key={item.id} className={styles.orderItem}>
                  <img src={item.image} alt={item.title} className={styles.thumb} />
                  <div className={styles.orderItemInfo}>
                    <p className={styles.orderItemName}>
                      {item.title.slice(0, 40)}{item.title.length > 40 ? '…' : ''}
                    </p>
                    <p className={styles.orderItemMeta}>Qty: {item.quantity}</p>
                  </div>
                  <p className={styles.orderItemPrice}>
                    ${(item.price * item.quantity).toFixed(2)}
                  </p>
                </div>
              ))}
            </div>

            <div className={styles.totals}>
              <div className={styles.row}><span>Subtotal</span><span>${subtotal.toFixed(2)}</span></div>
              <div className={styles.row}>
                <span>Shipping</span>
                <span style={{ color: shipping === 0 ? 'var(--color-success)' : 'inherit' }}>
                  {shipping === 0 ? 'Free' : `$${shipping.toFixed(2)}`}
                </span>
              </div>
              <div className={styles.row}><span>Tax (8%)</span><span>${tax.toFixed(2)}</span></div>
            </div>
            <div className={styles.total}>
              <span>Total</span>
              <span>${total.toFixed(2)}</span>
            </div>

            <button
              id="place-order-btn"
              type="submit"
              className={styles.placeBtn}
              disabled={isPending}
            >
              {isPending ? (
                <>
                  <Loader size={18} className={styles.spin} /> Processing…
                </>
              ) : (
                <>
                  <CheckCircle size={18} /> Place Order
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
