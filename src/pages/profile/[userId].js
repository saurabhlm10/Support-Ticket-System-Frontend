import { axiosInstance } from "@/axios";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";

const User = () => {
  const router = useRouter();
  const [user, setUser] = useState({});
  const [isLoading, setIsLoading] = useState(true);

  const getAgent = async () => {
    try {
      const response = await axiosInstance.get(
        `/agent/getAgent/${router.query.userId}`
      );
      setUser(response.data.agent);
      setIsLoading(false);
    } catch (error) {
      console.log(error)
    }
  };

  useEffect(() => {
    getAgent();
  }, [router.query.userId]);

  if (isLoading) return <div>Loading</div>;

  return (
    <>
      <div className="px-12 py-12">
        <h1 className="text-3xl font-bold	">Agent Details</h1>
        {JSON.stringify(user)}
        <div>
          {/* {Object.keys()} */}
        </div>
        <p>

        {user.name}
        </p>
      </div>
    </>
  );
};

export default User;
