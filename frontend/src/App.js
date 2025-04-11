import React, { useState, useEffect } from 'react';
import { Link, Routes, Route, Navigate } from 'react-router-dom';
import DarkModeToggle from './components/DarkModeToggle';
import Signup from './pages/Signup';
import Login from './pages/Login';
import VerifyOtp from './pages/VerifyOtp';
import Profile from './pages/Profile';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const storedUser = JSON.parse(localStorage.getItem('user'));
    setIsLoggedIn(!!token);
    setUser(storedUser);
  }, []);

  const toggleProfileMenu = () => setProfileMenuOpen(!profileMenuOpen);

  // Protected route component
  const ProtectedRoute = ({ children }) => {
    return isLoggedIn ? children : <Navigate to="/login" />;
  };

  return (
    <div className="dark:bg-darkBackground bg-lightBackground min-h-screen">
      <nav className="p-4 text-white w-full dark:bg-gray-900 bg-blue-600 shadow">
        <div className="container mx-auto flex justify-between items-center">
          <div className="text-xl font-bold">
            <Link to="/">Stock Market</Link>
          </div>

          <div className="flex items-center space-x-4">
            <DarkModeToggle />

            {isLoggedIn ? (
              <div className="relative">
                <button 
                  onClick={toggleProfileMenu} 
                  className="px-3 py-1 rounded-full bg-blue-700 hover:bg-blue-800 font-bold"
                >
                  {user?.name ? user.name[0].toUpperCase() : 'U'}
                </button>
                {profileMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 shadow-lg rounded-md z-50 dark:bg-gray-800 bg-white text-gray-900 dark:text-white">
                    <p className="px-4 py-2 border-b dark:border-gray-700">Hi, {user?.name || 'User'}</p>
                    <Link 
                      to="/profile" 
                      className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700"
                      onClick={() => setProfileMenuOpen(false)}
                    >
                      Edit Profile
                    </Link>
                    <button
                      onClick={() => {
                        localStorage.removeItem('user');
                        localStorage.removeItem('token');
                        setIsLoggedIn(false);
                        setUser(null);
                        setProfileMenuOpen(false);
                      }}
                      className="block px-4 py-2 w-full text-left hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <>
                <Link to="/signup" className="px-4 py-2 rounded bg-white text-gray-900 hover:bg-opacity-90">Sign Up</Link>
                <Link to="/login" className="px-4 py-2 rounded bg-white text-gray-900 hover:bg-opacity-90">Login</Link>
              </>
            )}
          </div>
        </div>
      </nav>

      <Routes>
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login setIsLoggedIn={setIsLoggedIn} setUser={setUser} />} />
        <Route path="/verify-otp" element={<VerifyOtp />} />
        <Route path="/profile" element={
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        } />
        <Route path="/" element={<div className="container mx-auto py-8 px-4 text-center dark:text-white">Dashboard Coming Soon</div>} />
      </Routes>
    </div>
  );
}

export default App;