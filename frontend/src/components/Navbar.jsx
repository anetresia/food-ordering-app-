import { Link, useLocation, useNavigate } from "react-router-dom";

import { useCart } from "../context/CartContext";

function Navbar() {
  const { cartItems } = useCart();

  const location = useLocation();
  const navigate = useNavigate();

  const cartCount = cartItems.reduce(
    (total, item) => total + item.quantity,
    0
  );

  // localStorage-la login pannina user details edukkrom
  const user = JSON.parse(
    localStorage.getItem("user") || "null"
  );

  const token = localStorage.getItem("token");

  const isLoggedIn = Boolean(token);

  // User role check
  const isAdmin = user?.role === "admin";

  function handleLogout() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    navigate("/login");
  }

  return (
    <nav
      className="navbar bg-white border-bottom sticky-top"
      style={{
        boxShadow: "0 2px 12px rgba(0, 0, 0, 0.04)",
      }}
    >

      <div className="container py-2">

        <div className="d-flex align-items-center justify-content-between w-100">

          {/* Logo */}
          <Link
            to={isAdmin ? "/admin" : "/"}
            className="navbar-brand fw-bold fs-3 text-success mb-0"
          >
            Suvai
          </Link>


          {/* Navigation */}
          <div className="d-flex align-items-center gap-2">

            {/* ================= ADMIN NAVBAR ================= */}

            {isLoggedIn && isAdmin ? (
              <>
                <Link
                  to="/admin"
                  className={`text-decoration-none px-3 py-2 rounded-3 ${
                    location.pathname === "/admin"
                      ? "text-success fw-semibold"
                      : "text-dark"
                  }`}
                >
                  Dashboard
                </Link>

                <Link
                  to="/admin/foods"
                  className={`text-decoration-none px-3 py-2 rounded-3 ${
                    location.pathname === "/admin/foods"
                      ? "text-success fw-semibold"
                      : "text-dark"
                  }`}
                >
                  Foods
                </Link>

                <Link
                  to="/admin/categories"
                  className={`text-decoration-none px-3 py-2 rounded-3 ${
                    location.pathname === "/admin/categories"
                      ? "text-success fw-semibold"
                      : "text-dark"
                  }`}
                >
                  Categories
                </Link>

                <Link
                  to="/admin/orders"
                  className={`text-decoration-none px-3 py-2 rounded-3 ${
                    location.pathname === "/admin/orders"
                      ? "text-success fw-semibold"
                      : "text-dark"
                  }`}
                >
                  Orders
                </Link>

                <Link
                  to="/admin/reports"
                  className={`text-decoration-none px-3 py-2 rounded-3 ${
                    location.pathname === "/admin/reports"
                      ? "text-success fw-semibold"
                      : "text-dark"
                  }`}
                >
                  Reports
                </Link>

                <button
                  onClick={handleLogout}
                  className="btn btn-outline-success rounded-3 px-3 ms-2"
                >
                  Logout
                </button>
              </>
            ) : (

              /* ================= USER NAVBAR ================= */

              <>
                <Link
                  to="/"
                  className={`text-decoration-none px-3 py-2 rounded-3 ${
                    location.pathname === "/"
                      ? "text-success fw-semibold"
                      : "text-dark"
                  }`}
                >
                  Home
                </Link>

                <Link
                  to="/menu"
                  className={`text-decoration-none px-3 py-2 rounded-3 ${
                    location.pathname === "/menu"
                      ? "text-success fw-semibold"
                      : "text-dark"
                  }`}
                >
                  Menu
                </Link>

                <Link
                  to="/my-orders"
                  className={`text-decoration-none px-3 py-2 rounded-3 ${
                    location.pathname === "/my-orders"
                      ? "text-success fw-semibold"
                      : "text-dark"
                  }`}
                >
                  My Orders
                </Link>

                <Link
                  to="/cart"
                  className={`text-decoration-none px-3 py-2 rounded-3 ${
                    location.pathname === "/cart"
                      ? "text-success fw-semibold"
                      : "text-dark"
                  }`}
                >
                  Cart

                  {cartCount > 0 && (
                    <span className="badge bg-success rounded-pill ms-1">
                      {cartCount}
                    </span>
                  )}
                </Link>


                {/* Login + Register */}
                {!isLoggedIn && (
                  <>
                    <Link
                      to="/login"
                      className={`text-decoration-none px-3 py-2 rounded-3 ${
                        location.pathname === "/login"
                          ? "text-success fw-semibold"
                          : "text-dark"
                      }`}
                    >
                      Login
                    </Link>

                    <Link
                      to="/register"
                      className="btn btn-success px-4 py-2 rounded-3 ms-1"
                    >
                      Register
                    </Link>
                  </>
                )}


                {/* Logout */}
                {isLoggedIn && (
                  <button
                    onClick={handleLogout}
                    className="btn btn-outline-success rounded-3 px-3 ms-2"
                  >
                    Logout
                  </button>
                )}

              </>
            )}

          </div>

        </div>

      </div>

    </nav>
  );
}

export default Navbar;