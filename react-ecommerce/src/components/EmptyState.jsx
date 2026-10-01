function EmptyState({ title = "Nothing here yet", message, children }) {
  return (
    <div className="rounded-xl border border-dashed border-slate-300 bg-white px-6 py-14 text-center">
      <h3 className="font-semibold text-slate-900">{title}</h3>

      {message && (
        <p className="mx-auto mt-2 max-w-md text-sm text-slate-500">{message}</p>
      )}

      {children && <div className="mt-6">{children}</div>}
    </div>
  );
}

export default EmptyState;