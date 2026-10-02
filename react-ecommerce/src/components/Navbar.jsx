import { useContext, useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { AuthContext, ThemeContext } from "../context/contexts";
import { useCart } from "../hooks/useCart";

const navItems = [
  { label: "Home", path: "/" },
  { label: "Products", path: "/products" },
  { label: "About", path: "/about" },
  { label: "Contact", path: "/contact" },
];

const desktopLinkClass = ({ isActive }) =>
  `relative py-2 text-sm font-medium transition-colors after:absolute after:inset-x-0 after:-bottom-[21px] after:h-0.5 after:rounded-full after:transition-colors ${
    isActive
      ? "text-stone-900 after:bg-brand-600"
      : "text-stone-500 hover:text-stone-900 after:bg-transparent"
  }`;

const mobileLinkClass = ({ isActive }) =>
  `block rounded-lg px-3 py-2.5 text-sm font-medium ${
    isActive ? "bg-brand-50 text-brand-700" : "text-stone-700 hover:bg-cream-200"
  }`;

function ThemeIcon({ theme }) {
  return (
    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      {theme === "light" ? (
        <path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8Z" />
      ) : (
        <>
          <circle cx="12" cy="12" r="4" />
          <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
        </>
      )}
    </svg>
  );
}

function Navbar() {
  const { isAuthenticated, logout } = useContext(AuthContext);
  const { theme, toggleTheme } = useContext(ThemeContext);
  const { totalItems } = useCart();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const closeMenu = () => setIsMenuOpen(false);

  const handleLogout = () => {
    logout();
    closeMenu();
    navigate("/");
  };

  return (
    <header className="sticky top-0 z-40 border-b border-stone-200 bg-cream-50/90 backdrop-blur">
      <div className="bg-brand-900 px-4 py-2 text-center text-xs font-medium text-gold-200">
        Free shipping on orders over $50 — 30-day easy returns
      </div>

      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setIsMenuOpen((open) => !open)}
            aria-label={isMenuOpen ? "Close menu" : "Open menu"}
            aria-expanded={isMenuOpen}
            className="flex h-10 w-10 items-center justify-center rounded-lg text-stone-700 hover:bg-cream-200 md:hidden"
          >
            <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              {isMenuOpen ? (
                <path d="M6 6l12 12M18 6L6 18" />
              ) : (
                <path d="M4 7h16M4 12h16M4 17h16" />
              )}
            </svg>
          </button>

          <Link to="/" onClick={closeMenu} className="flex items-center gap-2.5">
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-600 text-sm font-bold text-white">
              RS
            </span>
            <span className="text-lg font-bold tracking-tight text-stone-900">
              RE:STORE
            </span>
          </Link>
        </div>

        <nav className="hidden items-center gap-8 md:flex" aria-label="Main">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === "/"}
              className={desktopLinkClass}
            >
              {item.label}
            </NavLink>
          ))}

          {isAuthenticated && (
            <NavLink to="/dashboard" className={desktopLinkClass}>
              Dashboard
            </NavLink>
          )}
        </nav>

        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={toggleTheme}
            aria-label={theme === "light" ? "Switch to dark mode" : "Switch to light mode"}
            className="flex h-10 w-10 items-center justify-center rounded-lg text-stone-700 hover:bg-cream-200"
          >
            <ThemeIcon theme={theme} />
          </button>

          <Link
            to="/cart"
            onClick={closeMenu}
            aria-label={`Cart, ${totalItems} items`}
            className="relative flex h-10 w-10 items-center justify-center rounded-lg text-stone-700 hover:bg-cream-200"
          >
            <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M6 7h12l-1 13H7L6 7Z" />
              <path d="M9 7a3 3 0 0 1 6 0" />
            </svg>

            {totalItems > 0 && (
              <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-gold-400 px-1 text-[10px] font-bold text-brand-950">
                {totalItems}
              </span>
            )}
          </Link>

          {isAuthenticated ? (
            <button
              type="button"
              onClick={handleLogout}
              className="ml-1 hidden rounded-lg border border-stone-300 px-4 py-2 text-sm font-semibold text-stone-700 hover:bg-cream-100 sm:inline-flex"
            >
              Logout
            </button>
          ) : (
            <Link
              to="/login"
              className="ml-1 hidden rounded-lg bg-brand-900 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-800 sm:inline-flex"
            >
              Admin login
            </Link>
          )}
        </div>
      </div>

      {isMenuOpen && (
        <nav className="border-t border-stone-200 px-4 py-3 md:hidden" aria-label="Mobile">
          <div className="space-y-1">
            {navItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.path === "/"}
                onClick={closeMenu}
                className={mobileLinkClass}
              >
                {item.label}
              </NavLink>
            ))}

            {isAuthenticated ? (
              <>
                <NavLink to="/dashboard" onClick={closeMenu} className={mobileLinkClass}>
                  Dashboard
                </NavLink>
                <button
                  type="button"
                  onClick={handleLogout}
                  className="block w-full rounded-lg px-3 py-2.5 text-left text-sm font-medium text-red-600 hover:bg-red-50"
                >
                  Logout
                </button>
              </>
            ) : (
              <NavLink to="/login" onClick={closeMenu} className={mobileLinkClass}>
                Admin login
              </NavLink>
            )}
          </div>
        </nav>
      )}
    </header>
  );
}

export default Navbar;