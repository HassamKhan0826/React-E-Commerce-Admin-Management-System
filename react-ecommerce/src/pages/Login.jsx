import { useContext, useEffect, useRef, useState } from "react";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/contexts";
import Button from "../components/Button";
import { DEMO_CREDENTIALS } from "../utils/helpers";

const inputClass =
  "mt-1.5 w-full rounded-lg border border-stone-300 bg-cream-50 px-3 py-2.5 text-sm text-stone-900 outline-none transition focus:border-brand-600 focus:ring-4 focus:ring-brand-600/10";

function Login() {
  const { isAuthenticated, login } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  const emailRef = useRef(null);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [loginError, setLoginError] = useState("");

  const redirectTo = location.state?.from || "/admin/dashboard";

  useEffect(() => {
    emailRef.current?.focus();
  }, []);

  if (isAuthenticated) {
    return <Navigate to={redirectTo} replace />;
  }

  const validate = () => {
    const newErrors = {};

    if (!email.trim()) {
      newErrors.email = "Email is required.";
    } else if (!/^\S+@\S+\.\S+$/.test(email)) {
      newErrors.email = "Enter a valid email address.";
    }

    if (!password) {
      newErrors.password = "Password is required.";
    }

    return newErrors;
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    if (login(email, password)) {
      navigate(redirectTo, { replace: true });
    } else {
      setLoginError("Invalid email or password.");
    }
  };

  return (
    <section className="flex min-h-[75vh] items-center justify-center px-4 py-16">
      <div className="w-full max-w-md rounded-2xl border border-stone-200 bg-cream-50 p-8 shadow-sm">
        <h1 className="text-2xl font-bold text-stone-900">Admin login</h1>
        <p className="mt-2 text-sm text-stone-500">Sign in to manage products, orders and users.</p>

        {location.state?.message && !loginError && (
          <div className="mt-6 rounded-lg bg-gold-50 px-4 py-3 text-sm font-medium text-gold-800">
            {location.state.message}
          </div>
        )}

        {loginError && (
          <div role="alert" className="mt-6 rounded-lg bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
            {loginError}
          </div>
        )}

        <form onSubmit={handleSubmit} noValidate className="mt-6 space-y-5">
          <div>
            <label htmlFor="login-email" className="text-sm font-medium text-stone-700">Email</label>
            <input
              id="login-email"
              ref={emailRef}
              type="email"
              value={email}
              onChange={(event) => {
                setEmail(event.target.value);
                setErrors((current) => ({ ...current, email: "" }));
                setLoginError("");
              }}
              className={inputClass}
              placeholder="admin email"
              autoComplete="username"
            />
            {errors.email && <p className="mt-1.5 text-xs text-red-600">{errors.email}</p>}
          </div>

          <div>
            <label htmlFor="login-password" className="text-sm font-medium text-stone-700">Password</label>
            <input
              id="login-password"
              type="password"
              value={password}
              onChange={(event) => {
                setPassword(event.target.value);
                setErrors((current) => ({ ...current, password: "" }));
                setLoginError("");
              }}
              className={inputClass}
              placeholder="••••••••"
              autoComplete="current-password"
            />
            {errors.password && <p className="mt-1.5 text-xs text-red-600">{errors.password}</p>}
          </div>

          <Button type="submit" className="w-full py-3">
            Sign in
          </Button>
        </form>

        <div className="mt-6 rounded-lg bg-cream-100 px-4 py-3 text-xs text-stone-600">
          <p className="font-semibold text-stone-700">Demo credentials</p>
          <p className="mt-1">Email: {DEMO_CREDENTIALS.email}</p>
          <p>Password: {DEMO_CREDENTIALS.password}</p>
        </div>
      </div>
    </section>
  );
}

export default Login;