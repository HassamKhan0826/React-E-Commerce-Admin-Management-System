# RE:STORE — React E-Commerce & Admin Management System

A complete e-commerce web application built with **React and Vite**. Customers can browse, search and filter products, view product details and manage a shopping cart. Store administrators get a **protected dashboard** to manage products, orders, users and customer messages, edit their profile and change settings, including a **dark/light theme**.

The project was built as the final project of a React internship. It brings together authentication, protected and nested routing, API integration, global state with Context API and `useReducer`, custom hooks, performance optimization, controlled forms, localStorage persistence and a fully responsive UI.

![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-646CFF?logo=vite&logoColor=white)
![React Router](https://img.shields.io/badge/React_Router-CA4245?logo=reactrouter&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-06B6D4?logo=tailwindcss&logoColor=white)

---

## Table of contents

- [Screenshots](#screenshots)
- [Features](#features)
- [Technologies used](#technologies-used)
- [Demo credentials](#demo-credentials)
- [API used](#api-used)
- [Getting started](#getting-started)
- [Project structure](#project-structure)
- [Architecture](#architecture)
- [React concepts used](#react-concepts-used)
- [Data saved in localStorage](#data-saved-in-localstorage)
- [Design system](#design-system)
- [Notes and limitations](#notes-and-limitations)
- [Author](#author)

---

## Screenshots

| Home | Products |
| --- | --- |
| ![Home page](screenshots/home.png) | ![Products page](screenshots/products.png) |

| Product details | Shopping cart |
| --- | --- |
| ![Product details page](screenshots/product-details.png) | ![Cart page](screenshots/cart.png) |

| Admin dashboard | Products management |
| --- | --- |
| ![Dashboard overview](screenshots/dashboard.png) | ![Products management](screenshots/products-management.png) |

| Light mode | Mobile view |
| --- | --- |
| ![Light mode](screenshots/light-mode.png) | ![Mobile view](screenshots/mobile.png) |

---

## Features

### Customer area

- **Home page** with a hero section, store introduction, top-rated featured products and a call to action
- **Product catalog** loaded from the DummyJSON API (194 products)
- **Search** by product name, description or category, combined with a **category filter**
- **Product details** page on a dynamic route (`/products/:id`) with an image gallery, price, discount, rating, stock, brand, shipping, warranty and return policy
- **Shopping cart**: add, remove, increase and decrease quantity, clear the cart, total items and total price, with a free-shipping progress hint
- **Cart persistence**: the cart is saved and restored after a refresh
- **Contact form** with validation, error messages and a success message; messages are delivered to the admin inbox
- **Dark and light theme**, remembered after a refresh
- **Loading, error and empty states** on every data-driven section, with a "Try again" button for failed requests
- **404 page** for unknown routes

### Admin area (login required)

- **Authentication** with a demo account; login state survives a refresh
- **Protected routes**: every `/dashboard` page redirects to login when signed out, then returns the user to the page they wanted
- **Dashboard overview**: total products, orders, users and revenue, recent orders, recent products and quick actions
- **Products management**: product table with search, and **view, add, edit and delete** in a reusable modal (changes are saved in the browser)
- **Orders**: orders table with **status filtering** (Pending, Processing, Completed, Cancelled) and status updates
- **Users**: users table with **search** and activate/deactivate
- **Messages**: inbox for contact form messages with read/unread status, an unread filter, a detail view, reply by email and delete
- **Profile**: editable controlled form with validation; the new name appears instantly across the app
- **Settings**: dark mode switch, notifications, language, currency and account preferences
- **Responsive sidebar** that becomes a slide-in menu on mobile

---

## Technologies used

| Technology | Purpose |
| --- | --- |
| [React](https://react.dev/) | UI library (functional components and hooks) |
| [Vite](https://vite.dev/) | Development server and build tool |
| [React Router](https://reactrouter.com/) | Client-side routing: nested, dynamic and protected routes |
| [Tailwind CSS](https://tailwindcss.com/) | Utility-first styling with a custom color theme |
| Context API + `useReducer` | Global state for authentication, cart and theme |
| Fetch API | Loading data from the REST API (no Axios) |
| localStorage | Persisting login, cart, theme and admin data |
| ESLint | Code quality checks |

No Redux, Axios or UI component libraries (Material UI, Bootstrap, Ant Design) are used.

---

## Demo credentials

Use this account to open the admin dashboard:

| Email | Password |
| --- | --- |
| `admin@example.com` | `admin123` |

---

## API used

Product data comes from the free [DummyJSON Products API](https://dummyjson.com/docs/products).

| Endpoint | Used for |
| --- | --- |
| `https://dummyjson.com/products?limit=0` | All products (Products page) |
| `https://dummyjson.com/products/:id` | One product (Product details page) |
| `https://dummyjson.com/products?limit=4&sortBy=rating&order=desc` | Top-rated featured products (Home) |
| `https://dummyjson.com/products?limit=5&sortBy=id&order=desc` | Recent products (Dashboard) |

DummyJSON doesn't save changes, so product management, orders, users and messages are stored in the browser with localStorage.

---

## Getting started

### Prerequisites

- [Node.js](https://nodejs.org/) 18 or newer
- npm (included with Node.js)

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/HassamKhan0826/React-E-Commerce-Admin-Management-System.git

# 2. Go into the project folder
cd React-E-Commerce-Admin-Management-System/react-ecommerce

# 3. Install dependencies
npm install

# 4. Start the development server
npm run dev
```

Then open the URL shown in the terminal (usually `http://localhost:5173`).

### Available scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Start the development server |
| `npm run build` | Create a production build in `dist/` |
| `npm run preview` | Preview the production build locally |
| `npm run lint` | Check the code with ESLint |

---

## Project structure

```
react-ecommerce/
├── index.html
├── package.json
├── vite.config.js
└── src/
    ├── main.jsx                  # App entry: router and context providers
    ├── App.jsx                   # All routes
    ├── index.css                 # Tailwind, theme colors and dark mode
    │
    ├── components/
    │   ├── Button.jsx            # Reusable button (variants and sizes)
    │   ├── Card.jsx              # Reusable card container (children)
    │   ├── CartItem.jsx          # One cart row (React.memo)
    │   ├── CategoryFilter.jsx    # Category dropdown
    │   ├── Container.jsx         # Page width and spacing wrapper
    │   ├── DashboardLayout.jsx   # Admin layout: sidebar + header + Outlet
    │   ├── EmptyState.jsx        # "Nothing here" message
    │   ├── ErrorMessage.jsx      # Error box with "Try again"
    │   ├── Footer.jsx
    │   ├── Loading.jsx           # Loading spinner
    │   ├── Modal.jsx             # Reusable popup (children)
    │   ├── Navbar.jsx            # Store navbar, cart count, theme toggle
    │   ├── ProductCard.jsx       # One product (React.memo)
    │   ├── ProductList.jsx       # Product grid
    │   ├── ProtectedRoute.jsx    # Blocks admin pages when signed out
    │   ├── PublicLayout.jsx      # Store layout: navbar + Outlet + footer
    │   ├── SearchBar.jsx         # Reusable search input
    │   ├── Sidebar.jsx           # Admin navigation (mobile drawer)
    │   └── UserRow.jsx           # One user row (React.memo)
    │
    ├── context/
    │   ├── contexts.js           # AuthContext, CartContext, ThemeContext
    │   ├── AuthContext.jsx       # Login, logout, user profile
    │   ├── CartContext.jsx       # Cart with useReducer
    │   └── ThemeContext.jsx      # Dark / light theme
    │
    ├── hooks/
    │   ├── useCart.js            # Read the cart context
    │   ├── useFetch.js           # Fetch data with loading/error states
    │   └── useLocalStorage.js    # useState that is saved to localStorage
    │
    ├── pages/
    │   ├── Home.jsx
    │   ├── Products.jsx
    │   ├── ProductDetails.jsx
    │   ├── Cart.jsx
    │   ├── About.jsx
    │   ├── Contact.jsx
    │   ├── Login.jsx
    │   ├── NotFound.jsx
    │   └── dashboard/
    │       ├── Dashboard.jsx
    │       ├── ProductsManagement.jsx
    │       ├── Orders.jsx
    │       ├── Users.jsx
    │       ├── Messages.jsx
    │       ├── Profile.jsx
    │       └── Settings.jsx
    │
    ├── reducers/
    │   └── cartReducer.js        # All cart actions
    │
    └── utils/
        ├── helpers.js            # Formatting and shared helpers
        └── mockData.js           # Starting orders and users
```

---

## Architecture

### How the app is put together

Context providers wrap the whole app, so any component can read authentication, cart and theme state without prop drilling.

```mermaid
flowchart TD
  A["main.jsx"] --> B["BrowserRouter"]
  B --> C["ThemeProvider"]
  C --> D["AuthProvider"]
  D --> E["CartProvider"]
  E --> F["App.jsx (Routes)"]
  F --> G["PublicLayout<br/>Navbar + Outlet + Footer"]
  F --> H["ProtectedRoute"]
  H --> I["DashboardLayout<br/>Sidebar + Outlet"]
```

### Routes

```mermaid
flowchart LR
  R["/"] --> H["Home"]
  R --> P["/products"]
  P --> PD["/products/:id"]
  R --> C["/cart"]
  R --> A["/about"]
  R --> CO["/contact"]
  R --> L["/login"]
  R --> NF["* → 404"]
  R --> D["/dashboard 🔒"]
  D --> D1["Overview"]
  D --> D2["products"]
  D --> D3["orders"]
  D --> D4["users"]
  D --> D5["messages"]
  D --> D6["profile"]
  D --> D7["settings"]
```

### Login and protected routes

```mermaid
flowchart TD
  A["User opens /dashboard/orders"] --> B{"Logged in?"}
  B -- "Yes" --> C["Show the page"]
  B -- "No" --> D["Redirect to /login<br/>'Please login to continue.'"]
  D --> E{"Credentials valid?"}
  E -- "No" --> F["Show error"]
  E -- "Yes" --> G["Save login in localStorage<br/>Return to /dashboard/orders"]
```

### Cart data flow

```mermaid
flowchart LR
  A["ProductCard<br/>Add to cart"] --> B["CartContext<br/>addToCart()"]
  B --> C["dispatch(action)"]
  C --> D["cartReducer"]
  D --> E["New cart state"]
  E --> F["localStorage"]
  E --> G["Navbar badge"]
  E --> H["Cart page"]
```

### State management

| Data | Managed with | Why |
| --- | --- | --- |
| Form inputs, search text, filters, menus | `useState` | Local to one component |
| Logged-in user | `AuthContext` | Needed by Navbar, Sidebar, Login, ProtectedRoute, Profile |
| Cart | `CartContext` + `useReducer` | Shared across pages, with five related actions |
| Theme | `ThemeContext` | Affects the whole app |
| Products, orders, users, messages, settings | `useLocalStorage` | Saved in the browser (no backend) |

---

## React concepts used

| Concept | Where it is used |
| --- | --- |
| `useState` | Forms, search, filters, mobile menu, modals |
| `useEffect` | Fetching data, saving to localStorage, focusing inputs, theme class, timers |
| `useRef` | Auto-focus on the product search, login and contact forms |
| `useContext` | Reading auth, cart and theme state |
| `useReducer` | Cart state with `ADD_TO_CART`, `REMOVE_FROM_CART`, `INCREASE_QUANTITY`, `DECREASE_QUANTITY`, `CLEAR_CART` |
| `useMemo` | Filtered products, cart totals, revenue, status counts |
| `useCallback` | `addToCart`, `removeFromCart`, `deleteProduct`, `toggleStatus` passed to memoized children |
| `React.memo` | `ProductCard`, `CartItem`, `UserRow`, `ProductRow` |
| Custom hooks | `useFetch`, `useLocalStorage`, `useCart` |
| `children` and composition | `Card`, `Modal`, `Button`, `Container`, `EmptyState` |
| React Router | `BrowserRouter`, `Routes`, `Route`, `Link`, `NavLink`, `Outlet`, `Navigate`, `useNavigate`, `useParams`, `useLocation` |
| Routing patterns | Nested routes, dynamic route, protected routes, 404 route |

`React.memo` and `useCallback` work together: the cart functions keep the same reference between renders, so product cards and cart rows only re-render when their own data changes.

---

## Data saved in localStorage

| Key | Contents |
| --- | --- |
| `isAuthenticated` | Whether the admin is logged in |
| `storeUser` | Admin name, email and role |
| `cart` | Cart items and quantities |
| `theme` | `"light"` or `"dark"` |
| `managedProducts` | Products after admin changes (empty until the first change) |
| `orders` | Orders and their statuses |
| `users` | Users and their active/inactive status |
| `messages` | Messages sent from the Contact page |
| `preferences` | Admin settings |

To reset the app to its starting data, clear the site's localStorage in the browser's developer tools.

---

## Design system

Colors are defined once as Tailwind theme tokens in `src/index.css`, so the whole palette can be changed in one place.

| Token | Color | Used for |
| --- | --- | --- |
| `brand` | Burgundy | Buttons, links, active states, sidebar |
| `cream` | Beige | Page backgrounds and cards |
| `gold` | Light gold | Ratings, badges, highlights |
| `stone` | Warm gray | Text and borders |

**Dark mode** works by giving the same tokens darker values when `<html>` has the `dark` class, so every component switches theme without separate dark styles.

---

## Notes and limitations

- **Frontend only:** there is no backend. Authentication uses a single demo account, and admin data is saved in the browser, so it is not shared between devices.
- **Simulated product management:** DummyJSON does not store changes, so edits, additions and deletions are kept in localStorage. "Reset" in Products management restores the API data.
- **Checkout** is simulated: it clears the cart and shows a confirmation.
- **Reply by email** opens the computer's default email app with a `mailto:` link.
- **Settings:** dark mode is fully connected. The other preferences (language, currency, rows per page, notifications) are saved but not yet applied across the app.

---

## Author

**Hassam Khan**
Final project — React.js internship

GitHub: [@HassamKhan0826](https://github.com/HassamKhan0826)
