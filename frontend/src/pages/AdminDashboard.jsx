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
      <div className="container py-5">
        <div
          className="text-center py-5 rounded-4"
          style={{
            backgroundColor: "#f8faf8",
          }}
        >
          <div className="spinner-border text-success"></div>

          <p className="text-muted mt-3 mb-0">
            Loading dashboard...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white">

      {/* Header */}
      <section
        className="py-5"
        style={{
          background:
            "linear-gradient(135deg, #f3f8f4 0%, #fff8f0 100%)",
        }}
      >
        <div className="container py-3">

          <div
            className="d-inline-block px-3 py-2 rounded-pill mb-3"
            style={{
              backgroundColor: "#e8f5ec",
              color: "#198754",
            }}
          >
            <small className="fw-semibold">
              Suvai Administration
            </small>
          </div>

          <h1
            className="fw-bold mb-2"
            style={{
              fontSize: "clamp(2rem, 5vw, 3.2rem)",
            }}
          >
            Admin Dashboard
          </h1>

          <p className="text-muted fs-5 mb-0">
            Manage your food ordering system.
          </p>

        </div>
      </section>


      {/* Error */}
      {error && (
        <div className="container py-4">
          <div className="alert alert-danger rounded-4">
            {error}
          </div>
        </div>
      )}


      {dashboard && (
        <section className="py-5">

          <div className="container">

            {/* Admin Navigation */}
            <div className="card border-0 shadow-sm rounded-4 mb-5">

              <div className="card-body p-4 p-lg-5">

                <div className="mb-4">

                  <p className="text-success fw-semibold small mb-2">
                    MANAGEMENT
                  </p>

                  <h4 className="fw-bold mb-1">
                    Manage Your System
                  </h4>

                  <p className="text-muted mb-0">
                    Access and manage the main sections of Suvai.
                  </p>

                </div>

                <div className="row g-3">

                  <div className="col-md-6 col-lg-3">
                    <Link
                      to="/admin/foods"
                      className="btn btn-success w-100 py-3 rounded-3 fw-semibold"
                    >
                      Manage Foods
                    </Link>
                  </div>

                  <div className="col-md-6 col-lg-3">
                    <Link
                      to="/admin/categories"
                      className="btn btn-success w-100 py-3 rounded-3 fw-semibold"
                    >
                      Manage Categories
                    </Link>
                  </div>

                  <div className="col-md-6 col-lg-3">
                    <Link
                      to="/admin/orders"
                      className="btn btn-success w-100 py-3 rounded-3 fw-semibold"
                    >
                      Manage Orders
                    </Link>
                  </div>

                  <div className="col-md-6 col-lg-3">
                    <Link
                      to="/admin/reports"
                      className="btn btn-outline-success w-100 py-3 rounded-3 fw-semibold"
                    >
                      View Reports
                    </Link>
                  </div>

                </div>

              </div>

            </div>


            {/* Dashboard Statistics */}
            <div className="mb-4">

              <p className="text-success fw-semibold small mb-2">
                OVERVIEW
              </p>

              <h3 className="fw-bold mb-1">
                Business Overview
              </h3>

              <p className="text-muted">
                A quick summary of your food ordering system.
              </p>

            </div>


            <div className="row g-4">

              {/* Total Foods */}
              <div className="col-md-6 col-lg-3">

                <div className="card border-0 shadow-sm rounded-4 h-100">

                  <div className="card-body p-4">

                    <p className="text-muted mb-2">
                      Total Foods
                    </p>

                    <h2 className="fw-bold mb-0">
                      {dashboard.total_foods}
                    </h2>

                    <small className="text-success">
                      Food items
                    </small>

                  </div>

                </div>

              </div>


              {/* Categories */}
              <div className="col-md-6 col-lg-3">

                <div className="card border-0 shadow-sm rounded-4 h-100">

                  <div className="card-body p-4">

                    <p className="text-muted mb-2">
                      Categories
                    </p>

                    <h2 className="fw-bold mb-0">
                      {dashboard.total_categories}
                    </h2>

                    <small className="text-success">
                      Food categories
                    </small>

                  </div>

                </div>

              </div>


              {/* Customers */}
              <div className="col-md-6 col-lg-3">

                <div className="card border-0 shadow-sm rounded-4 h-100">

                  <div className="card-body p-4">

                    <p className="text-muted mb-2">
                      Customers
                    </p>

                    <h2 className="fw-bold mb-0">
                      {dashboard.total_customers}
                    </h2>

                    <small className="text-success">
                      Registered customers
                    </small>

                  </div>

                </div>

              </div>


              {/* Orders */}
              <div className="col-md-6 col-lg-3">

                <div className="card border-0 shadow-sm rounded-4 h-100">

                  <div className="card-body p-4">

                    <p className="text-muted mb-2">
                      Orders
                    </p>

                    <h2 className="fw-bold mb-0">
                      {dashboard.total_orders}
                    </h2>

                    <small className="text-success">
                      Total orders
                    </small>

                  </div>

                </div>

              </div>


              {/* Revenue */}
              <div className="col-md-6 col-lg-4">

                <div className="card border-0 shadow-sm rounded-4 h-100">

                  <div className="card-body p-4">

                    <p className="text-muted mb-2">
                      Total Revenue
                    </p>

                    <h3 className="fw-bold text-success mb-1">
                      Rs.{" "}
                      {Number(
                        dashboard.total_revenue
                      ).toFixed(2)}
                    </h3>

                    <small className="text-muted">
                      Overall sales revenue
                    </small>

                  </div>

                </div>

              </div>


              {/* Pending Orders */}
              <div className="col-md-6 col-lg-4">

                <div className="card border-0 shadow-sm rounded-4 h-100">

                  <div className="card-body p-4">

                    <p className="text-muted mb-2">
                      Pending Orders
                    </p>

                    <h3 className="fw-bold mb-1">
                      {dashboard.pending_orders}
                    </h3>

                    <small className="text-muted">
                      Orders waiting for processing
                    </small>

                  </div>

                </div>

              </div>


              {/* Delivered Orders */}
              <div className="col-md-6 col-lg-4">

                <div className="card border-0 shadow-sm rounded-4 h-100">

                  <div className="card-body p-4">

                    <p className="text-muted mb-2">
                      Delivered Orders
                    </p>

                    <h3 className="fw-bold text-success mb-1">
                      {dashboard.delivered_orders}
                    </h3>

                    <small className="text-muted">
                      Successfully delivered orders
                    </small>

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