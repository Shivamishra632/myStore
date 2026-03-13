
import { useContext, useState, useEffect } from "react";
import { CartContext } from "../context/CartContext";
import { AuthContext } from "../context/AuthContext";
import API from "../api/axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

export default function CheckoutPage() {

  const { cartItems, clearCart } = useContext(CartContext);
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

      await API.post("/orders", {
        orderItems: cartItems.map(item => ({
          name: item.name,
          qty: item.qty || 1,
          image: item.image,
          price: item.price,
          product: item._id
        })),
        shippingAddress: { address, city, postalCode, country },
        totalPrice,
        paymentMethod
      });

      toast.success("Order placed successfully");

      clearCart();

      navigate("/myorders");

    } catch (err) {

      console.log(err);
      toast.error("Order failed");

    } finally {

      setLoading(false);

    }

  };

  return (

    <div className="max-w-6xl mx-auto p-6 grid md:grid-cols-2 gap-10">

      {/* LEFT SIDE — SHIPPING */}

      <div>

        <h2 className="text-2xl font-bold mb-6">
          Shipping Details
        </h2>

        {error && (
          <div className="bg-red-100 text-red-600 p-2 mb-3 rounded">
            {error}
          </div>
        )}

        <input
          type="text"
          placeholder="Address"
          className="border p-2 w-full mb-3 rounded"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
        />

        <input
          type="text"
          placeholder="City"
          className="border p-2 w-full mb-3 rounded"
          value={city}
          onChange={(e) => setCity(e.target.value)}
        />

        <input
          type="text"
          placeholder="Postal Code"
          className="border p-2 w-full mb-3 rounded"
          value={postalCode}
          onChange={(e) => setPostalCode(e.target.value)}
        />

        <input
          type="text"
          placeholder="Country"
          className="border p-2 w-full mb-4 rounded"
          value={country}
          onChange={(e) => setCountry(e.target.value)}
        />

        <div className="mb-6">

          <h3 className="font-semibold mb-2">
            Payment Method
          </h3>

          <label className="flex items-center gap-2">

            <input
              type="radio"
              value="COD"
              checked={paymentMethod === "COD"}
              onChange={(e) => setPaymentMethod(e.target.value)}
            />

            Cash on Delivery

          </label>

        </div>

      </div>


      {/* RIGHT SIDE — ORDER SUMMARY */}

      <div className="bg-gray-50 p-6 rounded-lg shadow">

        <h2 className="text-xl font-bold mb-4">
          Order Summary
        </h2>

        <div className="space-y-3 max-h-60 overflow-auto mb-4">

          {cartItems.map((item) => (

            <div
              key={item._id}
              className="flex items-center gap-3 border-b pb-2"
            >

              <img
                src={item.image}
                alt={item.name}
                className="w-12 h-12 object-cover rounded"
              />

              <div className="flex-1">

                <p className="text-sm font-medium">
                  {item.name}
                </p>

                <p className="text-sm text-gray-500">
                  {item.qty} × ₹{item.price}
                </p>

              </div>

              <div className="font-semibold">
                ₹{item.price * item.qty}
              </div>

            </div>

          ))}

        </div>

        <div className="border-t pt-3 mb-4">

          <div className="flex justify-between font-bold text-lg">
            <span>Total</span>
            <span>₹{totalPrice}</span>
          </div>

        </div>

        <button
          onClick={placeOrder}
          disabled={loading}
          className="bg-green-600 hover:bg-green-700 text-white w-full py-3 rounded font-semibold"
        >
          {loading ? "Processing..." : "Place Order"}
        </button>

      </div>

    </div>
  );
}

