import { Link } from "react-router-dom";

export default function ProductCard({ product }) {
  return (
    <div className="bg-white p-3 rounded-xl shadow">
      <Link to={`/product/${product?._id}`}>
        <img
          src={product?.image || "/placeholder.png"}
          alt={product?.name}
          className="h-40 w-full object-cover rounded"
        />
        <h2 className="mt-2 font-semibold">{product?.name}</h2>
        <p className="text-blue-600 font-bold">
          ₹{product?.price}
        </p>
      </Link>
    </div>
  );
}