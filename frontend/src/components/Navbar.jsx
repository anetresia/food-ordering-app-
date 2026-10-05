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
    <nav className="navbar bg-white border-bottom">

      <div className="container py-2">

        {/* Logo */}
        <Link
          to={isAdmin ? "/admin" : "/"}
          className="navbar-brand fw-bold fs-3 text-success"
        >
          Suvai
        </Link>

        <div className="d-flex align-items-center gap-3">

          {/* ================= ADMIN NAVBAR ================= */}

          {isLoggedIn && isAdmin ? (
            <>
              <Link
                to="/admin"
                className="text-decoration-none text-dark"
              >
                Dashboard
              </Link>

              <Link
                to="/admin/foods"
                className="text-decoration-none text-dark"
              >
                Foods
              </Link>

              <Link
                to="/admin/categories"
                className="text-decoration-none text-dark"
              >
                Categories
              </Link>

              <Link
                to="/admin/orders"
                className="text-decoration-none text-dark"
              >
                Orders
              </Link>

              <Link
                to="/admin/reports"
                className="text-decoration-none text-dark"
              >
                Reports
              </Link>

              <button
                onClick={handleLogout}
                className="btn btn-outline-success"
              >
                Logout
              </button>
            </>
          ) : (
            /* ================= USER NAVBAR ================= */

            <>
              <Link
                to="/"
                className="text-decoration-none text-dark"
              >
                Home
              </Link>

              <Link
                to="/menu"
                className="text-decoration-none text-dark"
              >
                Menu
              </Link>

              <Link
                to="/my-orders"
                className="text-decoration-none text-dark"
              >
                My Orders
              </Link>

              <Link
                to="/cart"
                className="text-decoration-none text-dark"
              >
                🛒 Cart

                {cartCount > 0 && (
                  <span className="badge bg-success ms-1">
                    {cartCount}
                  </span>
                )}
              </Link>

              {!isLoggedIn && (
                <>
                  <Link
                    to="/login"
                    className="text-decoration-none text-dark"
                  >
                    Login
                  </Link>

                  <Link
                    to="/register"
                    className="btn btn-success px-4"
                  >
                    Register
                  </Link>
                </>
              )}

              {isLoggedIn && (
                <button
                  onClick={handleLogout}
                  className="btn btn-outline-success"
                >
                  Logout
                </button>
              )}
            </>
          )}

        </div>

      </div>

    </nav>
  );
}

export default Navbar;