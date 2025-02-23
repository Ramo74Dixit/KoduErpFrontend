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
    fetch(`https://kodu-erp.onrender.com/api/students/student/${userId}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.updatedProfile) {
          setStudent(data.updatedProfile); // Pre-populate the student details
        }
      })
      .catch((error) => {
        console.error('Error fetching student data:', error);
        setError("Error fetching student data.");
      });

    // Fetch available courses
    fetch('https://kodu-erp.onrender.com/api/courses/')
      .then((response) => response.json())
      .then((data) => {
        console.log("Courses API Response:", data); // Log the response for debugging
        const courseOptions = data.map(course => ({
          value: course._id,
          label: course.courseName,
        }));
        setCourses(courseOptions); // Set available courses for the dropdown
      })
      .catch((error) => {
        console.error('Error fetching courses:', error);
        setError("Error fetching courses.");
      });
  }, []); // Runs only once when the component mounts

  // Handle form field changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setStudent((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  // Handle course selection change
  const handleCourseChange = (selectedOptions) => {
    const selectedCourses = selectedOptions ? selectedOptions.map(option => option.value) : [];
    setStudent((prevState) => ({
      ...prevState,
      enrolledCourses: selectedCourses,
    }));
  };

  // Handle form submission to update profile
  const handleSubmit = (e) => {
    e.preventDefault();
  
    // Check if there's any change before sending request
    if (!isDataChanged()) {
      setError("No changes detected!");
      return;
    }
  
    setLoading(true);
    setError('');
  
    const token = localStorage.getItem('token'); // Retrieve the token from localStorage
  
    if (!token) {
      setError("No token found! Please log in.");
      navigate('/login');
      return;
    }
  
    // Decode the token to extract userId
    const decodedToken = JSON.parse(atob(token.split('.')[1]));
    const userId = decodedToken.userId;  // Extract the userId from the decoded token
  
    // Ensure the correct token is being sent
    console.log("Token being sent:", token);  // Log token for debugging
  
    // Send PUT request with token in Authorization header
    fetch('https://kodu-erp.onrender.com/api/students/update-profile', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,  // Send token in Authorization header
      },
      body: JSON.stringify({
        phoneNumber: student.phoneNumber,
        whatsappNumber: student.whatsappNumber,
        parentPhoneNumber: student.parentPhoneNumber,
        enrolledCourses: student.enrolledCourses,
        education: student.education
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log('Profile update response:', data);  // Log the response to see backend reply
  
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
  

  // Check if any data has been changed
  const isDataChanged = () => {
    const { phoneNumber, whatsappNumber, parentPhoneNumber, enrolledCourses, education } = student;
    const originalData = {
      phoneNumber: '',
      whatsappNumber: '',
      parentPhoneNumber: '',
      enrolledCourses: [],
      education: '',
    };

    return (
      phoneNumber !== originalData.phoneNumber ||
      whatsappNumber !== originalData.whatsappNumber ||
      parentPhoneNumber !== originalData.parentPhoneNumber ||
      enrolledCourses !== originalData.enrolledCourses ||
      education !== originalData.education
    );
  };

  return (
    <div className="flex justify-center items-start min-h-screen bg-gray-100 p-6">
      <div className="w-full max-w-4xl bg-white p-8 rounded-xl shadow-lg flex flex-col gap-8">
        <h2 className="text-3xl font-semibold text-center mb-4">Edit Profile</h2>

        {error && <div className="text-red-500 text-center mb-4">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div className="flex justify-between">
              <p className="font-medium text-gray-600">Phone Number:</p>
              <input
                type="text"
                name="phoneNumber"
                value={student.phoneNumber}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-600"
              />
            </div>

            <div className="flex justify-between">
              <p className="font-medium text-gray-600">Whatsapp Number:</p>
              <input
                type="text"
                name="whatsappNumber"
                value={student.whatsappNumber}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-600"
              />
            </div>

            <div className="flex justify-between">
              <p className="font-medium text-gray-600">Parent's Phone Number:</p>
              <input
                type="text"
                name="parentPhoneNumber"
                value={student.parentPhoneNumber}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-600"
              />
            </div>

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

            <div className="flex justify-between">
              <p className="font-medium text-gray-600">Education:</p>
              <input
                type="text"
                name="education"
                value={student.education}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-600"
              />
            </div>
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
