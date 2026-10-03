import { useCallback, useEffect, useMemo, useReducer, useState } from "react";
import { CartContext } from "./contexts";
import cartReducer from "../reducers/cartReducer";
import { getStoredValue, setStoredValue } from "../hooks/useLocalStorage";

const GUEST = "guest";

function getCartKey(owner) {
  return `cart:${owner}`;
}

function getInitialOwner() {
  return getStoredValue("currentCustomer", null)?.id ?? GUEST;
}

function mergeCarts(accountCart, guestCart) {
  const merged = accountCart.map((item) => ({ ...item }));

  guestCart.forEach((guestItem) => {
    const existing = merged.find((item) => item.id === guestItem.id);
    if (existing) {
      existing.quantity += guestItem.quantity;
    } else {
      merged.push({ ...guestItem });
    }
  });

  return merged;
}

export function CartProvider({ children }) {
  const [cartOwner, setCartOwner] = useState(getInitialOwner);
  const [cart, dispatch] = useReducer(cartReducer, [], () =>
    getStoredValue(getCartKey(getInitialOwner()), []),
  );

  useEffect(() => {
    setStoredValue(getCartKey(cartOwner), cart);
  }, [cartOwner, cart]);

  const switchCartOwner = useCallback((newOwner) => {
    const owner = newOwner ?? GUEST;
    let nextCart = getStoredValue(getCartKey(owner), []);

    if (owner !== GUEST) {
      const guestCart = getStoredValue(getCartKey(GUEST), []);
      if (guestCart.length > 0) {
        nextCart = mergeCarts(nextCart, guestCart);
        setStoredValue(getCartKey(GUEST), []);
      }
    }

    setCartOwner(owner);
    dispatch({ type: "LOAD_CART", payload: nextCart });
  }, []);

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
      switchCartOwner,
      totalItems,
      totalPrice,
    }),
    [cart, addToCart, removeFromCart, increaseQuantity, decreaseQuantity, clearCart, switchCartOwner, totalItems, totalPrice],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}