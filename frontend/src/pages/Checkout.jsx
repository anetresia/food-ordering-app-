import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { apiFetch } from "../api/api";

function Checkout() {
  const navigate = useNavigate();

  const {
    cartItems,
    clearCart,
  } = useCart();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const totalAmount = cartItems.reduce(
    (total, item) =>
      total + Number(item.price) * item.quantity,
    0
  );

  async function handleSubmit(event) {
    event.preventDefault();

    try {
      setLoading(true);
      setError("");

      const token = localStorage.getItem("token");

      if (!token) {
        setError("Please login before placing an order.");
        navigate("/login");
        return;
      }

      if (cartItems.length === 0) {
        setError("Your cart is empty.");
        return;
      }

      let customerId = localStorage.getItem("customer_id");

      // ==========================================
      // STEP 1: Create customer only for first order
      // ==========================================

      if (!customerId) {
        const customer = await apiFetch("/customers/", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            name,
            email,
            phone,
            address,
          }),
        });

        customerId = customer.id;

        // Customer ID save pannuvom
        localStorage.setItem(
          "customer_id",
          customer.id
        );
      }

      // ==========================================
      // STEP 2: Create new order
      // ==========================================

      const order = await apiFetch("/orders/", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          customer_id: Number(customerId),
        }),
      });

      // ==========================================
      // STEP 3: Create order items
      // ==========================================

      for (const item of cartItems) {
        await apiFetch("/order-items/", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            order_id: order.id,
            food_id: item.id,
            quantity: item.quantity,
          }),
        });
      }

      // ==========================================
      // STEP 4: Order successfully created
      // ==========================================

      clearCart();

      localStorage.setItem(
        "last_order_id",
        order.id
      );

      navigate(`/order-summary/${order.id}`);

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
            Almost there
          </p>

          <h1 className="fw-bold">
            Checkout
          </h1>

          <p className="text-muted mb-0">
            Enter your details and place your order.
          </p>

        </div>
      </section>

      {/* Checkout */}
      <section className="py-5">
        <div className="container">

          <div className="row g-4">

            {/* Customer Details */}
            <div className="col-lg-7">

              <div className="card border-0 shadow-sm rounded-4">

                <div className="card-body p-4">

                  <h4 className="fw-bold mb-4">
                    Customer Details
                  </h4>

                  {error && (
                    <div className="alert alert-danger">
                      {error}
                    </div>
                  )}

                  <form onSubmit={handleSubmit}>

                    {/* Name */}
                    <div className="mb-3">

                      <label className="form-label fw-semibold">
                        Full Name
                      </label>

                      <input
                        type="text"
                        className="form-control"
                        placeholder="Enter your name"
                        value={name}
                        onChange={(e) =>
                          setName(e.target.value)
                        }
                        required
                      />

                    </div>

                    {/* Email */}
                    <div className="mb-3">

                      <label className="form-label fw-semibold">
                        Email
                      </label>

                      <input
                        type="email"
                        className="form-control"
                        placeholder="Enter your email"
                        value={email}
                        onChange={(e) =>
                          setEmail(e.target.value)
                        }
                        required
                      />

                    </div>

                    {/* Phone */}
                    <div className="mb-3">

                      <label className="form-label fw-semibold">
                        Phone
                      </label>

                      <input
                        type="tel"
                        className="form-control"
                        placeholder="Enter your phone number"
                        value={phone}
                        onChange={(e) =>
                          setPhone(e.target.value)
                        }
                        required
                      />

                    </div>

                    {/* Address */}
                    <div className="mb-4">

                      <label className="form-label fw-semibold">
                        Delivery Address
                      </label>

                      <textarea
                        className="form-control"
                        rows="4"
                        placeholder="Enter your delivery address"
                        value={address}
                        onChange={(e) =>
                          setAddress(e.target.value)
                        }
                        required
                      ></textarea>

                    </div>

                    <button
                      type="submit"
                      className="btn btn-success w-100 py-2"
                      disabled={loading}
                    >
                      {loading
                        ? "Placing Order..."
                        : "Place Order"}
                    </button>

                  </form>

                </div>

              </div>

            </div>

            {/* Order Summary */}
            <div className="col-lg-5">

              <div className="card border-0 shadow-sm rounded-4">

                <div className="card-body p-4">

                  <h4 className="fw-bold mb-4">
                    Order Summary
                  </h4>

                  {cartItems.map((item) => (

                    <div
                      key={item.id}
                      className="d-flex justify-content-between mb-3"
                    >

                      <div>

                        <h6 className="fw-semibold mb-1">
                          {item.name}
                        </h6>

                        <small className="text-muted">
                          {item.quantity} × Rs. {item.price}
                        </small>

                      </div>

                      <span className="fw-semibold">
                        Rs.{" "}
                        {(
                          Number(item.price) *
                          item.quantity
                        ).toFixed(2)}
                      </span>

                    </div>

                  ))}

                  <hr />

                  <div className="d-flex justify-content-between">

                    <span className="fw-bold">
                      Total
                    </span>

                    <span className="fw-bold text-success fs-5">
                      Rs. {totalAmount.toFixed(2)}
                    </span>

                  </div>

                </div>

              </div>

            </div>

          </div>

        </div>
      </section>

    </div>
  );
}

export default Checkout;