import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import Loading from "../../../Loading/Loading";
import Header from "../../../Navbar/header";
const Ptestres = () => {
  const { id } = useParams();
  const [data, setdata] = useState();
  // const [err, seterr] = useState();
  const [isSideNavOpen, setIsSideNavOpen] = useState(false)

  useEffect(() => {
    axios.defaults.withCredentials = true;
    axios
      .get(
        `${process.env.REACT_APP_API_URL}/api/physicaltest/answer-copies/result/${id}`
      )
      .then((res) => {
        setdata(res.data.data);
        // if(res.data.data)
      })
      .catch((err) =>setdata("No Result") );
  }, [id]);
  return (
    <>
    <div className={`${isSideNavOpen? 'sm:ml-64': ''}`} >
   <Header isSideNavOpen={isSideNavOpen} setIsSideNavOpen={setIsSideNavOpen}/>
   {data ? (
        data === "No Result" ? (
          <>NO Test Taken for This Test id</>
        ) : (
          <>
          <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto bg-white p-6 rounded-lg shadow-lg">
        <h1 className="text-2xl font-bold mb-4">Result of Test</h1>
        
        <div className="grid grid-cols-1 gap-4">
          <div className="bg-white p-4 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-2">Test Information</h2>
            <p><strong>Test Checked By :</strong> {data.teacher.fullName}</p>
            <p><strong>Student:</strong> {data.student.fullName}</p>
            <p><strong>Total Marks:</strong> {data.test.score}</p>
            <p><strong>Obtained Marks:</strong> {data.score}</p>
            <p><strong>Grade:</strong> {data.grade}</p>
            <p><strong>View Submission:</strong> <Link to={data.pdfPath}>Click Here</Link></p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-2">Feedback</h2>
            <p><strong>Teacher Feedback:</strong> {data.feedback}</p>
         

          </div>

         {data.recommendations[0] && <div className="bg-white p-4 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-2">Recommendations</h2>
            <ul className="list-disc pl-5">
              {data.recommendations && data?.recommendations.map((rec, index) => (
                <Link to={`/topic/${rec.topicId._id}`}> <li key={index}>{rec.topicId.name}</li></Link>
              ))}
            </ul>
          </div>}

          {/* <div className="bg-white p-4 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-2">Timestamps</h2>
            <p><strong>Created At:</strong> {new Date(data.createdAt).toLocaleString()}</p>
            <p><strong>Updated At:</strong> {new Date(data.updatedAt).toLocaleString()}</p>
          </div> */}
        </div>
      </div>
    </div>
          </>
        )
      ) : (
        <Loading />
      )} 
   </div>
      
    </>
  );
};

export default Ptestres;