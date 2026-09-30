import { useEffect, useState } from "react";
import { AuthContext } from "./contexts";
import { DEMO_CREDENTIALS } from "../utils/helpers";

const DEFAULT_USER = {
  name: "Admin User",
  email: DEMO_CREDENTIALS.email,
  role: "Administrator",
};

function readStoredUser() {
  try {
    const savedUser = localStorage.getItem("storeUser");
    return savedUser ? JSON.parse(savedUser) : DEFAULT_USER;
  } catch {
    return DEFAULT_USER;
  }
}

export function AuthProvider({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(
    () => localStorage.getItem("isAuthenticated") === "true",
  );
  const [user, setUser] = useState(readStoredUser);

  useEffect(() => {
    if (isAuthenticated) {
      localStorage.setItem("isAuthenticated", "true");
    } else {
      localStorage.removeItem("isAuthenticated");
    }
  }, [isAuthenticated]);

  useEffect(() => {
    localStorage.setItem("storeUser", JSON.stringify(user));
  }, [user]);

  const login = (email, password) => {
    const isValid =
      email.trim().toLowerCase() === DEMO_CREDENTIALS.email &&
      password === DEMO_CREDENTIALS.password;

    if (isValid) {
      setIsAuthenticated(true);
    }

    return isValid;
  };

  const logout = () => {
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, setUser, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}