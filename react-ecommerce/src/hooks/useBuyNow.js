import { useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useCustomer } from "./useCustomer";

export function useBuyNow() {
  const { isSignedIn } = useCustomer();
  const navigate = useNavigate();

  return useCallback(
    (product) => {
      const buyNow = {
        id: product.id,
        title: product.title,
        price: product.price,
        thumbnail: product.thumbnail,
        category: product.category,
        quantity: 1,
      };

      if (isSignedIn) {
        navigate("/checkout", { state: { buyNow } });
      } else {
        navigate("/signup", {
          state: {
            from: "/checkout",
            buyNow,
            message: "Create an account or sign in to complete your purchase.",
          },
        });
      }
    },
    [isSignedIn, navigate],
  );
}