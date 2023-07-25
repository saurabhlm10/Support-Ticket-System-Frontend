import { loginSchema } from "@/models/loginSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { signIn } from "next-auth/react";
import { toast } from "react-hot-toast";
import LoadingIcon from "public/icons/loading.svg";
import Image from "next/image";
import { axiosInstance } from "@/axios";
import { AxiosError } from "axios";

interface LoginFormData {
  email: string;
  password: string;
}

function Login() {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const onLogin = async (data: LoginFormData) => {
    setIsLoading(true);

    data.email = data.email.toLowerCase();
    try {
      const response = await axiosInstance.post("/auth/login", data);

      await signIn<"credentials">("credentials", {
        email: data.email,
        password: data.password,
      });
    } catch (error) {
      if (error instanceof AxiosError) {
        return toast.error(error.response?.data?.message);
      } else if (error instanceof Error) {
        toast.error(error.message);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  return (
    <div className="relative flex flex-col justify-center min-h-screen overflow-hidden">
      <div className="text-center border-2 border-red-600 text-2xl ">
        <p>
          Render Free instance types spin down with inactivity. So please wait a
          few moments for the backend to response when you load this app after a
          gap.
        </p>
      </div>
      <div className="w-full p-6 m-auto bg-white rounded-md shadow-md lg:max-w-xl">
        <h1 className="text-3xl font-semibold text-center text-purple-700 underline">
          Sign in
        </h1>
        <form className="mt-6" onSubmit={handleSubmit(onLogin)}>
          <div className="mb-2">
            <label
              htmlFor="email"
              className="block text-sm font-semibold text-gray-800"
            >
              Email
            </label>
            <input
              {...register("email")}
              // onChange={handleChange}
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
              // onChange={handleChange}
              name="password"
              type="password"
              className="block w-full px-4 py-2 mt-2 text-purple-700 bg-white border rounded-md focus:border-purple-400 focus:ring-purple-300 focus:outline-none focus:ring focus:ring-opacity-40"
            />
            {errors.password && (
              <span className="text-red-500"> {errors.password.message}</span>
            )}
          </div>
          <a href="#" className="text-xs text-purple-600 hover:underline">
            Forget Password?
          </a>
          <div className="mt-6">
            <button className="w-full px-4 py-2 tracking-wide text-white transition-colors duration-200 transform bg-purple-700 rounded-md hover:bg-purple-600 focus:outline-none focus:bg-purple-600">
              {isLoading ? (
                <div className="grid place-content-center ">
                  <Image
                    alt="Loading"
                    className="animate-spin text-white fill-white"
                    src={LoadingIcon}
                    width={24}
                    height={24}
                  />
                </div>
              ) : (
                "Login"
              )}
            </button>
          </div>
        </form>

        <p className="mt-8 text-xs font-light text-center text-gray-700">
          {" "}
          Don't have an account?{" "}
          <Link
            href="register"
            className="font-medium text-purple-600 hover:underline"
          >
            Register
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Login;
