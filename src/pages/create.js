import ReactNode, { useEffect, useRef, useState } from "react";
import { courses } from "../courses";
import axios from "axios";
import { Autocomplete, TextField } from "@mui/material";
import Head from "next/head";
import { axiosInstance } from "@/axios";

const create = () => {
  const [handlersArray, setHandlersArray] = useState([]);
  const [allHandlersList, setAllHandlersList] = useState([]);
  const [linkToggler, setLinkToggler] = useState("Link");
  const [studentName, setStudentName] = useState("saurabh");
  const [studentEmail, setStudentEmail] = useState("saurabh@gmail.com");
  const [studentPhone, setStudentPhone] = useState("1111111111");
  const [issueType, setIssueType] = useState("No-Access");
  const [description, setDescription] = useState("");
  const [attachments, setAttachments] = useState([]);

  // No Access Info States

  const [noAccessCourseName, setNoAccessCourseName] = useState("");
  const [paymentReceipt, setPaymentReceipt] = useState("");
  const [removePaymentReceipt, setRemovePaymentReceipt] = useState(false);

  // Batch Change Info States

  const [batchChangePrevCourseName, setBatchChangePrevCourseName] =
    useState("");
  const [batchChangeNewCourseName, setBatchChangeNewCourseName] = useState("");

  // Assignment Info States

  const [assignmentNotChecked, setAssignmentNotChecked] = useState(false);

  // Other Info States

  const [title, setTitle] = useState("");

  // Refs
  const paymentReceiptImageInputRef = useRef(null);

  // Handle Missing Fields states
  const [missingFields, setMissingFields] = useState([]);

  // Handle Error Messages States
  const [studentEmailErrorMessage, setStudentEmailErrorMessage] =
    useState("default");
  const [studentPhoneErrorMessage, setStudentPhoneErrorMessage] =
    useState("default");

  // No Access Error Fields
  const [noAccessCourseNameErrorMessage, setNoAccessCourseNameErrorMessage] =
    useState("default");
  const [paymenReceiptErrorMessage, setPaymenReceiptErrorMessage] =
    useState("default");

  // Batch Change Error Fields
  const [
    batchChangePrevCourseNameErrorMessage,
    setBatchChangePrevCourseNameErrorMessage,
  ] = useState("default");
  const [
    batchChangeNewCourseNameErrorMessage,
    setBatchChangeNewCourseNameErrorMessage,
  ] = useState("default");

  // Assignment Error Fields
  const [descriptionErrorMessage, setDescriptionErrorMessage] =
    useState("default");

  // Other(Issue Type) Error Fields
  const [titleErrorMessage, setTitleErrorMessage] = useState("default");

  const createTicket = async () => {
    // Handle Missing Fields

    if (!studentName) {
      setMissingFields((prev) => [...prev, "studentName"]);
    }
    if (!studentEmail) {
      setMissingFields((prev) => [...prev, "studentEmail"]);
      setStudentEmailErrorMessage(`Please Enter Student's Email`);
    }
    if (!studentPhone) {
      setMissingFields((prev) => [...prev, "studentPhone"]);
      setStudentPhoneErrorMessage(`Please Enter Student's Phone Number`);
    }
    if (handlersArray.length === 0) {
      setMissingFields((prev) => [...prev, "handlers"]);
    }

    // Email Regex Check
    const emailRegex = new RegExp(
      "^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$"
    );

    if (studentEmail && !emailRegex.test(studentEmail)) {
      setMissingFields((prev) => [...prev, "studentEmail"]);
      setStudentEmailErrorMessage("Please Enter Valid Email Address");
    }

    const phoneRegex = new RegExp("^(?:\\+)?(?:[0-9][.-]?){6,14}[0-9]$");

    if (studentPhone && !phoneRegex.test(studentPhone)) {
      setMissingFields((prev) => [...prev, "studentPhone"]);
      setStudentPhoneErrorMessage("Please Enter A Valid Phone Number");
    }

    if (handlersArray.length === 0) {
      setMissingFields((prev) => [...prev, "handlers"]);
    }

    // Check Errors in Issue Specific fields

    switch (issueType) {
      case "No-Access": {
        if (!courses.includes(noAccessCourseName)) {
          setMissingFields((prev) => [...prev, "noAccessCourseName"]);
          setNoAccessCourseNameErrorMessage(
            "Please Select A Course From The List"
          );
          setNoAccessCourseName("");
        }

        if (linkToggler === "Link") {
          const paymentReceiptRegex = new RegExp(
            /^(https?:\/\/)?[a-z0-9-]+(\.[a-z0-9-]+)+([/?#][^\s]*)?$/i
          );

          if (!paymentReceiptRegex.test(paymentReceipt)) {
            setMissingFields((prev) => [...prev, "paymentReceipt"]);
            setPaymenReceiptErrorMessage(
              "Please Add A Valid Payment Receipt Link"
            );
          }
        } else {
          if (!paymentReceipt) {
            setMissingFields((prev) => [...prev, "paymentReceipt"]);
            setPaymenReceiptErrorMessage(
              "Please Add A Payment Receipt Attachment"
            );
          }
        }
        return;
      }

      case "Batch-Change": {
        if (!courses.includes(batchChangePrevCourseName)) {
          setMissingFields((prev) => [...prev, "batchChangePrevCourseName"]);
          setBatchChangePrevCourseNameErrorMessage(
            "Please Select A Course From The List"
          );
          setBatchChangePrevCourseName("");
        }

        if (!courses.includes(batchChangeNewCourseName)) {
          setMissingFields((prev) => [...prev, "batchChangeNewCourseName"]);
          setBatchChangeNewCourseNameErrorMessage(
            "Please Select A Course From The List"
          );
          setBatchChangeNewCourseName("");
        }

        if (
          batchChangePrevCourseName &&
          batchChangePrevCourseName === batchChangeNewCourseName
        ) {
          setMissingFields((prev) => [...prev, "batchChangeNewCourseName"]);
          setBatchChangeNewCourseNameErrorMessage(
            "New Course Must Not Be The Same As Previous Course"
          );
        }

        if (linkToggler === "Link") {
          const paymentReceiptRegex = new RegExp(
            /^(https?:\/\/)?[a-z0-9-]+(\.[a-z0-9-]+)+([/?#][^\s]*)?$/i
          );

          if (!paymentReceiptRegex.test(paymentReceipt)) {
            setMissingFields((prev) => [...prev, "paymentReceipt"]);
            setPaymenReceiptErrorMessage(
              "Please Add A Valid Payment Receipt Link"
            );
          }
        } else {
          if (!paymentReceipt) {
            setMissingFields((prev) => [...prev, "paymentReceipt"]);
            setPaymenReceiptErrorMessage(
              "Please Add A Payment Receipt Attachment"
            ); 
          }
        }
        return;
      }

      case "Assignment": {
        if (!assignmentNotChecked) {
          setMissingFields((prev) => [...prev, "description"]);
          setDescriptionErrorMessage("Please Add A Description");
        }
        return;
      }
      case "Other": {
        if (!title) {
          setMissingFields((prev) => [...prev, "title"]);
          setTitleErrorMessage("Please Add A Title");
        }
        return;
      }
    }

    let info;

    const formData = new FormData();

    switch (issueType) {
      case "No-Access": {
        if (linkToggler !== "Link") formData.append("paymentReceiptImage", paymentReceipt);

        info = {
          courseName: noAccessCourseName,
          paymentReceipt: linkToggler === "Link" ? paymentReceipt : "",
        };
        break;
      }

      case "Batch-Change": {
        if (linkToggler !== "Link")
          formData.append("paymentReceiptImage", paymentReceipt);

        info = {
          prevCourseName: batchChangePrevCourseName,
          newCourseName: batchChangeNewCourseName,
          paymentReceipt: linkToggler === "Link" ? paymentReceipt : "",
        };
        break;
      }

      case "Assignment": {
        assignmentNotChecked && setDescription("Assignment Not Checked");

        break;
      }

      case "Other": {
        info = {
          title,
        };
        break;
      }
    }

    try {
      attachments.length > 0 &&
        attachments.forEach((attachment) =>
          formData.append("attachmentInput[]", attachment)
        );

      const options = {
        studentName,
        studentEmail,
        studentPhone,
        raiser: "648aa701c16fa669d26216df",
        potentialHandlers:
          handlersArray.length > 1
            ? handlersArray.map((handler) => handler._id)
            : [],
        handler: handlersArray.length === 1 ? handlersArray[0]._id : "",
        info,
        description,
        // attachments,
      };
      formData.append("options", JSON.stringify(options));

      // formData.append('attachmentInput', attachments)


      const response = await axiosInstance.post(
        `/issue/raiseIssue/${issueType.toLowerCase()}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

    } catch (error) {
      console.log(error);
    }
  };

  const getAllAgents = async () => {
    try {
      const response = await axiosInstance.get("/agent/getAllAgents");

      setAllHandlersList([...response.data.allAgentsList]);

      const tempSpecialHandlersList = response.data.allAgentsList.filter(
        (handler) => handler.role === "admin"
      );
      const restHandlersList = response.data.allAgentsList.filter(
        (handler) => !tempSpecialHandlersList.includes(handler)
      );

      setAllHandlersList([...tempSpecialHandlersList, ...restHandlersList]);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getAllAgents();
    setIssueType("No-Access");
  }, []);

  useEffect(() => {
    let tempSpecialHandlersList;
    let restHandlersList;
    switch (issueType) {
      case "No-Access":
      case "Other":
      case "Batch-Change":
        tempSpecialHandlersList = allHandlersList.filter(
          (handler) => handler.role === "admin"
        );
        restHandlersList = allHandlersList.filter(
          (handler) => !tempSpecialHandlersList.includes(handler)
        );
        setAllHandlersList([...tempSpecialHandlersList, ...restHandlersList]);
        break;
      case "Assignment":
        tempSpecialHandlersList = allHandlersList.filter(
          (handler) => handler.role === "assignment"
        );
        restHandlersList = allHandlersList.filter(
          (handler) => !tempSpecialHandlersList.includes(handler)
        );
        setAllHandlersList([...tempSpecialHandlersList, ...restHandlersList]);
        break;
    }
  }, [issueType]);

  return (
    <>
      <Head>
        <title>Create Ticket</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div>
        <h1 className="text-6xl text-center">Create Ticket</h1>
        <div className="flex justify-evenly ">
          <div className="flex flex-col gap-4 w-6/12">
            <h1 className="text-3xl ">Student Details</h1>
            <div className="mt-4 w-full border-2 flex justify-between">
              <label htmlFor="studentName" className="border-2">
                Student Name
              </label>
              <div className="w-2/3">
                <input
                  type="text"
                  name="studentName"
                  className="border-2 w-full"
                  value={studentName}
                  onChange={(e) => {
                    setMissingFields((prev) => {
                      const filteredMissingFields = prev.filter(
                        (field) => field !== "studentName"
                      );
                      return [...filteredMissingFields];
                    });
                    setStudentName(e.target.value);
                  }}
                />
                <p
                  className={`text-xs text-red-700 ${
                    missingFields.includes("studentName")
                      ? "block"
                      : "invisible"
                  }`}
                >
                  Please Enter Student Name
                </p>
              </div>
            </div>
            <div className="w-full border-2 flex justify-between">
              <label htmlFor="studentEmail">Student Email</label>
              <div className="w-2/3">
                <input
                  type="text"
                  name="studentEmail"
                  className="border-2 w-full"
                  value={studentEmail}
                  onChange={(e) => {
                    setMissingFields((prev) => {
                      const filteredMissingFields = prev.filter(
                        (field) => field !== "studentEmail"
                      );
                      return [...filteredMissingFields];
                    });
                    setStudentEmail(e.target.value);
                  }}
                />
                <p
                  className={`text-xs text-red-700 ${
                    missingFields.includes("studentEmail")
                      ? "block"
                      : "invisible"
                  }`}
                >
                  {studentEmailErrorMessage}
                </p>
              </div>
            </div>

            <div className="w-full border-2 flex justify-between">
              <label htmlFor="studentPhone">Student Phone</label>
              <div className=" w-2/3">
                <input
                  type="text"
                  name="studentPhone"
                  className="border-2 w-full"
                  value={studentPhone}
                  onChange={(e) => {
                    setMissingFields((prev) => {
                      const filteredMissingFields = prev.filter(
                        (field) => field !== "studentPhone"
                      );
                      return [...filteredMissingFields];
                    });
                    setStudentPhone(e.target.value);
                  }}
                />
                <p
                  className={`text-xs text-red-700 ${
                    missingFields.includes("studentPhone")
                      ? "block"
                      : "invisible"
                  }`}
                >
                  {studentPhoneErrorMessage}
                </p>
              </div>
            </div>

            <div className="w-full border-2 flex justify-between">
              <label htmlFor="issueType">Issue Type</label>

              <select
                name="issueType"
                className="border-2 w-2/3"
                onChange={(e) => setIssueType(e.target.value)}
              >
                <option value="No-Access">No Access</option>
                <option value="Batch-Change">Batch Change</option>
                <option value="Assignment">Assignment</option>
                <option value="Other">Other</option>
              </select>
            </div>

            {/* ---------------------------NO ACCESS-------------------------------------------------------------------------------------------------- */}
            {/* ---------------------------NO ACCESS-------------------------------------------------------------------------------------------------- */}
            {/* ---------------------------NO ACCESS-------------------------------------------------------------------------------------------------- */}
            {/* ---------------------------NO ACCESS-------------------------------------------------------------------------------------------------- */}

            {issueType === "No-Access" && (
              <>
                <div className="w-full border-2 flex justify-between">
                  <label htmlFor="courseList">Course Name</label>

                  <div className="w-2/3">
                    <input
                      list="courseList"
                      className="border-2 w-full"
                      value={noAccessCourseName}
                      onChange={(e) => {
                        setMissingFields((prev) => {
                          const filteredMissingFields = prev.filter(
                            (field) => field !== "noAccessCourseName"
                          );
                          return [...filteredMissingFields];
                        });
                        setNoAccessCourseName(e.target.value);
                      }}
                    />
                    <datalist id="courseList">
                      {courses.map((courseName, id) => (
                        <option key={id} value={courseName} />
                      ))}
                    </datalist>
                    <p
                      className={`text-xs text-red-700 ${
                        missingFields.includes("noAccessCourseName")
                          ? "block"
                          : "invisible"
                      }`}
                    >
                      {noAccessCourseNameErrorMessage}
                    </p>
                  </div>
                </div>

                <div>
                  <h1>{`Add ${
                    linkToggler === "Link" ? "Link" : "Image Attachments"
                  }`}</h1>
                  <p
                    className="cursor-pointer text-sm text-blue-500 inline-block"
                    onClick={() => {
                      setMissingFields((prev) => {
                        const filteredMissingFields = prev.filter(
                          (field) => field !== "paymentReceipt"
                        );
                        return [...filteredMissingFields];
                      });
                      linkToggler === "Link"
                        ? setLinkToggler("Images")
                        : setLinkToggler("Link");
                    }}
                  >
                    {linkToggler === "Link"
                      ? "Add Image Attachments Instead"
                      : "Add Links Instead"}
                  </p>
                </div>

                {linkToggler === "Link" ? (
                  <>
                    <div className="w-full border-2 flex justify-between">
                      <label htmlFor="paymentReceiptLink">
                        Payment Reciept
                      </label>
                      <div className="w-2/3">
                        <input
                          type="text"
                          name="paymentReceiptLink"
                          className="border-2 w-full"
                          value={paymentReceipt}
                          onChange={(e) => {
                            setMissingFields((prev) => {
                              const filteredMissingFields = prev.filter(
                                (field) => field !== "paymentReceipt"
                              );
                              return [...filteredMissingFields];
                            });
                            setPaymentReceipt(e.target.value);
                          }}
                        />
                        <p
                          className={`text-xs text-red-700 ${
                            missingFields.includes("paymentReceipt")
                              ? "block"
                              : "invisible"
                          }`}
                        >
                          {paymenReceiptErrorMessage}
                        </p>
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="w-full border-2 flex justify-between">
                    <label htmlFor="paymentReceiptImage">Payment Reciept</label>
                    <div className="w-2/3">
                      <div className="border-2  flex flex-row justify-between">
                        <input
                          type="file"
                          ref={paymentReceiptImageInputRef}
                          name="paymentReceiptImage"
                          className=""
                          onChange={(e) => {
                            setMissingFields((prev) => {
                              const filteredMissingFields = prev.filter(
                                (field) => field !== "paymentReceipt"
                              );
                              return [...filteredMissingFields];
                            });
                            setRemovePaymentReceipt(true);
                            setPaymentReceipt(e.target.files[0]);
                          }}
                        />
                        {removePaymentReceipt && (
                          <button
                            className="text-red-700"
                            onClick={() => {
                              setRemovePaymentReceipt(false);
                              paymentReceiptImageInputRef.current.value = null;
                              setPaymentReceipt("");
                            }}
                          >
                            Remove
                          </button>
                        )}
                      </div>
                      <p
                        className={`text-xs text-red-700 ${
                          missingFields.includes("paymentReceipt")
                            ? "block"
                            : "invisible"
                        }`}
                      >
                        {paymenReceiptErrorMessage}
                      </p>
                    </div>
                  </div>
                )}
              </>
            )}

            {/* ---------------------------BATCH CHANGE-------------------------------------------------------------------------------------------------- */}
            {/* ---------------------------BATCH CHANGE-------------------------------------------------------------------------------------------------- */}
            {/* ---------------------------BATCH CHANGE-------------------------------------------------------------------------------------------------- */}
            {/* ---------------------------BATCH CHANGE-------------------------------------------------------------------------------------------------- */}

            {issueType === "Batch-Change" && (
              <>
                <div className="w-full border-2 flex justify-between">
                  <label htmlFor="courseList">Previous Course Name</label>

                  <div className="w-2/3">
                    <input
                      list="courseList"
                      className="border-2 w-full"
                      value={batchChangePrevCourseName}
                      onChange={(e) => {
                        setMissingFields((prev) => {
                          const filteredMissingFields = prev.filter(
                            (field) => field !== "batchChangePrevCourseName"
                          );
                          return [...filteredMissingFields];
                        });
                        setBatchChangePrevCourseName(e.target.value);
                      }}
                    />
                    <datalist id="courseList">
                      {courses.map((courseName, id) => (
                        <option key={id} value={courseName} />
                      ))}
                    </datalist>
                    <p
                      className={`text-xs text-red-700 ${
                        missingFields.includes("batchChangePrevCourseName")
                          ? "block"
                          : "invisible"
                      }`}
                    >
                      {batchChangePrevCourseNameErrorMessage}
                    </p>
                  </div>
                </div>

                <div className="w-full border-2 flex justify-between">
                  <label htmlFor="courseList">New Course Name</label>
                  <div className="w-2/3">
                    <input
                      list="courseList"
                      className="border-2 w-full"
                      value={batchChangeNewCourseName}
                      onChange={(e) => {
                        setMissingFields((prev) => {
                          const filteredMissingFields = prev.filter(
                            (field) => field !== "batchChangeNewCourseName"
                          );
                          return [...filteredMissingFields];
                        });
                        setBatchChangeNewCourseName(e.target.value);
                      }}
                    />
                    <datalist id="courseList">
                      {courses.map((courseName, id) => (
                        <option key={id} value={courseName}>
                          courseName
                        </option>
                      ))}
                    </datalist>
                    <p
                      className={`text-xs text-red-700 ${
                        missingFields.includes("batchChangeNewCourseName")
                          ? "block"
                          : "invisible"
                      }`}
                    >
                      {batchChangeNewCourseNameErrorMessage}
                    </p>
                  </div>
                </div>
                <div>
                  <h1>{`Add ${
                    linkToggler === "Link" ? "Link" : "Image Attachments"
                  }`}</h1>
                  <p
                    className="cursor-pointer text-sm text-blue-500 inline-block"
                    onClick={() => {
                      setMissingFields((prev) => {
                        const filteredMissingFields = prev.filter(
                          (field) => field !== "paymentReceipt"
                        );
                        return [...filteredMissingFields];
                      });
                      linkToggler === "Link"
                        ? setLinkToggler("Image")
                        : setLinkToggler("Link");
                    }}
                  >
                    {linkToggler === "Link"
                      ? "Add Image Attachments Instead"
                      : "Add Links Instead"}
                  </p>
                </div>

                {linkToggler === "Link" ? (
                  <>
                    <div className="w-full border-2 flex justify-between">
                      <label htmlFor="paymentReceiptLink">
                        Payment Reciept
                      </label>
                      <div className="w-2/3">
                        <input
                          type="text"
                          value={paymentReceipt}
                          name="paymentReceiptLink"
                          className="border-2 w-full"
                          onChange={(e) => {
                            setMissingFields((prev) => {
                              const filteredMissingFields = prev.filter(
                                (field) => field !== "paymentReceipt"
                              );
                              return [...filteredMissingFields];
                            });
                            setPaymentReceipt(e.target.value);
                          }}
                        />
                        <p
                          className={`text-xs text-red-700 ${
                            missingFields.includes("paymentReceipt")
                              ? "block"
                              : "invisible"
                          }`}
                        >
                          {paymenReceiptErrorMessage}
                        </p>
                      </div>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="w-full border-2 flex justify-between">
                      <label htmlFor="paymentReceiptImage">
                        Payment Reciept
                      </label>
                      <div className="w-2/3">
                        <div className="border-2  flex flex-row justify-between">
                          <input
                            type="file"
                            ref={paymentReceiptImageInputRef}
                            name="paymentReceiptImage"
                            className=""
                            onChange={(e) => {
                              setMissingFields((prev) => {
                                const filteredMissingFields = prev.filter(
                                  (field) => field !== "paymentReceipt"
                                );
                                return [...filteredMissingFields];
                              });
                              setRemovePaymentReceipt(true);
                              setPaymentReceipt(e.target.files[0]);
                            }}
                          />
                          {removePaymentReceipt && (
                            <button
                              className="text-red-700"
                              onClick={() => {
                                setMissingFields((prev) => {
                                  const filteredMissingFields = prev.filter(
                                    (field) => field !== "paymentReceipt"
                                  );
                                  return [...filteredMissingFields];
                                });
                                setRemovePaymentReceipt(false);
                                paymentReceiptImageInputRef.current.value =
                                  null;
                                setPaymentReceipt("");
                              }}
                            >
                              Remove
                            </button>
                          )}
                        </div>
                        <p
                          className={`text-xs text-red-700 ${
                            missingFields.includes("paymentReceipt")
                              ? "block"
                              : "invisible"
                          }`}
                        >
                          {paymenReceiptErrorMessage}
                        </p>
                      </div>
                    </div>
                  </>
                )}
              </>
            )}

            {/* ---------------------------ASSIGNMENT-------------------------------------------------------------------------------------------------- */}
            {/* ---------------------------ASSIGNMENT-------------------------------------------------------------------------------------------------- */}
            {/* ---------------------------ASSIGNMENT-------------------------------------------------------------------------------------------------- */}
            {/* ---------------------------ASSIGNMENT-------------------------------------------------------------------------------------------------- */}

            {issueType === "Assignment" && (
              <div className="text-right">
                <label>
                  <input
                    type="checkbox"
                    checked={assignmentNotChecked}
                    onChange={() => setAssignmentNotChecked((prev) => !prev)}
                  />
                  &nbsp; Assignment Not Checked Issue?
                </label>
              </div>
            )}

            {/* ---------------------------OTHER-------------------------------------------------------------------------------------------------- */}
            {/* ---------------------------OTHER-------------------------------------------------------------------------------------------------- */}
            {/* ---------------------------OTHER-------------------------------------------------------------------------------------------------- */}
            {/* ---------------------------OTHER-------------------------------------------------------------------------------------------------- */}

            {issueType === "Other" && (
              <div className="w-full border-2 flex justify-between">
                <label htmlFor="issueTitle">Add A Short Title</label>
                <div className=" w-2/3">
                  <input
                    type="text"
                    name="issueTitle"
                    className="border-2 w-full"
                    onChange={(e) => {
                      setMissingFields((prev) => {
                        const filteredMissingFields = prev.filter(
                          (field) => field !== "title"
                        );
                        return [...filteredMissingFields];
                      });
                      setTitle(e.target.value);
                    }}
                  />
                  <p
                    className={`text-xs text-red-700 ${
                      missingFields.includes("title") ? "block" : "invisible"
                    }`}
                  >
                    {titleErrorMessage}
                  </p>
                </div>
              </div>
            )}

            <div>
              <div className="w-full border-2 flex justify-between">
                <label htmlFor="handler">Handler</label>
                <div className="flex flex-col w-2/3">
                  <Autocomplete
                    options={allHandlersList}
                    getOptionLabel={(option) => option.name}
                    renderOption={(props, option, state) => (
                      <li
                        key={option._id}
                        onClick={() => {
                          setMissingFields((prev) => {
                            const filteredMissingFields = prev.filter(
                              (field) => field !== "handlers"
                            );
                            return [...filteredMissingFields];
                          });
                          setHandlersArray((prev) => [...prev, option]);
                          const filteredAllHandlersList =
                            allHandlersList.filter(
                              (handler) => handler._id !== option._id
                            );
                          setAllHandlersList([...filteredAllHandlersList]);
                        }}
                        className="cursor-pointer"
                      >
                        <span>{option.name}</span>
                        &nbsp; (<span>{option.domain}</span>
                        &nbsp;
                        <span>{option.role}</span>)
                      </li>
                    )}
                    renderInput={(params) => (
                      <TextField {...params} label="Handlers" />
                    )}
                  />
                  <div>
                    {handlersArray.length !== 0 &&
                      handlersArray.map((handler, id) => (
                        <div
                          key={id}
                          className="mt-2 px-1 py-1 flex flex-row justify-between gap-1 border-2 rounded-lg bg-slate-200 "
                        >
                          <div>
                            <span>{handler.name}</span>
                            &nbsp; (<span>{handler.domain}</span>
                            &nbsp;
                            <span>{handler.role}</span>)
                          </div>
                          <div
                            className="text-red-700 cursor-pointer"
                            onClick={() => {
                              const filteredHandlersArray =
                                handlersArray.filter(
                                  (filterHandler) =>
                                    filterHandler._id !== handler._id
                                );
                              setHandlersArray([...filteredHandlersArray]);
                            }}
                          >
                            Remove
                          </div>
                        </div>
                      ))}
                    <p
                      className={`text-xs text-red-700 ${
                        missingFields.includes("handlers")
                          ? "block"
                          : "invisible"
                      }`}
                    >
                      Please Select Atleast One Handler
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className="w-full border-2 flex justify-between">
              <h1>Attachments</h1>
              <div className="w-2/3 ">
                <div className="flex flex-col  gap-1">
                  {attachments.length > 0 &&
                    attachments.map((attachment, id) => (
                      <div
                        key={id}
                        className="bg-slate-200 px-2 rounded-md  flex justify-between"
                      >
                        <div>{attachment.name}</div>
                        <button
                          className="text-red-700"
                          onClick={() => {
                            const filteredAttachments = [...attachments];
                            filteredAttachments.splice(id, 1);
                            setAttachments([...filteredAttachments]);
                          }}
                        >
                          Remove
                        </button>
                      </div>
                    ))}
                </div>

                <div className={`${attachments.length > 0 && "mt-4"}`}>
                  <label
                    htmlFor="attachmentInput[]"
                    className="mt-4 border-2 border-slate-400 px-1 rounded-md cursor-pointer"
                  >
                    Add More
                  </label>
                  <input
                    type="file"
                    id="attachmentInput[]"
                    name="attachmentInput[]"
                    className="hidden"
                    value=""
                    onChange={(e) =>
                      setAttachments([...attachments, e.target.files[0]])
                    }
                  />
                </div>
              </div>
            </div>
          </div>
          <div>
            <h1>Description</h1>
            <textarea
              name=""
              id=""
              cols="30"
              rows="10"
              className="border-2"
              onChange={(e) => {
                setMissingFields((prev) => {
                  const filteredMissingFields = prev.filter(
                    (field) => field !== "description"
                  );
                  return [...filteredMissingFields];
                });
                setDescription(e.target.value);
              }}
            />
            <p
              className={`text-xs text-red-700 ${
                missingFields.includes("description") ? "block" : "invisible"
              }`}
            >
              {descriptionErrorMessage}
            </p>
          </div>
        </div>
        <button
          className="border-2 float-right	mr-20 px-3 py-2"
          onClick={createTicket}
        >
          Create Ticket
        </button>
      </div>
    </>
  );
};

export default create;
