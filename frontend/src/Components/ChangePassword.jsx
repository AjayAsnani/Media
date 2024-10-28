import { useState } from 'react';
import axios from 'axios';
import { FaLock } from 'react-icons/fa';
import { AiFillEye, AiFillEyeInvisible } from 'react-icons/ai';

const ChangePassword = () => {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const toggleCurrentPasswordVisibility = () => setShowCurrentPassword(!showCurrentPassword);
  const toggleNewPasswordVisibility = () => setShowNewPassword(!showNewPassword);
  const toggleConfirmPasswordVisibility = () => setShowConfirmPassword(!showConfirmPassword);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      setError("New passwords don't match");
      return;
    }

    try {
      const token = localStorage.getItem('authToken');
      if (!token) {
        setError("No token found. Please log in again.");
        return;
      }

      const response = await axios.post(
        'http://localhost:3001/api/change',
        { currentPassword, newPassword },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setSuccess(response.data.message);
      setError('');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (error) {
      setError(error.response?.data?.message || 'An error occurred');
      setSuccess('');
    }
  };

  return (
    <div className="flex justify-center w-full items-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 shadow-all rounded w-full max-w-md">
        <h2 className="text-4xl font-bold text-center mb-10">Change Password</h2>
        
        {error && <p className="text-red-500 text-center mb-4">{error}</p>}
        {success && <p className="text-green-500 text-center mb-4">{success}</p>}

        <form onSubmit={handleSubmit}>

          {/* Current Password */}
          <div className="flex items-center border border-gray-300 rounded mb-4 p-2">
            <FaLock className="text-gray-500 mr-3" />
            <input
              type={showCurrentPassword ? 'text' : 'password'}
              placeholder="Current Password"
              className="w-full outline-none"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              required
            />
            <button
              type="button"
              onClick={toggleCurrentPasswordVisibility}
              className="focus:outline-none"
            >
              {showCurrentPassword ? (
                <AiFillEye className="text-gray-500" />
              ) : (
                <AiFillEyeInvisible className="text-gray-500" />
              )}
            </button>
          </div>

          {/* New Password */}
          <div className="flex items-center border border-gray-300 rounded mb-4 p-2">
            <FaLock className="text-gray-500 mr-3" />
            <input
              type={showNewPassword ? 'text' : 'password'}
              placeholder="New Password"
              className="w-full outline-none"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
            />
            <button
              type="button"
              onClick={toggleNewPasswordVisibility}
              className="focus:outline-none"
            >
              {showNewPassword ? (
                <AiFillEye className="text-gray-500" />
              ) : (
                <AiFillEyeInvisible className="text-gray-500" />
              )}
            </button>
          </div>

          {/* Confirm New Password */}
          <div className="flex items-center border border-gray-300 rounded mb-4 p-2">
            <FaLock className="text-gray-500 mr-3" />
            <input
              type={showConfirmPassword ? 'text' : 'password'}
              placeholder="Confirm New Password"
              className="w-full outline-none"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
            <button
              type="button"
              onClick={toggleConfirmPasswordVisibility}
              className="focus:outline-none"
            >
              {showConfirmPassword ? (
                <AiFillEye className="text-gray-500" />
              ) : (
                <AiFillEyeInvisible className="text-gray-500" />
              )}
            </button>
          </div>

          <button
            type="submit"
            className="w-full bg-blue-500 text-white text-lg py-2 rounded hover:bg-blue-600 transition-colors"
          >
            Change Password
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChangePassword;
