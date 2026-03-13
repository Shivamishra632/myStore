
import { useState, useContext, useEffect } from "react";
import API from "../api/axios";
import { AuthContext } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import toast from "react-hot-toast";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const { login, user } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (user) navigate("/");
  }, [user, navigate]);

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError("");

      const { data } = await API.post("/users/login", {
        email,
        password,
      });

      login(data);

      toast.success("Login successful 🎉");
      navigate("/");
    } catch (err) {
      navigate("/register");
      toast.error("Login failed. Please register first.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">

      <div className="bg-white shadow-lg rounded-xl w-full max-w-md p-8">

        <h2 className="text-2xl font-bold text-center mb-6">
          Welcome Back 👋
        </h2>

        {error && (
          <div className="bg-red-100 text-red-600 p-3 mb-4 rounded">
            {error}
          </div>
        )}

        <form onSubmit={submitHandler} className="space-y-4">

          <input
            type="email"
            placeholder="Email address"
            className="border rounded-lg px-3 py-2 w-full focus:ring-2 focus:ring-blue-500 outline-none"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <input
            type="password"
            placeholder="Password"
            className="border rounded-lg px-3 py-2 w-full focus:ring-2 focus:ring-blue-500 outline-none"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <button
            className="bg-blue-600 hover:bg-blue-700 text-white w-full py-2 rounded-lg transition"
            disabled={loading}
          >
            {loading ? "Logging in..." : "Login"}
          </button>

        </form>

        <p className="text-sm text-gray-500 text-center mt-6">
          Don't have an account?{" "}
          <Link
            to="/register"
            className="text-blue-600 hover:underline"
          >
            Register
          </Link>
        </p>

      </div>

    </div>
  );
}

