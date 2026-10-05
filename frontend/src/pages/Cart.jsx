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
    <div>

      {/* Header */}
      <section className="bg-light py-5">
        <div className="container">

          <p className="text-success fw-semibold mb-2">
            Your selected food
          </p>

          <h1 className="fw-bold">
            Your Cart
          </h1>

          <p className="text-muted mb-0">
            Review your items before placing your order.
          </p>

        </div>
      </section>


      {/* Cart Content */}
      <section className="py-5">
        <div className="container">

          {cartItems.length === 0 ? (

            <div className="text-center py-5">

              <div className="display-2 mb-3">
                🛒
              </div>

              <h3 className="fw-bold">
                Your cart is empty
              </h3>

              <p className="text-muted">
                Add some delicious food from our menu.
              </p>

              <Link
                to="/menu"
                className="btn btn-success mt-2"
              >
                Browse Menu
              </Link>

            </div>

          ) : (

            <div className="row g-4">

              {/* Cart Items */}
              <div className="col-lg-8">

                {cartItems.map((item) => (

                  <div
                    key={item.id}
                    className="card border-0 shadow-sm rounded-4 mb-3"
                  >

                    <div className="card-body">

                      <div className="row align-items-center">

                        {/* Food */}
                        <div className="col-md-5">

                          <h5 className="fw-bold mb-1">
                            {item.name}
                          </h5>

                          <p className="text-muted mb-0">
                            Rs. {item.price}
                          </p>

                        </div>


                        {/* Quantity */}
                        <div className="col-md-4 mt-3 mt-md-0">

                          <div className="d-flex align-items-center gap-2">

                            <button
                              className="btn btn-outline-success"
                              onClick={() =>
                                updateQuantity(
                                  item.id,
                                  item.quantity - 1
                                )
                              }
                              disabled={item.quantity === 1}
                            >
                              -
                            </button>

                            <span className="fw-bold px-2">
                              {item.quantity}
                            </span>

                            <button
                              className="btn btn-outline-success"
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

                          <h5 className="fw-bold text-success">
                            Rs.{" "}
                            {(
                              Number(item.price) *
                              item.quantity
                            ).toFixed(2)}
                          </h5>

                          <button
                            className="btn btn-sm btn-outline-danger"
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

                <div className="card border-0 shadow-sm rounded-4">

                  <div className="card-body p-4">

                    <h4 className="fw-bold mb-4">
                      Order Summary
                    </h4>

                    <div className="d-flex justify-content-between mb-3">

                      <span className="text-muted">
                        Items
                      </span>

                      <span>
                        {cartItems.reduce(
                          (total, item) =>
                            total + item.quantity,
                          0
                        )}
                      </span>

                    </div>

                    <hr />

                    <div className="d-flex justify-content-between">

                      <span className="fw-bold">
                        Total
                      </span>

                      <span className="fw-bold text-success fs-5">
                        Rs. {totalAmount.toFixed(2)}
                      </span>

                    </div>


                    {/* Checkout Button */}
                    <Link
                      to="/checkout"
                      className="btn btn-success w-100 mt-4"
                    >
                      Proceed to Checkout
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