import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useRegisterMutation } from "../redux/slices/api/authApiSlice";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import Select from 'react-select';

const Register = () => {
  const navigate = useNavigate();
  const { register, handleSubmit, watch, formState: { errors } } = useForm();
  const [registerUser, { isLoading }] = useRegisterMutation();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const departments = [
    { value: 'hr', label: 'Human Resources' },
    { value: 'finance', label: 'Finance' },
    { value: 'it', label: 'Information Technology' },
    { value: 'marketing', label: 'Marketing' },
    { value: 'sales', label: 'Sales' },
  ];

  const [selectedDepartments, setSelectedDepartments] = useState([]);

  const onSubmit = async (data) => {
    const updatedData = {
      ...data,
      isAdmin: data.role === "admin" || data.role === "superAdmin",
      dept: selectedDepartments.map(dept => dept.value), // Send only the values of selected departments
    };

    try {
      const result = await registerUser(updatedData).unwrap();
      toast.success("Registration successful");
      navigate("/log-in");
    } catch (error) {
      toast.error(error?.data?.message || "Failed to register");
    }
  };

  return (
    <div className='w-full min-h-screen flex items-center justify-center flex-col lg:flex-row bg-[#f3f4f6]'>
      <div className='w-full md:w-auto flex gap-0 md:gap-40 flex-col md:flex-row items-center justify-center'>
        {/* Left side */}
        <div className='h-full w-full lg:w-2/3 flex flex-col items-center justify-center'>
          <div className='w-full md:max-w-lg 2xl:max-w-3xl flex flex-col items-center justify-center gap-5 md:gap-y-10 2xl:-mt-20'>
            <span className='flex gap-1 py-1 px-3 border rounded-full text-sm md:text-base border-gray-300 text-gray-600'>
              Traffic Pulse
            </span>
            <p className='flex flex-col gap-0 md:gap-4 text-4xl md:text-6xl 2xl:text-7xl font-black text-center text-blue-700'>
              <span>Performance</span>
              <span> Management System</span>
            </p>
            <div className='cell'>
              <div className='circle rotate-in-up-left'></div>
            </div>
          </div>
        </div>

        {/* Right side */}
        <div className='w-full p-4 flex flex-col justify-center items-center'>
          <h1 className="text-2xl font-bold text-center mb-6">Create Account</h1>
          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col w-full gap-4">
            {/* Name */}
            <div className="flex flex-col w-full">
              <label htmlFor="name" className="text-sm font-medium text-gray-700">Name</label>
              <input
                id="name"
                type="text"
                placeholder="Enter your name"
                {...register("name", { required: "Name is required" })}
                className={`border p-2 mt-1 rounded ${errors.name ? "border-red-600" : "border-gray-300"}`}
              />
              {errors.name && <span className="text-red-600 text-sm">{errors.name.message}</span>}
            </div>

            {/* Email */}
            <div className="flex flex-col">
              <label htmlFor="email" className="text-sm font-medium text-gray-700">Email</label>
              <input
                id="email"
                type="email"
                placeholder="Enter your email"
                {...register("email", {
                  required: "Email is required",
                  pattern: {
                    value: /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/,
                    message: "Enter a valid email address",
                  },
                })}
                className={`border p-2 mt-1 rounded ${errors.email ? "border-red-600" : "border-gray-300"}`}
              />
              {errors.email && <span className="text-red-600 text-sm">{errors.email.message}</span>}
            </div>

            {/* Security Question */}
            <div className="flex flex-col">
              <label htmlFor="securityQuestion" className="text-sm font-medium text-gray-700">Security Question</label>
              <input
                id="securityQuestion"
                type="text"
                placeholder="Enter a security question"
                {...register("securityQuestion", { required: "Security question is required" })}
                className={`border p-2 mt-1 rounded ${errors.securityQuestion ? "border-red-600" : "border-gray-300"}`}
              />
              {errors.securityQuestion && <span className="text-red-600 text-sm">{errors.securityQuestion.message}</span>}
            </div>

            {/* Security Answer */}
            <div className="flex flex-col">
              <label htmlFor="securityAnswer" className="text-sm font-medium text-gray-700">Security Answer</label>
              <input
                id="securityAnswer"
                type="text"
                placeholder="Enter the answer to your security question"
                {...register("securityAnswer", { required: "Security answer is required" })}
                className={`border p-2 mt-1 rounded ${errors.securityAnswer ? "border-red-600" : "border-gray-300"}`}
              />
              {errors.securityAnswer && <span className="text-red-600 text-sm">{errors.securityAnswer.message}</span>}
            </div>

            {/* Password */}
            <div className="flex flex-col">
              <label htmlFor="password" className="text-sm font-medium text-gray-700">Password</label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  {...register("password", {
                    required: "Password is required",
                    minLength: {
                      value: 6,
                      message: "Password must be at least 6 characters",
                    },
                  })}
                  className={`border p-2 mt-1 rounded w-full ${errors.password ? "border-red-600" : "border-gray-300"}`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 px-3 text-gray-600"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              {errors.password && <span className="text-red-600 text-sm">{errors.password.message}</span>}
            </div>

            {/* Confirm Password */}
            <div className="flex flex-col">
              <label htmlFor="confirmPassword" className="text-sm font-medium text-gray-700">Confirm Password</label>
              <div className="relative">
                <input
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Confirm your password"
                  {...register("confirmPassword", {
                    required: "Please confirm your password",
                    validate: (value) => value === watch("password") || "Passwords do not match",
                  })}
                  className={`border p-2 mt-1 rounded w-full ${errors.confirmPassword ? "border-red-600" : "border-gray-300"}`}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute inset-y-0 right-0 px-3 text-gray-600"
                >
                  {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              {errors.confirmPassword && <span className="text-red-600 text-sm">{errors.confirmPassword.message}</span>}
            </div>

            {/* Department */}
            <div className="flex flex-col">
              <label htmlFor="department" className="text-sm font-medium text-gray-700">Department</label>
              <Select
                id="department"
                isMulti
                options={departments}
                value={selectedDepartments}
                onChange={setSelectedDepartments}
                className={`mt-1 ${errors.department ? "border-red-600" : ""}`}
              />
              {errors.department && <span className="text-red-600 text-sm">{errors.department.message}</span>}
            </div>

            {/* Role */}
            <div className="flex flex-col">
              <label htmlFor="role" className="text-sm font-medium text-gray-700">Role</label>
              <select
                id="role"
                className="border p-2 mt-1 rounded"
                {...register("role", { required: "Role is required" })}
              >
                <option value="user">User</option>
                <option value="admin">Admin</option>
                <option value="superadmin">Super Admin</option>
              </select>
              {errors.role && <span className="text-red-600 text-sm">{errors.role.message}</span>}
            </div>

            {/* Title */}
            <div className="flex flex-col">
              <label htmlFor="title" className="text-sm font-medium text-gray-700">Title</label>
              <input
                id="title"
                type="text"
                placeholder="Enter your job title"
                {...register("title", { required: "Title is required" })}
                className={`border p-2 mt-1 rounded ${errors.title ? "border-red-600" : "border-gray-300"}`}
              />
              {errors.title && <span className="text-red-600 text-sm">{errors.title.message}</span>}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className={`bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition-all ${isLoading ? "opacity-50 cursor-not-allowed" : ""}`}
            >
              {isLoading ? "Registering..." : "Register"}
            </button>
          </form>

          <div className="mt-4 text-center">
            <p>
              Already have an account?{" "}
              <a href="/log-in" className="text-blue-600 hover:underline">
                Login
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
