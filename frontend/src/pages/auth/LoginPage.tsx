import React from 'react';
import { useAuth } from '../../hooks/auth/useAuth';
import LoginForm from '../../components/auth/LoginForm';
import { useNavigate } from 'react-router-dom';

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { isLoggingIn, loginError } = useAuth();

  const handleSwitchToRegister = () => {
    navigate('/register');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <LoginForm onSwitchToRegister={handleSwitchToRegister} />
        {isLoggingIn && (
          <div className="bg-blue-100 border border-blue-400 text-blue-700 px-4 py-3 rounded relative" role="alert">
            <span className="block sm:inline">Logging in...</span>
          </div>
        )}
        {loginError && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
            <span className="block sm:inline">Login error: {loginError}</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default LoginPage;
