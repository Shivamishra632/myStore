import { useEffect, useState, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import API from "../api/axios";
import { AuthContext } from "../context/AuthContext";

export default function MyOrders() {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }

    const fetchOrders = async () => {
      try {
        const { data } = await API.get("/orders/myorders", {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        });
        setOrders(data);
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [user, navigate]);

  if (loading) return <div className="p-6">Loading...</div>;

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h2 className="text-xl font-bold mb-4">
        My Orders
      </h2>

      {orders.length === 0 ? (
        <p>No orders yet.</p>
      ) : (
        orders.map((order) => (
          <div
            key={order._id}
            className="border-b py-3 flex justify-between items-center"
          >
            <div>
              <p><strong>ID:</strong> {order._id}</p>
              <p><strong>Total:</strong> ₹{order.totalPrice}</p>
              <p>
                <strong>Paid:</strong>{" "}
                {order.isPaid ? "Yes" : "No"}
              </p>
              <p>
                <strong>Delivered:</strong>{" "}
                {order.isDelivered ? "Yes" : "No"}
              </p>
            </div>

            <Link
              to={`/order/${order._id}`}
              className="bg-blue-600 text-white px-4 py-2 rounded"
            >
              View
            </Link>
          </div>
        ))
      )}
    </div>
  );
}