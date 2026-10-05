import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { apiFetch } from "../api/api";

function CategoryManagement() {
  const [categories, setCategories] = useState([]);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  const [editingId, setEditingId] = useState(null);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    getCategories();
  }, []);

  async function getCategories() {
    try {
      setLoading(true);
      setError("");

      const data = await apiFetch("/categories/");

      setCategories(data);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  }

  function clearForm() {
    setName("");
    setDescription("");
    setEditingId(null);
  }

  function startEdit(category) {
    setEditingId(category.id);
    setName(category.name);
    setDescription(category.description || "");

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

      const categoryData = {
        name,
        description,
      };

      if (editingId) {
        await apiFetch(`/categories/${editingId}`, {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(categoryData),
        });

        setSuccess(
          "Category updated successfully."
        );
      } else {
        await apiFetch("/categories/", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(categoryData),
        });

        setSuccess(
          "Category added successfully."
        );
      }

      clearForm();
      await getCategories();
    } catch (error) {
      setError(error.message);
    } finally {
      setSaving(false);
    }
  }

  async function deleteCategory(categoryId) {
    const confirmed = window.confirm(
      "Are you sure you want to delete this category?"
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

      await apiFetch(
        `/categories/${categoryId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setSuccess(
        "Category deleted successfully."
      );

      if (editingId === categoryId) {
        clearForm();
      }

      await getCategories();
    } catch (error) {
      setError(error.message);
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
              Suvai Administration
            </small>
          </div>

          <h1
            className="fw-bold mb-2"
            style={{
              fontSize: "clamp(2rem, 5vw, 3.2rem)",
            }}
          >
            Category Management
          </h1>

          <p className="text-muted fs-5 mb-0">
            Create and manage food categories.
          </p>

        </div>
      </section>


      {/* Main Content */}
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


          {/* Category Form */}
          <div className="card border-0 shadow-sm rounded-4 mb-5">

            <div className="card-body p-4 p-lg-5">

              <div className="d-flex justify-content-between align-items-start mb-4">

                <div>

                  <p className="text-success fw-semibold small mb-2">
                    CATEGORY DETAILS
                  </p>

                  <h4 className="fw-bold mb-1">
                    {editingId
                      ? "Update Category"
                      : "Add Category"}
                  </h4>

                  <p className="text-muted mb-0">
                    Create a category for your food items.
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

                  {/* Category Name */}
                  <div className="col-md-6">

                    <label className="form-label fw-semibold">
                      Category Name
                    </label>

                    <input
                      type="text"
                      className="form-control form-control-lg rounded-3"
                      placeholder="Enter category name"
                      value={name}
                      onChange={(e) =>
                        setName(e.target.value)
                      }
                      required
                    />

                  </div>


                  {/* Description */}
                  <div className="col-md-6">

                    <label className="form-label fw-semibold">
                      Description
                    </label>

                    <input
                      type="text"
                      className="form-control form-control-lg rounded-3"
                      placeholder="Enter description"
                      value={description}
                      onChange={(e) =>
                        setDescription(e.target.value)
                      }
                    />

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
                        ? "Update Category"
                        : "Add Category"}
                    </button>

                  </div>

                </div>

              </form>

            </div>

          </div>


          {/* Category List Header */}
          <div className="d-flex justify-content-between align-items-end mb-4">

            <div>

              <p className="text-success fw-semibold small mb-2">
                FOOD CATEGORIES
              </p>

              <h3 className="fw-bold mb-1">
                Categories
              </h3>

              <p className="text-muted mb-0">
                Manage the categories available in your menu.
              </p>

            </div>

            <span
              className="badge rounded-pill px-3 py-2"
              style={{
                backgroundColor: "#e8f5ec",
                color: "#198754",
              }}
            >
              {categories.length} categories
            </span>

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
                Loading categories...
              </p>

            </div>
          )}


          {/* Category Cards */}
          {!loading &&
            categories.length > 0 && (

              <div className="row g-4">

                {categories.map((category) => (

                  <div
                    className="col-md-6 col-lg-4"
                    key={category.id}
                  >

                    <div className="card border-0 shadow-sm rounded-4 h-100">

                      <div className="card-body p-4">

                        <div className="d-flex justify-content-between align-items-start gap-2">

                          <div>

                            <p className="text-success small fw-semibold mb-2">
                              CATEGORY
                            </p>

                            <h5 className="fw-bold mb-0">
                              {category.name}
                            </h5>

                          </div>

                          <span
                            className="badge rounded-pill"
                            style={{
                              backgroundColor: "#e8f5ec",
                              color: "#198754",
                            }}
                          >
                            #{category.id}
                          </span>

                        </div>


                        <p className="text-muted mt-3 mb-0">
                          {category.description ||
                            "No description"}
                        </p>


                        <div className="d-flex gap-2 mt-4">

                          <button
                            className="btn btn-outline-success w-50 rounded-3"
                            onClick={() =>
                              startEdit(category)
                            }
                          >
                            Edit
                          </button>

                          <button
                            className="btn btn-outline-danger w-50 rounded-3"
                            onClick={() =>
                              deleteCategory(
                                category.id
                              )
                            }
                          >
                            Delete
                          </button>

                        </div>

                      </div>

                    </div>

                  </div>

                ))}

              </div>
            )}


          {/* Empty State */}
          {!loading &&
            categories.length === 0 && (

              <div
                className="text-center py-5 rounded-4"
                style={{
                  backgroundColor: "#fafafa",
                  border: "1px solid #eeeeee",
                }}
              >

                <h4 className="fw-bold mt-2">
                  No categories found
                </h4>

                <p className="text-muted mb-0">
                  Add your first food category above.
                </p>

              </div>
            )}

        </div>
      </section>

    </div>
  );
}

export default CategoryManagement;