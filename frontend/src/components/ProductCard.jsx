
import { Link } from "react-router-dom";
import { useContext } from "react";
import { CartContext } from "../context/CartContext";

export default function ProductCard({ product }) {

  const { addToCart } = useContext(CartContext);

  const handleAdd = (e) => {
    e.preventDefault();
    addToCart({ ...product, qty: 1 });
  };

  return (

    <div className="bg-white rounded-lg shadow p-3 hover:shadow-xl hover:-translate-y-1 transition duration-300 relative">

      {/* STOCK BADGE */}

      {product?.countInStock === 0 && (
        <span className="absolute top-2 left-2 bg-red-500 text-white text-xs px-2 py-1 rounded">
          Out of Stock
        </span>
      )}

      <Link to={`/product/${product?._id}`}>

        <img
          src={product?.image || "/placeholder.png"}
          alt={product?.name}
          className="h-40 w-full object-cover rounded"
        />

        <h2 className="mt-2 font-semibold line-clamp-2">
          {product?.name}
        </h2>

        {/* PRICE */}

        <p className="text-blue-600 font-bold">
          ₹{product?.price}
        </p>

        {/* RATING */}

        <div className="flex items-center text-yellow-500 text-sm mt-1">

          {"★".repeat(Math.round(product?.rating || 0))}
          {"☆".repeat(5 - Math.round(product?.rating || 0))}

          <span className="text-gray-500 ml-1">
            ({product?.numReviews || 0})
          </span>

        </div>

      </Link>

      {/* ADD TO CART */}

      {product?.countInStock > 0 && (
        <button
          onClick={handleAdd}
          className="mt-3 w-full bg-blue-600 text-white py-1 rounded hover:bg-blue-700"
        >
          Add to Cart
        </button>
      )}

    </div>

  );
}

