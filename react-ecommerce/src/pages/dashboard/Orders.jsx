import { useCallback, useMemo, useState } from "react";
import Card from "../../components/Card";
import EmptyState from "../../components/EmptyState";
import { useLocalStorage } from "../../hooks/useLocalStorage";
import { ORDER_STATUSES, initialOrders } from "../../utils/mockData";
import { formatCurrency, formatDate, getStatusClasses } from "../../utils/helpers";

const FILTERS = ["All", ...ORDER_STATUSES];

function Orders() {
  const [orders, setOrders] = useLocalStorage("orders", initialOrders);
  const [statusFilter, setStatusFilter] = useState("All");

  const filteredOrders = useMemo(() => {
    if (statusFilter === "All") {
      return orders;
    }
    return orders.filter((order) => order.status === statusFilter);
  }, [orders, statusFilter]);

  const statusCounts = useMemo(() => {
    const counts = { All: orders.length };
    ORDER_STATUSES.forEach((status) => {
      counts[status] = orders.filter((order) => order.status === status).length;
    });
    return counts;
  }, [orders]);

  const updateStatus = useCallback(
    (orderId, status) => {
      setOrders((current) =>
        current.map((order) => (order.id === orderId ? { ...order, status } : order)),
      );
    },
    [setOrders],
  );

  return (
    <div className="mx-auto max-w-7xl">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-stone-900">Orders</h1>
        <p className="mt-1 text-sm text-stone-500">Track and update customer orders.</p>
      </div>

      <div className="mb-5 flex gap-2 overflow-x-auto pb-1" role="group" aria-label="Filter orders by status">
        {FILTERS.map((status) => (
          <button
            key={status}
            type="button"
            onClick={() => setStatusFilter(status)}
            aria-pressed={statusFilter === status}
            className={`whitespace-nowrap rounded-full px-4 py-2 text-sm font-medium transition-colors ${
              statusFilter === status
                ? "bg-brand-600 text-white"
                : "border border-stone-300 text-stone-700 hover:bg-cream-100"
            }`}
          >
            {status}
            <span className="ml-1.5 opacity-70">{statusCounts[status]}</span>
          </button>
        ))}
      </div>

      {filteredOrders.length === 0 ? (
        <EmptyState
          title="No orders found."
          message={`There are no ${statusFilter.toLowerCase()} orders right now.`}
        />
      ) : (
        <Card className="overflow-hidden p-0">
          <div className="overflow-x-auto">
            <table className="w-full min-w-225 text-left text-sm">
              <thead className="bg-cream-100 text-xs uppercase tracking-wide text-stone-500">
                <tr>
                  <th className="px-5 py-3 font-medium">Order ID</th>
                  <th className="px-5 py-3 font-medium">Customer</th>
                  <th className="px-5 py-3 font-medium">Products</th>
                  <th className="px-5 py-3 font-medium">Total</th>
                  <th className="px-5 py-3 font-medium">Status</th>
                  <th className="px-5 py-3 font-medium">Date</th>
                  <th className="px-5 py-3 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredOrders.map((order) => (
                  <tr key={order.id} className="border-t border-stone-200">
                    <td className="whitespace-nowrap px-5 py-4 font-semibold text-stone-900">#{order.id}</td>
                    <td className="px-5 py-4 text-stone-700">{order.customer}</td>
                    <td className="px-5 py-4 text-stone-500">{order.products}</td>
                    <td className="px-5 py-4 font-medium text-stone-900">{formatCurrency(order.total)}</td>
                    <td className="px-5 py-4">
                      <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${getStatusClasses(order.status)}`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="whitespace-nowrap px-5 py-4 text-stone-500">{formatDate(order.date)}</td>
                    <td className="px-5 py-4">
                      <select
                        aria-label={`Change status of order ${order.id}`}
                        value={order.status}
                        onChange={(event) => updateStatus(order.id, event.target.value)}
                        className="rounded-lg border border-stone-300 bg-cream-50 px-2.5 py-1.5 text-xs font-medium text-stone-700 outline-none focus:border-brand-600"
                      >
                        {ORDER_STATUSES.map((status) => (
                          <option key={status} value={status}>
                            {status}
                          </option>
                        ))}
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}
    </div>
  );
}

export default Orders;