import { useEffect, useMemo, useRef, useState } from "react";
import { useProducts } from "../hooks/useProducts";
import Loading from "../components/Loading";
import ErrorMessage from "../components/ErrorMessage";
import ProductList from "../components/ProductList";
import SearchBar from "../components/SearchBar";
import CategoryFilter from "../components/CategoryFilter";

function Products() {
  const { products, loading, error, refetch } = useProducts();
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const searchInputRef = useRef(null);

  useEffect(() => {
    searchInputRef.current?.focus();
  }, []);

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
        (product.description || "").toLowerCase().includes(searchTerm) ||
        product.category.toLowerCase().includes(searchTerm);

      const matchesCategory = category === "all" || product.category === category;

      return matchesSearch && matchesCategory;
    });
  }, [products, search, category]);

  return (
    <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-stone-900">All products</h1>
        <p className="mt-2 text-stone-500">Search by name, description or category.</p>
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
          <p className="mb-4 text-sm text-stone-500">
            Showing {filteredProducts.length} of {products.length} products
          </p>
          <ProductList products={filteredProducts} />
        </>
      )}
    </section>
  );
}

export default Products;