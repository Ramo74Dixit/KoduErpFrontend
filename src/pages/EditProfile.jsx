import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Select from 'react-select'; // If you want to use react-select for courses

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
  const navigate = useNavigate();  // Initialize useNavigate for routing

  useEffect(() => {
    const token = localStorage.getItem('token'); // Get the stored token from localStorage

    if (!token) {
      setError("No token found! Please log in.");
      navigate('/login');
      return;
    }

    // Decode token to get the userId
    const decodedToken = JSON.parse(atob(token.split('.')[1]));
    const userId = decodedToken.userId;

    // Fetch current student details
    Promise.all([
      fetch(`https://kodu-erp.onrender.com/api/students/student/${userId}`, {
        method: 'GET',
        headers: { 'Authorization': `Bearer ${token}` },
      }).then(response => response.json()),
      fetch('https://kodu-erp.onrender.com/api/courses/').then(response => response.json())
    ])
    .then(([studentData, courseData]) => {
      if (studentData.updatedProfile) {
        setStudent(studentData.updatedProfile); // Pre-populate the student details
      }
      const courseOptions = courseData.map(course => ({
        value: course._id,
        label: course.courseName,
      }));
      setCourses(courseOptions); // Set available courses for the dropdown
    })
    .catch((error) => {
      console.error('Error:', error);
      setError("Error fetching data.");
    });
  }, []); // Runs only once when the component mounts

  const handleChange = (e) => {
    const { name, value } = e.target;
    setStudent((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleCourseChange = (selectedOptions) => {
    const selectedCourses = selectedOptions ? selectedOptions.map(option => option.value) : [];
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
    const decodedToken = JSON.parse(atob(token.split('.')[1]));
    const userId = decodedToken.userId;

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
        navigate('/login');  // Redirect to login page after successful update
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

  const InputField = ({ label, name, value, onChange }) => (
    <div className="flex justify-between">
      <p className="font-medium text-gray-600">{label}:</p>
      <input
        type="text"
        name={name}
        value={value}
        onChange={onChange}
        className="w-full px-4 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-600"
      />
    </div>
  );

  return (
    <div className="flex justify-center items-start min-h-screen bg-gray-100 p-6">
      <div className="w-full max-w-4xl bg-white p-8 rounded-xl shadow-lg flex flex-col gap-8">
        <h2 className="text-3xl font-semibold text-center mb-4">Edit Profile</h2>

        {error && <div className="text-red-500 text-center mb-4">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <InputField label="Phone Number" name="phoneNumber" value={student.phoneNumber} onChange={handleChange} />
            <InputField label="Whatsapp Number" name="whatsappNumber" value={student.whatsappNumber} onChange={handleChange} />
            <InputField label="Parent's Phone Number" name="parentPhoneNumber" value={student.parentPhoneNumber} onChange={handleChange} />
            
            <div className="flex justify-between">
              <p className="font-medium text-gray-600">Enrolled Courses:</p>
              <Select
                isMulti
                name="courses"
                options={courses}
                value={courses.filter(course => student.enrolledCourses.includes(course.value))}
                onChange={handleCourseChange}
                className="w-full"
              />
            </div>

            <InputField label="Education" name="education" value={student.education} onChange={handleChange} />
          </div>

          <button
            type="submit"
            className="w-full bg-indigo-600 text-white py-2 rounded-full mt-4 hover:bg-indigo-700 transition duration-300"
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
