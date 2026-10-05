import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { apiFetch } from "../api/api";

function Reports() {
  const [sales, setSales] = useState(null);
  const [statusReport, setStatusReport] = useState(null);
  const [popularFoods, setPopularFoods] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    getReports();
  }, []);

  async function getReports() {
    try {
      setLoading(true);
      setError("");

      const token = localStorage.getItem("token");

      if (!token) {
        setError("Please login as admin.");
        return;
      }

      const headers = {
        Authorization: `Bearer ${token}`,
      };

      const [
        salesData,
        statusData,
        popularData,
      ] = await Promise.all([
        apiFetch("/reports/sales", {
          headers,
        }),

        apiFetch("/reports/order-status", {
          headers,
        }),

        apiFetch("/reports/popular-foods", {
          headers,
        }),
      ]);

      setSales(salesData);
      setStatusReport(statusData);
      setPopularFoods(popularData);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
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
            Reports
          </h1>

          <p className="text-muted fs-5 mb-0">
            View sales, order status and popular food reports.
          </p>

        </div>
      </section>


      {/* Reports Content */}
      <section className="py-5">
        <div className="container">

          {/* Back Button */}
          <div className="mb-4">
            <Link
              to="/admin"
              className="btn btn-outline-success rounded-3 px-4"
            >
              ← Admin Dashboard
            </Link>
          </div>


          {/* Error */}
          {error && (
            <div className="alert alert-danger rounded-4">
              {error}
            </div>
          )}


          {/* Loading */}
          {loading && (
            <div
              className="text-center py-5 rounded-4"
              style={{
                backgroundColor: "#f8faf8",
              }}
            >

              <div className="spinner-border text-success"></div>

              <p className="text-muted mt-3 mb-0">
                Loading reports...
              </p>

            </div>
          )}


          {/* Report Data */}
          {!loading && !error && (
            <>

              {/* ================= SALES REPORT ================= */}

              <div className="mb-5">

                <div className="mb-4">

                  <p className="text-success fw-semibold small mb-2">
                    SALES OVERVIEW
                  </p>

                  <h3 className="fw-bold mb-1">
                    Sales Report
                  </h3>

                  <p className="text-muted mb-0">
                    Summary of your order and revenue performance.
                  </p>

                </div>


                <div className="row g-4">

                  {/* Total Orders */}
                  <div className="col-md-4">

                    <div className="card border-0 shadow-sm rounded-4 h-100">

                      <div className="card-body p-4">

                        <p className="text-muted mb-2">
                          Total Orders
                        </p>

                        <h3 className="fw-bold mb-0">
                          {sales?.total_orders ?? 0}
                        </h3>

                      </div>

                    </div>

                  </div>


                  {/* Total Revenue */}
                  <div className="col-md-4">

                    <div className="card border-0 shadow-sm rounded-4 h-100">

                      <div className="card-body p-4">

                        <p className="text-muted mb-2">
                          Total Revenue
                        </p>

                        <h3 className="fw-bold text-success mb-0">
                          Rs.{" "}
                          {Number(
                            sales?.total_revenue ?? 0
                          ).toFixed(2)}
                        </h3>

                      </div>

                    </div>

                  </div>


                  {/* Average Order */}
                  <div className="col-md-4">

                    <div className="card border-0 shadow-sm rounded-4 h-100">

                      <div className="card-body p-4">

                        <p className="text-muted mb-2">
                          Average Order
                        </p>

                        <h3 className="fw-bold mb-0">
                          Rs.{" "}
                          {Number(
                            sales?.average_order_value ?? 0
                          ).toFixed(2)}
                        </h3>

                      </div>

                    </div>

                  </div>

                </div>

              </div>


              {/* ================= ORDER STATUS ================= */}

              <div className="mb-5">

                <div className="mb-4">

                  <p className="text-success fw-semibold small mb-2">
                    ORDER OVERVIEW
                  </p>

                  <h3 className="fw-bold mb-1">
                    Order Status Report
                  </h3>

                  <p className="text-muted mb-0">
                    Current status of customer orders.
                  </p>

                </div>


                <div className="row g-4">

                  {/* Pending */}
                  <div className="col-md-4">

                    <div className="card border-0 shadow-sm rounded-4 h-100">

                      <div className="card-body p-4">

                        <p className="text-muted mb-2">
                          Pending
                        </p>

                        <h3 className="fw-bold mb-0">
                          {statusReport?.pending ??
                            statusReport?.pending_orders ??
                            0}
                        </h3>

                        <small className="text-muted">
                          Orders awaiting processing
                        </small>

                      </div>

                    </div>

                  </div>


                  {/* Delivered */}
                  <div className="col-md-4">

                    <div className="card border-0 shadow-sm rounded-4 h-100">

                      <div className="card-body p-4">

                        <p className="text-muted mb-2">
                          Delivered
                        </p>

                        <h3 className="fw-bold text-success mb-0">
                          {statusReport?.delivered ??
                            statusReport?.delivered_orders ??
                            0}
                        </h3>

                        <small className="text-muted">
                          Successfully delivered
                        </small>

                      </div>

                    </div>

                  </div>


                  {/* Cancelled */}
                  <div className="col-md-4">

                    <div className="card border-0 shadow-sm rounded-4 h-100">

                      <div className="card-body p-4">

                        <p className="text-muted mb-2">
                          Cancelled
                        </p>

                        <h3 className="fw-bold mb-0">
                          {statusReport?.cancelled ??
                            statusReport?.cancelled_orders ??
                            0}
                        </h3>

                        <small className="text-muted">
                          Cancelled orders
                        </small>

                      </div>

                    </div>

                  </div>

                </div>

              </div>


              {/* ================= POPULAR FOODS ================= */}

              <div>

                <div className="mb-4">

                  <p className="text-success fw-semibold small mb-2">
                    FOOD PERFORMANCE
                  </p>

                  <h3 className="fw-bold mb-1">
                    Popular Foods
                  </h3>

                  <p className="text-muted mb-0">
                    Food items ranked by quantity ordered.
                  </p>

                </div>


                <div className="card border-0 shadow-sm rounded-4 overflow-hidden">

                  <div className="card-body p-0">

                    {Array.isArray(popularFoods) &&
                      popularFoods.length > 0 && (

                        <div className="table-responsive">

                          <table className="table align-middle mb-0">

                            <thead
                              style={{
                                backgroundColor: "#f8faf8",
                              }}
                            >

                              <tr>

                                <th className="px-4 py-3">
                                  Food
                                </th>

                                <th className="py-3">
                                  Quantity Ordered
                                </th>

                              </tr>

                            </thead>


                            <tbody>

                              {popularFoods.map(
                                (food, index) => (

                                  <tr
                                    key={
                                      food.id ||
                                      food.food_id ||
                                      index
                                    }
                                  >

                                    <td className="px-4">

                                      <span className="fw-semibold">
                                        {food.name ||
                                          food.food_name ||
                                          `Food #${
                                            food.food_id || "-"
                                          }`}
                                      </span>

                                    </td>

                                    <td>

                                      <span
                                        className="badge rounded-pill px-3 py-2"
                                        style={{
                                          backgroundColor:
                                            "#e8f5ec",
                                          color: "#198754",
                                        }}
                                      >
                                        {food.quantity ||
                                          food.total_quantity ||
                                          food.ordered_quantity ||
                                          0}
                                      </span>

                                    </td>

                                  </tr>

                                )
                              )}

                            </tbody>

                          </table>

                        </div>

                      )}


                    {(!Array.isArray(popularFoods) ||
                      popularFoods.length === 0) && (

                      <div className="text-center py-5">

                        <h5 className="fw-bold">
                          No popular food data available.
                        </h5>

                        <p className="text-muted mb-0">
                          Popular food information will appear here.
                        </p>

                      </div>

                    )}

                  </div>

                </div>

              </div>

            </>
          )}

        </div>
      </section>

    </div>
  );
}

export default Reports;