import { useResetPasswordMutation } from "../redux/slices/api/authApiSlice";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; // For navigation in Vite

const ResetPasswordForm = ({ resetToken }) => {
  const [resetPassword, { isLoading, isError, isSuccess, error }] = useResetPasswordMutation();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (!resetToken) {
      console.error("No reset token provided");
    }
  }, [resetToken]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      console.error("Passwords do not match");
      return;
    }
    try {
      const response = await resetPassword({ resetToken, data: { password } });
      console.log("API Response:", response);
      if (response?.data?.success) {
        setShowSuccess(true);
        setTimeout(() => navigate("/login"), 3000); // Redirect to login after 3 seconds
      }
    } catch (err) {
      console.error("Reset password error:", err);
      if (err?.data?.message) {
        console.error("Server error:", err.data.message);
      } else {
        console.error("Network or client error:", err.message || err);
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-purple-950 to-slate-900">
      <div className="w-full max-w-md p-8 bg-white/10 backdrop-blur-md rounded-xl shadow-2xl border border-white/20">
        <h2 className="text-3xl font-bold mb-6 text-center text-white bg-gradient-to-r from-blue-400 to-purple-600 bg-clip-text">
          Reset Password
        </h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-2">
              New Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter new password"
              className="w-full px-4 py-3 rounded-lg bg-white/5 text-white border border-white/20 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200"
              required
            />
          </div>
          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-300 mb-2">
              Confirm Password
            </label>
            <input
              type="password"
              id="confirmPassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm new password"
              className="w-full px-4 py-3 rounded-lg bg-white/5 text-white border border-white/20 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200"
              required
            />
          </div>
          <button
            type="submit"
            disabled={isLoading || password !== confirmPassword}
            className="w-full bg-gradient-to-r from-blue-600 to-purple-700 hover:from-blue-700 hover:to-purple-800 text-white font-semibold py-3 rounded-lg shadow-lg hover:shadow-blue-500/50 transform hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? "Resetting..." : "Reset Password"}
          </button>
          {isError && (
            <p className="text-red-400 text-sm mt-2">
              {error?.data?.message || "Invalid or expired token. Please request a new reset link."}
            </p>
          )}
          {isSuccess && showSuccess && (
            <p className="text-green-400 text-sm mt-2">
              Password reset successful! Redirecting to login...
            </p>
          )}
        </form>
        <p className="mt-4 text-center text-gray-400 text-sm">
          Back to{" "}
          <a href="/login" className="text-blue-400 hover:underline">
            Sign in
          </a>
        </p>
      </div>
    </div>
  );
};

export default ResetPasswordForm;