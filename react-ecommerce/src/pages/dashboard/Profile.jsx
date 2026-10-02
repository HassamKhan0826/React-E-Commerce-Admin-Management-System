import { useContext, useState } from "react";
import Card from "../../components/Card";
import Button from "../../components/Button";
import { AuthContext } from "../../context/contexts";
import { getInitials } from "../../utils/helpers";

const inputClass =
  "mt-1.5 w-full rounded-lg border border-stone-300 bg-cream-50 px-3 py-2.5 text-sm text-stone-900 outline-none transition focus:border-brand-600 focus:ring-4 focus:ring-brand-600/10";

const readOnlyClass =
  "mt-1.5 w-full rounded-lg border border-stone-200 bg-cream-200 px-3 py-2.5 text-sm text-stone-500";

function validate(form) {
  const errors = {};

  if (!form.name.trim()) {
    errors.name = "Name is required.";
  } else if (form.name.trim().length < 2) {
    errors.name = "Name should be at least 2 characters.";
  }

  if (!form.email.trim()) {
    errors.email = "Email is required.";
  } else if (!/^\S+@\S+\.\S+$/.test(form.email)) {
    errors.email = "Enter a valid email address.";
  }

  return errors;
}

function Profile() {
  const { user, updateUser } = useContext(AuthContext);

  const [form, setForm] = useState({
    name: user?.name || "",
    email: user?.email || "",
  });
  const [errors, setErrors] = useState({});
  const [saved, setSaved] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
    setErrors((current) => ({ ...current, [name]: "" }));
    setSaved(false);
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    const validationErrors = validate(form);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    updateUser({ name: form.name.trim(), email: form.email.trim() });
    setSaved(true);
  };

  const hasChanges = form.name !== user?.name || form.email !== user?.email;

  return (
    <div className="mx-auto max-w-4xl">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-stone-900">Profile</h1>
        <p className="mt-1 text-sm text-stone-500">Manage your account information.</p>
      </div>

      <Card className="mb-6 flex items-center gap-4">
        <span className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-brand-600 text-xl font-bold text-gold-200">
          {getInitials(user?.name)}
        </span>
        <div className="min-w-0">
          <p className="truncate text-lg font-semibold text-stone-900">{user?.name}</p>
          <p className="truncate text-sm text-stone-500">{user?.email}</p>
          <span className="mt-1.5 inline-block rounded-full bg-gold-50 px-2.5 py-0.5 text-xs font-semibold text-gold-800">
            {user?.role}
          </span>
        </div>
      </Card>

      <Card>
        <h2 className="font-semibold text-stone-900">Personal information</h2>

        {saved && (
          <div role="status" className="mt-4 rounded-lg bg-gold-50 px-4 py-3 text-sm font-medium text-gold-800">
            Profile saved successfully.
          </div>
        )}

        <form onSubmit={handleSubmit} noValidate className="mt-5 grid gap-5 sm:grid-cols-2">
          <div>
            <label htmlFor="profile-name" className="text-sm font-medium text-stone-700">Full name</label>
            <input id="profile-name" name="name" value={form.name} onChange={handleChange} className={inputClass} />
            {errors.name && <p className="mt-1 text-xs text-red-600">{errors.name}</p>}
          </div>

          <div>
            <label htmlFor="profile-email" className="text-sm font-medium text-stone-700">Contact email</label>
            <input id="profile-email" name="email" type="email" value={form.email} onChange={handleChange} className={inputClass} />
            {errors.email && <p className="mt-1 text-xs text-red-600">{errors.email}</p>}
          </div>

          <div>
            <label htmlFor="profile-role" className="text-sm font-medium text-stone-700">Role</label>
            <input id="profile-role" value={user?.role || ""} disabled className={readOnlyClass} />
          </div>

          <div>
            <label htmlFor="profile-login" className="text-sm font-medium text-stone-700">Login email</label>
            <input id="profile-login" value="admin@example.com" disabled className={readOnlyClass} />
          </div>

          <div className="flex items-center gap-3 sm:col-span-2">
            <Button type="submit" disabled={!hasChanges}>Save changes</Button>
            {hasChanges && (
              <span className="text-xs text-stone-500">You have unsaved changes.</span>
            )}
          </div>
        </form>
      </Card>
    </div>
  );
}

export default Profile;