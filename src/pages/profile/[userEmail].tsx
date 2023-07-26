import { axiosInstance } from "@/axios";
import { signOut, useSession } from "next-auth/react";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import LoadingIcon from "public/icons/loading.svg";
import Image from "next/image";
import { AxiosError } from "axios";
import toast from "react-hot-toast";

const User = () => {
  const session = useSession();

  const [userId, setUserId] = useState<string>("");

  const [isLoading, setIsLoading] = useState(false);

  const router = useRouter();
  const [user, setUser] = useState<AgentWithoutPassword>({
    _id: "",
    name: "",
    email: "",
    domain: "all",
    role: "admin",
    issuesRaised: [],
  });
  const [isPageLoading, setIsPageLoading] = useState(true);

  const getIdOfUser = async (email: string) => {
    try {
      const response = await axiosInstance.get(`/agent/getAgent/${email}`);

      setUserId(response.data.agent._id);
    } catch (error) {
      console.log(error);
      if (error instanceof AxiosError) {
        return toast.error(error.response?.data.message);
      }
      if (error instanceof Error) {
        return toast.error(error.message);
      }
    }
  };

  const getAgent = async () => {
    try {
      const response = await axiosInstance.get(
        `/agent/getAgent/${router.query.userEmail}`
      );
      setUser(response.data.agent);
      setIsPageLoading(false);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (session.data?.user?.email) {
      getIdOfUser(session.data?.user?.email);
    }
  }, [session.data]);

  useEffect(() => {
    getAgent();
    () => {
      setIsLoading(false);
    };
  }, [router.query.userEmail]);

  if (isPageLoading) return;
  <div className="grid place-content-center ">
    <Image
      alt="Loading"
      className="animate-spin text-white fill-white"
      src={LoadingIcon}
      width={24}
      height={24}
    />
  </div>;

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
                  {user.role
                    .split("-")
                    .map((role) => role.charAt(0).toUpperCase() + role.slice(1))
                    .join("-")}
                </h2>
              </div>
            </div>
            <div>
              <h2 className="mb-1 text-blue-600">Team</h2>
              <div>
                <h2 className="px-2 py-1 border inline-block w-[50vw] md:w-[30vw] border-black rounded">
                  {`${user.domain.charAt(0).toUpperCase()}` +
                    `${user.domain.slice(1)}`}
                </h2>
              </div>
            </div>
          </div>
          <div className="mt-8 px-2 py-1 bg-blue-500 text-white flex flex-row gap-3  rounded w-2/3 md:w-1/3">
            <div className="">
              <h1>Issues Raised:</h1>
            </div>
            <div className="">{user.issuesRaised?.length}</div>
          </div>
        </section>
      </main>
      {router.query.userEmail === session.data?.user?.email && (
        <div className="fixed bottom-6 right-6">
          <button
            className="px-4 py-3 border-none bg-blue-600 text-white rounded-md"
            onClick={async () => {
              setIsLoading(true);
              await signOut();
              setIsLoading(false);
            }}
          >
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
              "Sign Out"
            )}
          </button>
        </div>
      )}
    </>
  );
};

export default User;
