import { Link, useNavigate } from "react-router-dom";
import { useContext, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { CartContext} from "../context/CartContext"


export default function Header() {
  const { user, isAdmin, logout } = useContext(AuthContext);
  const { cartItems } = useContext(CartContext);
  
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <header className="bg-white dark:bg-gray-900 dark:text-white shadow px-3 sm:px-6 py-3 w-full">
      <div className="flex justify-between items-center">
        {/* Logo */}
        <Link to="/" className="text-lg sm:text-xl font-bold text-blue-600">
          MyStore
        </Link>

        {/* Hamburger for mobile */}
        <button
          className="sm:hidden text-2xl"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          ☰
        </button>

        {/* Desktop Nav */}
        <div className="hidden sm:flex gap-4 items-center">
          {user && !user.isAdmin && (
            <> <Link to='/' >Home</Link>
              <Link to="/cart" className="flex items-center gap-1">
                🛒 <span>Cart ({cartItems?.length || 0})</span>
              </Link>
              <Link to="/myorders">My Orders</Link>

            </>
          )}

          {isAdmin && (
            <>
              <Link to='/' >Home</Link>
              <Link to="/admin/dashboard">Dashboard</Link>
              <Link to="/admin/products">Products</Link>
              <Link to="/admin/orders">Orders</Link>
            </>
          )}

          {user ? (
            <>
              <span className="text-sm font-medium">Hi, {user.name}</span>
              <button onClick={handleLogout} className="text-red-500">
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="bg-blue-600 text-white px-3 py-1 rounded text-sm sm:text-base"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="border px-3 py-1 rounded text-sm sm:text-base"
              >
                Sign Up
              </Link>
            </>
          )}


        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="sm:hidden flex flex-col gap-3 mt-3">
          {user && !user.isAdmin && (
            <>
              <Link to="/cart">🛒 Cart ({cartItems?.length || 0})</Link>
              <Link to="/myorders">My Orders</Link>
            </>
          )}

          {isAdmin && (
            <>
              <Link to="/admin/dashboard">Dashboard</Link>
              <Link to="/admin/products">Products</Link>
              <Link to="/admin/orders">Orders</Link>
            </>
          )}

          {user ? (
            <>
              <span className="text-sm font-medium">Hi, {user.name}</span>
              <button onClick={handleLogout} className="text-red-500">
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

          <button
            onClick={() => setDarkMode(!darkMode)}
            className="border px-3 py-1 rounded"
          >
            {darkMode ? "☀ Light" : "🌙 Dark"}
          </button>
        </div>
      )}
    </header>
  );
}