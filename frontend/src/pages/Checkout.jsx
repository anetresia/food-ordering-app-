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
              Almost there
            </small>
          </div>

          <h1
            className="fw-bold mb-2"
            style={{ fontSize: "clamp(2rem, 5vw, 3.2rem)" }}
          >
            Checkout
          </h1>

          <p className="text-muted fs-5 mb-0">
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

                <div className="card-body p-4 p-lg-5">

                  <div className="mb-4">

                    <p className="text-success fw-semibold small mb-2">
                      DELIVERY INFORMATION
                    </p>

                    <h4 className="fw-bold mb-1">
                      Customer Details
                    </h4>

                    <p className="text-muted mb-0">
                      Tell us where we should deliver your order.
                    </p>

                  </div>


                  {error && (
                    <div className="alert alert-danger rounded-3">
                      {error}
                    </div>
                  )}


                  <form onSubmit={handleSubmit}>

                    {/* Name */}
                    <div className="mb-4">

                      <label className="form-label fw-semibold">
                        Full Name
                      </label>

                      <input
                        type="text"
                        className="form-control form-control-lg rounded-3"
                        placeholder="Enter your name"
                        value={name}
                        onChange={(e) =>
                          setName(e.target.value)
                        }
                        required
                      />

                    </div>


                    {/* Email */}
                    <div className="mb-4">

                      <label className="form-label fw-semibold">
                        Email
                      </label>

                      <input
                        type="email"
                        className="form-control form-control-lg rounded-3"
                        placeholder="Enter your email"
                        value={email}
                        onChange={(e) =>
                          setEmail(e.target.value)
                        }
                        required
                      />

                    </div>


                    {/* Phone */}
                    <div className="mb-4">

                      <label className="form-label fw-semibold">
                        Phone
                      </label>

                      <input
                        type="tel"
                        className="form-control form-control-lg rounded-3"
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
                        className="form-control rounded-3"
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
                      className="btn btn-success w-100 py-3 rounded-3 fw-semibold"
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

              <div
                className="card border-0 shadow-sm rounded-4"
                style={{
                  position: "sticky",
                  top: "20px",
                }}
              >

                <div className="card-body p-4 p-lg-5">

                  <p className="text-success fw-semibold small mb-2">
                    YOUR ORDER
                  </p>

                  <h4 className="fw-bold mb-4">
                    Order Summary
                  </h4>


                  {cartItems.map((item) => (

                    <div
                      key={item.id}
                      className="d-flex justify-content-between align-items-start mb-4"
                    >

                      <div className="pe-3">

                        <h6 className="fw-semibold mb-1">
                          {item.name}
                        </h6>

                        <small className="text-muted">
                          {item.quantity} × Rs.{" "}
                          {Number(item.price).toFixed(2)}
                        </small>

                      </div>

                      <span className="fw-semibold text-nowrap">
                        Rs.{" "}
                        {(
                          Number(item.price) *
                          item.quantity
                        ).toFixed(2)}
                      </span>

                    </div>

                  ))}


                  <hr className="my-4" />


                  <div className="d-flex justify-content-between mb-3">

                    <span className="text-muted">
                      Items
                    </span>

                    <span className="fw-semibold">
                      {cartItems.reduce(
                        (total, item) =>
                          total + item.quantity,
                        0
                      )}
                    </span>

                  </div>


                  <div className="d-flex justify-content-between align-items-center">

                    <span className="fw-bold fs-5">
                      Total
                    </span>

                    <span className="fw-bold text-success fs-4">
                      Rs. {totalAmount.toFixed(2)}
                    </span>

                  </div>


                  <div
                    className="mt-4 p-3 rounded-3"
                    style={{
                      backgroundColor: "#f8faf8",
                    }}
                  >
                    <small className="text-muted">
                      Your order will be processed after you
                      confirm your details and place the order.
                    </small>
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