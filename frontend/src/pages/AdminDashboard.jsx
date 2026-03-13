
import { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/axios";
import { AuthContext } from "../context/AuthContext";
import toast from "react-hot-toast";
import socket from "../socket";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid
} from "recharts";



export default function AdminDashboard() {

  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [liveRevenue, setLiveRevenue] = useState(0);

  useEffect(() => {

    if (!user?.isAdmin) {
      navigate("/");
      return;
    }

    const fetchStats = async () => {
      try {

        const { data } = await API.get("/dashboard");

        setStats(data);
        setLiveRevenue(data.totalRevenue);

      } catch (error) {

        toast.error("Failed to load dashboard");

      } finally {

        setLoading(false);

      }
    };

    fetchStats();

  }, [user, navigate]);



  /* SOCKET LIVE EVENTS */

  useEffect(() => {

  socket.on("newOrder", (data) => {
    toast.success(`New Order ₹${data.total}`);
  });

  socket.on("salesUpdate", (revenue) => {
    setLiveRevenue(revenue);
  });

  return () => {
    socket.removeAllListeners("newOrder");
    socket.removeAllListeners("salesUpdate");
  };

}, []);



  if (loading) {
    return (
      <div className="p-10 text-center text-lg">
        Loading dashboard...
      </div>
    );
  }

  if (!stats) return null;



  const chartData = stats?.monthlyRevenue?.map((item) => ({
    month: `Month ${item._id}`,
    revenue: item.revenue
  })) || [];



  const ordersChart = stats?.monthlyOrders?.map((item) => ({
    month: `Month ${item._id}`,
    orders: item.orders
  })) || [];



  const growth =
    stats.lastMonthRevenue
      ? (
          ((stats.totalRevenue - stats.lastMonthRevenue) /
            stats.lastMonthRevenue) *
          100
        ).toFixed(1)
      : 0;



  return (

    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 p-6">

      <h2 className="text-3xl font-bold mb-8">
        Admin Dashboard
      </h2>



      {/* STATS CARDS */}

      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-10">

        <div className="bg-linear-to-r from-blue-500 to-blue-600 text-white p-6 rounded-xl shadow hover:scale-105 transition">
          <p>Total Users</p>
          <p className="text-3xl font-bold">{stats.totalUsers}</p>
        </div>

        <div className="bg-linear-to-r from-green-500 to-green-600 text-white p-6 rounded-xl shadow hover:scale-105 transition">
          <p>Total Products</p>
          <p className="text-3xl font-bold">{stats.totalProducts}</p>
        </div>

        <div className="bg-linear-to-r from-purple-500 to-purple-600 text-white p-6 rounded-xl shadow hover:scale-105 transition">
          <p>Total Orders</p>
          <p className="text-3xl font-bold">{stats.totalOrders}</p>
        </div>

        <div className="bg-linear-to-r from-red-500 to-red-600 text-white p-6 rounded-xl shadow hover:scale-105 transition">
          <p>Total Revenue</p>
          <p className="text-3xl font-bold">
            ₹{liveRevenue}
          </p>
        </div>

      </div>



      {/* REVENUE GROWTH */}

      <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow mb-10">

        <h3 className="text-lg font-semibold">
          Revenue Growth
        </h3>

        <p className="text-3xl font-bold text-green-500">
          {growth}% ↑
        </p>

      </div>



      {/* CHARTS */}

      <div className="grid md:grid-cols-2 gap-6 mb-10">

        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow">

          <h3 className="text-lg font-semibold mb-4">
            Monthly Revenue
          </h3>

          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="revenue" radius={[6,6,0,0]} />
            </BarChart>
          </ResponsiveContainer>

        </div>



        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow">

          <h3 className="text-lg font-semibold mb-4">
            Monthly Orders
          </h3>

          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={ordersChart}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="orders" radius={[6,6,0,0]} />
            </BarChart>
          </ResponsiveContainer>

        </div>

      </div>



      {/* RECENT ORDERS */}

      <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow mb-10">

        <h3 className="text-lg font-semibold mb-4">
          Recent Orders
        </h3>

        <table className="w-full text-left">

          <thead>
            <tr className="border-b">
              <th>User</th>
              <th>Total</th>
              <th>Status</th>
            </tr>
          </thead>

          <tbody>

            {stats.recentOrders?.map((order) => (

              <tr key={order._id} className="border-b">

                <td>{order.user?.name}</td>

                <td>₹{order.totalPrice}</td>

                <td>

                  {order.isPaid ? (
                    <span className="text-green-500 font-semibold">
                      Paid
                    </span>
                  ) : (
                    <span className="text-red-500 font-semibold">
                      Pending
                    </span>
                  )}

                </td>

              </tr>

            ))}

          </tbody>

        </table>

      </div>



      {/* TOP PRODUCTS */}

      <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow">

        <h3 className="text-lg font-semibold mb-4">
          Top Selling Products
        </h3>

        {stats.topProducts?.map((p) => (

          <div
            key={p._id}
            className="flex justify-between border-b py-2"
          >

            <span>{p.name}</span>

            <span className="font-semibold">
              {p.totalSold} sold
            </span>

          </div>

        ))}

      </div>

    </div>

  );
}

