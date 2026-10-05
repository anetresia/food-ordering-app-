import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { apiFetch } from "../api/api";

function OrderManagement() {
  const [orders, setOrders] = useState([]);

  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const statuses = [
    "Pending",
    "Confirmed",
    "Preparing",
    "Out for Delivery",
    "Delivered",
    "Cancelled",
  ];

  useEffect(() => {
    getOrders();
  }, []);

  async function getOrders() {
    try {
      setLoading(true);
      setError("");

      const token = localStorage.getItem("token");

      if (!token) {
        setError("Please login as admin.");
        return;
      }

      const data = await apiFetch("/orders/", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setOrders(data);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  }

  async function updateStatus(orderId, status) {
    try {
      setUpdatingId(orderId);
      setError("");
      setSuccess("");

      const token = localStorage.getItem("token");

      await apiFetch(`/orders/${orderId}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          status,
        }),
      });

      setSuccess(
        `Order #${orderId} status updated successfully.`
      );

      await getOrders();
    } catch (error) {
      setError(error.message);
    } finally {
      setUpdatingId(null);
    }
  }

  async function deleteOrder(orderId) {
    const confirmed = window.confirm(
      `Are you sure you want to delete Order #${orderId}?`
    );

    if (!confirmed) {
      return;
    }

    try {
      setError("");
      setSuccess("");

      const token = localStorage.getItem("token");

      await apiFetch(`/orders/${orderId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setSuccess(
        `Order #${orderId} deleted successfully.`
      );

      await getOrders();
    } catch (error) {
      setError(error.message);
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
            Order Management
          </h1>

          <p className="text-muted fs-5 mb-0">
            View customer orders and update order status.
          </p>

        </div>
      </section>


      {/* Main Content */}
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


          {/* Messages */}
          {error && (
            <div className="alert alert-danger rounded-4">
              {error}
            </div>
          )}

          {success && (
            <div className="alert alert-success rounded-4">
              {success}
            </div>
          )}


          {/* Page Heading */}
          {!loading && orders.length > 0 && (
            <div className="d-flex justify-content-between align-items-end mb-4">

              <div>
                <p className="text-success fw-semibold small mb-2">
                  CUSTOMER ORDERS
                </p>

                <h3 className="fw-bold mb-1">
                  All Orders
                </h3>

                <p className="text-muted mb-0">
                  Manage order status and customer orders.
                </p>
              </div>

              <span
                className="badge rounded-pill px-3 py-2"
                style={{
                  backgroundColor: "#e8f5ec",
                  color: "#198754",
                }}
              >
                {orders.length} orders
              </span>

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
                Loading orders...
              </p>

            </div>
          )}


          {/* Orders Table */}
          {!loading &&
            orders.length > 0 && (

              <div className="card border-0 shadow-sm rounded-4 overflow-hidden">

                <div className="table-responsive">

                  <table className="table table-hover align-middle mb-0">

                    <thead
                      style={{
                        backgroundColor: "#f8faf8",
                      }}
                    >

                      <tr>
                        <th className="px-4 py-3">
                          Order
                        </th>

                        <th className="py-3">
                          Customer
                        </th>

                        <th className="py-3">
                          Date
                        </th>

                        <th className="py-3">
                          Total
                        </th>

                        <th className="py-3">
                          Status
                        </th>

                        <th className="py-3 pe-4">
                          Action
                        </th>
                      </tr>

                    </thead>


                    <tbody>

                      {orders.map((order) => (

                        <tr key={order.id}>

                          <td className="px-4">

                            <span className="fw-bold">
                              #{order.id}
                            </span>

                          </td>


                          <td>

                            <span className="text-muted">
                              Customer #{order.customer_id}
                            </span>

                          </td>


                          <td>

                            <small className="text-muted">
                              {order.created_at
                                ? new Date(
                                    order.created_at
                                  ).toLocaleString()
                                : "-"}
                            </small>

                          </td>


                          <td>

                            <span className="fw-bold text-success">
                              Rs.{" "}
                              {Number(
                                order.total_amount
                              ).toFixed(2)}
                            </span>

                          </td>


                          <td>

                            <select
                              className="form-select rounded-3"
                              style={{
                                minWidth: "160px",
                              }}
                              value={order.status}
                              onChange={(e) =>
                                updateStatus(
                                  order.id,
                                  e.target.value
                                )
                              }
                              disabled={
                                updatingId ===
                                order.id
                              }
                            >

                              {statuses.map(
                                (status) => (
                                  <option
                                    key={status}
                                    value={status}
                                  >
                                    {status}
                                  </option>
                                )
                              )}

                            </select>

                          </td>


                          <td className="pe-4">

                            <button
                              className="btn btn-sm btn-outline-danger rounded-3"
                              onClick={() =>
                                deleteOrder(
                                  order.id
                                )
                              }
                            >
                              Delete
                            </button>

                          </td>

                        </tr>

                      ))}

                    </tbody>

                  </table>

                </div>

              </div>

            )}


          {/* Empty State */}
          {!loading &&
            orders.length === 0 && (

              <div
                className="text-center py-5 rounded-4"
                style={{
                  backgroundColor: "#fafafa",
                  border: "1px solid #eeeeee",
                }}
              >

                <h4 className="fw-bold mt-2">
                  No orders found
                </h4>

                <p className="text-muted mb-0">
                  Customer orders will appear here.
                </p>

              </div>

            )}

        </div>
      </section>

    </div>
  );
}

export default OrderManagement;