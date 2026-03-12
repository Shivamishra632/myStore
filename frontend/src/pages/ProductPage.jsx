import { useParams } from "react-router-dom";
import { useEffect, useState, useContext } from "react";
import API from "../api/axios";
import { CartContext } from "../context/CartContext";
import Loader from "../components/Loader";
import { AuthContext } from "../context/AuthContext";

export default function ProductPage() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [related, setRelated] = useState([]);
  const [error, setError] = useState("");
  const [qty, setQty] = useState(1);

  const { user } = useContext(AuthContext);
  const { addToCart } = useContext(CartContext);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const { data } = await API.get(`/products/${id}`);
        setProduct(data);
      } catch (err) {
        setError("Product not found");
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);
  
 
  if (loading) return <Loader />;
  if (error) return <p className="p-6 text-red-500">{error}</p>;

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="grid md:grid-cols-2 gap-6">
        <img
          src={product?.image || "/placeholder.png"}
          alt={product?.name}
          className="h-60 rounded object-cover w-full"
        />

        <div>
          <h1 className="text-2xl font-bold">
            {product?.name}
          </h1>

          <p className="text-blue-600 text-xl mt-2">
            ₹{product?.price}
          </p>

          <p className="mt-4 text-gray-600">
            {product?.description}
          </p>

          <p className="mt-2">
            Stock:{" "}
            {product?.countInStock > 0
              ? product.countInStock
              : "Out of Stock"}
          </p>

          {/* ✅ Show only for logged in normal user */}
          {product?.countInStock > 0 &&
            user && !user.isAdmin && (
              <>
                <select
                  value={qty}
                  onChange={(e) =>
                    setQty(Number(e.target.value))
                  }
                  className="border p-2 mt-3"
                >
                  {[...Array(product.countInStock).keys()].map(
                    (x) => (
                      <option key={x + 1} value={x + 1}>
                        {x + 1}
                      </option>
                    )
                  )}
                </select>

                <button
                  onClick={() =>
                    addToCart({ ...product, qty })
                  }
                  className="bg-blue-600 text-white px-4 py-2 mt-4 rounded"
                >
                  Add to Cart
                </button>
              </>
            )}

          {/* 🔔 If not logged in */}
          {!user && (
            <p className="text-red-500 mt-4">
              Please login to purchase this product
            </p>
          )}

          {/* 🔒 If admin */}
          {user && user.isAdmin && (
            <p className="text-gray-500 mt-4">
              Admin cannot purchase products
            </p>
          )}
        </div>
      </div>
    </div>
  );
}