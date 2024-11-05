import React, { useState } from "react";
import { useForgotPasswordMutation } from "../redux/slices/api/authApiSlice";

const ForgotPassword = () => {
    const [email, setEmail] = useState("");
    const [securityAnswer, setSecurityAnswer] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [message, setMessage] = useState("");
    const [forgotPassword, { isLoading }] = useForgotPasswordMutation();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await forgotPassword({ email, securityAnswer, newPassword }).unwrap();
            setMessage(response.message || "Password reset successful!");
        } catch (error) {
            setMessage(error?.data?.message || "Password reset failed.");
        }
    };

    return (
        <div className="flex items-center justify-center  bg-gray-100">
        <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-md">
            <h2 className="text-2xl font-semibold text-center text-gray-800 mb-6">Forgot Password</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                        Email
                    </label>
                    <input
                        type="email"
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>
                <div>
                    <label htmlFor="securityAnswer" className="block text-sm font-medium text-gray-700">
                        Security Answer
                    </label>
                    <input
                        type="text"
                        id="securityAnswer"
                        value={securityAnswer}
                        onChange={(e) => setSecurityAnswer(e.target.value)}
                        required
                        className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>
                <div>
                    <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700">
                        New Password
                    </label>
                    <input
                        type="password"
                        id="newPassword"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        required
                        className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>
                <button
                    type="submit"
                    disabled={isLoading}
                    className={`w-full py-2 px-4 text-white font-medium rounded-lg bg-blue-600 hover:bg-blue-700 transition duration-300 ${
                        isLoading ? "opacity-50 cursor-not-allowed" : ""
                    }`}
                >
                    {isLoading ? "Resetting..." : "Reset Password"}
                </button>
            </form>
            {message && <p className="mt-4 text-center text-gray-600">{message}</p>}
        </div>
    </div>
    );
};

export default ForgotPassword;
