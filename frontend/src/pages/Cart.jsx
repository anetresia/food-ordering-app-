import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";

function Cart() {
  const {
    cartItems,
    removeFromCart,
    updateQuantity,
  } = useCart();

  const totalAmount = cartItems.reduce(
    (total, item) =>
      total + Number(item.price) * item.quantity,
    0
  );

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
              Your selected food
            </small>
          </div>

          <h1
            className="fw-bold mb-2"
            style={{ fontSize: "clamp(2rem, 5vw, 3.2rem)" }}
          >
            Your Cart
          </h1>

          <p className="text-muted fs-5 mb-0">
            Review your items before placing your order.
          </p>

        </div>
      </section>


      {/* Cart Content */}
      <section className="py-5">
        <div className="container">

          {cartItems.length === 0 ? (

            /* Empty Cart */
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
                  width: "90px",
                  height: "90px",
                  backgroundColor: "#e8f5ec",
                }}
              >
                <span
                  className="fw-bold"
                  style={{
                    fontSize: "2rem",
                    color: "#198754",
                  }}
                >
                  Cart
                </span>
              </div>

              <h3 className="fw-bold mb-2">
                Your cart is empty
              </h3>

              <p className="text-muted mb-4">
                Add some delicious food from our menu.
              </p>

              <Link
                to="/menu"
                className="btn btn-success px-4 py-2 rounded-3"
              >
                Browse Menu
              </Link>

            </div>

          ) : (

            <div className="row g-4">

              {/* Cart Items */}
              <div className="col-lg-8">

                <div className="d-flex justify-content-between align-items-center mb-3">

                  <h4 className="fw-bold mb-0">
                    Your Items
                  </h4>

                  <span className="text-muted small">
                    {cartItems.reduce(
                      (total, item) =>
                        total + item.quantity,
                      0
                    )} items
                  </span>

                </div>


                {cartItems.map((item) => (

                  <div
                    key={item.id}
                    className="card border-0 shadow-sm rounded-4 mb-3"
                    style={{
                      overflow: "hidden",
                    }}
                  >

                    <div className="card-body p-4">

                      <div className="row align-items-center">

                        {/* Food */}
                        <div className="col-md-5">

                          <h5 className="fw-bold mb-1">
                            {item.name}
                          </h5>

                          <p className="text-muted mb-0">
                            Rs. {Number(item.price).toFixed(2)}
                          </p>

                        </div>


                        {/* Quantity */}
                        <div className="col-md-4 mt-3 mt-md-0">

                          <p className="text-muted small mb-2">
                            Quantity
                          </p>

                          <div
                            className="d-inline-flex align-items-center rounded-3 p-1"
                            style={{
                              backgroundColor: "#f5f7f5",
                              border: "1px solid #e5e9e5",
                            }}
                          >

                            <button
                              className="btn btn-sm rounded-2"
                              style={{
                                width: "36px",
                                height: "36px",
                                color: "#198754",
                                backgroundColor: "white",
                                border: "1px solid #dfe6df",
                              }}
                              onClick={() =>
                                updateQuantity(
                                  item.id,
                                  item.quantity - 1
                                )
                              }
                              disabled={item.quantity === 1}
                            >
                              −
                            </button>

                            <span
                              className="fw-bold text-center"
                              style={{
                                minWidth: "42px",
                              }}
                            >
                              {item.quantity}
                            </span>

                            <button
                              className="btn btn-sm rounded-2"
                              style={{
                                width: "36px",
                                height: "36px",
                                color: "#198754",
                                backgroundColor: "white",
                                border: "1px solid #dfe6df",
                              }}
                              onClick={() =>
                                updateQuantity(
                                  item.id,
                                  item.quantity + 1
                                )
                              }
                            >
                              +
                            </button>

                          </div>

                        </div>


                        {/* Price & Remove */}
                        <div className="col-md-3 text-md-end mt-3 mt-md-0">

                          <p className="text-muted small mb-1">
                            Subtotal
                          </p>

                          <h5 className="fw-bold text-success mb-2">
                            Rs.{" "}
                            {(
                              Number(item.price) *
                              item.quantity
                            ).toFixed(2)}
                          </h5>

                          <button
                            className="btn btn-sm btn-outline-danger rounded-3"
                            onClick={() =>
                              removeFromCart(item.id)
                            }
                          >
                            Remove
                          </button>

                        </div>

                      </div>

                    </div>

                  </div>

                ))}

              </div>


              {/* Order Summary */}
              <div className="col-lg-4">

                <div
                  className="card border-0 shadow-sm rounded-4"
                  style={{
                    position: "sticky",
                    top: "20px",
                  }}
                >

                  <div className="card-body p-4">

                    <p className="text-success fw-semibold small mb-2">
                      ORDER DETAILS
                    </p>

                    <h4 className="fw-bold mb-4">
                      Order Summary
                    </h4>


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


                    <div className="d-flex justify-content-between mb-3">

                      <span className="text-muted">
                        Subtotal
                      </span>

                      <span className="fw-semibold">
                        Rs. {totalAmount.toFixed(2)}
                      </span>

                    </div>


                    <div className="d-flex justify-content-between mb-3">

                      <span className="text-muted">
                        Delivery
                      </span>

                      <span className="fw-semibold text-success">
                        Free
                      </span>

                    </div>


                    <hr className="my-4" />


                    <div className="d-flex justify-content-between align-items-center">

                      <span className="fw-bold fs-5">
                        Total
                      </span>

                      <span className="fw-bold text-success fs-4">
                        Rs. {totalAmount.toFixed(2)}
                      </span>

                    </div>


                    {/* Checkout Button */}
                    <Link
                      to="/checkout"
                      className="btn btn-success w-100 mt-4 py-3 rounded-3 fw-semibold"
                    >
                      Proceed to Checkout
                    </Link>


                    <Link
                      to="/menu"
                      className="btn btn-light w-100 mt-2 py-2 rounded-3"
                    >
                      Continue Shopping
                    </Link>

                  </div>

                </div>

              </div>

            </div>

          )}

        </div>
      </section>

    </div>
  );
}

export default Cart;