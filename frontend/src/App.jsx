import { BrowserRouter, Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

import Home from "./pages/Home";
import Menu from "./pages/Menu";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import Register from "./pages/Register";
import Login from "./pages/Login";
import OrderSummary from "./pages/OrderSummary";
import MyOrders from "./pages/MyOrders";

import AdminDashboard from "./pages/AdminDashboard";
import FoodManagement from "./pages/FoodManagement";
import CategoryManagement from "./pages/CategoryManagement";
import OrderManagement from "./pages/OrderManagement";
import Reports from "./pages/Reports";

import { CartProvider } from "./context/CartContext";

function App() {
  return (
    <BrowserRouter>

      <CartProvider>

        {/* Navbar */}
        <Navbar />

        {/* All Pages */}
        <Routes>

          {/* ================= CUSTOMER ================= */}

          <Route
            path="/"
            element={<Home />}
          />

          <Route
            path="/menu"
            element={<Menu />}
          />

          <Route
            path="/cart"
            element={<Cart />}
          />

          <Route
            path="/checkout"
            element={<Checkout />}
          />

          <Route
            path="/register"
            element={<Register />}
          />

          <Route
            path="/login"
            element={<Login />}
          />

          <Route
            path="/order-summary/:orderId"
            element={<OrderSummary />}
          />

          <Route
            path="/my-orders"
            element={<MyOrders />}
          />


          {/* ================= ADMIN ================= */}

          <Route
            path="/admin"
            element={<AdminDashboard />}
          />

          <Route
            path="/admin/foods"
            element={<FoodManagement />}
          />

          <Route
            path="/admin/categories"
            element={<CategoryManagement />}
          />

          <Route
            path="/admin/orders"
            element={<OrderManagement />}
          />

          <Route
            path="/admin/reports"
            element={<Reports />}
          />

        </Routes>


        {/* Footer */}
        <Footer />

      </CartProvider>

    </BrowserRouter>
  );
}

export default App;