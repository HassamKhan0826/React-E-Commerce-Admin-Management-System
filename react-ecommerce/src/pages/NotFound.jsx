import { Link } from "react-router-dom";

function NotFound() {
  return (
    <section className="flex min-h-[60vh] flex-col items-center justify-center px-4 text-center">
      <p className="text-7xl font-bold text-emerald-600">404</p>
      <h1 className="mt-4 text-3xl font-bold">404 – Page Not Found</h1>
      <p className="mt-2 text-slate-500">
        The page you're looking for doesn't exist or has been moved.
      </p>
      <Link
        to="/"
        className="mt-8 rounded-lg bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white hover:bg-slate-800"
      >
        Back to home
      </Link>
    </section>
  );
}

export default NotFound;