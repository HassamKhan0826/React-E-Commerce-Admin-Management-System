import { useContext, useEffect, useState } from "react";
import Card from "../../components/Card";
import Button from "../../components/Button";
import { ThemeContext } from "../../context/contexts";
import { useLocalStorage } from "../../hooks/useLocalStorage";

const DEFAULT_PREFERENCES = {
  emailNotifications: true,
  orderAlerts: true,
  messageAlerts: false,
  language: "English",
  currency: "USD",
  itemsPerPage: "20",
  twoFactor: false,
};

const selectClass =
  "rounded-lg border border-stone-300 bg-cream-50 px-3 py-2 text-sm text-stone-900 outline-none focus:border-brand-600";

function Toggle({ checked, onChange, label }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      onClick={() => onChange(!checked)}
      className={`relative h-6 w-11 shrink-0 rounded-full transition-colors ${
        checked ? "bg-brand-600" : "bg-stone-300"
      }`}
    >
      <span
        className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-all ${
          checked ? "left-5.5" : "left-0.5"
        }`}
      />
    </button>
  );
}

function SettingRow({ title, description, children }) {
  return (
    <div className="flex items-center justify-between gap-6 border-t border-stone-200 py-4 first:border-0 first:pt-0 last:pb-0">
      <div>
        <p className="text-sm font-medium text-stone-900">{title}</p>
        <p className="mt-0.5 text-xs text-stone-500">{description}</p>
      </div>
      {children}
    </div>
  );
}

function Settings() {
  const { theme, setTheme } = useContext(ThemeContext);
  const [savedPreferences, setSavedPreferences] = useLocalStorage("preferences", DEFAULT_PREFERENCES);

  const [form, setForm] = useState({ ...DEFAULT_PREFERENCES, ...savedPreferences });
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (!saved) {
      return undefined;
    }
    const timer = setTimeout(() => setSaved(false), 2500);
    return () => clearTimeout(timer);
  }, [saved]);

  const updateField = (name, value) => {
    setForm((current) => ({ ...current, [name]: value }));
    setSaved(false);
  };

  const hasChanges = JSON.stringify(form) !== JSON.stringify({ ...DEFAULT_PREFERENCES, ...savedPreferences });

  const handleSave = (event) => {
    event.preventDefault();
    setSavedPreferences(form);
    setSaved(true);
  };

  const handleReset = () => {
    setForm(DEFAULT_PREFERENCES);
  };

  return (
    <div className="mx-auto max-w-3xl">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-stone-900">Settings</h1>
        <p className="mt-1 text-sm text-stone-500">Manage how the store and dashboard work for you.</p>
      </div>

      <form onSubmit={handleSave} className="space-y-5">
        <Card>
          <h2 className="mb-4 font-semibold text-stone-900">Appearance</h2>
          <SettingRow
            title="Dark mode"
            description="Applies instantly to the whole app and is remembered after refresh."
          >
            <Toggle
              label="Dark mode"
              checked={theme === "dark"}
              onChange={(isDark) => setTheme(isDark ? "dark" : "light")}
            />
          </SettingRow>
        </Card>

        <Card>
          <h2 className="mb-4 font-semibold text-stone-900">Notifications</h2>
          <SettingRow title="Email notifications" description="Receive store updates by email.">
            <Toggle
              label="Email notifications"
              checked={form.emailNotifications}
              onChange={(value) => updateField("emailNotifications", value)}
            />
          </SettingRow>
          <SettingRow title="New order alerts" description="Get notified when a customer places an order.">
            <Toggle
              label="New order alerts"
              checked={form.orderAlerts}
              onChange={(value) => updateField("orderAlerts", value)}
            />
          </SettingRow>
          <SettingRow title="Contact message alerts" description="Get notified when a new message arrives.">
            <Toggle
              label="Contact message alerts"
              checked={form.messageAlerts}
              onChange={(value) => updateField("messageAlerts", value)}
            />
          </SettingRow>
        </Card>

        <Card>
          <h2 className="mb-4 font-semibold text-stone-900">Language and region</h2>
          <SettingRow title="Language" description="Language used across the dashboard.">
            <select
              aria-label="Language"
              value={form.language}
              onChange={(event) => updateField("language", event.target.value)}
              className={selectClass}
            >
              <option value="English">English</option>
              <option value="Urdu">Urdu</option>
              <option value="Arabic">Arabic</option>
            </select>
          </SettingRow>
          <SettingRow title="Currency" description="Default currency for reports.">
            <select
              aria-label="Currency"
              value={form.currency}
              onChange={(event) => updateField("currency", event.target.value)}
              className={selectClass}
            >
              <option value="USD">USD ($)</option>
              <option value="PKR">PKR (Rs)</option>
              <option value="EUR">EUR (€)</option>
            </select>
          </SettingRow>
        </Card>

        <Card>
          <h2 className="mb-4 font-semibold text-stone-900">Account preferences</h2>
          <SettingRow title="Rows per page" description="How many rows tables show at once.">
            <select
              aria-label="Rows per page"
              value={form.itemsPerPage}
              onChange={(event) => updateField("itemsPerPage", event.target.value)}
              className={selectClass}
            >
              <option value="10">10</option>
              <option value="20">20</option>
              <option value="50">50</option>
            </select>
          </SettingRow>
          <SettingRow title="Two-step verification" description="Ask for a code when signing in on a new device.">
            <Toggle
              label="Two-step verification"
              checked={form.twoFactor}
              onChange={(value) => updateField("twoFactor", value)}
            />
          </SettingRow>
        </Card>

        <div className="flex flex-wrap items-center gap-3">
          <Button type="submit" disabled={!hasChanges}>Save preferences</Button>
          <Button variant="secondary" onClick={handleReset}>Reset to defaults</Button>
          {saved && (
            <span role="status" className="text-sm font-medium text-gold-700">
              Preferences saved ✓
            </span>
          )}
          {hasChanges && !saved && (
            <span className="text-xs text-stone-500">You have unsaved changes.</span>
          )}
        </div>
      </form>
    </div>
  );
}

export default Settings;