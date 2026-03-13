
import { useState, useEffect, useContext } from "react";
import { useNavigate, useParams } from "react-router-dom";
import API from "../api/axios";
import { AuthContext } from "../context/AuthContext";

export default function AdminEditProduct() {
  const { id } = useParams();
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [brand, setBrand] = useState("");
  const [category, setCategory] = useState("");
  const [countInStock, setCountInStock] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState("");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!user?.isAdmin) {
      navigate("/");
      return;
    }

    const fetchProduct = async () => {
      try {
        const { data } = await API.get(`/products/${id}`);
        setName(data.name);
        setPrice(data.price);
        setBrand(data.brand);
        setCategory(data.category);
        setCountInStock(data.countInStock);
        setDescription(data.description);
        setImage(data.image);
      } catch (err) {
        setError("Failed to load product");
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id, user, navigate]);

  const submitHandler = async (e) => {
    e.preventDefault();

    try {
      await API.put(`/products/${id}`, {
        name,
        price,
        brand,
        category,
        countInStock,
        description,
        image,
      });

      navigate("/admin/products");
    } catch (err) {
      setError("Update failed");
    }
  };

  if (loading)
    return (
      <div className="flex justify-center items-center h-60 text-lg">
        Loading product...
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-100 px-4 py-10">

      <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-xl p-8">

        <h2 className="text-2xl font-bold mb-6 text-gray-800">
          Edit Product
        </h2>

        {error && (
          <p className="text-red-500 mb-4">{error}</p>
        )}

        <form
          onSubmit={submitHandler}
          className="grid md:grid-cols-2 gap-5"
        >

          <input
            className="border rounded-lg px-3 py-2 w-full focus:ring-2 focus:ring-blue-500"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Product Name"
          />

          <input
            className="border rounded-lg px-3 py-2 w-full focus:ring-2 focus:ring-blue-500"
            type="number"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            placeholder="Price"
          />

          <input
            className="border rounded-lg px-3 py-2 w-full focus:ring-2 focus:ring-blue-500"
            value={brand}
            onChange={(e) => setBrand(e.target.value)}
            placeholder="Brand"
          />

          <input
            className="border rounded-lg px-3 py-2 w-full focus:ring-2 focus:ring-blue-500"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            placeholder="Category"
          />

          <input
            className="border rounded-lg px-3 py-2 w-full focus:ring-2 focus:ring-blue-500"
            type="number"
            value={countInStock}
            onChange={(e) => setCountInStock(e.target.value)}
            placeholder="Stock"
          />

          <input
            className="border rounded-lg px-3 py-2 w-full focus:ring-2 focus:ring-blue-500"
            value={image}
            onChange={(e) => setImage(e.target.value)}
            placeholder="Image URL"
          />

          {image && (
            <div className="col-span-full">
              <img
                src={image}
                alt="Preview"
                className="h-32 rounded-lg border object-cover"
              />
            </div>
          )}

          <textarea
            className="border rounded-lg px-3 py-2 w-full col-span-full focus:ring-2 focus:ring-blue-500"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Product Description"
            rows="4"
          />

          <button
            className="col-span-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg transition"
          >
            Update Product
          </button>

        </form>

      </div>

    </div>
  );
}

