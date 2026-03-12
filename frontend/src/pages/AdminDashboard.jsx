import { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/axios";
import { AuthContext } from "../context/AuthContext";
import toast from "react-hot-toast";
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

  useEffect(() => {
    if (!user?.isAdmin) {
      navigate("/");
      return;
    }

    const fetchStats = async () => {
      try {
        const { data } = await API.get("/dashboard");
        setStats(data);
      } catch (error) {
        toast.error("Failed to load dashboard");
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [user, navigate]);

  if (loading) return <div className="p-6">Loading...</div>;

  const chartData = stats.monthlyRevenue.map((item) => ({
    month: `Month ${item._id}`,
    revenue: item.revenue
  }));

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">
        Admin Dashboard
      </h2>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-10">
        <div className="bg-white dark:bg-gray-800 p-6 rounded shadow">
          <h3>Total Users</h3>
          <p className="text-2xl font-bold">{stats.totalUsers}</p>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded shadow">
          <h3>Total Products</h3>
          <p className="text-2xl font-bold">{stats.totalProducts}</p>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded shadow">
          <h3>Total Orders</h3>
          <p className="text-2xl font-bold">{stats.totalOrders}</p>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded shadow">
          <h3>Total Revenue</h3>
          <p className="text-2xl font-bold">
            ₹{stats.totalRevenue}
          </p>
        </div>
      </div>

      {/* Revenue Chart */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded shadow">
        <h3 className="text-xl font-semibold mb-4">
          Monthly Revenue
        </h3>

        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="revenue" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}