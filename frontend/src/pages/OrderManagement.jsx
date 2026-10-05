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
    <div>
      <section className="bg-light py-5">
        <div className="container">

          <p className="text-success fw-semibold mb-2">
            Suvai Administration
          </p>

          <h1 className="fw-bold">
            Order Management
          </h1>

          <p className="text-muted mb-0">
            View customer orders and update order status.
          </p>

        </div>
      </section>

      <section className="py-5">
        <div className="container">

          <div className="mb-4">
            <Link
              to="/admin"
              className="btn btn-outline-success"
            >
              ← Admin Dashboard
            </Link>
          </div>

          {error && (
            <div className="alert alert-danger">
              {error}
            </div>
          )}

          {success && (
            <div className="alert alert-success">
              {success}
            </div>
          )}

          {loading && (
            <div className="text-center py-5">
              <div className="spinner-border text-success"></div>

              <p className="text-muted mt-3">
                Loading orders...
              </p>
            </div>
          )}

          {!loading &&
            orders.length > 0 && (
              <div className="table-responsive">

                <table className="table table-hover align-middle">

                  <thead className="table-light">

                    <tr>
                      <th>Order</th>
                      <th>Customer</th>
                      <th>Date</th>
                      <th>Total</th>
                      <th>Status</th>
                      <th>Action</th>
                    </tr>

                  </thead>

                  <tbody>

                    {orders.map((order) => (
                      <tr key={order.id}>

                        <td className="fw-bold">
                          #{order.id}
                        </td>

                        <td>
                          Customer #{order.customer_id}
                        </td>

                        <td>
                          {order.created_at
                            ? new Date(
                                order.created_at
                              ).toLocaleString()
                            : "-"}
                        </td>

                        <td className="fw-semibold text-success">
                          Rs.{" "}
                          {Number(
                            order.total_amount
                          ).toFixed(2)}
                        </td>

                        <td>
                          <select
                            className="form-select"
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

                        <td>
                          <button
                            className="btn btn-sm btn-outline-danger"
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
            )}

          {!loading &&
            orders.length === 0 && (
              <div className="text-center py-5">

                <div className="display-3">
                  📦
                </div>

                <h4 className="fw-bold mt-3">
                  No orders found
                </h4>

              </div>
            )}

        </div>
      </section>
    </div>
  );
}

export default OrderManagement;