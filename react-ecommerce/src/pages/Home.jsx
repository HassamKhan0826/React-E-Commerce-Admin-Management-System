import { Link } from "react-router-dom";

const heroImages = [
  {
    src: "https://cdn.dummyjson.com/product-images/fragrances/chanel-coco-noir-eau-de/1.webp",
    alt: "Chanel Coco Noir perfume",
    className: "row-span-2 bg-slate-100",
  },
  {
    src: "https://cdn.dummyjson.com/product-images/beauty/red-lipstick/thumbnail.webp",
    alt: "Red lipstick",
    className: "aspect-square bg-emerald-50",
  },
  {
    src: "https://cdn.dummyjson.com/product-images/furniture/knoll-saarinen-executive-conference-chair/thumbnail.webp",
    alt: "Knoll executive chair",
    className: "aspect-square bg-amber-50",
  },
];

const trustPoints = [
  "Free shipping over $50",
  "30-day easy returns",
  "Secure checkout",
];

function Home() {
  return (
    <section className="overflow-hidden bg-white">
      <div className="mx-auto grid max-w-7xl items-center gap-14 px-4 py-16 sm:px-6 lg:grid-cols-2 lg:px-8 lg:py-24">
        <div>
          <span className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-600" />
            New season arrivals
          </span>

          <h1 className="mt-6 text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl lg:text-6xl">
            Everyday essentials, delivered to your door.
          </h1>

          <p className="mt-6 max-w-xl text-lg leading-8 text-slate-600">
            Shop beauty, electronics, furniture and groceries from trusted
            brands. Fair prices, fast delivery and easy returns.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              to="/products"
              className="rounded-lg bg-emerald-600 px-6 py-3 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-emerald-700"
            >
              View products
            </Link>
            <Link
              to="/about"
              className="rounded-lg border border-slate-300 px-6 py-3 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-50"
            >
              Learn more
            </Link>
          </div>

          <ul className="mt-10 flex flex-wrap gap-x-6 gap-y-3">
            {trustPoints.map((point) => (
              <li key={point} className="flex items-center gap-2 text-sm text-slate-600">
                <svg className="h-4 w-4 text-emerald-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 12l5 5L20 7" />
                </svg>
                {point}
              </li>
            ))}
          </ul>
        </div>

        <div className="relative">
          <div className="grid grid-cols-2 gap-4">
            {heroImages.map((image) => (
              <div key={image.src} className={`overflow-hidden rounded-2xl ${image.className}`}>
                <img
                  src={image.src}
                  alt={image.alt}
                  className="h-full w-full object-contain p-6"
                />
              </div>
            ))}
          </div>

          <div className="absolute -bottom-6 left-6 rounded-xl bg-white px-5 py-4 shadow-lg ring-1 ring-slate-200">
            <p className="text-sm font-semibold text-amber-500">★★★★★</p>
            <p className="mt-1 text-sm font-semibold text-slate-900">4.8 out of 5</p>
            <p className="text-xs text-slate-500">From 2,000+ happy customers</p>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Home;