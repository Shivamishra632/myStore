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

  if (loading) return <div className="p-6">Loading...</div>;

  return (
    <div className="p-6 max-w-lg mx-auto">
      <h2 className="text-xl font-bold mb-4">Edit Product</h2>

      {error && <p className="text-red-500 mb-3">{error}</p>}

      <form onSubmit={submitHandler} className="space-y-3">
        <input className="border p-2 w-full" value={name} onChange={(e) => setName(e.target.value)} />
        <input className="border p-2 w-full" type="number" value={price} onChange={(e) => setPrice(e.target.value)} />
        <input className="border p-2 w-full" value={brand} onChange={(e) => setBrand(e.target.value)} />
        <input className="border p-2 w-full" value={category} onChange={(e) => setCategory(e.target.value)} />
        <input className="border p-2 w-full" type="number" value={countInStock} onChange={(e) => setCountInStock(e.target.value)} />
        <input className="border p-2 w-full" value={image} onChange={(e) => setImage(e.target.value)} />
        <textarea className="border p-2 w-full" value={description} onChange={(e) => setDescription(e.target.value)} />

        <button className="bg-blue-600 text-white py-2 rounded w-full">
          Update Product
        </button>
      </form>
    </div>
  );
}