import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";

function Navbar() {
  const { cartItems } = useCart();
  const location = useLocation();
  const navigate = useNavigate();

  const [menuOpen, setMenuOpen] = useState(false);

  const cartCount = cartItems.reduce(
    (total, item) => total + item.quantity,
    0
  );

  const user = JSON.parse(localStorage.getItem("user") || "null");
  const token = localStorage.getItem("token");

  const isLoggedIn = Boolean(token);
  const isAdmin = user?.role === "admin";

  function handleLogout() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setMenuOpen(false);
    navigate("/login");
  }

  function navClass(path) {
    return `nav-link px-3 py-2 rounded-3 ${
      location.pathname === path
        ? "text-success fw-semibold"
        : "text-dark"
    }`;
  }

  function closeMenu() {
    setMenuOpen(false);
  }

  return (
    <nav
      className="navbar navbar-expand-lg bg-white border-bottom sticky-top"
      style={{
        boxShadow: "0 2px 12px rgba(0, 0, 0, 0.04)",
      }}
    >
      <div className="container py-2">
        <Link
          to={isAdmin ? "/admin" : "/"}
          className="navbar-brand fw-bold fs-3 text-success mb-0"
          onClick={closeMenu}
        >
          Suvai
        </Link>

        <button
          className="navbar-toggler"
          type="button"
          aria-label="Toggle navigation"
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen(!menuOpen)}
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div
          className={`collapse navbar-collapse ${
            menuOpen ? "show" : ""
          }`}
        >
          <div className="navbar-nav ms-auto align-items-lg-center gap-lg-2 pt-3 pt-lg-0">
            {isLoggedIn && isAdmin ? (
              <>
                <Link
                  to="/admin"
                  className={navClass("/admin")}
                  onClick={closeMenu}
                >
                  Dashboard
                </Link>

                <Link
                  to="/admin/foods"
                  className={navClass("/admin/foods")}
                  onClick={closeMenu}
                >
                  Foods
                </Link>

                <Link
                  to="/admin/categories"
                  className={navClass("/admin/categories")}
                  onClick={closeMenu}
                >
                  Categories
                </Link>

                <Link
                  to="/admin/orders"
                  className={navClass("/admin/orders")}
                  onClick={closeMenu}
                >
                  Orders
                </Link>

                <Link
                  to="/admin/reports"
                  className={navClass("/admin/reports")}
                  onClick={closeMenu}
                >
                  Reports
                </Link>

                <button
                  onClick={handleLogout}
                  className="btn btn-outline-success rounded-3 px-3 my-2 my-lg-0"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/"
                  className={navClass("/")}
                  onClick={closeMenu}
                >
                  Home
                </Link>

                <Link
                  to="/menu"
                  className={navClass("/menu")}
                  onClick={closeMenu}
                >
                  Menu
                </Link>

                <Link
                  to="/my-orders"
                  className={navClass("/my-orders")}
                  onClick={closeMenu}
                >
                  My Orders
                </Link>

                <Link
                  to="/cart"
                  className={navClass("/cart")}
                  onClick={closeMenu}
                >
                  Cart
                  {cartCount > 0 && (
                    <span className="badge bg-success rounded-pill ms-2">
                      {cartCount}
                    </span>
                  )}
                </Link>

                {!isLoggedIn && (
                  <>
                    <Link
                      to="/login"
                      className={navClass("/login")}
                      onClick={closeMenu}
                    >
                      Login
                    </Link>

                    <Link
                      to="/register"
                      className="btn btn-success px-4 py-2 rounded-3 my-2 my-lg-0 ms-lg-1"
                      onClick={closeMenu}
                    >
                      Register
                    </Link>
                  </>
                )}

                {isLoggedIn && (
                  <button
                    onClick={handleLogout}
                    className="btn btn-outline-success rounded-3 px-3 my-2 my-lg-0"
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