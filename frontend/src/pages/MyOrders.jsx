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
              Your orders
            </small>
          </div>

          <h1
            className="fw-bold mb-2"
            style={{
              fontSize: "clamp(2rem, 5vw, 3.2rem)",
            }}
          >
            My Orders
          </h1>

          <p className="text-muted fs-5 mb-0">
            View your previous food orders.
          </p>

        </div>

      </section>


      {/* Orders */}
      <section className="py-5">

        <div className="container">

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
                Loading your orders...
              </p>

            </div>

          )}


          {/* Error */}
          {error && (

            <div className="alert alert-danger rounded-4">
              {error}
            </div>

          )}


          {/* No Orders */}
          {!loading &&
            !error &&
            orders.length === 0 && (

              <div
                className="text-center py-5 px-3 rounded-4"
                style={{
                  backgroundColor: "#fafafa",
                  border: "1px solid #eeeeee",
                }}
              >

                <div
                  className="mx-auto mb-4 d-flex align-items-center justify-content-center rounded-circle"
                  style={{
                    width: "85px",
                    height: "85px",
                    backgroundColor: "#e8f5ec",
                  }}
                >
                  <span
                    className="fw-bold"
                    style={{
                      color: "#198754",
                      fontSize: "1rem",
                    }}
                  >
                    Orders
                  </span>
                </div>

                <h4 className="fw-bold mb-2">
                  No orders yet
                </h4>

                <p className="text-muted mb-4">
                  Your previous orders will appear here.
                </p>

                <button
                  className="btn btn-success px-4 py-2 rounded-3"
                  onClick={() =>
                    navigate("/menu")
                  }
                >
                  Browse Menu
                </button>

              </div>

            )}


          {/* Orders List */}
          {!loading &&
            orders.length > 0 && (

              <div className="row g-4">

                {orders.map(
                  (order) => (

                    <div
                      className="col-md-6 col-lg-4"
                      key={order.id}
                    >

                      <div
                        className="card h-100 border-0 shadow-sm rounded-4"
                        style={{
                          transition:
                            "transform 0.2s ease",
                        }}
                      >

                        <div className="card-body p-4">

                          {/* Order Header */}
                          <div className="d-flex justify-content-between align-items-start gap-2">

                            <div>

                              <p className="text-success small fw-semibold mb-1">
                                ORDER
                              </p>

                              <h5 className="fw-bold mb-0">
                                #{order.id}
                              </h5>

                            </div>

                            <span className="badge bg-warning text-dark rounded-pill px-3 py-2">
                              {order.status}
                            </span>

                          </div>


                          {/* Date */}
                          <p className="text-muted small mt-3 mb-0">

                            {order.created_at
                              ? new Date(
                                  order.created_at
                                ).toLocaleString()
                              : ""}

                          </p>


                          <hr className="my-4" />


                          {/* Total */}
                          <div className="d-flex justify-content-between align-items-center">

                            <span className="text-muted">
                              Total Amount
                            </span>

                            <span className="fw-bold text-success fs-5">
                              Rs.{" "}
                              {Number(
                                order.total_amount
                              ).toFixed(2)}
                            </span>

                          </div>


                          {/* Order Again */}
                          <button
                            className="btn btn-outline-success w-100 mt-4 py-2 rounded-3 fw-semibold"
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