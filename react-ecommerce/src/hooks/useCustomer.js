import { useContext } from "react";
import { CustomerContext } from "../context/contexts";

export function useCustomer() {
  const context = useContext(CustomerContext);

  if (!context) {
    throw new Error("useCustomer must be used inside a CustomerProvider.");
  }

  return context;
}