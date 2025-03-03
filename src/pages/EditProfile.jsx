import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import Select from 'react-select';

// Memoized InputField to prevent unnecessary re-renders
const InputField = React.memo(({ label, name, value, onChange }) => (
  <div className="mb-5">
    <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
    <input
      type="text"
      name={name}
      value={value}
      onChange={onChange}
      className="block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
    />
  </div>
));

const EditProfile = () => {
  const [student, setStudent] = useState({
    phoneNumber: '',
    whatsappNumber: '',
    parentPhoneNumber: '',
    enrolledCourses: [],
    education: '',
  });
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      setError("No token found! Please log in.");
      navigate('/login');
      return;
    }

    // Decode token to get the userId
    const decodedToken = JSON.parse(atob(token.split('.')[1]));
    const userId = decodedToken.userId;

    Promise.all([
      fetch(`https://kodu-erp.onrender.com/api/students/student/${userId}`, {
        method: 'GET',
        headers: { 'Authorization': `Bearer ${token}` },
      }).then((response) => response.json()),
      fetch('https://kodu-erp.onrender.com/api/courses/').then((response) => response.json()),
    ])
      .then(([studentData, courseData]) => {
        if (studentData.updatedProfile) {
          setStudent(studentData.updatedProfile);
        }
        const courseOptions = courseData.map((course) => ({
          value: course._id,
          label: course.courseName,
        }));
        setCourses(courseOptions);
      })
      .catch((error) => {
        console.error('Error:', error);
        setError("Error fetching data.");
      });
  }, [navigate]);

  // useCallback to ensure stable reference for handleChange
  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setStudent((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  }, []);

  const handleCourseChange = (selectedOptions) => {
    const selectedCourses = selectedOptions ? selectedOptions.map((option) => option.value) : [];
    setStudent((prevState) => ({
      ...prevState,
      enrolledCourses: selectedCourses,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!isDataChanged()) {
      setError("No changes detected!");
      return;
    }

    setLoading(true);
    setError('');

    const token = localStorage.getItem('token');

    fetch('https://kodu-erp.onrender.com/api/students/update-profile', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(student),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          navigate('/login'); // Redirect after successful update
        } else {
          setError(data.message || 'Profile update failed');
        }
      })
      .catch((error) => {
        console.error('Error updating profile:', error);
        setError('There was an error updating your profile');
      })
      .finally(() => {
        setLoading(false);
      });
  };

  // For comparison, this function might be refined by storing original data
  const isDataChanged = () => {
    const originalData = {
      phoneNumber: '',
      whatsappNumber: '',
      parentPhoneNumber: '',
      enrolledCourses: [],
      education: '',
    };
    return JSON.stringify(student) !== JSON.stringify(originalData);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-indigo-600 to-purple-600 p-6">
      <div className="bg-white rounded-xl shadow-2xl p-10 max-w-3xl w-full">
        <h2 className="text-4xl font-bold text-center text-gray-800 mb-8">Edit Your Profile</h2>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6 text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <InputField
            label="Phone Number"
            name="phoneNumber"
            value={student.phoneNumber || ''}
            onChange={handleChange}
          />
          <InputField
            label="Whatsapp Number"
            name="whatsappNumber"
            value={student.whatsappNumber || ''}
            onChange={handleChange}
          />
          <InputField
            label="Parent's Phone Number"
            name="parentPhoneNumber"
            value={student.parentPhoneNumber || ''}
            onChange={handleChange}
          />

          <div className="mb-5">
            <label className="block text-sm font-medium text-gray-700 mb-1">Enrolled Courses</label>
            <Select
              isMulti
              name="courses"
              options={courses}
              value={courses.filter((course) => student.enrolledCourses.includes(course.value))}
              onChange={handleCourseChange}
              className="react-select-container"
              classNamePrefix="react-select"
            />
          </div>

          <InputField
            label="Education"
            name="education"
            value={student.education || ''}
            onChange={handleChange}
          />

          <button
            type="submit"
            className="w-full py-3 bg-indigo-600 text-white rounded-lg shadow hover:bg-indigo-700 transition duration-300 font-semibold"
            disabled={loading}
          >
            {loading ? 'Updating Profile...' : 'Update Profile'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default EditProfile;
