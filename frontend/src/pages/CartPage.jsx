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
      <div className="p-6">
        <h2 className="text-xl font-bold mb-4">Cart</h2>
        <p>Your cart is empty.</p>
        <Link to="/" className="text-blue-600">
          Go Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4">Cart</h2>

      {cartItems.map((item) => (
        <div
          key={item._id}
          className="flex justify-between items-center mb-3 border-b pb-2"
        >
          <div>
            <p className="font-semibold">{item.name}</p>
            <p>
              ₹{item.price} × {item.qty || 1}
            </p>
          </div>

          <button
            onClick={() => removeFromCart(item._id)}
            className="text-red-500"
          >
            Remove
          </button>
        </div>
      ))}

      <div className="mt-4 font-bold">
        Total: ₹{totalPrice}
      </div>

      <Link
        to="/checkout"
        className="block mt-4 bg-blue-600 text-white text-center py-2 rounded"
      >
        Proceed to Checkout
      </Link>
    </div>
  );
}