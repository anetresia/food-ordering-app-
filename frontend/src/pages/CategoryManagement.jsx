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
    <div>
      <section className="bg-light py-5">
        <div className="container">
          <p className="text-success fw-semibold mb-2">
            Suvai Administration
          </p>

          <h1 className="fw-bold">
            Category Management
          </h1>

          <p className="text-muted mb-0">
            Create and manage food categories.
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

          {/* Category Form */}

          <div className="card border-0 shadow-sm rounded-4 mb-5">
            <div className="card-body p-4">

              <div className="d-flex justify-content-between align-items-center mb-4">
                <h4 className="fw-bold mb-0">
                  {editingId
                    ? "Update Category"
                    : "Add Category"}
                </h4>

                {editingId && (
                  <button
                    className="btn btn-outline-secondary"
                    onClick={clearForm}
                  >
                    Cancel
                  </button>
                )}
              </div>

              <form onSubmit={handleSubmit}>

                <div className="row g-3">

                  <div className="col-md-6">
                    <label className="form-label fw-semibold">
                      Category Name
                    </label>

                    <input
                      type="text"
                      className="form-control"
                      placeholder="Enter category name"
                      value={name}
                      onChange={(e) =>
                        setName(e.target.value)
                      }
                      required
                    />
                  </div>

                  <div className="col-md-6">
                    <label className="form-label fw-semibold">
                      Description
                    </label>

                    <input
                      type="text"
                      className="form-control"
                      placeholder="Enter description"
                      value={description}
                      onChange={(e) =>
                        setDescription(e.target.value)
                      }
                    />
                  </div>

                  <div className="col-12">
                    <button
                      type="submit"
                      className="btn btn-success"
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

          {/* Category List */}

          <h3 className="fw-bold mb-4">
            Categories
          </h3>

          {loading && (
            <div className="text-center py-5">
              <div className="spinner-border text-success"></div>

              <p className="text-muted mt-3">
                Loading categories...
              </p>
            </div>
          )}

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

                        <div className="d-flex justify-content-between">
                          <h5 className="fw-bold">
                            {category.name}
                          </h5>

                          <span className="badge bg-success">
                            #{category.id}
                          </span>
                        </div>

                        <p className="text-muted">
                          {category.description ||
                            "No description"}
                        </p>

                        <div className="d-flex gap-2 mt-3">

                          <button
                            className="btn btn-outline-success w-50"
                            onClick={() =>
                              startEdit(category)
                            }
                          >
                            Edit
                          </button>

                          <button
                            className="btn btn-outline-danger w-50"
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

          {!loading &&
            categories.length === 0 && (
              <div className="text-center py-5">
                <div className="display-3">
                  📂
                </div>

                <h4 className="fw-bold mt-3">
                  No categories found
                </h4>
              </div>
            )}

        </div>
      </section>
    </div>
  );
}

export default CategoryManagement;