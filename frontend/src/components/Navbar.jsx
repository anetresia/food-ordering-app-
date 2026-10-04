import { Link } from "react-router-dom";

function Navbar() {
  return (
    <nav className="navbar navbar-expand-lg bg-white border-bottom">
      <div className="container py-2">

        <Link
          to="/"
          className="navbar-brand fw-bold fs-3 text-success"
        >
          Suvai
        </Link>

        <div className="d-flex align-items-center gap-3">

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

        </div>

      </div>
    </nav>
  );
}

export default Navbar;
