
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
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 p-8">

      <div className="max-w-6xl mx-auto">

        {/* HEADER */}
        <div className="flex justify-between items-center mb-8">

          <h2 className="text-3xl font-bold text-gray-800 dark:text-white">
            Product Management
          </h2>

          <Link
            to="/admin/product/create"
            className="bg-green-600 hover:bg-green-700 text-white px-5 py-2 rounded-lg shadow transition"
          >
            + Create Product
          </Link>

        </div>

        {/* TABLE */}

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow overflow-hidden">

          <table className="w-full text-left">

            <thead className="bg-gray-200 dark:bg-gray-700">

              <tr>

                <th className="p-4">Image</th>
                <th className="p-4">Name</th>
                <th className="p-4">Price</th>
                <th className="p-4">Stock</th>
                <th className="p-4 text-right">Actions</th>

              </tr>

            </thead>

            <tbody>

              {products.length === 0 ? (
                <tr>
                  <td colSpan="5" className="p-8 text-center text-gray-500">
                    No products found
                  </td>
                </tr>
              ) : (

                products.map((product) => (

                  <tr
                    key={product._id}
                    className="border-b hover:bg-gray-50 dark:hover:bg-gray-700 transition"
                  >

                    {/* IMAGE */}

                    <td className="p-4">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-14 h-14 object-cover rounded"
                      />
                    </td>

                    {/* NAME */}

                    <td className="p-4 font-medium text-gray-800 dark:text-white">
                      {product.name}
                    </td>

                    {/* PRICE */}

                    <td className="p-4 text-gray-600 dark:text-gray-300">
                      ₹{product.price}
                    </td>

                    {/* STOCK */}

                    <td className="p-4">

                      {product.countInStock > 0 ? (
                        <span className="text-green-600 font-semibold">
                          In Stock
                        </span>
                      ) : (
                        <span className="text-red-500 font-semibold">
                          Out of Stock
                        </span>
                      )}

                    </td>

                    {/* ACTIONS */}

                    <td className="p-4 text-right">

                      <Link
                        to={`/admin/product/${product._id}/edit`}
                        className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded mr-3 text-sm"
                      >
                        Edit
                      </Link>

                      <button
                        onClick={() => deleteHandler(product._id)}
                        className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm"
                      >
                        Delete
                      </button>

                    </td>

                  </tr>

                ))
              )}

            </tbody>

          </table>

        </div>

      </div>

    </div>
  );
}

