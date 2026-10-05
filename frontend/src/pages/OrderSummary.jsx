import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { apiFetch } from "../api/api";

function OrderSummary() {
  const { orderId } = useParams();

  const [order, setOrder] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getOrder();
  }, [orderId]);

  async function getOrder() {
    try {
      setLoading(true);
      setError("");

      const token = localStorage.getItem("token");

      if (!token) {
        setError("Please login to view your order.");
        return;
      }

      const data = await apiFetch(`/orders/${orderId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setOrder(data);
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
            Loading your order...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container py-5">
        <div className="alert alert-danger rounded-4">
          {error}
        </div>
      </div>
    );
  }

  if (!order) {
    return null;
  }

  return (
    <div className="bg-white">

      {/* Success Header */}
      <section
        className="py-5"
        style={{
          background:
            "linear-gradient(135deg, #f3f8f4 0%, #fff8f0 100%)",
        }}
      >
        <div className="container text-center py-4">

          {/* Success Icon */}
          <div
            className="mx-auto mb-4 d-flex align-items-center justify-content-center rounded-circle"
            style={{
              width: "80px",
              height: "80px",
              backgroundColor: "#dff3e5",
            }}
          >
            <span
              className="fw-bold"
              style={{
                color: "#198754",
                fontSize: "1.1rem",
              }}
            >
              Done
            </span>
          </div>

          <h1
            className="fw-bold mb-3"
            style={{ fontSize: "clamp(2rem, 5vw, 3rem)" }}
          >
            Order Placed Successfully!
          </h1>

          <p className="text-muted fs-5 mb-0">
            Thank you for ordering from Suvai.
          </p>

        </div>
      </section>


      {/* Order Details */}
      <section className="py-5">
        <div className="container">

          <div className="row justify-content-center">

            <div className="col-lg-7">

              <div className="card border-0 shadow-sm rounded-4">

                <div className="card-body p-4 p-lg-5">

                  <div className="mb-4">

                    <p className="text-success fw-semibold small mb-2">
                      ORDER DETAILS
                    </p>

                    <div className="d-flex justify-content-between align-items-start gap-3">

                      <div>

                        <h4 className="fw-bold mb-2">
                          Order #{order.id}
                        </h4>

                        <small className="text-muted">
                          {new Date(
                            order.created_at
                          ).toLocaleString()}
                        </small>

                      </div>

                      <span className="badge bg-warning text-dark rounded-pill px-3 py-2">
                        {order.status}
                      </span>

                    </div>

                  </div>


                  <hr className="my-4" />


                  {/* Order Status */}
                  <div
                    className="p-3 rounded-3 mb-4"
                    style={{
                      backgroundColor: "#f8faf8",
                    }}
                  >
                    <div className="d-flex justify-content-between align-items-center">

                      <div>
                        <small className="text-muted d-block">
                          Current Status
                        </small>

                        <span className="fw-semibold">
                          {order.status}
                        </span>
                      </div>

                      <span className="text-success fw-semibold">
                        Processing
                      </span>

                    </div>
                  </div>


                  {/* Total */}
                  <div className="d-flex justify-content-between align-items-center">

                    <span className="fw-bold fs-5">
                      Total Amount
                    </span>

                    <span className="fw-bold text-success fs-4">
                      Rs.{" "}
                      {Number(
                        order.total_amount
                      ).toFixed(2)}
                    </span>

                  </div>

                </div>

              </div>


              {/* Navigation Buttons */}
              <div className="d-flex justify-content-center gap-2 flex-wrap mt-4">

                <Link
                  to="/menu"
                  className="btn btn-success px-4 py-2 rounded-3"
                >
                  Continue Shopping
                </Link>

                <Link
                  to="/"
                  className="btn btn-outline-success px-4 py-2 rounded-3"
                >
                  Back to Home
                </Link>

              </div>

            </div>

          </div>

        </div>
      </section>

    </div>
  );
}

export default OrderSummary;