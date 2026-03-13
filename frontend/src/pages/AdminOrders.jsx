
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
      const { data } = await API.put(`/orders/${id}/status`, { status });

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

  if (loading)
    return (
      <div className="flex justify-center items-center h-screen text-lg">
        Loading orders...
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 p-8">

      <div className="max-w-6xl mx-auto">

        <h2 className="text-3xl font-bold mb-8 text-gray-800 dark:text-white">
          Order Management
        </h2>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow overflow-x-auto">

          <table className="w-full text-left">

            <thead className="bg-gray-200 dark:bg-gray-700">
              <tr>
                <th className="p-4">Order ID</th>
                <th className="p-4">User</th>
                <th className="p-4">Total</th>
                <th className="p-4">Payment</th>
                <th className="p-4">Status</th>
              </tr>
            </thead>

            <tbody>

              {orders.map((order) => (

                <tr
                  key={order._id}
                  className="border-b hover:bg-gray-50 dark:hover:bg-gray-700 transition"
                >

                  <td className="p-4 text-sm text-gray-700 dark:text-gray-300">
                    {order._id.slice(-8)}
                  </td>

                  <td className="p-4 font-medium text-gray-800 dark:text-white">
                    {order.user?.name}
                  </td>

                  <td className="p-4 text-gray-600 dark:text-gray-300">
                    ₹{order.totalPrice}
                  </td>

                  <td className="p-4">

                    {order.isPaid ? (
                      <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm">
                        Paid
                      </span>
                    ) : (
                      <span className="bg-red-100 text-red-600 px-3 py-1 rounded-full text-sm">
                        Pending
                      </span>
                    )}

                  </td>

                  <td className="p-4">

                    <select
                      value={order.status}
                      onChange={(e) =>
                        updateStatus(order._id, e.target.value)
                      }
                      className="border rounded-lg px-3 py-1 bg-white dark:bg-gray-900 dark:text-white"
                    >
                      <option value="Pending">Pending</option>
                      <option value="Processing">Processing</option>
                      <option value="Shipped">Shipped</option>
                      <option value="Delivered">Delivered</option>
                      <option value="Cancelled">Cancelled</option>
                    </select>

                  </td>

                </tr>

              ))}

            </tbody>

          </table>

        </div>

      </div>

    </div>
  );
}

