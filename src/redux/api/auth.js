import { BASE_URL } from '@/constant'
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

export const authApi = createApi({
    reducerPath: 'authApi',
    baseQuery: fetchBaseQuery({ baseUrl: BASE_URL }),
    endpoints: (builder) => ({
        login: builder.mutation({
            query: (data) => ({
                url: `auth/login`,
                method: 'POST',
                body: data,
            }),
        }),
        register: builder.mutation({
            query: (data) => ({
                url: `auth/register`,
                method: 'POST',
                body: data,
            }),
        }),
        getProfile: builder.query({
            query: (data) => ({
                url: `auth/getProfile`,
            })
        })
    }),
})

export const { useLoginMutation, useRegisterMutation, useGetProfileQuery } = authApi