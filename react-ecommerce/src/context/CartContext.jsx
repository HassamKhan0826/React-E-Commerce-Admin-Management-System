import { useCallback, useEffect, useMemo, useReducer } from "react";
import { CartContext } from "./contexts";
import cartReducer from "../reducers/cartReducer";
import { getStoredValue, setStoredValue } from "../hooks/useLocalStorage";

const CART_STORAGE_KEY = "cart";

export function CartProvider({ children }) {
  const [cart, dispatch] = useReducer(cartReducer, [], () =>
    getStoredValue(CART_STORAGE_KEY, []),
  );

  useEffect(() => {
    setStoredValue(CART_STORAGE_KEY, cart);
  }, [cart]);

  const addToCart = useCallback((product) => {
    dispatch({
      type: "ADD_TO_CART",
      payload: {
        id: product.id,
        title: product.title,
        price: product.price,
        thumbnail: product.thumbnail,
        category: product.category,
      },
    });
  }, []);

  const removeFromCart = useCallback((productId) => {
    dispatch({ type: "REMOVE_FROM_CART", payload: productId });
  }, []);

  const increaseQuantity = useCallback((productId) => {
    dispatch({ type: "INCREASE_QUANTITY", payload: productId });
  }, []);

  const decreaseQuantity = useCallback((productId) => {
    dispatch({ type: "DECREASE_QUANTITY", payload: productId });
  }, []);

  const clearCart = useCallback(() => {
    dispatch({ type: "CLEAR_CART" });
  }, []);

  const totalItems = useMemo(
    () => cart.reduce((total, item) => total + item.quantity, 0),
    [cart],
  );

  const totalPrice = useMemo(
    () => cart.reduce((total, item) => total + item.price * item.quantity, 0),
    [cart],
  );

  const value = useMemo(
    () => ({
      cart,
      addToCart,
      removeFromCart,
      increaseQuantity,
      decreaseQuantity,
      clearCart,
      totalItems,
      totalPrice,
    }),
    [cart, addToCart, removeFromCart, increaseQuantity, decreaseQuantity, clearCart, totalItems, totalPrice],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}