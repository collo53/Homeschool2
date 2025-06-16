import React, { useState } from "react";
import { FaPlus } from "react-icons/fa";
import AddTeacherModal from "./AddTeacherModal";

function TeacherHero({ setTeachers }) {
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      <div className="flex justify-between items-center w-full">
        <div>
          <h1 className="text-3xl text-black font-bold mb-4">Teachers</h1>
          <p className="mb-4 text-black">Manage teaching staff and their assignments</p>
          <form>
            <input
              type="text"
              placeholder="Search"
              className="text-black bg-gray-300 border border-gray-500 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
            />
          </form>
        </div>

        <div>
          <button
            onClick={() => setShowModal(true)}
            className="bg-[#ffc01d] text-white px-4 py-2 rounded-md flex items-center gap-2 hover:bg-black hover:text-white transition-colors"
          >
            <FaPlus />
            Add Teacher
          </button>
        </div>
      </div>

      {showModal && (
        <AddTeacherModal
          onClose={() => setShowModal(false)}
          setTeachers={setTeachers}
        />
      )}
    </>
  );
}

export default TeacherHero;
