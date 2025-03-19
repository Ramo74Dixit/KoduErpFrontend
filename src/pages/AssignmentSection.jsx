import React, { useState } from 'react';

// Modal component for GitHub link input remains unchanged
const Modal = ({ isOpen, onClose, onSubmit }) => {
  const [githubLink, setGithubLink] = useState('');

  const handleSubmit = () => {
    if (githubLink) {
      onSubmit(githubLink);
      setGithubLink('');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex justify-center items-center bg-gray-500 bg-opacity-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96 sm:w-80">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Enter GitHub Link</h2>
        <input
          type="url"
          className="w-full p-3 border border-gray-300 rounded mb-4"
          placeholder="GitHub Repository Link"
          value={githubLink}
          onChange={(e) => setGithubLink(e.target.value)}
        />
        <div className="flex justify-between space-x-4">
          <button onClick={onClose} className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400 focus:outline-none transition">
            Cancel
          </button>
          <button onClick={handleSubmit} className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 focus:outline-none transition">
            Submit
          </button>
        </div>
      </div>
    </div>
  );
};

const AssignmentsSection = ({ assignments, uploadAssignmentLink, student }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentAssignmentId, setCurrentAssignmentId] = useState(null);

  const handleModalClose = () => {
    setIsModalOpen(false);
    setCurrentAssignmentId(null);
  };

  const handleModalSubmit = (githubLink) => {
    uploadAssignmentLink(currentAssignmentId, githubLink);
    handleModalClose();
  };

  return (
    <div className="bg-white p-4 sm:p-6 rounded-lg shadow border">
      <h3 className="text-2xl font-bold text-gray-800 mb-6 border-l-4 border-blue-500 pl-4">
        Assignments
      </h3>

      {assignments.length > 0 ? (
        <div className="overflow-x-auto">
          {/* Desktop/Table view */}
          <div className="hidden sm:block">
            <table className="min-w-full border-collapse table-auto">
              <thead>
                <tr className="bg-gray-200">
                  <th className="px-4 py-2 border">Title</th>
                  <th className="px-4 py-2 border">Action</th>
                </tr>
              </thead>
              <tbody>
                {assignments.map((assignment) => {
                  // Check if current student already submitted
                  const isSubmitted =
                    assignment.submissions &&
                    assignment.submissions.some((submission) => {
                      if (typeof submission.student === 'object') {
                        return submission.student._id === student._id;
                      }
                      return submission.student === student._id;
                    });

                  return (
                    <tr key={assignment._id} className="hover:bg-gray-100">
                      <td className="px-4 py-2 border text-sm">{assignment.title}</td>
                      <td className="px-4 py-2 border text-sm">
                        <div className="flex space-x-2">
                          <button
                            onClick={() => window.open(assignment.fileUrl, '_blank')}
                            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition focus:outline-none"
                          >
                            View Assignment
                          </button>
                          {isSubmitted ? (
                            <button className="px-4 py-2 bg-green-600 text-white rounded cursor-not-allowed" disabled>
                              Submitted
                            </button>
                          ) : (
                            <button
                              onClick={() => {
                                setCurrentAssignmentId(assignment._id);
                                setIsModalOpen(true);
                              }}
                              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition focus:outline-none"
                            >
                              Upload
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Mobile/Card view */}
          <div className="block sm:hidden">
            {assignments.map((assignment) => {
              const isSubmitted =
                assignment.submissions &&
                assignment.submissions.some((submission) => {
                  if (typeof submission.student === 'object') {
                    return submission.student._id === student._id;
                  }
                  return submission.student === student._id;
                });
              return (
                <div key={assignment._id} className="mb-6 p-4 border border-gray-200 rounded-lg">
                  <h4 className="font-semibold text-lg">{assignment.title}</h4>
                  <div className="mt-3 flex flex-col space-y-2">
                    <button
                      onClick={() => window.open(assignment.fileUrl, '_blank')}
                      className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
                    >
                      View Assignment
                    </button>
                    {isSubmitted ? (
                      <button className="px-4 py-2 bg-green-600 text-white rounded cursor-not-allowed" disabled>
                        Submitted
                      </button>
                    ) : (
                      <button
                        onClick={() => {
                          setCurrentAssignmentId(assignment._id);
                          setIsModalOpen(true);
                        }}
                        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
                      >
                        Upload
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        <p className="text-gray-600">No assignments found.</p>
      )}

      {/* Modal for GitHub Link */}
      <Modal isOpen={isModalOpen} onClose={handleModalClose} onSubmit={handleModalSubmit} />
    </div>
  );
};

export default AssignmentsSection;
