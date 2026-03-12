import { useEffect, useState, useContext } from "react";
import API from "../api/axios";
import { AuthContext } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";

export default function AdminProductList() {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const [products, setProducts] = useState([]);

  useEffect(() => {
    if (!user || !user.isAdmin) {
      navigate("/");
      return;
    }

    const fetchProducts = async () => {
      const { data } = await API.get("/products");
      setProducts(data.products);
    };

    fetchProducts();
  }, [user, navigate]);

  const deleteHandler = async (id) => {
    if (window.confirm("Delete this product?")) {
      await API.delete(`/products/${id}`);
      setProducts(products.filter((p) => p._id !== id));
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="flex justify-between mb-4">
        <h2 className="text-xl font-bold">Admin Products</h2>
        <Link
          to="/admin/product/create"
          className="bg-green-600 text-white px-4 py-2 rounded"
        >
          Create Product
        </Link>
      </div>

      {products.map((product) => (
        <div
          key={product._id}
          className="flex justify-between border-b py-2"
        >
          <span>{product.name}</span>
          <div>
            <Link
              to={`/admin/product/${product._id}/edit`}
              className="text-blue-600 mr-3"
            >
              Edit
            </Link>
            <button
              onClick={() => deleteHandler(product._id)}
              className="text-red-600"
            >
              Delete
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}