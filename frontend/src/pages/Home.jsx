import { useEffect, useState } from "react";
import { apiFetch } from "../api/api";

function Home() {
  const [categories, setCategories] = useState([]);
  const [foods, setFoods] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    loadHomeData();
  }, []);

  async function loadHomeData() {
    try {
      const categoryData = await apiFetch("/categories/");
      const foodData = await apiFetch("/foods/");

      setCategories(categoryData);
      setFoods(foodData);
    } catch (error) {
      setError(error.message);
    }
  }

  return (
    <div>

      {/* Hero Section */}
      <section className="py-5">
        <div className="container">
          <div className="row align-items-center">

            <div className="col-lg-6">
              <p className="text-success fw-semibold">
                Delicious food, made for you
              </p>

              <h1 className="display-4 fw-bold">
                Good Food.
                <br />
                Good Mood.
              </h1>

              <p className="text-muted fs-5 mt-3">
                Discover delicious food and order your favourites
                easily from our food ordering system.
              </p>

              <button className="btn btn-success px-4 py-2 mt-3">
                Explore Menu
              </button>
            </div>

            <div className="col-lg-6 text-center mt-4 mt-lg-0">
              <div className="bg-light rounded-4 p-5">
                <span className="display-1">🍔</span>
                <span className="display-1">🍕</span>
                <span className="display-1">🍜</span>
              </div>
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

      {/* Categories */}
      <section className="py-5 bg-light">
        <div className="container">

          <h2 className="fw-bold mb-4">
            Browse Categories
          </h2>

          <div className="row g-3">

            {categories.map((category) => (
              <div
                className="col-6 col-md-4 col-lg-3"
                key={category.id}
              >
                <div className="bg-white rounded-4 p-4 text-center shadow-sm">

                  <h5 className="fw-bold">
                    {category.name}
                  </h5>

                  <p className="text-muted small mb-0">
                    {category.description}
                  </p>

                </div>
              </div>
            ))}

          </div>

        </div>
      </section>

      {/* Popular Foods */}
      <section className="py-5">
        <div className="container">

          <h2 className="fw-bold mb-4">
            Popular Foods
          </h2>

          <div className="row g-4">

            {foods.slice(0, 6).map((food) => (
              <div
                className="col-md-6 col-lg-4"
                key={food.id}
              >
                <div className="card h-100 border-0 shadow-sm rounded-4">

                  {food.image && (
                    <img
                      src={food.image}
                      className="card-img-top rounded-top-4"
                      alt={food.name}
                    />
                  )}

                  <div className="card-body">

                    <h5 className="card-title fw-bold">
                      {food.name}
                    </h5>

                    <p className="card-text text-muted">
                      {food.description}
                    </p>

                    <div className="d-flex justify-content-between align-items-center">

                      <span className="fw-bold text-success">
                        Rs. {food.price}
                      </span>

                      <button className="btn btn-success btn-sm">
                        Add to Cart
                      </button>

                    </div>

                  </div>
                </div>
              </div>
            ))}

          </div>

        </div>
      </section>

    </div>
  );
}

export default Home;