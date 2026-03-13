
import { useParams } from "react-router-dom";
import { useEffect, useState, useContext } from "react";
import API from "../api/axios";
import { CartContext } from "../context/CartContext";
import Loader from "../components/Loader";
import { AuthContext } from "../context/AuthContext";
import ProductCard from "../components/ProductCard";

export default function ProductPage() {

  const { id } = useParams();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [recommended, setRecommended] = useState([]);
  const [trending, setTrending] = useState([]);
  const [topProducts, setTopProducts] = useState([]);

  const [error, setError] = useState("");
  const [qty, setQty] = useState(1);

  const { user } = useContext(AuthContext);
  const { addToCart } = useContext(CartContext);

  useEffect(() => {

    const fetchData = async () => {

      try {

        const { data } = await API.get(`/products/${id}`);
        setProduct(data);

        /* 🧠 AI RECOMMENDATIONS */

        const rec = await API.get(`/products/recommended/${id}`);
        setRecommended(rec.data);

        /* 🔥 TRENDING PRODUCTS */

        const trend = await API.get("/products/trending");
        setTrending(trend.data);

        /* ⭐ TOP PRODUCTS */

        const top = await API.get("/products/top");
        setTopProducts(top.data);

      } catch (err) {

        setError("Product not found");

      } finally {

        setLoading(false);

      }

    };

    fetchData();

  }, [id]);

  if (loading) return <Loader />;

  if (error) return <p className="p-6 text-red-500">{error}</p>;

  return (

    <div className="p-6 max-w-6xl mx-auto">

      {/* PRODUCT SECTION */}

      <div className="grid md:grid-cols-2 gap-10 mb-10">

        <img
          src={product?.image || "/placeholder.png"}
          alt={product?.name}
          className="rounded object-cover w-full h-[87.5]"
        />

        <div>

          <h1 className="text-3xl font-bold">
            {product?.name}
          </h1>

          <p className="text-blue-600 text-2xl mt-3">
            ₹{product?.price}
          </p>

          <p className="mt-4 text-gray-600">
            {product?.description}
          </p>

          <p className="mt-3">
            Stock:{" "}
            {product?.countInStock > 0
              ? product.countInStock
              : "Out of Stock"}
          </p>

          {/* ADD TO CART */}

          {product?.countInStock > 0 &&
            user &&
            !user.isAdmin && (

              <div className="mt-4 flex gap-3">

                <select
                  value={qty}
                  onChange={(e) =>
                    setQty(Number(e.target.value))
                  }
                  className="border p-2"
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
                  className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
                >
                  Add to Cart
                </button>

              </div>

            )}

          {!user && (
            <p className="text-red-500 mt-4">
              Please login to purchase this product
            </p>
          )}

          {user && user.isAdmin && (
            <p className="text-gray-500 mt-4">
              Admin cannot purchase products
            </p>
          )}

        </div>

      </div>


      {/* 🧠 AI RECOMMENDED PRODUCTS */}

      {recommended.length > 0 && (
        <div className="mb-10">

          <h2 className="text-xl font-bold mb-4">
            Recommended Products
          </h2>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {recommended.map((p) => (
              <ProductCard key={p._id} product={p} />
            ))}
          </div>

        </div>
      )}


      {/* 🔥 TRENDING PRODUCTS */}

      {trending.length > 0 && (
        <div className="mb-10">

          <h2 className="text-xl font-bold mb-4">
            Trending Products
          </h2>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {trending.map((p) => (
              <ProductCard key={p._id} product={p} />
            ))}
          </div>

        </div>
      )}


      {/* ⭐ TOP PRODUCTS */}

      {topProducts.length > 0 && (
        <div>

          <h2 className="text-xl font-bold mb-4">
            Top Rated Products
          </h2>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {topProducts.map((p) => (
              <ProductCard key={p._id} product={p} />
            ))}
          </div>

        </div>
      )}

    </div>
  );
}

