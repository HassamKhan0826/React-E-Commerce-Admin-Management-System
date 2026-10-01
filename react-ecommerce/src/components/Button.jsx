const VARIANTS = {
  primary: "bg-brand-600 text-white hover:bg-brand-700",
  secondary: "border border-stone-300 text-stone-700 hover:bg-cream-100",
  dark: "bg-brand-900 text-white hover:bg-brand-800",
  danger: "bg-red-50 text-red-600 hover:bg-red-100",
};

const SIZES = {
  sm: "px-3 py-2 text-xs",
  md: "px-5 py-2.5 text-sm",
};

function Button({
  children,
  variant = "primary",
  size = "md",
  className = "",
  type = "button",
  ...props
}) {
  return (
    <button
      type={type}
      className={`inline-flex items-center justify-center gap-2 rounded-lg font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-50 ${VARIANTS[variant]} ${SIZES[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}

export default Button;