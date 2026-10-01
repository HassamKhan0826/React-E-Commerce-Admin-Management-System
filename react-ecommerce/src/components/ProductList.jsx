import ProductCard from "./ProductCard";
import EmptyState from "./EmptyState";
import { useCart } from "../hooks/useCart";

function ProductList({ products }) {
  const { addToCart } = useCart();

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
        <ProductCard key={product.id} product={product} onAddToCart={addToCart} />
      ))}
    </div>
  );
}

export default ProductList;