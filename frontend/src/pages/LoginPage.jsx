import { useState, useContext, useEffect } from "react";
import API from "../api/axios";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
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
    <form
      onSubmit={submitHandler}
      className="p-6 max-w-sm mx-auto"
    >
      <h2 className="text-xl font-bold mb-4 text-center">
        Login
      </h2>

      {error && (
        <div className="bg-red-100 text-red-600 p-2 mb-3 rounded">
          {error}
        </div>
      )}

      <input
        type="email"
        placeholder="Email"
        className="border p-2 w-full mb-3"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />

      <input
        type="password"
        placeholder="Password"
        className="border p-2 w-full mb-3"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />

      <button
        className="bg-blue-600 text-white w-full py-2 rounded"
        disabled={loading}
      >
        {loading ? "Logging in..." : "Login"}
      </button>
    </form>
  );
}