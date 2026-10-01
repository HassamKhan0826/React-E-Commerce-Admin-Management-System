/* testing products page
import { useFetch } from "../hooks/useFetch";

function Products() {
  const { data, loading, error, refetch } = useFetch("https://dummyjson.com/products?limit=5");

  return (
    <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold">Products</h1>

      {loading && <p className="mt-4">Loading products...</p>}
      {error && <p className="mt-4 text-red-600">{error}</p>}

      {data && (
        <ul className="mt-4 list-disc pl-6">
          {data.products.map((product) => (
            <li key={product.id}>{product.title}</li>
          ))}
        </ul>
      )}

      <button onClick={refetch} className="mt-4 rounded-lg border px-4 py-2 text-sm">
        Reload
      </button>
    </section>
  );
}

export default Products;*/
/*
import { useFetch } from "../hooks/useFetch";
import Loading from "../components/Loading";
import ErrorMessage from "../components/ErrorMessage";
import EmptyState from "../components/EmptyState";

function Products() {
  const { data, loading, error, refetch } = useFetch("https://dummyjson.com/products?limit=5");
  const products = data?.products ?? [];

  return (
    <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <h1 className="mb-6 text-3xl font-bold">Products</h1>

      {loading && <Loading text="Loading products..." />}
      {error && <ErrorMessage message="Failed to load products." onRetry={refetch} />}

      {!loading && !error && products.length === 0 && (
        <EmptyState title="No products found." message="Try a different search." />
      )}

      {!loading && !error && products.length > 0 && (
        <ul className="list-disc pl-6">
          {products.map((product) => (
            <li key={product.id}>{product.title}</li>
          ))}
        </ul>
      )}
    </section>
  );
}

export default Products;
*/

/*
const { data, loading, error, refetch } = useFetch("https://dummyjson.com/wrong-url");
const { data, loading, error, refetch } = useFetch("https://dummyjson.com/products?limit=5&skip=500");
*/
/*
import { useFetch } from "../hooks/useFetch";
import Loading from "../components/Loading";
import ErrorMessage from "../components/ErrorMessage";
import ProductCard from "../components/ProductCard";

function Products() {
  const { data, loading, error, refetch } = useFetch("https://dummyjson.com/products?limit=8");
  const products = data?.products ?? [];

  return (
    <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <h1 className="mb-6 text-3xl font-bold">Products</h1>

      {loading && <Loading text="Loading products..." />}
      {error && <ErrorMessage message="Failed to load products." onRetry={refetch} />}

      {!loading && !error && (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </section>
  );
}

export default Products;
*/


import { useEffect, useMemo, useRef, useState } from "react";
import { useFetch } from "../hooks/useFetch";
import Loading from "../components/Loading";
import ErrorMessage from "../components/ErrorMessage";
import ProductList from "../components/ProductList";
import SearchBar from "../components/SearchBar";
import CategoryFilter from "../components/CategoryFilter";

const PRODUCTS_URL = "https://dummyjson.com/products?limit=0";

function Products() {
  const { data, loading, error, refetch } = useFetch(PRODUCTS_URL);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const searchInputRef = useRef(null);

  useEffect(() => {
    searchInputRef.current?.focus();
  }, []);

  const products = useMemo(() => data?.products ?? [], [data]);

  const categories = useMemo(
    () => [...new Set(products.map((product) => product.category))].sort(),
    [products],
  );

  const filteredProducts = useMemo(() => {
    const searchTerm = search.toLowerCase().trim();

    return products.filter((product) => {
      const matchesSearch =
        !searchTerm ||
        product.title.toLowerCase().includes(searchTerm) ||
        product.description.toLowerCase().includes(searchTerm) ||
        product.category.toLowerCase().includes(searchTerm);

      const matchesCategory = category === "all" || product.category === category;

      return matchesSearch && matchesCategory;
    });
  }, [products, search, category]);

  return (
    <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">All products</h1>
        <p className="mt-2 text-slate-500">
          Search by name, description or category.
        </p>
      </div>

      <div className="mb-6 grid gap-3 sm:grid-cols-[1fr_auto]">
        <SearchBar
          inputRef={searchInputRef}
          value={search}
          onChange={setSearch}
          label="Search products"
          placeholder="Search products..."
        />
        <CategoryFilter categories={categories} value={category} onChange={setCategory} />
      </div>

      {loading && <Loading text="Loading products..." />}
      {error && <ErrorMessage message="Failed to load products." onRetry={refetch} />}

      {!loading && !error && (
        <>
          <p className="mb-4 text-sm text-slate-500">
            Showing {filteredProducts.length} of {products.length} products
          </p>
          <ProductList products={filteredProducts} />
        </>
      )}
    </section>
  );
}

export default Products;