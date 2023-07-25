import { useEffect, useState } from "react";
import { useForm, Controller, FormProvider } from "react-hook-form";
import { Domains, Status, Issues } from "@/constant";
import { axiosInstance } from "@/axios";
import { zodResolver } from "@hookform/resolvers/zod";
import { filterSchema } from "@/models/filterSchema";
import { Autocomplete, TextField } from "@mui/material";

export default function Filter() {
  const methods = useForm();
  const [handlers, setHandlers] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [handlersList, setHandlersList] = useState<Agent[]>([]);

  const filterChats = async (data: any) => {
    console.log(data);
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
  } = useForm({ resolver: zodResolver(filterSchema) });

  async function allHandlers() {
    try {
      const response = await axiosInstance.get("/agent/getAllAgents");

      response.data.allAgentsList.forEach((agent: Agent) => {
        setHandlersList((list) => [...list, agent]);
        setHandlers((handlers) => [...handlers, agent.name]);
      });
      setLoading(false);
    } catch (error) {
      console.log(error);
    }
  }
  useEffect(() => {
    allHandlers();
  }, []);

  if (loading) {
    return <h1>Loading...</h1>;
  }
  console.log(handlersList);
  return (
    <>
      <main>
        <div className="relative flex flex-col justify-center min-h-screen overflow-hidden">
          <div className="w-full p-6 m-auto bg-white rounded-md shadow-md lg:max-w-xl">
            <h1 className="text-3xl font-semibold text-center text-purple-700 underline">
              Search for Issues
            </h1>
            <FormProvider {...methods}>
              <form className="mt-6" onSubmit={handleSubmit(filterChats)}>
                <div className="mb-2">
                  <label
                    htmlFor="studentEmail"
                    className="block text-sm font-semibold text-gray-800"
                  >
                    Student Email
                  </label>
                  <input
                    {...register("studentEmail", { required: "Required" })}
                    name="studentEmail"
                    id="studentEmail"
                    type="text"
                    className="block w-full px-4 py-2 mt-2 text-purple-700 bg-white border rounded-md focus:border-purple-400 focus:ring-purple-300 focus:outline-none focus:ring focus:ring-opacity-40"
                  />
                  {errors.studentEmail && (
                    <span className="text-red-500">
                      {" "}
                      {errors.studentEmail.message as string}
                    </span>
                  )}
                </div>
                <div className="mb-2">
                  <label
                    htmlFor="studentPhone"
                    className="block text-sm font-semibold text-gray-800"
                  >
                    Student Phone
                  </label>
                  <input
                    {...register("studentPhone")}
                    name="studentPhone"
                    type="studentPhone"
                    className="block w-full px-4 py-2 mt-2 text-purple-700 bg-white border rounded-md focus:border-purple-400 focus:ring-purple-300 focus:outline-none focus:ring focus:ring-opacity-40"
                  />
                  {errors.studentPhone && (
                    <span className="text-red-500">
                      {" "}
                      {errors.studentPhone.message as string}
                    </span>
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
                    <option value="">None</option>
                    {Domains.map((domain, id) => (
                      <option key={id} value={domain}>
                        {domain}
                      </option>
                    ))}
                  </select>
                  {errors.domain && (
                    <span className="text-red-500">
                      {" "}
                      {errors.domain.message as string}
                    </span>
                  )}
                </div>
                <div className="mb-2">
                  <label
                    htmlFor="status"
                    className="block text-sm font-semibold text-gray-800"
                  >
                    Query Status
                  </label>

                  <select
                    {...register("status")}
                    name="status"
                    className="block w-full px-4 py-2 mt-2 text-purple-700 bg-white border rounded-md focus:border-purple-400 focus:ring-purple-300 focus:outline-none focus:ring focus:ring-opacity-40"
                  >
                    <option value="">None</option>
                    {Status.map((status, id) => (
                      <option key={id} value={status}>
                        {status}
                      </option>
                    ))}
                  </select>
                  {errors.status && (
                    <span className="text-red-500">
                      {" "}
                      {errors.status.message as string}
                    </span>
                  )}
                </div>
                <div className="mb-2">
                  <label
                    htmlFor="status"
                    className="block text-sm font-semibold text-gray-800"
                  >
                    Query Type
                  </label>

                  <select
                    {...register("type")}
                    name="type"
                    className="block w-full px-4 py-2 mt-2 text-purple-700 bg-white border rounded-md focus:border-purple-400 focus:ring-purple-300 focus:outline-none focus:ring focus:ring-opacity-40"
                  >
                    <option value="">None</option>
                    {Issues.map((issue, id) => (
                      <option key={id} value={issue}>
                        {issue}
                      </option>
                    ))}
                  </select>
                  {errors.type && (
                    <span className="text-red-500">
                      {" "}
                      {errors.type.message as string}
                    </span>
                  )}
                </div>

                <div className="mb-2">
                  <label
                    htmlFor="handler"
                    className="block text-sm font-semibold text-gray-800"
                  >
                    Handler
                  </label>

                  <select
                    {...register("handler")}
                    name="handler"
                    className="block w-full px-4 py-2 mt-2 text-purple-700 bg-white border rounded-md focus:border-purple-400 focus:ring-purple-300 focus:outline-none focus:ring focus:ring-opacity-40"
                  >
                    <option value="">None</option>
                    {handlers.map((handler, id) => (
                      <option key={id} value={handler}>
                        {handler}
                      </option>
                    ))}
                  </select>
                  {/* {errors.handle.allAgentsList.name && (
                  <span className="text-red-500"> {errors.handle.allAgentsList.name.message}</span>
                )} */}
                </div>
                <div className="mb-2">
                  <label
                    htmlFor="raiser"
                    className="block text-sm font-semibold text-gray-800"
                  >
                    Raiser
                  </label>

                  <select
                    {...register("raiser")}
                    name="raiser"
                    className="block w-full px-4 py-2 mt-2 text-purple-700 bg-white border rounded-md focus:border-purple-400 focus:ring-purple-300 focus:outline-none focus:ring focus:ring-opacity-40"
                  >
                    <option value="">None</option>
                    {handlers.map((handler, id) => (
                      <option key={id} value={handler}>
                        {handler}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="mt-6">
                  <button className="w-full px-4 py-2 tracking-wide text-white transition-colors duration-200 transform bg-purple-700 rounded-md hover:bg-purple-600 focus:outline-none focus:bg-purple-600">
                    Apply Filters
                  </button>
                </div>
              </form>
            </FormProvider>
          </div>
        </div>
      </main>
    </>
  );
}
