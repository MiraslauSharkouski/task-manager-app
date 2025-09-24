import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const Navbar: React.FC = () => {
  const { state, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <nav className="bg-indigo-600 text-white shadow-lg">
      <div className="container mx-auto px-4 py-3">
        <div className="flex justify-between items-center">
          <div className="text-xl font-bold">
            <Link to="/">Task Manager</Link>
          </div>
          
          <div className="flex items-center space-x-4">
            {state.isAuthenticated ? (
              <>
                <span className="hidden md:inline">
                  Welcome, {state.user?.name}
                </span>
                <Link
                  to="/tasks"
                  className="px-3 py-2 rounded hover:bg-indigo-700 transition-colors"
                >
                  Tasks
                </Link>
                <button
                  onClick={handleLogout}
                  className="px-3 py-2 bg-red-500 rounded hover:bg-red-600 transition-colors"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="px-3 py-2 rounded hover:bg-indigo-700 transition-colors"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="px-3 py-2 bg-white text-indigo-600 rounded hover:bg-gray-100 transition-colors"
                >
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
