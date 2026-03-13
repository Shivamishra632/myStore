
import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/axios";
import { AuthContext } from "../context/AuthContext";
import toast from "react-hot-toast";

export default function AdminCreateProduct() {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [brand, setBrand] = useState("");
  const [category, setCategory] = useState("");
  const [countInStock, setCountInStock] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [uploading, setUploading] = useState(false);

  const uploadHandler = async (e) => {
    const file = e.target.files[0];
    const formData = new FormData();
    formData.append("image", file);

    try {
      setUploading(true);
      const { data } = await API.post("/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setImage(data.imageUrl);
      toast.success("Image uploaded successfully");

    } catch (error) {
      toast.error("Failed to upload image");
    } finally {
      setUploading(false);
    }
  };

  const submitHandler = async (e) => {
    e.preventDefault();

    if (!image) {
      return setError("Please upload an image");
    }

    if (!user?.isAdmin) {
      return navigate("/");
    }

    try {
      setLoading(true);
      setError("");

      await API.post("/products", {
        name,
        price,
        brand,
        category,
        countInStock,
        description,
        image,
      });

      toast.success("Product created successfully");
      navigate("/admin/products");

    } catch (err) {
      toast.error("Failed to create product");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-10 px-4">

      <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-xl p-8">

        <h2 className="text-2xl font-bold mb-6 text-gray-800">
          Create New Product
        </h2>

        {error && (
          <p className="text-red-500 mb-4">{error}</p>
        )}

        <form
          onSubmit={submitHandler}
          className="grid md:grid-cols-2 gap-5"
        >

          {/* NAME */}
          <input
            type="text"
            placeholder="Product Name"
            className="border rounded-lg px-3 py-2 w-full focus:ring-2 focus:ring-green-500"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />

          {/* PRICE */}
          <input
            type="number"
            placeholder="Price"
            className="border rounded-lg px-3 py-2 w-full focus:ring-2 focus:ring-green-500"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            required
          />

          {/* BRAND */}
          <input
            type="text"
            placeholder="Brand"
            className="border rounded-lg px-3 py-2 w-full focus:ring-2 focus:ring-green-500"
            value={brand}
            onChange={(e) => setBrand(e.target.value)}
          />

          {/* CATEGORY */}
          <input
            type="text"
            placeholder="Category"
            className="border rounded-lg px-3 py-2 w-full focus:ring-2 focus:ring-green-500"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          />

          {/* STOCK */}
          <input
            type="number"
            placeholder="Stock"
            className="border rounded-lg px-3 py-2 w-full focus:ring-2 focus:ring-green-500"
            value={countInStock}
            onChange={(e) => setCountInStock(e.target.value)}
          />

          {/* IMAGE UPLOAD */}
          <div className="col-span-full">

            <label className="block font-medium mb-2">
              Product Image
            </label>

            <input
              type="file"
              onChange={uploadHandler}
              className="border rounded-lg px-3 py-2 w-full"
            />

            {uploading && (
              <p className="text-blue-500 mt-2">
                Uploading image...
              </p>
            )}

            {image && (
              <div className="mt-3">
                <img
                  src={image}
                  alt="Preview"
                  className="h-32 rounded-lg object-cover border"
                />
              </div>
            )}

          </div>

          {/* DESCRIPTION */}
          <textarea
            placeholder="Description"
            className="border rounded-lg px-3 py-2 w-full col-span-full focus:ring-2 focus:ring-green-500"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />

          {/* BUTTON */}
          <button
            type="submit"
            disabled={loading}
            className="col-span-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg transition"
          >
            {loading ? "Creating Product..." : "Create Product"}
          </button>

        </form>

      </div>

    </div>
  );
}

