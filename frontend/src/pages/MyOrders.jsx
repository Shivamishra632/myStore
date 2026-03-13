
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

  if (loading)
    return (
      <div className="flex justify-center items-center h-[50vh] text-lg">
        Loading orders...
      </div>
    );

  return (
    <div className="min-h-[80vh] max-w-6xl mx-auto px-4 py-8">

      <h2 className="text-2xl md:text-3xl font-bold mb-8">
        My Orders
      </h2>

      {orders.length === 0 ? (

        <div className="text-center bg-white shadow rounded-xl p-8">
          <p className="text-gray-500 mb-4">
            You haven't placed any orders yet.
          </p>

          <Link
            to="/"
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition"
          >
            Start Shopping
          </Link>
        </div>

      ) : (

        <div className="grid gap-6">

          {orders.map((order) => (

            <div
              key={order._id}
              className="bg-white border rounded-xl shadow-sm p-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4 hover:shadow-md transition"
            >

              {/* ORDER INFO */}

              <div className="space-y-1">

                <p className="text-sm text-gray-500">
                  Order ID
                </p>

                <p className="font-semibold">
                  {order._id}
                </p>

                <p className="text-gray-600">
                  Total: <span className="font-medium">₹{order.totalPrice}</span>
                </p>

              </div>

              {/* STATUS */}

              <div className="flex flex-col sm:flex-row gap-3">

                <span
                  className={`px-3 py-1 rounded-full text-sm font-medium ${
                    order.isPaid
                      ? "bg-green-100 text-green-700"
                      : "bg-red-100 text-red-600"
                  }`}
                >
                  {order.isPaid ? "Paid" : "Pending"}
                </span>

                <span
                  className={`px-3 py-1 rounded-full text-sm font-medium ${
                    order.isDelivered
                      ? "bg-green-100 text-green-700"
                      : "bg-yellow-100 text-yellow-700"
                  }`}
                >
                  {order.isDelivered ? "Delivered" : "Processing"}
                </span>

              </div>

              {/* VIEW BUTTON */}

              <Link
                to={`/order/${order._id}`}
                className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg text-center transition"
              >
                View Details
              </Link>

            </div>

          ))}

        </div>

      )}

    </div>
  );
}

