import { useContext, useMemo } from "react";
import { Link } from "react-router-dom";
import Card from "../../components/Card";
import Loading from "../../components/Loading";
import ErrorMessage from "../../components/ErrorMessage";
import { AuthContext } from "../../context/contexts";
import { useFetch } from "../../hooks/useFetch";
import { useLocalStorage } from "../../hooks/useLocalStorage";
import { initialOrders, initialUsers } from "../../utils/mockData";
import { formatCurrency, formatDate, getStatusClasses } from "../../utils/helpers";

const RECENT_PRODUCTS_URL =
  "https://dummyjson.com/products?limit=5&sortBy=id&order=desc&select=title,price,thumbnail,stock";

const quickActions = [
  { label: "Manage products", path: "/dashboard/products" },
  { label: "Review orders", path: "/dashboard/orders" },
  { label: "Manage users", path: "/dashboard/users" },
  { label: "Open storefront", path: "/products" },
];

function Dashboard() {
  const { user } = useContext(AuthContext);
  const { data, loading, error, refetch } = useFetch(RECENT_PRODUCTS_URL);
  const [orders] = useLocalStorage("orders", initialOrders);
  const [users] = useLocalStorage("users", initialUsers);

  const revenue = useMemo(
    () =>
      orders
        .filter((order) => order.status !== "Cancelled")
        .reduce((total, order) => total + order.total, 0),
    [orders],
  );

  const stats = [
    { label: "Total products", value: data ? data.total : "—", note: "Live from the catalog" },
    { label: "Total orders", value: orders.length, note: "+12.8% this month" },
    { label: "Total users", value: users.length, note: "+6.4% this month" },
    { label: "Total revenue", value: formatCurrency(revenue), note: "Excludes cancelled orders" },
  ];

  const recentOrders = orders.slice(0, 5);
  const recentProducts = data?.products ?? [];
  const firstName = user?.name?.split(" ")[0] || "Admin";

  return (
    <div className="mx-auto max-w-7xl">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-stone-900">Welcome back, {firstName}</h1>
        <p className="mt-1 text-sm text-stone-500">Here's what's happening in your store.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.label}>
            <p className="text-sm text-stone-500">{stat.label}</p>
            <p className="mt-3 text-3xl font-bold text-stone-900">{stat.value}</p>
            <p className="mt-2 text-xs font-medium text-gold-700">{stat.note}</p>
          </Card>
        ))}
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-[1fr_300px]">
        <Card className="overflow-hidden p-0">
          <div className="flex items-center justify-between p-5">
            <h2 className="font-semibold text-stone-900">Recent orders</h2>
            <Link to="/dashboard/orders" className="text-sm font-medium text-brand-600 hover:text-brand-700">
              View all
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-150 text-left text-sm">
              <thead className="border-y border-stone-200 bg-cream-100 text-xs uppercase tracking-wide text-stone-500">
                <tr>
                  <th className="px-5 py-3 font-medium">Order</th>
                  <th className="px-5 py-3 font-medium">Customer</th>
                  <th className="px-5 py-3 font-medium">Date</th>
                  <th className="px-5 py-3 font-medium">Total</th>
                  <th className="px-5 py-3 font-medium">Status</th>
                </tr>
              </thead>
              <tbody>
                {recentOrders.map((order) => (
                  <tr key={order.id} className="border-b border-stone-200 last:border-0">
                    <td className="whitespace-nowrap px-5 py-4 font-semibold text-stone-900">#{order.id}</td>
                    <td className="px-5 py-4 text-stone-700">{order.customer}</td>
                    <td className="whitespace-nowrap px-5 py-4 text-stone-500">{formatDate(order.date)}</td>
                    <td className="px-5 py-4 text-stone-900">{formatCurrency(order.total)}</td>
                    <td className="px-5 py-4">
                      <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${getStatusClasses(order.status)}`}>
                        {order.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        <Card>
          <h2 className="font-semibold text-stone-900">Quick actions</h2>
          <div className="mt-4 grid gap-2">
            {quickActions.map((action, index) => (
              <Link
                key={action.path}
                to={action.path}
                className={`rounded-lg px-4 py-3 text-sm font-semibold transition-colors ${
                  index === 0
                    ? "bg-brand-600 text-white hover:bg-brand-700"
                    : "border border-stone-300 text-stone-700 hover:bg-cream-100"
                }`}
              >
                {action.label} →
              </Link>
            ))}
          </div>
        </Card>
      </div>

      <Card className="mt-6">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-semibold text-stone-900">Recent products</h2>
          <Link to="/dashboard/products" className="text-sm font-medium text-brand-600 hover:text-brand-700">
            View all
          </Link>
        </div>

        {loading && <Loading text="Loading products..." />}
        {error && <ErrorMessage message="Failed to load products." onRetry={refetch} />}

        {!loading && !error && (
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
            {recentProducts.map((product) => (
              <Link
                key={product.id}
                to={`/products/${product.id}`}
                className="rounded-lg border border-stone-200 p-3 transition-colors hover:bg-cream-100"
              >
                <img
                  src={product.thumbnail}
                  alt={product.title}
                  className="aspect-square w-full rounded-md bg-cream-200 object-contain p-2"
                />
                <p className="mt-3 truncate text-sm font-semibold text-stone-900">{product.title}</p>
                <p className="mt-1 text-xs text-stone-500">
                  {formatCurrency(product.price)} · {product.stock} in stock
                </p>
              </Link>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}

export default Dashboard;