import { useCallback, useMemo, useState } from "react";
import Card from "../../components/Card";
import EmptyState from "../../components/EmptyState";
import Modal from "../../components/Modal";
import Button from "../../components/Button";
import { useLocalStorage } from "../../hooks/useLocalStorage";
import { formatDate } from "../../utils/helpers";

const FILTERS = ["All", "Unread"];

function Messages() {
  const [messages, setMessages] = useLocalStorage("messages", []);
  const [filter, setFilter] = useState("All");
  const [selected, setSelected] = useState(null);

  const unreadCount = useMemo(
    () => messages.filter((message) => !message.read).length,
    [messages],
  );

  const visibleMessages = useMemo(
    () => (filter === "Unread" ? messages.filter((message) => !message.read) : messages),
    [messages, filter],
  );

  const setReadStatus = useCallback(
    (id, read) => {
      setMessages((current) =>
        current.map((message) => (message.id === id ? { ...message, read } : message)),
      );
    },
    [setMessages],
  );

  const deleteMessage = useCallback(
    (id) => {
      if (!window.confirm("Delete this message?")) return;
      setMessages((current) => current.filter((message) => message.id !== id));
      setSelected(null);
    },
    [setMessages],
  );

  const openMessage = (message) => {
    setSelected(message);
    setReadStatus(message.id, true);
  };

  const closeMessage = useCallback(() => {
    setSelected(null);
  }, []);

  return (
    <div className="mx-auto max-w-5xl">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-stone-900">Messages</h1>
        <p className="mt-1 text-sm text-stone-500">
          {messages.length} messages · {unreadCount} unread
        </p>
      </div>

      <div className="mb-5 flex gap-2" role="group" aria-label="Filter messages">
        {FILTERS.map((option) => (
          <button
            key={option}
            type="button"
            onClick={() => setFilter(option)}
            aria-pressed={filter === option}
            className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
              filter === option
                ? "bg-brand-600 text-white"
                : "border border-stone-300 text-stone-700 hover:bg-cream-100"
            }`}
          >
            {option}
            <span className="ml-1.5 opacity-70">
              {option === "All" ? messages.length : unreadCount}
            </span>
          </button>
        ))}
      </div>

      {visibleMessages.length === 0 ? (
        <EmptyState
          title={messages.length === 0 ? "No messages yet." : "No unread messages."}
          message={
            messages.length === 0
              ? "Messages sent from the Contact page will appear here."
              : "You're all caught up."
          }
        />
      ) : (
        <Card className="divide-y divide-stone-200 p-0">
          {visibleMessages.map((message) => (
            <div key={message.id} className="flex flex-col gap-3 p-5 sm:flex-row sm:items-center">
              <button
                type="button"
                onClick={() => openMessage(message)}
                className="flex min-w-0 flex-1 items-start gap-3 text-left"
              >
                <span
                  className={`mt-2 h-2.5 w-2.5 shrink-0 rounded-full ${message.read ? "bg-transparent" : "bg-gold-400"}`}
                  aria-hidden="true"
                />
                <div className="min-w-0">
                  <div className="flex flex-wrap items-baseline gap-x-2">
                    <p className={`text-stone-900 ${message.read ? "font-medium" : "font-bold"}`}>
                      {message.name}
                    </p>
                    <p className="text-xs text-stone-500">{message.email}</p>
                  </div>
                  <p className={`mt-0.5 truncate text-sm ${message.read ? "text-stone-600" : "font-semibold text-stone-900"}`}>
                    {message.subject}
                  </p>
                  <p className="mt-0.5 truncate text-sm text-stone-500">{message.message}</p>
                </div>
              </button>

              <div className="flex shrink-0 items-center justify-between gap-3 sm:flex-col sm:items-end">
                <span className="text-xs text-stone-500">{formatDate(message.date)}</span>
                <div className="flex gap-2">
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => setReadStatus(message.id, !message.read)}
                  >
                    {message.read ? "Mark unread" : "Mark read"}
                  </Button>
                  <Button variant="danger" size="sm" onClick={() => deleteMessage(message.id)}>
                    Delete
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </Card>
      )}

      <Modal open={selected !== null} onClose={closeMessage} title={selected?.subject ?? "Message"}>
        {selected && (
          <div>
            <dl className="grid gap-3 text-sm sm:grid-cols-2">
              <div>
                <dt className="text-stone-500">From</dt>
                <dd className="font-medium text-stone-900">{selected.name}</dd>
              </div>
              <div>
                <dt className="text-stone-500">Received</dt>
                <dd className="font-medium text-stone-900">{formatDate(selected.date)}</dd>
              </div>
              <div className="sm:col-span-2">
                <dt className="text-stone-500">Email</dt>
                <dd className="font-medium text-stone-900">{selected.email}</dd>
              </div>
            </dl>

            <p className="mt-5 whitespace-pre-line rounded-lg bg-cream-100 p-4 text-sm leading-6 text-stone-700">
              {selected.message}
            </p>

            <div className="mt-6 flex justify-end gap-2">
              <Button variant="danger" onClick={() => deleteMessage(selected.id)}>
                Delete
              </Button>
              <a
                href={`mailto:${selected.email}?subject=${encodeURIComponent(`Re: ${selected.subject}`)}`}
                className="inline-flex items-center justify-center rounded-lg bg-brand-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-brand-700"
              >
                Reply by email
              </a>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}

export default Messages;