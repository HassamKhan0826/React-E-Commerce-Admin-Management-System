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

export async function hashPassword(password) {
  const data = new TextEncoder().encode(password);
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(hashBuffer))
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");
}

export function createPlaceholderImage(title = "") {
  const letters = title.replace(/[^a-zA-Z0-9]/g, "").slice(0, 2).toUpperCase() || "?";
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200"><rect width="200" height="200" fill="#f3eada"/><text x="100" y="122" font-family="Arial, Helvetica, sans-serif" font-size="64" font-weight="700" fill="#8a1e30" text-anchor="middle">${letters}</text></svg>`;
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
}

export function isPlaceholderImage(src = "") {
  return src.startsWith("data:image/svg+xml");
}

export function resizeImage(file, maxSize = 600) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error("Could not read the file."));
    reader.onload = () => {
      const image = new Image();
      image.onerror = () => reject(new Error("Could not load the image."));
      image.onload = () => {
        const scale = Math.min(1, maxSize / Math.max(image.width, image.height));
        const canvas = document.createElement("canvas");
        canvas.width = Math.round(image.width * scale);
        canvas.height = Math.round(image.height * scale);
        const context = canvas.getContext("2d");
        context.fillStyle = "#ffffff";
        context.fillRect(0, 0, canvas.width, canvas.height);
        context.drawImage(image, 0, 0, canvas.width, canvas.height);
        resolve(canvas.toDataURL("image/jpeg", 0.82));
      };
      image.src = reader.result;
    };
    reader.readAsDataURL(file);
  });
}