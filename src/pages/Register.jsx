import React from "react";
import { useForm } from "react-hook-form";
import { useRegisterMutation } from "../redux/slices/api/authApiSlice";  // Import the mutation hook
import { toast } from "sonner";  // For notifications
import { useNavigate } from "react-router-dom";

const Register = () => {
  const navigate = useNavigate();
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [registerUser, { isLoading }] = useRegisterMutation();  // Destructure mutation

  const onSubmit = async (data) => {
    // Check if the selected role is 'admin', and set isAdmin to true accordingly
    const updatedData = {
      ...data,
      isAdmin: data.role === "admin",
    };
  
    try {
      const result = await registerUser(updatedData).unwrap();
      toast.success("Registration successful");
      navigate("/log-in");  // Redirect to login after successful registration
    } catch (error) {
      toast.error(error?.data?.message || "Failed to register");
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-8 shadow-lg rounded bg-white">
      <h1 className="text-2xl font-bold text-center mb-6">Create Account</h1>

      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
        {/* Name */}
        <div className="flex flex-col">
          <label htmlFor="name" className="text-sm font-medium text-gray-700">
            Name
          </label>
          <input
            id="name"
            name="name"
            type="text"
            placeholder="Enter your name"
            {...register("name", { required: "Name is required" })}
            className={`border p-2 mt-1 rounded ${errors.name ? "border-red-600" : "border-gray-300"}`}
          />
          {errors.name && <span className="text-red-600 text-sm">{errors.name.message}</span>}
        </div>

        {/* Email */}
        <div className="flex flex-col">
          <label htmlFor="email" className="text-sm font-medium text-gray-700">
            Email
          </label>
          <input
            id="email"
            name="email"
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

        {/* Password */}
        <div className="flex flex-col">
          <label htmlFor="password" className="text-sm font-medium text-gray-700">
            Password
          </label>
          <input
            id="password"
            name="password"
            type="password"
            placeholder="Enter your password"
            {...register("password", {
              required: "Password is required",
              minLength: {
                value: 6,
                message: "Password must be at least 6 characters",
              },
            })}
            className={`border p-2 mt-1 rounded ${errors.password ? "border-red-600" : "border-gray-300"}`}
          />
          {errors.password && <span className="text-red-600 text-sm">{errors.password.message}</span>}
        </div>

        {/* Role */}
        <div className="flex flex-col">
          <label htmlFor="role" className="text-sm font-medium text-gray-700">
            Role
          </label>
          <select
            id="role"
            name="role"
            className="border p-2 mt-1 rounded"
            {...register("role", { required: "Role is required" })}
          >
            <option value="user">User</option>
            <option value="admin">Admin</option>
          </select>
          {errors.role && <span className="text-red-600 text-sm">{errors.role.message}</span>}
        </div>

        {/* Title */}
        <div className="flex flex-col">
          <label htmlFor="title" className="text-sm font-medium text-gray-700">
            Title
          </label>
          <input
            id="title"
            name="title"
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
          <a href="/login" className="text-blue-600 hover:underline">
            Login
          </a>
        </p>
      </div>
    </div>
  );
};

export default Register;
