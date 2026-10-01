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


/*
const { data, loading, error, refetch } = useFetch("https://dummyjson.com/wrong-url");
const { data, loading, error, refetch } = useFetch("https://dummyjson.com/products?limit=5&skip=500");
*/