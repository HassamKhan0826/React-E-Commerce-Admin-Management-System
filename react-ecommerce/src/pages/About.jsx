import { Link } from "react-router-dom";
import Container from "../components/Container";
import Card from "../components/Card";

const stats = [
  { value: "190+", label: "Products" },
  { value: "20+", label: "Categories" },
  { value: "2,000+", label: "Happy customers" },
  { value: "4.8/5", label: "Average rating" },
];

const values = [
  {
    title: "Quality first",
    text: "Every product is chosen from trusted brands, so you can shop with confidence.",
  },
  {
    title: "Fair prices",
    text: "Clear pricing with regular discounts and no hidden fees at checkout.",
  },
  {
    title: "Fast delivery",
    text: "Quick shipping on everyday essentials, with free delivery on orders over $50.",
  },
];

const techStack = [
  "React + Vite",
  "React Router",
  "Context API + useReducer",
  "Tailwind CSS",
  "Fetch API (DummyJSON)",
  "localStorage",
];

function About() {
  return (
    <Container size="narrow">
      <p className="text-sm font-semibold uppercase tracking-wider text-brand-600">About us</p>
      <h1 className="mt-3 text-4xl font-bold tracking-tight text-stone-900 sm:text-5xl">
        Shopping made simple, from browsing to checkout.
      </h1>
      <p className="mt-6 text-lg leading-8 text-stone-600">
        RE:STORE brings beauty, furniture, groceries, electronics and more into one
        easy store. Customers can search, compare and shop in a few clicks, while
        the team manages products, orders and users from a protected dashboard.
      </p>

      <div className="mt-12 grid grid-cols-2 gap-4 sm:grid-cols-4">
        {stats.map((stat) => (
          <div key={stat.label} className="rounded-xl bg-brand-900 p-5 text-center">
            <p className="text-2xl font-bold text-gold-300">{stat.value}</p>
            <p className="mt-1 text-xs font-medium text-cream-200">{stat.label}</p>
          </div>
        ))}
      </div>

      <h2 className="mt-16 text-2xl font-bold text-stone-900">What we care about</h2>
      <div className="mt-6 grid gap-5 md:grid-cols-3">
        {values.map((value) => (
          <Card key={value.title}>
            <h3 className="font-semibold text-stone-900">{value.title}</h3>
            <p className="mt-2 text-sm leading-6 text-stone-600">{value.text}</p>
          </Card>
        ))}
      </div>

      <h2 className="mt-16 text-2xl font-bold text-stone-900">How it's built</h2>
      <p className="mt-3 text-stone-600">
        This store is a React project built with modern frontend tools:
      </p>
      <ul className="mt-5 flex flex-wrap gap-2">
        {techStack.map((tech) => (
          <li
            key={tech}
            className="rounded-full border border-gold-300 bg-gold-50 px-3 py-1.5 text-sm font-medium text-gold-800"
          >
            {tech}
          </li>
        ))}
      </ul>

      <div className="mt-16 flex flex-col items-start justify-between gap-4 rounded-2xl border border-stone-200 bg-cream-50 p-8 sm:flex-row sm:items-center">
        <div>
          <h2 className="text-xl font-bold text-stone-900">Have a question?</h2>
          <p className="mt-1 text-sm text-stone-600">Our team usually replies within one business day.</p>
        </div>
        <Link
          to="/contact"
          className="shrink-0 rounded-lg bg-brand-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-brand-700"
        >
          Contact us
        </Link>
      </div>
    </Container>
  );
}

export default About;