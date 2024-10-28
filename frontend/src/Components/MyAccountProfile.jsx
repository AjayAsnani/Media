import  { useState, useEffect } from 'react';
import axios from 'axios';

const MyAccountProfile = () => {
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (!token) {
      return; // No token, exit early
    }

    const fetchUserData = async () => {
      try {
        const response = await axios.get('http://localhost:3001/api/userdata', {
          headers: {
            Authorization: `Bearer ${token}`, 
          },
        });
        if (response.data) {
          setUserData(response.data.user);
        } else {
          console.error('No user data found');
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    fetchUserData();
  }, []);

  if (!userData) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex items-center justify-center bg-gray-100">
      <div className="bg-white shadow-lg p-6 w-full flex">
        <div className="flex items-center">
          <img
            src={`../uploads/${userData.userImage}`}
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
        <div className="ml-auto flex flex-col justify-between">
          <div className="flex space-x-8">
            <div className="text-center">
              <h2 className="text-gray-600 font-semibold">Referrals</h2>
              <p className="text-2xl font-bold text-gray-800">{userData.totalRefers}</p>
            </div>
            <div className="text-center">
              <h2 className="text-gray-600 font-semibold">Earnings</h2>
              <p className="text-2xl font-bold text-gray-800">{userData.totalIncome}.00 INR</p>
            </div>
          </div>
          <div className="mt-4">
            <p className="text-gray-500 mb-2">Until Senior Sales Officer Rank...</p>
            <div className="w-full bg-gray-300 rounded-full h-2">
              <div className="bg-green-500 h-2 rounded-full" style={{ width: '70%' }}></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyAccountProfile;