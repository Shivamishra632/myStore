import { useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import {
  Elements,
  CardElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import API from "../api/axios";

const stripePromise = loadStripe(
  import.meta.env.VITE_STRIPE_PUBLIC_KEY
);

const CheckoutForm = ({ orderId, totalPrice, onSuccess }) => {
  const stripe = useStripe();
  const elements = useElements();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!stripe || !elements) return;

    setLoading(true);
    setError("");

    try {
      // 1️⃣ Create payment intent
      const { data } = await API.post(
        "/payments/create-payment-intent",
        { totalPrice }
      );

      const result = await stripe.confirmCardPayment(
        data.clientSecret,
        {
          payment_method: {
            card: elements.getElement(CardElement),
          },
        }
      );

      if (result.error) {
        setError(result.error.message);
      } else if (result.paymentIntent.status === "succeeded") {
        // 2️⃣ Update order status
        await API.put(`/payments/${orderId}/pay`, {
          id: result.paymentIntent.id,
          status: result.paymentIntent.status,
          email_address: result.paymentIntent.receipt_email,
        });

        onSuccess();
        toast.success("Payment Successful 💳");
      }
    } catch (err) {
      toast.error("Failed to process payment 😞");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <CardElement className="border p-3 rounded" />

      {error && (
        <p className="text-red-500 mt-2">{error}</p>
      )}

      <button
        type="submit"
        disabled={!stripe || loading}
        className="bg-blue-600 text-white px-4 py-2 mt-4 rounded w-full"
      >
        {loading ? "Processing..." : "Pay Now"}
      </button>
    </form>
  );
};

export default function StripePayment(props) {
  return (
    <Elements stripe={stripePromise}>
      <CheckoutForm {...props} />
    </Elements>
  );
}