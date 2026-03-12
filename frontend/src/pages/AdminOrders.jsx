import { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/axios";
import { AuthContext } from "../context/AuthContext";
import toast from "react-hot-toast";

export default function AdminOrders() {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user?.isAdmin) {
      navigate("/");
      return;
    }

    const fetchOrders = async () => {
      try {
        const { data } = await API.get("/orders");
        setOrders(data);
      } catch (err) {
        toast.error("Failed to fetch orders");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [user, navigate]);

  const updateStatus = async (id, status) => {
    try {
      const { data } = await API.put(
        `/orders/${id}/status`,
        { status }
      );

      setOrders(
        orders.map((order) =>
          order._id === id ? data : order
        )
      );

      toast.success("Order status updated");

    } catch (error) {
      toast.error("Failed to update status");
    }
  };

  if (loading) return <div className="p-6">Loading...</div>;

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h2 className="text-xl font-bold mb-4">
        Admin Orders
      </h2>

      {orders.map((order) => (
        <div
          key={order._id}
          className="border-b py-4 flex justify-between items-center"
        >
          <div>
            <p><strong>ID:</strong> {order._id}</p>
            <p><strong>User:</strong> {order.user?.name}</p>
            <p><strong>Total:</strong> ₹{order.totalPrice}</p>
            <p><strong>Paid:</strong> {order.isPaid ? "Yes" : "No"}</p>

            <div className="mt-2">
              <label className="mr-2 font-semibold">
                Status:
              </label>

              <select
                value={order.status}
                onChange={(e) =>
                  updateStatus(order._id, e.target.value)
                }
                className="border p-1 rounded"
              >
                <option value="Pending">Pending</option>
                <option value="Processing">Processing</option>
                <option value="Shipped">Shipped</option>
                <option value="Delivered">Delivered</option>
                <option value="Cancelled">Cancelled</option>
              </select>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}