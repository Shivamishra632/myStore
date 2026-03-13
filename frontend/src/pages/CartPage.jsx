
import { useContext } from "react";
import { CartContext } from "../context/CartContext";
import { Link } from "react-router-dom";

export default function CartPage() {
  const { cartItems, removeFromCart } = useContext(CartContext);

  const totalPrice = cartItems.reduce(
    (acc, item) => acc + item.price * (item.qty || 1),
    0
  );

  if (!cartItems?.length) {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center text-center px-6">
        <h2 className="text-2xl font-bold mb-4">Your Cart is Empty 🛒</h2>
        <p className="text-gray-500 mb-6">
          Looks like you haven't added anything yet.
        </p>

        <Link
          to="/"
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition"
        >
          Continue Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">

      <h2 className="text-2xl md:text-3xl font-bold mb-8">
        Shopping Cart
      </h2>

      <div className="grid md:grid-cols-3 gap-8">

        {/* CART ITEMS */}

        <div className="md:col-span-2 space-y-4">

          {cartItems.map((item) => (
            <div
              key={item._id}
              className="flex gap-4 items-center bg-white shadow-sm border rounded-xl p-4 hover:shadow-md transition"
            >

              {/* PRODUCT IMAGE */}

              <img
                src={item.image}
                alt={item.name}
                className="w-20 h-20 object-cover rounded-lg"
              />

              {/* PRODUCT INFO */}

              <div className="flex-1">

                <p className="font-semibold text-lg">
                  {item.name}
                </p>

                <p className="text-gray-600">
                  ₹{item.price} × {item.qty || 1}
                </p>

              </div>

              {/* REMOVE BUTTON */}

              <button
                onClick={() => removeFromCart(item._id)}
                className="text-red-500 hover:text-red-700 font-medium"
              >
                Remove
              </button>

            </div>
          ))}

        </div>

        {/* ORDER SUMMARY */}

        <div className="bg-white border rounded-xl shadow-sm p-6 h-fit md:sticky md:top-24">

          <h3 className="text-xl font-semibold mb-4">
            Order Summary
          </h3>

          <div className="flex justify-between mb-3">
            <span>Items</span>
            <span>{cartItems.length}</span>
          </div>

          <div className="flex justify-between mb-6 font-bold text-lg">
            <span>Total</span>
            <span>₹{totalPrice}</span>
          </div>

          <Link
            to="/checkout"
            className="block w-full text-center bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg transition"
          >
            Proceed to Checkout
          </Link>

        </div>

      </div>

    </div>
  );
}

