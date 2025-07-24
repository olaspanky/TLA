// src/components/Login.jsx
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useLoginMutation } from "../redux/slices/api/authApiSlice";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { setCredentials } from "../redux/slices/authSlice";
import Loading from "../components/Loader";
import ForgotPassword from "../components/ForgotPassword";
import { Target, Eye, EyeOff, Mail, Lock } from "lucide-react";
import tar from "../assets/target.png";
import logo from "/src/assets/plogoo.png";

const Login = () => {
  const { activeAccount } = useSelector((state) => state.auth);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [login, { isLoading }] = useLoginMutation();
  const [isForgotPasswordOpen, setIsForgotPasswordOpen] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const submitHandler = async (data) => {
    try {
      const result = await login(data).unwrap();
      
      dispatch(
        setCredentials({
          user: result.data.user,
          token: result.data.token,
        })
      );

      toast.success("Login successful!");
      navigate("/dashboard");
    } catch (error) {
      console.error("Login error:", error);
      toast.error(error?.data?.message || "Failed to log in");
    }
  };

  useEffect(() => {
    if (activeAccount) {
      navigate("/dashboard");
    }
  }, [activeAccount, navigate]);

  return (
    <div className="w-full min-h-screen flex bg-gray-50">
      <div className="w-full flex">
        {/* Left Side - Hero Section */}
        <div className="hidden lg:flex lg:w-1/2 bg-[#000A48] relative overflow-hidden">
          <div className="absolute top-8 left-8 flex items-center space-x-2">
            <div className="flex justify-center items-center">
              <img src={logo} alt="Target Illustration" className="w- h-auto" />
            </div>
          </div>
          <div className="flex flex-col justify-center items-center px-16 w-full relative">
            <div className="mb-8">
              <h1 className="text-white text-3xl 2xl:text-5xl font-bold leading-tight">
                Keep an eye on
                <br />
                Your <span className="text-green-400">Objectives</span>
              </h1>
            </div>
            <div className="relative flex justify-center items-center">
              <img src={tar} alt="Target Illustration" className="w-[350px] 2xl:w-[500px] h-auto" />
            </div>
          </div>
        </div>

        {/* Right Side - Login Form */}
        <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
          <div className="w-full max-w-md">
            <div className="lg:hidden flex items-center justify-center mb-8">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center mr-2">
                <Target className="w-5 h-5 text-white" />
              </div>
              <span className="text-blue-600 font-bold text-xl">P3R</span>
            </div>
            <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-gray-900 mb-2">
                  Sign in
                </h2>
                <p className="text-gray-600">
                  Welcome back! Please sign in to continue
                </p>
              </div>
              <form onSubmit={handleSubmit(submitHandler)} className="space-y-6">
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Email address
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Mail className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="email"
                      placeholder="john.doe@company.com"
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                      {...register("email", {
                        required: "Email Address is required!",
                      })}
                    />
                  </div>
                  {errors.email && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.email.message}
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Password
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Lock className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter your password"
                      className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                      {...register("password", {
                        required: "Password is required!",
                      })}
                    />
                    <button
                      type="button"
                      className="absolute inset-y-0 right-0 pr-3 flex items-center"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                      ) : (
                        <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                      )}
                    </button>
                  </div>
                  {errors.password && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.password.message}
                    </p>
                  )}
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <input
                      id="remember-me"
                      name="remember-me"
                      type="checkbox"
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label
                      htmlFor="remember-me"
                      className="ml-2 block text-sm text-gray-700"
                    >
                      Keep me signed in
                    </label>
                  </div>
                  <button
                    type="button"
                    className="text-sm text-blue-600 hover:text-blue-800 font-medium"
                    onClick={() => setIsForgotPasswordOpen(true)}
                  >
                    Forgot password?
                  </button>
                </div>
                {isLoading ? (
                  <div className="w-full py-3 flex justify-center">
                    <Loading />
                  </div>
                ) : (
                  <button
                    type="submit"
                    className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 transform hover:scale-[1.02]"
                  >
                    Sign in
                  </button>
                )}
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-300"></div>
                  </div>
                  <div className="relative flex justify-center text-sm">
                   
                  </div>
                </div>
               
              </form>
              
            </div>
          </div>
        </div>
      </div>
      
      {/* Forgot Password Modal */}
      {isForgotPasswordOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 p-4">
          <div className="modal-content flex justify-center items-center w-full max-w-md bg-[#000A48] rounded-2xl shadow-2xl relative overflow-hidden">
            <button
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 z-10 w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors duration-200"
              onClick={() => setIsForgotPasswordOpen(false)}
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                ></path>
              </svg>
            </button>
            <div className="w-full p-6">
              <ForgotPassword setIsForgotPasswordOpen={setIsForgotPasswordOpen} />
            </div>
          </div>
        </div>
      )}
      
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </div>
  );
};

export default Login;