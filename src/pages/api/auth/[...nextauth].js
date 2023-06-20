import { axiosInstance } from "@/axios";
import NextAuth from "next-auth/next";
import CredentialsProvider from "next-auth/providers/credentials";
import { useRouter } from "next/router";
import { toast } from "react-hot-toast";

export default NextAuth({
  providers: [
    CredentialsProvider({
      // The name to display on the sign in form (e.g. "Sign in with...")
      name: "Credentials",
      // `credentials` is used to generate a form on the sign in page.
      // You can specify which fields should be submitted, by adding keys to the `credentials` object.
      // e.g. domain, username, password, 2FA token, etc.
      // You can pass any HTML attribute to the <input> tag through the object.
      credentials: {
        email: { label: "Email", type: "email", placeholder: "Email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials, req) {
        try {
          // Add logic here to look up the user from the credentials supplied
          const res = await axiosInstance.post('/auth/login', credentials)

          if (res.status === 201) {
            // Any object returned will be saved in `user` property of the JWT
            return res.data;
          } else {
            // If you return null then an error will be displayed advising the user to check their details.
            // throw new Error('Wrong email or password');
            return null;
            // You can also Reject this callback with an Error thus the user will be sent to the error page with the error message as a query parameter
          }
        }
        catch (error) {
          throw new Error(error.response.data.message);
        }
      }
    }),
  ],
  pages: {
    signIn: "/login",
  },
  callbacks: {
    async jwt({ token, user }) {
      // console.log('TOKEN', token)
      // console.log('USER', user)
      return { ...token, ...user };
    },
    async session({ session, token }) {
      // console.log('SESSION TOKEN', token)
      session.user = token;
      return session;
    },
  },
});
