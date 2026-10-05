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
      <div className="container py-5 text-center">
        <div className="spinner-border text-success"></div>

        <p className="text-muted mt-3">
          Loading your order...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container py-5">
        <div className="alert alert-danger">
          {error}
        </div>
      </div>
    );
  }

  if (!order) {
    return null;
  }

  return (
    <div>

      {/* Success Header */}
      <section className="bg-light py-5">
        <div className="container text-center">

          <div className="display-3 mb-3">
            ✅
          </div>

          <h1 className="fw-bold">
            Order Placed Successfully!
          </h1>

          <p className="text-muted">
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

                <div className="card-body p-4">

                  <div className="d-flex justify-content-between align-items-center mb-4">

                    <div>
                      <h4 className="fw-bold mb-1">
                        Order #{order.id}
                      </h4>

                      <small className="text-muted">
                        {new Date(
                          order.created_at
                        ).toLocaleString()}
                      </small>
                    </div>

                    <span className="badge bg-warning text-dark">
                      {order.status}
                    </span>

                  </div>

                  <hr />

                  <div className="d-flex justify-content-between">

                    <span className="fw-semibold">
                      Total Amount
                    </span>

                    <span className="fw-bold text-success fs-5">
                      Rs.{" "}
                      {Number(
                        order.total_amount
                      ).toFixed(2)}
                    </span>

                  </div>

                </div>

              </div>


              <div className="text-center mt-4">

                <Link
                  to="/menu"
                  className="btn btn-success me-2"
                >
                  Continue Shopping
                </Link>

                <Link
                  to="/"
                  className="btn btn-outline-success"
                >
                  Home
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