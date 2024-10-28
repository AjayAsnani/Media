import  { useState, useEffect } from 'react';
import axios from 'axios';

import MyAccountProfile from '../Components/MyAccountProfile';

import MyAccountCard from '../Components/MyAccountCard';

import CardGenerator from '../Components/CardGenerator';

const Dashboard = () => {
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
    return <div>Loading...</div>; // Show a loading state while fetching data
  }

  return (
    <div className="flex-grow p-4">
      <h1 className="text-4xl font-bold text-gray-600 text-left mb-8">
        My Account
      </h1>
      <MyAccountProfile />

      <h1 className="text-4xl font-bold text-gray-600 text-left mt-10">
        Dashboard
      </h1>
      <div className="mt-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <MyAccountCard
            number={userData.totalRefers}
            title="Total Referrals"
            description="Rewards and commissions received by now"
            bgColor="bg-green-400"
          />
          {/* <MyAccountCard
            number={userData.paidReferrals || 0} // Assume this field exists
            title="Paid Referrals"
            description="Withdrawn number of referrals until now"
            bgColor="bg-yellow-400"
          />
          <MyAccountCard
            number={userData.unpaidReferrals || 0} // Assume this field exists
            title="Unpaid Referrals"
            description="Which have not been withdrawn yet"
            bgColor="bg-red-400"
          /> */}
          <MyAccountCard
            number={userData.totalPayoutTransactions || 0} // Assume this field exists
            title="Total Payout Transactions"
            bgColor="bg-blue-400"
          />
        {/* </div>

        <div className='flex flex-col md:flex-row md:space-x-2 mt-4'> */}
          <MyAccountCard
            number={`${userData.totalIncome - userData.currentBalance}.00 INR`} // Assume this field exists
            title="Withdrawn Earnings"
            description="Withdrawn earnings by now (total transactions)"
            bgColor="bg-gray-200"
            textColor="text-black"
          />
          <MyAccountCard
            number={`${userData.currentBalance}.00 INR`} // Assume this field exists
            title="Current Account Balance"
            bgColor="bg-gray-400"
          />
        </div>
      </div>

      <div className='w-full flex items-center justify-center'>
        <div className='w-full'>
          <h1 className="text-4xl font-bold text-gray-600 text-left my-10">
            My Card
          </h1>
          <CardGenerator />
        </div>
      </div>
    </div>
  );
}

export default Dashboard;