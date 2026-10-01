function Loading({ text = "Loading..." }) {
  return (
    <div role="status" className="flex min-h-48 items-center justify-center">
      <div className="flex items-center gap-3 text-sm font-medium text-slate-500">
        <span className="h-5 w-5 animate-spin rounded-full border-2 border-slate-200 border-t-emerald-600" />
        {text}
      </div>
    </div>
  );
}

export default Loading;