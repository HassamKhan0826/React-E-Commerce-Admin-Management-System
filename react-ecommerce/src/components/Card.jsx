function Card({ children, className = "" }) {
  return (
    <div className={`rounded-xl border border-stone-200 bg-cream-50 p-5 ${className}`}>
      {children}
    </div>
  );
}

export default Card;