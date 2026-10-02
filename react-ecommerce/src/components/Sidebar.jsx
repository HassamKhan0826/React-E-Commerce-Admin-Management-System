import { useContext } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/contexts";
import { getInitials } from "../utils/helpers";

const links = [
  { label: "Overview", path: "/dashboard" },
  { label: "Products", path: "/dashboard/products" },
  { label: "Orders", path: "/dashboard/orders" },
  { label: "Users", path: "/dashboard/users" },
  { label: "Messages", path: "/dashboard/messages" },
  { label: "Profile", path: "/dashboard/profile" },
  { label: "Settings", path: "/dashboard/settings" },
];

const linkClass = ({ isActive }) =>
  `block rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
    isActive
      ? "bg-gold-400 text-brand-950"
      : "text-stone-300 hover:bg-brand-800 hover:text-white"
  }`;

function Sidebar({ isOpen, onClose }) {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-stone-900/50 md:hidden"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      <aside
        className={`${isOpen ? "flex" : "hidden"} fixed inset-y-0 left-0 z-50 w-64 shrink-0 flex-col bg-brand-900 md:sticky md:top-0 md:flex md:h-screen`}
      >
        <div className="flex h-16 items-center justify-between border-b border-brand-800 px-5">
          <Link to="/" className="flex items-center gap-2.5">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-600 text-xs font-bold text-white">
              HT
            </span>
            <span className="font-bold text-white">RE:STORE</span>
          </Link>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close menu"
            className="flex h-8 w-8 items-center justify-center rounded-lg text-stone-300 hover:bg-brand-800 md:hidden"
          >
            <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <path d="M6 6l12 12M18 6L6 18" />
            </svg>
          </button>
        </div>

        <nav className="flex-1 space-y-1 overflow-y-auto p-4" aria-label="Dashboard">
          {links.map((link) => (
            <NavLink
              key={link.path}
              to={link.path}
              end={link.path === "/dashboard"}
              onClick={onClose}
              className={linkClass}
            >
              {link.label}
            </NavLink>
          ))}
        </nav>

        <div className="border-t border-brand-800 p-4">
          <div className="flex items-center gap-3 rounded-lg bg-brand-800 p-3">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gold-400 text-xs font-bold text-brand-950">
              {getInitials(user?.name)}
            </span>
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-white">{user?.name}</p>
              <p className="truncate text-xs text-stone-400">{user?.email}</p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleLogout}
            className="mt-3 w-full rounded-lg border border-brand-700 px-3 py-2 text-sm font-medium text-stone-300 hover:bg-brand-800 hover:text-white"
          >
            Logout
          </button>
        </div>
      </aside>
    </>
  );
}

export default Sidebar;