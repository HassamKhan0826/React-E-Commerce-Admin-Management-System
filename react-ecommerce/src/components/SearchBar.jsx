function SearchBar({ value, onChange, placeholder = "Search...", inputRef, label = "Search" }) {
  return (
    <div className="relative">
      <svg
        className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -transtone-y-1/2 text-stone-400"
        viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"
      >
        <circle cx="11" cy="11" r="7" />
        <path d="M20 20l-3.5-3.5" />
      </svg>

      <input
        ref={inputRef}
        type="search"
        aria-label={label}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className="w-full rounded-lg border border-stone-300 bg-cream-50 py-2.5 pl-10 pr-4 text-sm outline-none transition focus:border-brand-600 focus:ring-4 focus:ring-brand-600/10"
      />
    </div>
  );
}

export default SearchBar;