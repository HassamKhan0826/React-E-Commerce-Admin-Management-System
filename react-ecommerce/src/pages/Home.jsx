import { Link } from "react-router-dom";
import { useFetch } from "../hooks/useFetch";
import Loading from "../components/Loading";
import ErrorMessage from "../components/ErrorMessage";
import ProductList from "../components/ProductList";

const FEATURED_URL = "https://dummyjson.com/products?limit=4&sortBy=rating&order=desc";

const heroImages = [
  {
    src: "https://cdn.dummyjson.com/product-images/fragrances/chanel-coco-noir-eau-de/1.webp",
    alt: "Chanel Coco Noir perfume",
    className: "row-span-2 bg-cream-200",
  },
  {
    src: "https://cdn.dummyjson.com/product-images/beauty/red-lipstick/thumbnail.webp",
    alt: "Red lipstick",
    className: "aspect-square bg-brand-50",
  },
  {
    src: "https://cdn.dummyjson.com/product-images/furniture/knoll-saarinen-executive-conference-chair/thumbnail.webp",
    alt: "Knoll executive chair",
    className: "aspect-square bg-gold-50",
  },
];

const trustPoints = [
  "Free shipping over $50",
  "30-day easy returns",
  "Secure checkout",
];

const features = [
  {
    title: "Curated catalog",
    text: "Nearly 200 products across beauty, furniture, groceries, electronics and more.",
  },
  {
    title: "Smart search",
    text: "Find anything by name, description or category, and filter results instantly.",
  },
  {
    title: "Admin dashboard",
    text: "A protected workspace to manage products, orders, users and settings.",
  },
];

function Home() {
  const { data, loading, error, refetch } = useFetch(FEATURED_URL);
  const featuredProducts = data?.products ?? [];

  return (
    <>
      {/* Hero */}
      <section className="overflow-hidden bg-cream-50">
        <div className="mx-auto grid max-w-7xl items-center gap-14 px-4 py-16 sm:px-6 lg:grid-cols-2 lg:px-8 lg:py-24">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full bg-brand-50 px-3 py-1 text-xs font-semibold text-brand-700">
              <span className="h-1.5 w-1.5 rounded-full bg-brand-600" />
              New season arrivals
            </span>

            <h1 className="mt-6 text-4xl font-bold tracking-tight text-stone-900 sm:text-5xl lg:text-6xl">
              Everyday essentials, delivered to your door.
            </h1>

            <p className="mt-6 max-w-xl text-lg leading-8 text-stone-600">
              Shop beauty, electronics, furniture and groceries from trusted
              brands. Fair prices, fast delivery and easy returns.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                to="/products"
                className="rounded-lg bg-brand-600 px-6 py-3 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-brand-700"
              >
                View products
              </Link>
              <Link
                to="/about"
                className="rounded-lg border border-stone-300 px-6 py-3 text-sm font-semibold text-stone-700 transition-colors hover:bg-cream-100"
              >
                Learn more
              </Link>
            </div>

            <ul className="mt-10 flex flex-wrap gap-x-6 gap-y-3">
              {trustPoints.map((point) => (
                <li key={point} className="flex items-center gap-2 text-sm text-stone-600">
                  <svg className="h-4 w-4 text-brand-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
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
                  <img src={image.src} alt={image.alt} className="h-full w-full object-contain p-6" />
                </div>
              ))}
            </div>

            <div className="absolute -bottom-6 left-6 rounded-xl bg-cream-50 px-5 py-4 shadow-lg ring-1 ring-stone-200">
              <p className="text-sm font-semibold text-gold-500">★★★★★</p>
              <p className="mt-1 text-sm font-semibold text-stone-900">4.8 out of 5</p>
              <p className="text-xs text-stone-500">From 2,000+ happy customers</p>
            </div>
          </div>
        </div>
      </section>

      {/* Application introduction */}
      <section className="border-y border-stone-200 bg-cream-100">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="max-w-2xl">
            <h2 className="text-3xl font-bold tracking-tight text-stone-900">
              One store, one simple workspace
            </h2>
            <p className="mt-3 text-stone-600">
              RE:STORE is a complete shopping experience for customers, with a
              protected admin area for the people running the store.
            </p>
          </div>

          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {features.map((feature) => (
              <div key={feature.title} className="rounded-xl border border-stone-200 bg-cream-50 p-6">
                <h3 className="font-semibold text-stone-900">{feature.title}</h3>
                <p className="mt-2 text-sm leading-6 text-stone-600">{feature.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured products */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
          <div>
            <h2 className="text-3xl font-bold tracking-tight text-stone-900">Top rated products</h2>
            <p className="mt-2 text-stone-500">Our customers' favorite picks right now.</p>
          </div>
          <Link to="/products" className="text-sm font-semibold text-brand-600 hover:text-brand-700">
            View all products →
          </Link>
        </div>

        {loading && <Loading text="Loading products..." />}
        {error && <ErrorMessage message="Failed to load products." onRetry={refetch} />}
        {!loading && !error && <ProductList products={featuredProducts} />}
      </section>

      {/* Call to action */}
      <section className="mx-auto max-w-7xl px-4 pb-16 sm:px-6 lg:px-8">
        <div className="flex flex-col items-start justify-between gap-6 rounded-2xl bg-brand-600 px-8 py-12 text-white md:flex-row md:items-center md:px-12">
          <div>
            <h2 className="text-2xl font-bold sm:text-3xl">Ready to find your next favorite?</h2>
            <p className="mt-2 text-brand-50">
              Browse the full catalog and build your cart in a few clicks.
            </p>
          </div>
          <Link
            to="/products"
            className="shrink-0 rounded-lg bg-cream-50 px-6 py-3 text-sm font-semibold text-brand-700 transition-colors hover:bg-brand-50"
          >
            Shop now
          </Link>
        </div>
      </section>
    </>
  );
}

export default Home;