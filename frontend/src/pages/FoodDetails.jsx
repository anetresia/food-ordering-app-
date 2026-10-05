import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { apiFetch } from "../api/api";

function FoodDetails() {
  const { id } = useParams();

  const [food, setFood] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    loadFood();
  }, [id]);

  async function loadFood() {
    try {
      setError("");

      const data = await apiFetch(`/foods/${id}`);

      setFood(data);
    } catch (error) {
      setError(error.message);
    }
  }

  if (error) {
    return (
      <div className="container py-5">
        <div className="alert alert-danger">
          {error}
        </div>
      </div>
    );
  }

  if (!food) {
    return (
      <div className="container py-5">
        <p className="text-muted">
          Loading food details...
        </p>
      </div>
    );
  }

  return (
    <section className="py-5">
      <div className="container">

        <div className="row align-items-center g-5">

          {/* Food Image */}
          <div className="col-md-6">

            {food.image ? (
              <img
                src={food.image}
                alt={food.name}
                className="img-fluid rounded-4 shadow-sm"
              />
            ) : (
              <div className="bg-light rounded-4 p-5 text-center">
                <span className="display-1">
                  🍽️
                </span>
              </div>
            )}

          </div>

          {/* Food Details */}
          <div className="col-md-6">

            <p className="text-success fw-semibold">
              Our Special
            </p>

            <h1 className="fw-bold">
              {food.name}
            </h1>

            <p className="text-muted fs-5 mt-3">
              {food.description}
            </p>

            <h3 className="text-success fw-bold mt-4">
              Rs. {food.price}
            </h3>

            <p className="mt-3">
              {food.is_available ? (
                <span className="badge text-bg-success">
                  Available
                </span>
              ) : (
                <span className="badge text-bg-secondary">
                  Currently Unavailable
                </span>
              )}
            </p>

            <button
              className="btn btn-success px-4 py-2 mt-3"
              disabled={!food.is_available}
            >
              Add to Cart
            </button>

          </div>

        </div>

      </div>
    </section>
  );
}

export default FoodDetails;