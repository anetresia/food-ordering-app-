import { useEffect, useState } from "react";
import { useCart } from "../context/CartContext";
import { apiFetch } from "../api/api";

function Menu() {
  const { addToCart } = useCart();

  const [foods, setFoods] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    try {
      setLoading(true);
      setError("");

      const [foodData, categoryData] = await Promise.all([
        apiFetch("/foods/"),
        apiFetch("/categories/"),
      ]);

      setFoods(foodData);
      setCategories(categoryData);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  // Search + category filter
  const filteredFoods = foods.filter((food) => {
    const matchesSearch = food.name
      .toLowerCase()
      .includes(search.toLowerCase());

    const matchesCategory =
      selectedCategory === "All" ||
      food.category_id === Number(selectedCategory);

    return matchesSearch && matchesCategory;
  });

  // Loading screen
  if (loading) {
    return (
      <div className="container py-5">
        <div className="text-center py-5">

          <div
            className="spinner-border text-success"
            role="status"
          ></div>

          <p className="text-muted mt-3 mb-0">
            Loading menu...
          </p>

        </div>
      </div>
    );
  }

  return (
    <div
      style={{
        backgroundColor: "#fafaf8",
        minHeight: "100vh",
      }}
    >
      <div className="container py-5">

        {/* ================= HEADER ================= */}

        <div className="text-center mb-5">

          <p
            className="text-success fw-semibold mb-2"
            style={{
              letterSpacing: "1px",
            }}
          >
            SUVAI MENU
          </p>

          <h1
            className="fw-bold mb-3"
            style={{
              color: "#172033",
            }}
          >
            Explore Our Menu
          </h1>

          <p
            className="text-muted mx-auto"
            style={{
              maxWidth: "600px",
            }}
          >
            Discover delicious food prepared with care
            and choose your favourites.
          </p>

        </div>


        {/* ================= SEARCH + CATEGORY ================= */}

        <div className="row g-3 mb-5">

          {/* Search */}

          <div className="col-lg-7">

            <input
              type="text"
              className="form-control form-control-lg"
              placeholder="Search food..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{
                borderRadius: "12px",
                border: "1px solid #e2e8f0",
              }}
            />

          </div>


          {/* Category */}

          <div className="col-lg-5">

            <select
              className="form-select form-select-lg"
              value={selectedCategory}
              onChange={(e) =>
                setSelectedCategory(e.target.value)
              }
              style={{
                borderRadius: "12px",
                border: "1px solid #e2e8f0",
              }}
            >

              <option value="All">
                All Categories
              </option>

              {categories.map((category) => (
                <option
                  key={category.id}
                  value={category.id}
                >
                  {category.name}
                </option>
              ))}

            </select>

          </div>

        </div>


        {/* ================= ERROR ================= */}

        {error && (
          <div className="alert alert-danger">
            {error}
          </div>
        )}


        {/* ================= FOOD CARDS ================= */}

        <div className="row g-4">

          {filteredFoods.map((food) => (

            <div
              className="col-md-6 col-lg-4"
              key={food.id}
            >

              <div
                className="card h-100 border-0 overflow-hidden"
                style={{
                  borderRadius: "18px",
                  boxShadow:
                    "0 6px 24px rgba(0,0,0,0.07)",
                }}
              >

                {/* ================= FOOD IMAGE ================= */}

                <img
                  src={food.image}
                  alt={food.name}
                  className="card-img-top"
                  style={{
                    width: "100%",
                    height: "230px",
                    objectFit: "cover",
                    display: "block",
                  }}
                />


                {/* ================= FOOD DETAILS ================= */}

                <div className="card-body p-4">

                  <div
                    className="d-flex justify-content-between align-items-start mb-2"
                  >

                    <h5
                      className="fw-bold mb-0"
                      style={{
                        color: "#172033",
                      }}
                    >
                      {food.name}
                    </h5>


                    {/* Availability */}

                    {food.is_available ? (
                      <span className="badge bg-success-subtle text-success">
                        Available
                      </span>
                    ) : (
                      <span className="badge bg-secondary-subtle text-secondary">
                        Unavailable
                      </span>
                    )}

                  </div>


                  {/* Description */}

                  <p
                    className="text-muted mb-3"
                    style={{
                      minHeight: "48px",
                    }}
                  >
                    {food.description ||
                      "Delicious food prepared for you."}
                  </p>


                  {/* Price + Cart */}

                  <div
                    className="d-flex justify-content-between align-items-center"
                  >

                    <h5
                      className="fw-bold mb-0"
                      style={{
                        color: "#16834b",
                      }}
                    >
                      Rs.{" "}
                      {Number(food.price).toLocaleString()}
                    </h5>


                    <button
                      className="btn btn-success px-3"
                      disabled={!food.is_available}
                      onClick={() => addToCart(food)}
                      style={{
                        borderRadius: "10px",
                      }}
                    >
                      {food.is_available
                        ? "Add to Cart"
                        : "Unavailable"}
                    </button>

                  </div>

                </div>

              </div>

            </div>

          ))}

        </div>


        {/* ================= NO FOOD ================= */}

        {filteredFoods.length === 0 && !error && (

          <div className="text-center py-5">

            <h5 className="fw-bold">
              No food found
            </h5>

            <p className="text-muted">
              Try another search or category.
            </p>

          </div>

        )}

      </div>
    </div>
  );
}

export default Menu;