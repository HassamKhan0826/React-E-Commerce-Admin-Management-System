import { useState } from "react";
import { Link } from "react-router-dom";
import CartItem from "../components/CartItem";
import EmptyState from "../components/EmptyState";
import Button from "../components/Button";
import { useCart } from "../hooks/useCart";
import { formatCurrency } from "../utils/helpers";

const FREE_SHIPPING_LIMIT = 50;

function Cart() {
  const {
    cart,
    totalItems,
    totalPrice,
    increaseQuantity,
    decreaseQuantity,
    removeFromCart,
    clearCart,
  } = useCart();

  const [orderPlaced, setOrderPlaced] = useState(false);

  const handleCheckout = () => {
    clearCart();
    setOrderPlaced(true);
  };

  const remainingForFreeShipping = Math.max(FREE_SHIPPING_LIMIT - totalPrice, 0);

  return (
    <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold tracking-tight text-stone-900">Shopping cart</h1>

      {orderPlaced && cart.length === 0 && (
        <div role="status" className="mt-6 rounded-lg bg-gold-50 px-4 py-3 text-sm font-medium text-gold-800">
          Order placed. Thank you for shopping with RE:STORE!
        </div>
      )}

      {cart.length === 0 ? (
        <div className="mt-8">
          <EmptyState title="Your cart is empty." message="Add a few products and they will appear here.">
            <Link
              to="/products"
              className="inline-flex rounded-lg bg-brand-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-brand-700"
            >
              Browse products
            </Link>
          </EmptyState>
        </div>
      ) : (
        <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_360px]">
          <div className="rounded-xl border border-stone-200 bg-cream-50 px-5">
            <div className="flex items-center justify-between border-b border-stone-200 py-4">
              <p className="text-sm font-semibold text-stone-700">
                {totalItems} {totalItems === 1 ? "item" : "items"}
              </p>
              <Button variant="danger" size="sm" onClick={clearCart}>
                Clear cart
              </Button>
            </div>

            {cart.map((item) => (
              <CartItem
                key={item.id}
                item={item}
                onIncrease={increaseQuantity}
                onDecrease={decreaseQuantity}
                onRemove={removeFromCart}
              />
            ))}
          </div>

          <aside className="h-fit rounded-xl border border-stone-200 bg-cream-50 p-6 lg:sticky lg:top-32">
            <h2 className="text-lg font-semibold text-stone-900">Order summary</h2>

            <dl className="mt-6 space-y-3 text-sm">
              <div className="flex justify-between">
                <dt className="text-stone-500">Total items</dt>
                <dd className="font-medium text-stone-900">{totalItems}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-stone-500">Shipping</dt>
                <dd className="font-medium text-stone-900">
                  {remainingForFreeShipping === 0 ? "Free" : "Calculated at checkout"}
                </dd>
              </div>
              <div className="flex justify-between border-t border-stone-200 pt-3 text-base">
                <dt className="font-semibold text-stone-900">Total price</dt>
                <dd className="font-bold text-stone-900">{formatCurrency(totalPrice)}</dd>
              </div>
            </dl>

            {remainingForFreeShipping > 0 && (
              <p className="mt-4 rounded-lg bg-gold-50 px-3 py-2 text-xs text-gold-800">
                Add {formatCurrency(remainingForFreeShipping)} more for free shipping.
              </p>
            )}

            <Button className="mt-6 w-full py-3" onClick={handleCheckout}>
              Proceed to checkout
            </Button>

            <Link
              to="/products"
              className="mt-3 block text-center text-sm font-medium text-stone-500 hover:text-brand-600"
            >
              Continue shopping
            </Link>
          </aside>
        </div>
      )}
    </section>
  );
}

export default Cart;