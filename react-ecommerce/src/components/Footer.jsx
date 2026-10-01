import { Link } from "react-router-dom";

const footerSections = [
  {
    title: "Shop",
    links: [
      { label: "All products", path: "/products" },
      { label: "Cart", path: "/cart" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About us", path: "/about" },
      { label: "Contact", path: "/contact" },
    ],
  },
  {
    title: "Account",
    links: [
      { label: "Admin login", path: "/login" },
      { label: "Dashboard", path: "/dashboard" },
    ],
  },
];

const CURRENT_YEAR = new Date().getFullYear();

function Footer() {
  return (
    <footer className="border-t border-stone-200 bg-cream-50">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-12 sm:px-6 md:grid-cols-2 lg:grid-cols-5 lg:px-8">
        <div className="lg:col-span-2">
          <Link to="/" className="flex items-center gap-2.5">
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-600 text-sm font-bold text-white">
              RS
            </span>
            <span className="text-lg font-bold tracking-tight text-stone-900">
              RE:STORE
            </span>
          </Link>

          <p className="mt-4 max-w-sm text-sm leading-6 text-stone-500">
            Everyday essentials from beauty to electronics, picked for quality
            and delivered fast.
          </p>

          <p className="mt-4 text-sm text-stone-500">
            support@restore.com
          </p>
        </div>

        {footerSections.map((section) => (
          <div key={section.title}>
            <h3 className="text-sm font-semibold text-stone-900">
              {section.title}
            </h3>

            <ul className="mt-4 space-y-3">
              {section.links.map((link) => (
                <li key={link.path}>
                  <Link
                    to={link.path}
                    className="text-sm text-stone-500 transition-colors hover:text-brand-600"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="border-t border-stone-200">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-2 px-4 py-6 text-xs text-stone-500 sm:flex-row sm:px-6 lg:px-8">
          <p>© {CURRENT_YEAR} RE:STORE. All rights reserved.</p>
          <p>Built with React and Vite</p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;