import { Route, Routes } from "react-router-dom";
import PublicLayout from "./components/PublicLayout";
import DashboardLayout from "./components/DashboardLayout";
import ProtectedRoute from "./components/ProtectedRoute";
import CustomerRoute from "./components/CustomerRoute";
import Home from "./pages/Home";
import Products from "./pages/Products";
import ProductDetails from "./pages/ProductDetails";
import Cart from "./pages/Cart";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import SignIn from "./pages/SignIn";
import Checkout from "./pages/Checkout";
import MyOrders from "./pages/MyOrders";
import NotFound from "./pages/NotFound";
import Dashboard from "./pages/dashboard/Dashboard";
import ProductsManagement from "./pages/dashboard/ProductsManagement";
import Orders from "./pages/dashboard/Orders";
import Users from "./pages/dashboard/Users";
import Messages from "./pages/dashboard/Messages";
import Profile from "./pages/dashboard/Profile";
import Settings from "./pages/dashboard/Settings";

function App() {
  return (
    <Routes>
      <Route element={<PublicLayout />}>
        <Route index element={<Home />} />
        <Route path="products" element={<Products />} />
        <Route path="products/:id" element={<ProductDetails />} />
        <Route path="cart" element={<Cart />} />
        <Route path="about" element={<About />} />
        <Route path="contact" element={<Contact />} />
        <Route path="login" element={<Login />} />
        <Route path="signup" element={<SignUp />} />
        <Route path="signin" element={<SignIn />} />

        <Route element={<CustomerRoute />}>
          <Route path="checkout" element={<Checkout />} />
          <Route path="my-orders" element={<MyOrders />} />
        </Route>

        <Route path="*" element={<NotFound />} />
      </Route>

      <Route
        path="dashboard"
        element={
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Dashboard />} />
        <Route path="products" element={<ProductsManagement />} />
        <Route path="orders" element={<Orders />} />
        <Route path="users" element={<Users />} />
        <Route path="messages" element={<Messages />} />
        <Route path="profile" element={<Profile />} />
        <Route path="settings" element={<Settings />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}

export default App;