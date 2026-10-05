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
    setDescription(food.description || "");
    setPrice(food.price);
    setImage(food.image || "");
    setIsAvailable(food.is_available);
    setCategoryId(food.category_id);

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

      const token = localStorage.getItem("token");

      if (!token) {
        setError("Please login as admin.");
        return;
      }

      const foodData = {
        name,
        description,
        price: Number(price),
        image: image || null,
        is_available: isAvailable,
        category_id: Number(categoryId),
      };

      if (editingId) {
        await apiFetch(`/foods/${editingId}`, {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(foodData),
        });

        setSuccess("Food updated successfully.");
      } else {
        await apiFetch("/foods/", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(foodData),
        });

        setSuccess("Food added successfully.");
      }

      clearForm();

      await getFoods();
    } catch (error) {
      setError(error.message);
    } finally {
      setSaving(false);
    }
  }

  async function deleteFood(foodId) {
    const confirmed = window.confirm(
      "Are you sure you want to delete this food?"
    );

    if (!confirmed) {
      return;
    }

    try {
      setError("");
      setSuccess("");

      const token = localStorage.getItem("token");

      if (!token) {
        setError("Please login as admin.");
        return;
      }

      await apiFetch(`/foods/${foodId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setSuccess("Food deleted successfully.");

      if (editingId === foodId) {
        clearForm();
      }

      await getFoods();
    } catch (error) {
      setError(error.message);
    }
  }

  const filteredFoods = foods.filter((food) =>
    food.name
      .toLowerCase()
      .includes(search.toLowerCase())
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
              Suvai Administration
            </small>
          </div>

          <h1
            className="fw-bold mb-2"
            style={{
              fontSize: "clamp(2rem, 5vw, 3.2rem)",
            }}
          >
            Food Management
          </h1>

          <p className="text-muted fs-5 mb-0">
            Add, update and manage food items.
          </p>

        </div>
      </section>


      <section className="py-5">
        <div className="container">

          {/* Back Button */}
          <div className="mb-4">
            <Link
              to="/admin"
              className="btn btn-outline-success rounded-3 px-4"
            >
              ← Admin Dashboard
            </Link>
          </div>


          {/* Messages */}
          {error && (
            <div className="alert alert-danger rounded-4">
              {error}
            </div>
          )}

          {success && (
            <div className="alert alert-success rounded-4">
              {success}
            </div>
          )}


          {/* Food Form */}
          <div className="card border-0 shadow-sm rounded-4 mb-5">

            <div className="card-body p-4 p-lg-5">

              <div className="d-flex justify-content-between align-items-start mb-4">

                <div>
                  <p className="text-success fw-semibold small mb-2">
                    FOOD DETAILS
                  </p>

                  <h4 className="fw-bold mb-1">
                    {editingId
                      ? "Update Food"
                      : "Add New Food"}
                  </h4>

                  <p className="text-muted mb-0">
                    Enter the details of your food item.
                  </p>
                </div>

                {editingId && (
                  <button
                    type="button"
                    className="btn btn-outline-secondary rounded-3"
                    onClick={clearForm}
                  >
                    Cancel
                  </button>
                )}

              </div>


              <form onSubmit={handleSubmit}>

                <div className="row g-4">

                  {/* Food Name */}
                  <div className="col-md-6">

                    <label className="form-label fw-semibold">
                      Food Name
                    </label>

                    <input
                      type="text"
                      className="form-control form-control-lg rounded-3"
                      value={name}
                      onChange={(e) =>
                        setName(e.target.value)
                      }
                      placeholder="Enter food name"
                      required
                    />

                  </div>


                  {/* Price */}
                  <div className="col-md-6">

                    <label className="form-label fw-semibold">
                      Price
                    </label>

                    <input
                      type="number"
                      className="form-control form-control-lg rounded-3"
                      value={price}
                      onChange={(e) =>
                        setPrice(e.target.value)
                      }
                      placeholder="Enter price"
                      min="0.01"
                      step="0.01"
                      required
                    />

                  </div>


                  {/* Description */}
                  <div className="col-12">

                    <label className="form-label fw-semibold">
                      Description
                    </label>

                    <textarea
                      className="form-control rounded-3"
                      rows="3"
                      value={description}
                      onChange={(e) =>
                        setDescription(e.target.value)
                      }
                      placeholder="Enter description"
                    ></textarea>

                  </div>


                  {/* Image URL */}
                  <div className="col-md-6">

                    <label className="form-label fw-semibold">
                      Image URL
                    </label>

                    <input
                      type="text"
                      className="form-control form-control-lg rounded-3"
                      value={image}
                      onChange={(e) =>
                        setImage(e.target.value)
                      }
                      placeholder="Enter image URL"
                    />

                    <small className="text-muted">
                      Add a direct URL for the food image.
                    </small>

                  </div>


                  {/* Category */}
                  <div className="col-md-6">

                    <label className="form-label fw-semibold">
                      Category
                    </label>

                    <select
                      className="form-select form-select-lg rounded-3"
                      value={categoryId}
                      onChange={(e) =>
                        setCategoryId(e.target.value)
                      }
                      required
                    >

                      <option value="">
                        Select Category
                      </option>

                      {categories.map(
                        (category) => (
                          <option
                            key={category.id}
                            value={category.id}
                          >
                            {category.name}
                          </option>
                        )
                      )}

                    </select>

                  </div>


                  {/* Availability */}
                  <div className="col-12">

                    <div
                      className="p-3 rounded-3"
                      style={{
                        backgroundColor: "#f8faf8",
                      }}
                    >

                      <div className="form-check">

                        <input
                          className="form-check-input"
                          type="checkbox"
                          id="available"
                          checked={isAvailable}
                          onChange={(e) =>
                            setIsAvailable(
                              e.target.checked
                            )
                          }
                        />

                        <label
                          className="form-check-label fw-semibold"
                          htmlFor="available"
                        >
                          Food is available
                        </label>

                      </div>

                    </div>

                  </div>


                  {/* Submit */}
                  <div className="col-12">

                    <button
                      type="submit"
                      className="btn btn-success px-4 py-2 rounded-3 fw-semibold"
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


          {/* Food List Header */}
          <div className="d-flex justify-content-between align-items-end mb-3">

            <div>
              <p className="text-success fw-semibold small mb-2">
                MENU ITEMS
              </p>

              <h3 className="fw-bold mb-1">
                Food Items
              </h3>

              <p className="text-muted mb-0">
                Manage your available food items.
              </p>
            </div>

            <span
              className="badge rounded-pill px-3 py-2"
              style={{
                backgroundColor: "#e8f5ec",
                color: "#198754",
              }}
            >
              {filteredFoods.length} item(s)
            </span>

          </div>


          {/* Search */}
          <div className="mb-4">

            <input
              type="text"
              className="form-control form-control-lg rounded-3"
              placeholder="Search food..."
              value={search}
              onChange={(e) =>
                setSearch(e.target.value)
              }
            />

          </div>


          {/* Loading */}
          {loading && (
            <div
              className="text-center py-5 rounded-4"
              style={{
                backgroundColor: "#f8faf8",
              }}
            >

              <div className="spinner-border text-success"></div>

              <p className="text-muted mt-3 mb-0">
                Loading foods...
              </p>

            </div>
          )}


          {/* Food Cards */}
          {!loading &&
            filteredFoods.length > 0 && (

              <div className="row g-4">

                {filteredFoods.map(
                  (food) => {

                    const available =
                      food.is_available === true ||
                      food.is_available === 1;

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

                          {/* Image */}
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
                              className="d-flex justify-content-center align-items-center"
                              style={{
                                height: "220px",
                                background:
                                  "linear-gradient(135deg, #f3f8f4, #fff8f0)",
                              }}
                            >
                              <span className="text-muted fw-semibold">
                                No image
                              </span>
                            </div>

                          )}


                          <div className="card-body p-4">

                            <div className="d-flex justify-content-between align-items-start gap-2">

                              <h5 className="fw-bold mb-2">
                                {food.name}
                              </h5>

                              <span
                                className={
                                  available
                                    ? "badge bg-success rounded-pill"
                                    : "badge bg-secondary rounded-pill"
                                }
                              >
                                {available
                                  ? "Available"
                                  : "Unavailable"}
                              </span>

                            </div>


                            <p className="text-success small fw-semibold mb-2">
                              {category
                                ? category.name
                                : "No category"}
                            </p>


                            <p className="text-muted mb-3">
                              {food.description ||
                                "No description"}
                            </p>


                            <h5 className="text-success fw-bold mb-0">
                              Rs.{" "}
                              {Number(
                                food.price
                              ).toFixed(2)}
                            </h5>


                            <div className="d-flex gap-2 mt-4">

                              <button
                                className="btn btn-outline-success w-50 rounded-3"
                                onClick={() =>
                                  startEdit(food)
                                }
                              >
                                Edit
                              </button>

                              <button
                                className="btn btn-outline-danger w-50 rounded-3"
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


          {/* No Foods */}
          {!loading &&
            filteredFoods.length === 0 && (

              <div
                className="text-center py-5 rounded-4"
                style={{
                  backgroundColor: "#fafafa",
                  border: "1px solid #eeeeee",
                }}
              >

                <h4 className="fw-bold">
                  No food items found
                </h4>

                <p className="text-muted mb-0">
                  Try searching with a different food name.
                </p>

              </div>
            )}

        </div>
      </section>

    </div>
  );
}

export default FoodManagement;