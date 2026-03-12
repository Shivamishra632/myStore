import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState, useContext } from "react";
import API from "../api/axios";
import { AuthContext } from "../context/AuthContext";
import StripePayment from "../components/StripePayment";

export default function OrderPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }

    const fetchOrder = async () => {
      try {
        const { data } = await API.get(`/orders/${id}`);
        setOrder(data);
      } catch (err) {
        setError(err.response?.data?.message || "Order not found");
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [id, user, navigate]);

  if (loading) return <div className="p-6">Loading...</div>;
  if (error) return <div className="p-6 text-red-500">{error}</div>;

  return (
    <div className="p-6 max-w-lg mx-auto">
      <h2 className="text-xl font-bold mb-4">Order Details</h2>

      <p><strong>Order ID:</strong> {order._id}</p>
      <p><strong>Total:</strong> ₹{order.totalPrice}</p>

      <p>
        <strong>Payment Method:</strong> {order.paymentMethod}
      </p>

      <p>
        <strong>Payment Status:</strong>{" "}
        <span className={`font-semibold ${order.isPaid ? "text-green-600" : "text-red-600"}`}>
          {order.isPaid ? "Paid" : "Not Paid"}
        </span>
      </p>

      <p>
        <strong>Delivery Status:</strong>{" "}
        {order.status}
      </p>

      <h3 className="mt-4 font-semibold">Shipping Address:</h3>
      <p>
        {order.shippingAddress?.address},{" "}
        {order.shippingAddress?.city},{" "}
        {order.shippingAddress?.postalCode},{" "}
        {order.shippingAddress?.country}
      </p>

      <h3 className="mt-4 font-semibold">Items:</h3>

      {order.orderItems?.map((item) => (
        <div key={item.product} className="flex justify-between border-b py-2">
          <span>{item.name} × {item.qty}</span>
          <span>₹{item.price * item.qty}</span>
        </div>
      ))}

      {/* 🔥 Stripe only if payment method is Stripe */}
      {order.paymentMethod === "Stripe" && !order.isPaid && (
        <StripePayment
          orderId={order._id}
          totalPrice={order.totalPrice}
          onSuccess={async () => {
            alert("Payment Successful!");
            const { data } = await API.get(`/orders/${order._id}`);
            setOrder(data);
          }}
        />
      )}

      {/* COD Notice */}
      {order.paymentMethod === "COD" && !order.isPaid && (
        <div className="mt-4 p-3 bg-yellow-100 text-yellow-700 rounded">
          You will pay in cash when the order is delivered.
        </div>
      )}
    </div>
  );
}