import { useEffect, useState } from "react";
import { apiFetch } from "../api/api";
import { useCart } from "../context/CartContext";

function Menu() {
  const [foods, setFoods] = useState([]);
  const [categories, setCategories] = useState([]);

  const [search, setSearch] = useState("");
  const [categoryId, setCategoryId] = useState("");

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Cart-la food add panna use panrom
  const { addToCart } = useCart();

  // Backend-la irundhu categories load pannum
  useEffect(() => {
    getCategories();
  }, []);

  // Search/category change aana foods reload pannum
  useEffect(() => {
    getFoods();
  }, [search, categoryId]);

  // GET /categories/
  async function getCategories() {
    try {
      const data = await apiFetch("/categories/");
      setCategories(data);
    } catch (error) {
      setError(error.message);
    }
  }

  // GET /foods/
  async function getFoods() {
    try {
      setLoading(true);
      setError("");

      let url = "/foods/";

      const params = new URLSearchParams();

      if (search.trim() !== "") {
        params.append("search", search.trim());
      }

      if (categoryId !== "") {
        params.append("category_id", categoryId);
      }

      if (params.toString()) {
        url += `?${params.toString()}`;
      }

      const data = await apiFetch(url);

      setFoods(data);
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
            Explore our food
          </p>

          <h1 className="fw-bold">
            Our Menu
          </h1>

          <p className="text-muted mb-0">
            Choose your favourite food and enjoy your meal.
          </p>

        </div>
      </section>


      {/* Search and Category Filter */}
      <section className="py-4">
        <div className="container">

          <div className="row g-3">

            {/* Search */}
            <div className="col-md-8">

              <label className="form-label fw-semibold">
                Search Food
              </label>

              <input
                type="text"
                className="form-control"
                placeholder="Search food..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />

            </div>


            {/* Category */}
            <div className="col-md-4">

              <label className="form-label fw-semibold">
                Category
              </label>

              <select
                className="form-select"
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
              >

                <option value="">
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

        </div>
      </section>


      {/* Error Message */}
      {error && (
        <div className="container">

          <div className="alert alert-danger">
            {error}
          </div>

        </div>
      )}


      {/* Food Section */}
      <section className="py-4">
        <div className="container">

          <div className="d-flex justify-content-between align-items-center mb-4">

            <h2 className="fw-bold mb-0">
              Available Foods
            </h2>

            <span className="text-muted">
              {foods.length} item(s)
            </span>

          </div>


          {/* Loading */}
          {loading && (
            <div className="text-center py-5">

              <div
                className="spinner-border text-success"
                role="status"
              ></div>

              <p className="text-muted mt-3">
                Loading foods...
              </p>

            </div>
          )}


          {/* Food Cards */}
          {!loading && foods.length > 0 && (

            <div className="row g-4">

              {foods.map((food) => {

                const isAvailable =
                  food.is_available === true ||
                  food.is_available === 1;

                // Food name based emoji
                const foodEmoji =
                  food.name.toLowerCase().includes("pizza")
                    ? "🍕"
                    : food.name.toLowerCase().includes("burger")
                    ? "🍔"
                    : "🍽️";

                return (
                  <div
                    className="col-md-6 col-lg-4"
                    key={food.id}
                  >

                    <div className="card h-100 border-0 shadow-sm rounded-4 overflow-hidden">

                      {/* Food Image */}
                      {food.image ? (

                        <img
                          src={food.image}
                          alt={food.name}
                          className="card-img-top"
                          style={{
                            height: "220px",
                            objectFit: "cover",
                          }}
                        />

                      ) : (

                        <div
                          className="bg-light d-flex justify-content-center align-items-center"
                          style={{
                            height: "220px",
                          }}
                        >

                          <span className="display-1">
                            {foodEmoji}
                          </span>

                        </div>

                      )}


                      {/* Food Details */}
                      <div className="card-body">

                        <h5 className="fw-bold">
                          {food.name}
                        </h5>

                        <p className="text-muted">
                          {food.description ||
                            "Delicious food for you."}
                        </p>


                        <div className="d-flex justify-content-between align-items-center mb-3">

                          <span className="fw-bold text-success fs-5">
                            Rs. {food.price}
                          </span>


                          {/* Availability */}
                          {isAvailable ? (

                            <span className="badge bg-success">
                              Available
                            </span>

                          ) : (

                            <span className="badge bg-secondary">
                              Unavailable
                            </span>

                          )}

                        </div>


                        {/* Add to Cart */}
                        <button
                          className="btn btn-success w-100"
                          disabled={!isAvailable}
                          onClick={() => addToCart(food)}
                        >
                          Add to Cart
                        </button>

                      </div>

                    </div>

                  </div>
                );
              })}

            </div>

          )}


          {/* No Foods */}
          {!loading &&
            foods.length === 0 &&
            !error && (

              <div className="text-center py-5">

                <div className="display-3 mb-3">
                  🍽️
                </div>

                <h4 className="fw-bold">
                  No food items found
                </h4>

                <p className="text-muted">
                  Try another search or category.
                </p>

              </div>

            )}

        </div>
      </section>

    </div>
  );
}

export default Menu;