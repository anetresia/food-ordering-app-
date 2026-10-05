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
        // Sales Report
        apiFetch("/reports/sales", {
          headers,
        }),

        // Order Status Report
        // Swagger-la exact endpoint:
        // GET /reports/order-status
        apiFetch("/reports/order-status", {
          headers,
        }),

        // Popular Foods Report
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
    <div>
      {/* Header */}
      <section className="bg-light py-5">
        <div className="container">

          <p className="text-success fw-semibold mb-2">
            Suvai Administration
          </p>

          <h1 className="fw-bold">
            Reports
          </h1>

          <p className="text-muted mb-0">
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
              className="btn btn-outline-success"
            >
              ← Admin Dashboard
            </Link>
          </div>

          {/* Error */}
          {error && (
            <div className="alert alert-danger">
              {error}
            </div>
          )}

          {/* Loading */}
          {loading && (
            <div className="text-center py-5">

              <div className="spinner-border text-success"></div>

              <p className="text-muted mt-3">
                Loading reports...
              </p>

            </div>
          )}

          {/* Report Data */}
          {!loading && !error && (
            <>
              {/* ================= SALES REPORT ================= */}

              <div className="card border-0 shadow-sm rounded-4 mb-4">

                <div className="card-body p-4">

                  <h4 className="fw-bold mb-4">
                    Sales Report
                  </h4>

                  <div className="row g-4">

                    {/* Total Orders */}
                    <div className="col-md-4">

                      <p className="text-muted mb-1">
                        Total Orders
                      </p>

                      <h3 className="fw-bold">
                        {sales?.total_orders ?? 0}
                      </h3>

                    </div>

                    {/* Total Revenue */}
                    <div className="col-md-4">

                      <p className="text-muted mb-1">
                        Total Revenue
                      </p>

                      <h3 className="fw-bold text-success">
                        Rs.{" "}
                        {Number(
                          sales?.total_revenue ?? 0
                        ).toFixed(2)}
                      </h3>

                    </div>

                    {/* Average Order */}
                    <div className="col-md-4">

                      <p className="text-muted mb-1">
                        Average Order
                      </p>

                      <h3 className="fw-bold">
                        Rs.{" "}
                        {Number(
                          sales?.average_order_value ?? 0
                        ).toFixed(2)}
                      </h3>

                    </div>

                  </div>

                </div>

              </div>

              {/* ================= ORDER STATUS ================= */}

              <div className="card border-0 shadow-sm rounded-4 mb-4">

                <div className="card-body p-4">

                  <h4 className="fw-bold mb-4">
                    Order Status Report
                  </h4>

                  <div className="row g-4">

                    {/* Pending */}
                    <div className="col-md-4">

                      <div className="p-3 bg-light rounded-4">

                        <p className="text-muted mb-1">
                          Pending
                        </p>

                        <h3 className="fw-bold">
                          {statusReport?.pending ??
                            statusReport?.pending_orders ??
                            0}
                        </h3>

                      </div>

                    </div>

                    {/* Delivered */}
                    <div className="col-md-4">

                      <div className="p-3 bg-light rounded-4">

                        <p className="text-muted mb-1">
                          Delivered
                        </p>

                        <h3 className="fw-bold">
                          {statusReport?.delivered ??
                            statusReport?.delivered_orders ??
                            0}
                        </h3>

                      </div>

                    </div>

                    {/* Cancelled */}
                    <div className="col-md-4">

                      <div className="p-3 bg-light rounded-4">

                        <p className="text-muted mb-1">
                          Cancelled
                        </p>

                        <h3 className="fw-bold">
                          {statusReport?.cancelled ??
                            statusReport?.cancelled_orders ??
                            0}
                        </h3>

                      </div>

                    </div>

                  </div>

                </div>

              </div>

              {/* ================= POPULAR FOODS ================= */}

              <div className="card border-0 shadow-sm rounded-4">

                <div className="card-body p-4">

                  <h4 className="fw-bold mb-4">
                    Popular Foods
                  </h4>

                  {Array.isArray(popularFoods) &&
                    popularFoods.length > 0 && (

                      <div className="table-responsive">

                        <table className="table align-middle">

                          <thead>
                            <tr>
                              <th>Food</th>
                              <th>Quantity Ordered</th>
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

                                  <td className="fw-semibold">
                                    {food.name ||
                                      food.food_name ||
                                      `Food #${
                                        food.food_id || "-"
                                      }`}
                                  </td>

                                  <td>
                                    {food.quantity ||
                                      food.total_quantity ||
                                      food.ordered_quantity ||
                                      0}
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
                    <p className="text-muted mb-0">
                      No popular food data available.
                    </p>
                  )}

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