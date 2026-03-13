
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import API from "../api/axios";
import ProductCard from "../components/ProductCard";
import Loader from "../components/Loader";

import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import "swiper/css";

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
      );

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

  const topRated = products.filter((p) => p.rating >= 4).slice(0, 8);
  const trending = [...products]
    .sort((a, b) => b.numReviews - a.numReviews)
    .slice(0, 8);
  const categories = [...new Set(products.map((p) => p.category))];

  return (
    <div className="bg-gray-50 min-h-screen">

      {/* HERO BANNER */}

      <div className="max-w-7xl mx-auto px-4 pt-6">

        <Swiper
          modules={[Autoplay]}
          autoplay={{ delay: 4000 }}
          loop
          className="rounded-2xl overflow-hidden shadow-lg"
        >
          <SwiperSlide>
            <img
              src="/Sale.png"
              alt="Sale Banner"
              className="w-full object-cover aspect-[16/6] sm:aspect-[16/5] lg:aspect-[16/4]"
            />
          </SwiperSlide>

          <SwiperSlide>
            <img
              src="/sale1.png"
              alt="Sale Banner"
              className="w-full object-cover aspect-[16/6] sm:aspect-[16/5] lg:aspect-[16/4]"
            />
          </SwiperSlide>

          <SwiperSlide>
            <img
              src="/sale3.png"
              alt="Sale Banner"
              className="w-full object-cover aspect-[16/6] sm:aspect-[16/5] lg:aspect-[16/4]"
            />
          </SwiperSlide>
        </Swiper>

      </div>

      {/* SEARCH + SORT */}

      <div className="max-w-7xl mx-auto px-4 mt-8">

        <div className="bg-white rounded-xl shadow-sm p-4 flex flex-col lg:flex-row gap-4 justify-between items-center">

          <form
            onSubmit={submitHandler}
            className="flex flex-col sm:flex-row w-full lg:max-w-xl gap-2"
          >
            <input
              type="text"
              placeholder="Search products..."
              className="border px-4 py-2 w-full rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />

            <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition">
              Search
            </button>
          </form>

          <select
            value={sort}
            onChange={(e) =>
              navigate(`/?keyword=${keyword}&pageNumber=1&sort=${e.target.value}`)
            }
            className="border px-4 py-2 rounded-lg w-full sm:w-auto"
          >
            <option value="newest">Newest</option>
            <option value="low">Price: Low to High</option>
            <option value="high">Price: High to Low</option>
          </select>

        </div>

      </div>

      {/* PRODUCT SECTIONS */}

      <div className="max-w-7xl mx-auto px-4 mt-10 space-y-14">

        {/* TOP RATED */}

        {topRated.length > 0 && (
          <section>
            <h2 className="text-2xl font-bold mb-6">⭐ Top Rated</h2>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-5">
              {topRated.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          </section>
        )}

        {/* TRENDING */}

        {trending.length > 0 && (
          <section>
            <h2 className="text-2xl font-bold mb-6">🔥 Trending</h2>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-5">
              {trending.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          </section>
        )}

        {/* CATEGORY SECTIONS */}

        {categories.map((cat) => (
          <section key={cat}>
            <h2 className="text-2xl font-bold mb-6">{cat}</h2>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-5">
              {products
                .filter((p) => p.category === cat)
                .slice(0, 6)
                .map((product) => (
                  <ProductCard key={product._id} product={product} />
                ))}
            </div>
          </section>
        ))}

        {/* ALL PRODUCTS */}

        <section>
          <h2 className="text-2xl font-bold mb-6">🛒 All Products</h2>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-5">
            {products.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        </section>

      </div>

      {/* PAGINATION */}

      <div className="flex flex-wrap justify-center mt-14 gap-3 pb-10">

        {[...Array(pages).keys()].map((x) => (
          <button
            key={x + 1}
            onClick={() =>
              navigate(`/?keyword=${keyword}&pageNumber=${x + 1}&sort=${sort}`)
            }
            className={`px-5 py-2 rounded-lg text-sm transition ${
              x + 1 === page
                ? "bg-blue-600 text-white"
                : "bg-white border hover:bg-gray-100"
            }`}
          >
            {x + 1}
          </button>
        ))}

      </div>

    </div>
  );
}

