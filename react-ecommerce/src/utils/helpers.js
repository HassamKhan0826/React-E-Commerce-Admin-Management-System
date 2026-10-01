export const DEMO_CREDENTIALS = {
  email: "admin@example.com",
  password: "admin123",
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