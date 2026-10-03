import { useMemo } from "react";
import { Link } from "react-router-dom";
import Container from "../components/Container";
import EmptyState from "../components/EmptyState";
import Button from "../components/Button";
import { useCustomer } from "../hooks/useCustomer";
import { useLocalStorage } from "../hooks/useLocalStorage";
import { initialOrders } from "../utils/mockData";
import { formatCurrency, formatDate, getStatusClasses } from "../utils/helpers";

const PROGRESS_STEPS = ["Pending", "Processing", "Completed"];

function OrderProgress({ status }) {
  if (status === "Cancelled") {
    return <p className="text-sm font-medium text-red-600">This order was cancelled.</p>;
  }

  const currentStep = PROGRESS_STEPS.indexOf(status);

  return (
    <ol className="flex items-center gap-2" aria-label={`Order status: ${status}`}>
      {PROGRESS_STEPS.map((step, index) => (
        <li key={step} className="flex flex-1 items-center gap-2">
          <span
            className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-bold ${
              index <= currentStep ? "bg-brand-600 text-white" : "bg-cream-200 text-stone-500"
            }`}
          >
            {index < currentStep ? "✓" : index + 1}
          </span>
          <span className={`text-xs font-medium ${index <= currentStep ? "text-stone-900" : "text-stone-500"}`}>
            {step}
          </span>
          {index < PROGRESS_STEPS.length - 1 && (
            <span className={`h-0.5 flex-1 rounded ${index < currentStep ? "bg-brand-600" : "bg-cream-200"}`} />
          )}
        </li>
      ))}
    </ol>
  );
}

function MyOrders() {
  const { currentCustomer } = useCustomer();
  const [orders, setOrders] = useLocalStorage("orders", initialOrders);

  const myOrders = useMemo(
    () => orders.filter((order) => order.customerEmail === currentCustomer?.email),
    [orders, currentCustomer],
  );

  const cancelOrder = (orderId) => {
    if (!window.confirm("Cancel this order?")) return;
    setOrders((current) =>
      current.map((order) => (order.id === orderId ? { ...order, status: "Cancelled" } : order)),
    );
  };

  return (
    <Container size="narrow">
      <h1 className="text-3xl font-bold tracking-tight text-stone-900">My orders</h1>
      <p className="mt-1 text-sm text-stone-500">
        {myOrders.length} {myOrders.length === 1 ? "order" : "orders"} · {currentCustomer?.email}
      </p>

      {myOrders.length === 0 ? (
        <div className="mt-8">
          <EmptyState title="No orders yet." message="When you place an order, it will appear here.">
            <Link
              to="/products"
              className="inline-flex rounded-lg bg-brand-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-brand-700"
            >
              Start shopping
            </Link>
          </EmptyState>
        </div>
      ) : (
        <div className="mt-8 space-y-5">
          {myOrders.map((order) => (
            <article key={order.id} className="rounded-xl border border-stone-200 bg-cream-50">
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-stone-200 px-5 py-4">
                <div>
                  <p className="font-semibold text-stone-900">Order #{order.id}</p>
                  <p className="text-xs text-stone-500">Placed on {formatDate(order.date)}</p>
                </div>
                <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${getStatusClasses(order.status)}`}>
                  {order.status}
                </span>
              </div>

              <div className="px-5 py-4">
                <OrderProgress status={order.status} />
              </div>

              <ul className="divide-y divide-stone-200 border-t border-stone-200 px-5">
                {order.items.map((item) => (
                  <li key={item.id} className="flex items-center gap-3 py-3">
                    <img
                      src={item.thumbnail}
                      alt={item.title}
                      className="h-14 w-14 shrink-0 rounded-lg bg-cream-200 object-contain p-1"
                    />
                    <div className="min-w-0 flex-1">
                      <Link to={`/products/${item.id}`} className="block truncate text-sm font-medium text-stone-900 hover:text-brand-600">
                        {item.title}
                      </Link>
                      <p className="text-xs text-stone-500">
                        {formatCurrency(item.price)} × {item.quantity}
                      </p>
                    </div>
                    <p className="text-sm font-semibold text-stone-900">
                      {formatCurrency(item.price * item.quantity)}
                    </p>
                  </li>
                ))}
              </ul>

              <div className="flex flex-wrap items-end justify-between gap-4 border-t border-stone-200 px-5 py-4">
                <div className="text-xs text-stone-500">
                  <p>{order.payment}</p>
                  <p>
                    Deliver to {order.shippingAddress?.address}, {order.shippingAddress?.city}
                  </p>
                </div>

                <div className="flex items-center gap-4">
                  {order.status === "Pending" && (
                    <Button variant="danger" size="sm" onClick={() => cancelOrder(order.id)}>
                      Cancel order
                    </Button>
                  )}
                  <p className="text-right">
                    <span className="block text-xs text-stone-500">Total</span>
                    <span className="text-lg font-bold text-stone-900">{formatCurrency(order.total)}</span>
                  </p>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </Container>
  );
}

export default MyOrders;