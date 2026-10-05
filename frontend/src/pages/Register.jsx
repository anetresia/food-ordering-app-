import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { apiFetch } from "../api/api";

function Register() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleRegister(event) {
    event.preventDefault();

    try {
      setLoading(true);
      setError("");

      await apiFetch("/auth/register", {
        method: "POST",
        body: JSON.stringify({
          name,
          email,
          password,
        }),
      });

      navigate("/login");

    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="py-5">
      <div className="container">

        <div className="row justify-content-center">

          <div className="col-md-8 col-lg-5">

            <div className="card border-0 shadow-sm rounded-4">

              <div className="card-body p-4 p-md-5">

                <div className="text-center mb-4">

                  <h2 className="fw-bold">
                    Create Account
                  </h2>

                  <p className="text-muted">
                    Register to start ordering your favourite food.
                  </p>

                </div>

                {error && (
                  <div className="alert alert-danger">
                    {error}
                  </div>
                )}

                <form onSubmit={handleRegister}>

                  {/* Name */}
                  <div className="mb-3">

                    <label className="form-label fw-semibold">
                      Name
                    </label>

                    <input
                      type="text"
                      className="form-control"
                      placeholder="Enter your name"
                      value={name}
                      onChange={(e) =>
                        setName(e.target.value)
                      }
                      required
                    />

                  </div>


                  {/* Email */}
                  <div className="mb-3">

                    <label className="form-label fw-semibold">
                      Email
                    </label>

                    <input
                      type="email"
                      className="form-control"
                      placeholder="Enter your email"
                      value={email}
                      onChange={(e) =>
                        setEmail(e.target.value)
                      }
                      required
                    />

                  </div>


                  {/* Password */}
                  <div className="mb-4">

                    <label className="form-label fw-semibold">
                      Password
                    </label>

                    <div className="input-group">

                      <input
                        type={
                          showPassword
                            ? "text"
                            : "password"
                        }
                        className="form-control"
                        placeholder="Minimum 6 characters"
                        value={password}
                        onChange={(e) =>
                          setPassword(e.target.value)
                        }
                        minLength="6"
                        required
                      />

                      <button
                        type="button"
                        className="btn btn-outline-secondary"
                        onClick={() =>
                          setShowPassword(!showPassword)
                        }
                      >
                        {showPassword ? "hide" : "show"}
                      </button>

                    </div>

                  </div>


                  <button
                    type="submit"
                    className="btn btn-success w-100 py-2"
                    disabled={loading}
                  >
                    {loading
                      ? "Creating Account..."
                      : "Register"}
                  </button>

                </form>


                <p className="text-center text-muted mt-4 mb-0">

                  Already have an account?{" "}

                  <Link
                    to="/login"
                    className="text-success text-decoration-none fw-semibold"
                  >
                    Login
                  </Link>

                </p>

              </div>

            </div>

          </div>

        </div>

      </div>
    </section>
  );
}

export default Register;