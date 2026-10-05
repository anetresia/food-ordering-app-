import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { apiFetch } from "../api/api";

function MyOrders() {

  const navigate = useNavigate();

  const [orders, setOrders] = useState([]);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  useEffect(() => {
    getOrders();
  }, []);

  async function getOrders() {

    try {

      setLoading(true);
      setError("");

      const token =
        localStorage.getItem("token");

      if (!token) {

        setError(
          "Please login to view your orders."
        );

        return;
      }

      const data =
        await apiFetch("/orders/", {
          headers: {
            Authorization:
              `Bearer ${token}`,
          },
        });

      setOrders(data);

    } catch (error) {

      setError(
        error.message
      );

    } finally {

      setLoading(false);

    }
  }

  function handleOrderAgain() {

    navigate("/menu");

  }

  return (
    <div>

      <section className="bg-light py-5">

        <div className="container">

          <p className="text-success fw-semibold mb-2">
            Your orders
          </p>

          <h1 className="fw-bold">
            My Orders
          </h1>

          <p className="text-muted mb-0">
            View your previous food orders.
          </p>

        </div>

      </section>

      <section className="py-5">

        <div className="container">

          {loading && (

            <div className="text-center py-5">

              <div className="spinner-border text-success"></div>

              <p className="text-muted mt-3">
                Loading your orders...
              </p>

            </div>

          )}

          {error && (

            <div className="alert alert-danger">
              {error}
            </div>

          )}

          {!loading &&
            !error &&
            orders.length === 0 && (

              <div className="text-center py-5">

                <div className="display-3">
                  📦
                </div>

                <h4 className="fw-bold mt-3">
                  No orders yet
                </h4>

                <button
                  className="btn btn-success mt-2"
                  onClick={() =>
                    navigate("/menu")
                  }
                >
                  Browse Menu
                </button>

              </div>

            )}

          {!loading &&
            orders.length > 0 && (

              <div className="row g-4">

                {orders.map(
                  (order) => (

                    <div
                      className="col-md-6 col-lg-4"
                      key={order.id}
                    >

                      <div className="card h-100 border-0 shadow-sm rounded-4">

                        <div className="card-body p-4">

                          <div className="d-flex justify-content-between align-items-start">

                            <h5 className="fw-bold">
                              Order #{order.id}
                            </h5>

                            <span className="badge bg-warning text-dark">
                              {order.status}
                            </span>

                          </div>

                          <p className="text-muted small mt-2">
                            {order.created_at
                              ? new Date(
                                  order.created_at
                                ).toLocaleString()
                              : ""}
                          </p>

                          <hr />

                          <div className="d-flex justify-content-between">

                            <span className="fw-semibold">
                              Total
                            </span>

                            <span className="fw-bold text-success">
                              Rs.{" "}
                              {Number(
                                order.total_amount
                              ).toFixed(2)}
                            </span>

                          </div>

                          <button
                            className="btn btn-outline-success w-100 mt-4"
                            onClick={
                              handleOrderAgain
                            }
                          >
                            Order Again
                          </button>

                        </div>

                      </div>

                    </div>

                  )
                )}

              </div>

            )}

        </div>

      </section>

    </div>
  );
}

export default MyOrders;