import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import { apiFetch } from "../api/api";

function FoodManagement() {

  const [foods, setFoods] = useState([]);

  const [categories, setCategories] = useState([]);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [image, setImage] = useState("");
  const [isAvailable, setIsAvailable] = useState(true);
  const [categoryId, setCategoryId] = useState("");

  const [editingId, setEditingId] = useState(null);

  const [search, setSearch] = useState("");

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    getFoods();
    getCategories();
  }, []);

  async function getFoods() {
    try {

      setLoading(true);

      setError("");

      const data = await apiFetch("/foods/");

      setFoods(data);

    } catch (error) {

      setError(error.message);

    } finally {

      setLoading(false);

    }
  }

  async function getCategories() {

    try {

      const data = await apiFetch("/categories/");

      setCategories(data);

    } catch (error) {

      setError(error.message);

    }
  }

  function clearForm() {

    setName("");
    setDescription("");
    setPrice("");
    setImage("");
    setIsAvailable(true);
    setCategoryId("");

    setEditingId(null);

  }

  function startEdit(food) {

    setEditingId(food.id);

    setName(food.name);

    setDescription(
      food.description || ""
    );

    setPrice(food.price);

    setImage(
      food.image || ""
    );

    setIsAvailable(
      food.is_available
    );

    setCategoryId(
      food.category_id
    );

    setError("");
    setSuccess("");

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });

  }

  async function handleSubmit(event) {

    event.preventDefault();

    try {

      setSaving(true);

      setError("");
      setSuccess("");

      const token =
        localStorage.getItem("token");

      if (!token) {

        setError(
          "Please login as admin."
        );

        return;
      }

      const foodData = {

        name,

        description,

        price: Number(price),

        image:
          image || null,

        is_available:
          isAvailable,

        category_id:
          Number(categoryId),

      };

      if (editingId) {

        await apiFetch(
          `/foods/${editingId}`,
          {
            method: "PUT",

            headers: {
              Authorization:
                `Bearer ${token}`,
            },

            body:
              JSON.stringify(
                foodData
              ),
          }
        );

        setSuccess(
          "Food updated successfully."
        );

      } else {

        await apiFetch(
          "/foods/",
          {
            method: "POST",

            headers: {
              Authorization:
                `Bearer ${token}`,
            },

            body:
              JSON.stringify(
                foodData
              ),
          }
        );

        setSuccess(
          "Food added successfully."
        );
      }

      clearForm();

      await getFoods();

    } catch (error) {

      setError(
        error.message
      );

    } finally {

      setSaving(false);

    }
  }

  async function deleteFood(foodId) {

    const confirmed =
      window.confirm(
        "Are you sure you want to delete this food?"
      );

    if (!confirmed) {
      return;
    }

    try {

      setError("");
      setSuccess("");

      const token =
        localStorage.getItem("token");

      if (!token) {

        setError(
          "Please login as admin."
        );

        return;
      }

      await apiFetch(
        `/foods/${foodId}`,
        {
          method: "DELETE",

          headers: {
            Authorization:
              `Bearer ${token}`,
          },
        }
      );

      setSuccess(
        "Food deleted successfully."
      );

      if (editingId === foodId) {
        clearForm();
      }

      await getFoods();

    } catch (error) {

      setError(
        error.message
      );

    }
  }

  const filteredFoods =
    foods.filter((food) =>
      food.name
        .toLowerCase()
        .includes(
          search.toLowerCase()
        )
    );

  return (
    <div>

      {/* Header */}

      <section className="bg-light py-5">

        <div className="container">

          <p className="text-success fw-semibold mb-2">
            Suvai Administration
          </p>

          <h1 className="fw-bold">
            Food Management
          </h1>

          <p className="text-muted mb-0">
            Add, update and manage food items.
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

          {/* Messages */}

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

          {/* Form */}

          <div className="card border-0 shadow-sm rounded-4 mb-5">

            <div className="card-body p-4">

              <div className="d-flex justify-content-between align-items-center mb-4">

                <h4 className="fw-bold mb-0">
                  {editingId
                    ? "Update Food"
                    : "Add New Food"}
                </h4>

                {editingId && (
                  <button
                    type="button"
                    className="btn btn-outline-secondary"
                    onClick={clearForm}
                  >
                    Cancel
                  </button>
                )}

              </div>

              <form
                onSubmit={handleSubmit}
              >

                <div className="row g-3">

                  <div className="col-md-6">

                    <label className="form-label fw-semibold">
                      Food Name
                    </label>

                    <input
                      type="text"
                      className="form-control"
                      value={name}
                      onChange={(e) =>
                        setName(
                          e.target.value
                        )
                      }
                      placeholder="Enter food name"
                      required
                    />

                  </div>

                  <div className="col-md-6">

                    <label className="form-label fw-semibold">
                      Price
                    </label>

                    <input
                      type="number"
                      className="form-control"
                      value={price}
                      onChange={(e) =>
                        setPrice(
                          e.target.value
                        )
                      }
                      placeholder="Enter price"
                      min="0.01"
                      step="0.01"
                      required
                    />

                  </div>

                  <div className="col-12">

                    <label className="form-label fw-semibold">
                      Description
                    </label>

                    <textarea
                      className="form-control"
                      rows="3"
                      value={description}
                      onChange={(e) =>
                        setDescription(
                          e.target.value
                        )
                      }
                      placeholder="Enter description"
                    ></textarea>

                  </div>

                  <div className="col-md-6">

                    <label className="form-label fw-semibold">
                      Image URL
                    </label>

                    <input
                      type="text"
                      className="form-control"
                      value={image}
                      onChange={(e) =>
                        setImage(
                          e.target.value
                        )
                      }
                      placeholder="Enter image URL"
                    />

                  </div>

                  <div className="col-md-6">

                    <label className="form-label fw-semibold">
                      Category
                    </label>

                    <select
                      className="form-select"
                      value={categoryId}
                      onChange={(e) =>
                        setCategoryId(
                          e.target.value
                        )
                      }
                      required
                    >

                      <option value="">
                        Select Category
                      </option>

                      {categories.map(
                        (category) => (
                          <option
                            key={
                              category.id
                            }
                            value={
                              category.id
                            }
                          >
                            {category.name}
                          </option>
                        )
                      )}

                    </select>

                  </div>

                  <div className="col-12">

                    <div className="form-check">

                      <input
                        className="form-check-input"
                        type="checkbox"
                        id="available"
                        checked={
                          isAvailable
                        }
                        onChange={(e) =>
                          setIsAvailable(
                            e.target.checked
                          )
                        }
                      />

                      <label
                        className="form-check-label"
                        htmlFor="available"
                      >
                        Food is available
                      </label>

                    </div>

                  </div>

                  <div className="col-12">

                    <button
                      type="submit"
                      className="btn btn-success px-4"
                      disabled={saving}
                    >
                      {saving
                        ? "Saving..."
                        : editingId
                        ? "Update Food"
                        : "Add Food"}
                    </button>

                  </div>

                </div>

              </form>

            </div>

          </div>

          {/* Food List */}

          <div className="d-flex justify-content-between align-items-center mb-3">

            <h3 className="fw-bold">
              Food Items
            </h3>

            <span className="text-muted">
              {filteredFoods.length} item(s)
            </span>

          </div>

          <div className="mb-4">

            <input
              type="text"
              className="form-control"
              placeholder="Search food..."
              value={search}
              onChange={(e) =>
                setSearch(
                  e.target.value
                )
              }
            />

          </div>

          {loading && (
            <div className="text-center py-5">

              <div className="spinner-border text-success"></div>

              <p className="text-muted mt-3">
                Loading foods...
              </p>

            </div>
          )}

          {!loading &&
            filteredFoods.length > 0 && (

              <div className="row g-4">

                {filteredFoods.map(
                  (food) => {

                    const available =
                      food.is_available ===
                        true ||
                      food.is_available ===
                        1;

                    const category =
                      categories.find(
                        (item) =>
                          item.id ===
                          food.category_id
                      );

                    return (
                      <div
                        className="col-md-6 col-lg-4"
                        key={food.id}
                      >

                        <div className="card h-100 border-0 shadow-sm rounded-4 overflow-hidden">

                          {food.image ? (

                            <img
                              src={
                                food.image
                              }
                              alt={
                                food.name
                              }
                              className="card-img-top"
                              style={{
                                height:
                                  "200px",
                                objectFit:
                                  "cover",
                              }}
                            />

                          ) : (

                            <div
                              className="bg-light d-flex justify-content-center align-items-center"
                              style={{
                                height:
                                  "200px",
                              }}
                            >

                              <span className="display-3">
                                🍽️
                              </span>

                            </div>

                          )}

                          <div className="card-body">

                            <div className="d-flex justify-content-between align-items-start">

                              <h5 className="fw-bold">
                                {food.name}
                              </h5>

                              <span
                                className={
                                  available
                                    ? "badge bg-success"
                                    : "badge bg-secondary"
                                }
                              >
                                {available
                                  ? "Available"
                                  : "Unavailable"}
                              </span>

                            </div>

                            <p className="text-muted small">
                              {category
                                ? category.name
                                : "No category"}
                            </p>

                            <p className="text-muted">
                              {food.description ||
                                "No description"}
                            </p>

                            <h5 className="text-success fw-bold">
                              Rs.{" "}
                              {Number(
                                food.price
                              ).toFixed(2)}
                            </h5>

                            <div className="d-flex gap-2 mt-3">

                              <button
                                className="btn btn-outline-success w-50"
                                onClick={() =>
                                  startEdit(
                                    food
                                  )
                                }
                              >
                                Edit
                              </button>

                              <button
                                className="btn btn-outline-danger w-50"
                                onClick={() =>
                                  deleteFood(
                                    food.id
                                  )
                                }
                              >
                                Delete
                              </button>

                            </div>

                          </div>

                        </div>

                      </div>
                    );
                  }
                )}

              </div>
            )}

          {!loading &&
            filteredFoods.length === 0 && (

              <div className="text-center py-5">

                <div className="display-3">
                  🍽️
                </div>

                <h4 className="fw-bold mt-3">
                  No food items found
                </h4>

              </div>
            )}

        </div>

      </section>

    </div>
  );
}

export default FoodManagement;