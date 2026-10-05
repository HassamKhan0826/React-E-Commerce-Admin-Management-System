import { useMemo } from "react";
import ProductCard from "./ProductCard";
import EmptyState from "./EmptyState";
import { useCart } from "../hooks/useCart";
import { useBuyNow } from "../hooks/useBuyNow";

function ProductList({ products }) {
  const { cart, addToCart, increaseQuantity, decreaseQuantity } = useCart();
  const buyNow = useBuyNow();

  const quantities = useMemo(
    () => new Map(cart.map((item) => [item.id, item.quantity])),
    [cart],
  );

  if (products.length === 0) {
    return (
      <EmptyState
        title="No products found."
        message="Try a different search term or choose another category."
      />
    );
  }

  return (
    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {products.map((product) => (
        <ProductCard
          key={product.id}
          product={product}
          quantity={quantities.get(product.id) || 0}
          onAddToCart={addToCart}
          onIncrease={increaseQuantity}
          onDecrease={decreaseQuantity}
          onBuyNow={buyNow}
        />
      ))}
    </div>
  );
}

export default ProductList;