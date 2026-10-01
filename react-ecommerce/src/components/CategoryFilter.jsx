function formatCategory(category) {
  return category
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

function CategoryFilter({ categories, value, onChange }) {
  return (
    <select
      aria-label="Filter by category"
      value={value}
      onChange={(event) => onChange(event.target.value)}
      className="w-full rounded-lg border border-stone-300 bg-cream-50 px-4 py-2.5 text-sm outline-none transition focus:border-brand-600 focus:ring-4 focus:ring-brand-600/10 sm:w-56"
    >
      <option value="all">All categories</option>
      {categories.map((category) => (
        <option key={category} value={category}>
          {formatCategory(category)}
        </option>
      ))}
    </select>
  );
}

export default CategoryFilter;