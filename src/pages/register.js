import { useLoginMutation, useRegisterMutation } from '@/redux/api/auth';
import Link from 'next/link';
import React, { useState } from 'react'
import { useEffect } from 'react';

function Login() {
    const [loginFormData, setLoginFormData] = useState({})

    const handleChange = (e) => {
        const { name, value } = e.target

        setLoginFormData((prev) => ({
            ...prev, [name]: value
        }))
    }

    const [registerFunction, registerResponse] = useRegisterMutation()

    const handleSubmit = (e) => {
        e.preventDefault()
        if (Object.values(loginFormData).every(value => value?.trim() !== ('' || undefined || null))) {
            registerFunction(loginFormData)
        }
    }

    useEffect(()=> {
        if(registerResponse.isSuccess){
            localStorage.setItem("user", registerResponse.data)
        }
    }, [registerResponse])

    return (
        <div className="relative flex flex-col justify-center min-h-screen overflow-hidden">
            <div className="w-full p-6 m-auto bg-white rounded-md shadow-md lg:max-w-xl">
                <h1 className="text-3xl font-semibold text-center text-purple-700 underline">
                    Register
                </h1>
                <form className="mt-6" onSubmit={handleSubmit}>
                    <div className="mb-2">
                        <label
                            htmlFor="name"
                            className="block text-sm font-semibold text-gray-800"
                        >
                            Name
                        </label>
                        <input
                            onChange={handleChange}
                            name='name'
                            id='name'
                            type="text"
                            className="block w-full px-4 py-2 mt-2 text-purple-700 bg-white border rounded-md focus:border-purple-400 focus:ring-purple-300 focus:outline-none focus:ring focus:ring-opacity-40"
                        />
                    </div>
                    <div className="mb-2">
                        <label
                            htmlFor="role"
                            className="block text-sm font-semibold text-gray-800"
                        >
                            Role
                        </label>
                        <input
                            onChange={handleChange}
                            name='role'
                            id='role'
                            type="text"
                            className="block w-full px-4 py-2 mt-2 text-purple-700 bg-white border rounded-md focus:border-purple-400 focus:ring-purple-300 focus:outline-none focus:ring focus:ring-opacity-40"
                        />
                    </div>
                    <div className="mb-2">
                        <label
                            htmlFor="domain"
                            className="block text-sm font-semibold text-gray-800"
                        >
                            Domain
                        </label>
                        <input
                            onChange={handleChange}
                            name='domain'
                            id='domain'
                            type="text"
                            className="block w-full px-4 py-2 mt-2 text-purple-700 bg-white border rounded-md focus:border-purple-400 focus:ring-purple-300 focus:outline-none focus:ring focus:ring-opacity-40"
                        />
                    </div>
                    <div className="mb-2">
                        <label
                            htmlFor="email"
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
                            htmlFor="password"
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

export default Login
