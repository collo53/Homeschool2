import { useEffect, useState } from "react";
import axios from "axios";
import {
  FaBookOpen,
  FaClock,
  FaCheckCircle,
  FaExclamationCircle,
  FaPlayCircle,
  FaDownload,
  FaUpload,
} from "react-icons/fa";
import { toast } from "react-toastify"

const StudentLessonHero = () => {
  const [assignments, setAssignments] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedAssignment, setSelectedAssignment] = useState(null);
  const [file, setFile] = useState(null);

  const studentId = localStorage.getItem("studentId");

  useEffect(() => {
    if (!studentId) return;

    axios
      .get(`http://127.0.0.1:8000/Hub/student/${studentId}/assignments/`)
      .then((res) => {
        setAssignments(res.data);
        console.log("Fetched assignments:", res.data);
      })
      .catch((err) => {
        console.error("Error fetching assignments:", err);
      });
  }, [studentId]);

const handleDownload = (fileUrl) => {
  if (!fileUrl) {
    toast("No file attached for this assignment.");
    return;
  }
  const link = document.createElement("a");
  link.href = fileUrl;
  link.setAttribute("download", fileUrl.split("/").pop()); // filename from URL
  document.body.appendChild(link);
  link.click();
  link.remove();
};


  const handleOpenModal = (assignment) => {
    setSelectedAssignment(assignment);
    setShowModal(true);
  };

  const handleSubmit = async () => {
    if (!file || !selectedAssignment) {
      alert("Please select a file.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("student", studentId);
    formData.append("assignment", selectedAssignment.id);

    try {
      await axios.post("http://127.0.0.1:8000/Hub/submit-assignment/", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      toast("Assignment submitted successfully!");
      setShowModal(false);
      setFile(null);
    } catch (err) {
      console.error("Error submitting assignment:", err);
      toast.error("Failed to submit assignment.");
    }
  };

  const getStatusBadge = (status, grade) => {
    switch (status?.toLowerCase()) {
      case "completed":
        return (
          <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full font-semibold">
            Completed {grade && `- ${grade}`}
          </span>
        );
      case "in-progress":
        return (
          <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full font-semibold">
            In Progress
          </span>
        );
      case "pending":
        return (
          <span className="border border-gray-300 text-gray-700 text-xs px-2 py-1 rounded-full font-semibold">
            Pending
          </span>
        );
      case "overdue":
        return (
          <span className="bg-red-100 text-red-800 text-xs px-2 py-1 rounded-full font-semibold">
            Overdue
          </span>
        );
      default:
        return (
          <span className="border border-gray-300 text-gray-700 text-xs px-2 py-1 rounded-full font-semibold">
            {status}
          </span>
        );
    }
  };

  const getStatusIcon = (status) => {
    switch (status?.toLowerCase()) {
      case "completed":
        return <FaCheckCircle className="text-green-600" />;
      case "in-progress":
        return <FaPlayCircle className="text-blue-600" />;
      case "overdue":
        return <FaExclamationCircle className="text-red-600" />;
      default:
        return <FaBookOpen className="text-gray-600" />;
    }
  };

  return (<div className="flex flex-col gap-4 px-4 sm:px-6 py-6">
  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
    <div>
      <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
        My Assignments
      </h1>
      <p className="text-gray-600 mt-1 text-sm sm:text-base">
        Assignments from your teacher
      </p>
    </div>
  </div>

  <div className="space-y-4">
    {assignments.map((assignment) => (
      <div
        key={assignment.id}
        className="bg-white border border-gray-200 rounded-lg shadow-sm p-4 sm:p-6 hover:shadow-md transition flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4"
      >
        <div className="flex gap-4 flex-1">
          <div className="mt-1">{getStatusIcon(assignment.status)}</div>
          <div className="flex-1 space-y-2">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  {assignment.title}
                </h3>
                <p className="text-sm text-gray-600">
                  {assignment.class_name} • {assignment.teacher_name}
                </p>
              </div>
              <div>{getStatusBadge(assignment.status)}</div>
            </div>
            <p className="text-gray-700 text-sm">
              Due: {new Date(assignment.due_date).toLocaleDateString()}
            </p>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <FaClock className="text-gray-500" />
              {assignment.submitted}/{assignment.total} submitted
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row sm:gap-2 gap-2 mt-2 sm:mt-0">
          <button
            onClick={() => handleDownload(assignment.file_url)}
            className="flex items-center justify-center text-sm px-3 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 w-full sm:w-auto"
          >
            <FaDownload className="mr-1" /> Download
          </button>
          <button
            onClick={() => handleOpenModal(assignment)}
            className="flex items-center justify-center text-sm px-3 py-2 bg-black text-white rounded-lg hover:bg-[#ffc01d] hover:text-black w-full sm:w-auto"
          >
            <FaUpload className="mr-1" /> Submit
          </button>
        </div>
      </div>
    ))}
  </div>

  {showModal && (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 p-4">
      <div className="bg-white text-black  rounded-lg shadow-lg p-4 sm:p-6 w-full max-w-md">
        <h2 className="text-lg font-bold mb-4">
          Submit Assignment: {selectedAssignment?.title}
        </h2>
        <input
          type="file"
          className="w-full text-black border p-2 rounded mb-4"
          onChange={(e) => setFile(e.target.files[0])}
        />
        <div className="flex flex-col sm:flex-row justify-end gap-2">
          <button
            onClick={() => setShowModal(false)}
            className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 w-full sm:w-auto"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="px-4 py-2 bg-black text-white rounded hover:bg-[#ffc01d] hover:text-black w-full sm:w-auto"
          >
            Submit
          </button>
        </div>
      </div>
    </div>
  )}
</div>

  );
};

export default StudentLessonHero;
