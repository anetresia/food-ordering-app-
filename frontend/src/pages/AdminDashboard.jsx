import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import { apiFetch } from "../api/api";

function AdminDashboard() {
  const [dashboard, setDashboard] = useState(null);

  const [error, setError] = useState("");

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getDashboard();
  }, []);

  async function getDashboard() {
    try {
      setLoading(true);
      setError("");

      const token = localStorage.getItem("token");

      if (!token) {
        setError("Please login as admin.");
        return;
      }

      const data = await apiFetch("/dashboard/", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setDashboard(data);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="container py-5 text-center">
        <div className="spinner-border text-success"></div>

        <p className="text-muted mt-3">
          Loading dashboard...
        </p>
      </div>
    );
  }

  return (
    <div>

      <section className="bg-light py-5">
        <div className="container">

          <p className="text-success fw-semibold mb-2">
            Suvai Administration
          </p>

          <h1 className="fw-bold">
            Admin Dashboard
          </h1>

          <p className="text-muted">
            Manage your food ordering system.
          </p>

        </div>
      </section>

      {error && (
        <div className="container py-4">

          <div className="alert alert-danger">
            {error}
          </div>

        </div>
      )}

      {dashboard && (
        <section className="py-5">

          <div className="container">

            {/* Admin navigation */}

            <div className="card border-0 shadow-sm rounded-4 mb-5">

              <div className="card-body p-4">

                <h4 className="fw-bold mb-3">
                  Management
                </h4>

                <div className="d-flex flex-wrap gap-2">

                  <Link
                    to="/admin/foods"
                    className="btn btn-success"
                  >
                    🍽️ Manage Foods
                  </Link>

                  <Link
                    to="/admin/categories"
                    className="btn btn-success"
                  >
                    📂 Manage Categories
                  </Link>

                  <Link
                    to="/admin/orders"
                    className="btn btn-success"
                  >
                    📦 Manage Orders
                  </Link>

                  <Link
                    to="/admin/reports"
                    className="btn btn-success"
                  >
                    📊 Reports
                  </Link>

                </div>

              </div>

            </div>

            {/* Dashboard Cards */}

            <div className="row g-4">

              <div className="col-md-6 col-lg-3">

                <div className="card border-0 shadow-sm rounded-4 h-100">

                  <div className="card-body p-4">

                    <div className="fs-2">
                      🍽️
                    </div>

                    <p className="text-muted mb-1">
                      Total Foods
                    </p>

                    <h2 className="fw-bold">
                      {dashboard.total_foods}
                    </h2>

                  </div>

                </div>

              </div>

              <div className="col-md-6 col-lg-3">

                <div className="card border-0 shadow-sm rounded-4 h-100">

                  <div className="card-body p-4">

                    <div className="fs-2">
                      📂
                    </div>

                    <p className="text-muted mb-1">
                      Categories
                    </p>

                    <h2 className="fw-bold">
                      {dashboard.total_categories}
                    </h2>

                  </div>

                </div>

              </div>

              <div className="col-md-6 col-lg-3">

                <div className="card border-0 shadow-sm rounded-4 h-100">

                  <div className="card-body p-4">

                    <div className="fs-2">
                      👥
                    </div>

                    <p className="text-muted mb-1">
                      Customers
                    </p>

                    <h2 className="fw-bold">
                      {dashboard.total_customers}
                    </h2>

                  </div>

                </div>

              </div>

              <div className="col-md-6 col-lg-3">

                <div className="card border-0 shadow-sm rounded-4 h-100">

                  <div className="card-body p-4">

                    <div className="fs-2">
                      📦
                    </div>

                    <p className="text-muted mb-1">
                      Orders
                    </p>

                    <h2 className="fw-bold">
                      {dashboard.total_orders}
                    </h2>

                  </div>

                </div>

              </div>

              <div className="col-md-6 col-lg-4">

                <div className="card border-0 shadow-sm rounded-4">

                  <div className="card-body p-4">

                    <p className="text-muted">
                      Total Revenue
                    </p>

                    <h3 className="fw-bold text-success">
                      Rs.{" "}
                      {Number(
                        dashboard.total_revenue
                      ).toFixed(2)}
                    </h3>

                  </div>

                </div>

              </div>

              <div className="col-md-6 col-lg-4">

                <div className="card border-0 shadow-sm rounded-4">

                  <div className="card-body p-4">

                    <p className="text-muted">
                      Pending Orders
                    </p>

                    <h3 className="fw-bold">
                      {dashboard.pending_orders}
                    </h3>

                  </div>

                </div>

              </div>

              <div className="col-md-6 col-lg-4">

                <div className="card border-0 shadow-sm rounded-4">

                  <div className="card-body p-4">

                    <p className="text-muted">
                      Delivered Orders
                    </p>

                    <h3 className="fw-bold">
                      {dashboard.delivered_orders}
                    </h3>

                  </div>

                </div>

              </div>

            </div>

          </div>

        </section>
      )}

    </div>
  );
}

export default AdminDashboard;