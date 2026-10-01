const WIDTHS = {
  narrow: "max-w-4xl",
  default: "max-w-7xl",
};

function Container({ children, size = "default", className = "" }) {
  return (
    <section className={`mx-auto w-full px-4 py-12 sm:px-6 lg:px-8 ${WIDTHS[size]} ${className}`}>
      {children}
    </section>
  );
}

export default Container;