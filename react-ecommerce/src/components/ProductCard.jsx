import { Link } from "react-router-dom";
import Button from "./Button";
import { formatCurrency, getOriginalPrice } from "../utils/helpers";

function ProductCard({ product, onAddToCart }) {
  const discount = Math.round(product.discountPercentage || 0);

  return (
    <article className="group flex flex-col overflow-hidden rounded-xl border border-slate-200 bg-white transition hover:-translate-y-0.5 hover:shadow-lg">
      <Link to={`/products/${product.id}`} className="relative block aspect-square bg-slate-100">
        <img
          src={product.thumbnail}
          alt={product.title}
          loading="lazy"
          className="h-full w-full object-contain p-6 transition-transform duration-300 group-hover:scale-105"
        />

        {discount > 0 && (
          <span className="absolute left-3 top-3 rounded-full bg-rose-600 px-2.5 py-1 text-xs font-semibold text-white">
            -{discount}%
          </span>
        )}
      </Link>

      <div className="flex flex-1 flex-col p-4">
        <div className="flex items-center justify-between gap-2 text-xs">
          <span className="font-medium uppercase tracking-wide text-slate-500">
            {product.category.replace(/-/g, " ")}
          </span>
          <span className="font-semibold text-amber-500">
            ★ <span className="text-slate-700">{product.rating.toFixed(1)}</span>
          </span>
        </div>

        <h3 className="mt-2 line-clamp-2 font-semibold leading-snug text-slate-900">
          {product.title}
        </h3>

        <div className="mt-2 flex items-baseline gap-2">
          <span className="text-lg font-bold text-slate-900">
            {formatCurrency(product.price)}
          </span>
          {discount > 0 && (
            <span className="text-xs text-slate-400 line-through">
              {formatCurrency(getOriginalPrice(product.price, product.discountPercentage))}
            </span>
          )}
        </div>

        <div className="mt-auto grid grid-cols-2 gap-2 pt-4">
          <Link
            to={`/products/${product.id}`}
            className="inline-flex items-center justify-center whitespace-nowrap rounded-lg border border-slate-300 px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50"
          >
            View details
          </Link>
          <Button size="sm" className="whitespace-nowrap" onClick={() => onAddToCart?.(product)}>
            Add to cart
          </Button>
        </div>
      </div>
    </article>
  );
}

export default ProductCard;