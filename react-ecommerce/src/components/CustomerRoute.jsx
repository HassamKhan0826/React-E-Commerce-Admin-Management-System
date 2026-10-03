import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useCustomer } from "../hooks/useCustomer";

function CustomerRoute({ children }) {
  const { isSignedIn } = useCustomer();
  const location = useLocation();

  if (!isSignedIn) {
    return (
      <Navigate
        to="/signin"
        replace
        state={{
          ...location.state,
          from: location.pathname,
          message: "Please sign in to continue.",
        }}
      />
    );
  }

  return children ?? <Outlet />;
}

export default CustomerRoute;