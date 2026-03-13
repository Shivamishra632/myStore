
import { Link } from "react-router-dom";

export default function NotFoundPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">

      <div className="bg-white shadow-xl rounded-2xl p-10 text-center max-w-md w-full">

        <h1 className="text-6xl font-extrabold text-red-500">404</h1>

        <h2 className="text-2xl font-semibold mt-4">
          Page Not Found
        </h2>

        <p className="text-gray-500 mt-2">
          The page you are looking for doesn’t exist or has been moved.
        </p>

        <Link
          to="/"
          className="inline-block mt-6 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition"
        >
          Go Back Home
        </Link>

      </div>

    </div>
  );
}

