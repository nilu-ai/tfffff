import React, { useState, useEffect } from "react";
import Header from "../../../../Navbar/header";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { useSelector } from "react-redux";
import { IoIosArrowBack } from "react-icons/io";
import { IoMdMore } from "react-icons/io";
import { jsPDF } from "jspdf";
import Toast from './Toast';  // Import the Toast component

const Physicaltestupload = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const stdid = useSelector((store) => store.user.data._id);

  const [data, setData] = useState({})
  const [files, setFiles] = useState([]);
  const [err, setErr] = useState("");
  const [toastMessage, setToastMessage] = useState("");  // State for the Toast message
  const [showToast, setShowToast] = useState(false);    // State to control toast visibility

  useEffect(() => {
    async function fetchTestData() {
      try {
        axios.defaults.withCredentials = true;
        const testResponse = await axios.get(
          `${process.env.REACT_APP_API_URL}/api/physicaltest/physical-tests/${id}`
        );
        setData(testResponse.data.data);
      } catch (error) {
        console.error("Error fetching test data:", error);
      }
    }
    fetchTestData();
  }, [id]);

  const handleFileChange = (e) => {
    const uploadedFiles = Array.from(e.target.files);
    setFiles((prevFiles) => [...prevFiles, ...uploadedFiles]);
  };

  const handleFileDelete = (index) => {
    setFiles((prevFiles) => prevFiles.filter((_, i) => i !== index));
  };

  const submittest = () => {
    if (files.length === 0) {
      setToastMessage("No files uploaded yet.");  // Set the message for Toast
      setShowToast(true);  // Show the toast
      setTimeout(() => setShowToast(false), 3000);  // Hide the toast after 3 seconds
      return;
    }

    const formData = new FormData();
    formData.append("studentId", stdid);
    formData.append("teacherId", data.teacher?._id);
    formData.append("testId", id);
    files.forEach((file) => formData.append("pdf", file));

    axios.defaults.withCredentials = true;
    axios
      .post(
        `${process.env.REACT_APP_API_URL}/api/physicaltest/answer-copies`,
        formData
      )
      .then(() => {
        setToastMessage("Successfully Submitted Test");  // Set the success message for Toast
        setShowToast(true);  // Show the toast
        setTimeout(() => navigate("/student/physical-test"), 3000);  // Redirect after 3 seconds
      })
      .catch((error) => {
        console.error("Error submitting test:", error);
        setErr("An error occurred while submitting the test.");
      });
  };

  return (
    <>
      <Header />
      <div className="m-2 font-semibold text-xl flex flex-row">
        <button className="pl-48 pr-12" onClick={() => navigate(-1)}>
          <IoIosArrowBack />
        </button>
        <div
          className="flex flex-row bg-gray-100 rounded-xl place-content-center"
          style={{
            width: "860px",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <p className="text-slate-500 text-lg font-semibold">{data.name}</p>
          <div className="flex flex-row">
            <p className="text-slate-500 text-lg font-semibold">
              {data.dueDate || "No Due Date"}
            </p>
            <button className="p-2">
              <IoMdMore style={{ fontWeight: "bold" }} />
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-auto mx-auto bg-white rounded-xl mt-8 p-6 grid grid-cols-2 gap-6">
        <div className="pr-6">
          <div className="pb-4">
            <p className="font-semibold text-lg">LIST OF QUESTIONS</p>
          </div>
          <ul className="pl-2">
            {data.questions?.map((item, index) => (
              <li
                key={index}
                className={`flex justify-between items-center rounded-xl py-4 px-4 ${index % 2 === 0
                    ? "bg-white border border-sky-200"
                    : "bg-gray-100"
                  }`}
              >
                <span className="text-gray-700 text-sm font-medium">
                  {index + 1}. {item.question}
                </span>
                <span className="text-gray-500 text-sm">{item.score} Marks</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="pl-6 mt-16 flex flex-col gap-4">
          <div className="p-4 border-2 border-dashed border-gray-400 rounded-lg relative">
            <input
              id="fileInput"
              type="file"
              multiple
              style={{ display: "none" }}
              onChange={handleFileChange}
            />
            <div
              className="w-full h-48 flex flex-col justify-center items-center cursor-pointer"
              onClick={() => document.getElementById("fileInput").click()}
            >
              <p className="text-gray-500 text-center">Click here to upload files</p>
            </div>

            {/* Display Uploaded Files Inside Dotted Box */}
            <div className="mt-4">
              {files.length > 0 ? (
                <ul className="space-y-2">
                  {files.map((file, index) => (
                    <li
                      key={index}
                      className="flex items-center justify-between border p-2 rounded-md shadow-sm"
                    >
                      <span className="text-sm text-gray-700 truncate">
                        {file.name}
                      </span>
                      <button
                        onClick={() => handleFileDelete(index)}
                        className="bg-orange-500 text-white px-2 py-1 text-xs rounded-md hover:bg-red-600"
                      >
                        Delete
                      </button>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-gray-500">No files uploaded yet.</p>
              )}
            </div>
          </div>

          <div className="flex justify-center mt-6">
            <button
              onClick={submittest}
              className="bg-orange-500 text-white px-6 py-3 rounded-lg shadow-md hover:bg-blue-600 hover:shadow-lg transition duration-300 ease-in-out"
            >
              Submit Test
            </button>
          </div>

          {err && (
            <div className="text-red-500 text-center mt-4 font-medium">
              {err}
            </div>
          )}
        </div>
      </div>

      {showToast && (
        <Toast message={toastMessage} onClose={() => setShowToast(false)} />
      )}
    </>
  );
};

export default Physicaltestupload;
