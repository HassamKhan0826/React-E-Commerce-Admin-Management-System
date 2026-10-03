import { useMemo, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import Container from "../components/Container";
import Button from "../components/Button";
import EmptyState from "../components/EmptyState";
import { useCart } from "../hooks/useCart";
import { useCustomer } from "../hooks/useCustomer";
import { getStoredValue, setStoredValue } from "../hooks/useLocalStorage";
import { initialOrders } from "../utils/mockData";
import { formatCurrency } from "../utils/helpers";

const FREE_SHIPPING_LIMIT = 50;
const SHIPPING_FEE = 4.99;

const inputClass =
  "mt-1.5 w-full rounded-lg border border-stone-300 bg-cream-50 px-3 py-2.5 text-sm text-stone-900 outline-none transition focus:border-brand-600 focus:ring-4 focus:ring-brand-600/10";

function createOrderId() {
  return `RS-${Date.now().toString().slice(-6)}`;
}

function validate(form) {
  const errors = {};

  if (form.fullName.trim().length < 2) errors.fullName = "Please enter the recipient's full name.";
  if (!/^[0-9+\-\s]{7,15}$/.test(form.phone.trim())) errors.phone = "Enter a valid phone number.";
  if (form.address.trim().length < 5) errors.address = "Please enter a full street address.";
  if (!form.city.trim()) errors.city = "City is required.";

  if (form.payment === "card") {
    if (!/^\d{16}$/.test(form.cardNumber.replace(/\s/g, ""))) errors.cardNumber = "Card number must be 16 digits.";
    if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(form.expiry)) errors.expiry = "Use the format MM/YY.";
    if (!/^\d{3}$/.test(form.cvc)) errors.cvc = "CVC must be 3 digits.";
  }

  return errors;
}

function Checkout() {
  const location = useLocation();
  const { cart, clearCart } = useCart();
  const { currentCustomer, signOut, isAccountActive } = useCustomer();

  const buyNowItem = location.state?.buyNow;
  const items = useMemo(() => (buyNowItem ? [buyNowItem] : cart), [buyNowItem, cart]);

  const [form, setForm] = useState({
    fullName: currentCustomer?.name || "",
    phone: "",
    address: "",
    city: "",
    payment: "cod",
    cardNumber: "",
    expiry: "",
    cvc: "",
  });
  const [errors, setErrors] = useState({});
  const [placedOrder, setPlacedOrder] = useState(null);

  const subtotal = useMemo(
    () => items.reduce((total, item) => total + item.price * item.quantity, 0),
    [items],
  );
  const itemCount = items.reduce((total, item) => total + item.quantity, 0);
  const shipping = subtotal >= FREE_SHIPPING_LIMIT ? 0 : SHIPPING_FEE;
  const total = subtotal + shipping;

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
    setErrors((current) => ({ ...current, [name]: "" }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    const validationErrors = validate(form);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    if (!isAccountActive(currentCustomer.email)) {
      signOut();
      return;
    }

    const order = {
      id: createOrderId(),
      customer: form.fullName.trim(),
      customerEmail: currentCustomer.email,
      products: `${itemCount} ${itemCount === 1 ? "item" : "items"}`,
      items: items.map(({ id, title, price, quantity, thumbnail }) => ({ id, title, price, quantity, thumbnail })),
      subtotal,
      shipping,
      total: Number(total.toFixed(2)),
      status: "Pending",
      date: new Date().toISOString().slice(0, 10),
      shippingAddress: {
        phone: form.phone.trim(),
        address: form.address.trim(),
        city: form.city.trim(),
      },
      payment:
        form.payment === "card"
          ? `Card ending ${form.cardNumber.replace(/\s/g, "").slice(-4)}`
          : "Cash on delivery",
    };

    const orders = getStoredValue("orders", initialOrders);
    setStoredValue("orders", [order, ...orders]);

    if (!buyNowItem) {
      clearCart();
    }

    setPlacedOrder(order);
    window.scrollTo({ top: 0 });
  };

  if (placedOrder) {
    return (
      <Container size="narrow">
        <div className="mx-auto max-w-xl rounded-2xl border border-stone-200 bg-cream-50 p-8 text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-gold-50 text-2xl text-gold-700">
            ✓
          </div>
          <h1 className="mt-4 text-2xl font-bold text-stone-900">Thank you for your order!</h1>
          <p className="mt-2 text-sm text-stone-500">
            Order <span className="font-semibold text-stone-900">#{placedOrder.id}</span> has been placed and is now pending.
          </p>

          <dl className="mt-6 space-y-2 rounded-xl bg-cream-100 p-4 text-left text-sm">
            <div className="flex justify-between">
              <dt className="text-stone-500">Items</dt>
              <dd className="font-medium text-stone-900">{placedOrder.products}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-stone-500">Payment</dt>
              <dd className="font-medium text-stone-900">{placedOrder.payment}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-stone-500">Deliver to</dt>
              <dd className="text-right font-medium text-stone-900">
                {placedOrder.shippingAddress.address}, {placedOrder.shippingAddress.city}
              </dd>
            </div>
            <div className="flex justify-between border-t border-stone-200 pt-2 text-base">
              <dt className="font-semibold text-stone-900">Total</dt>
              <dd className="font-bold text-stone-900">{formatCurrency(placedOrder.total)}</dd>
            </div>
          </dl>

          <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
            <Link
              to="/my-orders"
              className="rounded-lg bg-brand-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-brand-700"
            >
              View my orders
            </Link>
            <Link
              to="/products"
              className="rounded-lg border border-stone-300 px-5 py-2.5 text-sm font-semibold text-stone-700 hover:bg-cream-100"
            >
              Continue shopping
            </Link>
          </div>
        </div>
      </Container>
    );
  }

  if (items.length === 0) {
    return (
      <Container>
        <EmptyState title="Nothing to check out." message="Add products to your cart or use Buy now on a product.">
          <Link
            to="/products"
            className="inline-flex rounded-lg bg-brand-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-brand-700"
          >
            Browse products
          </Link>
        </EmptyState>
      </Container>
    );
  }

  return (
    <Container>
      <h1 className="text-3xl font-bold tracking-tight text-stone-900">Checkout</h1>
      <p className="mt-1 text-sm text-stone-500">Signed in as {currentCustomer.email}</p>

      <form onSubmit={handleSubmit} noValidate className="mt-8 grid gap-8 lg:grid-cols-[1fr_380px]">
        <div className="space-y-6">
          <div className="rounded-xl border border-stone-200 bg-cream-50 p-6">
            <h2 className="font-semibold text-stone-900">Shipping details</h2>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <label htmlFor="checkout-name" className="text-sm font-medium text-stone-700">Full name</label>
                <input id="checkout-name" name="fullName" value={form.fullName} onChange={handleChange} className={inputClass} autoComplete="name" />
                {errors.fullName && <p className="mt-1 text-xs text-red-600">{errors.fullName}</p>}
              </div>
              <div>
                <label htmlFor="checkout-phone" className="text-sm font-medium text-stone-700">Phone</label>
                <input id="checkout-phone" name="phone" type="tel" value={form.phone} onChange={handleChange} className={inputClass} autoComplete="tel" placeholder="0300 1234567" />
                {errors.phone && <p className="mt-1 text-xs text-red-600">{errors.phone}</p>}
              </div>
              <div>
                <label htmlFor="checkout-city" className="text-sm font-medium text-stone-700">City</label>
                <input id="checkout-city" name="city" value={form.city} onChange={handleChange} className={inputClass} autoComplete="address-level2" />
                {errors.city && <p className="mt-1 text-xs text-red-600">{errors.city}</p>}
              </div>
              <div className="sm:col-span-2">
                <label htmlFor="checkout-address" className="text-sm font-medium text-stone-700">Street address</label>
                <input id="checkout-address" name="address" value={form.address} onChange={handleChange} className={inputClass} autoComplete="street-address" />
                {errors.address && <p className="mt-1 text-xs text-red-600">{errors.address}</p>}
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-stone-200 bg-cream-50 p-6">
            <h2 className="font-semibold text-stone-900">Payment</h2>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              {[
                { value: "cod", label: "Cash on delivery", note: "Pay when your order arrives" },
                { value: "card", label: "Credit / debit card", note: "Simulated, no real payment" },
              ].map((option) => (
                <label
                  key={option.value}
                  className={`flex cursor-pointer gap-3 rounded-lg border p-4 ${
                    form.payment === option.value ? "border-brand-600 ring-2 ring-brand-600/20" : "border-stone-300"
                  }`}
                >
                  <input
                    type="radio"
                    name="payment"
                    value={option.value}
                    checked={form.payment === option.value}
                    onChange={handleChange}
                    className="mt-1 accent-brand-600"
                  />
                  <span>
                    <span className="block text-sm font-semibold text-stone-900">{option.label}</span>
                    <span className="block text-xs text-stone-500">{option.note}</span>
                  </span>
                </label>
              ))}
            </div>

            {form.payment === "card" && (
              <div className="mt-4 grid gap-4 sm:grid-cols-4">
                <div className="sm:col-span-2">
                  <label htmlFor="checkout-card" className="text-sm font-medium text-stone-700">Card number</label>
                  <input id="checkout-card" name="cardNumber" inputMode="numeric" value={form.cardNumber} onChange={handleChange} className={inputClass} placeholder="4242 4242 4242 4242" autoComplete="cc-number" />
                  {errors.cardNumber && <p className="mt-1 text-xs text-red-600">{errors.cardNumber}</p>}
                </div>
                <div>
                  <label htmlFor="checkout-expiry" className="text-sm font-medium text-stone-700">Expiry</label>
                  <input id="checkout-expiry" name="expiry" value={form.expiry} onChange={handleChange} className={inputClass} placeholder="MM/YY" autoComplete="cc-exp" />
                  {errors.expiry && <p className="mt-1 text-xs text-red-600">{errors.expiry}</p>}
                </div>
                <div>
                  <label htmlFor="checkout-cvc" className="text-sm font-medium text-stone-700">CVC</label>
                  <input id="checkout-cvc" name="cvc" inputMode="numeric" value={form.cvc} onChange={handleChange} className={inputClass} placeholder="123" autoComplete="cc-csc" />
                  {errors.cvc && <p className="mt-1 text-xs text-red-600">{errors.cvc}</p>}
                </div>
                <p className="text-xs text-stone-500 sm:col-span-4">
                  This is a demo: card details are checked for format only and never saved.
                </p>
              </div>
            )}
          </div>
        </div>

        <aside className="h-fit rounded-xl border border-stone-200 bg-cream-50 p-6 lg:sticky lg:top-32">
          <h2 className="font-semibold text-stone-900">Order summary</h2>
          <p className="mt-1 text-xs text-stone-500">{buyNowItem ? "Buy now" : "From your cart"}</p>

          <ul className="mt-4 divide-y divide-stone-200">
            {items.map((item) => (
              <li key={item.id} className="flex items-center gap-3 py-3">
                <img src={item.thumbnail} alt={item.title} className="h-14 w-14 shrink-0 rounded-lg bg-cream-200 object-contain p-1" />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-stone-900">{item.title}</p>
                  <p className="text-xs text-stone-500">Qty {item.quantity}</p>
                </div>
                <p className="text-sm font-semibold text-stone-900">{formatCurrency(item.price * item.quantity)}</p>
              </li>
            ))}
          </ul>

          <dl className="mt-4 space-y-2 border-t border-stone-200 pt-4 text-sm">
            <div className="flex justify-between">
              <dt className="text-stone-500">Subtotal</dt>
              <dd className="text-stone-900">{formatCurrency(subtotal)}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-stone-500">Shipping</dt>
              <dd className="text-stone-900">{shipping === 0 ? "Free" : formatCurrency(shipping)}</dd>
            </div>
            <div className="flex justify-between border-t border-stone-200 pt-2 text-base">
              <dt className="font-semibold text-stone-900">Total</dt>
              <dd className="font-bold text-stone-900">{formatCurrency(total)}</dd>
            </div>
          </dl>

          <Button type="submit" className="mt-6 w-full py-3">
            Place order
          </Button>
        </aside>
      </form>
    </Container>
  );
}

export default Checkout;