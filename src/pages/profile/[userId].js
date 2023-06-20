import { axiosInstance } from "@/axios";
import { signOut } from "next-auth/react";
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
      console.log(error);
    }
  };

  useEffect(() => {
    getAgent();
  }, [router.query.userId]);

  if (isLoading) return <div>Loading</div>;

  return (
    <>
      {/* {JSON.stringify(user)} */}
      <main className=" h-[100vh] w-[100vw] flex justify-center items-center border border-black">
        <section className="flex flex-col items-center md:items-start relative border border-black  px-3 py-3 rounded">
          <div className="">
            <h1 className="text-xl md:text-2xl text-center text-blue-600 bg-white md:text-left font-bold absolute top-[-15px]   ">
              Agent Details
            </h1>
          </div>

          <div className="mt-4 flex flex-col md:gap-12 space-y-3 md:space-y-0">
            <div>
              <h2 className="mb-1 text-blue-600">Name</h2>
              <div>
                <h2 className="px-2 py-1 border inline-block w-[50vw] md:w-[30vw] border-black rounded">
                  {user.name}
                </h2>
              </div>
            </div>
            <div>
              <h2 className="mb-1 text-blue-600">Email</h2>
              <div>
                <h2 className="px-2 py-1 border inline-block w-[50vw] md:w-[30vw] border-black rounded">
                  {user.email}
                </h2>
              </div>
            </div>
          </div>
          <div className=" mt-8 flex flex-col md:gap-12 space-y-3 md:space-y-0">
            <div>
              <h2 className="mb-1 text-blue-600">Role</h2>
              <div>
                <h2 className="px-2 py-1 border inline-block w-[50vw] md:w-[30vw] border-black rounded">
                  {user.role}
                </h2>
              </div>
            </div>
            <div>
              <h2 className="mb-1 text-blue-600">Team</h2>
              <div>
                <h2 className="px-2 py-1 border inline-block w-[50vw] md:w-[30vw] border-black rounded">
                  {user.domain}
                </h2>
              </div>
            </div>
          </div>
          <div className="mt-8 px-2 py-1 bg-blue-500 text-white flex flex-row gap-3  rounded w-2/3 md:w-1/3">
            <div className=""><h1>Issues Raised:</h1></div>
            <div className="">{user.issuesRaised.length}</div>
          </div>
        </section>
      </main>
      <div className="fixed bottom-6 right-6">
        <button className="px-4 py-3 border-none bg-blue-600 text-white rounded-md"
          onClick={async () => await signOut()}
        >
          Sign Out
        </button>
      </div>
    </>
  );
};

export default User;
