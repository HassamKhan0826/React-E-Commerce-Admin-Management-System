import { useEffect, useRef, useState } from "react";
import { Link, Navigate, useLocation, useNavigate } from "react-router-dom";
import Button from "../components/Button";
import { useCustomer } from "../hooks/useCustomer";

const inputClass =
  "mt-1.5 w-full rounded-lg border border-stone-300 bg-cream-50 px-3 py-2.5 text-sm text-stone-900 outline-none transition focus:border-brand-600 focus:ring-4 focus:ring-brand-600/10";

function SignIn() {
  const { isSignedIn, signIn } = useCustomer();
  const navigate = useNavigate();
  const location = useLocation();
  const emailRef = useRef(null);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [formError, setFormError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const redirectTo = location.state?.from || "/";

  useEffect(() => {
    emailRef.current?.focus();
  }, []);

  if (isSignedIn) {
    return <Navigate to={redirectTo} replace state={location.state} />;
  }

  const handleSubmit = async (event) => {
    event.preventDefault();

    const newErrors = {};
    if (!/^\S+@\S+\.\S+$/.test(email)) newErrors.email = "Enter a valid email address.";
    if (!password) newErrors.password = "Password is required.";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setSubmitting(true);
    const result = await signIn(email, password);
    setSubmitting(false);

    if (result.ok) {
      navigate(redirectTo, { replace: true, state: location.state });
    } else {
      setFormError(result.error);
    }
  };

  return (
    <section className="flex min-h-[75vh] items-center justify-center px-4 py-12">
      <div className="w-full max-w-md rounded-2xl border border-stone-200 bg-cream-50 p-8 shadow-sm">
        <h1 className="text-2xl font-bold text-stone-900">Welcome back</h1>
        <p className="mt-2 text-sm text-stone-500">Sign in to continue shopping.</p>

        {location.state?.message && !formError && (
          <div className="mt-6 rounded-lg bg-gold-50 px-4 py-3 text-sm font-medium text-gold-800">
            {location.state.message}
          </div>
        )}

        {formError && (
          <div role="alert" className="mt-6 rounded-lg bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
            {formError}
          </div>
        )}

        <form onSubmit={handleSubmit} noValidate className="mt-6 space-y-4">
          <div>
            <label htmlFor="signin-email" className="text-sm font-medium text-stone-700">Email</label>
            <input
              id="signin-email"
              ref={emailRef}
              type="email"
              value={email}
              onChange={(event) => {
                setEmail(event.target.value);
                setErrors((current) => ({ ...current, email: "" }));
                setFormError("");
              }}
              className={inputClass}
              autoComplete="email"
            />
            {errors.email && <p className="mt-1 text-xs text-red-600">{errors.email}</p>}
          </div>

          <div>
            <label htmlFor="signin-password" className="text-sm font-medium text-stone-700">Password</label>
            <input
              id="signin-password"
              type="password"
              value={password}
              onChange={(event) => {
                setPassword(event.target.value);
                setErrors((current) => ({ ...current, password: "" }));
                setFormError("");
              }}
              className={inputClass}
              autoComplete="current-password"
            />
            {errors.password && <p className="mt-1 text-xs text-red-600">{errors.password}</p>}
          </div>

          <Button type="submit" className="w-full py-3" disabled={submitting}>
            {submitting ? "Signing in..." : "Sign in"}
          </Button>
        </form>

        <p className="mt-6 text-center text-sm text-stone-500">
          New here?{" "}
          <Link to="/signup" state={location.state} className="font-semibold text-brand-600 hover:text-brand-700">
            Create an account
          </Link>
        </p>
      </div>
    </section>
  );
}

export default SignIn;