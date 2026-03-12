import { useContext, useState, useEffect } from "react";
import { CartContext } from "../context/CartContext";
import { AuthContext } from "../context/AuthContext";
import API from "../api/axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function CheckoutPage() {
  const { cartItems } = useContext(CartContext);
  const { user } = useContext(AuthContext);

  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [country, setCountry] = useState("");

  const [paymentMethod, setPaymentMethod] = useState("COD");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    if (!user) navigate("/login");
    if (!cartItems?.length) navigate("/");
  }, [user, cartItems, navigate]);

  const totalPrice = cartItems.reduce(
    (acc, item) => acc + item.price * (item.qty || 1),
    0
  );

  const placeOrder = async () => {
    if (!address || !city || !postalCode || !country) {
      return setError("Please fill all shipping details");
    }

    try {
      setLoading(true);
      setError("");

      const { data } = await API.post("/orders", {
        orderItems: cartItems.map(item => ({
          name: item.name,
          qty: item.qty || 1,
          image: item.image,
          price: item.price,
          product: item._id
        })),
        shippingAddress: {
          address,
          city,
          postalCode,
          country,
        },
        totalPrice,
        paymentMethod,   // ✅ Important
      });

      toast.success("Order placed successfully");
      navigate(`/order/${data._id}`);

    } catch (err) {
      console.log("ORDER ERROR:", err.response?.data);
      toast.error("Failed to place order");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-lg mx-auto">
      <h2 className="text-xl font-bold mb-4">
        Checkout
      </h2>

      {error && (
        <div className="bg-red-100 text-red-600 p-2 mb-3 rounded">
          {error}
        </div>
      )}

      {/* Shipping Fields */}
      <input
        type="text"
        placeholder="Address"
        className="border p-2 w-full mb-3"
        value={address}
        onChange={(e) => setAddress(e.target.value)}
      />

      <input
        type="text"
        placeholder="City"
        className="border p-2 w-full mb-3"
        value={city}
        onChange={(e) => setCity(e.target.value)}
      />

      <input
        type="text"
        placeholder="Postal Code"
        className="border p-2 w-full mb-3"
        value={postalCode}
        onChange={(e) => setPostalCode(e.target.value)}
      />

      <input
        type="text"
        placeholder="Country"
        className="border p-2 w-full mb-3"
        value={country}
        onChange={(e) => setCountry(e.target.value)}
      />

      {/* 💳 Payment Method */}
      <div className="mb-4">
        <h3 className="font-semibold mb-2">Payment Method</h3>

        <div className="flex items-center gap-2 mb-2">
          <input
            type="radio"
            value="COD"
            checked={paymentMethod === "COD"}
            onChange={(e) => setPaymentMethod(e.target.value)}
          />
          <label>Cash on Delivery</label>
        </div>

        <div className="flex items-center gap-2">
          <input
            type="radio"
            value="Stripe"
            checked={paymentMethod === "Stripe"}
            onChange={(e) => setPaymentMethod(e.target.value)}
          />
          <label>Pay with Card (Stripe)</label>
        </div>
      </div>

      <div className="font-bold mb-4">
        Total: ₹{totalPrice}
      </div>

      <button
        onClick={placeOrder}
        disabled={loading}
        className="bg-green-600 text-white px-4 py-2 rounded w-full"
      >
        {loading ? "Placing Order..." : "Place Order"}
      </button>
    </div>
  );
}