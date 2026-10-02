export const DEMO_CREDENTIALS = {
  email: "khan@store.com",
  password: "khan8",
};

export function formatCurrency(value) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(value);
}

export function getOriginalPrice(price, discountPercentage) {
  if (!discountPercentage) {
    return price;
  }
  return price / (1 - discountPercentage / 100);
}

export function formatDate(date) {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(date));
}

export function getInitials(name = "") {
  return name
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .map((word) => word[0].toUpperCase())
    .slice(0, 2)
    .join("");
}

const STATUS_CLASSES = {
  Pending: "bg-gold-50 text-gold-800",
  Processing: "bg-cream-200 text-stone-700",
  Completed: "bg-emerald-50 text-emerald-700",
  Cancelled: "bg-red-50 text-red-700",
  Active: "bg-emerald-50 text-emerald-700",
  Inactive: "bg-cream-200 text-stone-500",
};

export function getStatusClasses(status) {
  return STATUS_CLASSES[status] || STATUS_CLASSES.Inactive;
}