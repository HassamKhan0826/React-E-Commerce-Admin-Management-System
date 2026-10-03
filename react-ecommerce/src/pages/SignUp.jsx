import { useEffect, useRef, useState } from "react";
import { Link, Navigate, useLocation, useNavigate } from "react-router-dom";
import Button from "../components/Button";
import { useCustomer } from "../hooks/useCustomer";

const initialForm = { name: "", email: "", password: "", confirmPassword: "" };

const inputClass =
  "mt-1.5 w-full rounded-lg border border-stone-300 bg-cream-50 px-3 py-2.5 text-sm text-stone-900 outline-none transition focus:border-brand-600 focus:ring-4 focus:ring-brand-600/10";

function validate(form) {
  const errors = {};

  if (form.name.trim().length < 2) {
    errors.name = "Please enter your full name.";
  }

  if (!form.email.trim()) {
    errors.email = "Email is required.";
  } else if (!/^\S+@\S+\.\S+$/.test(form.email)) {
    errors.email = "Enter a valid email address.";
  }

  if (form.password.length < 6) {
    errors.password = "Password must be at least 6 characters.";
  }

  if (form.confirmPassword !== form.password) {
    errors.confirmPassword = "Passwords don't match.";
  }

  return errors;
}

function SignUp() {
  const { isSignedIn, signUp } = useCustomer();
  const navigate = useNavigate();
  const location = useLocation();
  const nameRef = useRef(null);

  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState({});
  const [formError, setFormError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const redirectTo = location.state?.from || "/";

  useEffect(() => {
    nameRef.current?.focus();
  }, []);

  if (isSignedIn) {
    return <Navigate to={redirectTo} replace state={location.state} />;
  }

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
    setErrors((current) => ({ ...current, [name]: "" }));
    setFormError("");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const validationErrors = validate(form);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setSubmitting(true);
    const result = await signUp(form);
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
        <h1 className="text-2xl font-bold text-stone-900">Create your account</h1>
        <p className="mt-2 text-sm text-stone-500">Sign up to buy products and track your orders.</p>

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
            <label htmlFor="signup-name" className="text-sm font-medium text-stone-700">Full name</label>
            <input id="signup-name" ref={nameRef} name="name" value={form.name} onChange={handleChange} className={inputClass} autoComplete="name" />
            {errors.name && <p className="mt-1 text-xs text-red-600">{errors.name}</p>}
          </div>

          <div>
            <label htmlFor="signup-email" className="text-sm font-medium text-stone-700">Email</label>
            <input id="signup-email" name="email" type="email" value={form.email} onChange={handleChange} className={inputClass} autoComplete="email" />
            {errors.email && <p className="mt-1 text-xs text-red-600">{errors.email}</p>}
          </div>

          <div>
            <label htmlFor="signup-password" className="text-sm font-medium text-stone-700">Password</label>
            <input id="signup-password" name="password" type="password" value={form.password} onChange={handleChange} className={inputClass} autoComplete="new-password" />
            {errors.password && <p className="mt-1 text-xs text-red-600">{errors.password}</p>}
          </div>

          <div>
            <label htmlFor="signup-confirm" className="text-sm font-medium text-stone-700">Confirm password</label>
            <input id="signup-confirm" name="confirmPassword" type="password" value={form.confirmPassword} onChange={handleChange} className={inputClass} autoComplete="new-password" />
            {errors.confirmPassword && <p className="mt-1 text-xs text-red-600">{errors.confirmPassword}</p>}
          </div>

          <Button type="submit" className="w-full py-3" disabled={submitting}>
            {submitting ? "Creating account..." : "Create account"}
          </Button>
        </form>

        <p className="mt-6 text-center text-sm text-stone-500">
          Already have an account?{" "}
          <Link to="/signin" state={location.state} className="font-semibold text-brand-600 hover:text-brand-700">
            Sign in
          </Link>
        </p>
      </div>
    </section>
  );
}

export default SignUp;