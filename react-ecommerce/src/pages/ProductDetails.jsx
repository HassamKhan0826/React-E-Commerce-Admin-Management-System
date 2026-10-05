import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useFetch } from "../hooks/useFetch";
import { useLocalStorage } from "../hooks/useLocalStorage";
import { useCart } from "../hooks/useCart";
import { useBuyNow } from "../hooks/useBuyNow";
import Loading from "../components/Loading";
import ErrorMessage from "../components/ErrorMessage";
import Button from "../components/Button";
import QuantityControl from "../components/QuantityControl";
import { formatCurrency, getOriginalPrice } from "../utils/helpers";

function BackLink() {
  return (
    <Link
      to="/products"
      className="inline-flex items-center gap-1 text-sm font-medium text-stone-500 hover:text-brand-600"
    >
      ← Back to products
    </Link>
  );
}

function ProductDetails() {
  const { id } = useParams();
  const [savedProducts] = useLocalStorage("managedProducts", null);
  const { data, loading, error, refetch } = useFetch(
    savedProducts ? null : `https://dummyjson.com/products/${id}`,
  );
  const { cart, addToCart, increaseQuantity, decreaseQuantity } = useCart();
  const buyNow = useBuyNow();
  const [selectedIndex, setSelectedIndex] = useState(0);

  const product = savedProducts
    ? savedProducts.find((item) => String(item.id) === id)
    : data;

  if (loading) {
    return (
      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <Loading text="Loading product..." />
      </section>
    );
  }

  if (error || !product) {
    return (
      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <BackLink />
        <div className="mt-6">
          <ErrorMessage
            message="We couldn't load this product. It may not exist."
            onRetry={savedProducts ? undefined : refetch}
          />
        </div>
      </section>
    );
  }

  const quantity = cart.find((item) => item.id === product.id)?.quantity || 0;
  const images = product.images?.length ? product.images : [product.thumbnail];
  const mainImage = images[selectedIndex] ?? images[0];
  const discount = Math.round(product.discountPercentage || 0);
  const inStock = product.stock > 0;
  const rating = Number(product.rating || 0);

  return (
    <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <BackLink />

      <div className="mt-6 grid gap-10 lg:grid-cols-2">
        <div>
          <div className="flex aspect-square items-center justify-center rounded-2xl border border-stone-200 bg-cream-50">
            <img src={mainImage} alt={product.title} className="h-full w-full object-contain p-10" />
          </div>

          {images.length > 1 && (
            <div className="mt-4 grid grid-cols-4 gap-3">
              {images.map((image, index) => (
                <button
                  key={image}
                  type="button"
                  onClick={() => setSelectedIndex(index)}
                  aria-label={`Show image ${index + 1}`}
                  className={`aspect-square rounded-lg border bg-cream-50 p-2 transition ${
                    index === selectedIndex
                      ? "border-brand-600 ring-2 ring-brand-600/20"
                      : "border-stone-200 hover:border-stone-400"
                  }`}
                >
                  <img src={image} alt="" className="h-full w-full object-contain" />
                </button>
              ))}
            </div>
          )}
        </div>

        <div>
          <div className="flex flex-wrap items-center gap-2">
            <span className="rounded-full bg-cream-200 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-stone-600">
              {product.category.replace(/-/g, " ")}
            </span>
            {product.brand && (
              <span className="text-sm text-stone-500">
                by <span className="font-semibold text-stone-700">{product.brand}</span>
              </span>
            )}
          </div>

          <h1 className="mt-4 text-3xl font-bold tracking-tight text-stone-900 sm:text-4xl">{product.title}</h1>

          {rating > 0 && (
            <p className="mt-3 text-sm font-semibold text-gold-500">
              ★ <span className="text-stone-700">{rating.toFixed(1)} out of 5</span>
            </p>
          )}

          <div className="mt-6 flex flex-wrap items-baseline gap-3">
            <span className="text-4xl font-bold text-stone-900">{formatCurrency(product.price)}</span>
            {discount > 0 && (
              <>
                <span className="text-lg text-stone-400 line-through">
                  {formatCurrency(getOriginalPrice(product.price, product.discountPercentage))}
                </span>
                <span className="rounded-full bg-brand-50 px-2.5 py-1 text-sm font-semibold text-brand-600">
                  {discount}% off
                </span>
              </>
            )}
          </div>

          {product.description && <p className="mt-6 leading-7 text-stone-600">{product.description}</p>}

          <p className={`mt-6 text-sm font-semibold ${inStock ? "text-brand-600" : "text-red-600"}`}>
            {inStock ? `In stock — ${product.stock} available` : "Out of stock"}
          </p>

          <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center">
            <Button className="py-3 sm:px-10" onClick={() => buyNow(product)} disabled={!inStock}>
              Buy now
            </Button>

            {quantity > 0 ? (
              <div className="sm:w-40">
                <QuantityControl
                  size="md"
                  quantity={quantity}
                  max={product.stock}
                  label={product.title}
                  onIncrease={() => increaseQuantity(product.id)}
                  onDecrease={() => decreaseQuantity(product.id)}
                />
              </div>
            ) : (
              <Button variant="secondary" className="py-3 sm:px-8" onClick={() => addToCart(product)} disabled={!inStock}>
                Add to cart
              </Button>
            )}

            {quantity > 0 && (
              <Link
                to="/cart"
                className="inline-flex items-center justify-center rounded-lg px-4 py-3 text-sm font-semibold text-brand-600 hover:underline"
              >
                View cart →
              </Link>
            )}
          </div>

          <dl className="mt-8 grid gap-4 border-t border-stone-200 pt-6 text-sm sm:grid-cols-3">
            <div>
              <dt className="text-stone-500">Shipping</dt>
              <dd className="mt-1 font-medium text-stone-900">{product.shippingInformation || "Standard delivery"}</dd>
            </div>
            <div>
              <dt className="text-stone-500">Warranty</dt>
              <dd className="mt-1 font-medium text-stone-900">{product.warrantyInformation || "No warranty"}</dd>
            </div>
            <div>
              <dt className="text-stone-500">Returns</dt>
              <dd className="mt-1 font-medium text-stone-900">{product.returnPolicy || "No returns"}</dd>
            </div>
          </dl>
        </div>
      </div>
    </section>
  );
}

export default ProductDetails;