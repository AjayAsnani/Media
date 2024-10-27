import { useState, useEffect } from 'react';
import axios from 'axios';

const MyAccountProfile = () => {
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      const token = localStorage.getItem('authToken')?.trim(); // Retrieve and trim the token
      
      if (!token) {
        console.log('No token found');
        return; // Optionally redirect to login if no token is found
      }
    
      try {
        const response = await axios.get('http://localhost:3001/api/userdata', {
          headers: {
            'Authorization': `Bearer ${token}`, // Ensure "Bearer " prefix is included
          },
        });
        setUserData(response.data.user); // Set user data from the response
        console.log('User Data:', response.data.user); // For debugging
      } catch (error) {
        console.error('Error fetching user data:', error.response?.data?.message || error.message);
      }
    };
  
    fetchUserData(); // Call the fetchUserData function
  }, []); // Dependency array to run once on component mount
  

  if (!userData) {
    return <div>Loading...</div>; // Show loading indicator until data is fetched
  }

  return (
    <div className="flex items-center justify-center bg-gray-100">
      <div className="bg-white shadow-lg p-6 w-full flex">
        {/* Left Side: Profile Picture and Name */}
        <div className="flex items-center">
          <img
            src="/Photos/Profile.jpeg" // Replace with the correct path for the profile image
            alt="Profile"
            className="rounded-full w-24 h-24 mr-6"
          />
          <div>
            <h1 className="text-[25px] font-bold text-gray-800 uppercase">{userData.firstName} {userData.lastName}</h1>
            <p className="text-gray-500 mt-1">Congratulations! Welcome to our family</p>
            <span className="inline-block mt-2 bg-green-500 text-white px-3 py-1 rounded-full text-sm">
              Member
            </span>
          </div>
        </div>

        {/* Right Side: Referrals, Earnings, and Rank Progress */}
        <div className="ml-auto flex flex-col justify-between">
          {/* Referrals and Earnings */}
          <div className="flex space-x-8">
            <div className="text-center">
              <h2 className="text-gray-600 font-semibold">Referrals</h2>
              <p className="text-2xl font-bold text-gray-800">{userData.referrals || 0}</p>
            </div>
            <div className="text-center">
              <h2 className="text-gray-600 font-semibold">Earnings</h2>
              <p className="text-2xl font-bold text-gray-800">{userData.earnings || '0.00'} INR</p>
            </div>
          </div>

          {/* Rank Progress Bar */}
          <div className="mt-4">
            <p className="text-gray-500 mb-2">Until Senior Sales Officer Rank...</p>
            <div className="w-full bg-gray-300 rounded-full h-2">
              <div className="bg-green-500 h-2 rounded-full" style={{ width: `${userData.rankProgress || 0}%` }}></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyAccountProfile;
