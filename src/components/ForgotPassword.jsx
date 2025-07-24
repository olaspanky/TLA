import { useForgotPasswordMutation } from "../redux/slices/api/authApiSlice";
import { useState } from "react";

const ForgotPasswordForm = () => {
  const [forgotPassword, { isLoading, isError, isSuccess, error }] = useForgotPasswordMutation();
  const [email, setEmail] = useState(""); // Controlled input for email
  const [showSuccess, setShowSuccess] = useState(false); // State for success message

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await forgotPassword({ email });
      console.log("API Response:", response);
      if (response?.data?.success) {
        setShowSuccess(true); // Show success message on successful response
      }
    } catch (err) {
      console.error("Forgot password error:", err);
      if (err?.data?.message) {
        console.error("Error message from server:", err.data.message);
      } else {
        console.error("Network or client error:", err.message || err);
      }
    }
  };

  return (
    <div className="p-12 flex items-center justify-center bg-[#000A48]">
      <div className="w-full max-w-md p-8 bg-white/10 backdrop-blur-md rounded-xl shadow-2xl border border-white/20">
        <h2 className="text-3xl font-bold mb-6 text-center text-white bg-blue-900 bg-clip-text">
          Forgot Password
        </h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
              Email Address
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              className="w-full px-4 py-3 rounded-lg bg-white/5 text-white border border-white/20 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200"
              required
            />
          </div>
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-white text-[#000A48] font-semibold py-3 rounded-lg shadow-lg hover:shadow-blue-500/50 transform hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? "Sending..." : "Request Reset"}
          </button>
          {isError && (
            <p className="text-red-400 text-sm mt-2">
              {error?.data?.message || "An error occurred. Please try again."}
            </p>
          )}
          {isSuccess && showSuccess && (
            <p className="text-green-400 text-sm mt-2">
              Reset email sent! Check your inbox.
            </p>
          )}
        </form>
        <p className="mt-4 text-center text-gray-400 text-sm">
          Remembered your password 🤨 ?{" "}
          <a href="/log-in" className="text-white hover:underline">
            Sign in
          </a>
        </p>
      </div>
    </div>
  );
};

export default ForgotPasswordForm;