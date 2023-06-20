import { useLoginMutation, useRegisterMutation } from "@/redux/api/auth";
import Link from "next/link";
import React, { useState } from "react";
import { useEffect } from "react";
import { Domains, Roles } from "@/constant";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { registerSchema } from "@/models/registerSchema";
import axios from "axios";
import { useRouter } from "next/router";
import { axiosInstance } from "@/axios";
import { toast } from "react-hot-toast";
import { setId } from "@/redux/features/mainSlice";
import { useDispatch } from "react-redux";

// axios.defaults.baseURL = process.env.SERVER_URL


function Register() {

  const dispatch = useDispatch()
  const router = useRouter();

  const onRegister = async (data) => {
    console.log(data);
    try {
      const response = await axiosInstance.post("/auth/register", data);

      console.log("reached");

      console.log(response);

      // dispatch(setId({ id: response.data.user._id }))

      return router.push(`/profile/${response.data.id}`);
    } catch (error) {
      console.log(error);
      toast.error(error.message)
    }
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: zodResolver(registerSchema) });

  return (
    <div className="relative flex flex-col justify-center min-h-screen overflow-hidden">
      <div className="w-full p-6 m-auto bg-white rounded-md shadow-md lg:max-w-xl">
        <h1 className="text-3xl font-semibold text-center text-purple-700 underline">
          Register
        </h1>
        <form className="mt-6" onSubmit={handleSubmit(onRegister)}>
          <div className="mb-2">
            <label
              htmlFor="name"
              className="block text-sm font-semibold text-gray-800"
            >
              Name
            </label>
            <input
              {...register("name")}
              name="name"
              id="name"
              type="text"
              className="block w-full px-4 py-2 mt-2 text-purple-700 bg-white border rounded-md focus:border-purple-400 focus:ring-purple-300 focus:outline-none focus:ring focus:ring-opacity-40"
            />
            {errors.name && (
              <span className="text-red-500"> {errors.name.message}</span>
            )}
          </div>
          <div className="mb-2">
            <label
              htmlFor="domain"
              className="block text-sm font-semibold text-gray-800"
            >
              Domain
            </label>
            <select
              {...register("domain")}
              name="domain"
              className="block w-full px-4 py-2 mt-2 text-purple-700 bg-white border rounded-md focus:border-purple-400 focus:ring-purple-300 focus:outline-none focus:ring focus:ring-opacity-40"
            >
              {Domains.map((domain, id) => (
                <option key={id} value={domain}>
                  {domain}
                </option>
              ))}
            </select>
            {errors.domain && (
              <span className="text-red-500"> {errors.domain.message}</span>
            )}
          </div>
          <div className="mb-2">
            <label
              htmlFor="role"
              className="block text-sm font-semibold text-gray-800"
            >
              Role
            </label>

            <select
              {...register("role")}
              name="role"
              className="block w-full px-4 py-2 mt-2 text-purple-700 bg-white border rounded-md focus:border-purple-400 focus:ring-purple-300 focus:outline-none focus:ring focus:ring-opacity-40"
            >
              {Roles.map((role, id) => (
                <option key={id} value={role}>
                  {role}
                </option>
              ))}
            </select>
            {errors.role && (
              <span className="text-red-500"> {errors.role.message}</span>
            )}
          </div>
          <div className="mb-2">
            <label
              htmlFor="email"
              className="block text-sm font-semibold text-gray-800"
            >
              Email
            </label>
            <input
              {...register("email")}
              name="email"
              type="email"
              className="block w-full px-4 py-2 mt-2 text-purple-700 bg-white border rounded-md focus:border-purple-400 focus:ring-purple-300 focus:outline-none focus:ring focus:ring-opacity-40"
            />
            {errors.email && (
              <span className="text-red-500"> {errors.email.message}</span>
            )}
          </div>
          <div className="mb-2">
            <label
              htmlFor="password"
              className="block text-sm font-semibold text-gray-800"
            >
              Password
            </label>
            <input
              {...register("password")}
              name="password"
              type="password"
              className="block w-full px-4 py-2 mt-2 text-purple-700 bg-white border rounded-md focus:border-purple-400 focus:ring-purple-300 focus:outline-none focus:ring focus:ring-opacity-40"
            />
            {errors.password && (
              <span className="text-red-500"> {errors.password.message}</span>
            )}
          </div>
          <div className="mt-6">
            <button className="w-full px-4 py-2 tracking-wide text-white transition-colors duration-200 transform bg-purple-700 rounded-md hover:bg-purple-600 focus:outline-none focus:bg-purple-600">
              Register
            </button>
          </div>
        </form>

        <p className="mt-8 text-xs font-light text-center text-gray-700">
          Already have an account?{" "}
          <Link
            href="/login"
            className="font-medium text-purple-600 hover:underline"
          >
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Register;
