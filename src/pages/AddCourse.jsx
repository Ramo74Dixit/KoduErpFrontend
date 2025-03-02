import React, { useState } from 'react';
import {
  FaPlusCircle,
  FaTrashAlt,
  FaBook,
  FaClock,
  FaBookmark,
  FaListAlt,
} from 'react-icons/fa';

const AddCourse = () => {
  const [courseName, setCourseName] = useState('');
  const [description, setDescription] = useState('');
  const [subjects, setSubjects] = useState([
    { subjectName: '', batchTimings: [{ batchName: '', startTime: '', endTime: '' }] },
  ]);
  const [topics, setTopics] = useState([{ topicName: '', description: '' }]);

  // Handle subject changes
  const handleSubjectChange = (index, event) => {
    const values = [...subjects];
    values[index][event.target.name] = event.target.value;
    setSubjects(values);
  };

  const handleAddSubject = () => {
    setSubjects([
      ...subjects,
      { subjectName: '', batchTimings: [{ batchName: '', startTime: '', endTime: '' }] },
    ]);
  };

  const handleRemoveSubject = (index) => {
    const values = [...subjects];
    values.splice(index, 1);
    setSubjects(values);
  };

  // Handle batch timings changes
  const handleBatchTimingChange = (subjectIndex, batchIndex, event) => {
    const values = [...subjects];
    const batchTimings = [...values[subjectIndex].batchTimings];
    batchTimings[batchIndex][event.target.name] = event.target.value;
    values[subjectIndex].batchTimings = batchTimings;
    setSubjects(values);
  };

  const handleAddBatch = (subjectIndex) => {
    const values = [...subjects];
    values[subjectIndex].batchTimings.push({ batchName: '', startTime: '', endTime: '' });
    setSubjects(values);
  };

  const handleRemoveBatch = (subjectIndex, batchIndex) => {
    const values = [...subjects];
    values[subjectIndex].batchTimings.splice(batchIndex, 1);
    setSubjects(values);
  };

  // Handle topic changes
  const handleTopicChange = (index, event) => {
    const values = [...topics];
    values[index][event.target.name] = event.target.value;
    setTopics(values);
  };

  const handleAddTopic = () => {
    setTopics([...topics, { topicName: '', description: '' }]);
  };

  const handleRemoveTopic = (index) => {
    const values = [...topics];
    values.splice(index, 1);
    setTopics(values);
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    const courseData = {
      courseName,
      description,
      subjects,
      topics,
    };

    try {
      const response = await fetch(
        'https://kodu-erp.onrender.com/api/courses/add-course',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(courseData),
        }
      );
      const result = await response.json();

      if (response.ok) {
        alert('Course added successfully');
        // Reset form
        setCourseName('');
        setDescription('');
        setSubjects([{ subjectName: '', batchTimings: [{ batchName: '', startTime: '', endTime: '' }] }]);
        setTopics([{ topicName: '', description: '' }]);
      } else {
        alert(result.message || 'Failed to add course');
      }
    } catch (error) {
      console.error('Error adding course:', error);
      alert('Something went wrong');
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Animated Gradient Background */}
      <div className="absolute inset-0 bg-animated-gradient"></div>

      {/* Main Content Container */}
      <div className="relative max-w-4xl mx-auto mt-10 mb-10 bg-white bg-opacity-90 rounded-xl shadow-2xl p-8">
        {/* Header */}
        <div className="flex items-center gap-3 mb-8">
          <FaBook className="text-3xl text-indigo-600" />
          <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">
            Add New Course
          </h2>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Course Name */}
          <div>
            <label className="block text-gray-700 font-medium mb-2">
              Course Name
            </label>
            <input
              type="text"
              className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-indigo-500"
              value={courseName}
              onChange={(e) => setCourseName(e.target.value)}
              required
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-gray-700 font-medium mb-2">
              Description
            </label>
            <textarea
              className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-indigo-500"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
              required
            />
          </div>

          {/* Subjects */}
          <div className="space-y-4">
            <h3 className="text-xl font-semibold flex items-center gap-2">
              <FaBookmark className="text-indigo-500" /> Subjects
            </h3>
            {subjects.map((subject, index) => (
              <div key={index} className="p-4 border border-gray-200 rounded shadow-sm">
                <div className="flex justify-between items-center mb-4">
                  <label className="block text-gray-700 font-medium">
                    Subject Name
                  </label>
                  <button
                    type="button"
                    onClick={() => handleRemoveSubject(index)}
                    className="text-red-500 hover:text-red-700 transition"
                  >
                    <FaTrashAlt />
                  </button>
                </div>
                <input
                  type="text"
                  className="w-full px-4 py-2 mb-4 border border-gray-300 rounded focus:outline-none focus:border-indigo-500"
                  name="subjectName"
                  value={subject.subjectName}
                  onChange={(e) => handleSubjectChange(index, e)}
                  required
                />
                {/* Batch Timings */}
                <div className="mt-2 space-y-4">
                  <h4 className="text-lg flex items-center gap-2">
                    <FaClock className="text-indigo-500" /> Batch Timings
                  </h4>
                  {subject.batchTimings.map((batch, batchIndex) => (
                    <div key={batchIndex} className="p-3 border border-gray-200 rounded">
                      <div className="flex justify-between items-center mb-2">
                        <label className="block text-gray-700 font-medium">
                          Batch Name
                        </label>
                        <button
                          type="button"
                          onClick={() => handleRemoveBatch(index, batchIndex)}
                          className="text-red-500 hover:text-red-700 transition"
                        >
                          <FaTrashAlt />
                        </button>
                      </div>
                      <input
                        type="text"
                        className="w-full px-4 py-2 mb-2 border border-gray-300 rounded focus:outline-none focus:border-indigo-500"
                        name="batchName"
                        value={batch.batchName}
                        onChange={(e) => handleBatchTimingChange(index, batchIndex, e)}
                        required
                      />
                      <div className="flex gap-2">
                        <input
                          type="time"
                          className="w-1/2 px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-indigo-500"
                          name="startTime"
                          value={batch.startTime}
                          onChange={(e) => handleBatchTimingChange(index, batchIndex, e)}
                          required
                        />
                        <input
                          type="time"
                          className="w-1/2 px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-indigo-500"
                          name="endTime"
                          value={batch.endTime}
                          onChange={(e) => handleBatchTimingChange(index, batchIndex, e)}
                          required
                        />
                      </div>
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={() => handleAddBatch(index)}
                    className="mt-2 inline-flex items-center gap-1 text-indigo-600 hover:text-indigo-800 font-medium transition"
                  >
                    <FaPlusCircle /> Add Batch
                  </button>
                </div>
              </div>
            ))}
            <button
              type="button"
              onClick={handleAddSubject}
              className="inline-flex items-center gap-1 text-indigo-600 hover:text-indigo-800 font-medium transition"
            >
              <FaPlusCircle /> Add Subject
            </button>
          </div>

          {/* Topics */}
          <div className="space-y-4">
            <h3 className="text-xl font-semibold flex items-center gap-2">
              <FaListAlt className="text-indigo-500" /> Topics
            </h3>
            {topics.map((topic, index) => (
              <div key={index} className="p-4 border border-gray-200 rounded shadow-sm">
                <div className="flex justify-between items-center mb-4">
                  <label className="block text-gray-700 font-medium">
                    Topic Name
                  </label>
                  <button
                    type="button"
                    onClick={() => handleRemoveTopic(index)}
                    className="text-red-500 hover:text-red-700 transition"
                  >
                    <FaTrashAlt />
                  </button>
                </div>
                <input
                  type="text"
                  className="w-full px-4 py-2 mb-2 border border-gray-300 rounded focus:outline-none focus:border-indigo-500"
                  name="topicName"
                  value={topic.topicName}
                  onChange={(e) => handleTopicChange(index, e)}
                  required
                />
                <label className="block text-gray-700 font-medium mb-1">
                  Description
                </label>
                <textarea
                  className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-indigo-500"
                  name="description"
                  value={topic.description}
                  onChange={(e) => handleTopicChange(index, e)}
                  rows={3}
                  required
                />
              </div>
            ))}
            <button
              type="button"
              onClick={handleAddTopic}
              className="inline-flex items-center gap-1 text-indigo-600 hover:text-indigo-800 font-medium transition"
            >
              <FaPlusCircle /> Add Topic
            </button>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-gradient-to-r from-green-500 to-teal-500 text-white py-2 rounded font-semibold mt-4 hover:opacity-90 transition"
          >
            Add Course
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddCourse;
