import React, { useState } from 'react';

const AddCourse = () => {
  const [courseName, setCourseName] = useState('');
  const [description, setDescription] = useState('');
  const [subjects, setSubjects] = useState([{ subjectName: '', batchTimings: [{ batchName: '', startTime: '', endTime: '' }] }]);
  const [topics, setTopics] = useState([{ topicName: '', description: '' }]);

  // Handle adding/removing subject
  const handleSubjectChange = (index, event) => {
    const values = [...subjects];
    if (event.target.name === 'subjectName') {
      values[index].subjectName = event.target.value;
    }
    setSubjects(values);
  };

  const handleAddSubject = () => {
    setSubjects([...subjects, { subjectName: '', batchTimings: [{ batchName: '', startTime: '', endTime: '' }] }]);
  };

  const handleRemoveSubject = (index) => {
    const values = [...subjects];
    values.splice(index, 1);
    setSubjects(values);
  };

  // Handle adding/removing batch timing for each subject
  const handleBatchTimingChange = (subjectIndex, batchIndex, event) => {
    const values = [...subjects];
    const batchTimings = [...values[subjectIndex].batchTimings];

    if (event.target.name === 'batchName') {
      batchTimings[batchIndex].batchName = event.target.value;
    } else if (event.target.name === 'startTime') {
      batchTimings[batchIndex].startTime = event.target.value;
    } else if (event.target.name === 'endTime') {
      batchTimings[batchIndex].endTime = event.target.value;
    }

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

  // Handle adding/removing topics
  const handleTopicChange = (index, event) => {
    const values = [...topics];
    if (event.target.name === 'topicName') {
      values[index].topicName = event.target.value;
    } else if (event.target.name === 'description') {
      values[index].description = event.target.value;
    }
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    const courseData = {
      courseName,
      description,
      subjects,
      topics,
    };

    try {
      const response = await fetch('https://kodu-erp.onrender.com/api/courses/add-course', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(courseData),
      });

      const result = await response.json();
      if (response.ok) {
        alert('Course added successfully');
      } else {
        alert(result.message);
      }
    } catch (error) {
      console.error('Error adding course:', error);
      alert('Something went wrong');
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-semibold mb-4">Add New Course</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-gray-700">Course Name</label>
          <input
            type="text"
            className="w-full px-4 py-2 border rounded"
            value={courseName}
            onChange={(e) => setCourseName(e.target.value)}
            required
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700">Description</label>
          <textarea
            className="w-full px-4 py-2 border rounded"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
        </div>

        <div className="mb-4">
          <h3 className="text-xl font-semibold">Subjects</h3>
          {subjects.map((subject, index) => (
            <div key={index} className="mb-4">
              <div className="flex justify-between items-center">
                <label className="block text-gray-700">Subject Name</label>
                <button type="button" onClick={() => handleRemoveSubject(index)} className="text-red-500">Remove Subject</button>
              </div>
              <input
                type="text"
                className="w-full px-4 py-2 border rounded"
                name="subjectName"
                value={subject.subjectName}
                onChange={(e) => handleSubjectChange(index, e)}
                required
              />
              <div className="mt-4">
                <h4 className="text-lg">Batch Timings</h4>
                {subject.batchTimings.map((batch, batchIndex) => (
                  <div key={batchIndex} className="mb-4">
                    <div className="flex justify-between items-center">
                      <label className="block text-gray-700">Batch Name</label>
                      <button type="button" onClick={() => handleRemoveBatch(index, batchIndex)} className="text-red-500">Remove Batch</button>
                    </div>
                    <input
                      type="text"
                      className="w-full px-4 py-2 border rounded"
                      name="batchName"
                      value={batch.batchName}
                      onChange={(e) => handleBatchTimingChange(index, batchIndex, e)}
                      required
                    />
                    <div className="flex">
                      <input
                        type="time"
                        className="w-full px-4 py-2 border rounded"
                        name="startTime"
                        value={batch.startTime}
                        onChange={(e) => handleBatchTimingChange(index, batchIndex, e)}
                        required
                      />
                      <input
                        type="time"
                        className="w-full px-4 py-2 border rounded"
                        name="endTime"
                        value={batch.endTime}
                        onChange={(e) => handleBatchTimingChange(index, batchIndex, e)}
                        required
                      />
                    </div>
                  </div>
                ))}
                <button type="button" onClick={() => handleAddBatch(index)} className="mt-2 text-blue-500">Add Batch</button>
              </div>
            </div>
          ))}
          <button type="button" onClick={handleAddSubject} className="mt-2 text-blue-500">Add Subject</button>
        </div>

        <div className="mb-4">
          <h3 className="text-xl font-semibold">Topics</h3>
          {topics.map((topic, index) => (
            <div key={index} className="mb-4">
              <div className="flex justify-between items-center">
                <label className="block text-gray-700">Topic Name</label>
                <button type="button" onClick={() => handleRemoveTopic(index)} className="text-red-500">Remove Topic</button>
              </div>
              <input
                type="text"
                className="w-full px-4 py-2 border rounded"
                name="topicName"
                value={topic.topicName}
                onChange={(e) => handleTopicChange(index, e)}
                required
              />
              <textarea
                className="w-full px-4 py-2 border rounded mt-2"
                name="description"
                value={topic.description}
                onChange={(e) => handleTopicChange(index, e)}
                required
              />
            </div>
          ))}
          <button type="button" onClick={handleAddTopic} className="mt-2 text-blue-500">Add Topic</button>
        </div>

        <button
          type="submit"
          className="w-full bg-green-600 text-white py-2 rounded mt-4 hover:bg-green-700 transition"
        >
          Add Course
        </button>
      </form>
    </div>
  );
};

export default AddCourse;
