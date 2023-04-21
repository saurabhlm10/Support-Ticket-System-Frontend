import { useLoginMutation } from '@/redux/api/auth';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react'

function Login() {
    const [loginFormData, setLoginFormData] = useState({})

    const router = useRouter()

    const handleChange = (e) => {
        const { name, value } = e.target

        setLoginFormData((prev) => ({
            ...prev, [name]: value
        }))
    }

    const [loginFunction, loginResponse] = useLoginMutation()

    const handleSubmit = (e) => {
        e.preventDefault()
        if (Object.values(loginFormData).every(value => value?.trim() !== ('' || undefined || null))) {
            loginFunction(loginFormData)
        }
    }

    useEffect(() => {
        if (loginResponse.isSuccess) {
            localStorage.setItem("user", JSON.stringify(loginResponse.data?.user))
            localStorage.setItem("token", JSON.stringify(loginResponse.data?.token))
            router.push("/")
        }
    }, [loginResponse])

    return (
        <div className="relative flex flex-col justify-center min-h-screen overflow-hidden">
            <div className="w-full p-6 m-auto bg-white rounded-md shadow-md lg:max-w-xl">
                <h1 className="text-3xl font-semibold text-center text-purple-700 underline">
                    Sign in
                </h1>
                <form className="mt-6" onSubmit={handleSubmit}>
                    <div className="mb-2">
                        <label
                            for="email"
                            className="block text-sm font-semibold text-gray-800"
                        >
                            Email
                        </label>
                        <input
                            onChange={handleChange}
                            name='email'
                            type="email"
                            className="block w-full px-4 py-2 mt-2 text-purple-700 bg-white border rounded-md focus:border-purple-400 focus:ring-purple-300 focus:outline-none focus:ring focus:ring-opacity-40"
                        />
                    </div>
                    <div className="mb-2">
                        <label
                            for="password"
                            className="block text-sm font-semibold text-gray-800"
                        >
                            Password
                        </label>
                        <input
                            onChange={handleChange}
                            name='password'
                            type="password"
                            className="block w-full px-4 py-2 mt-2 text-purple-700 bg-white border rounded-md focus:border-purple-400 focus:ring-purple-300 focus:outline-none focus:ring focus:ring-opacity-40"
                        />
                    </div>
                    <a
                        href="#"
                        className="text-xs text-purple-600 hover:underline"
                    >
                        Forget Password?
                    </a>
                    <div className="mt-6">
                        <button className="w-full px-4 py-2 tracking-wide text-white transition-colors duration-200 transform bg-purple-700 rounded-md hover:bg-purple-600 focus:outline-none focus:bg-purple-600">
                            Login
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

export default Login
