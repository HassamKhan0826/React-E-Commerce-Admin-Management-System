import { useCallback, useEffect, useMemo } from "react";
import { CustomerContext } from "./contexts";
import { useLocalStorage, getStoredValue, setStoredValue } from "../hooks/useLocalStorage";
import { useCart } from "../hooks/useCart";
import { hashPassword } from "../utils/helpers";
import { initialUsers } from "../utils/mockData";

const INVALID_LOGIN = "Invalid email or password.";

function isAccountActive(email) {
  const users = getStoredValue("users", initialUsers);
  return users.find((user) => user.email === email)?.status !== "Inactive";
}

export function CustomerProvider({ children }) {
  const [customers, setCustomers] = useLocalStorage("customers", []);
  const [currentCustomer, setCurrentCustomer] = useLocalStorage("currentCustomer", null);
  const { switchCartOwner } = useCart();

  const startSession = useCallback(
    (customer) => {
      setCurrentCustomer({ id: customer.id, name: customer.name, email: customer.email });
      switchCartOwner(customer.id);
    },
    [setCurrentCustomer, switchCartOwner],
  );

  const endSession = useCallback(() => {
    setCurrentCustomer(null);
    switchCartOwner(null);
  }, [setCurrentCustomer, switchCartOwner]);

  useEffect(() => {
    const handleStorageChange = (event) => {
      if (event.key === "users" && currentCustomer && !isAccountActive(currentCustomer.email)) {
        endSession();
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, [currentCustomer, endSession]);

  const signUp = useCallback(
    async ({ name, email, password }) => {
      const normalizedEmail = email.trim().toLowerCase();

      if (customers.some((customer) => customer.email === normalizedEmail)) {
        return { ok: false, error: "An account with this email already exists." };
      }

      const newCustomer = {
        id: Date.now(),
        name: name.trim(),
        email: normalizedEmail,
        passwordHash: await hashPassword(password),
        createdAt: new Date().toISOString(),
      };

      setCustomers((current) => [...current, newCustomer]);

      const users = getStoredValue("users", initialUsers);
      setStoredValue("users", [
        { id: newCustomer.id, name: newCustomer.name, email: normalizedEmail, role: "Customer", status: "Active" },
        ...users,
      ]);

      startSession(newCustomer);
      return { ok: true };
    },
    [customers, setCustomers, startSession],
  );

  const signIn = useCallback(
    async (email, password) => {
      const normalizedEmail = email.trim().toLowerCase();
      const customer = customers.find((item) => item.email === normalizedEmail);

      if (!customer) {
        return { ok: false, error: INVALID_LOGIN };
      }

      const passwordHash = await hashPassword(password);
      if (passwordHash !== customer.passwordHash) {
        return { ok: false, error: INVALID_LOGIN };
      }

      if (!isAccountActive(normalizedEmail)) {
        return { ok: false, error: "This account has been deactivated. Please contact support." };
      }

      startSession(customer);
      return { ok: true };
    },
    [customers, startSession],
  );

  const signOut = useCallback(() => {
    endSession();
  }, [endSession]);

  const endSessionFor = useCallback(
    (email) => {
      if (currentCustomer?.email === email) {
        endSession();
      }
    },
    [currentCustomer, endSession],
  );

  const value = useMemo(
    () => ({
      currentCustomer,
      isSignedIn: Boolean(currentCustomer),
      signUp,
      signIn,
      signOut,
      endSessionFor,
      isAccountActive,
    }),
    [currentCustomer, signUp, signIn, signOut, endSessionFor],
  );

  return <CustomerContext.Provider value={value}>{children}</CustomerContext.Provider>;
}