import { useEffect, useRef, useState } from "react";
import Container from "../components/Container";
import Button from "../components/Button";
import { useLocalStorage } from "../hooks/useLocalStorage";

const initialForm = {
  name: "",
  email: "",
  subject: "",
  message: "",
};

const contactDetails = [
  { label: "Email", value: "support@restore.com" },
  { label: "Phone", value: "+92 300 1234567" },
  { label: "Hours", value: "Mon–Fri, 9:00 – 18:00" },
];

const inputClass =
  "mt-1.5 w-full rounded-lg border border-stone-300 bg-cream-50 px-3 py-2.5 text-sm text-stone-900 outline-none transition focus:border-brand-600 focus:ring-4 focus:ring-brand-600/10";

function validate(form) {
  const errors = {};

  if (!form.name.trim()) {
    errors.name = "Name is required.";
  }

  if (!form.email.trim()) {
    errors.email = "Email is required.";
  } else if (!/^\S+@\S+\.\S+$/.test(form.email)) {
    errors.email = "Enter a valid email address.";
  }

  if (!form.subject.trim()) {
    errors.subject = "Subject is required.";
  }

  if (!form.message.trim()) {
    errors.message = "Message is required.";
  } else if (form.message.trim().length < 10) {
    errors.message = "Message should be at least 10 characters.";
  }

  return errors;
}

function Contact() {
  const [, setMessages] = useLocalStorage("messages", []);
  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState(false);
  const nameInputRef = useRef(null);

  useEffect(() => {
    nameInputRef.current?.focus();
  }, []);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setForm((current) => ({ ...current, [name]: value }));
    setErrors((current) => ({ ...current, [name]: "" }));
    setSuccess(false);
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    const validationErrors = validate(form);

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    const newMessage = {
      id: Date.now(),
      name: form.name.trim(),
      email: form.email.trim(),
      subject: form.subject.trim(),
      message: form.message.trim(),
      date: new Date().toISOString(),
      read: false,
    };

    setMessages((current) => [newMessage, ...current]);

    setSuccess(true);
    setForm(initialForm);
    setErrors({});
    nameInputRef.current?.focus();
  };

  return (
    <Container size="narrow">
      <div className="grid gap-10 lg:grid-cols-[1fr_1.4fr]">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wider text-brand-600">Contact</p>
          <h1 className="mt-3 text-4xl font-bold tracking-tight text-stone-900">Get in touch</h1>
          <p className="mt-4 leading-7 text-stone-600">
            Questions about an order, a product or your account? Send us a message
            and we'll get back to you soon.
          </p>

          <dl className="mt-8 space-y-4">
            {contactDetails.map((detail) => (
              <div key={detail.label} className="rounded-xl border border-stone-200 bg-cream-50 px-4 py-3">
                <dt className="text-xs font-semibold uppercase tracking-wide text-gold-700">{detail.label}</dt>
                <dd className="mt-1 text-sm font-medium text-stone-900">{detail.value}</dd>
              </div>
            ))}
          </dl>
        </div>

        <form
          onSubmit={handleSubmit}
          noValidate
          className="rounded-2xl border border-stone-200 bg-cream-50 p-6 shadow-sm sm:p-8"
        >
          {success && (
            <div role="status" className="mb-6 rounded-lg bg-gold-50 px-4 py-3 text-sm font-medium text-gold-800">
              Thanks! Your message has been sent. We'll reply soon.
            </div>
          )}

          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label htmlFor="contact-name" className="text-sm font-medium text-stone-700">Name</label>
              <input
                id="contact-name"
                ref={nameInputRef}
                name="name"
                value={form.name}
                onChange={handleChange}
                className={inputClass}
                placeholder="Your name"
              />
              {errors.name && <p className="mt-1 text-xs text-red-600">{errors.name}</p>}
            </div>

            <div>
              <label htmlFor="contact-email" className="text-sm font-medium text-stone-700">Email</label>
              <input
                id="contact-email"
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                className={inputClass}
                placeholder="you@example.com"
              />
              {errors.email && <p className="mt-1 text-xs text-red-600">{errors.email}</p>}
            </div>

            <div className="sm:col-span-2">
              <label htmlFor="contact-subject" className="text-sm font-medium text-stone-700">Subject</label>
              <input
                id="contact-subject"
                name="subject"
                value={form.subject}
                onChange={handleChange}
                className={inputClass}
                placeholder="How can we help?"
              />
              {errors.subject && <p className="mt-1 text-xs text-red-600">{errors.subject}</p>}
            </div>

            <div className="sm:col-span-2">
              <label htmlFor="contact-message" className="text-sm font-medium text-stone-700">Message</label>
              <textarea
                id="contact-message"
                name="message"
                rows="5"
                value={form.message}
                onChange={handleChange}
                className={`${inputClass} resize-none`}
                placeholder="Write your message..."
              />
              {errors.message && <p className="mt-1 text-xs text-red-600">{errors.message}</p>}
            </div>
          </div>

          <Button type="submit" className="mt-6 w-full sm:w-auto">
            Send message
          </Button>
        </form>
      </div>
    </Container>
  );
}

export default Contact;