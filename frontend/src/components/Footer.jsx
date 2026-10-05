function Footer() {
  return (
    <footer
      className="mt-5"
      style={{
        backgroundColor: "#14532d",
        color: "white",
      }}
    >
      <div className="container py-5">

        <div className="row g-4">

          {/* Brand */}
          <div className="col-lg-5">

            <h3 className="fw-bold mb-3">
              Suvai
            </h3>

            <p
              className="mb-0"
              style={{
                color: "rgba(255,255,255,0.75)",
                maxWidth: "420px",
              }}
            >
              Delicious food made for you.
              Discover your favourites and enjoy
              a simple and convenient food ordering
              experience.
            </p>

          </div>


          {/* Quick Links */}
          <div className="col-6 col-lg-3">

            <h6 className="fw-bold mb-3">
              Quick Links
            </h6>

            <div className="d-flex flex-column gap-2">

              <a
                href="/"
                className="text-decoration-none"
                style={{
                  color: "rgba(255,255,255,0.75)",
                }}
              >
                Home
              </a>

              <a
                href="/menu"
                className="text-decoration-none"
                style={{
                  color: "rgba(255,255,255,0.75)",
                }}
              >
                Menu
              </a>

              <a
                href="/my-orders"
                className="text-decoration-none"
                style={{
                  color: "rgba(255,255,255,0.75)",
                }}
              >
                My Orders
              </a>

              <a
                href="/cart"
                className="text-decoration-none"
                style={{
                  color: "rgba(255,255,255,0.75)",
                }}
              >
                Cart
              </a>

            </div>

          </div>


          {/* Account */}
          <div className="col-6 col-lg-4">

            <h6 className="fw-bold mb-3">
              Account
            </h6>

            <div className="d-flex flex-column gap-2">

              <a
                href="/login"
                className="text-decoration-none"
                style={{
                  color: "rgba(255,255,255,0.75)",
                }}
              >
                Login
              </a>

              <a
                href="/register"
                className="text-decoration-none"
                style={{
                  color: "rgba(255,255,255,0.75)",
                }}
              >
                Register
              </a>

            </div>

          </div>

        </div>


        <hr
          className="my-4"
          style={{
            borderColor: "rgba(255,255,255,0.15)",
          }}
        />


        {/* Bottom */}
        <div className="d-flex justify-content-between align-items-center flex-wrap gap-2">

          <p
            className="mb-0 small"
            style={{
              color: "rgba(255,255,255,0.65)",
            }}
          >
            © 2026 Suvai. All rights reserved.
          </p>

          <p
            className="mb-0 small"
            style={{
              color: "rgba(255,255,255,0.65)",
            }}
          >
            Food made simple.
          </p>

        </div>

      </div>
    </footer>
  );
}

export default Footer;