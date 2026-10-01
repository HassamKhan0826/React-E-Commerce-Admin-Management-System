import { memo } from "react";
import { Link } from "react-router-dom";
import { formatCurrency } from "../utils/helpers";

const CartItem = memo(function CartItem({ item, onIncrease, onDecrease, onRemove }) {
  return (
    <div className="flex flex-col gap-4 border-b border-stone-200 py-5 last:border-0 sm:flex-row sm:items-center">
      <Link to={`/products/${item.id}`} className="flex min-w-0 flex-1 items-center gap-4">
        <img
          src={item.thumbnail}
          alt={item.title}
          className="h-20 w-20 shrink-0 rounded-lg bg-cream-200 object-contain p-2"
        />
        <div className="min-w-0">
          <p className="truncate font-semibold text-stone-900">{item.title}</p>
          <p className="mt-0.5 text-xs uppercase tracking-wide text-stone-500">
            {item.category?.replace(/-/g, " ")}
          </p>
          <p className="mt-1 text-sm text-stone-700">{formatCurrency(item.price)} each</p>
        </div>
      </Link>

      <div className="flex items-center justify-between gap-4 sm:justify-end">
        <div className="flex items-center rounded-lg border border-stone-300">
          <button
            type="button"
            onClick={() => onDecrease(item.id)}
            aria-label={`Decrease quantity of ${item.title}`}
            className="flex h-9 w-9 items-center justify-center text-lg text-stone-700 hover:bg-cream-200"
          >
            −
          </button>
          <span className="w-8 text-center text-sm font-semibold">{item.quantity}</span>
          <button
            type="button"
            onClick={() => onIncrease(item.id)}
            aria-label={`Increase quantity of ${item.title}`}
            className="flex h-9 w-9 items-center justify-center text-lg text-stone-700 hover:bg-cream-200"
          >
            +
          </button>
        </div>

        <p className="w-24 text-right font-bold text-stone-900">
          {formatCurrency(item.price * item.quantity)}
        </p>

        <button
          type="button"
          onClick={() => onRemove(item.id)}
          className="text-sm font-medium text-brand-600 hover:text-brand-800 hover:underline"
        >
          Remove
        </button>
      </div>
    </div>
  );
});

export default CartItem;