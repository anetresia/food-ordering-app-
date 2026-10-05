import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { apiFetch } from "../api/api";

function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleLogin(event) {
    event.preventDefault();

    try {
      setLoading(true);
      setError("");

      const data = await apiFetch("/auth/login", {
        method: "POST",
        body: JSON.stringify({
          email,
          password,
        }),
      });

      // JWT token save pannum
      localStorage.setItem(
        "token",
        data.access_token
      );

      // User information save pannum
      localStorage.setItem(
        "user",
        JSON.stringify(data.user)
      );

      // Role based navigation
      if (data.user.role === "admin") {
        navigate("/admin");
      } else {
        navigate("/menu");
      }

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
                    Welcome Back
                  </h2>

                  <p className="text-muted">
                    Login to continue ordering your favourite food.
                  </p>

                </div>


                {error && (
                  <div className="alert alert-danger">
                    {error}
                  </div>
                )}


                <form onSubmit={handleLogin}>

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
                        placeholder="Enter your password"
                        value={password}
                        onChange={(e) =>
                          setPassword(e.target.value)
                        }
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
                      ? "Logging in..."
                      : "Login"}
                  </button>

                </form>


                <p className="text-center text-muted mt-4 mb-0">

                  Don't have an account?{" "}

                  <Link
                    to="/register"
                    className="text-success text-decoration-none fw-semibold"
                  >
                    Register
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

export default Login;