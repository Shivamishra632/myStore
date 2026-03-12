import { Link, useNavigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { CartContext } from "../context/CartContext";
import { ThemeContext } from "../context/ThemeContext";

export default function Header() {
  const { user,isAdmin ,logout } = useContext(AuthContext);
  const { cartItems } = useContext(CartContext);
  const { darkMode, setDarkMode } = useContext(ThemeContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <header className="bg-white dark:bg-gray-900 dark:text-white shadow p-4 flex justify-between items-center">

      {/* Logo */}
      <Link to="/" className="text-xl font-bold text-blue-600">
        MyStore
      </Link>

      <div className="flex gap-4 items-center">

        {/* 🔹 USER PANEL */}
        {user && !user.isAdmin && (
          <>
            <Link to="/cart">
              Cart ({cartItems?.length || 0})
            </Link>

            <Link to="/myorders">
              My Orders
            </Link>
          </>
        )}

        {/* 🔹 ADMIN PANEL */}
        {isAdmin && (
          <>
            <Link to="/admin/dashboard">Dashboard</Link>
            <Link to="/admin/products">Products</Link>
            <Link to="/admin/orders">Orders</Link>
          </>
        )}

        {/* 🔹 AUTH SECTION */}
        {user ? (
          <>
            <span className="text-sm font-medium">
              Hi, {user.name}
            </span>

            <button
              onClick={handleLogout}
              className="text-red-500"
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <Link
              to="/login"
              className="bg-blue-600 text-white px-3 py-1 rounded"
            >
              Login
            </Link>

            <Link
              to="/register"
              className="border px-3 py-1 rounded"
            >
              Sign Up
            </Link>
          </>
        )}

        {/* 🔹 Dark Mode Toggle */}
        <button
          onClick={() => setDarkMode(!darkMode)}
          className="border px-3 py-1 rounded"
        >
          {darkMode ? "☀ Light" : "🌙 Dark"}
        </button>

      </div>
    </header>
  );
}