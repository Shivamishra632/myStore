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
        headers: {
          "Content-Type": "multipart/form-data",
        },
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
    <div className="p-6 max-w-lg mx-auto">
      <h2 className="text-xl font-bold mb-4">Create Product</h2>

      {error && (
        <p className="text-red-500 mb-3">{error}</p>
      )}

      <form onSubmit={submitHandler} className="space-y-3">
        <input
          type="text"
          placeholder="Product Name"
          className="border p-2 w-full"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />

        <input
          type="number"
          placeholder="Price"
          className="border p-2 w-full"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          required
        />

        <input
          type="text"
          placeholder="Brand"
          className="border p-2 w-full"
          value={brand}
          onChange={(e) => setBrand(e.target.value)}
        />

        <input
          type="text"
          placeholder="Category"
          className="border p-2 w-full"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        />

        <input
          type="number"
          placeholder="Stock"
          className="border p-2 w-full"
          value={countInStock}
          onChange={(e) => setCountInStock(e.target.value)}
        />

        <div>
          <input
            type="file"
            onChange={uploadHandler}
            className="border p-2 w-full"
          />

          {uploading && (
            <p className="text-blue-500 mt-2">
              Uploading image...
            </p>
          )}

          {image && (
            <img
              src={image}
              alt="Preview"
              className="mt-3 h-32 object-cover rounded"
            />
          )}
        </div>

        <textarea
          placeholder="Description"
          className="border p-2 w-full"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        <button
          type="submit"
          disabled={loading}
          className="bg-green-600 text-white px-4 py-2 rounded w-full"
        >
          {loading ? "Creating..." : "Create Product"}
        </button>
      </form>
    </div>
  );
}