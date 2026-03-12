import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import API from "../api/axios";
import ProductCard from "../components/ProductCard";
import Loader from "../components/Loader";

export default function Home() {
  const location = useLocation();
  const navigate = useNavigate();




  const queryParams = new URLSearchParams(location.search);
  const keyword = queryParams.get("keyword") || "";
  const sort = queryParams.get("sort") || "newest";
  const pageNumber = queryParams.get("pageNumber") || 1;

  const [products, setProducts] = useState([]);
  const [pages, setPages] = useState(1);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState(keyword);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      const { data } = await API.get(
        `/products?keyword=${keyword}&pageNumber=${pageNumber}&sort=${sort}`
      )

      setProducts(data.products);
      setPages(data.pages);
      setPage(data.page);
      setLoading(false);
    };

    fetchProducts();
  }, [keyword, pageNumber, sort]);

  const submitHandler = (e) => {
    e.preventDefault();
    navigate(`/?keyword=${search}`);
  };

  if (loading) return <Loader />;

  return (
    <div className="p-4">

      {/* 🔍 Search */}
      <form
        onSubmit={submitHandler}
        className="mb-4 flex gap-2"
      >
        <input
          type="text"
          placeholder="Search products..."
          className="border p-2 flex-1 rounded"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <button className="bg-blue-600 text-white px-4 rounded">
          Search
        </button>
      </form>
      <div className="flex justify-end mb-4">
        <select
          value={sort}
          onChange={(e) =>
            navigate(
              `/?keyword=${keyword}&pageNumber=1&sort=${e.target.value}`
            )
          }
          className="border p-2 rounded"
        >
          <option value="newest">Newest</option>
          <option value="low">Price: Low to High</option>
          <option value="high">Price: High to Low</option>
        </select>
      </div>

      {/* 🛒 Products */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {products.map((product) => (
          <ProductCard
            key={product._id}
            product={product}
          />
        ))}
      </div>

      {/* 📄 Pagination */}
      <div className="flex justify-center mt-6 gap-2">
        {[...Array(pages).keys()].map((x) => (
          <button
            key={x + 1}
            onClick={() =>
              navigate(
                `/?keyword=${keyword}&pageNumber=${x + 1}&sort=${sort}`
              )
            }
            className={`px-3 py-1 rounded ${x + 1 == page
              ? "bg-blue-600 text-white"
              : "bg-gray-200"
              }`}
          >
            {x + 1}
          </button>
        ))}
      </div>
    </div>
  );
}