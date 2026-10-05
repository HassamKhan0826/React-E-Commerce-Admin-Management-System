const SIZES = {
  sm: { box: "h-9", button: "w-9 text-base", count: "text-sm" },
  md: { box: "h-12", button: "w-12 text-lg", count: "text-base" },
};

function QuantityControl({ quantity, onIncrease, onDecrease, max, label = "item", size = "sm" }) {
  const styles = SIZES[size];
  const atMax = max !== undefined && quantity >= max;

  return (
    <div
      role="group"
      aria-label={`Quantity of ${label} in cart`}
      className={`flex items-center justify-between rounded-lg border border-brand-600 bg-brand-50 ${styles.box}`}
    >
      <button
        type="button"
        onClick={onDecrease}
        aria-label={quantity === 1 ? `Remove ${label} from cart` : `Decrease quantity of ${label}`}
        className={`flex h-full items-center justify-center rounded-l-lg font-bold text-brand-700 hover:bg-brand-100 ${styles.button}`}
      >
        −
      </button>

      <span aria-live="polite" className={`font-semibold text-brand-700 ${styles.count}`}>
        {quantity}
      </span>

      <button
        type="button"
        onClick={onIncrease}
        disabled={atMax}
        aria-label={`Increase quantity of ${label}`}
        className={`flex h-full items-center justify-center rounded-r-lg font-bold text-brand-700 hover:bg-brand-100 disabled:cursor-not-allowed disabled:opacity-40 ${styles.button}`}
      >
        +
      </button>
    </div>
  );
}

export default QuantityControl;