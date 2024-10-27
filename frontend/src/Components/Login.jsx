import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaUser, FaLock } from 'react-icons/fa';
import { AiFillEye, AiFillEyeInvisible } from 'react-icons/ai';
import { Link } from 'react-router-dom';
import '../app.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleLogin = async () => {
    setLoading(true);
    setError('');

    try {
      const response = await fetch('http://localhost:3001/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem('authToken', data.token);
        console.log(data)
        navigate('/accountPage');
      } else {
        setError(data.message || 'Invalid email or password.');
      }
    } catch (error) {
      setError('An error occurred. Please try again later.');
      console.error('Login error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      handleLogin();
    }
  };

  return (
    <div className="flex items-center justify-center min-h-fit pt-20 pb-10">
      <div className="bg-white p-8 shadow-all rounded w-full max-w-md">
        <h1 className="text-4xl font-bold text-center mb-10">LOGIN</h1>

        {/* Email Input */}
        <div className="flex items-center border border-gray-300 rounded mb-4 p-2">
          <FaUser className="text-gray-500 mr-3" />
          <input
            type="email"
            placeholder="Enter Email"
            className="w-full outline-none"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onKeyPress={handleKeyPress}
            disabled={loading}
          />
        </div>

        {/* Password Input */}
        <div className="flex items-center border border-gray-300 rounded mb-4 p-2">
          <FaLock className="text-gray-500 mr-3" />
          <input
            type={showPassword ? 'text' : 'password'}
            placeholder="Enter Password"
            className="w-full outline-none"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyPress={handleKeyPress}
            disabled={loading}
          />
          <button onClick={togglePasswordVisibility} className="focus:outline-none">
            {showPassword ? <AiFillEye className="text-gray-500" /> : <AiFillEyeInvisible className="text-gray-500" />}
          </button>
        </div>

        {error && <p className="text-red-500 text-center mb-4">{error}</p>}

        <div className="text-right mb-4">
          <Link to="/forgotPassword" className="text-blue-500 hover:underline">
            Forgot Password?
          </Link>
        </div>

        <button
          onClick={handleLogin}
          className={`w-full bg-blue-500 text-white text-lg py-2 rounded hover:bg-blue-600 transition-colors ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
          disabled={loading}
        >
          {loading ? 'Logging in...' : 'Login'}
        </button>
      </div>
    </div>
  );
};

export default Login;
