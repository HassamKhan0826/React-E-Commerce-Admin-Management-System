import { useMemo } from "react";
import { useFetch } from "./useFetch";
import { useLocalStorage } from "./useLocalStorage";

const PRODUCTS_URL = "https://dummyjson.com/products?limit=0";

export function useProducts() {
  const { data, loading, error, refetch } = useFetch(PRODUCTS_URL);
  const [savedProducts, setSavedProducts] = useLocalStorage("managedProducts", null);

  const apiProducts = useMemo(() => data?.products ?? [], [data]);
  const products = savedProducts ?? apiProducts;

  return {
    products,
    apiProducts,
    savedProducts,
    setSavedProducts,
    loading: !savedProducts && loading,
    error: savedProducts ? "" : error,
    refetch,
  };
}