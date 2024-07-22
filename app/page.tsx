"use client"
import { useState } from 'react';
import { useAppDispatch } from '@/redux/store';
import { setUser, clearUser } from '@/redux/auth/auth.slice';
import axios from 'axios';
import useAuthSession from '../hooks/useAuthSession';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const HomePage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const dispatch = useAppDispatch();
  const { user, loading } = useAuthSession();

  const handleLogin = async () => {
    if (!username || !password) {
      toast.error('Please fill in all fields.');
      return;
    }

    try {
      const response = await axios.post('/api/auth/login', { username, password });
      const { token } = response.data;
      localStorage.setItem('token', token);
      dispatch(setUser({ username }));
      toast.success('Login successful!');
    } catch (error) {
      console.error('Login failed:', error);
      
      // Type assertion to ensure error has a response property
      if (axios.isAxiosError(error)) {
        if (error.response) {
          toast.error(`Login failed: ${error.response.data.message}`);
        } else if (error.request) {
          toast.error('Login failed: No response from server.');
        } else {
          toast.error(`Login failed: ${error.message}`);
        }
      } else {
        toast.error('Login failed: An unexpected error occurred.');
      }
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    dispatch(clearUser());
    toast.success('Logout successful!');
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md">
        {user ? (
          <div>
            <h2 className="text-xl text-black font-bold">Welcome, {user.username}</h2>
            <button
              onClick={handleLogout}
              className="w-full px-4 py-2 mt-6 font-bold text-white bg-red-500 rounded-md"
            >
              Logout
            </button>
          </div>
        ) : (
          <div>
            <h2 className="text-2xl font-bold text-center">Login</h2>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Username"
              className="w-full px-4 py-2 mt-4 border rounded-md"
            />
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              className="w-full px-4 py-2 mt-4 border rounded-md"
            />
            <button
              onClick={handleLogin}
              className="w-full px-4 py-2 mt-6 font-bold text-white bg-blue-500 rounded-md"
            >
              Login
            </button>
          </div>
        )}
        <div className="mt-6 p-4 border rounded-md text-black bg-gray-50">
          <h3 className="text-lg font-semibold">The hook should be usable like this:</h3>
          <pre className="mt-2 p-2 text-gray-500 bg-gray-100 rounded-md">
            <code>
              {`const { user } = useAuthSession();
if (user) {
  console.log('User:', user.username);
}`}
            </code>
          </pre>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
};

export default HomePage;
